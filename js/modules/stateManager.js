// js/modules/stateManager.js
export class AppState {
    constructor() {
        this.currentSong = null;
        this.songsCache = new Map();
        this.jsonData = null;
    }
    
    async loadJsonData() {
        const response = await axios.get('/js/json/cantos.json');
        this.jsonData = response.data;
    }
    
    findSong(category, songId) {
        if (!this.jsonData[category]) {
            throw new Error(`Categoría ${category} no encontrada`);
        }
        
        const song = this.jsonData[category].find(item => item.id == songId);
        
        if (!song) {
            throw new Error(`Canción ID ${songId} no encontrada en ${category}`);
        }
        
        return song;
    }
}