const input = document.getElementById("input-test");
const button = document.getElementById("button-test");

button.addEventListener("click", async (event) => {
    event.preventDefault();

    const nome = input.value;

    const resposta = await fetch("/salvar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome
        })
    });

    const dados = await resposta.json();

    console.log(dados);

    input.value = "";
})