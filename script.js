// CONFIGURACIÓN DE ACCESIBILIDAD (Variables globales)
// ==============================================
let darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';
let screenReaderEnabled = localStorage.getItem('screenReader') === 'enabled';
let speechSynthesis = window.speechSynthesis || null;

document.addEventListener('DOMContentLoaded', function () {

  


    initAccessibility();

document.querySelector('.quantity-btn.plus')?.addEventListener('click', incrementQuantity);
  document.querySelector('.quantity-btn.minus')?.addEventListener('click', decrementQuantity);
  
  // Validar entrada manual
  document.getElementById('quantity')?.addEventListener('input', function() {
    if (this.value < 1) this.value = 1;
  });
  
  // Botón Comprar ahora (versión moderna)
  document.getElementById('buyNowBtn')?.addEventListener('click', buyNow);


    
    // Menú móvil
    const mobileMenu = document.getElementById('mobile-menu');
    const navBottom = document.querySelector('.nav-bottom');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', function () {
            this.classList.toggle('active');
            navBottom.classList.toggle('active');

            const bars = this.querySelectorAll('.bar');
            if (this.classList.contains('active')) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bars[0].style.transform = 'rotate(0) translate(0, 0)';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'rotate(0) translate(0, 0)';
            }
        });
    }

    // Dropdown en cuenta (tanto en login como logout)
    const accountBtn = document.querySelector('.account-btn');

    if (accountBtn) {
        const dropdown = accountBtn.closest('.account-dropdown');
        const guestMenu = dropdown.querySelector('#accountGuest');
        const loggedMenu = dropdown.querySelector('#accountLogged');
        const dropdownUserName = document.getElementById('dropdownUserName');
        const session = JSON.parse(localStorage.getItem('session'));
        const user = JSON.parse(localStorage.getItem('user'));

        // Asegurar que estén ocultos al inicio
        if (guestMenu) guestMenu.style.display = 'none';
        if (loggedMenu) loggedMenu.style.display = 'none';

        // Mostrar nombre si hay sesión
        if (session && user && dropdownUserName) {
            dropdownUserName.textContent = user.name;
        }

        accountBtn.addEventListener('click', function (e) {
            e.preventDefault();
            dropdown.classList.toggle('active');

            const isActive = dropdown.classList.contains('active');

            if (isActive) {
                if (session && user) {
                    if (loggedMenu) loggedMenu.style.display = 'flex';
                    if (guestMenu) guestMenu.style.display = 'none';
                } else {
                    if (guestMenu) guestMenu.style.display = 'flex';
                    if (loggedMenu) loggedMenu.style.display = 'none';
                }
            } else {
                if (guestMenu) guestMenu.style.display = 'none';
                if (loggedMenu) loggedMenu.style.display = 'none';
            }
        });

        // Botón cerrar sesión
        const logoutBtn = document.getElementById('dropdownLogout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                localStorage.removeItem('session');
                window.location.href = 'login.html';
            });
        }
    }

    // Acordeón FAQ
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isOpen = question.classList.contains('active');
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.classList.remove('show');
            });
            if (!isOpen) {
                question.classList.add('active');
                answer.classList.add('show');
            }
        });
    });

    // Scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (navBottom) navBottom.classList.remove('active');
                const bars = mobileMenu?.querySelectorAll('.bar');
                if (bars) {
                    bars[0].style.transform = 'rotate(0) translate(0, 0)';
                    bars[1].style.opacity = '1';
                    bars[2].style.transform = 'rotate(0) translate(0, 0)';
                }
                window.scrollTo({ top: targetElement.offsetTop - 120, behavior: 'smooth' });
            }
        });
    });

    // Animación al hacer scroll
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.benefit-item, .testimonial, .faq-item');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    const animatedElements = document.querySelectorAll('.benefit-item, .testimonial, .faq-item');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);

    // Estilo navbar
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function () {
            navbar.style.boxShadow = window.scrollY > 50 ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none';
        });
    }

    // === REGISTRO ===
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const passwordError = document.getElementById('passwordError');
        const confirmPasswordError = document.getElementById('confirmPasswordError');

        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', function () {
                const input = this.closest('.password-input').querySelector('input');
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.querySelector('i').classList.toggle('fa-eye');
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
        });

        function showError(inputElement, errorElement, message) {
            inputElement.classList.add('input-error');
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        function clearError(inputElement, errorElement) {
            inputElement.classList.remove('input-error');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }

        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let isValid = true;

            if (nameInput.value.trim() === '') {
                showError(nameInput, nameError, 'Por favor ingresa tu nombre');
                isValid = false;
            } else {
                clearError(nameInput, nameError);
            }

            if (emailInput.value.trim() === '') {
                showError(emailInput, emailError, 'Por favor ingresa tu correo electrónico');
                isValid = false;
            } else if (!/^\S+@\S+\.\S+$/.test(emailInput.value)) {
                showError(emailInput, emailError, 'Por favor ingresa un correo válido');
                isValid = false;
            } else {
                clearError(emailInput, emailError);
            }

            if (passwordInput.value.length < 6) {
                showError(passwordInput, passwordError, 'La contraseña debe tener al menos 6 caracteres');
                isValid = false;
            } else {
                clearError(passwordInput, passwordError);
            }

            if (confirmPasswordInput.value !== passwordInput.value) {
                showError(confirmPasswordInput, confirmPasswordError, 'Las contraseñas no coinciden');
                isValid = false;
            } else {
                clearError(confirmPasswordInput, confirmPasswordError);
            }

            if (isValid) {
                const userData = {
                  name: nameInput.value,
                  email: emailInput.value,
                  password: passwordInput.value
                };
              
                localStorage.setItem('user', JSON.stringify(userData));
              
                const snackbar = document.getElementById('snackbar');
                snackbar.classList.add('show');
              
                setTimeout(() => {
                  snackbar.classList.remove('show');
                  window.location.href = 'login.html';
                }, 2500);
              }
              
        });
    }

    // === LOGIN ===
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginEmail = document.getElementById('loginEmail');
        const loginPassword = document.getElementById('loginPassword');
        const loginError = document.getElementById('loginError');
        const togglePassword = document.getElementById('togglePassword');

        if (togglePassword) {
            togglePassword.addEventListener('click', function () {
                const input = loginPassword;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                this.querySelector('i').classList.toggle('fa-eye');
                this.querySelector('i').classList.toggle('fa-eye-slash');
            });
        }

        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const savedUser = JSON.parse(localStorage.getItem('user'));

            if (!savedUser) {
                loginError.textContent = 'No hay usuarios registrados. Crea una cuenta primero.';
                loginError.style.display = 'block';
                return;
            }

            const email = loginEmail.value.trim();
            const password = loginPassword.value;

            if (email === savedUser.email && password === savedUser.password) {
                localStorage.setItem('session', JSON.stringify({ email: savedUser.email }));

                alert('Inicio de sesión exitoso.');
                window.location.href = 'index.html';
            } else {
                loginError.textContent = 'Correo o contraseña incorrectos.';
                loginError.style.display = 'block';
            }
        });
    }

    // FUNCIONES DE ACCESIBILIDAD
    // ==============================================
    
    function initAccessibility() {
        // Configurar modo oscuro inicial
        if (darkModeEnabled) {
            document.body.classList.add('dark-mode');
        }
        
        // Configurar toggles
        const darkModeToggle = document.getElementById('darkModeToggle');
        const screenReaderToggle = document.getElementById('screenReaderToggle');
        
        if (darkModeToggle) {
            darkModeToggle.checked = darkModeEnabled;
            darkModeToggle.addEventListener('change', toggleDarkMode);
        }
        
        if (screenReaderToggle) {
            screenReaderToggle.checked = screenReaderEnabled;
            screenReaderToggle.addEventListener('change', toggleScreenReader);
            
            if (screenReaderEnabled) {
                enableScreenReader();
            }
        }
    }
    
    function toggleDarkMode(e) {
    darkModeEnabled = e.target.checked;
    localStorage.setItem('darkMode', darkModeEnabled ? 'enabled' : 'disabled');
    localStorage.setItem('theme', darkModeEnabled ? 'dark' : 'light');  // <- NUEVO
    
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
        speak("Modo oscuro activado");
    } else {
        document.body.classList.remove('dark-mode');
        speak("Modo oscuro desactivado");
    }
}

    
    function toggleScreenReader(e) {
        screenReaderEnabled = e.target.checked;
        localStorage.setItem('screenReader', screenReaderEnabled ? 'enabled' : 'disabled');
        
        if (screenReaderEnabled) {
            enableScreenReader();
        } else {
            disableScreenReader();
        }
    }
    
    function enableScreenReader() {
  if (!speechSynthesis) {
    console.warn("La síntesis de voz no está disponible");
    return;
  }
  
  speechSynthesis.cancel();
  document.addEventListener('click', handleScreenReaderClick, true);
  document.addEventListener('focus', handleScreenReaderFocus, true);
  speak("Lector para ciegos activado");
}
    
    function disableScreenReader() {
  if (speechSynthesis) {
    speechSynthesis.cancel();
  }
  document.removeEventListener('click', handleScreenReaderClick, true);
  document.removeEventListener('focus', handleScreenReaderFocus, true);
  speak("Lector para ciegos desactivado");
}
    
    function handleScreenReaderClick(e) {
        if (!screenReaderEnabled) return;
        
        const element = e.target;
        if (shouldSkipElement(element)) return;
        
        const textToSpeak = getAccessibleText(element);
        if (textToSpeak) {
            e.stopPropagation();
            speak(textToSpeak);
        }
    }
    
    function handleScreenReaderFocus(e) {
        if (!screenReaderEnabled) return;
        
        const element = e.target;
        if (shouldSkipElement(element)) return;
        
        const textToSpeak = getAccessibleText(element);
        if (textToSpeak) {
            speak(textToSpeak);
        }
    }
    
    function shouldSkipElement(element) {
        return (
            element.isContentEditable ||
            ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(element.tagName) ||
            element.hasAttribute('aria-hidden') ||
            element.getAttribute('role') === 'presentation'
        );
    }
    
    function getAccessibleText(element) {
        const attributes = ['aria-label', 'alt', 'title', 'placeholder'];
        for (const attr of attributes) {
            const value = element.getAttribute(attr);
            if (value && value.trim() !== '') return value.trim();
        }
        
        if (element.textContent && element.textContent.trim() !== '') {
            return element.textContent.trim().replace(/\s+/g, ' ');
        }
        
        return null;
    }
    
    function speak(text) {
        if (!screenReaderEnabled || !speechSynthesis) return;
        
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        
        utterance.onerror = function(event) {
            console.error('Error en síntesis de voz:', event);
        };
        
        speechSynthesis.speak(utterance);
    }



    // Función para mostrar la imagen grande
