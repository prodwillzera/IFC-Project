const 
    inputDay = document.getElementById("input-day"),
    inputName = document.getElementById("input-name"),
    inputId = document.getElementById("input-id"),
    inputWhy = document.getElementById("input-why"),
    inputSector = document.getElementById("input-sector"),
    inputEntry = document.getElementById("input-entry"),
    inputExit = document.getElementById("input-exit"),
    inputScore = document.getElementById("input-score"),
    button = document.getElementById("submitbtn");

button.addEventListener("click", async (event) => {
    event.preventDefault();

    const dataInputs = {
        dia: inputDay.value,
        nome: inputName.value,
        cpf: inputId.value,
        motivo: inputWhy.value,
        setor: inputSector.value,
        entrada: inputEntry.value,
        saida: inputExit.value,
        avaliacao: inputScore.value
    }

    console.table(dataInputs);

    const response = await fetch("/salvar", {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataInputs)
    });

    const data = await response.json();

    console.log(data);

    inputDay.value = "";
    inputName.value = "";
    inputId.value = "";
    inputWhy.value = "";
    inputSector.value = "";
    inputEntry.value = "";
    inputExit.value = "";
    inputScore.value = "";
});