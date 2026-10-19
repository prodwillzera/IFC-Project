const EXTERNAL_LINKS = Object.freeze({
  faq: 'https://github.com/prodwillzera/IFC-Project',
  about: 'https://github.com/prodwillzera/IFC-Project'
});

const CONTACT_MESSAGES = Object.freeze({
  ti: 'Suporte IFC: ti.fraiburgo@ifc.edu.br',
  sisae: 'Suporte IFC: sisae.fraiburgo@ifc.edu.br'
});

document.addEventListener('click', (event) => {
  const link = event.target.closest?.('a[data-external-link], a[data-contact]');
  if (!link) return;

  event.preventDefault();

  if (link.hasAttribute('data-external-link')) {
    const key = link.dataset.externalLink;
    if (!Object.hasOwn(EXTERNAL_LINKS, key)) return;

    let url;
    try {
      url = new URL(EXTERNAL_LINKS[key]);
    } catch {
      return;
    }
    if (url.protocol !== 'https:') return;

    window.open(url.href, '_blank', 'noopener,noreferrer');
    return;
  }

  const key = link.dataset.contact;
  if (Object.hasOwn(CONTACT_MESSAGES, key)) {
    window.alert(CONTACT_MESSAGES[key]);
  }
});
