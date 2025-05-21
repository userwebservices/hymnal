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
        const DEFAULT_BG_IMAGE = 'assets/bg/default/bg-default-02.jpg';
        const hasCustomBg = song['bg-img'] && song['bg-img'].trim() !== '';
        
        this.displaySection.style.backgroundImage = hasCustomBg
            ? `url('${song['bg-img']}')`
            : `url('${DEFAULT_BG_IMAGE}')`;
        
        this.displaySection.style.backgroundSize = 'cover';
        this.displaySection.style.backgroundPosition = 'center';
        this.displaySection.style.backgroundAttachment = 'fixed';
        this.displaySection.style.backgroundRepeat = 'no-repeat';
    }
    
    createDynamicOverlay() {
        document.querySelectorAll('.display-overlay-dynamic').forEach(overlay => {
            overlay.remove();
        });
        
        const overlay = document.createElement('div');
        overlay.className = 'display-overlay-dynamic';
        this.displaySection.appendChild(overlay);
    }
    
    resetToWelcomeScreen() {
        document.querySelector('.display-overlay-static').classList.remove('hidden');
        document.querySelectorAll('.display-overlay-dynamic').forEach(overlay => {
            overlay.remove();
        });
        
        this.contentContainer.innerHTML = '';
        this.titleAimCover.style.display = 'block';
        this.displaySection.style.backgroundImage = 'url("../../assets/bg/back-shavuot-01.jpeg")';
    }
    
    hideWelcomeMessage() {
        this.titleAimCover.style.display = 'none';
    }
}