// Funcionalidad de accesibilidad
function loadAccessibilityPreferences() {
  // Cargar preferencias guardadas
  const fontSize = localStorage.getItem('fontSize') || 'medium';
  const themeMode = localStorage.getItem('themeMode') || 'device';
  const reduceMotion = localStorage.getItem('reduceMotion') === 'true';
  
  applyFontSize(fontSize);
  applyThemeMode(themeMode);
  applyReduceMotion(reduceMotion);
  
  // Actualizar controles del panel
  if (document.getElementById('fontSize')) {
    document.getElementById('fontSize').value = fontSize;
  }
  if (document.getElementById('themeMode')) {
    document.getElementById('themeMode').value = themeMode;
  }
  if (document.getElementById('reduceMotion')) {
    document.getElementById('reduceMotion').checked = reduceMotion;
  }
}

function setupAccessibilityPanel() {
  const accessibilityBtn = document.getElementById('accessibilityBtn');
  const accessibilityPanel = document.getElementById('accessibilityPanel');
  const saveBtn = document.getElementById('saveAccessibility');
  
  // Mostrar/ocultar panel
  if (accessibilityBtn && accessibilityPanel) {
    accessibilityBtn.addEventListener('click', function() {
      accessibilityPanel.style.display = accessibilityPanel.style.display === 'block' ? 'none' : 'block';
    });
  }
  // Guardar preferencias
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const fontSize = document.getElementById('fontSize').value;
      const themeMode = document.getElementById('themeMode').value;
      const reduceMotion = document.getElementById('reduceMotion').checked;
      
      // Guardar en localStorage
      localStorage.setItem('fontSize', fontSize);
      localStorage.setItem('themeMode', themeMode);
      localStorage.setItem('reduceMotion', reduceMotion);
      
      // Aplicar cambios
      applyFontSize(fontSize);
      applyThemeMode(themeMode);
      applyReduceMotion(reduceMotion);
      
      // Cerrar panel
      accessibilityPanel.style.display = 'none';
    });
  }
}

function applyFontSize(size) {
  const body = document.body;
  body.className = body.className.replace(/\bfont-\w+\b/g, '');
  body.classList.add('font-' + size);
}

function setupAccessibility() {
  // Configurar el panel de accesibilidad
  const accessibilityBtn = document.getElementById('accessibilityBtn');
  const accessibilityPanel = document.getElementById('accessibilityPanel');
  const saveBtn = document.getElementById('saveAccessibility');
  const themeModeSelect = document.getElementById('themeMode');
  
  // Mostrar/ocultar panel
  if (accessibilityBtn && accessibilityPanel) {
    accessibilityBtn.addEventListener('click', function() {
      accessibilityPanel.style.display = accessibilityPanel.style.display === 'block' ? 'none' : 'block';
    });
  }
  
  // Cargar preferencias guardadas
  const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences')) || {};
  const themeMode = preferences.themeMode || 'device';
  
  if (themeModeSelect) {
    themeModeSelect.value = themeMode;
  }
  
  applyTheme(themeMode);
  
  // Guardar preferencias
  if (saveBtn) {
    saveBtn.addEventListener('click', function() {
      const preferences = {
        themeMode: themeModeSelect.value
      };
      
      localStorage.setItem('accessibilityPreferences', JSON.stringify(preferences));
      applyTheme(themeModeSelect.value);
      accessibilityPanel.style.display = 'none';
    });
  }
}

function applyTheme(mode) {
  // Primero removemos todas las clases de tema
  document.body.classList.remove('dark-mode', 'light-mode');
  
  if (mode === 'device') {
    // Usar el tema del dispositivo
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
    } else {
      // No es necesario añadir light-mode ya que es el estilo por defecto
    }
  } else if (mode === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    // 'light' es el valor por defecto
  }
}

// Escuchar cambios en el tema del dispositivo si está en modo automático
if (window.matchMedia) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', function(e) {
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences')) || {};
    if (preferences.themeMode === 'device') {
      applyTheme('device');
    }
  });
}

function applyThemeMode(mode) {
  const body = document.body;
  
  // Remover clases de tema existentes
  body.className = body.className.replace(/\btheme-\w+\b/g, '');
  
  if (mode === 'device') {
    // Usar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('theme-dark');
    } else {
      body.classList.add('theme-light');
    }
  } else {
    body.classList.add('theme-' + mode);
  }
}

function applyReduceMotion(reduce) {
  const body = document.body;
  if (reduce) {
    body.classList.add('reduce-motion');
  } else {
    body.classList.remove('reduce-motion');
  }
}

// Escuchar cambios en las preferencias del sistema
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (localStorage.getItem('themeMode') === 'device') {
      applyThemeMode('device');
    }
  });
}




