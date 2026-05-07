const fs = require("fs");
const path = require("path");

function saveData(dados) {

    const filePath = path.join(process.cwd(), "data", "dados.json");

    console.log("SALVANDO EM:", filePath);

    let list = [];

    try {
        if (fs.existsSync(filePath)) {
            const raw = fs.readFileSync(filePath, "utf-8");

            // proteção contra JSON vazio/corrompido
            list = raw ? JSON.parse(raw) : [];
        }
    } catch (err) {
        console.log("ERRO AO LER JSON:", err);
        list = [];
    }

    list.push(dados);

    try {
        fs.writeFileSync(
            filePath,
            JSON.stringify(list, null, 2),
            "utf-8"
        );

        console.log("✔ DADOS SALVOS COM SUCESSO");

    } catch (err) {
        console.log("ERRO AO ESCREVER JSON:", err);
    }
}

module.exports = { saveData };
/* const fs = require("fs");
const path = require("path");

function saveData(dados){
    -- const filePath = path.join(__dirname, "..", "..", "..", "data", "dados.json"); 
    const filePath = path.join(process.cwd(), "data", "dados.json");

    let list = [];

    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, "utf-8");
            list = data ? JSON.parse(data) : [];
        }
         --const data = fs.readFileSync(
            filePath, "utf-8"
        );

        lsit = JSON.parse(data);--

    } catch (err) {

        console.log("Arquivo não existe...", err);
    }

    list.push(dados);

    fs.writeFileSync(
        filePath, JSON.stringify(list, null, 2)
    );

    console.log("Dado(s salvos) com sucesso");
}

module.exports = { saveData }; */

/* export function saveData (data) {
    let list = JSON.parse(localStorage.getItem('cadastroRecepcao')) || [];
    list.push(data);
    localStorage.setItem('cadastroRecepcao', JSON.stringify(list));
} */

/* export function saveData (dados) {
    let list = JSON.parse(localStorage.getItem('cadastroRecepcao')) || [];
    list.push(dados);
    console.log(dados)
    
    localStorage.setItem('cadastroRecepcao', JSON.stringify(list));
} */