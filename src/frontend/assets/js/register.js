import { sendWhatsAppMessage } from './modules/whatsapp.js';

const form = document.querySelector('.container-register');
const backLoginLink = document.getElementById('backLogin');

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendWhatsAppMessage();
});

backLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "index.html";
});