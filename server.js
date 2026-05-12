const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("src/frontend"));

const filePath = path.join(__dirname, "data", "dataReception.json");
const graphPath = path.join(__dirname, "data", "data.json");

app.post("/salvar", (req, res) => {
    try {

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


        let graphData = [];

        if (fs.existsSync(graphPath)) {
            const content = fs.readFileSync(graphPath, "utf8");

            if (content) {
                graphData = JSON.parse(content);
            }
        }

        const parts = newData.dia.split("/");
        const day = parts[0];
        const month = parts[1];

        const months = [
            "jan", "fev", "mar", "abr",
            "mai", "jun", "jul", "ago",
            "set", "out", "nov", "dez"
        ];

        const monthName = months[parseInt(month) - 1];

        const monthFormatted = monthName;

        const existingMonth = graphData.find(
            item => item.mes === monthFormatted
        );

        if(existingMonth) {

            existingMonth[newData.setor] =
                Number(newData.avaliacao);

        } else {

            const graphObject = {
                mes: monthFormatted,
                [newData.setor]: Number(newData.avaliacao)
            };

            graphData.push(graphObject);
        }

        fs.writeFileSync(graphPath,JSON.stringify(graphData, null, 2));

        res.json({
            message: "Salvo com sucesso"
        });

    } catch(error) {

        console.error(error);

        res.status(500).json({
            error: error.message
        });
    }
    
});

app.get("/grafico", (req, res) => {

    const content = fs.readFileSync(graphPath, "utf8");

    const data = JSON.parse(content);

    res.json(data);
});

app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});