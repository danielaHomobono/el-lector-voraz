/**
 * Cart functionality for El Lector Voraz
 */

// Add item to cart
function addToCart(id, title, price) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(item => item.productId === id);
  
  // Determine product type based on ID or page context
  const productType = id.includes('cafe-') ? 'cafe' : 'book';
  
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ 
      productId: id, 
      title, 
      price, 
      quantity: 1,
      type: productType 
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  
  // Show animation
  const button = document.querySelector(`[data-id="${id}"]`);
  if (button) {
    button.classList.add('added');
    button.textContent = '¡Agregado!';
    
    setTimeout(() => {
      button.classList.remove('added');
      button.textContent = 'Agregar al carrito';
    }, 1500);
  }
  
  showMessage(`${title} agregado al carrito`, 'success');
}

// Remove item from cart
function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const item = cart.find(item => item.productId === id);
  const title = item ? item.title : '';
  
  cart = cart.filter(item => item.productId !== id);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
  
  showMessage(`${title} eliminado del carrito`, 'success');
}

// Update item quantity
function updateQuantity(id, quantity) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const item = cart.find(item => item.productId === id);
  
  if (item) {
    item.quantity = parseInt(quantity);
    if (item.quantity <= 0) {
      return removeFromCart(id);
    }
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Render cart contents
function renderCart() {
  const cartContainer = document.getElementById('cart-container');
  if (!cartContainer) return;
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-cart">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="#3f51b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="#3f51b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#3f51b5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h2>Tu carrito está vacío</h2>
        <p>¡Agrega algunos libros para comenzar!</p>
        <a href="/products" class="btn primary-button">Ver catálogo</a>
      </div>
    `;
    return;
  }
  
  let total = 0;
  let html = '<div class="cart-items">';
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    html += `
      <div class="cart-item" data-id="${item.productId}">
        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <p>Precio unitario: $${item.price}</p>
        </div>
        <div class="cart-item-actions">
          <button 
            class="quantity-btn decrease" 
            onclick="updateQuantity('${item.productId}', ${item.quantity - 1})"
            aria-label="Disminuir cantidad"
          >-</button>
          <input 
            type="number" 
            id="quantity-${item.productId}" 
            class="quantity-input" 
            value="${item.quantity}" 
            min="1" 
            onchange="updateQuantity('${item.productId}', this.value)"
            aria-label="Cantidad"
          >
          <button 
            class="quantity-btn increase" 
            onclick="updateQuantity('${item.productId}', ${item.quantity + 1})"
            aria-label="Aumentar cantidad"
          >+</button>
          <button 
            class="remove-item" 
            onclick="removeFromCart('${item.productId}')"
            aria-label="Eliminar ${item.title} del carrito"
          >
            Eliminar
          </button>
        </div>
        <div class="cart-item-total">
          $${itemTotal.toFixed(2)}
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  html += `
    <div class="cart-summary">
      <div class="cart-total">
        <strong>Total: $${total.toFixed(2)}</strong>
      </div>
      <button id="checkout-button" class="checkout-button">Proceder al pago</button>
    </div>
  `;
  
  cartContainer.innerHTML = html;
  
  // Add checkout button event listener
  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) {
    checkoutButton.addEventListener('click', function() {
      window.location.href = '/checkout';
    });
  }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
  // Add event listeners to all add-to-cart buttons
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function() {
      const id = this.getAttribute('data-id');
      const title = this.getAttribute('data-title');
      const price = parseFloat(this.getAttribute('data-price'));
      addToCart(id, title, price);
    });
  });
  
  // Render cart if on cart page
  if (document.getElementById('cart-container')) {
    renderCart();
  }
});