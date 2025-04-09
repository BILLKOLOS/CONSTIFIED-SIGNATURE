document.addEventListener('DOMContentLoaded', function() {
    // Site-wide configuration
    const SITE_CONFIG = {
      brandName: 'CONSTIFIED SIGNATURE',
      currency: {
        default: 'NGN',
        supported: ['NGN', 'USD', 'GHS', 'XOF'] // Naira, US Dollar, Ghana Cedi, CFA Franc
      },
      contact: {
        phone: '+2349030841701',
        location: 'Imo State, Orlu, Nigeria'
      }
    };
  
    // Initialize header components
    initMobileMenu();
    initCurrencySwitcher();
    
    // Initialize page-specific components
    initFaqAccordion();
    initProductGallery();
    initQuantityControls();
    initCheckoutProcess();
    initProductFilters();
    initSliders();
    
    // Setup global event listeners
    setupNewsletterForm();
    initWhatsAppContact();
  
    // Mobile menu functionality
    function initMobileMenu() {
      const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
      const mainNav = document.querySelector('.main-nav');
      const body = document.body;
      
      if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
          mainNav.classList.toggle('active');
          body.classList.toggle('menu-open'); // Prevent scrolling when menu is open
          
          // Toggle accessibility attributes
          const isExpanded = mainNav.classList.contains('active');
          mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
          mainNav.setAttribute('aria-hidden', !isExpanded);
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
          if (mainNav.classList.contains('active') && 
              !mainNav.contains(event.target) && 
              !mobileMenuToggle.contains(event.target)) {
            mainNav.classList.remove('active');
            body.classList.remove('menu-open');
            mobileMenuToggle.setAttribute('aria-expanded', false);
            mainNav.setAttribute('aria-hidden', true);
          }
        });
      }
    }
    
    // FAQ accordion
    function initFaqAccordion() {
      const faqItems = document.querySelectorAll('.faq-item');
      
      if (faqItems.length > 0) {
        faqItems.forEach(item => {
          const question = item.querySelector('.faq-question');
          const answer = item.querySelector('.faq-answer');
          const toggle = item.querySelector('.faq-toggle');
          
          if (question && answer && toggle) {
            // Set initial ARIA attributes
            question.setAttribute('aria-expanded', 'false');
            answer.setAttribute('aria-hidden', 'true');
            
            question.addEventListener('click', () => {
              // Close all other items
              faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                  const otherQuestion = otherItem.querySelector('.faq-question');
                  const otherAnswer = otherItem.querySelector('.faq-answer');
                  const otherToggle = otherItem.querySelector('.faq-toggle');
                  
                  otherItem.classList.remove('active');
                  otherAnswer.style.maxHeight = null;
                  otherToggle.innerHTML = '<i class="fas fa-plus"></i>';
                  
                  // Update ARIA attributes
                  otherQuestion.setAttribute('aria-expanded', 'false');
                  otherAnswer.setAttribute('aria-hidden', 'true');
                }
              });
              
              // Toggle current item
              const isActive = item.classList.toggle('active');
              
              // Update ARIA attributes and styling
              question.setAttribute('aria-expanded', isActive);
              answer.setAttribute('aria-hidden', !isActive);
              
              if (isActive) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
                toggle.innerHTML = '<i class="fas fa-minus"></i>';
              } else {
                answer.style.maxHeight = null;
                toggle.innerHTML = '<i class="fas fa-plus"></i>';
              }
            });
          }
        });
      }
    }
    
    // Product image gallery with zoom functionality
    function initProductGallery() {
      const mainImage = document.querySelector('.product-main-image img');
      const thumbnails = document.querySelectorAll('.product-thumbnails img');
      const zoomContainer = document.querySelector('.product-main-image');
      
      if (mainImage && thumbnails.length > 0) {
        // Set first thumbnail as active by default
        thumbnails[0].classList.add('active');
        
        thumbnails.forEach(thumbnail => {
          thumbnail.addEventListener('click', function() {
            // Update main image
            mainImage.src = this.src;
            mainImage.setAttribute('data-original', this.getAttribute('data-original') || this.src);
            
            // Update alt text for accessibility
            mainImage.alt = this.alt || 'Product image';
            
            // Remove active class from all thumbnails
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
          });
        });
        
        // Add zoom functionality if on larger screens
        if (window.innerWidth > 768 && zoomContainer) {
          zoomContainer.addEventListener('mousemove', handleZoom);
          zoomContainer.addEventListener('mouseleave', resetZoom);
        }
        
        function handleZoom(e) {
          const zoomer = this;
          const offsetX = e.offsetX;
          const offsetY = e.offsetY;
          const x = (offsetX / zoomer.offsetWidth) * 100;
          const y = (offsetY / zoomer.offsetHeight) * 100;
          
          mainImage.style.transformOrigin = x + '% ' + y + '%';
          mainImage.style.transform = 'scale(1.5)';
        }
        
        function resetZoom() {
          mainImage.style.transformOrigin = 'center center';
          mainImage.style.transform = 'scale(1)';
        }
      }
    }
    
    // Quantity input with validation
    function initQuantityControls() {
      const quantityWrappers = document.querySelectorAll('.quantity-wrapper');
      
      if (quantityWrappers.length > 0) {
        quantityWrappers.forEach(wrapper => {
          const minusBtn = wrapper.querySelector('.minus');
          const plusBtn = wrapper.querySelector('.plus');
          const input = wrapper.querySelector('input');
          
          if (minusBtn && plusBtn && input) {
            // Set default values and constraints
            const min = parseInt(input.getAttribute('min')) || 1;
            const max = parseInt(input.getAttribute('max')) || 99;
            
            // Ensure initial value is valid
            let value = parseInt(input.value) || min;
            input.value = validateQuantity(value, min, max);
            
            minusBtn.addEventListener('click', function() {
              value = parseInt(input.value) - 1;
              input.value = validateQuantity(value, min, max);
              // Trigger change event for any listeners
              input.dispatchEvent(new Event('change'));
            });
            
            plusBtn.addEventListener('click', function() {
              value = parseInt(input.value) + 1;
              input.value = validateQuantity(value, min, max);
              // Trigger change event for any listeners
              input.dispatchEvent(new Event('change'));
            });
            
            // Handle direct input
            input.addEventListener('change', function() {
              this.value = validateQuantity(parseInt(this.value) || min, min, max);
            });
            
            // Prevent non-numeric input
            input.addEventListener('keypress', function(e) {
              if (isNaN(parseInt(e.key)) && e.key !== 'Backspace' && e.key !== 'Delete') {
                e.preventDefault();
              }
            });
          }
        });
        
        function validateQuantity(val, min, max) {
          return Math.max(min, Math.min(max, val));
        }
      }
    }
    
    // Checkout process with form validation
    function initCheckoutProcess() {
      const checkoutForm = document.querySelector('.checkout-form');
      const checkoutSteps = document.querySelectorAll('.checkout-steps .step');
      
      if (checkoutForm && checkoutSteps.length > 0) {
        const nextButtons = document.querySelectorAll('.btn-next-step');
        const prevButtons = document.querySelectorAll('.btn-prev-step');
        const stepContents = document.querySelectorAll('.step-content');
        
        // Initialize the first step
        checkoutSteps[0].classList.add('active');
        stepContents[0].classList.add('active');
        
        // Set up next step buttons
        nextButtons.forEach(button => {
          button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentStep = document.querySelector('.step.active');
            const currentContent = document.querySelector('.step-content.active');
            const currentIndex = Array.from(checkoutSteps).indexOf(currentStep);
            
            // Validate current step before proceeding
            if (validateStep(currentIndex)) {
              // Move to next step
              if (currentIndex < checkoutSteps.length - 1) {
                currentStep.classList.remove('active');
                currentStep.classList.add('completed');
                checkoutSteps[currentIndex + 1].classList.add('active');
                
                currentContent.classList.remove('active');
                stepContents[currentIndex + 1].classList.add('active');
                
                // Scroll to top of form
                checkoutForm.scrollIntoView({ behavior: 'smooth' });
              }
            }
          });
        });
        
        // Set up previous step buttons
        prevButtons.forEach(button => {
          button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const currentStep = document.querySelector('.step.active');
            const currentContent = document.querySelector('.step-content.active');
            const currentIndex = Array.from(checkoutSteps).indexOf(currentStep);
            
            // Move to previous step
            if (currentIndex > 0) {
              currentStep.classList.remove('active');
              checkoutSteps[currentIndex - 1].classList.add('active');
              checkoutSteps[currentIndex - 1].classList.remove('completed');
              
              currentContent.classList.remove('active');
              stepContents[currentIndex - 1].classList.add('active');
              
              // Scroll to top of form
              checkoutForm.scrollIntoView({ behavior: 'smooth' });
            }
          });
        });
        
        // Handle payment method selection
        const paymentOptions = document.querySelectorAll('input[name="payment_method"]');
        const paymentDetails = document.querySelectorAll('.payment-details');
        
        if (paymentOptions.length > 0 && paymentDetails.length > 0) {
          paymentOptions.forEach(option => {
            option.addEventListener('change', function() {
              const selectedMethod = this.value;
              
              // Hide all payment details
              paymentDetails.forEach(detail => {
                detail.style.display = 'none';
              });
              
              // Show selected method details
              const selectedDetails = document.querySelector(`.payment-details[data-method="${selectedMethod}"]`);
              if (selectedDetails) {
                selectedDetails.style.display = 'block';
              }
            });
          });
          
          // Initialize with the first option selected
          if (paymentOptions[0]) {
            paymentOptions[0].checked = true;
            
            const initialMethod = paymentOptions[0].value;
            const initialDetails = document.querySelector(`.payment-details[data-method="${initialMethod}"]`);
            if (initialDetails) {
              initialDetails.style.display = 'block';
            }
          }
        }
        
        // Validation function for each step
        function validateStep(stepIndex) {
          const stepContent = stepContents[stepIndex];
          const requiredFields = stepContent.querySelectorAll('[required]');
          let isValid = true;
          
          requiredFields.forEach(field => {
            if (!field.value.trim()) {
              isValid = false;
              field.classList.add('error');
              
              // Show error message
              let errorMsg = field.nextElementSibling;
              if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                field.parentNode.insertBefore(errorMsg, field.nextSibling);
              }
              errorMsg.textContent = `Please enter your ${field.getAttribute('placeholder') || 'information'}`;
            } else {
              field.classList.remove('error');
              const errorMsg = field.nextElementSibling;
              if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.textContent = '';
              }
            }
          });
          
          return isValid;
        }
      }
    }
    
    // Product filters for shop page
    function initProductFilters() {
      const filterToggle = document.querySelector('.filter-toggle');
      const shopSidebar = document.querySelector('.shop-sidebar');
      const filterForm = document.querySelector('.filter-form');
      const clearFiltersBtn = document.querySelector('.clear-filters');
      
      // Mobile filter toggle
      if (filterToggle && shopSidebar) {
        filterToggle.addEventListener('click', function() {
          shopSidebar.classList.toggle('active');
          document.body.classList.toggle('filters-open');
        });
        
        // Close button within filters
        const closeFiltersBtn = document.querySelector('.close-filters');
        if (closeFiltersBtn) {
          closeFiltersBtn.addEventListener('click', function() {
            shopSidebar.classList.remove('active');
            document.body.classList.remove('filters-open');
          });
        }
      }
      
      // Filter accordion for mobile
      const filterHeadings = document.querySelectorAll('.filter-heading');
      
      if (filterHeadings.length > 0) {
        filterHeadings.forEach(heading => {
          heading.addEventListener('click', function() {
            this.parentElement.classList.toggle('expanded');
            
            const content = this.nextElementSibling;
            if (content) {
              if (this.parentElement.classList.contains('expanded')) {
                content.style.maxHeight = content.scrollHeight + 'px';
              } else {
                content.style.maxHeight = null;
              }
            }
          });
        });
      }
      
      // Handle filter form submission with URL parameters
      if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          applyFilters();
        });
        
        // Handle checkbox and range inputs
        const filterInputs = filterForm.querySelectorAll('input[type="checkbox"], input[type="range"]');
        if (filterInputs.length > 0) {
          filterInputs.forEach(input => {
            input.addEventListener('change', function() {
              // Auto-submit when changing filters
              if (input.hasAttribute('data-auto-submit')) {
                applyFilters();
              }
            });
          });
        }
        
        // Clear all filters
        if (clearFiltersBtn) {
          clearFiltersBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Reset all form elements
            filterForm.reset();
            
            // Reset any custom range sliders
            const rangeSliders = filterForm.querySelectorAll('input[type="range"]');
            rangeSliders.forEach(slider => {
              const output = document.querySelector(`output[for="${slider.id}"]`);
              if (output) {
                output.textContent = slider.value;
              }
            });
            
            // Apply cleared filters
            applyFilters();
          });
        }
        
        // Apply filters by constructing URL with parameters
        function applyFilters() {
          const formData = new FormData(filterForm);
          const params = new URLSearchParams();
          
          for (const [key, value] of formData.entries()) {
            if (value) {
              params.append(key, value);
            }
          }
          
          // Redirect to filtered results
          window.location.href = window.location.pathname + '?' + params.toString();
        }
        
        // Initialize filters from URL params on page load
        function initializeFiltersFromUrl() {
          const params = new URLSearchParams(window.location.search);
          
          // Set form values based on URL parameters
          for (const [key, value] of params.entries()) {
            const input = filterForm.querySelector(`[name="${key}"]`);
            if (input) {
              if (input.type === 'checkbox') {
                input.checked = true;
              } else {
                input.value = value;
                
                // Update any associated output elements
                const output = document.querySelector(`output[for="${input.id}"]`);
                if (output) {
                  output.textContent = value;
                }
              }
            }
          }
        }
        
        // Call on page load
        initializeFiltersFromUrl();
      }
    }
    
    // Product sliders/carousels
    function initSliders() {
      const productSliders = document.querySelectorAll('.product-slider');
      
      if (productSliders.length > 0) {
        // Check if a slider library is available
        if (typeof Swiper !== 'undefined') {
          productSliders.forEach(slider => {
            new Swiper(slider, {
              slidesPerView: 1,
              spaceBetween: 20,
              navigation: {
                nextEl: slider.querySelector('.swiper-button-next'),
                prevEl: slider.querySelector('.swiper-button-prev')
              },
              pagination: {
                el: slider.querySelector('.swiper-pagination'),
                clickable: true
              },
              breakpoints: {
                640: {
                  slidesPerView: 2
                },
                768: {
                  slidesPerView: 3
                },
                1024: {
                  slidesPerView: 4
                }
              }
            });
          });
        } else {
          console.log('Swiper library not loaded. Please include it for product sliders.');
        }
      }
      
      // Featured products slider
      const featuredSlider = document.querySelector('.featured-slider');
      if (featuredSlider && typeof Swiper !== 'undefined') {
        new Swiper(featuredSlider, {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false
          },
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          navigation: {
            nextEl: '.featured-next',
            prevEl: '.featured-prev'
          }
        });
      }
    }
    
    // Currency switcher
    function initCurrencySwitcher() {
      const currencySelector = document.querySelector('.currency-selector');
      
      if (currencySelector) {
        currencySelector.addEventListener('change', function() {
          updateCurrency(this.value);
        });
        
        // Initialize with default or stored currency
        const savedCurrency = localStorage.getItem('preferredCurrency') || SITE_CONFIG.currency.default;
        currencySelector.value = savedCurrency;
        updateCurrency(savedCurrency, false); // Don't show notification on initial load
      }
    }
    
    // Newsletter subscription
    function setupNewsletterForm() {
      const newsletterForm = document.querySelector('.newsletter-form');
      
      if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const emailInput = this.querySelector('input[type="email"]');
          
          if (emailInput && validateEmail(emailInput.value)) {
            // Here you would typically send an AJAX request to your server
            console.log(`Subscribing email: ${emailInput.value}`);
            
            // Show success message
            showNotification('Thank you for subscribing to our newsletter!', 'success');
            
            // Clear the form
            this.reset();
          } else {
            showNotification('Please enter a valid email address.', 'error');
          }
        });
        
        function validateEmail(email) {
          const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(email);
        }
      }
    }
    
    // Initialize WhatsApp contact button
    function initWhatsAppContact() {
      const whatsappBtn = document.querySelector('.whatsapp-contact');
      
      if (whatsappBtn) {
        whatsappBtn.addEventListener('click', function(e) {
          e.preventDefault();
          
          const message = encodeURIComponent('Hello, I am interested in your products.');
          const whatsappUrl = `https://wa.me/${SITE_CONFIG.contact.phone.replace(/\D/g, '')}?text=${message}`;
          
          window.open(whatsappUrl, '_blank');
        });
      }
    }
  });
  
  /* Cart functionality */
  const cart = {
    items: [],
    total: 0,
    
    init: function() {
      // Load cart from localStorage
      this.loadCart();
      
      // Initialize cart UI
      this.updateCartUI();
      
      // Setup event listeners
      this.setupEventListeners();
    },
    
    loadCart: function() {
      const savedCart = localStorage.getItem('shoppingCart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          this.items = cartData.items || [];
          this.total = cartData.total || 0;
        } catch (e) {
          console.error('Error loading cart from localStorage:', e);
          this.clearCart();
        }
      }
    },
    
    saveCart: function() {
      const cartData = {
        items: this.items,
        total: this.total
      };
      localStorage.setItem('shoppingCart', JSON.stringify(cartData));
    },
    
    addItem: function(productId, name, price, size, color, quantity = 1, image) {
      // Check if item already exists in cart
      const existingItemIndex = this.items.findIndex(item => 
        item.productId === productId && item.size === size && item.color === color
      );
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        this.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item
        this.items.push({
          productId,
          name,
          price,
          size,
          color,
          quantity,
          image
        });
      }
      
      // Recalculate total
      this.calculateTotal();
      
      // Save cart to localStorage
      this.saveCart();
      
      // Update UI
      this.updateCartUI();
      
      // Show notification
      showNotification(`${name} (${size}, ${color}) added to cart!`, 'success');
    },
    
    removeItem: function(index) {
      if (index >= 0 && index < this.items.length) {
        const removedItem = this.items[index];
        this.items.splice(index, 1);
        
        // Recalculate total
        this.calculateTotal();
        
        // Save cart to localStorage
        this.saveCart();
        
        // Update UI
        this.updateCartUI();
        
        // Show notification
        showNotification(`${removedItem.name} removed from cart.`, 'info');
      }
    },
    
    updateQuantity: function(index, quantity) {
      if (index >= 0 && index < this.items.length && quantity > 0) {
        this.items[index].quantity = quantity;
        
        // Recalculate total
        this.calculateTotal();
        
        // Save cart to localStorage
        this.saveCart();
        
        // Update UI
        this.updateCartUI();
      }
    },
    
    calculateTotal: function() {
      this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    clearCart: function() {
      this.items = [];
      this.total = 0;
      this.saveCart();
      this.updateCartUI();
      showNotification('Your cart has been cleared.', 'info');
    },
    
    updateCartUI: function() {
      // Update cart count in header
      const countBadges = document.querySelectorAll('.cart-count');
      const itemCount = this.items.reduce((count, item) => count + item.quantity, 0);
      
      countBadges.forEach(badge => {
        badge.textContent = itemCount;
        badge.style.display = itemCount > 0 ? 'block' : 'none';
      });
      
      // Update cart page if it exists
      const cartItemsContainer = document.querySelector('.cart-items');
      if (cartItemsContainer) {
        if (this.items.length === 0) {
          cartItemsContainer.innerHTML = '<div class="empty-cart"><p>Your cart is empty.</p><a href="/shop" class="btn btn-primary">Continue Shopping</a></div>';
        } else {
          // Render cart items
          let html = '';
          this.items.forEach((item, index) => {
            html += `
              <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                  <img src="${item.image}" alt="${item.name}" />
                </div>
                <div class="cart-item-details">
                  <h3 class="cart-item-name">${item.name}</h3>
                  <div class="cart-item-meta">
                    <span class="cart-item-size">Size: ${item.size}</span>
                    <span class="cart-item-color">Color: ${item.color}</span>
                  </div>
                  <div class="cart-item-price">₦${(item.price).toLocaleString()}</div>
                </div>
                <div class="cart-item-quantity">
                  <div class="quantity-wrapper">
                    <button class="minus">-</button>
                    <input type="number" value="${item.quantity}" min="1" max="99" aria-label="Quantity" />
                    <button class="plus">+</button>
                  </div>
                </div>
                <div class="cart-item-subtotal">
                  ₦${(item.price * item.quantity).toLocaleString()}
                </div>
                <button class="remove-item" aria-label="Remove item">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            `;
          });
          
          cartItemsContainer.innerHTML = html;
          
          // Update cart totals
          const subtotalElement = document.querySelector('.cart-subtotal .amount');
          const totalElement = document.querySelector('.cart-total .amount');
          
          if (subtotalElement) {
            subtotalElement.textContent = `₦${this.total.toLocaleString()}`;
          }
          
          if (totalElement) {
            totalElement.textContent = `₦${this.total.toLocaleString()}`;
          }
          
          // Setup event listeners for cart items
          this.setupCartItemEvents();
        }
      }
    },
    
    setupEventListeners: function() {
      // Add to cart buttons
      const addToCartButtons = document.querySelectorAll('.add-to-cart');
      
      addToCartButtons.forEach(button => {
        button.addEventListener('click', e => {
          e.preventDefault();
          
          const productCard = button.closest('.product-card') || button.closest('.product-details');
          
          if (productCard) {
            const productId = productCard.getAttribute('data-product-id');
            const name = productCard.getAttribute('data-product-name');
            const price = parseFloat(productCard.getAttribute('data-product-price'));
            const image = productCard.getAttribute('data-product-image');
            
            // For single product page with options
            let size = 'Default';
            let color = 'Default';
            let quantity = 1;
            
            const sizeSelect = document.querySelector('.size-selector');
            if (sizeSelect) {
              size = sizeSelect.value;
            }
            
            const colorSelect = document.querySelector('.color-selector');
            if (colorSelect) {
              color = colorSelect.value;
            }
            
            const quantityInput = document.querySelector('.quantity-wrapper input');
            if (quantityInput) {
              quantity = parseInt(quantityInput.value);
            }
            
            this.addItem(productId, name, price, size, color, quantity, image);
          }
        });
      });
      
      // Clear cart button
      const clearCartButton = document.querySelector('.clear-cart');
      if (clearCartButton) {
        clearCartButton.addEventListener('click', e => {
          e.preventDefault();
          this.clearCart();
        });
      }
    },
    
    setupCartItemEvents: function() {
      // Quantity buttons
      const quantityWrappers = document.querySelectorAll('.cart-item .quantity-wrapper');
      
      quantityWrappers.forEach(wrapper => {
        const minusBtn = wrapper.querySelector('.minus');
        const plusBtn = wrapper.querySelector('.plus');
        const input = wrapper.querySelector('input');
        const cartItem = wrapper.closest('.cart-item');
        const index = parseInt(cartItem.getAttribute('data-index'));
        
        minusBtn.addEventListener('click', () => {
          const newValue = parseInt(input.value) - 1;
          if (newValue >= 1) {
            input.value = newValue;
            this.updateQuantity(index, newValue);
          }
        });
        
        plusBtn.addEventListener('click', () => {
          const newValue = parseInt(input.value) + 1;
          if (newValue <= 99) {
            input.value = newValue;
            this.updateQuantity(index, newValue);
          }
        });
        
        input.addEventListener('change', () => {
          const newValue = parseInt(input.value);
          if (newValue >= 1 && newValue <= 99) {
            this.updateQuantity(index, newValue);
          } else {
            // Reset to valid value
            input.value = Math.max(1, Math.min(99, newValue || 1));
            this.updateQuantity(index, parseInt(input.value));
          }
        });
      });
      
      // Remove buttons
      const removeButtons = document.querySelectorAll('.cart-item .remove-item');
      
      removeButtons.forEach(button => {
        button.addEventListener('click', () => {
          const cartItem = button.closest('.cart-item');
          const index = parseInt(cartItem.getAttribute('data-index'));
          this.removeItem(index);
        });
      });
    }
  };
  
  /* Wishlist functionality */
  /* Wishlist functionality */
