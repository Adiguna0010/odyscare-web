/* ============================================
   ODYSCARE - Advanced Animations
   ============================================ */

// Coffee Particle System for Hero Section
class CoffeeParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    this.init();
    
    window.addEventListener('resize', () => this.resize());
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.centerX = this.canvas.width / 2;
    this.centerY = this.canvas.height / 2;
  }
  
  init() {
    // Create coffee bean particles
    for (let i = 0; i < 60; i++) {
      this.particles.push(this.createParticle());
    }
  }
  
  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    };
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      
      // Wrap around screen
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;
      
      // Draw coffee bean shape
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = `rgba(201, 162, 39, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Bean center line
      this.ctx.strokeStyle = `rgba(201, 162, 39, ${p.opacity * 0.5})`;
      this.ctx.lineWidth = 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(-p.size * 0.5, 0);
      this.ctx.quadraticCurveTo(0, p.size * 0.3, p.size * 0.5, 0);
      this.ctx.stroke();
      
      this.ctx.restore();
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Distribution Map Animation
class DistributionMap {
  constructor(svgElement) {
    this.svg = svgElement;
    this.nodes = this.svg.querySelectorAll('.distribution-node');
    this.lines = this.svg.querySelectorAll('.distribution-line');
    this.animateEntrance();
  }
  
  animateEntrance() {
    // Animate lines drawing
    this.lines.forEach((line, i) => {
      const length = line.getTotalLength();
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
      line.style.animation = `lineDraw 2s ease forwards ${i * 0.3}s`;
    });
    
    // Animate nodes appearing
    this.nodes.forEach((node, i) => {
      node.style.opacity = '0';
      node.style.animation = `scaleIn 0.5s ease forwards ${i * 0.5 + 1}s`;
    });
  }
}

// Text Scramble Effect for Hero Title
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }
  
  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise(resolve => this.resolve = resolve);
    this.queue = [];
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }
    
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  
  update() {
    let output = '';
    let complete = 0;
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="text-muted">${char}</span>`;
      } else {
        output += from;
      }
    }
    
    this.el.innerHTML = output;
    
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Smooth Scroll Reveal with stagger
class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('[data-reveal]');
    this.init();
  }
  
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay')) || 0;
          const direction = el.getAttribute('data-reveal') || 'up';
          
          setTimeout(() => {
            el.classList.add('revealed');
            el.style.animation = `fadeIn${this.capitalize(direction)} 0.8s ease forwards`;
          }, delay);
          
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.15 });
    
    this.elements.forEach(el => observer.observe(el));
  }
  
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// 3D Tilt Effect for Cards
class Tilt3D {
  constructor(elements) {
    this.elements = elements;
    this.init();
  }
  
  init() {
    this.elements.forEach(el => {
      el.addEventListener('mousemove', (e) => this.handleMove(e, el));
      el.addEventListener('mouseleave', () => this.handleLeave(el));
    });
  }
  
  handleMove(e, el) {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / centerY * -15;
    const rotateY = (x - centerX) / centerX * 15;
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.transition = 'transform 0.1s ease';
  }
  
  handleLeave(el) {
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    el.style.transition = 'transform 0.5s ease';
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  
  // Initialize Coffee Particles on Hero Canvas
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    new CoffeeParticleSystem(heroCanvas);
  }
  
  // Initialize Distribution Map
  const distributionSvg = document.querySelector('.distribution-map svg');
  if (distributionSvg) {
    new DistributionMap(distributionSvg);
  }
  
  // Initialize Text Scramble for Hero Title
  const scrambleEl = document.querySelector('[data-scramble]');
  if (scrambleEl) {
    const fx = new TextScramble(scrambleEl);
    const phrases = [
      'Solusi Mesin Kopi Terbaik',
      'Maintenance Profesional',
      'Spare Part Berkualitas'
    ];
    let counter = 0;
    
    const next = () => {
      fx.setText(phrases[counter]).then(() => {
        setTimeout(next, 3000);
      });
      counter = (counter + 1) % phrases.length;
    };
    
    next();
  }
  
  // Initialize Scroll Reveal
  new ScrollReveal();
  
  // Initialize 3D Tilt on Service Cards
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (tiltCards.length > 0 && window.innerWidth > 768) {
    new Tilt3D(tiltCards);
  }
  
  // Mouse parallax for hero section
  const heroSection = document.querySelector('.hero');
  if (heroSection && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', (e) => {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
      
      document.querySelectorAll('.hero-parallax').forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 1;
        el.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
      });
    });
  }
  
  // Animated SVG coffee machine parts assembly
  const machineParts = document.querySelectorAll('.machine-part');
  machineParts.forEach((part, i) => {
    part.style.opacity = '0';
    part.style.transform = 'translateY(50px) rotate(-5deg)';
    
    setTimeout(() => {
      part.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
      part.style.opacity = '1';
      part.style.transform = 'translateY(0) rotate(0)';
    }, 500 + i * 200);
  });
  
  // Magnetic button effect
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0, 0)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
    
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
  
  // Liquid fill animation for progress bars
  document.querySelectorAll('.liquid-fill').forEach(bar => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = bar.getAttribute('data-fill') || '100%';
          bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
          bar.style.width = target;
          observer.unobserve(bar);
        }
      });
    });
    observer.observe(bar);
  });
  
  // Ripple effect on click
  document.querySelectorAll('.ripple-effect').forEach(el => {
    el.addEventListener('click', (e) => {
      const rect = el.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(201, 162, 39, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleExpand 0.6s ease-out forwards;
        pointer-events: none;
      `;
      
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(ripple);
      
      setTimeout(() => ripple.remove(), 600);
    });
  });
  
  // Gradient text animation for special headings
  document.querySelectorAll('.gradient-text-animate').forEach(el => {
    el.style.background = 'linear-gradient(90deg, #C9A227, #D4AF37, #C9A227, #5D4037, #C9A227)';
    el.style.backgroundSize = '300% 100%';
    el.style.webkitBackgroundClip = 'text';
    el.style.webkitTextFillColor = 'transparent';
    el.style.backgroundClip = 'text';
    el.style.animation = 'shimmer 4s linear infinite';
  });
  
  // Floating labels for form inputs
  document.querySelectorAll('.floating-input').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
    // Check on load
    if (input.value) {
      input.parentElement.classList.add('focused');
    }
  });
});

// Add ripple keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes rippleExpand {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
