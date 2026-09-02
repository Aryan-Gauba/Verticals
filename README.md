<div align="center">
  <h1>📈 Verticals</h1>
  <p><strong>A full-stack, timezone-aware habit tracking web application built to cultivate consistency through daily streak tracking and 21-day progress cycles.</strong></p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" /></a>
    <a href="https://www.postgresql.org/"><img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" /></a>
  </p>
</div>

<hr />

<h2>✨ Key Features</h2>
<ul>
  <li><strong>Timezone-Aware Streaks:</strong> Standardized client-side date handling (<code inline="">YYYY-MM-DD</code>) guarantees that streaks and completion checks accurately align with the user's local timezone, independent of server location.</li>
  <li><strong>21-Day Cycle Progress:</strong> Visualizes habit-building milestones based on the 21-day psychological adaptation rule, complete with confetti triggers on cycle completion.</li>
  <li><strong>Smart Lockout Notifications:</strong> Prevents double-logging on the same calendar day while calculating the exact remaining time until local midnight.</li>
  <li><strong>JWT Authentication:</strong> Secure user authorization, registration, and persistent session management.</li>
  <li><strong>Dynamic Theming:</strong> Light and dark mode support saved across browser sessions.</li>
</ul>

<hr />

<h2>🛠️ Tech Stack & Technologies</h2>

<table>
  <thead>
    <tr>
      <th>Layer</th>
      <th>Technologies Used</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Frontend</strong></td>
      <td>
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="20" height="20" alt="React" /> React.js &nbsp;&nbsp;
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg" width="20" height="20" alt="Vite" /> Vite &nbsp;&nbsp;
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="20" height="20" alt="JS" /> ES6+ JavaScript &nbsp;&nbsp;
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="20" height="20" alt="CSS" /> Custom CSS Variables
      </td>
    </tr>
    <tr>
      <td><strong>Backend</strong></td>
      <td>
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" width="20" height="20" alt="Node" /> Node.js &nbsp;&nbsp;
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" width="20" height="20" alt="Express" /> Express.js &nbsp;&nbsp;
        <img src="https://jwt.io/img/pic_logo.svg" width="20" height="20" alt="JWT" /> JSON Web Tokens (JWT) &nbsp;&nbsp;
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" width="20" height="20" alt="Postman" /> REST APIs
      </td>
    </tr>
    <tr>
      <td><strong>Database</strong></td>
      <td>
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="20" height="20" alt="PostgreSQL" /> PostgreSQL &nbsp;&nbsp;
        <code>pg</code> Connection Pool
      </td>
    </tr>
    <tr>
      <td><strong>Deployment</strong></td>
      <td>
        <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" width="20" height="20" alt="Vercel" /> Vercel
      </td>
    </tr>
  </tbody>
</table>

<hr />

<h2>🚀 Local Development Setup</h2>

<h3>1. Clone Repository</h3>
<pre><code>git clone https://github.com/Aryan-Gauba/Verticals.git
cd Verticals</code></pre>

<h3>2. Setup Backend Server</h3>
<pre><code>cd server
npm install</code></pre>

<p>Create a <code>.env</code> file in the <code>/server</code> directory:</p>
<pre><code>PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key</code></pre>

<p>Run backend server:</p>
<pre><code>npm run dev</code></pre>

<h3>3. Setup Client Application</h3>
<pre><code>cd ../client
npm install
npm run dev</code></pre>

<hr />

<h2>📂 Project Architecture</h2>
<pre><code>Verticals/
├── client/              # React + Vite Client Application
│   ├── src/
│   │   ├── components/  # Auth, HabitForm, HabitItem
│   │   ├── api.js       # Central Axios REST Instance
│   │   ├── App.jsx      # Core Dashboard Component
│   │   └── App.css      # Custom Design Tokens & Styles
└── server/              # Node.js + Express API Backend
    ├── controllers/     # Habit Logic & Timezone Math
    ├── routes/          # Express API Endpoints
    ├── db.js            # PostgreSQL Connection Pool
    └── index.js         # Entry Point
</code></pre>
