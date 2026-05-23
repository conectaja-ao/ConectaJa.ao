/**
 * ============================================
 * CONECTA JÁ - PROFESSIONAL JAVASCRIPT
 * Enterprise-level Application Logic
 * Version: 1.0.0
 * ============================================
 */

'use strict';

// ============================================
// APPLICATION STATE
// ============================================
const AppState = {
    user: null,
    isAuthenticated: false,
    currentModal: null,
    searchResults: [],
    categories: [],
    providers: [],
    notifications: [],
};

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    API_BASE_URL: 'https://api.conectaja.ao/v1',
    STORAGE_KEY: 'conectaja_user',
    TOKEN_KEY: 'conectaja_token',
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 5000,
    ANIMATION_DURATION: 300,
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const Utils = {
    /**
     * Debounce function for search inputs
     */
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    /**
     * Throttle function for scroll events
     */
    throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    /**
     * Format currency to Kwanza
     */
    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 0,
        }).format(amount);
    },

    /**
     * Format date to Portuguese
     */
    formatDate(date) {
        return new Intl.DateTimeFormat('pt-AO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(date));
    },

    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate phone number (Angola format)
     */
    isValidPhone(phone) {
        const phoneRegex = /^(\+244|244)?[9][0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    /**
     * Generate unique ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Sanitize HTML to prevent XSS
     */
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    /**
     * Scroll to element smoothly
     */
    scrollToElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    /**
     * Copy text to clipboard
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            Toast.show('Copiado!', 'success');
        } catch (err) {
            console.error('Failed to copy:', err);
            Toast.show('Erro ao copiar', 'error');
        }
    },
};

// ============================================
// LOCAL STORAGE MANAGER
// ============================================
const Storage = {
    /**
     * Save data to localStorage
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },

    /**
     * Get data from localStorage
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },

    /**
     * Remove data from localStorage
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage
     */
    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Storage clear error:', error);
            return false;
        }
    },
};

// ============================================
// API SERVICE
// ============================================
const API = {
    /**
     * Make HTTP request
     */
    async request(endpoint, options = {}) {
        const url = `${CONFIG.API_BASE_URL}${endpoint}`;
        const token = Storage.get(CONFIG.TOKEN_KEY);

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        };

        try {
            const response = await fetch(url, { ...defaultOptions, ...options });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Authentication endpoints
     */
    auth: {
        async login(credentials) {
            // Simulated API call - replace with real endpoint
            return new Promise((resolve) => {
                setTimeout(() => {
                    const mockUser = {
                        id: Utils.generateId(),
                        name: credentials.email.split('@')[0],
                        email: credentials.email,
                        type: credentials.email.includes('provider') ? 'provider' : 'client',
                        avatar: `https://ui-avatars.com/api/?name=${credentials.email}&background=E63946&color=fff`,
                    };
                    resolve({ user: mockUser, token: 'mock_token_' + Utils.generateId() });
                }, 1000);
            });
        },

        async register(userData) {
            // Simulated API call - replace with real endpoint
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (userData.type === 'provider') {
                        resolve({
                            success: true,
                            message: 'Cadastro enviado para aprovação',
                            pendingApproval: true,
                        });
                    } else {
                        const mockUser = {
                            id: Utils.generateId(),
                            name: userData.name,
                            email: userData.email,
                            phone: userData.phone,
                            type: userData.type,
                            avatar: `https://ui-avatars.com/api/?name=${userData.name}&background=E63946&color=fff`,
                        };
                        resolve({
                            user: mockUser,
                            token: 'mock_token_' + Utils.generateId(),
                        });
                    }
                }, 1500);
            });
        },

        async logout() {
            return new Promise((resolve) => {
                setTimeout(() => resolve({ success: true }), 500);
            });
        },

        async forgotPassword(email) {
            return new Promise((resolve) => {
                setTimeout(() => resolve({ success: true, message: 'Email enviado' }), 1000);
            });
        },
    },

    /**
     * Search endpoints
     */
    search: {
        async query(params) {
            // Simulated search - replace with real endpoint
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        results: [],
                        total: 0,
                        page: 1,
                    });
                }, 800);
            });
        },

        async suggestions(query) {
            // Simulated autocomplete - replace with real endpoint
            return new Promise((resolve) => {
                const suggestions = [
                    'Canalizador em Luanda',
                    'Eletricista certificado',
                    'Professor de Inglês',
                    'Técnico de informática',
                    'Pintor profissional',
                ].filter((s) => s.toLowerCase().includes(query.toLowerCase()));

                setTimeout(() => resolve(suggestions), 300);
            });
        },
    },

    /**
     * Provider endpoints
     */
    providers: {
        async getAll(filters = {}) {
            return API.request('/providers', {
                method: 'GET',
                params: filters,
            });
        },

        async getById(id) {
            return API.request(`/providers/${id}`);
        },

        async getFeatured() {
            return API.request('/providers/featured');
        },
    },

    /**
     * Category endpoints
     */
    categories: {
        async getAll() {
            return API.request('/categories');
        },

        async getById(id) {
            return API.request(`/categories/${id}`);
        },
    },
};

