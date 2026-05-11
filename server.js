const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("src/frontend"));

const filePath = path.join(__dirname, "data", "dataReception.json");

app.post("/salvar", (req, res) => {
    const newData = req.body;

    let data = [];

    if(fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");

        if(content) {
            data = JSON.parse(content);
        }
    }

    data.push(newData);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    res.json({
        message: "Salvo com sucesso"
    });
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});