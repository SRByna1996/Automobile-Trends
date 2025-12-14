# Automobile Prognosticator 🚗📊🌏

**Automobile Prognosticator** is a smart forecasting platform designed for  
**Andhra Pradesh district-level analytics**.  
It predicts and visualizes:

- **Vehicle Growth Trends**
- **Traffic Congestion Forecasting**
- **Air Pollution (PM2.5 / PM10) Monitoring & Historical Analysis**

This project combines **Data Science**, **Machine Learning**, **REST APIs**,  
and **interactive frontend visualizations** to deliver a clean, responsive forecasting dashboard.

---

## 🌟 Key Features

### 🚘 Vehicle Trends
- Year-wise growth patterns for Petrol, Diesel, Hybrid, and EV vehicles  
- Trendlines, density analysis, and multi-year forecasts  
- 3D visualization support for advanced analysis

### 🚦 Traffic Forecast
- Congestion predictions (Mon–Fri)  
- Graphs generated from ML-backed models  
- Useful for city planning, peak-hour estimation, and route optimization

### 🌫 Pollution Forecast & District Insights
- PM2.5 and PM10 visualizations  
- Real-time data (OpenAQ API) + fallback ML-generated demo data  
- Clickable Andhra Pradesh district map  
- Last 5 days pollution stats for each district

### 🎨 UI/UX
- Animated theme switching (Rainbow, Blue, Dark, White)  
- Smooth page transitions  
- Fade slideshow for professors/mentors  
- Floating back button with navigation history  
- Fully responsive layout

---

## 🛠 Tech Stack

### Frontend
- **React.js**
- **Recharts** (graphs)
- **Plotly.js** (3D charts)
- **React Transition Group** (animations)
- **CSS Variables & Theming**

### Backend
- **Python Flask API**
- Vehicle / traffic / pollution routes  
- OpenAQ external API integration  
- ML-ready structure for future model deployments  

### Data Sources
- OpenAQ (public API)  
- Synthetic ML data for demo fallback  
- Historical datasets (expandable)

---

## 📂 Project Structure

frontend/
src/
App.jsx
styles.css
components/
APMap.jsx
Slideshow.jsx
public/
assets/
prof1.jpg
prof2.jpg
prof3.jpg
banner.jpg

backend/
app.py
routes/
vehicle.py
traffic.py
pollution.py



---

## 🚀 Getting Started

### 1. Install frontend dependencies
```bash
cd frontend
npm install
npm start


cd backend
python app.py
