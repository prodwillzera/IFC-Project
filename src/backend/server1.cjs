const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 👇 TESTE
app.get("/test", (req, res) => {
    console.log("TESTE OK");
    res.send("API funcionando");
});

// 👇 SUA ROTA PRINCIPAL
app.post("/save", (req, res) => {
    console.log("CHEGOU NA API");
    console.log(req.body);

    res.json({ ok: true });
});

// 👇 SERVER
app.listen(3000, () => {
    console.log("API rodando na porta 3000");
});

/* const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 👇 TESTE AQUI
app.get("/test", (req, res) => {
    console.log("TESTE OK");
    res.send("API funcionando");
});

// 👇 SUA ROTA PRINCIPAL
app.post("/save", (req, res) => {
    console.log("CHEGOU NA API");
    console.log(req.body);

    res.json({ ok: true });
});

app.listen(3000, () => {
    console.log("API rodando na porta 3000");
}); */

/* const http = require("http");

const { saveData } = require("./modules/storage.cjs");

const server = http.createServer((req, res) => {
    res.setHeader("Acces-Control-Allow-Origin", "*");

    res.setHeader(
        "Content-Type",
        "application/json"
    );

    if (req.url === "/save" && req.method === "POST"){
        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const dados = JSON.parse(body);

            saveData(dados);

            res.end(JSON.stringify({
                message: "Salvo!"
            }));
        });
    }
});

server.listen(3000, () => {
    console.log("Servidor rodando na porta 3000");
}) */