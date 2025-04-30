// Main JavaScript file for Portfolio

document.addEventListener('DOMContentLoaded', function() {
  // Initialize variables
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.body;
  const sections = document.querySelectorAll('section');
  const collapsibles = document.querySelectorAll('.collapsible');
  const skillBars = document.querySelectorAll('.skill');
  const slider = darkModeToggle ? darkModeToggle.querySelector(".slider") : null;
  const sunIcon = document.getElementById("sun-icon");
  const moonIcon = document.getElementById("moon-icon");
  let isScrolling = false;
  
  // Initialize components
  initDarkMode();
  initScrollAnimations();
  initCollapsibles();
  initTypingEffect();
  initParticles();
  initProjectCardEffects();
  initFormAnimations();
  initSmoothScrolling();
  initScrollToTopButton();
  initLazyLoading();
  
  // ===== DARK MODE FUNCTIONALITY =====
  function initDarkMode() {
    if (!darkModeToggle) return;
    
    // Check for saved user preference
    const isDarkMode = localStorage.getItem("theme") === "dark";
    
    // Apply the initial theme and set toggle slider position
    if (isDarkMode) {
      body.classList.add("dark-mode");
      if (sunIcon && moonIcon && slider) {
        sunIcon.style.opacity = "0";
        sunIcon.style.visibility = "hidden";
        moonIcon.style.opacity = "1";
        moonIcon.style.visibility = "visible";
        slider.style.transform = "translateX(30px)"; // Move slider to right for dark mode
      }
    } else {
      body.classList.remove("dark-mode");
      if (sunIcon && moonIcon && slider) {
        sunIcon.style.opacity = "1";
        sunIcon.style.visibility = "visible";
        moonIcon.style.opacity = "0";
        moonIcon.style.visibility = "hidden";
        slider.style.transform = "translateX(0)"; // Move slider to left for light mode
      }
    }
    
    // Add accessibility attributes
    darkModeToggle.setAttribute('role', 'switch');
    darkModeToggle.setAttribute('aria-checked', isDarkMode);
    
    // Add toggle event listeners
    darkModeToggle.addEventListener('click', toggleDarkMode);
    darkModeToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleDarkMode();
      }
    });
  }
  
  function toggleDarkMode() {
    const isDarkModeActive = body.classList.toggle("dark-mode");
    
    // Update aria attribute
    darkModeToggle.setAttribute('aria-checked', isDarkModeActive);
    
    if (isDarkModeActive) {
      if (sunIcon && moonIcon && slider) {
        sunIcon.style.opacity = "0";
        sunIcon.style.visibility = "hidden";
        moonIcon.style.opacity = "1";
        moonIcon.style.visibility = "visible";
        slider.style.transform = "translateX(30px)"; // Slide to the right
      }
      localStorage.setItem("theme", "dark");
    } else {
      if (sunIcon && moonIcon && slider) {
        sunIcon.style.opacity = "1";
        sunIcon.style.visibility = "visible";
        moonIcon.style.opacity = "0";
        moonIcon.style.visibility = "hidden";
        slider.style.transform = "translateX(0)"; // Slide to the left
      }
      localStorage.setItem("theme", "light");
    }
    
    // Add toggle animation
    darkModeToggle.classList.add('toggle-animation');
    setTimeout(() => {
      darkModeToggle.classList.remove('toggle-animation');
    }, 500);
  }
  
  // ===== LAZY LOADING IMAGES =====
  function initLazyLoading() {
    // Lazy load images in the screenshots section
    document.querySelectorAll('.screenshots img').forEach(img => {
      img.loading = 'lazy';
    });
  }
  
  // ===== SCROLL ANIMATIONS =====
  function initScrollAnimations() {
    // Initial check for visible sections
    checkVisibleSections();
    
    // Add scroll event listener with throttling
    window.addEventListener('scroll', function() {
      if (!isScrolling) {
        window.requestAnimationFrame(function() {
          checkVisibleSections();
          isScrolling = false;
        });
        isScrolling = true;
      }
    });
    
    // Fade-in animations using Intersection Observer
    const observerOptions = {
      root: null, // Use the viewport as the root
      rootMargin: "0px", // No margin
      threshold: 0.2, // Trigger when 20% of the section is visible
    };
    
    const observerCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in"); // Add the fade-in class
          observer.unobserve(entry.target); // Stop observing once animated
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe each section
    sections.forEach((section) => {
      observer.observe(section);
    });
  }
  
  function checkVisibleSections() {
    const triggerBottom = window.innerHeight * 0.8;
    
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      
      if (sectionTop < triggerBottom) {
        section.classList.add('visible');
        
        // Animate skill bars if in skills section
        if (section.contains(document.querySelector('.skills-visualization'))) {
          animateSkillBars();
        }
      }
    });
  }
  
  function animateSkillBars() {
    skillBars.forEach(skill => {
      const percentage = skill.getAttribute('data-percentage');
      // Set custom property for CSS
      skill.style.setProperty('--width', `${percentage}%`);
      skill.style.setProperty('--percentage', percentage);
      skill.classList.add('animate');
      
      // Add percentage text to tooltip
      const tooltip = skill.querySelector('.skill-tooltip');
      if (tooltip) {
        tooltip.textContent = `${percentage}%`;
      }
    });
  }
  
  // ===== COLLAPSIBLE SECTIONS =====
  function initCollapsibles() {
    // Initialize built-in collapsibles
    collapsibles.forEach(collapsible => {
      const toggleBtn = collapsible.querySelector('.toggle-btn');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
          // Close other collapsibles in the same category
          const parent = collapsible.parentElement;
          const siblings = parent.querySelectorAll('.collapsible');
          
          siblings.forEach(sibling => {
            if (sibling !== collapsible && sibling.classList.contains('active')) {
              sibling.classList.remove('active');
            }
          });
          
          // Toggle current collapsible
          collapsible.classList.toggle('active');
        });
      }
    });
    
    // Initialize custom collapsibles
    initializeCustomCollapsible(".toggle-btn", ".collapsible-content"); // Postgraduate Project
    initializeCustomCollapsible(".about-me-toggle-btn", ".about-me-collapsible-content"); // About Me Section
  }
  
  function initializeCustomCollapsible(toggleSelector, contentSelector) {
    // Select all toggle buttons based on the given selector
    const toggleButtons = document.querySelectorAll(toggleSelector);
    
    toggleButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const content = button.nextElementSibling;
        
        // Toggle 'active' class for styling
        button.classList.toggle("active");
        
        // Collapse all content sections except the clicked one
        document.querySelectorAll(contentSelector).forEach((item) => {
          if (item !== content) {
            item.style.maxHeight = null; // Collapse
            item.previousElementSibling.classList.remove("active"); // Remove 'active' from other buttons
          }
        });
        
        // Expand or collapse the current content
        if (content.style.maxHeight) {
          content.style.maxHeight = null; // Collapse
        } else {
          content.style.maxHeight = content.scrollHeight + "px"; // Expand
        }
      });
    });
  }
  

  
   // ===== TYPING EFFECT =====
