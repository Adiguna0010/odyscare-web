/* ==========================================================================
   LOGIKA INTERAKTIF GLOBAL - ODYSCARE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Loading Screen ─── */
  const loader = document.getElementById('loading');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
      }, 1000); // 1 detik loading screen
    });
    // Cadangan jika load event sudah terlewat
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 1500);
  }

  /* ─── Navbar Scroll Effect & Scroll-To-Top Visibility ─── */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  
  if (navbar || scrollTopBtn) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      
      if (navbar) {
        if (scrollPos > 50) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
      
      if (scrollTopBtn) {
        if (scrollPos > 400) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }
    }, { passive: true });
  }

  /* ─── Scroll-To-Top Click Event ─── */
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── Hamburger / Mobile Menu Toggle ─── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    // Menutup menu jika mengklik di luar area menu
    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      }
    });
  }

  /* ─── Counter Animation ─── */
  const counters = document.querySelectorAll('[data-target]');
  if (counters.length > 0) {
    const animateCounter = (el) => {
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || '';
      const duration = 1800; // Durasi 1.8 detik
      const start = performance.now();
      
      const update = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // Cubic Ease Out
        el.textContent = Math.floor(ease * target) + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      };
      requestAnimationFrame(update);
    };

    const counterObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => counterObs.observe(c));
  }

  /* ─── Scroll Reveal Animation ─── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Opsional: unobserve jika ingin animasi hanya dipicu sekali
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    reveals.forEach(el => revealObs.observe(el));
  }

  /* ─── Gallery Categories Filtering ─── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Hilangkan kelas active di tombol lain, lalu tambahkan di tombol terpilih
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterVal = btn.dataset.filter;
        
        galleryItems.forEach(item => {
          // Tambahkan efek transisi keluar/masuk
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            if (filterVal === 'all' || item.dataset.cat === filterVal) {
              item.style.display = 'block';
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, 50);
            } else {
              item.style.display = 'none';
            }
          }, 300);
        });
      });
    });
  }

  /* ─── Gallery Lightbox Modal ─── */
  // Buat elemen modal lightbox secara dinamis jika belum ada
  let lightbox = document.getElementById('lightbox');
  if (!lightbox && galleryItems.length > 0) {
    lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <div class="lightbox-close"><i class="fas fa-times"></i></div>
      <div class="lightbox-content">
        <img id="lightboxImg" src="" alt="Lightbox View" style="display:none;">
        <video id="lightboxVideo" src="" controls style="display:none; max-width: 100%; max-height: 80vh; border-radius: var(--radius-sm); border: 1px solid var(--border); box-shadow: var(--shadow-dark);"></video>
        <div class="lightbox-caption">
          <h4 id="lightboxTitle"></h4>
          <p id="lightboxCat"></p>
        </div>
      </div>
    `;
    document.body.appendChild(lightbox);
  }

  if (lightbox) {
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxVideo = document.getElementById('lightboxVideo');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxCat = document.getElementById('lightboxCat');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const video = item.querySelector('video');
        const overlaySpan = item.querySelector('.gallery-overlay span');
        const overlayH4 = item.querySelector('.gallery-overlay h4');
        
        // Reset both
        if (lightboxImg) {
          lightboxImg.src = '';
          lightboxImg.style.display = 'none';
        }
        if (lightboxVideo) {
          lightboxVideo.pause();
          lightboxVideo.src = '';
          lightboxVideo.style.display = 'none';
        }

        if (video && lightboxVideo) {
          lightboxVideo.src = video.getAttribute('src');
          lightboxVideo.style.display = 'block';
          lightboxVideo.play().catch(err => console.log("Auto-play prevented: ", err));
          
          if (lightboxTitle && overlayH4) lightboxTitle.textContent = overlayH4.textContent;
          if (lightboxCat && overlaySpan) lightboxCat.textContent = overlaySpan.textContent;
          
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden'; // Kunci scroll layar utama
        } else if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.style.display = 'block';
          
          if (lightboxTitle && overlayH4) lightboxTitle.textContent = overlayH4.textContent;
          if (lightboxCat && overlaySpan) lightboxCat.textContent = overlaySpan.textContent;
          
          lightbox.classList.add('open');
          document.body.style.overflow = 'hidden'; // Kunci scroll layar utama
        }
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      if (lightboxVideo) {
        lightboxVideo.pause();
        lightboxVideo.src = '';
      }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  /* ─── Testimonial Slider ─── */
  const slides = document.querySelectorAll('.testi-slide');
  const dots = document.querySelectorAll('.testi-dot');
  
  if (slides.length > 0 && dots.length > 0) {
    let currentIdx = 0;
    let autoSlideTimer;

    const goToSlide = (idx) => {
      slides[currentIdx].classList.remove('active');
      dots[currentIdx].classList.remove('active');
      
      currentIdx = idx;
      
      slides[currentIdx].classList.add('active');
      dots[currentIdx].classList.add('active');
    };

    const nextSlide = () => {
      goToSlide((currentIdx + 1) % slides.length);
    };

    const startTimer = () => {
      autoSlideTimer = setInterval(nextSlide, 5000); // Ganti tiap 5 detik
    };

    const resetTimer = () => {
      clearInterval(autoSlideTimer);
      startTimer();
    };

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetTimer();
      });
    });

    startTimer();
  }

  /* ─── Floating Support Chat Widget ─── */
  const chatToggle = document.getElementById('chatToggle');
  const chatBox = document.getElementById('chatBox');
  
  if (chatToggle && chatBox) {
    const chatBadge = chatToggle.querySelector('.chat-badge');
    
    chatToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      chatBox.classList.toggle('open');
      if (chatBadge) chatBadge.style.display = 'none';
    });

    // Menutup box chat jika klik di luarnya
    document.addEventListener('click', (e) => {
      if (!chatBox.contains(e.target) && !chatToggle.contains(e.target)) {
        chatBox.classList.remove('open');
      }
    });

    // AI Assistant Chat Widget
    const chatInput = chatBox.querySelector('.chat-foot input');
    const chatSendBtn = chatBox.querySelector('.chat-foot button');
    const chatBody = chatBox.querySelector('.chat-body');
    let chatHistory = [];

    const handleSend = () => {
      const text = chatInput.value.trim();
      if (text !== '') {
        // Tambah chat user
        const userMsg = document.createElement('div');
        userMsg.className = 'chat-msg';
        userMsg.style.background = 'var(--gold)';
        userMsg.style.color = 'var(--dark)';
        userMsg.style.marginLeft = 'auto';
        userMsg.style.marginTop = '8px';
        userMsg.textContent = text;
        chatBody.appendChild(userMsg);
        
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        // Simpan pesan user ke riwayat chat
        chatHistory.push({ role: 'user', message: text });
        if (chatHistory.length > 10) chatHistory.shift();

        // Tambah indikator pengetikan AI
        const loader = document.createElement('div');
        loader.className = 'chat-bubble-loader';
        loader.innerHTML = '<span></span><span></span><span></span>';
        chatBody.appendChild(loader);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Panggil endpoint serverless AI
        fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: text,
            history: chatHistory
          })
        })
        .then(res => res.json())
        .then(data => {
          loader.remove();

          const replyText = data.reply || 'Maaf, terjadi kendala teknis saat memproses pesan Anda. Silakan hubungi kami via WhatsApp di 0851-7542-0692.';
          
          // Simpan balasan AI ke riwayat
          chatHistory.push({ role: 'model', message: replyText });
          if (chatHistory.length > 10) chatHistory.shift();

          const supportMsg = document.createElement('div');
          supportMsg.className = 'chat-msg';
          supportMsg.style.marginTop = '8px';

          // Sanitasi teks dan format markdown link ke HTML anchor secara aman
          const formattedReply = replyText
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            .replace(/\n/g, '<br>');

          supportMsg.innerHTML = formattedReply;
          chatBody.appendChild(supportMsg);
          chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(err => {
          loader.remove();
          console.error('Chat error:', err);

          const supportMsg = document.createElement('div');
          supportMsg.className = 'chat-msg';
          supportMsg.style.marginTop = '8px';
          supportMsg.innerHTML = 'Maaf, terjadi kendala saat menghubungkan ke asisten AI. Silakan hubungi kami langsung via <a href="https://wa.me/6285175420692" target="_blank">WhatsApp (0851-7542-0692)</a>.';
          chatBody.appendChild(supportMsg);
          chatBody.scrollTop = chatBody.scrollHeight;
        });
      }
    };

    if (chatSendBtn && chatInput) {
      chatSendBtn.addEventListener('click', handleSend);
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
      });
    }
  }

  /* ─── Cookie Banner ─── */
  const cookieBanner = document.getElementById('cookieBanner');
  const cookieAccept = document.getElementById('cookieAccept');
  const cookieDecline = document.getElementById('cookieDecline');
  
  if (cookieBanner) {
    if (!localStorage.getItem('cookieChoice')) {
      setTimeout(() => {
        cookieBanner.classList.remove('hidden');
      }, 2500);
    } else {
      cookieBanner.classList.add('hidden');
    }

    if (cookieAccept) {
      cookieAccept.addEventListener('click', () => {
        localStorage.setItem('cookieChoice', 'accept');
        cookieBanner.classList.add('hidden');
      });
    }

    if (cookieDecline) {
      cookieDecline.addEventListener('click', () => {
        localStorage.setItem('cookieChoice', 'decline');
        cookieBanner.classList.add('hidden');
      });
    }
  }

  /* ─── Form Submission Interactivity ─── */
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Kirim';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memproses...`;
      }
      
      const formId = form.id;
      let waMessage = '';
      let formDataObj = {
        _subject: 'Website Form Submission'
      };
      
      // Tentukan format pesan berdasarkan ID Form
      if (formId === 'partnerForm') {
        const partnerName = document.getElementById('partnerName').value;
        const businessName = document.getElementById('businessName').value;
        const partnerPhone = document.getElementById('partnerPhone').value;
        const partnerTypeSelect = document.getElementById('partnerType');
        const partnerTypeLabel = partnerTypeSelect.options[partnerTypeSelect.selectedIndex].text;
        const businessAddress = document.getElementById('businessAddress').value;
        const proposal = document.getElementById('proposal').value;
        
        waMessage = `Halo Admin ODYSCARE, saya ingin mengajukan kemitraan. Berikut data pengajuan saya:\n\n` +
                    `- Nama Lengkap: ${partnerName}\n` +
                    `- Nama Perusahaan/Bisnis: ${businessName}\n` +
                    `- No. WhatsApp: ${partnerPhone}\n` +
                    `- Program Kemitraan: ${partnerTypeLabel}\n` +
                    `- Alamat Bisnis: ${businessAddress}\n` +
                    `- Deskripsi Kerja Sama: ${proposal}`;
                    
        formDataObj = {
          _subject: 'Pengajuan Kemitraan Baru - ODYSCARE',
          'Nama Lengkap': partnerName,
          'Nama Perusahaan / Bisnis': businessName,
          'Nomor WhatsApp': partnerPhone,
          'Program Kemitraan': partnerTypeLabel,
          'Alamat Lengkap Bisnis': businessAddress,
          'Deskripsi Kerja Sama': proposal
        };
      } else if (formId === 'bookingForm') {
        const clientName = document.getElementById('clientName').value;
        const cafeName = document.getElementById('cafeName').value || '-';
        const clientPhone = document.getElementById('clientPhone').value;
        const machineTypeSelect = document.getElementById('machineType');
        const machineTypeLabel = machineTypeSelect.options[machineTypeSelect.selectedIndex].text;
        const machineBrand = document.getElementById('machineBrand').value;
        const serviceDate = document.getElementById('serviceDate').value;
        const symptoms = document.getElementById('symptoms').value;
        
        waMessage = `Halo Admin ODYSCARE, saya ingin menjadwalkan servis mesin kopi. Berikut data pengajuan saya:\n\n` +
                    `- Nama Lengkap: ${clientName}\n` +
                    `- Nama Kedai Kopi: ${cafeName}\n` +
                    `- No. WhatsApp: ${clientPhone}\n` +
                    `- Jenis Mesin Kopi: ${machineTypeLabel}\n` +
                    `- Merek & Tipe Mesin: ${machineBrand}\n` +
                    `- Rencana Tanggal Servis: ${serviceDate}\n` +
                    `- Keluhan/Deskripsi Kerusakan: ${symptoms}`;
                    
        formDataObj = {
          _subject: 'Jadwal Service Baru - ODYSCARE',
          'Nama Lengkap': clientName,
          'Nama Kedai Kopi': cafeName,
          'Nomor WhatsApp': clientPhone,
          'Jenis Mesin Kopi': machineTypeLabel,
          'Merek & Tipe Mesin': machineBrand,
          'Rencana Tanggal Servis': serviceDate,
          'Keluhan / Deskripsi': symptoms
        };
      } else if (formId === 'enrollForm') {
        const fullName = document.getElementById('fullName').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const classOptionSelect = document.getElementById('classOption');
        const classOptionLabel = classOptionSelect.options[classOptionSelect.selectedIndex].text;
        const motivation = document.getElementById('motivation').value;
        
        waMessage = `Halo Admin ODYSCARE, saya ingin mendaftar SekolahOnline. Berikut data diri saya:\n\n` +
                    `- Nama Lengkap: ${fullName}\n` +
                    `- Alamat Email: ${email}\n` +
                    `- No. WhatsApp: ${phone}\n` +
                    `- Program Kelas: ${classOptionLabel}\n` +
                    `- Motivasi Bergabung: ${motivation}`;
                    
        formDataObj = {
          _subject: 'Pendaftaran SekolahOnline Baru - ODYSCARE',
          'Nama Lengkap': fullName,
          'Alamat Email': email,
          'Nomor WhatsApp': phone,
          'Program Kelas': classOptionLabel,
          'Motivasi Bergabung': motivation
        };
      } else if (formId === 'contactForm') {
        const contactName = document.getElementById('contactName').value;
        const contactEmail = document.getElementById('contactEmail').value;
        const contactSubject = document.getElementById('contactSubject').value;
        const contactMessage = document.getElementById('contactMessage').value;
        
        waMessage = `Halo Admin ODYSCARE, saya ingin mengirimkan pesan/pertanyaan. Berikut detailnya:\n\n` +
                    `- Nama Lengkap: ${contactName}\n` +
                    `- Alamat Email: ${contactEmail}\n` +
                    `- Subjek Pesan: ${contactSubject}\n` +
                    `- Isi Pesan: ${contactMessage}`;
                    
        formDataObj = {
          _subject: `Pesan Hubungi Kami: ${contactSubject} - ODYSCARE`,
          'Nama Lengkap': contactName,
          'Alamat Email': contactEmail,
          'Subjek Pesan': contactSubject,
          'Isi Pesan': contactMessage
        };
      }
      
      // Tambahkan CC ke email adigunanugrohoh3@gmail.com
      formDataObj['_cc'] = 'adigunanugrohoh3@gmail.com';
      
      // Kirim data ke Email menggunakan Serverless Function secara asynchronous (AJAX)
      fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataObj)
      })
      .then(response => response.json())
      .then(data => {
        console.log('Email sent successfully:', data);
        
        // Update status tombol
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fas fa-check-circle"></i> Berhasil Terkirim!`;
          
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
            form.reset();
          }, 3000);
        }
        
        // Buat alert notifikasi cantik
        const alertBox = document.createElement('div');
        alertBox.style.position = 'fixed';
        alertBox.style.bottom = '24px';
        alertBox.style.left = '50%';
        alertBox.style.transform = 'translateX(-50%)';
        alertBox.style.background = 'var(--gold)';
        alertBox.style.color = 'var(--dark)';
        alertBox.style.padding = '12px 24px';
        alertBox.style.borderRadius = '50px';
        alertBox.style.boxShadow = 'var(--shadow-gold)';
        alertBox.style.zIndex = '1000';
        alertBox.style.fontWeight = '600';
        alertBox.style.fontSize = '0.9rem';
        alertBox.innerHTML = `<i class="fas fa-paper-plane"></i> Permintaan Anda berhasil kami terima! Tim ODYSCARE akan menghubungi Anda via WhatsApp/Email.`;
        
        document.body.appendChild(alertBox);
        
        setTimeout(() => {
          alertBox.style.opacity = '0';
          alertBox.style.transition = 'opacity 0.5s ease';
          setTimeout(() => alertBox.remove(), 500);
        }, 4000);
      })
      .catch(error => {
        console.error('Error submitting form:', error);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="fas fa-exclamation-circle"></i> Gagal Mengirim`;
          setTimeout(() => {
            submitBtn.innerHTML = originalText;
          }, 3000);
        }
        alert('Maaf, terjadi kesalahan saat mengirim data. Silakan hubungi kami langsung via email di odyscareofficial@gmail.com atau WhatsApp di 0851-7542-0692.');
      });
    });
  });

});