function showLargeImage(imageUrl) {
  const largeImageContainer = document.getElementById('largeImageContainer');
  const largeImage = document.getElementById('largeImage');
  
  largeImage.src = imageUrl;
  largeImageContainer.style.display = 'flex';
  
  // Cerrar al hacer clic fuera de la imagen
  largeImageContainer.onclick = function(e) {
    if (e.target === largeImageContainer) {
      hideLargeImage();
    }
  };
  
  // Cerrar con la tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideLargeImage();
    }
  });
}

// Función para ocultar la imagen grande
function hideLargeImage() {
  document.getElementById('largeImageContainer').style.display = 'none';
}

// Modifica tu función changeImage existente para que también muestre la imagen grande
function changeImage(element, newImageSrc) {
  // Tu código existente para cambiar la imagen principal...
  
  // Muestra también la imagen ampliada
  showLargeImage(newImageSrc);
}



const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
} else {
    document.body.classList.remove('dark-mode');
}



    
    // Limpiar al cerrar la página
    window.addEventListener('beforeunload', function() {
        if (speechSynthesis) {
            speechSynthesis.cancel();
        }
    });
    
    // ==============================================
    // FIN DE FUNCIONES DE ACCESIBILIDAD

    


    // Ordenamiento de productos
  const sortBtn = document.querySelector('.sort-btn');
  const sortOptions = document.querySelectorAll('.sort-dropdown-content a');
  const productCards = document.querySelectorAll('.product-card');
  const productsGrid = document.querySelector('.products-grid');
  
  sortOptions.forEach(option => {
    option.addEventListener('click', function(e) {
      e.preventDefault();
      const sortType = this.getAttribute('data-sort');
      sortProducts(sortType);
      sortBtn.innerHTML = this.textContent + ' <i class="fas fa-chevron-down"></i>';
    });
  });

  function sortProducts(sortType) {
    const products = Array.from(productCards);
    
    products.sort((a, b) => {
      switch(sortType) {
        case 'price-asc':
          return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
        case 'price-desc':
          return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
        case 'name-asc':
          return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
        case 'name-desc':
          return b.getAttribute('data-name').localeCompare(a.getAttribute('data-name'));
        case 'bestsellers':
          return parseInt(b.getAttribute('data-sales')) - parseInt(a.getAttribute('data-sales'));
        case 'featured':
          return b.getAttribute('data-featured') === 'true' ? 1 : -1;
        case 'oldest':
          return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
        case 'newest':
          return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
        default:
          return 0;
      }
    });

    // Limpiar el grid
    while (productsGrid.firstChild) {
      productsGrid.removeChild(productsGrid.firstChild);
    }

    // Agregar productos ordenados
    products.forEach(product => {
      productsGrid.appendChild(product);
    });
  }

  // Botón agregar al carrito
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productCard = this.closest('.product-card');
      const productName = productCard.querySelector('.product-title').textContent;
      const productPrice = productCard.querySelector('.current-price').textContent;
      
      alert(`Agregado al carrito: ${productName} - ${productPrice}`);
      // Aquí puedes agregar la lógica real para agregar al carrito
    });
  });



  const carousel = document.querySelector('.simple-carousel');
  const slides = document.querySelectorAll('.simple-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  let currentIndex = 0;
  const totalSlides = slides.length;

  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentIndex);
    });
    
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  // Agregar clic a los indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
    });
  });

  // Auto-avance cada 5 segundos (opcional)
  setInterval(nextSlide, 5000);





  // Carrito de compras
  const cartBtn = document.querySelector('.cart-btn');
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartOverlay = document.querySelector('.cart-overlay');
  const closeCartBtn = document.querySelector('.close-cart');
  const addToCartBtn = document.querySelector('.add-to-cart');
  
  // Carrito
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Abrir carrito
  if(cartBtn) {
    cartBtn.addEventListener('click', function() {
      cartSidebar.classList.add('active');
      cartOverlay.classList.add('active');
      updateCartDisplay();
    });
  }
  
  // Cerrar carrito
  if(closeCartBtn) {
    closeCartBtn.addEventListener('click', function() {
      cartSidebar.classList.remove('active');
      cartOverlay.classList.remove('active');
    });
  }
  
  // Agregar al carrito
  if(addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      const product = {
        name: 'KIT LUMINEX PRO-WHITE',
        price: 1299,
        quantity: parseInt(document.getElementById('quantity').value) || 1,
        image: document.getElementById('mainImage').src
      };
      
      addToCart(product);
      alert(`Se agregaron ${product.quantity} unidades al carrito`);
    });
  }
  
  // Función para agregar productos
  function addToCart(product) {
    const existingIndex = cart.findIndex(item => item.name === product.name);
    
    if(existingIndex !== -1) {
      cart[existingIndex].quantity += product.quantity;
    } else {
      cart.push(product);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
  }
  
  // Actualizar contador
  function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = totalItems;
    });
  }
  
  // Actualizar vista del carrito
  function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal-amount');
    const totalElement = document.querySelector('.total-amount');
    
    if(!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      const itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h4>${item.name}</h4>
          <div class="item-price">$${item.price.toFixed(2)}</div>
          <div class="item-quantity">
            <button class="quantity-btn minus" data-name="${item.name}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-btn plus" data-name="${item.name}">+</button>
          </div>
        </div>
        <button class="remove-item" data-name="${item.name}"><i class="fas fa-trash"></i></button>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
    
    if(subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    if(totalElement) totalElement.textContent = `$${subtotal.toFixed(2)}`;
    
    // Agregar eventos a los botones del carrito
    document.querySelectorAll('.minus').forEach(btn => {
      btn.addEventListener('click', function() {
        const productName = this.dataset.name;
        updateQuantity(productName, -1);
      });
    });
    
    document.querySelectorAll('.plus').forEach(btn => {
      btn.addEventListener('click', function() {
        const productName = this.dataset.name;
        updateQuantity(productName, 1);
      });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function() {
        const productName = this.dataset.name;
        removeItem(productName);
      });
    });
  }
  
  function updateQuantity(name, change) {
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1) {
      cart[index].quantity += change;
      
      if(cart[index].quantity < 1) {
        cart.splice(index, 1);
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCartCount();
      updateCartDisplay();
    }
  }
  
  function removeItem(name) {
    cart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
  }
  
  // Inicializar
  updateCartCount();





  function changeImage(thumbnail, newImageSrc) {
    // Remover clase active de todas las miniaturas
    document.querySelectorAll('.thumbnail').forEach(img => {
      img.classList.remove('active');
    });
    
    // Agregar clase active a la miniatura clickeada
    thumbnail.classList.add('active');
    
    // Cambiar la imagen principal
    document.getElementById('mainImage').src = newImageSrc;
  }
  
  // Función para abrir el modal con la imagen ampliada
  function openModal(imageSrc) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modal.style.display = "block";
    modalImg.src = imageSrc;
  }
  
  // Función para cerrar el modal
  function closeModal() {
    document.getElementById('imageModal').style.display = "none";
  }
  
  // Funciones para manejar la cantidad
  function incrementQuantity() {
  const quantityInput = document.getElementById('quantity');
  let currentValue = parseInt(quantityInput.value) || 1;
  quantityInput.value = currentValue + 1;
}

