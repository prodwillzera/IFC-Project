const fs = require("fs");
const path = require("path");

const receptionPath = path.join(__dirname, "..", "..", "..", "data", "dataReception.json");
const graphPath = path.join(__dirname, "..", "..", "..", "data", "data.json");


function readReceptionData () {
    if (!fs.existsSync(receptionPath)) {return [];}

    const content = fs.readFileSync(receptionPath, "utf8");

    return content 
        ? JSON.parse(content) 
        : [];
}

function saveReceptionData (data) {
    fs.writeFileSync(receptionPath, JSON.stringify(data, null, 2));
}


function readGraphData () {
    if (!fs.existsSync(graphPath)) {return [];}

    const content = fs.readFileSync(graphPath, "utf8");

    return content ? JSON.parse(content) : [];
}

function saveGraphData (data) {
    fs.writeFileSync(graphPath, JSON.stringify(data, null, 2));
}

module.exports = {
    readReceptionData,
    saveReceptionData,
    readGraphData,
    saveGraphData
}


/*         let data = [];

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

        fs.writeFileSync(graphPath,JSON.stringify(graphData, null, 2));
    
        const content = fs.readFileSync(graphPath, "utf8");

        const data = JSON.parse(content); */