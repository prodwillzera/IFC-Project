import {validateData, validateID, validateHour} from './validation.js';


/* 
import { validarData, validarCPF, validarHora } from './validation.js';
import { salvarDados } from './storage.js';

export function iniciarFormulario() {
    const btn = document.querySelector('#submitbtn');

    btn?.addEventListener('click', (e) => {
        e.preventDefault();

        const dados = {
            data: document.querySelector('#input-day').value,
            nome: document.querySelector('#input-name').value,
            cpf: document.querySelector('#input-id').value,
            motivo: document.querySelector('#input-why').value,
            setor: document.querySelector('#input-sector').value,
            entrada: document.querySelector('#input-entry').value,
            saida: document.querySelector('#input-exit').value,
            score: Number(document.querySelector('#input-score').value)
        };

        if (!validarData(dados.data)) return console.error('Data inválida');
        if (!validarCPF(dados.cpf)) return console.error('CPF inválido');
        if (!validarHora(dados.entrada) || !validarHora(dados.saida)) return console.error('Hora inválida');

        salvarDados(dados);

        alert('Cadastrado com sucesso!');
    });
} */