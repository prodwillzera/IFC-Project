import { logar } from './modules/auth.js';

const btn = document.querySelector('button');

btn?.addEventListener('click', (e) => {
    e.preventDefault();
    logar();
});