function decrementQuantity() {
  const quantityInput = document.getElementById('quantity');
  let currentValue = parseInt(quantityInput.value) || 1;
  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
}
  
  // Función para agregar al carrito
  function addToCart() {
    const product = {
      name: 'KIT LUMINEX PRO-WHITE',
      price: 1299,
      quantity: parseInt(document.getElementById('quantity').value),
      image: document.getElementById('mainImage').src
    };
    
    // Aquí iría la lógica para agregar al carrito
    alert(`Se agregaron ${product.quantity} unidades al carrito`);
    
    // Actualizar el contador del carrito (necesitarías implementar esta función)
    updateCartCount();
  }
  
  // Función para comprar ahora
  function buyNow() {
  try {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    localStorage.setItem('productQuantity', quantity);
    window.location.href = "checkout.html";
  } catch (error) {
    console.error("Error en buyNow:", error);
    alert("Ocurrió un error al procesar la compra");
  }
}
  
  // Cerrar el modal si se hace click fuera de la imagen
  window.onclick = function(event) {
    const modal = document.getElementById('imageModal');
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }







    

});
// Cerrar dropdown si se hace clic fuera
document.addEventListener('click', function (e) {
    const dropdown = document.querySelector('.account-dropdown');
    const guestMenu = document.getElementById('accountGuest');
    const loggedMenu = document.getElementById('accountLogged');
    const accountBtn = document.querySelector('.account-btn');

    if (dropdown && !dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        if (guestMenu) guestMenu.style.display = 'none';
        if (loggedMenu) loggedMenu.style.display = 'none';
    }
});




