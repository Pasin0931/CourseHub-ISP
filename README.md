## SETYP BACKEND .VENV

You need to have python version 3.14.2 inside your machine, and it must able to be detected, then cd into /backend

**Windows (PowerShell):**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```
**macOS / Linux:**
```bash
/usr/bin/python3 -m venv venv
source venv/bin/activate
```

## Install dependencies
```bash
pip install -r requirements.txt
```

## HOW TO RUN
# Frontend
cd into coursehub (frontend) file then enter
```bash
npm i  # dependencies/shadcn ui installation
```
then
```bash
npm run dev  # run frontend file
```

# Backend
cd into /backend then
```bash
uvicorn main:app --reload
```