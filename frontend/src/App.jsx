import React, { useEffect, useState, useRef } from "react";

import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  BarChart, Bar, ResponsiveContainer
} from "recharts";

/* AP districts sample */
const AP_DISTRICTS = [
  "Anantapur","Chittoor","East Godavari","Guntur","Kadapa","Krishna","Kurnool","Prakasam",
  "SPSR Nellore","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari"
];

/* deterministic demo generator for district pollution (today + last 5 days) */
function seededRandom(seed) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 16777619) >>> 0;
  return function () {
    h += 0x6D2B79F5; h = Math.imul(h ^ (h >>> 15), h | 1) >>> 0;
    let t = (h ^ (h + Math.imul(h ^ (h >>> 7), h | 61))) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function generateDistrictPollution(districtName) {
  const rnd = seededRandom(districtName);
  const arr = [];
  for (let d = 0; d < 6; d++) {
    const base = 30 + Math.floor(rnd() * 70);
    const pm25 = Math.max(5, Math.round(base + (rnd() - 0.5) * 20));
    const pm10 = Math.max(pm25 + 5, Math.round(pm25 + 10 + (rnd() - 0.5) * 30));
    const date = new Date();
    date.setDate(date.getDate() - d);
    arr.push({ date: date.toISOString().slice(0, 10), pm25, pm10 });
  }
  return arr;
}

export default function App() {
  // page state
  const [route, setRoute] = useState("home"); // home|vehicles|traffic|pollution
  const [mode, setMode] = useState("explore"); // 'explore' (graphs+info) or 'view' (text-only)
  const [theme, setTheme] = useState(() => (typeof window !== "undefined" && localStorage.getItem("ap_theme")) || "rainbow");

  // data
  const [vehicleData, setVehicleData] = useState(null);
  const [trafficData, setTrafficData] = useState(null);
  const [pollutionData, setPollutionData] = useState(null);

  // UI toggles & selected district
  const [infoVisible, setInfoVisible] = useState(false);
  const [showCompleteInfo, setShowCompleteInfo] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedDistrictData, setSelectedDistrictData] = useState(null);

  // history stack for back navigation (array of state snapshots)
  const [history, setHistory] = useState([]); // each entry: { route, mode, infoVisible, showCompleteInfo, selectedDistrict, selectedDistrictData }

  // carousel for Home
  const profs = [
    { src: "/assets/sam123.jpg", name: "Dr. K. Srinivasa Rao", title: "Professor, Dept. of CS", brief: "Lead mentor for ML/time-series & smart-city analytics." },
    { src: "/assets/prof2.jpg", name: "Prof. L. Ramakrishna", title: "Head, Mechanical Engg.", brief: "Vehicle dynamics & traffic modelling advisor." },
    { src: "/assets/prof3.jpg", name: "Dr. P. Savitri", title: "Associate Prof., Environmental Science", brief: "Air quality & health impacts specialist." }
  ];
  const [currentIdx, setCurrentIdx] = useState(0);
  const carouselRef = useRef({ paused: false, timer: null });

  /* persist theme */
  useEffect(() => { try { localStorage.setItem("ap_theme", theme); } catch(e) {} }, [theme]);

  /* initial data + start carousel */
  useEffect(() => {
    fetchVehicle(); fetchTraffic(); fetchPollution();
    startCarousel();
    return stopCarousel;
    // eslint-disable-next-line
  }, []);

  /* carousel */
  function startCarousel() { stopCarousel(); carouselRef.current.timer = setInterval(() => { if (!carouselRef.current.paused) setCurrentIdx(i => (i + 1) % profs.length); }, 3500); }
  function stopCarousel() { if (carouselRef.current.timer) { clearInterval(carouselRef.current.timer); carouselRef.current.timer = null; } }
  function handleCarouselMouseEnter(){ carouselRef.current.paused = true; }
  function handleCarouselMouseLeave(){ carouselRef.current.paused = false; }

  /* data fetchers with fallback demo data */
  async function fetchVehicle() {
    try {
      const res = await fetch("http://localhost:5000/api/vehicle-trends");
      const json = await res.json();
      if (json && json.years) {
        setVehicleData(json.years.map((y,i)=>({ year:y, petrol: json.petrol?.[i] ?? 0, diesel: json.diesel?.[i] ?? 0, hybrid: json.hybrid?.[i] ?? 0, ev: json.ev?.[i] ?? 0 })));
        return;
      }
    } catch(e) {}
    setVehicleData([{ year: "2021", petrol: 480, diesel: 520, hybrid: 90, ev: 35 }, { year: "2022", petrol: 500, diesel: 510, hybrid: 120, ev: 60 }, { year: "2023", petrol: 520, diesel: 490, hybrid: 160, ev: 120 }, { year: "2024", petrol: 540, diesel: 460, hybrid: 210, ev: 220 }]);
  }

  async function fetchTraffic() {
    try {
      const res = await fetch("http://localhost:5000/api/traffic-forecast");
      const json = await res.json();
      if (json && json.days) {
        setTrafficData(json.days.map((d,i)=>({ day:d, congestion: json.congestion_index?.[i] ?? 0 })));
        return;
      }
    } catch(e) {}
    setTrafficData([{day:"Mon",congestion:60},{day:"Tue",congestion:55},{day:"Wed",congestion:70},{day:"Thu",congestion:65},{day:"Fri",congestion:78}]);
  }

  async function fetchPollution() {
    try {
      const res = await fetch("http://localhost:5000/api/pollution-forecast");
      const json = await res.json();
      if (json && json.days) {
        setPollutionData(json.days.map((d,i)=>({ day:d, pm25: json.pm25?.[i] ?? 0, pm10: json.pm10?.[i] ?? 0 })));
        return;
      }
    } catch(e) {}
    setPollutionData([{day:"Mon",pm25:45,pm10:70},{day:"Tue",pm25:50,pm10:80},{day:"Wed",pm25:65,pm10:95},{day:"Thu",pm25:55,pm10:78},{day:"Fri",pm25:60,pm10:85}]);
  }

  /* --- HISTORY & NAVIGATION helpers --- */

  // push current state onto history then navigate to new
  function navigateTo(nextRoute, nextMode = "view") {
    // push snapshot of current state
    setHistory(h => {
      const snapshot = {
        route, mode, infoVisible, showCompleteInfo, selectedDistrict, selectedDistrictData
      };
      return [...h, snapshot];
    });

    // apply next state
    setRoute(nextRoute);
    setMode(nextMode);
    setInfoVisible(nextMode === "explore");
    setShowCompleteInfo(false);
    setSelectedDistrict(null);
    setSelectedDistrictData(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // go back to previous state if exists
  function handleBack() {
    setHistory(h => {
      if (!h || h.length === 0) {
        // nothing to pop: go to home default
        setRoute("home");
        setMode("explore");
        setInfoVisible(false);
        setShowCompleteInfo(false);
        setSelectedDistrict(null);
        setSelectedDistrictData(null);
        return [];
      }
      const newHistory = [...h];
      const last = newHistory.pop();
      // restore
      setRoute(last.route ?? "home");
      setMode(last.mode ?? "explore");
      setInfoVisible(last.infoVisible ?? false);
      setShowCompleteInfo(last.showCompleteInfo ?? false);
      setSelectedDistrict(last.selectedDistrict ?? null);
      setSelectedDistrictData(last.selectedDistrictData ?? null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return newHistory;
    });
  }

  // convenience wrappers used previously: headerGoto / homeCTA / onSelectDistrict
  function headerGoto(page) { navigateTo(page, "view"); }
  function homeCTA(page) { navigateTo(page, "explore"); }

  function onSelectDistrict(d) {
    // push current state and then set district as current
    setHistory(h => {
      const snapshot = { route, mode, infoVisible, showCompleteInfo, selectedDistrict, selectedDistrictData };
      return [...h, snapshot];
    });

    setSelectedDistrict(d);
    const stats = generateDistrictPollution(d);
    setSelectedDistrictData(stats);
    setInfoVisible(true);
    setShowCompleteInfo(false);
    setMode("explore"); // remain explore so charts/info show in pollution page
    setRoute("pollution");
    setTimeout(()=> window.scrollTo({ top: 300, behavior: "smooth" }), 150);
  }

  /* Helper to render view-mode paragraphs */
  function renderViewText(topic) {
    if (topic === "vehicles") {
      return (
        <>
          <h3>Vehicle Trends — Overview</h3>
          <p>Vehicle trends show the evolution of the vehicle fleet over time across districts — this informs road capacity, parking, and emissions planning.</p>
          <p>Data sources include historical vehicle registrations, census/demographic growth, and economic indicators which help project future fleet sizes.</p>
          <p>Models combine statistical trend extrapolation and regressions using macro features; scenario curves (like EV adoption) are used for policy impact analysis.</p>
          <p>Use-cases: long-term infrastructure planning, EV charger placement strategy, and estimating future fuel demand and emissions.</p>
          <p>Export options: per-district CSV/JSON via the API for planners and analysts.</p>
        </>
      );
    }
    if (topic === "traffic") {
      return (
        <>
          <h3>Traffic Forecast — Overview</h3>
          <p>Traffic forecasts estimate congestion levels on short horizons (hourly/daily) using historical congestion indices and event calendars.</p>
          <p>Input features include vehicle density proxies, weather, special events, and road capacity. Corridor-specific routing improves localized accuracy.</p>
          <p>Outputs include congestion indices, delay estimates and scenario comparisons (e.g., impact of lane changes or restrictions).</p>
          <p>Use-cases: traffic management, event planning, emergency routing and evaluating interventions like bus lanes.</p>
          <p>Data refreshes from live feeds where available; offline runs generate daily forecasts where sensors are sparse.</p>
        </>
      );
    }
    if (topic === "pollution") {
      return (
        <>
          <h3>Pollution Trends — Overview</h3>
          <p>Pollution trends (PM2.5 & PM10) provide daily exposure estimates and short-term forecasts used for health advisories and mitigation planning.</p>
          <p>We combine ground station measurements (OpenAQ/state sensors), meteorological data (wind, temperature, humidity), satellite proxies and local emission factors to estimate locality exposure.</p>
          <p>Models typically fuse sensors and use physics-aware ML to account for meteorology and pollutant transport; outputs include per-district daily estimates and alerts for threshold breaches.</p>
          <p>Use-cases: public health warnings, targeted interventions (traffic restrictions, industry checks) and policy assessment over time.</p>
          <p>Click any district to view sample today + last 5 days PM2.5/PM10 readings (demo values if no API available).</p>
        </>
      );
    }
    return <p>No content available.</p>;
  }

  const currentProf = profs[currentIdx];

  return (
    <div className={`app theme-${theme}`}>
      {/* HEADER with Back arrow showing when history not empty */}
      <header className="header" role="banner">
        <div className="header-left" style={{ display: "flex", alignItems: "center" }}>
          {history.length > 0 ? (
            <button className="back-btn" onClick={handleBack} aria-label="Back to previous screen">←</button>
          ) : null}
          <div className="brand">Automobile Prognosticator</div>
        </div>

        <div className="header-right">
          <nav className="nav" aria-label="Main navigation">
            <button onClick={() => headerGoto("home")} className={route === 'home' ? 'active' : ''}>Home</button>
            <button onClick={() => headerGoto("vehicles")} className={route === 'vehicles' ? 'active' : ''}>Vehicle Trends</button>
            <button onClick={() => headerGoto("traffic")} className={route === 'traffic' ? 'active' : ''}>Traffic Forecast</button>
            <button onClick={() => headerGoto("pollution")} className={route === 'pollution' ? 'active' : ''}>Pollution Forecast</button>
          </nav>

          <select className="theme-switcher" value={theme} onChange={(e) => setTheme(e.target.value)} aria-label="Theme">
            <option value="rainbow">Rainbow</option>
            <option value="dark">Dark</option>
            <option value="blue">Blue</option>
            <option value="white">White</option>
          </select>
        </div>
      </header>

      <main className="container" role="main">
        {/* HOME */}
        {route === 'home' && (
          <>
            <div className="main-marquee-wrap">
              <div className="main-marquee"><p> •🚗Geethanjali Institute of Science And Technology Presents Automobile Prognosticator🚙•</p></div>
            </div>

            <section className="card card-hero" aria-labelledby="home-title">
              <div className="hero-left">
                <h1 id="home-title">Automobile Prognosticator</h1>
                <p className="lead">District-level forecasting platform for Andhra Pradesh — vehicles, traffic, and air quality.</p>

                <div className="cta-row" style={{ marginTop: 12 }}>
                  <button className="btn primary" onClick={() => homeCTA('vehicles')}>Vehicle Trends & Details</button>
                  <button className="btn primary" onClick={() => homeCTA('traffic')}>Traffic Forecast & Details</button>
                  <button className="btn primary" onClick={() => homeCTA('pollution')}>Pollution Forecast & Details</button>
                </div>

                <div style={{ marginTop: 12, color: '#334155' }}>
                  Data basis: OpenAQ, OpenWeatherMap, AP Govt datasets, vehicle registration history & municipal sensors.
                </div>
              </div>

              <aside className="hero-right right-panel" onMouseEnter={handleCarouselMouseEnter} onMouseLeave={handleCarouselMouseLeave}>
                <div className="side-image-wrap"><img className="side-photo" src={currentProf.src} alt={currentProf.name} /></div>
                <div className="dots-row">
                  {profs.map((p,i)=>(<button key={i} className={`dot ${i===currentIdx ? 'active' : ''}`} onClick={()=> setCurrentIdx(i)} aria-label={`Select ${p.name}`} />))}
                </div>
                <div className="sir-card">
                  <div className="sir-name">{currentProf.name}</div>
                  <div className="sir-title">{currentProf.title}</div>
                  <p className="sir-brief">{currentProf.brief}</p>
                </div>
              </aside>
            </section>
          </>
        )}

        {/* VEHICLES */}
        {route === 'vehicles' && (
          <section className="card" aria-label="Vehicle content">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Vehicle Trends {mode === 'view' ? '(Overview)' : ''}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {mode === 'explore' && (<><button className="btn ghost" onClick={() => setInfoVisible(v => !v)}>{infoVisible ? 'Hide Info' : 'Info'}</button><button className="btn primary" onClick={() => setShowCompleteInfo(s => !s)}>{showCompleteInfo ? 'Hide Complete Info' : 'Complete Information'}</button></>)}
              </div>
            </div>

            {mode === 'explore' ? (
              <>
                <div style={{ height: 320, marginTop: 12 }}>
                  {vehicleData ? (
                    <ResponsiveContainer width="100%" height={280}><LineChart data={vehicleData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="year" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="petrol" stroke="#1f2937" /><Line type="monotone" dataKey="diesel" stroke="#374151" /><Line type="monotone" dataKey="hybrid" stroke="#059669" /><Line type="monotone" dataKey="ev" stroke="#0ea5e9" /></LineChart></ResponsiveContainer>
                  ) : <p>Loading graph...</p>}
                </div>

                {infoVisible && (<div style={{ marginTop: 14 }}><h3>Three trends explained</h3><p>Overall Fleet Growth — total registered vehicles and how it evolves across years; used for long-term planning and infrastructure needs.</p><p>Fuel-type Mix — distribution across petrol/diesel/hybrid/EV; important for fuel demand and charging infrastructure planning.</p><p>Vehicle Density — a proxy for congestion; derived from fleet sizes and road network length.</p>{showCompleteInfo && <p>Complete methodology: ETL steps, feature engineering, ensemble modeling and CI estimation via bootstrap ensembles.</p>}</div>)}
              </>
            ) : (
              <div style={{ marginTop: 12 }}>{renderViewText("vehicles")}</div>
            )}
          </section>
        )}

        {/* TRAFFIC */}
        {route === 'traffic' && (
          <section className="card" aria-label="Traffic content">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Traffic Forecast {mode === 'view' ? '(Overview)' : ''}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {mode === 'explore' && (<><button className="btn ghost" onClick={() => setInfoVisible(v => !v)}>{infoVisible ? 'Hide Info' : 'Info'}</button><button className="btn primary" onClick={() => setShowCompleteInfo(s => !s)}>{showCompleteInfo ? 'Hide Complete Info' : 'Complete Information'}</button></>)}
              </div>
            </div>

            {mode === 'explore' ? (
              <>
                <div style={{ height: 300, marginTop: 12 }}>
                  {trafficData ? (<ResponsiveContainer width="100%" height={260}><BarChart data={trafficData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Bar dataKey="congestion" fill="#8884d8" /></BarChart></ResponsiveContainer>) : <p>Loading graph...</p>}
                </div>

                {infoVisible && (<div style={{ marginTop: 14 }}><h3>Traffic information</h3><p>Short-term forecasting uses historical congestion, event calendars and weather to predict daily/hourly congestion indices.</p>{showCompleteInfo && <p>Complete info includes MAE/RMSE metrics and scenario simulation steps.</p>}</div>)}
              </>
            ) : (
              <div style={{ marginTop: 12 }}>{renderViewText("traffic")}</div>
            )}
          </section>
        )}

        {/* POLLUTION */}
        {route === 'pollution' && (
          <section className="card" aria-label="Pollution content">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Pollution Forecast & Data {mode === 'view' ? '(Overview)' : ''}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                {mode === 'explore' && (<><button className="btn ghost" onClick={() => setInfoVisible(v => !v)}>{infoVisible ? 'Hide Info' : 'Info'}</button><button className="btn primary" onClick={() => setShowCompleteInfo(s => !s)}>{showCompleteInfo ? 'Hide Complete Info' : 'Complete Information'}</button></>)}
              </div>
            </div>

            {mode === 'explore' ? (
              <>
                <div style={{ height: 320, marginTop: 12 }}>
                  {pollutionData ? (<ResponsiveContainer width="100%" height={280}><LineChart data={pollutionData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="pm25" stroke="#ef4444" /><Line type="monotone" dataKey="pm10" stroke="#f59e0b" /></LineChart></ResponsiveContainer>) : <p>Loading pollution graph...</p>}
                </div>

                {infoVisible && (<div style={{ marginTop: 14 }}><h3>Pollution details</h3><p>Inputs: station measurements, meteorology, satellite proxies and emission factors; fused into per-district estimates.</p>{showCompleteInfo && <p>Complete info: calibration steps, gap-filling methods and QA/QC procedures before forecasting.</p>}<h4 style={{ marginTop: 12 }}>AP districts — click to view samples</h4><div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginTop:8 }}>{AP_DISTRICTS.map(d=>(<button key={d} className="btn ghost" style={{ textAlign:'left' }} onClick={()=> onSelectDistrict(d)}>{d}</button>))}</div></div>)}

                {selectedDistrict && selectedDistrictData && (<div style={{ marginTop: 16 }}><h4>Pollution stats — {selectedDistrict}</h4><table><thead><tr><th style={{textAlign:'left', padding:8}}>Date</th><th style={{textAlign:'right', padding:8}}>PM2.5</th><th style={{textAlign:'right', padding:8}}>PM10</th></tr></thead><tbody>{selectedDistrictData.map((r,i)=>(<tr key={i}><td style={{padding:8}}>{r.date}</td><td style={{padding:8, textAlign:'right'}}>{r.pm25}</td><td style={{padding:8, textAlign:'right'}}>{r.pm10}</td></tr>))}</tbody></table>{showCompleteInfo && (<div style={{marginTop:12}}><h4>Complete pollution info</h4><p>Sensor calibration, gap-filling, model choices and QA/QC steps.</p></div>)}</div>)}
              </>
            ) : (
              <div style={{ marginTop: 12 }}>{renderViewText("pollution")}<div style={{ marginTop: 10 }}><h4>AP Districts</h4><div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10, marginTop:8 }}>{AP_DISTRICTS.map(d=>(<button key={d} className="btn ghost" style={{ textAlign:'left' }} onClick={()=> onSelectDistrict(d)}>{d}</button>))}</div></div>{selectedDistrict && selectedDistrictData && (<div style={{ marginTop: 12 }}><h4>Pollution stats — {selectedDistrict}</h4><table><thead><tr><th style={{textAlign:'left', padding:8}}>Date</th><th style={{textAlign:'right', padding:8}}>PM2.5</th><th style={{textAlign:'right', padding:8}}>PM10</th></tr></thead><tbody>{selectedDistrictData.map((r,i)=>(<tr key={i}><td style={{padding:8}}>{r.date}</td><td style={{padding:8, textAlign:'right'}}>{r.pm25}</td><td style={{padding:8, textAlign:'right'}}>{r.pm10}</td></tr>))}</tbody></table></div>)}</div>
            )}
          </section>
        )}

      </main>

      <footer className="footer">© {new Date().getFullYear()} Automobile Prognosticator • Geethanjali IST</footer>
    </div>
  );
}
