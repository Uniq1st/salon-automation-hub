@echo off
REM Quick start script for Windows users

echo.
echo Setting up Salon Automation Hub...
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Node.js is not installed. Please install from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%A in ('node --version') do set NODE_VERSION=%%A
echo Node.js %NODE_VERSION% installed

REM Install dependencies
echo.
echo Installing dependencies...
call npm install

if errorlevel 1 (
    echo Installation failed
    pause
    exit /b 1
)

echo Dependencies installed

REM Setup environment
echo.
echo Setting up environment variables...
if not exist .env (
    copy .env.example .env
    echo Created .env file
    echo.
    echo IMPORTANT: Edit .env with your API credentials:
    echo - ANTHROPIC_API_KEY
    echo - SQUARE_ACCESS_TOKEN
    echo - GMAIL_CLIENT_ID
    echo See docs/API_KEYS.md for detailed setup instructions
) else (
    echo .env file already exists
)

REM Build info
echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Configure your API keys in .env
echo 2. Run 'npm run dev' to start development servers
echo 3. Open http://localhost:5173 in your browser
echo 4. Read docs/SETUP.md for detailed instructions
echo.
echo Useful commands:
echo npm run dev       - Start dev servers
echo npm test          - Run tests
echo npm run build     - Build for production
echo npm run lint      - Check code style
echo.
pause
