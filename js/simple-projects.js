// Simple Project Loader
const projects = {
    featured: [
        {
            name: "MoodSense AI",
            icon: "🎼",
            repo: "maheshh-v/MoodSense-AI",
            description: "Built an NLP-based app that detects emotions and suggests mood-aligned songs. Trained and compared LSTM-based models using GloVe embeddings.",
            tech: "Deep Learning Models",
            tags: ["TensorFlow", "Keras", "Pandas", "Streamlit", "NumPy", "Matplotlib"],
            aiComplexity: 9.2
        },
        {
            name: "Resume Q&A Chatbot",
            icon: "fa-solid fa-robot",
            repo: "maheshh-v/Resume-Q-A-Chatbot",
            description: "Built an intelligent chatbot to answer resume-related queries using FAISS for vector search and Hugging Face LLMs via LangChain.",
            tech: "Semantic Search + RAG Pipeline",
            tags: ["LangChain", "FAISS", "Hugging Face", "Pandas", "Scikit-learn"],
            aiComplexity: 8.8
        },
        {
            name: "SMS Spam Classifier",
            icon: "fa-solid fa-ban",
            repo: "maheshh-v/sms_spam_classifier",
            description: "Built an NLP spam detector with CountVectorizer and Naive Bayes (97% test accuracy); deployed via interactive Streamlit app.",
            tech: "NLP + Streamlit Dashboard",
            tags: ["Python", "Scikit-learn", "Pandas", "Streamlit", "NLTK"],
            aiComplexity: 7.5
        }
    ],
    all: [
        {
            name: "House Price Prediction",
            icon: "fa-solid fa-house-circle-dollar",
            repo: "maheshh-v/SmartHousePrice-Predictor",
            description: "Built and deployed a regression model with log-transformed targets; live app features a clean UI with 5 key inputs.",
            tech: "Streamlit Dashboard",
            tags: ["Python", "Scikit-learn", "Pandas", "Streamlit", "Git", "Numpy", "Matplotlib"],
            aiComplexity: 6.8
        },
        {
            name: "Titanic Survival Prediction",
            icon: "fa-solid fa-person-swimming",
            repo: "maheshh-v/Titanic-survival-prediction",
            description: "Built and deployed a high-performance classification model (ROC-AUC: 0.88) using engineered features.",
            tech: "End-to-End ML Pipeline + API",
            tags: ["Python", "Scikit-learn", "Flask", "Pandas", "NumPy"],
            aiComplexity: 7.2
        }
    ]
};

function createProjectCard(project) {
    const iconHtml = project.icon.startsWith('fa-') 
        ? `<i class="${project.icon}"></i>` 
        : project.icon;

    return `
        <div class="project-card fade-in">
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
                    <button class="btn project-details-btn" onclick="showProjectDetails('${project.repo}', '${project.name}')">
                        <i class="fas fa-info-circle"></i>
                        View Details
                    </button>
                    <a href="https://github.com/${project.repo}" target="_blank" class="btn btn-outline">
                        <i class="fab fa-github"></i>
                        View Code
                    </a>
                </div>
            </div>
        </div>
    `;
}

function loadFeaturedProjects() {
    const container = document.querySelector('.projects-grid');
    if (!container) return;
    
    container.innerHTML = projects.featured.map(project => createProjectCard(project)).join('');
    console.log('Featured projects loaded');
}

function loadAllProjects() {
    const container = document.querySelector('.all-projects-grid') || document.querySelector('.projects-grid');
    if (!container) return;
    
    const allProjects = [...projects.featured, ...projects.all];
    container.innerHTML = allProjects.map(project => createProjectCard(project)).join('');
    console.log('All projects loaded');
}

function showProjectDetails(repo, name) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('project-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'project-modal';
        modal.className = 'project-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="closeModal()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${name}</h2>
                    <button class="modal-close" onclick="closeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="modal-loading">
                        <div class="loading-spinner"></div>
                        <p>Loading project details...</p>
                    </div>
                    <div class="modal-readme" style="display: none;"></div>
                </div>
            </div>
        `;
        
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        document.body.appendChild(modal);
    }
    
    // Show modal
    modal.classList.add('active');
    modal.querySelector('.modal-title').textContent = name;
    modal.querySelector('.modal-loading').style.display = 'block';
    modal.querySelector('.modal-readme').style.display = 'none';
    
    // Fetch README
    fetchReadme(repo, modal);
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Add keyboard support for modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

async function fetchReadme(repo, modal) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}/readme`);
        if (!response.ok) throw new Error('README not found');
        
        const data = await response.json();
        const content = atob(data.content);
        displayReadme(content, repo, modal);
    } catch (error) {
        displayError(repo, modal);
    }
}

function displayReadme(readme, repo, modal) {
    modal.querySelector('.modal-loading').style.display = 'none';
    const readmeContainer = modal.querySelector('.modal-readme');
    
    const htmlContent = markdownToHtml(readme);
    
    readmeContainer.innerHTML = `
        <div class="project-meta">
            <div class="meta-item">
                <i class="fab fa-github"></i>
                <a href="https://github.com/${repo}" target="_blank">View Repository</a>
            </div>
        </div>
        <div class="readme-content">${htmlContent}</div>
    `;
    
    readmeContainer.style.display = 'block';
}

function displayError(repo, modal) {
    modal.querySelector('.modal-loading').style.display = 'none';
    const readmeContainer = modal.querySelector('.modal-readme');
    
    readmeContainer.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>README not available</h3>
            <p>Project details are not available at the moment.</p>
            <a href="https://github.com/${repo}" target="_blank" class="btn">
                <i class="fab fa-github"></i>
                View on GitHub
            </a>
        </div>
    `;
    
    readmeContainer.style.display = 'block';
}

function markdownToHtml(markdown) {
    // First preserve emojis and special characters
    const lines = markdown.split('\n');
    const htmlLines = lines.map(line => {
        // Handle headers
        if (line.startsWith('### ')) {
            return '<h3>' + line.substring(4) + '</h3>';
        } else if (line.startsWith('## ')) {
            return '<h2>' + line.substring(3) + '</h2>';
        } else if (line.startsWith('# ')) {
            return '<h1>' + line.substring(2) + '</h1>';
        }
        
        // Handle bold and italic
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Handle inline code
        line = line.replace(/`([^`]+)`/g, '<code>$1</code>');
        
        // Handle links
        line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        return line;
    });
    
    // Handle code blocks
    let html = htmlLines.join('<br>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    return html;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Loading projects...');
    
    // Check if we're on projects page (has all-projects-grid class)
    if (document.querySelector('.all-projects-grid')) {
        loadAllProjects();
        console.log('Projects page: All projects loaded');
    } else if (document.querySelector('.projects-grid')) {
        // We're on homepage
        loadFeaturedProjects();
        console.log('Homepage: Featured projects loaded');
    }
});