// Accesibilidad
document.getElementById('accessibilityBtn').addEventListener('click', function() {
  const panel = document.getElementById('accessibilityPanel');
  panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
});

// Cargar preferencias guardadas
function loadAccessibilityPreferences() {
  const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences')) || {};
  
  if (preferences.fontSize) {
    document.getElementById('fontSize').value = preferences.fontSize;
    applyFontSize(preferences.fontSize);
  }
  
  if (preferences.themeMode) {
    document.getElementById('themeMode').value = preferences.themeMode;
    applyThemeMode(preferences.themeMode);
  }
  
  if (preferences.reduceMotion) {
    document.getElementById('reduceMotion').checked = preferences.reduceMotion;
    applyReduceMotion(preferences.reduceMotion);
  }
}

// Aplicar preferencias
function applyFontSize(size) {
  document.body.classList.remove('font-small', 'font-medium', 'font-large', 'font-xlarge');
  document.body.classList.add(`font-${size}`);
}

function applyThemeMode(mode) {
  // Primero removemos todas las clases de tema
  document.body.classList.remove('dark-mode', 'light-mode');
  
  if (mode === 'device') {
    // Usar el tema del dispositivo
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  } else if (mode === 'dark') {
    document.body.classList.add('dark-mode');
  } else {
    // 'light' es el valor por defecto
    document.body.classList.add('light-mode');
  }
}

