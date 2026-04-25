Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd /c cd /d ""C:\Users\Administrator\Desktop\舆情监测-3"" && start \"\" http://localhost:3456 && node server.js", 0, False
