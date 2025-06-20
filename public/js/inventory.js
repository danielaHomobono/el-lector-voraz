/**
 * Inventory page functionality
 */

// Polyfill for :contains selector if jQuery is not available
if (!window.jQuery) {
  document.querySelectorAll = function(selector) {
    if (selector.includes(':contains')) {
      const parts = selector.split(':contains(');
      const baseSelector = parts[0];
      const searchText = parts[1].slice(0, -1).replace(/['"]/g, '');
      
      const elements = document.querySelectorAll(baseSelector);
      return Array.from(elements).filter(el => 
        el.textContent.includes(searchText)
      );
    }
    return document.querySelectorAll(selector);
  };
}

// Find book row by ISBN
function findBookRowByIsbn(isbn) {
  const rows = document.querySelectorAll('table tbody tr');
  for (const row of rows) {
    const isbnCell = row.querySelector('td:nth-child(3)');
    if (isbnCell && isbnCell.textContent === isbn) {
      return row;
    }
  }
  return null;
}

// Edit book function
async function editBook(isbn) {
  // Find the book row
  const bookRow = findBookRowByIsbn(isbn);
  if (!bookRow) {
    showMessage('No se pudo encontrar el libro', 'error');
    return;
  }
  
  const cells = bookRow.querySelectorAll('td');
  const title = cells[0].textContent;
  const author = cells[1].textContent;
  const category = cells[3].textContent;
  const price = cells[4].textContent.replace('$', '');
  const stock = cells[5].textContent;
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'edit-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h3>Editar Libro</h3>
      <form id="editBookForm">
        <div class="form-group">
          <label for="editTitle">Título:</label>
          <input id="editTitle" type="text" value="${title}" required>
        </div>
        <div class="form-group">
          <label for="editAuthor">Autor:</label>
          <input id="editAuthor" type="text" value="${author}" required>
        </div>
        <div class="form-group">
          <label for="editIsbn">ISBN:</label>
          <input id="editIsbn" type="text" value="${isbn}" required>
        </div>
        <div class="form-group">
          <label for="editCategory">Categoría:</label>
          <select id="editCategory" required>
            <option value="Ficción" ${category === 'Ficción' ? 'selected' : ''}>Ficción</option>
            <option value="Novela" ${category === 'Novela' ? 'selected' : ''}>Novela</option>
            <option value="Biografía" ${category === 'Biografía' ? 'selected' : ''}>Biografía</option>
          </select>
        </div>
        <div class="form-group">
          <label for="editPrice">Precio:</label>
          <input id="editPrice" type="number" step="0.01" value="${price}" required>
        </div>
        <div class="form-group">
          <label for="editStock">Stock:</label>
          <input id="editStock" type="number" value="${stock}" required>
        </div>
        <div class="form-actions">
          <button type="submit" class="save-btn">Guardar</button>
          <button type="button" class="cancel-btn">Cancelar</button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Handle modal close
  modal.querySelector('.cancel-btn').addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Handle form submission
  modal.querySelector('#editBookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
      title: document.getElementById('editTitle').value,
      author: document.getElementById('editAuthor').value,
      isbn: document.getElementById('editIsbn').value,
      category: document.getElementById('editCategory').value,
      price: parseFloat(document.getElementById('editPrice').value),
      stock: parseInt(document.getElementById('editStock').value),
      type: 'book'
    };
    
    showLoading();
    
    try {
      const response = await fetch(`/api/products/${isbn}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-voraz-key': API_KEY
        },
        body: JSON.stringify(formData)
      });
      
      hideLoading();
      
      if (response.ok) {
        showMessage('Libro actualizado exitosamente', 'success');
        document.body.removeChild(modal);
        window.location.reload();
      } else {
        const data = await response.json();
        showMessage('Error: ' + (data.error || 'No se pudo actualizar el libro'), 'error');
      }
    } catch (error) {
      hideLoading();
      showMessage('Error al actualizar el libro', 'error');
    }
  });
}

// Delete book function
async function deleteBook(isbn) {
  if (!confirm('¿Seguro que quieres eliminar este libro?')) return;
  
  showLoading();
  
  try {
    const response = await fetch(`/api/products/${isbn}`, {
      method: 'DELETE',
      headers: {
        'x-voraz-key': API_KEY
      }
    });
    
    hideLoading();
    
    if (response.ok) {
      showMessage('Libro eliminado exitosamente', 'success');
      window.location.reload();
    } else {
      const data = await response.json();
      showMessage('Error: ' + (data.error || 'No se pudo eliminar el libro'), 'error');
    }
  } catch (error) {
    hideLoading();
    showMessage('Error al eliminar el libro', 'error');
  }
}