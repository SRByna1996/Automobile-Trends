# 🚗 Automobile Prognosticator – Andhra Pradesh Smart Trends Dashboard
### *Vehicle Trends • Traffic Forecast • Pollution Analytics • AP District Insights*
#### Developed by: **Srinivasulu Byna**

---

## 📘 Project Overview

**Automobile Prognosticator** is a full-stack analytical and forecasting platform designed to visualize and predict:
- 🚘 Vehicle Growth Trends  
- 🚦 Traffic Forecasts  
- 🌫 Air Pollution (PM2.5 / PM10) Trends  
- 🗺 District-wise Real-Time Pollution Insights  
- 🎨 Multi-theme UI experience for presentations  

It combines a **Python Flask backend** with a **React.js frontend**, integrates **real API data (OpenAQ)**, and displays beautiful interactive charts using **Recharts** and **Plotly 3D visualization**.

---

# 📂 Complete Folder Structure (Full ZIP Version)

```
automobile_prognosticator_full/
│
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── vehicles.py
│   │   ├── traffic.py
│   │   ├── pollution.py
│   ├── data/
│   │   ├── demo_vehicle_data.json
│   │   ├── demo_pollution_data.json
│   │   └── demo_traffic_data.json
│   └── utils/
│       ├── pollution_api.py
│       └── generators.py
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js (or CRA config)
│   ├── public/
│   │   ├── assets/
│   │   │   ├── prof1.jpg
│   │   │   ├── prof2.jpg
│   │   │   ├── prof3.jpg
│   │   │   ├── banner.jpg
│   │   │   ├── ap_map.svg
│   │   │   └── district_images/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── styles.css
│   │   ├── components/
│   │   │   ├── APMap.jsx
│   │   │   ├── Slideshow.jsx
│   │   │   ├── VehicleTrends.jsx
│   │   │   ├── TrafficForecast.jsx
│   │   │   └── PollutionDetails.jsx
│   │   ├── hooks/
│   │   │   └── useFetch.js
│   │   └── utils/
│   │       ├── constants.js
│   │       └── formatters.js
│
└── README.md
```

---

# 🚀 Installation & Setup (Step-by-Step)

## 1️⃣ Backend Setup (Python + Flask)

### Step 1 — Navigate to backend folder
```bash
cd backend
```

### Step 2 — Create Virtual Environment
**Windows**
```bash
python -m venv venv
venv\Scriptsctivate
```

**Mac/Linux**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 3 — Install Python Dependencies
```bash
pip install -r requirements.txt
```

### Step 4 — Start the Flask Server
```bash
python app.py
```

Backend will start at:

```
http://127.0.0.1:5000
```

---

## 2️⃣ Frontend Setup (React)

### Step 1 — Install Node Dependencies
```bash
cd frontend
npm install
```

### Step 2 — Run React Development Server
```bash
npm start
```

App opens automatically at:

```
http://localhost:3000
```

---

# 🎨 UI Features

### ✔ Modern Home Screen  
Includes slideshow, project info, CTAs, animated themes, responsive layout.

### ✔ Multi-Theme Support  
Themes included:
- 🌈 Rainbow  
- 🔵 Blue  
- ⚫ Dark  
- ⚪ White  

### ✔ District-Based Pollution Viewer  
Clickable Andhra Pradesh map → shows last 5-day AQI for selected district.

### ✔ Animated Page Transitions  
Smooth fade-in/out using `react-transition-group`.

### ✔ Floating Back Button  
Visible on all navigation pages.

---

# 📊 Graphs & Forecasting

### 🚘 Vehicle Trends  
- Stacked bar charts  
- Trendline forecast  
- Category split (Petrol / Diesel / EV)

### 🚦 Traffic Forecast  
- Weekly congestion pattern  
- Peak hour indicators  
- Forecast text summary

### 🌫 Pollution Trends  
- PM2.5 & PM10 (real + fallback data)  
- Line charts  
- API integration with OpenAQ  

### 🧭 3D Graphs
Powered by Plotly:
- 3D scatter  
- 3D surface projections (optional)

---

# 🌐 API Endpoints (Backend)

### Vehicles
```
GET /vehicles/trends
GET /vehicles/forecast
```

### Traffic
```
GET /traffic/today
GET /traffic/forecast
```

### Pollution
```
GET /pollution/districts
GET /pollution/<district_name>
GET /pollution/realtime/<district_name>
```

---

# 🖼 Adding Images

Place images inside:

```
frontend/public/assets/
```

Use in React:

```jsx
<img src="/assets/prof1.jpg" className="side-photo" />
```

---

# 💾 Git Workflow

### Push new updates:
```bash
git add .
git commit -m "Updated UI and features"
git push origin develop
```

### Merge develop → main:
```bash
git checkout main
git merge develop
git push
```

---

# 🏫 Academic Note

This project is submitted as part of **Geethanjali Institute of Science and Technology**.  
It demonstrates:
- Data Science  
- Machine Learning integration readiness  
- API integrations  
- Full-stack development skills  
- Visualization & forecasting  

---

# 👤 Author
**Srinivasulu Byna**  
Email: *srinubyna0@gmail.com*

---

# 📜 License
MIT License (optional)

---

Enjoy using the Automobile Prognosticator dashboard 🚀  
For improvements or feature requests, feel free to update the repo!
