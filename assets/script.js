// Inicializa o Glide carousel
document.addEventListener("DOMContentLoaded", function () {
  const glide = new Glide('#mainGlide', {
    type: 'carousel',
    perView: 1,
    hoverpause: true,
    gap: 10
  });

  glide.on(['mount.after', 'run'], function() {
    const idx = glide.index || 0;
    document.getElementById('currentSlide').textContent = (idx + 1);
  });

  // total slides
  const total = document.querySelectorAll('#mainGlide .glide__slide').length;
  document.getElementById('totalSlides').textContent = total;

  glide.mount();

  // thumbnails click
  document.querySelectorAll('#thumbs img').forEach((img) => {
    img.addEventListener('click', () => {
      const index = Number(img.dataset.index);
      glide.go('=' + index);
      document.querySelectorAll('#thumbs img').forEach(i=>i.classList.remove('active'));
      img.classList.add('active');
    });
  });
  // set first active
  const firstThumb = document.querySelector('#thumbs img');
  if (firstThumb) firstThumb.classList.add('active');

  // share via WhatsApp
  const shareBtn = document.getElementById('shareBtn');
  shareBtn.addEventListener('click', () => {
    const text = encodeURIComponent("Veja este imóvel: " + document.title + " — " + location.href);
    const url = `https://wa.me/?text=${text}`;
    window.open(url,'_blank');
  });

  // favorite placeholder
  document.getElementById('favoriteBtn').addEventListener('click', () => {
    alert('Imóvel indicado! (funcionalidade para implementar no back-end)');
  });

  // contact form (simples envio por mailto)
  document.getElementById('contactForm').addEventListener('submit', function(e){
    e.preventDefault();
    const f = e.target;
    const name = encodeURIComponent(f.name.value || '');
    const email = encodeURIComponent(f.email.value || '');
    const phone = encodeURIComponent(f.phone.value || '');
    const message = encodeURIComponent(f.message.value || '');
    // monta um mailto que abre o cliente de email do usuário
    const subject = encodeURIComponent('Interesse no imóvel');
    const body = `Nome: ${name}%0D%0AEmail: ${email}%0D%0ATelefone: ${phone}%0D%0A%0D%0A${message}`;
    window.location.href = `mailto:contato@imobiliaria.com?subject=${subject}&body=${body}`;
  });
});
