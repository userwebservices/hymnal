// js/modules/utils.js
export function getOmerDay() {
    const today = new Date();
    
    // FORCE May 15 to be Day 30
    if (today.getMonth() === 4 && today.getDate() === 15) {
        return 30;
    }
    
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
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) - 1;
    
    if (diffDays > 0 && diffDays < 48) {
        return diffDays;
    } else {
        return 0;
    }
}

export function setupWelcomeMessage(titleAimCover) {
    const omerDay = getOmerDay();
    
    if (omerDay > 0) {
        titleAimCover.innerHTML = `<div class='overlaidTitle'> 
                <div class='overlaidInside'>
                    <i class='far fa-calendar-alt'></i>
                    <h4 class='ps-2'>Día ${omerDay} del Omer</h4>
                </div>
            <h1>Siete semanas te contarás:</h1>
            <h2>Desde que comenzare la hoz en las mieses comenzarás á contarte las siete semanas. Y harás la solemnidad de las semanas á Jehová tu Dios: de la suficiencia voluntaria de tu mano será lo que dieres, según Jehová tu Dios te hubiere bendecido.</h2>
                <div class='overlaidInsideVerse'>
                    <i class='fas fa-heart'></i>
                    <h3 class='ps-2'>Deut. 16:9</h3>
                </div>
        </div>`;
    } else {
        titleAimCover.innerHTML = `<div class='overlaidTitle'>

        <div class='overlaidInside'>
                    <!--<h4 class='ps-2'>PENTECOSTÉS</h4>-->
                </div>
            <img src="../../assets/img/icons/torch.svg" alt="torch icon" class="custom-icon ps-0">
            <h1>Y sucedió que puesto el sol, y ya obscurecido, </h1>
            <h2>Dejóse ver un horno humeando, y una <i><strong>antorcha de fuego</strong></i> que pasó por entre los animales divididos.</h2>
            <div class='overlaidInsideVerse'>
                    <i class='fas fa-book'></i>
                    <h3 class='ps-2'>Génesis 15:17</h3>

                </div> 
        </div>`;
    }  
}