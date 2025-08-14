// WARP Generator for GitHub Pages
class WarpGenerator {
    constructor() {
        this.services = [
            { id: "discord", name: "Discord", category: "Социальные сети" },
            { id: "youtube", name: "YouTube", category: "Социальные сети" },
            { id: "twitter", name: "Twitter (X)", category: "Социальные сети" },
            { id: "instagram", name: "Instagram", category: "Социальные сети" },
            { id: "facebook", name: "Facebook", category: "Социальные сети" },
            { id: "viber", name: "Viber", category: "Социальные сети" },
            { id: "tiktok", name: "TikTok", category: "Социальные сети" },
            { id: "spotify", name: "Spotify", category: "Стриминг" },
            { id: "zetflix", name: "Zetflix", category: "Стриминг" },
            { id: "nnmclub", name: "NNM-Club", category: "Торренты" },
            { id: "rutracker", name: "RuTracker", category: "Торренты" },
            { id: "kinozal", name: "Kinozal", category: "Торренты" },
            { id: "copilot", name: "GitHub Copilot", category: "Разработка" },
            { id: "canva", name: "Canva", category: "Разработка" },
            { id: "patreon", name: "Patreon", category: "Разработка" },
            { id: "animego", name: "AnimeGO", category: "Аниме" },
            { id: "jutsu", name: "Jutsu", category: "Аниме" },
            { id: "yummianime", name: "YummyAnime", category: "Аниме" },
            { id: "pornhub", name: "Pornhub", category: "18+" },
            { id: "xvideos", name: "Xvideos", category: "18+" },
            { id: "pornolab", name: "Pornolab", category: "18+" },
            { id: "ficbook", name: "Ficbook", category: "Прочее" },
            { id: "bestchange", name: "BestChange", category: "Прочее" }
        ];
        
        this.currentCallbackId = null;
        this.pollInterval = null;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.setupEventListeners();
        this.populateServices();
        this.updateRepository();
    }

    loadSettings() {
        // Load saved settings from localStorage
        const savedToken = localStorage.getItem('githubToken');
        const savedRepo = localStorage.getItem('repository');
        
        if (savedToken) {
            document.getElementById('githubToken').value = savedToken;
        }
        
        if (savedRepo) {
            document.getElementById('repository').value = savedRepo;
        }
    }

    saveSettings() {
        // Save settings to localStorage
        const token = document.getElementById('githubToken').value;
        const repo = document.getElementById('repository').value;
        
        if (token) localStorage.setItem('githubToken', token);
        if (repo) localStorage.setItem('repository', repo);
    }

    updateRepository() {
        // Try to auto-detect repository from current URL
        const currentUrl = window.location.href;
        const githubPagesMatch = currentUrl.match(/https:\/\/([^.]+)\.github\.io\/([^\/]+)/);
        
        if (githubPagesMatch) {
            const owner = githubPagesMatch[1];
            const repo = githubPagesMatch[2];
            document.getElementById('repository').value = `${owner}/${repo}`;
        }
    }