/* Wishlist functionality */
const wishlist = {
  items: [],
  
  init: function() {
    // Load wishlist from localStorage
    this.loadWishlist();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Update UI
    this.updateWishlistUI();
  },
  
  loadWishlist: function() {
    const savedWishlist = localStorage.getItem('userWishlist');
    if (savedWishlist) {
      try {
        this.items = JSON.parse(savedWishlist) || [];
      } catch (e) {
        console.error('Error loading wishlist from localStorage:', e);
        this.items = [];
      }
    }
  },
  
  saveWishlist: function() {
    localStorage.setItem('userWishlist', JSON.stringify(this.items));
  },
  
  addItem: function(productId, name, price, image) {
    // Check if item already exists in wishlist
    const existingItemIndex = this.items.findIndex(item => item.productId === productId);
    
    if (existingItemIndex === -1) {
      // Add new item to wishlist
      this.items.push({
        productId,
        name,
        price,
        image,
        dateAdded: new Date().toISOString()
      });
      
      // Save wishlist to localStorage
      this.saveWishlist();
      
      // Update UI
      this.updateWishlistUI();
      
      // Show notification
      showNotification(`${name} added to your wishlist!`, 'success');
    } else {
      showNotification(`${name} is already in your wishlist.`, 'info');
    }
  },
  
  removeItem: function(index) {
    if (index >= 0 && index < this.items.length) {
      const removedItem = this.items[index];
      this.items.splice(index, 1);
      
      // Save wishlist to localStorage
      this.saveWishlist();
      
      // Update UI
      this.updateWishlistUI();
      
      // Show notification
      showNotification(`${removedItem.name} removed from your wishlist.`, 'info');
    }
  },
  
  clearWishlist: function() {
    this.items = [];
    this.saveWishlist();
    this.updateWishlistUI();
    showNotification('Your wishlist has been cleared.', 'info');
  },
  
  updateWishlistUI: function() {
    // Update wishlist count in header
    const countBadges = document.querySelectorAll('.wishlist-count');
    const itemCount = this.items.length;
    
    countBadges.forEach(badge => {
      badge.textContent = itemCount;
      badge.style.display = itemCount > 0 ? 'block' : 'none';
    });
    
    // Update wishlist page if it exists
    const wishlistContainer = document.querySelector('.wishlist-items');
    if (wishlistContainer) {
      if (this.items.length === 0) {
        wishlistContainer.innerHTML = '<div class="empty-wishlist"><p>Your wishlist is empty.</p><a href="/shop" class="btn btn-primary">Continue Shopping</a></div>';
      } else {
        // Render wishlist items
        let html = '';
        this.items.forEach((item, index) => {
          html += `
            <div class="wishlist-item" data-index="${index}">
              <div class="wishlist-item-image">
                <img src="${item.image}" alt="${item.name}" />
              </div>
              <div class="wishlist-item-details">
                <h3 class="wishlist-item-name">${item.name}</h3>
                <div class="wishlist-item-price">₦${(item.price).toLocaleString()}</div>
              </div>
              <div class="wishlist-item-actions">
                <button class="btn btn-primary add-to-cart-from-wishlist" data-product-id="${item.productId}">
                  <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="remove-from-wishlist" aria-label="Remove from wishlist">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          `;
        });
        
        wishlistContainer.innerHTML = html;
        
        // Setup event listeners for wishlist items
        this.setupWishlistItemEvents();
      }
    }
    
    // Update toggle buttons state
    const wishlistToggles = document.querySelectorAll('.wishlist-toggle');
    wishlistToggles.forEach(toggle => {
      const productId = toggle.getAttribute('data-product-id');
      const isInWishlist = this.items.some(item => item.productId === productId);
      
      toggle.classList.toggle('active', isInWishlist);
      toggle.setAttribute('aria-pressed', isInWishlist);
      
      // Update icon
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
      }
    });
  },
  
  setupEventListeners: function() {
    // Wishlist toggle buttons
    const wishlistToggles = document.querySelectorAll('.wishlist-toggle');
    
    wishlistToggles.forEach(toggle => {
      toggle.addEventListener('click', e => {
        e.preventDefault();
        
        const productCard = toggle.closest('.product-card') || toggle.closest('.product-details');
        
        if (productCard) {
          const productId = productCard.getAttribute('data-product-id');
          const name = productCard.getAttribute('data-product-name');
          const price = parseFloat(productCard.getAttribute('data-product-price'));
          const image = productCard.getAttribute('data-product-image');
          
          const isInWishlist = this.items.some(item => item.productId === productId);
          
          if (isInWishlist) {
            // Remove from wishlist
            const index = this.items.findIndex(item => item.productId === productId);
            this.removeItem(index);
          } else {
            // Add to wishlist
            this.addItem(productId, name, price, image);
          }
        }
      });
    });
    
    // Clear wishlist button
    const clearWishlistButton = document.querySelector('.clear-wishlist');
    if (clearWishlistButton) {
      clearWishlistButton.addEventListener('click', e => {
        e.preventDefault();
        this.clearWishlist();
      });
    }
  },
  
  setupWishlistItemEvents: function() {
    // Remove from wishlist buttons
    const removeButtons = document.querySelectorAll('.wishlist-item .remove-from-wishlist');
    
    removeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const wishlistItem = button.closest('.wishlist-item');
        const index = parseInt(wishlistItem.getAttribute('data-index'));
        this.removeItem(index);
      });
    });
    
    // Add to cart from wishlist buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-from-wishlist');
    
    addToCartButtons.forEach(button => {
      button.addEventListener('click', () => {
        const wishlistItem = button.closest('.wishlist-item');
        const index = parseInt(wishlistItem.getAttribute('data-index'));
        const item = this.items[index];
        
        if (item) {
          // Add to cart
          cart.addItem(item.productId, item.name, item.price, 'Default', 'Default', 1, item.image);
        }
      });
    });
  }
};