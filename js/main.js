// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

if (burger) {
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Add animation to burger icon
document.addEventListener('DOMContentLoaded', () => {
    if (burger) {
        burger.innerHTML = `
            <div class="line1"></div>
            <div class="line2"></div>
            <div class="line3"></div>
        `;
    }
});

// Add scroll animation
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1
});

document.addEventListener('DOMContentLoaded', () => {
    // Select all sections for scroll animation
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('hidden');
        scrollObserver.observe(section);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .hidden {
            opacity: 0;
            transform: translateY(20px);
            transition: all 1s ease;
        }
        .show {
            opacity: 1;
            transform: translateY(0);
        }
        @keyframes navLinkFade {
            from {
                opacity: 0;
                transform: translateX(50px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        .toggle .line1 {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        .toggle .line2 {
            opacity: 0;
        }
        .toggle .line3 {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    `;
    document.head.appendChild(style);
});

// Typing effect for the hero section
document.addEventListener('DOMContentLoaded', () => {
    const typingElement = document.querySelector('.hero-content h2');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
}); 