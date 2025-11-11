// js/mobile.js - Mobile enhancements

// Detect mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (isMobile) {
  // Prevent double-tap zoom
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);
  
  // Add mobile class to body
  document.body.classList.add('mobile-device');
  
  // Optimize animations on mobile
  const flowers = document.querySelectorAll('.flower');
  flowers.forEach(flower => {
    flower.style.animationDuration = '2s';
  });
  
  // Add touch feedback
  const navLinks = document.querySelectorAll('.flower-nav a');
  navLinks.forEach(link => {
    link.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    link.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    });
  });
}

// Handle orientation change
window.addEventListener('orientationchange', () => {
  // Reload flowers on orientation change for better display
  setTimeout(() => {
    window.location.reload();
  }, 100);
});

// Prevent pull-to-refresh on mobile
document.body.addEventListener('touchmove', (e) => {
  if (e.touches.length > 1) {
    e.preventDefault();
  }
}, { passive: false });
