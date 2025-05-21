// js/modules/menuHandlers.js
export class MenuHandlers {
    constructor(appState, songHandlers) {
        this.appState = appState;
        this.songHandlers = songHandlers;
    }
    
    setupMenuHover() {
        const dropdowns = document.querySelectorAll('.nav-item.dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.querySelector('.dropdown-menu').classList.add('show');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.querySelector('.dropdown-menu').classList.remove('show');
            });
        });
    }
    
    setupMenuClicks() {
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                
                this.resetScrollPosition();
                
                const songId = item.dataset.songId;
                const category = item.closest('.dropdown-menu')
                                  .previousElementSibling.dataset.category;
                
                await new Promise(resolve => setTimeout(resolve, 50));
                await this.handleSongSelection(category, songId);
                
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            });
        });
    }
    
    setupTouchSupport() {
        if ('ontouchstart' in window) {
            document.querySelectorAll('.nav-item.dropdown > a').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const menu = trigger.nextElementSibling;
                    menu.classList.toggle('show');
                });
            });
            
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-item.dropdown')) {
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.classList.remove('show');
                    });
                }
            });
        }
    }
    
    resetScrollPosition() {
        const displayElement = document.querySelector('.display');
        if (displayElement) {
            displayElement.scrollIntoView({ behavior: 'smooth' });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 500);
    }
    
    async handleSongSelection(category, songId) {
        try {
            this.songHandlers.hideWelcomeMessage();
            
            if (!this.appState.jsonData) {
                await this.appState.loadJsonData();
            }
            
            const song = this.appState.findSong(category, songId);
            this.songHandlers.renderSong(song);
            
            this.appState.currentSong = { category, id: songId };
            
        } catch (error) {
            console.error('Error:', error);
            this.songHandlers.contentContainer.innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar la canción: ${error.message}
                </div>
            `;
            this.songHandlers.resetToWelcomeScreen();
        }
    }
}