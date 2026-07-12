# TransitOps: Smart Transport Operations Platform

TransitOps is a comprehensive web application designed to manage fleets, drivers, trips, maintenance, and fuel expenses in real-time. It provides actionable insights through data visualizations and robust reporting.

## Features

- **Dashboard**: High-level overview with KPIs (Active Vehicles, Available Vehicles, Fleet Utilization) and charts.
- **Vehicle Registry**: Track vehicle details, max load capacity, odometer readings, and status (Available, On Trip, In Shop, Retired).
- **Driver Management**: Manage driver profiles, license categories, expiry dates, and safety scores.
- **Trip Wizard**: Multi-step trip creation with dynamic validation (cargo weight limits, driver/vehicle availability, license expiry).
- **Maintenance & Fuel Logs**: Record maintenance and fuel expenses. Logging maintenance automatically updates vehicle availability.
- **Reports & Analytics**: Automatic calculation of ROI, Fuel Efficiency (km/L), and Operational Costs. Export data to CSV.

## Tech Stack

- **Frontend**: React (v18), Vite, React Router DOM
- **Styling**: Tailwind CSS, classnames (`clsx`, `tailwind-merge`)
- **UI Components**: Custom components built with Tailwind, Lucide React (icons), Framer Motion (animations)
- **Data Visualization**: Recharts
- **State Management**: React Context (`DataContext`, `ThemeContext`, `AuthContext`)
- **Backend (API)**: FastAPI, Uvicorn, Python (via `backend` directory)

---

## Local Development

### Prerequisites
- Node.js (v16+)
- Python (v3.9+)

### Frontend Setup

The frontend is a modern SPA built with Vite. It features a premium dynamic theme with Dark/Light mode support.

```powershell
cd client
npm install
npm run dev
```
The React development server runs on `http://localhost:5173`. 
*(Note: A mocked data context is currently implemented for UI demonstration if the backend is not connected)*

### Backend Setup

The backend provides RESTful APIs for the platform.

```powershell
.\.venv\Scripts\Activate.ps1
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at `http://127.0.0.1:8000`. 
Interactive Swagger documentation is available at `http://127.0.0.1:8000/docs`.

---

## Project Structure

```text
TransitOps/
├── backend/            # FastAPI Backend
│   ├── app/
│   │   ├── main.py
│   │   └── ...
├── client/             # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI, Forms, Charts, Layouts
│   │   ├── context/    # Global State (Data, Auth, Theme)
│   │   ├── hooks/      # Custom Hooks (useFetch, useDebounce)
│   │   ├── pages/      # Route Components (Dashboard, Vehicles, Trips, etc.)
│   │   ├── services/   # Axios API configurations
│   │   └── ...
│   ├── index.html
│   └── tailwind.config.js
└── README.md
```

## Build for Production

To build the client for production deployment:
```powershell
cd client
npm run build
```
The built static files will be located in the `client/dist/` directory, ready to be served by any static hosting provider.
