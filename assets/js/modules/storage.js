/* export function saveData (data) {
    let list = JSON.parse(localStorage.getItem('cadastroRecepcao')) || [];
    list.push(data);
    localStorage.setItem('cadastroRecepcao', JSON.stringify(list));
} */

export function saveData (dados) {
    console.log(dados)
    let list = JSON.parse(localStorage.getItem('cadastroRecepcao')) || [];
    list.push(dados);
    console.log(dados)
    
    localStorage.setItem('cadastroRecepcao', JSON.stringify(list));

    FileSystem.writefile()
}