// ============================================
// AUTHENTICATION MANAGER
// ============================================
const Auth = {
    /**
     * Initialize authentication
     */
    init() {
        const savedUser = Storage.get(CONFIG.STORAGE_KEY);
        const savedToken = Storage.get(CONFIG.TOKEN_KEY);

        if (savedUser && savedToken) {
            this.setUser(savedUser);
            UI.updateAuthUI(true);
        }
    },

    /**
     * Set current user
     */
    setUser(user) {
        AppState.user = user;
        AppState.isAuthenticated = true;
        Storage.set(CONFIG.STORAGE_KEY, user);
    },

    /**
     * Get current user
     */
    getUser() {
        return AppState.user;
    },

    /**
     * Login user
     */
    async login(credentials) {
        try {
            Loading.show();
            const response = await API.auth.login(credentials);

            if (response.user && response.token) {
                this.setUser(response.user);
                Storage.set(CONFIG.TOKEN_KEY, response.token);
                UI.updateAuthUI(true);
                Modal.close('loginModal');
                Toast.show('Login realizado com sucesso!', 'success');
                
                // Redirect based on user type
                setTimeout(() => {
                    if (response.user.type === 'provider') {
                        window.location.href = '/dashboard/provider';
                    } else if (response.user.type === 'admin') {
                        window.location.href = '/dashboard/admin';
                    } else {
                        window.location.href = '/dashboard/client';
                    }
                }, 1000);
            }
        } catch (error) {
            Toast.show(error.message || 'Erro ao fazer login', 'error');
        } finally {
            Loading.hide();
        }
    },

    /**
     * Register user
     */
    async register(userData) {
        try {
            Loading.show();
            const response = await API.auth.register(userData);

            if (response.pendingApproval) {
                Modal.close('registerModal');
                Toast.show(
                    'Cadastro enviado! Aguarde aprovação da equipa (24-48h)',
                    'success'
                );
            } else if (response.user && response.token) {
                this.setUser(response.user);
                Storage.set(CONFIG.TOKEN_KEY, response.token);
                UI.updateAuthUI(true);
                Modal.close('registerModal');
                Toast.show('Conta criada com sucesso!', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = '/dashboard/client';
                }, 1000);
            }
        } catch (error) {
            Toast.show(error.message || 'Erro ao criar conta', 'error');
        } finally {
            Loading.hide();
        }
    },

    /**
     * Logout user
     */
    async logout() {
        try {
            Loading.show();
            await API.auth.logout();

            AppState.user = null;
            AppState.isAuthenticated = false;
            Storage.remove(CONFIG.STORAGE_KEY);
            Storage.remove(CONFIG.TOKEN_KEY);

            UI.updateAuthUI(false);
            Toast.show('Sessão encerrada', 'success');

            // Redirect to home
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            Loading.hide();
        }
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return AppState.isAuthenticated;
    },
};

// ============================================
// MODAL MANAGER
// ============================================
const Modal = {
    /**
     * Open modal
     */
    open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            AppState.currentModal = modalId;
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            setTimeout(() => {
                const firstInput = modal.querySelector('input, textarea, select');
                if (firstInput) firstInput.focus();
            }, 100);
        }
    },

    /**
     * Close modal
     */
    close(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            AppState.currentModal = null;
            document.body.style.overflow = '';
            
            // Reset form if exists
            const form = modal.querySelector('form');
            if (form) form.reset();
        }
    },

    /**
     * Close current modal
     */
    closeCurrent() {
        if (AppState.currentModal) {
            this.close(AppState.currentModal);
        }
    },

    /**
     * Switch between modals
     */
    switch(fromModalId, toModalId) {
        this.close(fromModalId);
        setTimeout(() => this.open(toModalId), 300);
    },
};

