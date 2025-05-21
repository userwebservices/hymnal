// js/modules/search.js
export class SearchHandler {
    constructor(appState, songHandlers) {
        this.appState = appState;
        this.songHandlers = songHandlers;
        this.searchInput = document.getElementById('searchInput');
        this.searchResults = document.getElementById('searchResults');
        this.clearSearch = document.getElementById('clearSearch');
        
        this.setupSearch();
    }
    
    setupSearch() {
        this.searchInput.addEventListener('input', this.debounce(this.performSearch.bind(this), 300));
        this.searchInput.addEventListener('focus', this.onSearchFocus.bind(this));
        document.addEventListener('click', this.onDocumentClick.bind(this));
        this.clearSearch.addEventListener('click', this.onClearSearch.bind(this));
        this.searchInput.addEventListener('keydown', this.onSearchKeydown.bind(this));
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    highlightText(text, query) {
        if (!query) return text;
        const regex = new RegExp(query, 'gi');
        return text.replace(regex, match => 
            `<span class="search-highlight">${match}</span>`
        );
    }
    
    performSearch() {
        const query = this.searchInput.value.trim().toLowerCase();
        
        if (query.length < 2) {
            this.searchResults.classList.remove('show');
            this.clearSearch.classList.remove('visible');
            return;
        }
        
        this.clearSearch.classList.add('visible');
        
        if (!this.appState.jsonData) {
            console.error('JSON data not loaded');
            return;
        }
        
        const results = [];
        
        Object.keys(this.appState.jsonData).forEach(category => {
            this.appState.jsonData[category].forEach(song => {
                const lyricsText = song.estrofas ? 
                    song.estrofas.replace(/<[^>]*>/g, ' ') : '';
                
                const titleMatch = song.title && 
                    song.title.toLowerCase().includes(query);
                const lyricsMatch = lyricsText.toLowerCase().includes(query);
                
                if (titleMatch || lyricsMatch) {
                    results.push({
                        category,
                        song,
                        titleMatch,
                        lyricsMatch
                    });
                }
            });
        });
        
        this.displaySearchResults(results, query);
    }
    
    displaySearchResults(results, query) {
        this.searchResults.innerHTML = '';
        
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="dropdown-item text-muted">
                    No se encontraron resultados para "${query}"
                </div>
            `;
            this.searchResults.classList.add('show');
            return;
        }
        
        results.slice(0, 20).forEach(result => {
            const item = document.createElement('div');
            item.className = 'dropdown-item search-result-item';
            
            const titleText = result.song.title.replace(/<[^>]*>/g, ' ');
            const songNumberMatch = titleText.match(/^(\d+)/);
            const songNumber = songNumberMatch ? songNumberMatch[1] : '';
            const displayedTitle = this.highlightText(titleText, query);
            
            item.innerHTML = `
                <div class="d-flex justify-content-between">
                    <div>
                        <strong>${songNumber ? songNumber + '. ' : ''}${displayedTitle}</strong>
                        <div class="text-muted small">${result.category}</div>
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.songHandlers.handleSongSelection(result.category, result.song.id);
                this.searchInput.value = '';
                this.searchResults.classList.remove('show');
                this.clearSearch.classList.remove('visible');
            });
            
            this.searchResults.appendChild(item);
        });
        
        this.searchResults.classList.add('show');
    }
    
    onSearchFocus() {
        if (this.searchInput.value.trim().length >= 2) {
            this.searchResults.classList.add('show');
        }
    }
    
    onDocumentClick(e) {
        if (!this.searchInput.contains(e.target)) {
            this.searchResults.classList.remove('show');
        }
    }
    
    onClearSearch() {
        this.searchInput.value = '';
        this.searchResults.classList.remove('show');
        this.clearSearch.classList.remove('visible');
        this.searchInput.focus();
    }
    
    onSearchKeydown(e) {
        if (e.key === 'Escape') {
            this.searchInput.value = '';
            this.searchResults.classList.remove('show');
            this.clearSearch.classList.remove('visible');
        }
    }
}