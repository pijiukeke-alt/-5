import { create } from "zustand";
import {
  MonitoringTarget,
  EvaluationScore,
  RiskEvent,
  AlertEvent,
  AlertRule,
} from "@/types";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";
import { createConnector } from "@/lib/connectors/factory";
import { evaluateRules } from "@/lib/alert/evaluate-rules";
import { DEFAULT_ALERT_RULES } from "@/lib/alert/rules";

interface FilterState {
  categoryFilter: string | null;
  industryFilter: string | null;
  searchQuery: string;
  sortBy: "total" | "heat" | "risk" | "name";
  sortOrder: "asc" | "desc";
  riskSeverityFilter: string | null;
}

interface DataState {
  targets: MonitoringTarget[];
  scores: EvaluationScore[];
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

interface AlertState {
  alertEvents: AlertEvent[];
  alertRules: AlertRule[];
  unreadCount: number;
}

interface AppStore extends DataState, AlertState {
  // 筛选与排序
  filters: FilterState;

  // 对比分析
  selectedCompareIds: string[];

  // 详情弹窗
  detailTargetId: string | null;

  // data actions
  loadData: () => Promise<void>;
  refreshData: () => Promise<void>;
  setTargets: (targets: MonitoringTarget[]) => void;

  // alert actions
  acknowledgeAlert: (id: string) => void;
  clearAlerts: () => void;

  // filter actions
  setCategoryFilter: (v: string | null) => void;
  setIndustryFilter: (v: string | null) => void;
  setSearchQuery: (v: string) => void;
  setSortBy: (v: FilterState["sortBy"]) => void;
  toggleSortOrder: () => void;
  setRiskSeverityFilter: (v: string | null) => void;
  toggleCompareId: (id: string) => void;
  clearCompareIds: () => void;
  setDetailTargetId: (id: string | null) => void;
  resetFilters: () => void;

  // 派生数据
  getFilteredTargets: () => MonitoringTarget[];
  getFilteredRiskEvents: () => (RiskEvent & { targetName: string })[];
}

const defaultFilters: FilterState = {
  categoryFilter: null,
  industryFilter: null,
  searchQuery: "",
  sortBy: "total",
  sortOrder: "desc",
  riskSeverityFilter: null,
};

function computeScores(targets: MonitoringTarget[]): EvaluationScore[] {
  return targets.map((t) => calculateEvaluationScore(t));
}

function recomputeAlerts(
  targets: MonitoringTarget[],
  rules: AlertRule[]
): AlertEvent[] {
  return evaluateRules(targets, rules);
}

export const useAppStore = create<AppStore>((set, get) => ({
  // data state
  targets: [],
  scores: [],
  loading: false,
  error: null,
  initialized: false,

  // alert state
  alertEvents: [],
  alertRules: [...DEFAULT_ALERT_RULES],
  unreadCount: 0,

  filters: { ...defaultFilters },
  selectedCompareIds: [],
  detailTargetId: null,

  loadData: async () => {
    set({ loading: true, error: null });
    try {
      const connector = createConnector<MonitoringTarget[]>();
      const targets = await connector.fetch({});
      const scores = computeScores(targets);
      const alertEvents = recomputeAlerts(targets, get().alertRules);
      set({
        targets,
        scores,
        alertEvents,
        unreadCount: alertEvents.filter((e) => !e.acknowledged).length,
        loading: false,
        initialized: true,
        error: null,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "数据加载失败";
      set({ loading: false, error: message, initialized: true });
    }
  },

  refreshData: async () => {
    try {
      const connector = createConnector<MonitoringTarget[]>();
      const targets = await connector.fetch({});
      const scores = computeScores(targets);
      const alertEvents = recomputeAlerts(targets, get().alertRules);
      set({
        targets,
        scores,
        alertEvents,
        unreadCount: alertEvents.filter((e) => !e.acknowledged).length,
      });
    } catch {
      // 静默失败，保留旧数据
    }
  },

  setTargets: (targets) => {
    const scores = computeScores(targets);
    const alertEvents = recomputeAlerts(targets, get().alertRules);
    set({ targets, scores, alertEvents, unreadCount: alertEvents.filter((e) => !e.acknowledged).length });
  },

  acknowledgeAlert: (id) =>
    set((s) => {
      const events = s.alertEvents.map((e) =>
        e.id === id ? { ...e, acknowledged: true } : e
      );
      return {
        alertEvents: events,
        unreadCount: events.filter((e) => !e.acknowledged).length,
      };
    }),

  clearAlerts: () => set({ alertEvents: [], unreadCount: 0 }),

  setCategoryFilter: (v) =>
    set((s) => ({ filters: { ...s.filters, categoryFilter: v } })),

  setIndustryFilter: (v) =>
    set((s) => ({ filters: { ...s.filters, industryFilter: v } })),

  setSearchQuery: (v) =>
    set((s) => ({ filters: { ...s.filters, searchQuery: v } })),

  setSortBy: (v) =>
    set((s) => ({ filters: { ...s.filters, sortBy: v } })),

  toggleSortOrder: () =>
    set((s) => ({
      filters: {
        ...s.filters,
        sortOrder: s.filters.sortOrder === "asc" ? "desc" : "asc",
      },
    })),

  setRiskSeverityFilter: (v) =>
    set((s) => ({ filters: { ...s.filters, riskSeverityFilter: v } })),

  toggleCompareId: (id) =>
    set((s) => {
      if (s.selectedCompareIds.includes(id)) {
        return {
          selectedCompareIds: s.selectedCompareIds.filter((x) => x !== id),
        };
      }
      if (s.selectedCompareIds.length >= 4) return s;
      return { selectedCompareIds: [...s.selectedCompareIds, id] };
    }),

  clearCompareIds: () => set({ selectedCompareIds: [] }),

  setDetailTargetId: (id) => set({ detailTargetId: id }),

  resetFilters: () => set({ filters: { ...defaultFilters } }),

  getFilteredTargets: () => {
    const state = get();
    let result = [...state.targets];

    if (state.filters.categoryFilter) {
      result = result.filter(
        (t) => t.category === state.filters.categoryFilter
      );
    }

    if (state.filters.industryFilter) {
      result = result.filter(
        (t) => t.industry === state.filters.industryFilter
      );
    }

    if (state.filters.searchQuery.trim()) {
      const q = state.filters.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    const { sortBy, sortOrder } = state.filters;
    const multiplier = sortOrder === "asc" ? 1 : -1;

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name) * multiplier;
      }
      if (sortBy === "heat") {
        return (a.social.heatScore - b.social.heatScore) * multiplier;
      }
      if (sortBy === "risk") {
        const scoreA = calculateEvaluationScore(a);
        const scoreB = calculateEvaluationScore(b);
        return (scoreA.dimensions.risk - scoreB.dimensions.risk) * multiplier;
      }
      const scoreA = calculateEvaluationScore(a);
      const scoreB = calculateEvaluationScore(b);
      return (scoreA.total - scoreB.total) * multiplier;
    });

    return result;
  },

  getFilteredRiskEvents: () => {
    const state = get();
    let events = state.targets.flatMap((t) =>
      t.riskEvents.map((e) => ({ ...e, targetName: t.name }))
    );

    if (state.filters.riskSeverityFilter) {
      events = events.filter(
        (e) => e.severity === state.filters.riskSeverityFilter
      );
    }

    events.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return events;
  },
}));
