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

const btn = document.querySelector('#submitbtn')

btn.addEventListener("click", function(event){
    event.preventDefault()

    const day = document.querySelector('#input-day').value;
    const name = document.querySelector('#input-name').value;
    const ID = document.querySelector('#input-id').value;
    const why = document.querySelector('#input-why').value;
    const sector = document.querySelector('#input-sector').value;

    console.log(day,name,ID,why,sector)
})