function applyContrastMode(mode) {
  document.body.classList.remove('high-contrast', 'dark-mode');
  if (mode !== 'normal') {
    document.body.classList.add(`${mode}-mode`);
  }
}

function applyReduceMotion(reduce) {
  if (reduce) {
    document.body.classList.add('reduce-motion');
  } else {
    document.body.classList.remove('reduce-motion');
  }
}

// Guardar preferencias
document.getElementById('saveAccessibility').addEventListener('click', function() {
  const preferences = {
    fontSize: document.getElementById('fontSize').value,
    themeMode: document.getElementById('themeMode').value,
    reduceMotion: document.getElementById('reduceMotion').checked
  };
  
  localStorage.setItem('accessibilityPreferences', JSON.stringify(preferences));
  
  // Aplicar cambios
  applyFontSize(preferences.fontSize);
  applyThemeMode(preferences.themeMode);
  applyReduceMotion(preferences.reduceMotion);
  
  // Cerrar panel
  document.getElementById('accessibilityPanel').style.display = 'none';
});

// Cargar preferencias al iniciar
window.addEventListener('DOMContentLoaded', function() {
    loadAccessibilityPreferences();
    const preferences = JSON.parse(localStorage.getItem('accessibilityPreferences')) || {};
  if (preferences.themeMode === 'device') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      applyThemeMode('device');
    });
  }
});