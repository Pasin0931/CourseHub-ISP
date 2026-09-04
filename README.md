# CourseHub

A platform that centralizes course tasks, announcements, and FAQs to keep lecturers and TAs in sync.

## Prerequisites

- **Python 3.14.2** (must be installed and detectable on your machine)
- **Node.js** with npm (Node version v24.14.0)

---

## Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create and activate a virtual environment

**Windows (PowerShell):** (OR USE YOUR PATH TO PYTHON FILE)
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

**macOS / Linux:** (OR USE YOUR PATH TO PYTHON FILE)
```bash
/usr/bin/python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the backend server

```bash
python -m uvicorn main:app --reload
```

---

## Frontend Setup

### 1. Navigate to the frontend folder

```bash
cd coursehub
```

### 2. Install dependencies

```bash
npm i
```
> Installs project dependencies, including shadcn/ui components.

### 3. Run the frontend

```bash
npm run dev
```

### Checking your venv deps
```bash
pip list
```