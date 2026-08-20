import { checkAuth, getLoggedUser, logout } from './modules/auth.js';

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Guard page with authentication check
  checkAuth();

  const user = getLoggedUser();
  if (user) {
    const userDisplay = document.getElementById("user-display-name");
    const roleDisplay = document.getElementById("user-display-role");
    const welcomeGreeting = document.getElementById("welcome-greeting");

    if (userDisplay) userDisplay.textContent = user.name;
    if (roleDisplay) roleDisplay.textContent = user.role;
    if (welcomeGreeting) welcomeGreeting.textContent = `Olá, ${user.name}!`;
  }

  // 2. Setup Live Clock & Date
  function updateClock() {
    const clockEl = document.getElementById("clock");
    const dateEl = document.getElementById("date");
    if (!clockEl || !dateEl) return;

    const now = new Date();
    
    // Format Time: HH:MM:SS
    clockEl.textContent = now.toLocaleTimeString("pt-BR");

    // Format Date: e.g. "quinta-feira, 9 de julho de 2026"
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString("pt-BR", options);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // 3. Setup Navigation buttons
  const btnReception = document.getElementById("access-reception");
  const btnGeneral = document.getElementById("access-general");
  const btnSector = document.getElementById("access-sectors");

  btnReception?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "./page1.html";
  });
  btnGeneral?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "./page2.html";
  });
  btnSector?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "./page3.html";
  });

  // Logout button
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", () => {
    logout();
  });

  // 4. Fetch dynamic stats from backend API
  try {
    const response = await fetch('/visitas');
    if (response.ok) {
      const visits = await response.json();
      
      // Calculate Stats
      const totalVisits = visits.length;
      
      // Today formatted as DD/MM/YYYY
      const todayObj = new Date();
      const dd = String(todayObj.getDate()).padStart(2, '0');
      const mm = String(todayObj.getMonth() + 1).padStart(2, '0');
      const yyyy = todayObj.getFullYear();
      const todayFormatted = `${dd}/${mm}/${yyyy}`;

      const visitsToday = visits.filter(v => v.dia === todayFormatted).length;

      // Average score
      let sumScores = 0;
      let ratedCount = 0;
      visits.forEach(v => {
        const score = parseFloat(v.avaliacao);
        if (!isNaN(score) && score > 0) {
          sumScores += score;
          ratedCount++;
        }
      });
      const avgScore = ratedCount > 0 ? (sumScores / ratedCount).toFixed(1) : "5.0";

      // Render Stats
      const statTodayEl = document.getElementById("stat-today");
      const statTotalEl = document.getElementById("stat-total");
      const statAvgEl = document.getElementById("stat-avg");

      if (statTodayEl) statTodayEl.textContent = visitsToday;
      if (statTotalEl) statTotalEl.textContent = totalVisits;
      if (statAvgEl) statAvgEl.textContent = `${avgScore} ★`;
    }
  } catch (error) {
    console.error("Error fetching homepage statistics:", error);
  }
});
