@echo off
chcp 65001 >nul
setlocal

cd /d "%~dp0"

if not exist "node_modules" (
    echo [build] Chua co node_modules, dang chay npm install...
    call npm install
    if errorlevel 1 (
        echo [build] npm install that bai.
        pause
        exit /b 1
    )
)

echo [build] Dang build du an vao dist\ ...
call npm run build
if errorlevel 1 (
    echo [build] Build that bai.
    pause
    exit /b 1
)

echo.
echo [build] Build thanh cong! Ket qua nam trong thu muc dist\
echo [build] Push code len git nhu binh thuong, Vercel se tu chay "npm run build" khi deploy.
pause
endlocal
