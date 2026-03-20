function logar(){

    var login_user = document.getElementById('user').value;
    var password = document.getElementById('password').value;

    if(login_user == "admin" && password == "admin"){
        alert('Login realizado!');
        location.href = "page1.html";
    }else{
        alert('Usuario ou senha incorretos.');
    }

}

const inputDay = document.querySelector('#input-day')
const inputName = document.querySelector('#input-name')
const inputID = document.querySelector('#input-id')
const inputWhy = document.querySelector('#input-why')
const inputSector = document.querySelector('#input-sector')
const inputEntry = document.querySelector('#input-entry')
const inputExit = document.querySelector('#input-exit')
const inputScore = document.querySelector('#input-score')
const btn = document.querySelector('#submitbtn')

inputDay.addEventListener('input', function(){
    let valor = inputDay.value.replace(/\D/g, '')
    
    if(valor.length > 2){
        valor = valor.slice(0,2) + '/' + valor.slice(2);
    }
    if(valor.length > 5){
        valor = valor.slice(0,5) + '/' + valor.slice(5,9);
    }

    inputDay.value = valor
})

inputID.addEventListener('input', function(){
    let id_value = inputID.value.replace(/\D/g, '')

    if(id_value.length > 11){
        id_value = id_value.slice(0,11);
    }

    id_value = id_value.replace(/(\d{3})(\d)/, '$1.$2');
    id_value = id_value.replace(/(\d{3})(\d)/, '$1.$2');
    id_value = id_value.replace(/(\d{3})(\d{1,2})/, '$1-$2');

    inputID.value = id_value
})

btn.addEventListener("click", function(event){
    event.preventDefault()

    const day = inputDay.value;
    const name = inputName.value;
    const ID = inputID.value;
    const why = inputWhy.value;
    const sector = inputSector.value;
    const entry = inputEntry.value;
    const exit = inputExit.value;
    const score = Number(inputScore.value);

    console.log(day,name,ID,why,sector,entry,exit,score);
    console.table([day,name,ID,why,sector,entry,exit,score]);


    if(!day || !name || !ID || !why || !sector || !entry || !exit || !score){
        console.warn('Um dos campos está vazio!')
        return
    }


    //DATA TESTE
    if(day.length !== 10){
        console.error('Digite a data completa (DD/MM/AAAA)')
        return
    }

    const regexData = /^\d{2}\/\d{2}\/\d{4}$/
    if(!regexData.test(day)){
        console.error('Formato invalido')
        return
    }


    const parts = day.split('/')
    const days = Number(parts[0])
    const month = Number(parts[1])
    const year = Number(parts[2])


    if(isNaN(days) || isNaN(month) || isNaN(year)){
        console.error('Digite números válidos!');
    }
    
    function leap_year(a){
        return (a % 4 === 0 && a % 100 !== 0) || (a % 400 === 0);
    }

    if(month < 1 || month > 12){
        console.error('Mês inválido')
        return
    }

    let dayMonth = [31,28,31,30,31,30,31,31,30,31,30,31]
    if(leap_year(year)){
        dayMonth[1] = 29
    }

    if(days < 1 || days > dayMonth[month-1]){
        console.error('Dia inválido para esse mês')
        return
    }
    

    //CPF TESTE
    if(ID.length < 10){
        console.error('CPF Inválido.')
        return
    }

    let cpfNumbers = ID.replace(/\D/g, ''); 

    function TestCPF(ID) {
        var Soma = 0;
        var Resto;

        if (ID == "00000000000") return false;

        for (var i = 1; i <= 9; i++) 
            Soma = Soma + parseInt(ID.substring(i-1, i)) * (11 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(ID.substring(9, 10))) return false;

        Soma = 0;
        for (var i = 1; i <= 10; i++)
            Soma = Soma + parseInt(ID.substring(i-1, i)) * (12 - i);
        Resto = (Soma * 10) % 11;

        if ((Resto == 10) || (Resto == 11)) Resto = 0;
        if (Resto != parseInt(ID.substring(10, 11))) return false;

        return true;
    }

    if (!TestCPF(cpfNumbers)) {
        console.error('CPF inválido!');
        return;
    }

    //SCORE TESTE
    if(isNaN(score)){
        console.error('Digite um valor válido.')
        return
    }
    
    if(score > 5 || score < 1){
        console.error ('Só pode números de 1 à 5.')
        return
    }


    console.log('Score válido:', score)

    alert('Recepção cadastrada com sucesso!')
})