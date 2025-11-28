// Enhanced JS behavior with smooth scrolling, animations, and image loading
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for header nav with offset
    document.querySelectorAll('.nav a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = a.getAttribute('href');
        const tgt = document.querySelector(targetId);
        if (tgt) {
          const headerOffset = 80;
          const elementPosition = tgt.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
      } else {
        header.style.boxShadow = 'none';
      }
      lastScroll = currentScroll;
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.section, .card, .cmd').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });

    // Ensure hero image loads properly
    const heroImage = document.getElementById('heroImage');
    if (heroImage) {
      const heroImg = heroImage.querySelector('img');
      if (heroImg) {
        heroImg.onload = () => {
          heroImg.style.opacity = '1';
        };
        heroImg.onerror = () => {
          console.warn('Hero image 1.png failed to load');
        };
        // Force reload if already cached
        if (heroImg.complete) {
          heroImg.style.opacity = '1';
        }
      }
    }

    // Ensure github image loads properly
    const githubImage = document.getElementById('githubImage');
    if (githubImage) {
      const githubImg = githubImage.querySelector('img');
      if (githubImg) {
        githubImg.onload = () => {
          githubImg.style.opacity = '1';
        };
        githubImg.onerror = () => {
          console.warn('GitHub image 3.png failed to load');
        };
        if (githubImg.complete) {
          githubImg.style.opacity = '1';
        }
      }
    }

    // Ensure gallery images load properly
    document.querySelectorAll('.gallery-image img').forEach(img => {
      img.onload = () => {
        img.style.opacity = '1';
      };
      img.onerror = () => {
        console.warn(`Gallery image ${img.src} failed to load`);
        img.style.opacity = '0.5';
      };
      if (img.complete) {
        img.style.opacity = '1';
      } else {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
      }
    });

    // Image Modal/Lightbox functionality
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    function openModal(imageSrc, title, description) {
      modalImage.src = imageSrc;
      modalTitle.textContent = title;
      // Convert backticks to code tags in description
      const formattedDescription = description.replace(/`([^`]+)`/g, '<code>$1</code>');
      modalDescription.innerHTML = formattedDescription;
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = ''; // Restore scrolling
    }

    // Open modal when branching hero image is clicked
    document.querySelectorAll('.branching-hero-item').forEach(item => {
      item.addEventListener('click', () => {
        const imageSrc = item.getAttribute('data-image');
        const title = item.getAttribute('data-title');
        const description = item.getAttribute('data-description');
        openModal(imageSrc, title, description);
      });
    });

    // Open modal when gallery image is clicked
    document.querySelectorAll('.gallery-item').forEach(item => {
      const imageContainer = item.querySelector('.gallery-image');
      imageContainer.addEventListener('click', () => {
        const imageSrc = item.getAttribute('data-image');
        const title = item.getAttribute('data-title');
        const description = item.getAttribute('data-description');
        openModal(imageSrc, title, description);
      });
    });

    // Close modal when close button is clicked
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    // Close modal when overlay is clicked
    if (modalOverlay) {
      modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });

    // Load slide images if user exported them to assets/
    const pages = {
      problemImage: 'assets/page2.png',
      branchingImage: 'assets/page8.png'
    };

    Object.keys(pages).forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const url = pages[id];
      // Check existence by trying to load
      const img = new Image();
      img.onload = () => {
        el.style.backgroundImage = `url('${url}')`;
        el.style.backgroundSize = 'cover';
        el.style.backgroundPosition = 'center';
        el.style.transition = 'opacity 0.5s ease';
        el.style.opacity = '1';
      };
      img.onerror = () => {
        // Fallback: keep gradient
        el.style.background = 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(59,130,246,0.15), rgba(236,72,153,0.2))';
      };
      img.src = url;
    });

    // Add hover effects to interactive elements
    document.querySelectorAll('.card, .cmd, .example-left, .example-right').forEach(el => {
      el.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
      });
    });

    // Code block copy functionality - click individual code lines to copy
    document.querySelectorAll('.code code').forEach(codeLine => {
      codeLine.style.cursor = 'pointer';
      codeLine.title = 'Click to copy';
      codeLine.addEventListener('click', async function(e) {
        e.stopPropagation();
        const text = this.textContent.trim();
        try {
          await navigator.clipboard.writeText(text);
          // Visual feedback
          const originalBg = this.style.background;
          const originalBorder = this.style.borderColor;
          this.style.background = 'rgba(59,130,246,0.4)';
          this.style.borderColor = 'rgba(59,130,246,0.8)';
          setTimeout(() => {
            this.style.background = originalBg;
            this.style.borderColor = originalBorder;
          }, 300);
        } catch (err) {
          // Fallback: select text
          const range = document.createRange();
          range.selectNodeContents(this);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
        }
      });
    });
  });
  