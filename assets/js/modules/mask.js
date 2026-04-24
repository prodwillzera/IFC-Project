export function applyMask () {
    const inputDay = document.querySelector('#input-day');
    const inputID = document.querySelector('#input-id');
    const inputEntry = document.querySelector('#input-entry');
    const inputExit = document.querySelector('#input-exit');

    inputDay?.addEventListener('input', () => {
        let v = inputDay.value.replace(/\D/g, '');

        if(v.length > 2) v = v.slice(0,2) + '/' + v.slice(2);
        if(v.length > 5) v = v.slice(0,5) + '/' + v.slice(5,9);

        inputDay.value = v;
    })

    inputID?.addEventListener('input', () => {
        let v = inputID.value.replace(/\D/g,'');
        if(v.length > 11) v = v.slice(0,11);

        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d)/, '$1.$2');
        v = v.replace(/(\d{3})(\d{1,2})/, '$1-$2');

        inputID.value = v
    })

    function formatHour(input){
        input?.addEventListener('input', () => {
            let v = input.value.replace(/\D/g, '');
            if(v.length > 2) v = v.slice(0,2) + ':' + v.slice(2);
            input.value = v;
        })
    }

    formatHour(inputEntry);
    formatHour(inputExit);
}