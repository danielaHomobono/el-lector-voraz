/**
 * Animation utilities for El Lector Voraz
 * Enhances user experience with dynamic animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize staggered animations
  initStaggeredAnimations();
  
  // Initialize page transitions
  initPageTransitions();
});

/**
 * Initialize staggered animations for lists using Intersection Observer
 */
function initStaggeredAnimations() {
  // Add stagger container class to catalog containers
  const containers = document.querySelectorAll(
    '.catalog-container, .cafes-container, .clients-container, .sales-container, .users-container'
  );
  
  containers.forEach(container => {
    container.classList.add('stagger-container');
    
    // Add stagger-item class to all direct children
    const items = container.children;
    for (let i = 0; i < items.length; i++) {
      items[i].classList.add('stagger-item');
    }
  });
  
  // Create intersection observer for staggered animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after animation is triggered
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all stagger items
  document.querySelectorAll('.stagger-item').forEach(item => {
    observer.observe(item);
  });
}

/**
 * Initialize page transitions
 */
function initPageTransitions() {
  // Add page transition class to main content
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.classList.add('page-enter');
    
    // Trigger animation after a small delay
    setTimeout(() => {
      mainContent.classList.add('page-enter-active');
    }, 10);
  }
}

/**
 * Add shake animation to an element (useful for form validation errors)
 * @param {HTMLElement} element - Element to animate
 */
function shakeElement(element) {
  if (!element) return;
  
  // Remove animation if it exists
  element.classList.remove('shake');
  
  // Force reflow
  void element.offsetWidth;
  
  // Add animation class
  element.classList.add('shake');
}

/**
 * Add pulse animation to an element
 * @param {HTMLElement} element - Element to animate
 */
function pulseElement(element) {
  if (!element) return;
  
  // Remove animation if it exists
  element.classList.remove('pulse');
  
  // Force reflow
  void element.offsetWidth;
  
  // Add animation class
  element.classList.add('pulse');
}

// Make animation utilities available globally
window.AnimationUtils = {
  shakeElement,
  pulseElement
};