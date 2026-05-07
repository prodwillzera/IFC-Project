import { logar } from './modules/auth.js'; // garante que o caminho está correto

const btn = document.querySelector('input[type="submit"]');

btn?.addEventListener('click', (e) => {
    e.preventDefault(); // previne o reload do form
    logar();           // chama a função importada
});