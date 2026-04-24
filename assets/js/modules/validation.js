export function validateData (day) {
    const regex = /^\d{2}\/\d{2\/\d{4}$/;
    
    if (!regex.test(day)) return false;

    const [d, m, y] = day.split('/').map(Number);

    const dayMonth = [31, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28,31,30,31,30,31,31,30,31,30,31];

    return m >= 1 && m <= 12 && d <= dayMonth[m-1];
}

export function validateID (cpf) {
    cpf = cpf.replace(/\D/g, '');
    
    if (cpf.length !== 11 || cpf === "00000000000") return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt (cpf[i]) * (10 - i);

    let resto = (soma * 10) % 11;
    if(resto === 10) resto = 0;
    if(resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for(let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);

    resto = (soma * 10) % 11;
    if(resto === 10) resto = 0;

    return resto === parseInt(cpf[10]);
}

export function validateHour (time) {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}