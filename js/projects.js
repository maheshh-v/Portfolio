// Professional Project Management System
class ProjectManager {
    constructor() {
        this.projects = null;
        this.modal = null;
        this.init();
    }

    async init() {
        await this.loadProjects();
        this.createModal();
        
        // Check which page we're on and render accordingly
        if (document.querySelector('.projects-grid')) {
            this.renderFeaturedProjects();
        }
        if (document.querySelector('.all-projects-grid')) {
            this.renderAllProjects();
        }
        
        console.log('Projects loaded:', this.projects);
    }

    async loadProjects() {
        try {
            const response = await fetch('./data/projects.json');
            this.projects = await response.json();
        } catch (error) {
            console.error('Failed to load projects:', error);
            // Fallback projects if JSON fails to load
            this.projects = {
                featured: [
                    {
                        id: "moodsense-ai",
                        name: "MoodSense AI",
                        icon: "🎼",
                        repo: "maheshh-v/MoodSense-AI",
                        description: "Built an NLP-based app that detects emotions and suggests mood-aligned songs. Trained and compared LSTM-based models using GloVe embeddings.",
                        tech: "Deep Learning Models",
                        tags: ["TensorFlow", "Keras", "Pandas", "Streamlit", "NumPy", "Matplotlib"],
                        featured: true,
                        aiComplexity: 9.2
                    },
                    {
                        id: "resume-chatbot",
                        name: "Resume Q&A Chatbot",
                        icon: "fa-solid fa-robot",
                        repo: "maheshh-v/Resume-Q-A-Chatbot",
                        description: "Built an intelligent chatbot to answer resume-related queries using FAISS for vector search and Hugging Face LLMs via LangChain.",
                        tech: "Semantic Search + RAG Pipeline",
                        tags: ["LangChain", "FAISS", "Hugging Face", "Pandas", "Scikit-learn"],
                        featured: true,
                        aiComplexity: 8.8
                    },
                    {
                        id: "sms-spam",
                        name: "SMS Spam Classifier",
                        icon: "fa-solid fa-ban",
                        repo: "maheshh-v/sms_spam_classifier",
                        description: "Built an NLP spam detector with CountVectorizer and Naive Bayes (97% test accuracy); deployed via interactive Streamlit app.",
                        tech: "NLP + Streamlit Dashboard",
                        tags: ["Python", "Scikit-learn", "Pandas", "Streamlit", "NLTK"],
                        featured: true,
                        aiComplexity: 7.5
                    }
                ],
                all: []
            };
        }
    }

    createModal() {
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title"></h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-loading">
                        <div class="loading-spinner"></div>
                        <p>Loading project details...</p>
                    </div>
                    <div class="modal-readme"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        this.modal = modal;

        // Event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
        modal.querySelector('.modal-overlay').addEventListener('click', () => this.closeModal());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    renderFeaturedProjects() {
        const container = document.querySelector('.projects-grid');
        if (!container || !this.projects) return;

        container.innerHTML = '';
        
        this.projects.featured.forEach(project => {
            const card = this.createProjectCard(project);
            container.appendChild(card);
        });
    }

    renderAllProjects() {
        const container = document.querySelector('.all-projects-grid');
        if (!container || !this.projects) return;

        container.innerHTML = '';
        
        // Combine featured and all projects
        const allProjects = [...this.projects.featured, ...this.projects.all];
        
        allProjects.forEach(project => {
            const card = this.createProjectCard(project);
            container.appendChild(card);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card fade-in';
        
        const iconHtml = project.icon.startsWith('fa-') 
            ? `<i class="${project.icon}"></i>` 
            : project.icon;

        card.innerHTML = `
            <div class="project-content">
                <h3 class="project-title">
                    ${iconHtml}
                    ${project.name}
                </h3>
                <p class="project-desc">
                    <strong>${project.tech}</strong><br>
                    ${project.description}
                </p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <button class="btn project-details-btn" data-project="${project.id}">
                        <i class="fas fa-info-circle"></i>
                        View Details
                    </button>
                    <a href="https://github.com/${project.repo}" target="_blank" class="btn btn-outline">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                </div>
            </div>
        `;

        // Add click listener for details button
        card.querySelector('.project-details-btn').addEventListener('click', () => {
            this.showProjectDetails(project);
        });

        return card;
    }

    async showProjectDetails(project) {
        this.modal.classList.add('active');
        this.modal.querySelector('.modal-title').textContent = project.name;
        this.modal.querySelector('.modal-loading').style.display = 'block';
        this.modal.querySelector('.modal-readme').style.display = 'none';

        try {
            const readme = await this.fetchReadme(project.repo);
            this.displayReadme(readme, project);
        } catch (error) {
            this.displayError(project);
        }
    }

    async fetchReadme(repo) {
        const response = await fetch(`https://api.github.com/repos/${repo}/readme`);
        if (!response.ok) throw new Error('README not found');
        
        const data = await response.json();
        const content = atob(data.content);
        return content;
    }

    displayReadme(readme, project) {
        this.modal.querySelector('.modal-loading').style.display = 'none';
        const readmeContainer = this.modal.querySelector('.modal-readme');
        
        // Convert markdown to HTML (basic conversion)
        const htmlContent = this.markdownToHtml(readme);
        
        readmeContainer.innerHTML = `
            <div class="project-meta">
                <div class="meta-item">
                    <i class="fas fa-star"></i>
                    <span>AI Complexity: ${project.aiComplexity}/10</span>
                </div>
                <div class="meta-item">
                    <i class="fab fa-github"></i>
                    <a href="https://github.com/${project.repo}" target="_blank">View Repository</a>
                </div>
            </div>
            <div class="readme-content">${htmlContent}</div>
        `;
        
        readmeContainer.style.display = 'block';
    }

    displayError(project) {
        this.modal.querySelector('.modal-loading').style.display = 'none';
        const readmeContainer = this.modal.querySelector('.modal-readme');
        
        readmeContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>README not available</h3>
                <p>Project details are not available at the moment.</p>
                <a href="https://github.com/${project.repo}" target="_blank" class="btn">
                    <i class="fab fa-github"></i>
                    View on GitHub
                </a>
            </div>
        `;
        
        readmeContainer.style.display = 'block';
    }

    markdownToHtml(markdown) {
        return markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            .replace(/\n/gim, '<br>');
    }

    closeModal() {
        this.modal.classList.remove('active');
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing ProjectManager...');
    const projectManager = new ProjectManager();
    
    // Also try to initialize after a short delay
    setTimeout(() => {
        console.log('Delayed initialization...');
        if (document.querySelector('.projects-grid') && document.querySelector('.projects-grid').children.length === 0) {
            projectManager.renderFeaturedProjects();
        }
    }, 1000);
});