document.addEventListener('DOMContentLoaded', function() {
  // Verificar si el usuario está logueado

  setupAccessibility();

  const session = JSON.parse(localStorage.getItem('session'));
  const loginRequired = document.getElementById('loginRequired');
  const shippingForm = document.getElementById('shippingForm');


  const user = JSON.parse(localStorage.getItem('user'));
  
  let userDataAlreadyLoaded = false;
  



  

  
  if (!session) { // Si NO hay una sesión activa
        loginRequired.style.display = 'block';
        shippingForm.style.display = 'none';
    } else { // Si SÍ hay una sesión activa
        loginRequired.style.display = 'none';
        shippingForm.style.display = 'block';
        // Rellenar datos del usuario si existen en el objeto 'user'
        if (user) { // Asegúrate de que el objeto 'user' también exista
            if (user.email) {
                document.getElementById('email').value = user.email;
            }
            if (user.name) {
                const names = user.name.split(' ');
                document.getElementById('firstName').value = names[0] || '';
                document.getElementById('lastName').value = names.slice(1).join(' ') || '';
            }
  userDataAlreadyLoaded = true;
}

  }

  // Manejar los pasos del checkout
  const steps = document.querySelectorAll('.step');
  const stepContents = document.querySelectorAll('.step-content');
  
  steps.forEach(step => {
    step.addEventListener('click', function() {
      const stepNumber = this.getAttribute('data-step');
      goToStep(stepNumber);
    });
  });

  // Botón continuar a pago
  document.getElementById('continueToPayment')?.addEventListener('click', function(event) {
    event.preventDefault();
    const form = document.getElementById('shippingForm');

    // Usa la validación nativa Bootstrap
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
    } else {
        // Si pasa la validación, actualiza vista previa y avanza
        updateShippingPreview();
        goToStep(2);
    }
});


  // Tabs de métodos de pago
  const paymentTabs = document.querySelectorAll('.payment-tab');
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // Cambiar pestaña activa
      paymentTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      
      // Mostrar contenido correspondiente
      document.querySelectorAll('.payment-content').forEach(content => {
        content.classList.remove('active');
      });
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Botón revisar pedido (tarjeta)
  document.getElementById('reviewOrder')?.addEventListener('click', function() {
    if (validatePaymentForm()) {
      updatePaymentPreview('Tarjeta de crédito/débito');
      goToStep(3);
    }
  });

  // Botón revisar pedido (efectivo)
  document.getElementById('reviewOrderCash')?.addEventListener('click', function() {
    updatePaymentPreview('Efectivo');
    goToStep(3);
  });

  // Botón confirmar pedido
  document.getElementById('confirmOrder')?.addEventListener('click', function() {
    // Aquí iría la lógica para procesar el pago
    goToStep(4);
    
    // Mostrar detalles en la confirmación
    updateConfirmationDetails();
  });

  // Actualizar resumen del pedido
  updateOrderSummary();

  // Funciones auxiliares
  function goToStep(stepNumber) {
    // Actualizar pasos activos
    steps.forEach(step => {
      if (parseInt(step.getAttribute('data-step')) <= stepNumber) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // Mostrar contenido del paso
    stepContents.forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}-content`).classList.add('active');
  }

  function validateShippingForm() {
    // Validación simple - en producción sería más completa
    const requiredFields = shippingForm.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#e74c3c';
        isValid = false;
      } else {
        field.style.borderColor = '#ddd';
      }
    });
    
    if (!isValid) {
      alert('Por favor completa todos los campos requeridos');
    }
    
    return isValid;
  }

  function validatePaymentForm() {
    // Validación simple - en producción sería más completa
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiryDate = document.getElementById('expiryDate').value.trim();
    const cvv = document.getElementById('cvv').value.trim();
    const cardName = document.getElementById('cardName').value.trim();
    
    if (!cardNumber || !expiryDate || !cvv || !cardName) {
      alert('Por favor completa todos los campos de la tarjeta');
      return false;
    }
    
    // Validación básica de formato
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
      alert('Por favor ingresa un número de tarjeta válido');
      return false;
    }
    
    if (!/^\d{3,4}$/.test(cvv)) {
      alert('Por favor ingresa un CVV válido');
      return false;
    }
    
    return true;
  }

  function updateShippingPreview() {
    const shippingAddress = `
      <p>${document.getElementById('firstName').value} ${document.getElementById('lastName').value}</p>
      <p>${document.getElementById('street').value} ${document.getElementById('number').value}</p>
      <p>${document.getElementById('neighborhood').value}, ${document.getElementById('city').value}</p>
      <p>${document.getElementById('state').value}, ${document.getElementById('zipCode').value}</p>
      <p>${document.getElementById('country').value}</p>
      <p>Tel: ${document.getElementById('phone').value}</p>
    `;
    
    document.getElementById('shippingAddressPreview').innerHTML = shippingAddress;
  }

  function updatePaymentPreview(method) {
    document.getElementById('paymentMethodPreview').innerHTML = `
      <p><strong>${method}</strong></p>
      ${method === 'Tarjeta de crédito/débito' ? `
        <p>Terminada en ${document.getElementById('cardNumber').value.slice(-4)}</p>
        <p>${document.getElementById('cardName').value}</p>
      ` : ''}
    `;
  }

  function updateConfirmationDetails() {
    document.getElementById('confirmationAddress').innerHTML = 
      document.getElementById('shippingAddressPreview').innerHTML;
  }

  function updateOrderSummary() {
  // Obtener la cantidad guardada en localStorage
  const quantity = parseInt(localStorage.getItem('productQuantity')) || 1;
  const price = 1299;
  const subtotal = price * quantity;
  const shipping = 0; // Envío gratis
  const total = subtotal + shipping;
  
  // Actualizar resumen lateral
  const summaryItems = document.querySelector('.summary-items');
  summaryItems.innerHTML = `
    <div class="summary-item">
      <div class="summary-item-name">KIT LUMINEX PRO-WHITE x${quantity}</div>
      <div class="summary-item-price">$${subtotal.toFixed(2)}</div>
    </div>
  `;
  
  // Actualizar cantidades en el resumen principal
  document.getElementById('itemQuantity').textContent = quantity;
  document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('shipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('total').textContent = `$${total.toFixed(2)}`;
  
  // Actualizar resumen lateral
  document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById('summaryShipping').textContent = `$${shipping.toFixed(2)}`;
  document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
}

  // Formatear inputs de tarjeta
  document.getElementById('cardNumber')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '');
    if (value.length > 16) value = value.substr(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
  });

  document.getElementById('expiryDate')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substr(0, 2) + '/' + value.substr(2, 2);
    }
    e.target.value = value;
  });

  document.getElementById('cvv')?.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').substr(0, 4);
  });
});