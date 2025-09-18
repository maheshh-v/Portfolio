// Digital Signature Effect
class DigitalSignature {
    constructor() {
        this.nameElement = null;
        this.fullName = 'Mahesh Vyas';
        this.currentText = '';
        this.charIndex = 0;
        
        this.init();
    }
    
    init() {
        this.findNameElement();
        if (this.nameElement) {
            this.startCompilation();
        }
    }
    
    findNameElement() {
        // Find the gradient text element containing the name
        const gradientTexts = document.querySelectorAll('.gradient-text');
        gradientTexts.forEach(el => {
            if (el.textContent.includes('Mahesh Vyas')) {
                this.nameElement = el;
            }
        });
    }
    
    startCompilation() {
        // Clear the name initially
        this.nameElement.textContent = '';
        this.nameElement.style.fontFamily = "'Courier New', monospace";
        
        // Add cursor
        const cursor = document.createElement('span');
        cursor.className = 'compile-cursor';
        cursor.textContent = '_';
        cursor.style.cssText = `
            animation: blink 1s infinite;
            color: #00d4ff;
            font-weight: normal;
        `;
        
        // Add blinking animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        this.nameElement.appendChild(cursor);
        
        // Start typing effect
        setTimeout(() => {
            this.typeNextChar(cursor);
        }, 1000);
    }
    
    typeNextChar(cursor) {
        if (this.charIndex < this.fullName.length) {
            const char = this.fullName[this.charIndex];
            this.currentText += char;
            
            // Update text content (excluding cursor)
            this.nameElement.textContent = this.currentText;
            this.nameElement.appendChild(cursor);
            
            this.charIndex++;
            
            // Random delay between characters for realistic typing
            const delay = char === ' ' ? 100 : 80 + Math.random() * 120;
            setTimeout(() => {
                this.typeNextChar(cursor);
            }, delay);
        } else {
            // Compilation complete - remove cursor after a moment
            setTimeout(() => {
                cursor.remove();
                // Switch back to original font
                this.nameElement.style.fontFamily = '';
            }, 2000);
        }
    }
}

// Initialize after a short delay to ensure DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new DigitalSignature();
    }, 500);
});