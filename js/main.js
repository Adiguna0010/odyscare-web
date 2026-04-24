/* ============================================
   ODYSCARE - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  
  // --- Loading Screen ---
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
      }, 2500);
    });
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.style.transform = 'translateY(-100%)';
    } else {
      navbar.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });

  // --- Mobile Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    
    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll to Top Button ---
  const scrollTop = document.querySelector('.scroll-top');
  
  if (scrollTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 500) {
        scrollTop.classList.add('visible');
      } else {
        scrollTop.classList.remove('visible');
      }
    });
    
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Scroll Animations (Intersection Observer) ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  
  const animateOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('.animate-on-scroll, .stagger-children, .img-reveal').forEach(el => {
    animateOnScroll.observe(el);
  });

  // --- Stats Counter Animation ---
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  const countUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(easeOut * target);
          el.textContent = current + suffix;
          
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = target + suffix;
          }
        }
        
        requestAnimationFrame(updateCounter);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  
  statNumbers.forEach(stat => countUpObserver.observe(stat));

  // --- Gallery Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --- Lightbox Modal ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox]');
  
  if (lightbox) {
    lightboxTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = trigger.getAttribute('href') || trigger.getAttribute('src');
        if (lightboxImg) lightboxImg.src = imgSrc;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    
    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
  
  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.body.style.overflow = '';
  }

  // --- Chat Widget ---
  const chatToggle = document.querySelector('.chat-toggle');
  const chatBox = document.querySelector('.chat-box');
  const chatInput = document.querySelector('.chat-footer input');
  const chatSend = document.querySelector('.chat-footer button');
  const chatBody = document.querySelector('.chat-body');
  
  if (chatToggle && chatBox) {
    chatToggle.addEventListener('click', () => {
      chatBox.classList.toggle('open');
    });
    
    // Send message
    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;
      
      // Add user message
      addMessage(message, 'sent');
      chatInput.value = '';
      
      // Simulate auto reply
      setTimeout(() => {
        const replies = [
          'Terima kasih atas pesan Anda! Tim kami akan segera merespons.',
          'Halo! Ada yang bisa kami bantu terkait maintenance mesin kopi?',
          'Kami tersedia untuk konsultasi. Silakan jelaskan kebutuhan Anda.',
          'Silakan isi form maintenance untuk respon lebih cepat.'
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        addMessage(randomReply, 'received');
      }, 1500);
    }
    
    function addMessage(text, type) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-message ${type}`;
      msgDiv.innerHTML = `<div class="message-bubble">${escapeHtml(text)}</div>`;
      chatBody.appendChild(msgDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
    
    chatSend?.addEventListener('click', sendMessage);
    chatInput?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // --- Form Validation ---
  const forms = document.querySelectorAll('form[data-validate]');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      
      form.querySelectorAll('[required]').forEach(field => {
        const errorEl = field.parentElement.querySelector('.error-message');
        
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          if (errorEl) errorEl.textContent = 'Field ini wajib diisi';
        } else {
          field.classList.remove('error');
          if (errorEl) errorEl.textContent = '';
        }
        
        // Email validation
        if (field.type === 'email' && field.value) {
          const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            if (errorEl) errorEl.textContent = 'Format email tidak valid';
          }
        }
        
        // Phone validation
        if (field.type === 'tel' && field.value) {
          const phoneRegex = /^[0-9\\+\\-\\s]{10,}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            if (errorEl) errorEl.textContent = 'Format nomor telepon tidak valid';
          }
        }
      });
      
      if (isValid) {
        // Show success message
        const successEl = form.querySelector('.form-success');
        if (successEl) {
          successEl.classList.add('show');
          form.reset();
          setTimeout(() => {
            successEl.classList.remove('show');
          }, 5000);
        }
      }
    });
    
    // Clear error on input
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.classList.remove('error');
        const errorEl = field.parentElement.querySelector('.error-message');
        if (errorEl) errorEl.textContent = '';
      });
    });
  });

  // --- Testimonial Slider ---
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let currentSlide = 0;
  
  function showSlide(index) {
    testimonialSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    testimonialDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }
  
  testimonialDots.forEach((dot, i) => {
    dot.addEventListener('click', () => showSlide(i));
  });
  
  // Auto slide
  setInterval(() => {
    if (testimonialSlides.length > 0) {
      showSlide((currentSlide + 1) % testimonialSlides.length);
    }
  }, 5000);

  // --- Cookie Consent ---
  const cookieConsent = document.querySelector('.cookie-consent');
  const cookieAccept = document.querySelector('.cookie-accept');
  const cookieDecline = document.querySelector('.cookie-decline');
  
  if (cookieConsent && !localStorage.getItem('cookieConsent')) {
    setTimeout(() => {
      cookieConsent.classList.add('show');
    }, 2000);
  }
  
  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieConsent.classList.remove('show');
  });
  
  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieConsent.classList.remove('show');
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Before/After Comparison Slider ---
  const comparators = document.querySelectorAll('.before-after');
  
  comparators.forEach(comp => {
    const slider = comp.querySelector('.comparison-slider');
    const before = comp.querySelector('.before-image');
    
    if (slider && before) {
      slider.addEventListener('input', (e) => {
        before.style.width = e.target.value + '%';
      });
    }
  });

  // --- Parallax Effect ---
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
      const offset = window.pageYOffset * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  });

  // --- Newsletter Popup ---
  const newsletterPopup = document.querySelector('.newsletter-popup');
  const newsletterClose = document.querySelector('.newsletter-close');
  
  if (newsletterPopup && !localStorage.getItem('newsletterShown')) {
    setTimeout(() => {
      newsletterPopup.classList.add('show');
      localStorage.setItem('newsletterShown', 'true');
    }, 30000);
  }
  
  newsletterClose?.addEventListener('click', () => {
    newsletterPopup?.classList.remove('show');
  });

  // --- Active Nav Link Highlight ---
  const sections = document.querySelectorAll('section[id]');
  
  window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // --- Mobile Detect for Parallax Disable ---
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    document.querySelectorAll('.parallax').forEach(el => {
      el.style.backgroundAttachment = 'scroll';
    });
  }

  console.log('ODYSCARE web loaded successfully!');
});
