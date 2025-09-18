// Advanced Neural Network Animation with Synaptic Pulses
class NeuralNetwork {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.nodes = [];
        this.connections = [];
        this.pulses = [];
        this.clusters = [];
        this.discharges = [];
        this.animationId = null;
        this.mouse = { x: 0, y: 0, influence: 0 };
        this.time = 0;
        this.init();
    }

    init() {
        this.createCanvas();
        this.generateNetwork();
        this.setupInteractions();
        this.animate();
        this.handleResize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'neural-network';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            opacity: 0.2;
            pointer-events: none;
            filter: blur(0.8px);
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    generateNetwork() {
        this.nodes = [];
        this.connections = [];
        this.clusters = [];
        
        const nodeCount = Math.min(60, Math.floor((this.canvas.width * this.canvas.height) / 12000));
        
        // Create clusters for brain-like organization
        const clusterCount = Math.floor(nodeCount / 8);
        for (let i = 0; i < clusterCount; i++) {
            this.clusters.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 100 + 80,
                activity: Math.random()
            });
        }
        
        // Create nodes with cluster influence
        for (let i = 0; i < nodeCount; i++) {
            let x, y;
            if (Math.random() < 0.7 && this.clusters.length > 0) {
                // Place near a cluster
                const cluster = this.clusters[Math.floor(Math.random() * this.clusters.length)];
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * cluster.radius * 0.6;
                x = cluster.x + Math.cos(angle) * distance;
                y = cluster.y + Math.sin(angle) * distance;
            } else {
                // Random placement
                x = Math.random() * this.canvas.width;
                y = Math.random() * this.canvas.height;
            }
            
            this.nodes.push({
                x: Math.max(10, Math.min(this.canvas.width - 10, x)),
                y: Math.max(10, Math.min(this.canvas.height - 10, y)),
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 2,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: Math.random() * 0.03 + 0.01,
                activity: Math.random(),
                type: Math.random() < 0.3 ? 'hub' : 'normal',
                charge: Math.random() * 2 - 1,
                lastFired: 0
            });
        }

        // Create intelligent connections
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const distance = this.getDistance(this.nodes[i], this.nodes[j]);
                const maxDistance = this.nodes[i].type === 'hub' || this.nodes[j].type === 'hub' ? 180 : 120;
                
                if (distance < maxDistance) {
                    const strength = 1 - (distance / maxDistance);
                    this.connections.push({
                        from: i,
                        to: j,
                        strength,
                        distance,
                        activity: 0,
                        lastPulse: 0,
                        pulseDirection: Math.random() < 0.5 ? 1 : -1
                    });
                }
            }
        }
    }

    setupInteractions() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.influence = 1;
        });
        
        document.addEventListener('click', (e) => {
            this.createElectricalDischarge(e.clientX, e.clientY);
            this.triggerNeuralWave(e.clientX, e.clientY);
        });
    }

    createElectricalDischarge(x, y) {
        const branches = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < branches; i++) {
            this.discharges.push({
                x, y,
                targetX: x + (Math.random() - 0.5) * 300,
                targetY: y + (Math.random() - 0.5) * 300,
                progress: 0,
                life: 1,
                branches: this.generateLightningBranch(x, y, Math.random() * Math.PI * 2, 150)
            });
        }
    }

    generateLightningBranch(startX, startY, angle, length) {
        const points = [{ x: startX, y: startY }];
        let currentX = startX;
        let currentY = startY;
        const segments = Math.floor(length / 20);
        
        for (let i = 0; i < segments; i++) {
            angle += (Math.random() - 0.5) * 0.8;
            const segmentLength = length / segments + (Math.random() - 0.5) * 10;
            currentX += Math.cos(angle) * segmentLength;
            currentY += Math.sin(angle) * segmentLength;
            points.push({ x: currentX, y: currentY });
        }
        
        return points;
    }

    triggerNeuralWave(x, y) {
        // Find nearest nodes and trigger activity
        this.nodes.forEach((node, index) => {
            const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
            if (distance < 200) {
                node.activity = Math.min(1, node.activity + (1 - distance / 200));
                node.lastFired = this.time;
                this.createPulse(index);
            }
        });
    }

    createPulse(nodeIndex) {
        const node = this.nodes[nodeIndex];
        this.connections.forEach((conn, connIndex) => {
            if (conn.from === nodeIndex || conn.to === nodeIndex) {
                if (Math.random() < node.activity * 0.7) {
                    this.pulses.push({
                        connectionIndex: connIndex,
                        progress: conn.from === nodeIndex ? 0 : 1,
                        direction: conn.from === nodeIndex ? 1 : -1,
                        intensity: node.activity,
                        life: 1,
                        speed: 0.02 + Math.random() * 0.03
                    });
                }
            }
        });
    }

    getDistance(node1, node2) {
        return Math.sqrt((node2.x - node1.x) ** 2 + (node2.y - node1.y) ** 2);
    }

    animate() {
        this.time += 0.016;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Mouse influence decay
        this.mouse.influence *= 0.95;
        
        // Update and draw electrical discharges
        this.discharges = this.discharges.filter(discharge => {
            discharge.progress += 0.1;
            discharge.life -= 0.05;
            
            if (discharge.life > 0) {
                this.ctx.strokeStyle = `rgba(0, 255, 255, ${discharge.life * 0.8})`;
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00ffff';
                
                this.ctx.beginPath();
                const visiblePoints = Math.floor(discharge.branches.length * discharge.progress);
                for (let i = 0; i < visiblePoints - 1; i++) {
                    const point = discharge.branches[i];
                    const nextPoint = discharge.branches[i + 1];
                    this.ctx.moveTo(point.x, point.y);
                    this.ctx.lineTo(nextPoint.x, nextPoint.y);
                }
                this.ctx.stroke();
                this.ctx.shadowBlur = 0;
                return true;
            }
            return false;
        });
        
        // Update nodes with mouse influence
        this.nodes.forEach((node, index) => {
            // Mouse attraction/repulsion
            if (this.mouse.influence > 0.1) {
                const dx = this.mouse.x - node.x;
                const dy = this.mouse.y - node.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const force = (150 - distance) / 150 * 0.02 * this.mouse.influence;
                    node.vx += (dx / distance) * force;
                    node.vy += (dy / distance) * force;
                    node.activity = Math.min(1, node.activity + force * 2);
                }
            }
            
            // Natural movement
            node.x += node.vx;
            node.y += node.vy;
            
            // Boundary collision with smooth bounce
            if (node.x < 10 || node.x > this.canvas.width - 10) {
                node.vx *= -0.8;
                node.x = Math.max(10, Math.min(this.canvas.width - 10, node.x));
            }
            if (node.y < 10 || node.y > this.canvas.height - 10) {
                node.vy *= -0.8;
                node.y = Math.max(10, Math.min(this.canvas.height - 10, node.y));
            }
            
            // Velocity damping
            node.vx *= 0.99;
            node.vy *= 0.99;
            
            // Activity decay
            node.activity *= 0.98;
            
            // Update pulse
            node.pulse += node.pulseSpeed;
            
            // Spontaneous firing for hub nodes
            if (node.type === 'hub' && Math.random() < 0.002) {
                this.createPulse(index);
            }
        });
        
        // Update pulses
        this.pulses = this.pulses.filter(pulse => {
            pulse.progress += pulse.speed * pulse.direction;
            pulse.life -= 0.01;
            
            return pulse.progress >= 0 && pulse.progress <= 1 && pulse.life > 0;
        });
        
        // Draw connections with enhanced effects
        this.connections.forEach((conn, index) => {
            const fromNode = this.nodes[conn.from];
            const toNode = this.nodes[conn.to];
            
            // Base connection
            const activity = Math.max(fromNode.activity, toNode.activity);
            const alpha = (conn.strength * 0.6) + (activity * 0.8);
            
            this.ctx.beginPath();
            this.ctx.moveTo(fromNode.x, fromNode.y);
            this.ctx.lineTo(toNode.x, toNode.y);
            this.ctx.strokeStyle = `rgba(100, 255, 218, ${alpha})`;
            this.ctx.lineWidth = conn.strength * 1.5 + activity;
            this.ctx.stroke();
            
            // Draw active pulses on this connection
            this.pulses.forEach(pulse => {
                if (pulse.connectionIndex === index) {
                    const x = fromNode.x + (toNode.x - fromNode.x) * pulse.progress;
                    const y = fromNode.y + (toNode.y - fromNode.y) * pulse.progress;
                    
                    // Pulse glow
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 4, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(0, 255, 255, ${pulse.intensity * pulse.life})`;
                    this.ctx.shadowBlur = 15;
                    this.ctx.shadowColor = '#00ffff';
                    this.ctx.fill();
                    this.ctx.shadowBlur = 0;
                    
                    // Pulse trail
                    this.ctx.beginPath();
                    this.ctx.arc(x, y, 2, 0, Math.PI * 2);
                    this.ctx.fillStyle = `rgba(255, 255, 255, ${pulse.intensity * pulse.life * 0.8})`;
                    this.ctx.fill();
                }
            });
        });
        
        // Draw nodes with enhanced effects
        this.nodes.forEach(node => {
            const pulseIntensity = Math.sin(node.pulse) * 0.4 + 0.6;
            const activityGlow = node.activity * 0.5;
            const totalIntensity = Math.min(1, pulseIntensity + activityGlow);
            
            // Node type specific rendering
            if (node.type === 'hub') {
                // Hub nodes are larger and more prominent
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 100, 255, ${totalIntensity * 0.6})`;
                this.ctx.shadowBlur = 20;
                this.ctx.shadowColor = '#ff64ff';
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
            
            // Main node
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
            const nodeColor = node.type === 'hub' ? '255, 100, 255' : '0, 255, 255';
            this.ctx.fillStyle = `rgba(${nodeColor}, ${Math.min(1, totalIntensity * 1.5)})`;
            this.ctx.fill();
            
            // Activity ring
            if (node.activity > 0.3) {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, node.radius * 2.5, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(${nodeColor}, ${node.activity * 0.4})`;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }
            
            // Core highlight
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${totalIntensity * 0.8})`;
            this.ctx.fill();
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.resize();
            this.generateNetwork();
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas) {
            this.canvas.remove();
        }
    }
}

// Initialize neural network
document.addEventListener('DOMContentLoaded', () => {
    new NeuralNetwork();
});