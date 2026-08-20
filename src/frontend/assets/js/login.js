import { logar, checkAuth } from './modules/auth.js';

const btnRegister = document.getElementById('register-btn');

btnRegister.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./register.html";
});

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("logged") === "true") {
    window.location.href = "./page0.html";
    return;
  }

  const userEl = document.getElementById('user');
  const passwordEl = document.getElementById('password');
  const rememberEl = document.getElementById('rememberPass');
  const form = document.querySelector('.container-login');
  const savedUser = localStorage.getItem("saved_user");
  const savedPass = localStorage.getItem("saved_password");

  if (savedUser && userEl) userEl.value = savedUser;
  if (savedPass && passwordEl) passwordEl.value = savedPass;

  if (savedUser && savedPass && rememberEl) rememberEl.checked = true;

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    logar();
  });

  userEl?.addEventListener('input', () => {
    userEl.style.borderColor = userEl.value.trim() ? '#0f7d3a' : '#ccc';
  });

  passwordEl?.addEventListener('input', () => {
    passwordEl.style.borderColor = passwordEl.value.trim() ? '#0f7d3a' : '#ccc';
  });
});