// ============================================
// TOAST NOTIFICATIONS
// ============================================
const Toast = {
    /**
     * Show toast notification
     */
    show(message, type = 'info', duration = CONFIG.TOAST_DURATION) {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const icon = toast.querySelector('.toast__icon');
        const title = toast.querySelector('.toast__title');
        const messageEl = toast.querySelector('.toast__message');

        // Set icon based on type
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
        };

        icon.innerHTML = icons[type] || icons.info;

        // Set title
        const titles = {
            success: 'Sucesso!',
            error: 'Erro!',
            info: 'Informação',
            warning: 'Aviso!',
        };

        title.textContent = titles[type] || titles.info;
        messageEl.textContent = message;

        // Remove existing type classes
        toast.classList.remove('success', 'error', 'info', 'warning');
        toast.classList.add(type, 'show');

        // Auto hide
        setTimeout(() => this.hide(), duration);
    },

    /**
     * Hide toast
     */
    hide() {
        const toast = document.getElementById('toast');
        if (toast) {
            toast.classList.remove('show');
        }
    },
};

// ============================================
// LOADING OVERLAY
// ============================================
const Loading = {
    /**
     * Show loading overlay
     */
    show() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('active');
        }
    },

    /**
     * Hide loading overlay
     */
    hide() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
    },
};

