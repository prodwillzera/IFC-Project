export function sendWhatsAppMessage() {
  const nome = document.getElementById("name");
  const mensagem = document.getElementById("message");
  const phoneNumber = "5549991741121";

  const text = `Olá, meu nome é ${nome.value}. ${mensagem.value}`;

  const msgFormated = encodeURIComponent(text);

  const url = `https://whatsa.me/${phoneNumber}/?t=${msgFormated}`;

  window.open(url, '_blank');
}