    setupEventListeners() {
        // Token help toggle
        document.getElementById('showTokenHelp').addEventListener('click', (e) => {
            e.preventDefault();
            const helpDiv = document.getElementById('tokenHelp');
            helpDiv.classList.toggle('hidden');
        });

        // Site mode change
        document.querySelectorAll('input[name="siteMode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const servicesSection = document.getElementById('servicesSection');
                if (radio.value === 'specific') {
                    servicesSection.classList.remove('hidden');
                } else {
                    servicesSection.classList.add('hidden');
                }
            });
        });

        // Generate button
        document.getElementById('generateBtn').addEventListener('click', () => {
            this.generateConfig();
        });

        // Save settings on input change
        document.getElementById('githubToken').addEventListener('input', () => this.saveSettings());
        document.getElementById('repository').addEventListener('input', () => this.saveSettings());
    }

    populateServices() {
        const container = document.querySelector('#servicesSection .grid');
        
        this.services.forEach(service => {
            const div = document.createElement('div');
            div.innerHTML = `
                <label class="flex items-center p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" value="${service.id}" class="mr-2 service-checkbox">
                    <span class="text-sm">${service.name}</span>
                </label>
            `;
            container.appendChild(div);
        });
    }

    getFormData() {
        const siteMode = document.querySelector('input[name="siteMode"]:checked').value;
        const deviceType = document.querySelector('input[name="deviceType"]:checked').value;
        
        let selectedServices = [];
        if (siteMode === 'specific') {
            selectedServices = Array.from(document.querySelectorAll('.service-checkbox:checked'))
                .map(checkbox => checkbox.value);
        }

        return {
            selectedServices: selectedServices.join(','),
            siteMode,
            deviceType,
            githubToken: document.getElementById('githubToken').value,
            repository: document.getElementById('repository').value
        };
    }

    async generateConfig() {
        const formData = this.getFormData();
        
        if (!formData.githubToken) {
            this.showError('Необходимо указать GitHub токен');
            return;
        }

        if (!formData.repository) {
            this.showError('Необходимо указать репозиторий');
            return;
        }

        if (formData.siteMode === 'specific' && !formData.selectedServices) {
            this.showError('Выберите хотя бы один сервис для конкретного режима');
            return;
        }

        this.saveSettings();
        this.currentCallbackId = Date.now().toString();
        
        try {
            // Show status section
            this.showStatus('Запуск GitHub Action...', 'loading');
            
            // Trigger GitHub Action
            await this.triggerGitHubAction(formData);
            
            // Start polling for results
            this.startPolling();
            
        } catch (error) {
            this.showError(`Ошибка: ${error.message}`);
        }
    }

    async triggerGitHubAction(formData) {
        const [owner, repo] = formData.repository.split('/');
        
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${formData.githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event_type: 'generate-warp-config',
                client_payload: {
                    selectedServices: formData.selectedServices,
                    siteMode: formData.siteMode,
                    deviceType: formData.deviceType,
                    callbackId: this.currentCallbackId
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        this.showStatus('GitHub Action запущен. Ожидание результата...', 'loading');
    }

    startPolling() {
        let attempts = 0;
        const maxAttempts = 60; // 5 минут максимум
        
        this.pollInterval = setInterval(async () => {
            attempts++;
            
            if (attempts > maxAttempts) {
                clearInterval(this.pollInterval);
                this.showError('Превышено время ожидания. Проверьте GitHub Actions вручную.');
                return;
            }

            try {
                const result = await this.checkActionResult();
                if (result) {
                    clearInterval(this.pollInterval);
                    this.showResult(result);
                } else {
                    this.showStatus(`Ожидание результата... (${attempts}/${maxAttempts})`, 'loading');
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 5000); // Проверяем каждые 5 секунд
    }

    async checkActionResult() {
        const formData = this.getFormData();
        const [owner, repo] = formData.repository.split('/');
        
        try {
            // Проверяем через GitHub Pages результат
            const resultUrl = `${window.location.origin}${window.location.pathname}api-results/latest.json`;
            const response = await fetch(resultUrl + '?t=' + Date.now());
            
            if (response.ok) {
                const data = await response.json();
                if (data.callbackId === this.currentCallbackId) {
                    return data;
                }
            }
        } catch (error) {
            // Fallback: проверяем через GitHub API
            console.log('Fallback to GitHub API check');
        }

        // Альтернативный способ: проверяем последние workflow runs
        try {
            const runsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/runs?per_page=5`, {
                headers: {
                    'Authorization': `token ${formData.githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (runsResponse.ok) {
                const runsData = await runsResponse.json();
                const recentRun = runsData.workflow_runs.find(run => 
                    run.name === 'Generate WARP Config' && 
                    run.status === 'completed' &&
                    new Date(run.created_at) > new Date(Date.now() - 10 * 60 * 1000) // Последние 10 минут
                );

                if (recentRun && recentRun.conclusion === 'success') {
                    return { runId: recentRun.id, status: 'completed' };
                }
            }
        } catch (error) {
            console.error('GitHub API check failed:', error);
        }

        return null;
    }

    showStatus(message, type = 'info') {
        const statusSection = document.getElementById('statusSection');
        const statusContent = document.getElementById('statusContent');
        
        let icon = '';
        let colorClass = '';
        
        switch (type) {
            case 'loading':
                icon = '<div class="loading-spinner inline-block mr-3"></div>';
                colorClass = 'text-blue-600';
                break;
            case 'success':
                icon = '<i class="fas fa-check-circle text-green-500 mr-3"></i>';
                colorClass = 'text-green-600';
                break;
            case 'error':
                icon = '<i class="fas fa-exclamation-circle text-red-500 mr-3"></i>';
                colorClass = 'text-red-600';
                break;
            default:
                icon = '<i class="fas fa-info-circle text-blue-500 mr-3"></i>';
                colorClass = 'text-blue-600';
        }

        statusContent.innerHTML = `
            <div class="flex items-center ${colorClass}">
                ${icon}
                <span>${message}</span>
            </div>
        `;

        statusSection.classList.remove('hidden');
        statusSection.classList.add('fade-in');
    }

    showResult(data) {
        const resultSection = document.getElementById('resultSection');
        const resultContent = document.getElementById('resultContent');

        if (data.gistId) {
            resultContent.innerHTML = `
                <div class="space-y-4">
                    <div class="flex items-center text-green-600">
                        <i class="fas fa-check-circle mr-3"></i>
                        <span class="font-semibold">Конфигурация успешно сгенерирована!</span>
                    </div>
                    
                    <div class="bg-gray-50 p-4 rounded-md">
                        <p class="text-sm text-gray-600 mb-2">Результат сохранен в GitHub Gist:</p>
                        <a href="https://gist.github.com/${data.gistId}" 
                           target="_blank" 
                           class="text-blue-600 hover:underline font-mono text-sm">
                            https://gist.github.com/${data.gistId}
                        </a>
                    </div>

                    <div class="flex space-x-3">
                        <a href="https://gist.github.com/${data.gistId}" 
                           target="_blank"
                           class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200">
                            <i class="fas fa-external-link-alt mr-2"></i>
                            Открыть результат
                        </a>
                        <button onclick="this.parentElement.parentElement.remove()" 
                                class="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-200">
                            <i class="fas fa-times mr-2"></i>
                            Закрыть
                        </button>
                    </div>
                </div>
            `;
        } else {
            resultContent.innerHTML = `
                <div class="text-red-600">
                    <i class="fas fa-exclamation-circle mr-3"></i>
                    <span>Не удалось получить результат. Проверьте GitHub Actions вручную.</span>
                </div>
            `;
        }

        resultSection.classList.remove('hidden');
        resultSection.classList.add('fade-in');
        
        // Hide status section
        document.getElementById('statusSection').classList.add('hidden');
    }

    showError(message) {
        this.showStatus(message, 'error');
        
        // Hide result section if visible
        document.getElementById('resultSection').classList.add('hidden');
        
        // Clear any running polls
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WarpGenerator();
});