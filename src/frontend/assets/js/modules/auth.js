import { Toast } from './toast.js';

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

    if (!path.endsWith("index.html") &&
        !path.endsWith("/") &&
        path.includes("/pages/")
      ) {
        window.location.href = "/pages/index.html";
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