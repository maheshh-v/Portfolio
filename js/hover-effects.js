// Professional 3D Hover Effects
class HoverEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupCardHovers();
        this.setupButtonHovers();
    }

    setupCardHovers() {
        const cards = document.querySelectorAll('.project-card, .skill-card, .stat-card, .profile-image-container');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.onCardEnter(card));
            card.addEventListener('mouseleave', () => this.onCardLeave(card));
            card.addEventListener('mousemove', (e) => this.onCardMove(e, card));
        });
    }

    setupButtonHovers() {
        const buttons = document.querySelectorAll('.btn, .social-link');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => this.onButtonEnter(button));
            button.addEventListener('mouseleave', () => this.onButtonLeave(button));
        });
    }

    onCardEnter(card) {
        card.style.transition = 'transform 0.1s ease-out';
    }

    onCardLeave(card) {
        card.style.transition = 'transform 0.5s ease-out';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    }

    onCardMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        card.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            translateZ(20px)
        `;
    }

    onButtonEnter(button) {
        button.style.transform = 'translateY(-3px) scale(1.02)';
    }

    onButtonLeave(button) {
        button.style.transform = 'translateY(0) scale(1)';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HoverEffects();
});