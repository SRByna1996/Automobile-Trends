🚗 Automobile Prognosticator – Andhra Pradesh Smart Trends Dashboard
Vehicle Trends • Traffic Forecast • Pollution Analytics
Developed by: Srinivasulu Byna
📘 Project Overview

Automobile Prognosticator is a full-stack smart forecasting platform that provides Andhra Pradesh–based insights on:

🚘 Vehicle Registration Trends

🚦 Traffic Congestion Forecasts

🌫 Air Pollution (PM2.5 / PM10) Monitoring

🗺 District-wise Pollution Trends via AP Map

🎨 Animated Multi-Theme UI (Rainbow, Dark, Blue, White)

It uses Python + Flask backend, React.js frontend, Interactive charts, OpenAQ real-time data, and ML-ready architecture for future predictions.

This project is designed for academic showcase, GitHub submission, and real analytical use.

🔧 Tech Stack
Frontend

React.js (Vite or CRA)

CSS3 + Custom Themes

Recharts (Charts)

Plotly.js (3D Graphs)

React Transition Group (Page Animations)

Backend

Python 3.x

Flask (REST API)

CORS support

Synthetic ML-ready data generators

Real-time API integration (OpenAQ)

Public Data Sources

OpenAQ – Real-time PM2.5 / PM10 air quality

Government of India Open Data (optional future expansion)

📦 Folder Structure
automobile_prognosticator_full/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   │   ├── vehicles.py
│   │   ├── traffic.py
│   │   ├── pollution.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   ├── assets/
│   │   │   ├── prof1.jpg
│   │   │   ├── prof2.jpg
│   │   │   ├── banner.jpg
│   │   │   └── ap_map.svg
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx
│   │   ├── styles.css
│   │   └── components/
│   │       ├── APMap.jsx
│   │       └── Slideshow.jsx
│   ├── package.json
│   └── vite.config.js (if Vite)
│
└── README.md
🚀 SETUP GUIDE — Step-by-Step (Full Local Setup)
1️⃣ Backend Setup (Python + Flask)
Step 1: Navigate to backend folder
cd backend

Step 2: Create Virtual Environment

Windows:

python -m venv venv
venv\Scripts\activate


Mac/Linux:

python3 -m venv venv
source venv/bin/activate

Step 3: Install dependencies
pip install -r requirements.txt

Step 4: Run Flask Server
python app.py


You should see something like:

Running on http://127.0.0.1:5000


✔ Backend is now running.

2️⃣ Frontend Setup (React)
Step 1: Open new terminal
cd frontend

Step 2: Install Node modules
npm install

Step 3: Start development server
npm start


Or for Vite:

npm run dev


You will see:

http://localhost:3000/


✔ Frontend is now running.

🎨 Application Features – Detailed
🚘 Vehicle Trends & Details

Year-wise graph

Petrol vs Diesel vs Electric comparison

3D visualization for deeper analytics

Explanation text below charts

Back navigation to return to home

🚦 Traffic Forecast & Details

AI-style forecast curve

Grid overview of peak/non-peak hours

Use-case explanation for AP cities

Return/back button support

🌫 Pollution Forecast & District Insights

Real-time PM2.5 / PM10 using OpenAQ API

Fallback synthetic data when unavailable

Clickable Andhra Pradesh district map

Last 5 days pollution history

Graph + explanation + AQI meaning

🖼 Home Screen Features

Left: Project introduction

Right: Fade slideshow of professors

Clean Call-To-Action buttons:

Vehicle Trends & Details

Traffic Forecast & Details

Pollution Forecast & Details

Scrolling marquee text

Animated themes

Sticky global back button

🎨 Themes Included
✔ Rainbow

Header = Rainbow
Body = Solid light color

✔ Dark

Deep navy background, neon glow

✔ Blue

Tech-style gradient

✔ White

Minimal clean professional look

🧪 API Endpoints (Backend)
🚘 Vehicles
GET /vehicles/trends
GET /vehicles/forecast

🚦 Traffic
GET /traffic/today
GET /traffic/forecast

🌫 Pollution
GET /pollution/districts
GET /pollution/<district>
GET /pollution/realtime/<district>

💾 Add Photos to Project

Place all JPG files inside:

frontend/public/assets/


Use them in React:

<img src="/assets/prof1.jpg" className="side-photo" />

🧭 Deploying Frontend (Optional)

Netlify

Vercel

GitHub Pages

🧭 Deploying Backend (Optional)

Render.com

Railway.app

AWS / Azure / GCP

📝 Git Branch Strategy
main → stable version
develop → new updates
feature/* → small enhancements


Push changes:

git checkout develop
git add .
git commit -m "Update UI and charts"
git push origin develop

📸 Screenshots (Add later in GitHub)
![Home Screen](screenshots/home.png)
![Vehicle Trends](screenshots/vehicle_trends.png)
![Traffic Forecast](screenshots/traffic.png)
![Pollution Map](screenshots/pollution.png)

🏫 Academic Note

This project is developed for:

Geethanjali Institute of Science & Technology (GIST)
Final Year Project – Data Science / AI / ML Integration

📜 License

MIT License (optional)

✨ Author

Srinivasulu Byna
