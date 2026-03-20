# Weather App 🌤️

Developed by **Fernando Rafael Ramos**

Full stack weather application with complete CRUD, external API integrations and data export.

---

## Tech Stack

- **Frontend:** React, Axios, React Icons
- **Backend:** Node.js, Express
- **Database:** MySQL
- **APIs:** OpenWeatherMap, YouTube Data API, Google Maps Embed API

---

## How to run

### Requirements
- Node.js v20+
- MySQL

### Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```
DB_HOST=localhost
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=weatherapp
PORT=3001
OPENWEATHER_API_KEY=your_key
GOOGLE_API_KEY=your_key
```

Create the database in MySQL:
```sql
CREATE DATABASE weatherapp;
USE weatherapp;
CREATE TABLE weather_searches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  weather_data JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Start the server:
```bash
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

Access `http://localhost:3000`

---

## Features

- Search weather by city, zip code or GPS coordinates
- Current weather with temperature, humidity, wind and feels like
- 5-day forecast
- Search history with full CRUD
- Data export to CSV and PDF
- YouTube and Google Maps integration
- Error handling

---

## About PM Accelerator

**Product Manager Accelerator** is a community helping aspiring and experienced PMs accelerate their careers through mentorship, resources, and hands-on experience.

🔗 [PM Accelerator on LinkedIn](https://www.linkedin.com/school/product-manager-accelerator/)