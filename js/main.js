// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initParallax();
    initScrollAnimations();
    initMobileMenu();
    initGallery();
    initLoadingScreen();
    revealOnScroll();
});

// Parallax Effect
function initParallax() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    window.addEventListener('scroll', () => {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Scroll Animations
function initScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const scrollElements = document.querySelectorAll('.scroll-fade');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('section')) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
    scrollElements.forEach(element => observer.observe(element));
}

// Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    const body = document.body;
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('menu-open');
            nav.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
                menuBtn.classList.remove('menu-open');
                nav.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    }
}

// Gallery
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            openLightbox(imgSrc);
        });
    });
}

// Lightbox
function openLightbox(imgSrc) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${imgSrc}" alt="Gallery image">
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Close lightbox
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.className === 'lightbox-close') {
            lightbox.remove();
            document.body.style.overflow = '';
        }
    });
}

// Loading Screen
function initLoadingScreen() {
    const loader = document.querySelector('.loading');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.display = 'none';
            }, 1000);
        });
    }
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            const menuBtn = document.querySelector('.mobile-menu-btn');
            const nav = document.querySelector('.nav-links');
            if (menuBtn && nav) {
                menuBtn.classList.remove('menu-open');
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
});

// Header Scroll Effect
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Form Validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Basic form validation
        const formData = new FormData(contactForm);
        let isValid = true;
        
        for (let [key, value] of formData.entries()) {
            if (!value.trim()) {
                isValid = false;
                const input = contactForm.querySelector(`[name="${key}"]`);
                if (input) {
                    input.classList.add('error');
                }
            }
        }
        
        if (isValid) {
            // Here you would typically send the form data to a server
            console.log('Form submitted:', Object.fromEntries(formData));
            contactForm.reset();
            showNotification('Сообщение отправлено успешно!');
        } else {
            showNotification('Пожалуйста, заполните все поля', 'error');
        }
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Анимация появления секций при скролле
function revealOnScroll() {
  var fadeEls = document.querySelectorAll('.fade-in, .slide-up');
  var windowHeight = window.innerHeight;
  fadeEls.forEach(function(el) {
    var rect = el.getBoundingClientRect();
    if (rect.top < windowHeight - 60) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Плавный скролл для якорей
const anchorLinks = document.querySelectorAll('a[href^="#"]');
anchorLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Lightbox для галереи
(function() {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  if (!galleryItems.length) return;
  let current = 0;
  let images = Array.from(galleryItems).map(img => img.src);
  let captions = Array.from(galleryItems).map(img => {
    // Берём подпись из alt или из подписи под фото
    const parent = img.closest('.gallery-item');
    const captionEl = parent ? parent.querySelector('.gallery-caption') : null;
    return captionEl ? captionEl.textContent : (img.alt || '');
  });

  // Создать элементы lightbox
  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = `
    <span class="lightbox-close">&times;</span>
    <span class="lightbox-arrow left">&#8592;</span>
    <div class="lightbox-content">
      <img class="lightbox-img" src="" alt="" />
      <div class="lightbox-caption"></div>
    </div>
    <span class="lightbox-arrow right">&#8594;</span>
  `;
  document.body.appendChild(overlay);
  const imgEl = overlay.querySelector('.lightbox-img');
  const captionEl = overlay.querySelector('.lightbox-caption');
  const closeBtn = overlay.querySelector('.lightbox-close');
  const leftArrow = overlay.querySelector('.lightbox-arrow.left');
  const rightArrow = overlay.querySelector('.lightbox-arrow.right');

  function showLightbox(idx) {
    current = idx;
    imgEl.classList.remove('visible');
    imgEl.src = images[current];
    captionEl.textContent = captions[current];
    overlay.classList.add('active');
  }
  imgEl.onload = function() {
    imgEl.classList.add('visible');
  };
  function hideLightbox() {
    overlay.classList.remove('active');
    setTimeout(() => { imgEl.src = ''; imgEl.classList.remove('visible'); }, 300);
  }
  function showPrev() {
    showLightbox((current - 1 + images.length) % images.length);
  }
  function showNext() {
    showLightbox((current + 1) % images.length);
  }

  galleryItems.forEach((img, idx) => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', e => {
      e.preventDefault();
      showLightbox(idx);
    });
  });
  closeBtn.addEventListener('click', hideLightbox);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) hideLightbox();
  });
  leftArrow.addEventListener('click', e => { e.stopPropagation(); showPrev(); });
  rightArrow.addEventListener('click', e => { e.stopPropagation(); showNext(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('active')) return;
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
})();

// Мобильное меню
(function() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.mobile-menu-overlay');
  if (!menuBtn || !navLinks || !overlay) return;

  function openMenu() {
    menuBtn.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menuBtn.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });
  // Закрытие по клику на ссылку
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  // Закрытие по клику вне меню
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });
})();

// Кнопка "Наверх"
(function() {
  const btn = document.getElementById('scrollToTop');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// Анимация чисел достижений
(function() {
  function animateCount(el) {
    const target = +el.getAttribute('data-target');
    const duration = 1200;
    const start = 0;
    const startTime = performance.now();
    function update(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      el.textContent = Math.floor(progress * (target - start) + start);
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(update);
  }
  function handleScroll() {
    document.querySelectorAll('.count-animate').forEach(el => {
      if (!el.classList.contains('counted')) {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.classList.add('counted');
          animateCount(el);
        }
      }
    });
  }
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('DOMContentLoaded', handleScroll);
})();

// Интерактивная карта концертов (Leaflet)
(function() {
  if (!document.getElementById('concertMap') || typeof L === 'undefined') return;
  var map = L.map('concertMap', {
    center: [48.5, 13.5],
    zoom: 6,
    scrollWheelZoom: false,
    zoomControl: true,
  });
  // Тёмный стиль карты
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '',
    maxZoom: 19,
  }).addTo(map);
  // Маркеры
  var concerts = [
    { city: 'Gröbming', coords: [47.442, 13.896], date: '07.07.2024', title: 'GOOD VIBRATIONS' },
    { city: 'Amerang', coords: [48.016, 12.314], date: '08.07.2024', title: 'GOOD VIBRATIONS' },
    { city: 'Öhringen', coords: [49.201, 9.507], date: '03.08.2024', title: 'GOOD VIBRATIONS' },
  ];
  concerts.forEach(function(c) {
    L.marker(c.coords).addTo(map)
      .bindPopup('<b>' + c.title + '</b><br>' + c.city + '<br>' + c.date);
  });
})(); 