/* Digital Clock */
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const displayHours = hours.toString().padStart(2, '0');

    document.getElementById('hours').textContent = displayHours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('ampm').textContent = ampm;

    const year = now.getFullYear();
    const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const month = monthNames[now.getMonth()];
    const day = now.getDate().toString().padStart(2, '0');

    document.getElementById('year').textContent = year;
    document.getElementById('month').textContent = month;
    document.getElementById('day').textContent = day;

    const dayOfWeek = now.getDay();
    document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.day')[dayOfWeek].classList.add('active');
}

/* Heatmap Generator */
function generateHeatmap() {
    const heatmap = document.getElementById("heatmap");
    if (!heatmap) return;
    heatmap.innerHTML = "";

    /* Generate cells for yearly heatmap - 53 weeks × 7 days grid layout */
    for (let i = 0; i < 371; i++) { /* Increased cell count for proper weekly grid */
        const cell = document.createElement("div");
        cell.classList.add("heatmap-cell");

        /* Random activity level (0-4) */
        const level = Math.floor(Math.random() * 5);
        if (level > 0) {
            cell.classList.add(`level-${level}`);
        }

        /* Add hover tooltip with activity level */
        cell.title = `Activity Level: ${getActivityLabel(level)}`;

        heatmap.appendChild(cell);
    }
}

/* Get activity label for tooltip */
function getActivityLabel(level) {
    switch(level) {
        case 1: return 'Low';
        case 2: return 'Medium'; 
        case 3: return 'High';
        case 4: return 'Critical';
        default: return 'Unknown';
    }
}

/* Initialize all components */
document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    setInterval(updateClock, 1000);
    generateHeatmap();
});
