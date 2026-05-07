import { validateData, validateID, validateHour } from './validation.js';
import { saveData } from './storage.js';

export function startForm () {
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

        if( !validateData(dados.data) ) return console.error ('Data inválida');
        if( !validateID(dados.cpf) ) return console.error ('CPF inválido');
        if( !validateHour(dados.entrada) || !validateHour(dados.saida) ) return console.error ('Hora inválida');

        saveData(dados);
        /* console.table(dados) */

        alert('Cadastro com sucesso!');
    })
}

/* export function startForm() {
    const btn = document.querySelector('#submitbtn');

    btn?.addEventListener('click', (e) => {
        e.preventDefault();

        const data = {
            data: document.querySelector('#input-day').value,
            nome: document.querySelector('#input-name').value,
            cpf: document.querySelector('#input-id').value,
            motivo: document.querySelector('#input-why').value,
            setor: document.querySelector('#input-sector').value,
            entrada: document.querySelector('#input-entry').value,
            saida: document.querySelector('#input-exit').value,
            score: Number(document.querySelector('#input-score').value)
        };

        // validações
        if (!validateData(data.data)) return alert('Data inválida!');
        if (!validateID(data.cpf)) return alert('CPF inválido!');
        if (!validateHour(data.entrada) || !validateHour(data.saida)) return alert('Hora inválida!');

        // pegar os cadastros já existentes do localStorage
        let list = JSON.parse(localStorage.getItem('cadastroRecepcao')) || [];
        list.push(data);

        // atualizar o localStorage
        localStorage.setItem('cadastroRecepcao', JSON.stringify(list));

        // gerar o arquivo JSON para download
        const blob = new Blob([JSON.stringify(list, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cadastros.json';
        link.click();

        alert('Cadastro válido! JSON atualizado.');
    });
} */