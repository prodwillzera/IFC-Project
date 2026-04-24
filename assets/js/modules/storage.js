export function saveData (data) {
    let list = JSON.parse(localStorage.getItem('cadastroRecepcao')) || [];
    list.push(data);
    localStorage.setItem('cadastroRecepcao', JSON.stringify(list));
}