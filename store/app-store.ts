import { create } from "zustand";
import {
  MonitoringTarget,
  EvaluationScore,
  RiskEvent,
} from "@/types";
import {
  getAllTargets,
  getAllScores,
} from "@/lib/evaluation/api";
import { calculateEvaluationScore } from "@/lib/evaluation/scoring";

interface FilterState {
  categoryFilter: string | null;
  industryFilter: string | null;
  searchQuery: string;
  sortBy: "total" | "heat" | "risk" | "name";
  sortOrder: "asc" | "desc";
  riskSeverityFilter: string | null;
}

interface AppStore {
  // 数据
  targets: MonitoringTarget[];
  scores: EvaluationScore[];

  // 筛选与排序
  filters: FilterState;

  // 对比分析
  selectedCompareIds: string[];

  // 详情弹窗
  detailTargetId: string | null;

  // actions
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

export const useAppStore = create<AppStore>((set, get) => {
  const targets = getAllTargets();
  const scores = getAllScores();

  return {
    targets,
    scores,
    filters: { ...defaultFilters },
    selectedCompareIds: [],
    detailTargetId: null,

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

      // category filter
      if (state.filters.categoryFilter) {
        result = result.filter(
          (t) => t.category === state.filters.categoryFilter
        );
      }

      // industry filter
      if (state.filters.industryFilter) {
        result = result.filter(
          (t) => t.industry === state.filters.industryFilter
        );
      }

      // search
      if (state.filters.searchQuery.trim()) {
        const q = state.filters.searchQuery.toLowerCase();
        result = result.filter(
          (t) =>
            t.name.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q)
        );
      }

      // sort
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
        // total
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

      // 默认按日期降序
      events.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      return events;
    },
  };
});
