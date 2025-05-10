// Función para resetear scroll al inicio
function resetScrollPosition() {
    const displayElement = document.querySelector('.display');
    if (displayElement) {
        displayElement.scrollIntoView({ behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 500);
}

document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const displaySection = document.querySelector('.display');
    const titleAimCover = document.getElementById('titleAimCover');
    const contentContainer = document.getElementById('contentContainer');
    
    // Estado de la aplicación
    const appState = {
        currentSong: null,
        songsCache: new Map(),
        jsonData: null
    };

    // ===== 1. Configuración de Hover para abrir menús =====
    const setupMenuHover = () => {
        const dropdowns = document.querySelectorAll('.nav-item.dropdown');
        
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', () => {
                dropdown.querySelector('.dropdown-menu').classList.add('show');
            });
            
            dropdown.addEventListener('mouseleave', () => {
                dropdown.querySelector('.dropdown-menu').classList.remove('show');
            });
        });
    };

    // ===== 2. Manejador de clic para selección =====
    const setupMenuClicks = () => {
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', async (e) => {
                e.preventDefault();
                
                resetScrollPosition();
                
                const songId = item.dataset.songId;
                const category = item.closest('.dropdown-menu')
                                  .previousElementSibling.dataset.category;
                
                await new Promise(resolve => setTimeout(resolve, 50));
                await handleSongSelection(category, songId);
                
                // Cerrar todos los dropdowns después de seleccionar
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('show');
                });
            });
        });
    };

    // ===== 3. Soporte para dispositivos táctiles =====
    const setupTouchSupport = () => {
        if ('ontouchstart' in window) {
            document.querySelectorAll('.nav-item.dropdown > a').forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    const menu = trigger.nextElementSibling;
                    menu.classList.toggle('show');
                });
            });
            
            // Cerrar menús al tocar fuera
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-item.dropdown')) {
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.classList.remove('show');
                    });
                }
            });
        }
    };

    // ===== 4. Función principal para manejar la selección =====
    async function handleSongSelection(category, songId) {
        try {
            hideWelcomeMessage();
            
            if (!appState.jsonData) {
                await loadJsonData();
            }
            
            const song = findSong(category, songId);
            renderSong(song);
            
            appState.currentSong = { category, id: songId };
            
        } catch (error) {
            handleError(error);
            resetToWelcomeScreen();
        }
    }

    // ===== 5. Cargar datos JSON =====
    async function loadJsonData() {
        const response = await axios.get('/js/json/cantos.json');
        appState.jsonData = response.data;
    }

    // ===== 6. Buscar canción en los datos =====
    function findSong(category, songId) {
        if (!appState.jsonData[category]) {
            throw new Error(`Categoría ${category} no encontrada`);
        }
        
        const song = appState.jsonData[category].find(item => item.id == songId);
        
        if (!song) {
            throw new Error(`Canción ID ${songId} no encontrada en ${category}`);
        }
        
        return song;
    }

    // ===== 7. Renderizar canción =====
    function renderSong(song) {
        contentContainer.innerHTML = '';
        updateBackground(song);
        createOverlay();
        
        const fragment = document.createDocumentFragment();
        const container = document.createElement('div');
        container.innerHTML = `${song.title || ''}${song.estrofas || ''}`;
        fragment.appendChild(container);
        contentContainer.appendChild(fragment);
    }

    // ===== 8. Funciones auxiliares =====
    function hideWelcomeMessage() {
        titleAimCover.style.display = 'none';
    }

    function updateBackground(song) {
        const DEFAULT_BG_IMAGE = 'assets/bg/default/bg-default-03.jpg';
        const hasCustomBg = song['bg-img'] && song['bg-img'].trim() !== '';
        
        displaySection.style.backgroundImage = hasCustomBg 
            ? `url('${song['bg-img']}')`
            : `url('${DEFAULT_BG_IMAGE}')`;
        
        displaySection.style.backgroundSize = 'cover';
        displaySection.style.backgroundPosition = 'center';
        displaySection.style.backgroundAttachment = 'fixed';
        displaySection.style.backgroundRepeat = 'no-repeat';
    }

    function createOverlay() {
        displaySection.classList.add('hide-original-overlay');
        
        document.querySelectorAll('.display-overlay').forEach(overlay => {
            overlay.remove();
        });
        
        const overlay = document.createElement('div');
        overlay.className = 'display-overlay';
        displaySection.appendChild(overlay);
    }

    function resetToWelcomeScreen() {
        displaySection.classList.remove('hide-original-overlay');
        contentContainer.innerHTML = '';
        titleAimCover.style.display = 'block';
        displaySection.style.backgroundImage = 'url("../../assets/bg/back-shavuot-01.jpeg")';
        document.querySelectorAll('.display-overlay').forEach(overlay => {
            overlay.remove();
        });
    }

    function handleError(error) {
        console.error('Error:', error);
        contentContainer.innerHTML = `
            <div class="alert alert-danger">
                Error al cargar la canción: ${error.message}
            </div>
        `;
    }

    // ===== Inicialización =====
    setupMenuHover();
    setupMenuClicks();
    setupTouchSupport();
    
    titleAimCover.innerHTML = `<div class='overlaidTitle'><h1>Y Daniel propuso en su corazón de no contaminarse</h1><h2>en la ración de la comida del rey, ni en el vino de su beber: pidió por tanto al príncipe de los eunucos de no contaminarse.</h2><h3>Dan. 1:8</h3></div>`;
});