// js/modules/songHandlers.js
export class SongHandlers {
    constructor(displaySection, contentContainer, titleAimCover) {
        this.displaySection = displaySection;
        this.contentContainer = contentContainer;
        this.titleAimCover = titleAimCover;
    }
    
    renderSong(song) {
        this.contentContainer.innerHTML = '';
        
        // Ocultar overlay estático y mostrar dinámico
        document.querySelector('.display-overlay-static').classList.add('hidden');
        
        this.updateBackground(song);
        this.createDynamicOverlay();
        
        const fragment = document.createDocumentFragment();
        const container = document.createElement('div');
        container.innerHTML = `${song.title || ''}${song.estrofas || ''}`;
        fragment.appendChild(container);
        this.contentContainer.appendChild(fragment);
    }
    
    updateBackground(song) {
        const DEFAULT_BG_IMAGE = 'assets/bg/default/bg-default-01.webp';
        const hasCustomBg = song['bg-img'] && song['bg-img'].trim() !== '';
        
        document.querySelector('.display').style.backgroundImage = hasCustomBg
            ? `url('${song['bg-img']}')`
            : `url('${DEFAULT_BG_IMAGE}')`;
        
            document.querySelector('.display')
            .style.backgroundSize = 'cover';
            document.querySelector('.display')
            .style.backgroundPosition = 'center';
            document.querySelector('.display')
            .style.backgroundAttachment = 'fixed';
            document.querySelector('.display')
            .style.backgroundRepeat = 'no-repeat';
    }
    
    createDynamicOverlay() {
        document.querySelectorAll('.display-overlay-dynamic').forEach(overlay => {
            overlay.remove();
        });
        
        const overlay = document.createElement('div');
        overlay.className = 'display-overlay-dynamic';
        document.querySelector('.display')
.appendChild(overlay);
    }
    




    resetToWelcomeScreen() {
        const display = this.displaySection;
        
        // Reset state first
        display.classList.remove('welcome-view');
        display.style.backgroundImage = '';
        
        // Force synchronous reflow
        void display.offsetWidth;
        
        // Apply new state
        display.style.backgroundImage = 'url("../../assets/bg/jagim/shavuot/bg-shavuot-01.webp")';
        display.classList.add('welcome-view');
        
        // Reset other elements
        document.querySelector('.display-overlay-static').classList.remove('hidden');
        document.querySelectorAll('.display-overlay-dynamic').forEach(overlay => {
            overlay.remove();
        });
        this.contentContainer.innerHTML = '';
        this.titleAimCover.style.display = 'block';
    }
    
    hideWelcomeMessage() {
        this.displaySection.classList.remove('welcome-view');
        this.titleAimCover.style.display = 'none';
    }

    










}