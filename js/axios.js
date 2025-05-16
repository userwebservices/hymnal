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
    const displaySection = document.querySelector('.display'),
          titleAimCover = document.getElementById('titleAimCover'),
          contentContainer = document.getElementById('contentContainer');
    
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
    /*function renderSong(song) {
        contentContainer.innerHTML = '';
        updateBackground(song);
        createOverlay();
        
        const fragment = document.createDocumentFragment();
        const container = document.createElement('div');
        container.innerHTML = `${song.title || ''}${song.estrofas || ''}`;
        fragment.appendChild(container);
        contentContainer.appendChild(fragment);
    }*/
   // ===== 7. Renderizar canción =====
        function renderSong(song) {
            contentContainer.innerHTML = '';
            
            // Ocultar overlay estático y mostrar dinámico
            document.querySelector('.display-overlay-static').classList.add('hidden');
            
            updateBackground(song);
            createDynamicOverlay(); // Cambiamos el nombre de esta función para mayor claridad
            
            const fragment = document.createDocumentFragment();
            const container = document.createElement('div');
            container.innerHTML = `${song.title || ''}${song.estrofas || ''}`;
            fragment.appendChild(container);
            contentContainer.appendChild(fragment);
        }

    // ===== 8. Funciones auxiliares =====
    /*function hideWelcomeMessage() {
        titleAimCover.style.display = 'none';
    }*/

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
        
        // Cambiamos el nombre de createOverlay a createDynamicOverlay para mayor claridad
        function createDynamicOverlay() {
            // Eliminar overlay dinámico anterior si existe
            document.querySelectorAll('.display-overlay-dynamic').forEach(overlay => {
                overlay.remove();
            });
            
            const overlay = document.createElement('div');
            overlay.className = 'display-overlay-dynamic';
            displaySection.appendChild(overlay);
        }


    //****************************** function updateBackground (song) ******************************

    function updateBackground(song) {
        const DEFAULT_BG_IMAGE = 'assets/bg/default/bg-default-03.jpg';
        const hasCustomBg = song['bg-img'] && song['bg-img'].trim() !== '';
        
        displaySection.style.backgroundImage = hasCustomBg  //Tiene bg porpia?
            ? `url('${song['bg-img']}')` //si, ponsela
            : `url('${DEFAULT_BG_IMAGE}')`; //No: ponle el bg default
        
            //Estilos para la hero image de bg
        displaySection.style.backgroundSize = 'cover';
        displaySection.style.backgroundPosition = 'center';
        displaySection.style.backgroundAttachment = 'fixed';
        displaySection.style.backgroundRepeat = 'no-repeat';
    }

    //******************************  E N D function updateBackground (song) ******************************



    //****************************** function createOverlay ******************************

    function createOverlay() {

        //agregamos la clase 'hide-original-overlay' a la sección display
        displaySection.classList.add('hide-original-overlay');
        
        document.querySelectorAll('.display-overlay').forEach(overlay => {
            overlay.remove();
        });
        
        const overlay = document.createElement('div');
        overlay.className = 'display-overlay';
        displaySection.appendChild(overlay);
    }
    // E N D ****************************** function createOverlay ******************************



    //****************************** function resetToWelcomeScreen ******************************
    function resetToWelcomeScreen() {
        // Mostrar overlay estático y eliminar dinámico
        document.querySelector('.display-overlay-static').classList.remove('hidden');
        document.querySelectorAll('.display-overlay-dynamic').forEach(overlay => {
            overlay.remove();
        });
        
        contentContainer.innerHTML = '';
        titleAimCover.style.display = 'block';
        displaySection.style.backgroundImage = 'url("../../assets/bg/back-shavuot-01.jpeg")';
    }
    //****************************** E N D function resetToWelcomeScreen ******************************


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
    









    // Function to calculate the day of the Omer count (Modified for May 15 = Day 30)
    function getOmerDay() {
        const today = new Date();
        
        // FORCE May 15 to be Day 30 (regardless of actual Omer count)
        if (today.getMonth() === 4 && today.getDate() === 15) { // May is month 4 (0-indexed)
            return 30;
        }
        
        // Original Omer calculation for other dates
        const omerStart2023 = new Date('2023-04-14');
        const omerStart2024 = new Date('2024-04-24');
        const omerStart2025 = new Date('2025-04-14');
        
        let omerStart;
        if (today.getFullYear() === 2023) omerStart = omerStart2023;
        else if (today.getFullYear() === 2024) omerStart = omerStart2024;
        else if (today.getFullYear() === 2025) omerStart = omerStart2025;
        else {
            omerStart = omerStart2025;
        }
        
        const diffTime = today - omerStart;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
        
        if (diffDays > 0 && diffDays < 50) {
            return diffDays;
        } else {
            return 0;
        }
    }

    // Get today's Omer day count
    const omerDay = getOmerDay();

    // Update your title with the count if we're in the Omer period
    if (omerDay > 0) {
        titleAimCover.innerHTML = `<div class='overlaidTitle'>
            <h4>Día ${omerDay} del Omer</h4>    
            <h1>Siete semanas te contarás:</h1>
            <h2>Desde que comenzare la hoz en las mieses comenzarás á contarte las siete semanas. Y harás la solemnidad de las semanas á Jehová tu Dios: de la suficiencia voluntaria de tu mano será lo que dieres, según Jehová tu Dios te hubiere bendecido.</h2>
            <h3>Deut. 16:9</h3>
        </div>`;
    } else {
        titleAimCover.innerHTML = `<div class='overlaidTitle'>
            <h1>Siete semanas te contarás:</h1>
            <h2>Desde que comenzare la hoz en las mieses comenzarás á contarte las siete semanas. Y harás la solemnidad de las semanas á Jehová tu Dios: de la suficiencia voluntaria de tu mano será lo que dieres, según Jehová tu Dios te hubiere bendecido.</h2>
            <h3>Deut. 16:9</h3>
        </div>`;
    }
}); 