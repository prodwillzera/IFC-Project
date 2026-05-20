const btnReception = document.querySelector('button[class="Reception"]');
const btnGeneral = document.querySelector('button[class="generalGraph"]');
const btnSector = document.querySelector('button[class="sectorGraph"]');

btnReception?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "./page1.html";
});
btnGeneral?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "./page2.html";
});
btnSector?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = "./page3.html";
});