function initTypingEffect() {
  const typingContainer = document.querySelector('#home p.typing-effect');
  if (!typingContainer) return;

  const lines = Array.from(typingContainer.querySelectorAll('.line'));
  typingContainer.innerHTML = ''; // Clear existing content

  let currentLine = 0;

  function typeLine(lineIndex) {
    if (lineIndex >= lines.length) return;

    const line = lines[lineIndex];
    const text = line.textContent;
    line.textContent = '';
    typingContainer.appendChild(line);

    let i = 0;
    function type() {
      if (i < text.length) {
        line.textContent += text.charAt(i);
        i++;
        setTimeout(type, 50);
      } else {
        typingContainer.appendChild(document.createElement('br'));
        setTimeout(() => typeLine(lineIndex + 1), 300);
      }
    }
    type();
  }

  typeLine(0);
}
  
  // ===== PARTICLES BACKGROUND =====
  function initParticles() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;
    
    // Check if canvas already exists
    if (document.getElementById('particles-canvas')) return;
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    
    // Insert canvas as the first child of the home section
    homeSection.insertBefore(canvas, homeSection.firstChild);
    
    // Set canvas size
    canvas.width = homeSection.offsetWidth;
    canvas.height = homeSection.offsetHeight;
    
    // Initialize particles
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        color: `rgba(0, 153, 255, ${Math.random() * 0.5 + 0.1})`,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1
      });
    }
    
    // Animation function
    function animateParticles() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Check for dark mode to adjust particle colors
      const isDarkMode = body.classList.contains('dark-mode');
      
      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        // Update position
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
        
        // Adjust color for dark mode
        if (isDarkMode) {
          p.color = `rgba(0, 179, 255, ${Math.random() * 0.5 + 0.3})`;
        } else {
          p.color = `rgba(0, 153, 255, ${Math.random() * 0.5 + 0.1})`;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let distance = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = isDarkMode 
              ? `rgba(0, 179, 255, ${0.2 - distance/500})`
              : `rgba(0, 153, 255, ${0.1 - distance/1000})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      
      requestAnimationFrame(animateParticles);
    }
    
    // Start animation
    animateParticles();
    
    // Resize handling
    window.addEventListener('resize', function() {
      canvas.width = homeSection.offsetWidth;
      canvas.height = homeSection.offsetHeight;
    });
  }
  
  // ===== PROJECT CARDS HOVER EFFECT =====
  function initProjectCardEffects() {
    const projectCards = document.querySelectorAll('.project');
    projectCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.animation = 'float 3s ease-in-out infinite';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.animation = 'none';
      });
    });
  }
  
  // ===== FORM ANIMATIONS =====
  function initFormAnimations() {
    const formInputs = document.querySelectorAll('.animated-input');
    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        this.parentElement.classList.add('input-focused');
      });
      
      input.addEventListener('blur', function() {
        if (this.value === '') {
          this.parentElement.classList.remove('input-focused');
        }
      });
    });
  }
  
  // ===== SMOOTH SCROLLING =====
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // ===== SCROLL-TO-TOP BUTTON =====
  function initScrollToTopButton() {
    // Check if button already exists
    if (document.getElementById('scroll-top-btn')) return;
    
    // Create button element
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.id = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.style.display = 'none';
    scrollTopBtn.title = 'Scroll to top';
    
    // Apply styles
    Object.assign(scrollTopBtn.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '999',
      opacity: '0',
      transition: 'opacity 0.3s, transform 0.3s',
      boxShadow: '0 3px 10px rgba(0, 0, 0, 0.2)'
    });
    
    // Add button to the DOM
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollTopBtn.style.opacity = '1';
        scrollTopBtn.style.display = 'flex';
      } else {
        scrollTopBtn.style.opacity = '0';
        setTimeout(() => {
          if (window.pageYOffset <= 300) {
            scrollTopBtn.style.display = 'none';
          }
        }, 300);
      }
    });
    
    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});