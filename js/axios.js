// js/axios.js
import { AppState } from './modules/stateManager.js';
import { SongHandlers } from './modules/songHandlers.js';
import { MenuHandlers } from './modules/menuHandlers.js';
import { SearchHandler } from './modules/search.js';
import { setupWelcomeMessage } from './modules/utils.js';


document.addEventListener('DOMContentLoaded', () => {
    // Initialize main components
    const displaySection = document.querySelector('.display');
    const contentContainer = document.getElementById('contentContainer');
    const titleAimCover = document.getElementById('titleAimCover');

    // Immediately set welcome view on initial load
    displaySection.classList.add('welcome-view');
    displaySection.style.backgroundImage = 'url("../../assets/bg/default/bg-tablas-25.webp")'; //Maneja la FOTO INICIAL
    
    
    // Create instances
    const appState = new AppState();
    const songHandlers = new SongHandlers(displaySection, contentContainer, titleAimCover);
    const menuHandlers = new MenuHandlers(appState, songHandlers);
    
    // Setup welcome message
    setupWelcomeMessage(titleAimCover);
    
    // Initialize features
    menuHandlers.setupMenuHover();
    menuHandlers.setupMenuClicks();
    menuHandlers.setupTouchSupport();
    
    // Initialize search
    new SearchHandler(appState, menuHandlers);
});

