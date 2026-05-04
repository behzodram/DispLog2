// Action Bar Controller
class ActionBar {
    constructor() {
        this.currentActive = null;
        this.isOpen = false;
        this.originalOnBack = null;
        this.init();
    }

    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupOnBackHandler();
    }

    setupElements() {
        this.toggleBtn = document.getElementById('barToggleBtn');
        this.actionBar = document.getElementById('actionBar');
        this.contentContainer = document.querySelector('.content-container');
    }

    setupEventListeners() {
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggleBar());
        }

        // Bar items uchun direct click handlers
        const barItems = document.querySelectorAll('.bar-item');
        barItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = item.getAttribute('data-action');
                this.selectBarItem(item, action);
            });
        });

        // Overlay'ga click qilinganda bar yopiladi
        document.addEventListener('click', (e) => {
            if (e.target.id === 'barOverlay') {
                this.closeBar();
            }
        });
    }

    // OnBack funksiyani o'zlashtirish
    setupOnBackHandler() {
        // Original OnBack function saqlab turamiz
        if (typeof OnBack !== 'undefined') {
            this.originalOnBack = OnBack;
        }

        // Global OnBack function qayta yozamiz
        window.OnBack = () => {
            if (this.isOpen) {
                this.closeBar();
                return true; // Back event handled
            }
            
            // Agar bar yopiq bo'lsa, original OnBack'ni chaqiramiz
            if (this.originalOnBack) {
                return this.originalOnBack();
            }
            return false;
        };
    }

    toggleBar() {
        if (this.isOpen) {
            this.closeBar();
        } else {
            this.openBar();
        }
    }

    openBar() {
        if (this.actionBar) {
            this.actionBar.style.display = 'flex';
            this.isOpen = true;
            this.toggleBtn.innerHTML = '✕';
            this.toggleBtn.style.color = '#e74c3c';
            
            // Overlay qo'shamiz
            this.showOverlay();
        }
    }

    closeBar() {
        if (this.actionBar) {
            this.actionBar.style.display = 'none';
            this.isOpen = false;
            this.toggleBtn.innerHTML = '☰';
            this.toggleBtn.style.color = 'white';
            
            // Overlay yopamiz
            this.hideOverlay();
        }
    }

    showOverlay() {
        let overlay = document.getElementById('barOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'barOverlay';
            overlay.className = 'bar-overlay';
            document.body.appendChild(overlay);
        }
        overlay.classList.add('show');
    }

    hideOverlay() {
        const overlay = document.getElementById('barOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }

    selectBarItem(itemElement, action) {
        // Barcha bar itemlardan active classni olib tashlaymiz
        const allBarItems = document.querySelectorAll('.bar-item');
        allBarItems.forEach(item => {
            item.classList.remove('active');
        });

        // Tanlangan itemga active classni qo'shamiz
        itemElement.classList.add('active');
        this.currentActive = action;

        // Content yuklaylik
        this.loadContent(action);
        
        // Bar avtomatik yopiladi
        setTimeout(() => {
            this.closeBar();
        }, 200);
    }

    loadContent(action) {
        // Barcha content itemlarni yopamiz
        const allItems = document.querySelectorAll('.content-item');
        allItems.forEach(item => {
            item.style.display = 'none';
            
            // Anor-uz tag'ni cleanup qilamiz (DOM duplikatlashmaslik uchun)
            const anorUzTag = item.querySelector('anor-uz');
            if (anorUzTag) {
                // Wrapper ichidagi content'ni tozalaymiz
                const wrapper = anorUzTag.querySelector('div');
                if (wrapper) {
                    wrapper.innerHTML = '';
                }
                // anor-uz tag'ni qayta initialize qilish uchun reconnect trigger qilamiz
                anorUzTag.innerHTML = '';
            }
        });

        // Tanlangan contenti ko'rsatamiz
        const selectedItem = document.getElementById(action);
        if (selectedItem) {
            selectedItem.style.display = 'block';

            // Agar anor-uz tag bo'lsa uni trigger qilamiz
            const anorUzTag = selectedItem.querySelector('anor-uz');
            if (anorUzTag) {
                // anor-uz'ni qayta yangilash uchun connectedCallback'ni chaqiramiz
                try {
                    // Avval eski content'ni tozalaymiz
                    anorUzTag.innerHTML = '';
                    
                    // Keyin qayta initialize qilamiz
                    if (typeof anorUzTag.connectedCallback === 'function') {
                        anorUzTag.connectedCallback();
                    }
                } catch (e) {
                    console.log('anor-uz refresh error:', e);
                }
            }

            console.log(`Content loaded: ${action}`);
        }
    }

    // Default content ni load qilish
    loadDefaultContent() {
        const firstBarItem = document.querySelector('.bar-item[data-action="kalit"]');
        if (firstBarItem) {
            firstBarItem.click();
        }
    }
}

// Sahifa yuklonganda ActionBar ni initialize qilamiz
document.addEventListener('DOMContentLoaded', () => {
    if (!window.actionBarInstance) {
        window.actionBarInstance = new ActionBar();
        
        // Bir oz vaqt kutib birinchi contentni yuklaylik
        setTimeout(() => {
            window.actionBarInstance.loadDefaultContent();
        }, 300);
    }
});

// Agar script allaqachon yuklangan bo'lsa
if (document.readyState !== 'loading') {
    if (!window.actionBarInstance) {
        window.actionBarInstance = new ActionBar();
        setTimeout(() => {
            window.actionBarInstance.loadDefaultContent();
        }, 300);
    }
}

