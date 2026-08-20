import { Toast } from './toast.js';

export function logar() {
  const userEl = document.getElementById('user');
  const passwordEl = document.getElementById('password');
  const rememberEl = document.getElementById('rememberPass');

  if (!userEl || !passwordEl) return;

  const user = userEl.value.trim();
  const pass = passwordEl.value.trim();
  const remember = rememberEl ? rememberEl.checked : false;

  if (!user || !pass) {
    Toast.error('Por favor, preencha todos os campos.');
    return;
  }

  // Institutional MVP login check
  if (user === "admin" && pass === "admin") {
    const sessionData = {
      username: "admin",
      name: "Administrador IFC",
      role: "Administrador",
      campus: "Fraiburgo",
      loginTime: new Date().toISOString()
    };

    localStorage.setItem("loggedSession", JSON.stringify(sessionData));
    localStorage.setItem("logged", "true");

    if (remember) {
      localStorage.setItem("saved_user", user);
      localStorage.setItem("saved_password", pass);
    } else {
      localStorage.removeItem("saved_user");
      localStorage.removeItem("saved_password");
    }

    Toast.success('Login realizado com sucesso! Redirecionando...');
    setTimeout(() => {
      window.location.href = "./page0.html";
    }, 1000);
  } else {
    Toast.error('Usuário ou senha incorretos.');
  }
}

export function logout() {
  localStorage.removeItem("loggedSession");
  localStorage.removeItem("logged");
  Toast.info('Você saiu do sistema.');
  setTimeout(() => {
    window.location.href = "/pages/index.html";
  }, 800);
}

export function checkAuth() {
  const logged = localStorage.getItem("logged");
  if (logged !== "true") {
    const path = window.location.pathname;
    if (!path.endsWith("index.html") && !path.endsWith("/") && path.includes("/pages/")) {
      window.location.href = "index.html";
    }
  }
}

export function getLoggedUser() {
  const session = localStorage.getItem("loggedSession");
  if (session) {
    try {
      return JSON.parse(session);
    } catch (e) {
      return null;
    }
  }
  return null;
}