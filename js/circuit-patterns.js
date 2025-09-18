// Minimal Circuit Board Patterns
class CircuitPatterns {
    constructor() {
        this.circuits = [];
        this.init();
    }
    
    init() {
        this.createCircuits();
        this.startPulseAnimation();
    }
    
    createCircuits() {
        const sections = document.querySelectorAll('.section');
        
        sections.forEach((section, index) => {
            if (index === sections.length - 1) return; // Skip last section
            
            const circuit = document.createElement('div');
            circuit.className = 'circuit-divider';
            circuit.innerHTML = `
                <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none">
                    <!-- Main horizontal line -->
                    <line x1="0" y1="30" x2="1200" y2="30" stroke="#00d4ff" stroke-width="1" opacity="0.3"/>
                    
                    <!-- Circuit nodes -->
                    <circle cx="200" cy="30" r="2" fill="#00d4ff" opacity="0.5" class="node"/>
                    <circle cx="400" cy="30" r="2" fill="#00d4ff" opacity="0.5" class="node"/>
                    <circle cx="600" cy="30" r="2" fill="#00d4ff" opacity="0.5" class="node"/>
                    <circle cx="800" cy="30" r="2" fill="#00d4ff" opacity="0.5" class="node"/>
                    <circle cx="1000" cy="30" r="2" fill="#00d4ff" opacity="0.5" class="node"/>
                    
                    <!-- Vertical branches -->
                    <line x1="200" y1="30" x2="200" y2="15" stroke="#00d4ff" stroke-width="0.5" opacity="0.3"/>
                    <line x1="400" y1="30" x2="400" y2="45" stroke="#00d4ff" stroke-width="0.5" opacity="0.3"/>
                    <line x1="600" y1="30" x2="600" y2="15" stroke="#00d4ff" stroke-width="0.5" opacity="0.3"/>
                    <line x1="800" y1="30" x2="800" y2="45" stroke="#00d4ff" stroke-width="0.5" opacity="0.3"/>
                    <line x1="1000" y1="30" x2="1000" y2="15" stroke="#00d4ff" stroke-width="0.5" opacity="0.3"/>
                    
                    <!-- Small rectangles (components) -->
                    <rect x="195" y="12" width="10" height="6" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
                    <rect x="395" y="42" width="10" height="6" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
                    <rect x="595" y="12" width="10" height="6" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
                    <rect x="795" y="42" width="10" height="6" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
                    <rect x="995" y="12" width="10" height="6" fill="none" stroke="#00d4ff" stroke-width="0.5" opacity="0.4"/>
                    
                    <!-- Pulse line (hidden initially) -->
                    <line x1="0" y1="30" x2="0" y2="30" stroke="#00d4ff" stroke-width="2" opacity="0.8" class="pulse">
                        <animate attributeName="x2" values="0;1200;1200" dur="3s" repeatCount="indefinite" begin="${index * 0.5}s"/>
                        <animate attributeName="opacity" values="0;0.8;0" dur="3s" repeatCount="indefinite" begin="${index * 0.5}s"/>
                    </line>
                </svg>
            `;
            
            circuit.style.cssText = `
                position: absolute;
                bottom: -30px;
                left: 0;
                width: 100%;
                height: 60px;
                pointer-events: none;
                z-index: 1;
            `;
            
            section.style.position = 'relative';
            section.appendChild(circuit);
            this.circuits.push(circuit);
        });
    }
    
    startPulseAnimation() {
        // Nodes pulse randomly
        setInterval(() => {
            const nodes = document.querySelectorAll('.circuit-divider .node');
            const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
            if (randomNode) {
                randomNode.style.opacity = '1';
                randomNode.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    randomNode.style.opacity = '0.5';
                    randomNode.style.transform = 'scale(1)';
                }, 300);
            }
        }, 2000);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CircuitPatterns();
});