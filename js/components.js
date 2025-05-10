
//Botón back to top 

document.addEventListener('DOMContentLoaded', () => {
  const homeButton = document.getElementById('homeButton');
  const scrollThreshold = 200; // Pixeles de scroll para mostrar el botón
  let isScrolling = false;

  // Controlador de scroll eficiente
  window.addEventListener('scroll', () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollPosition > scrollThreshold) {
          homeButton.classList.add('visible');
        } else {
          homeButton.classList.remove('visible');
        }
        
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Click handler con feedback visual
  homeButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    // Efecto al hacer clic
    homeButton.style.transform = 'scale(0.9)';
    setTimeout(() => {
      homeButton.style.transform = 'scale(1)';
      // Recarga después de la animación
      setTimeout(() => location.reload(), 100);
    }, 100);
  });
});

//  E N D  Botón back to top 




