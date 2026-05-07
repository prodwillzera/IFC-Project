import {
    validateData,
    validateID,
    validateHour
} from './validation.js';

export function startForm() {

    console.log("startForm executou");

    const btn = document.querySelector('#submitbtn');

    btn?.addEventListener('click', async (e) => {
        e.preventDefault();

        console.log("clicou");

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

        console.table(dados);

        // ======================
        // VALIDAÇÃO REAL
        // ======================
        const isValid =
            validateData(dados.data) &&
            validateID(dados.cpf) &&
            validateHour(dados.entrada) &&
            validateHour(dados.saida);

        if (!isValid) {
            alert("Dados inválidos");
            return;
        }

        // ======================
        // ENVIO PARA API
        // ======================
        try {
            console.log("ENVIANDO PARA API...");

            const response = await fetch("http://localhost:3000/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const result = await response.json();

            console.log("RESPOSTA API:", result);

            alert("Cadastro realizado com sucesso!");

        } catch (err) {
            console.error("ERRO FETCH:", err);
        }
    });
}

/* import { 
    validateData, 
    validateID, 
    validateHour 
} from './validation.js';
import { saveData } from './api.js';

export function startForm () {
    console.log("startForm executou");

    const btn = document.querySelector('#submitbtn');

    btn?.addEventListener('click', async (e) => {
        console.log("clicou");

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

        await saveData(dados);
        console.table(dados)

        alert('Cadastro com sucesso!');
    })
} */

/* import {
    validateData,
    validateID,
    validateHour
} from './validation.js';

import { saveData } from './api.js'; 

export function startForm () {

    console.log("startForm executou");

    const btn =
        document.querySelector('#submitbtn');

    btn?.addEventListener(
        'click',
        async (e) => {

            console.log("clicou");

            e.preventDefault();

            const dados = {

                data: document.querySelector('#input-day').value,
                nome: document.querySelector('#input-name').value,
                cpf: document.querySelector('#input-id').value,
                motivo: document.querySelector('#input-why').value,
                setor: document.querySelector('#input-sector').value,
                entrada: document.querySelector('#input-entry').value,
                saida: document.querySelector('#input-exit').value,
                score:Number( document.querySelector('#input-score').value )
            
            };

            console.table( dados );

            console.log( "validateData:", validateData(dados.data) );

            console.log( "validateID:",validateID(dados.cpf) );

            console.log( "validateHour entrada:", validateHour(dados.entrada) );

            console.log( "validateHour saida:", validateHour(dados.saida) );

            try {
                const result =
                    await saveData(dados);

                console.log(result);

                alert( 'Cadastro com sucesso!' );

            } catch (err) {

                console.error(
                    "ERRO FETCH:",
                    err
                );
            }
        }
    );
    async function handleSubmit(dados) {
        const response = await fetch("http://localhost:3000/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dados)
        });

        const result = await response.json();
        console.log(result);
    }
} */