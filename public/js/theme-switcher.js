// Theme switcher functionality
document.addEventListener('DOMContentLoaded', () => {
  // Check for saved theme preference or respect OS preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Set initial theme
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  
  // Update toggle button state
  updateToggleState();
  
  // Add theme toggle to all pages
  addThemeToggle();
});

// Add theme toggle button to the navigation
function addThemeToggle() {
  const nav = document.querySelector('nav ul');
  if (!nav) return;
  
  // Create theme toggle list item
  const themeToggle = document.createElement('li');
  themeToggle.className = 'theme-toggle-container';
  
  // Create toggle button
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'theme-toggle';
  toggleBtn.setAttribute('aria-label', 'Cambiar tema');
  toggleBtn.innerHTML = getCurrentTheme() === 'dark' ? 
    '<span>☀️</span>' : 
    '<span>🌙</span>';
  
  // Add click event
  toggleBtn.addEventListener('click', toggleTheme);
  
  // Add to DOM
  themeToggle.appendChild(toggleBtn);
  nav.appendChild(themeToggle);
}

// Toggle between light and dark themes
function toggleTheme() {
  const currentTheme = getCurrentTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  // Update DOM and localStorage
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update button text
  updateToggleState();
}

// Get current theme
function getCurrentTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}

// Update toggle button state
function updateToggleState() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.innerHTML = getCurrentTheme() === 'dark' ? 
      '<span>☀️</span>' : 
      '<span>🌙</span>';
  }
}