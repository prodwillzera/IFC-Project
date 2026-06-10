import {
  validateData,
  validateID,
  validateHour
} from './modules/validation.js';

import { applyMask } from './modules/mask.js';

applyMask();

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

  const isValid =
    validateData(dataInputs.dia) &&
    validateID(dataInputs.cpf) &&
    validateHour(dataInputs.entrada) &&
    validateHour(dataInputs.saida);

  if (!isValid) {
    alert("Dados inválidos");
    return;
  }

  const response = await fetch("/salvar", {
    method: "POST",
    headers: {
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

let sequencia = "";

addEventListener("keypress", function (event) {
  console.log(event.key);

  sequencia += event.key.toLowerCase();

  let codes = {
    cogu: () => console.log("Cogumelo_Seco mestre do xanascript"),
    guto: () => console.log("Você citou o nome proibido, agora morra"),
    tuki: () => console.log("Multiprofissional e usuario de brave +100 aura"),
    biruta: () => console.log("Rei do frontend, leao da GC")
  }

  for (let code in codes) {
    if (sequencia.includes(code)) {
      codes[code]()
      sequencia = "";
    }
  }
});

//sequencia = sequencia.slice(-6);
/* if (sequencia.endsWith("cogu")){
    
}
else if (sequencia.endsWith("guto")){
    
}
else if (sequencia.endsWith("tuki")){
    
}
else if (sequencia.endsWith("biruta")){
    console.log("Rei do frontend, leao da GC");
} */