// ============================================
// UI MANAGER
// ============================================
const UI = {
    /**
     * Update authentication UI
     */
    updateAuthUI(isAuthenticated) {
        const authActions = document.getElementById('authActions');
        const userMenu = document.getElementById('userMenu');

        if (isAuthenticated && AppState.user) {
            // Hide auth buttons
            if (authActions) authActions.style.display = 'none';

            // Show user menu
            if (userMenu) {
                userMenu.style.display = 'flex';
                const avatarImg = document.getElementById('userAvatarImg');
                const avatarName = document.getElementById('userAvatarName');

                if (avatarImg) avatarImg.src = AppState.user.avatar;
                if (avatarName) avatarName.textContent = AppState.user.name;
            }
        } else {
            // Show auth buttons
            if (authActions) authActions.style.display = 'flex';

            // Hide user menu
            if (userMenu) userMenu.style.display = 'none';
        }
    },

    /**
     * Animate counter numbers
     */
    animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = Math.floor(target);
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    },

    /**
     * Initialize counter animations
     */
    initCounters() {
        const counters = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const target = parseInt(entry.target.dataset.count);
                        this.animateCounter(entry.target, target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach((counter) => observer.observe(counter));
    },

    /**
     * Initialize scroll effects
     */
    initScrollEffects() {
        const header = document.getElementById('header');
        
        const handleScroll = Utils.throttle(() => {
            if (window.scrollY > 100) {
                header?.classList.add('scrolled');
            } else {
                header?.classList.remove('scrolled');
            }
        }, 100);

        window.addEventListener('scroll', handleScroll);
    },

    /**
     * Initialize smooth scroll
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    },
};

// ============================================
// FORM HANDLERS
// ============================================
const Forms = {
    /**
     * Initialize all forms
     */
    init() {
        this.initLoginForm();
        this.initRegisterForm();
        this.initSearchForm();
        this.initPasswordToggles();
        this.initPasswordStrength();
        this.initAccountTypeSelector();
    },

    /**
     * Login form handler
     */
    initLoginForm() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            // Validation
            if (!email || !password) {
                Toast.show('Preencha todos os campos', 'warning');
                return;
            }

            if (!Utils.isValidEmail(email) && !Utils.isValidPhone(email)) {
                Toast.show('Email ou telefone inválido', 'error');
                return;
            }

            await Auth.login({ email, password });
        });
    },

    /**
     * Register form handler
     */
    initRegisterForm() {
        const form = document.getElementById('registerForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const phone = document.getElementById('registerPhone').value.trim();
            const password = document.getElementById('registerPassword').value;
            const type = document.getElementById('accountType').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;

            // Validation
            if (!name || !email || !phone || !password) {
                Toast.show('Preencha todos os campos obrigatórios', 'warning');
                return;
            }

            if (!Utils.isValidEmail(email)) {
                Toast.show('Email inválido', 'error');
                return;
            }

            if (!Utils.isValidPhone(phone)) {
                Toast.show('Telefone inválido. Use formato: +244 9XX XXX XXX', 'error');
                return;
            }

            if (password.length < 8) {
                Toast.show('A senha deve ter no mínimo 8 caracteres', 'error');
                return;
            }

            if (!agreeTerms) {
                Toast.show('Aceite os termos de uso para continuar', 'warning');
                return;
            }

            const userData = { name, email, phone, password, type };

            // Add provider-specific fields
            if (type === 'provider') {
                const category = document.getElementById('providerCategory').value;
                const bio = document.getElementById('providerBio').value.trim();

                if (!category) {
                    Toast.show('Selecione uma categoria de serviço', 'warning');
                    return;
                }

                userData.category = category;
                userData.bio = bio;
            }

            await Auth.register(userData);
        });
    },

    /**
     * Search form handler
     */
    initSearchForm() {
        const form = document.getElementById('searchForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const query = document.getElementById('searchQuery').value.trim();
            const location = document.getElementById('searchLocation').value;
            const category = document.getElementById('searchCategory').value;

            if (!query && !category) {
                Toast.show('Digite algo para buscar', 'info');
                return;
            }

            // Redirect to search results page
            const params = new URLSearchParams();
            if (query) params.set('q', query);
            if (location) params.set('location', location);
            if (category) params.set('category', category);

            window.location.href = `/buscar?${params.toString()}`;
        });

        // Search autocomplete
        const searchInput = document.getElementById('searchQuery');
        if (searchInput) {
            const handleSearch = Utils.debounce(async (query) => {
                if (query.length < 2) return;

                try {
                    const suggestions = await API.search.suggestions(query);
                    this.displaySearchSuggestions(suggestions);
                } catch (error) {
                    console.error('Search suggestions error:', error);
                }
            }, CONFIG.DEBOUNCE_DELAY);

            searchInput.addEventListener('input', (e) => {
                handleSearch(e.target.value.trim());
            });
        }
    },

    /**
     * Display search suggestions
     */
    displaySearchSuggestions(suggestions) {
        const container = document.getElementById('searchSuggestions');
        if (!container) return;

        if (suggestions.length === 0) {
            container.innerHTML = '';
            container.style.display = 'none';
            return;
        }

        container.innerHTML = suggestions
            .map(
                (suggestion) => `
            <div class="search-suggestion-item">
                <i class="fas fa-search"></i>
                <span>${Utils.sanitizeHTML(suggestion)}</span>
            </div>
        `
            )
            .join('');

        container.style.display = 'block';

        // Add click handlers
        container.querySelectorAll('.search-suggestion-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                document.getElementById('searchQuery').value = suggestions[index];
                container.style.display = 'none';
            });
        });
    },

    /**
     * Password toggle functionality
     */
    initPasswordToggles() {
        document.querySelectorAll('[data-toggle-password]').forEach((button) => {
            button.addEventListener('click', function () {
                const input = this.closest('.form-input-wrapper').querySelector('input');
                const icon = this.querySelector('i');

                if (input.type === 'password') {
                    input.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    input.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
    },

    /**
     * Password strength indicator
     */
    initPasswordStrength() {
        const passwordInput = document.getElementById('registerPassword');
        const strengthBar = document.querySelector('.password-strength__bar');
        const strengthText = document.querySelector('.password-strength__text');

        if (!passwordInput || !strengthBar) return;

        passwordInput.addEventListener('input', function () {
            const password = this.value;
            let strength = 0;

            // Check length
            if (password.length >= 8) strength += 25;
            if (password.length >= 12) strength += 25;

            // Check for lowercase
            if (/[a-z]/.test(password)) strength += 12.5;

            // Check for uppercase
            if (/[A-Z]/.test(password)) strength += 12.5;

            // Check for numbers
            if (/[0-9]/.test(password)) strength += 12.5;

            // Check for special characters
            if (/[^a-zA-Z0-9]/.test(password)) strength += 12.5;

            // Update bar
            strengthBar.style.width = `${strength}%`;

            // Update color and text
            if (strength < 25) {
                strengthBar.style.background = '#EF476F';
                strengthText.textContent = 'Muito fraca';
            } else if (strength < 50) {
                strengthBar.style.background = '#FFB800';
                strengthText.textContent = 'Fraca';
            } else if (strength < 75) {
                strengthBar.style.background = '#F4A261';
                strengthText.textContent = 'Média';
            } else {
                strengthBar.style.background = '#06D6A0';
                strengthText.textContent = 'Forte';
            }
        });
    },

    /**
     * Account type selector
     */
    initAccountTypeSelector() {
        const selector = document.getElementById('accountTypeSelector');
        if (!selector) return;

        const buttons = selector.querySelectorAll('.account-type');
        const accountTypeInput = document.getElementById('accountType');
        const providerFields = document.getElementById('providerFields');

        buttons.forEach((button) => {
            button.addEventListener('click', function () {
                const type = this.dataset.type;

                // Update active state
                buttons.forEach((btn) => btn.classList.remove('active'));
                this.classList.add('active');

                // Update hidden input
                accountTypeInput.value = type;

                // Show/hide provider fields
                if (type === 'provider') {
                    providerFields.style.display = 'block';
                    document.getElementById('providerCategory').required = true;
                } else {
                    providerFields.style.display = 'none';
                    document.getElementById('providerCategory').required = false;
                }
            });
        });
    },
};

// ============================================
// EVENT LISTENERS
// ============================================
const Events = {
    /**
     * Initialize all event listeners
     */
    init() {
        this.initModalEvents();
        this.initNavigationEvents();
        this.initCategoryEvents();
        this.initSearchTags();
        this.initScrollButtons();
        this.initUserDropdown();
    },

    /**
     * Modal events
     */
    initModalEvents() {
        // Open modal buttons
        document.querySelectorAll('[data-modal]').forEach((button) => {
            button.addEventListener('click', function () {
                const modalId = this.dataset.modal;
                const type = this.dataset.type;

                Modal.open(modalId);

                // Set account type if specified
                if (type && modalId === 'registerModal') {
                    const accountTypeButton = document.querySelector(
                        `.account-type[data-type="${type}"]`
                    );
                    if (accountTypeButton) {
                        accountTypeButton.click();
                    }
                }
            });
        });

        // Close modal buttons
        document.querySelectorAll('[data-close-modal]').forEach((button) => {
            button.addEventListener('click', function () {
                const modal = this.closest('.modal');
                if (modal) {
                    Modal.close(modal.id);
                }
            });
        });

        // Switch modal buttons
        document.querySelectorAll('[data-switch-modal]').forEach((button) => {
            button.addEventListener('click', function (e) {
                e.preventDefault();
                const currentModal = this.closest('.modal');
                const targetModalId = this.dataset.switchModal;

                if (currentModal) {
                    Modal.switch(currentModal.id, targetModalId);
                }
            });
        });

        // Close modal on overlay click
        document.querySelectorAll('.modal__overlay').forEach((overlay) => {
            overlay.addEventListener('click', function () {
                const modal = this.closest('.modal');
                if (modal) {
                    Modal.close(modal.id);
                }
            });
        });

        // Close modal on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && AppState.currentModal) {
                Modal.closeCurrent();
            }
        });

        // Close toast
        const toastClose = document.querySelector('.toast__close');
        if (toastClose) {
            toastClose.addEventListener('click', () => Toast.hide());
        }
    },

    /**
     * Navigation events
     */
    initNavigationEvents() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navMenu = document.getElementById('navMenu');

        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', function () {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => Auth.logout());
        }
    },

    /**
     * Category card events
     */
    initCategoryEvents() {
        document.querySelectorAll('.category-card').forEach((card) => {
            card.addEventListener('click', function () {
                const category = this.dataset.category;
                if (category) {
                    window.location.href = `/servicos?categoria=${category}`;
                }
            });
        });
    },

    /**
     * Search tag events
     */
    initSearchTags() {
        document.querySelectorAll('.tag[data-search]').forEach((tag) => {
            tag.addEventListener('click', function () {
                const searchQuery = this.dataset.search;
                const searchInput = document.getElementById('searchQuery');

                if (searchInput) {
                    searchInput.value = searchQuery;
                    searchInput.focus();
                }
            });
        });
    },

    /**
     * Scroll to section buttons
     */
    initScrollButtons() {
        document.querySelectorAll('[data-scroll]').forEach((button) => {
            button.addEventListener('click', function () {
                const target = this.dataset.scroll;
                Utils.scrollToElement(`#${target}`);
            });
        });
    },

    /**
     * User dropdown toggle
     */
    initUserDropdown() {
        const userAvatar = document.getElementById('userAvatar');
        const userDropdown = document.getElementById('userDropdown');

        if (userAvatar && userDropdown) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.remove('active');
            });
        }
    },
};

// ============================================
// APPLICATION INITIALIZATION
// ============================================
const App = {
    /**
     * Initialize application
     */
    async init() {
        console.log('🚀 Conecta Já - Initializing...');

        try {
            // Initialize core modules
            Auth.init();
            Forms.init();
            Events.init();
            UI.initCounters();
            UI.initScrollEffects();
            UI.initSmoothScroll();

            console.log('✅ Application initialized successfully');
        } catch (error) {
            console.error('❌ Application initialization error:', error);
            Toast.show('Erro ao carregar aplicação', 'error');
        }
    },
};

// ============================================
// START APPLICATION
// ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// ============================================
// EXPORT FOR TESTING (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        App,
        Auth,
        API,
        Utils,
        Storage,
        Modal,
        Toast,
        Loading,
        UI,
        Forms,
    };
}