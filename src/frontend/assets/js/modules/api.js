const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// =======================
// ROTA SAVE
// =======================
app.post("/save", (req, res) => {

    console.log("CHEGOU NA API");
    console.log(req.body);

    try {
        // 🔥 CORREÇÃO IMPORTANTE DO CAMINHO
        const filePath = path.join(__dirname, "../../../data/dados.json");

        let dados = [];

        if (fs.existsSync(filePath)) {
            const file = fs.readFileSync(filePath, "utf-8");
            dados = file ? JSON.parse(file) : [];
        }

        dados.push(req.body);

        fs.writeFileSync(filePath, JSON.stringify(dados, null, 2));

        console.log("SALVO COM SUCESSO");

        res.json({ success: true });

    } catch (err) {
        console.error("ERRO AO SALVAR:", err);
        res.status(500).json({ error: "Erro ao salvar dados" });
    }
});

// =======================
// SERVER
// =======================
app.listen(3000, () => {
    console.log("API rodando na porta 3000");
});
/* const express = require("express")
const cors = require("cors")
const fs = require("fs")
const path = require("path")

const app = express()

app.use(cors())
app.use(express.json())

app.post("/save", (req, res) => {
    console.log("CHEGOU REQUEST /save")
    console.log(req.body)

    const filePath = path.join(__dirname, "data/dados.json")

    let dados = []

    if (fs.existsSync(filePath)) {
        dados = JSON.parse(fs.readFileSync(filePath))
    }

    dados.push(req.body)

    fs.writeFileSync(filePath, JSON.stringify(dados, null, 2))

    res.json({ ok: true })
})

app.listen(3000, () => {
    console.log("API rodando na porta 3000")
}) */

/* export async function saveData(dados) {

    const response = await fetch(
        "http://localhost:3000/save",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify(dados)
        }
    );

    return await response.json();
}

app.post("/save", (req, res) => {
    console.log("CHEGOU REQUEST /save")
    console.log(req.body)

    res.json({ ok: true })
}) */