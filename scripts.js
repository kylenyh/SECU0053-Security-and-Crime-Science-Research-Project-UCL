//* Digital Clock */
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = now.getHours().toString().padStart(2, '0');

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

    for (let i = 0; i < 371; i++) {
        const cell = document.createElement("div");
        cell.classList.add("heatmap-cell");
        const level = Math.floor(Math.random() * 4) + 1;
        cell.classList.add(`level-${level}`);
        cell.title = `Activity Level: ${getActivityLabel(level)}`;
        heatmap.appendChild(cell);
    }
}

function getActivityLabel(level) {
    switch(level) {
        case 1: return 'Low';
        case 2: return 'Medium'; 
        case 3: return 'High';
        case 4: return 'Critical';
        default: return 'Unknown';
    }
}

/* Navigation System */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            pages.forEach(page => page.classList.remove('active'));
            const targetPageElement = document.getElementById(`${targetPage}-page`);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
            }
            console.log(`Navigated to: ${targetPage}`);
        });
    });
}

/* Generate Bar Chart */
function generateBarChart() {
    const barChart = document.getElementById('bar-chart');
    if (!barChart) return;
    
    const epsilonData = [
        { value: 45, label: 'ε=0.1' },
        { value: 78, label: 'ε=0.5' },
        { value: 120, label: 'ε=1.0' },
        { value: 95, label: 'ε=2.0' },
        { value: 62, label: 'ε=5.0' }
    ];
    
    const maxValue = Math.max(...epsilonData.map(d => d.value));
    barChart.innerHTML = '';
    
    epsilonData.forEach(data => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        const height = (data.value / maxValue) * 100;
        bar.style.height = `${height}%`;
        
        const valueLabel = document.createElement('span');
        valueLabel.className = 'bar-value';
        valueLabel.textContent = data.value;
        bar.appendChild(valueLabel);
        
        barChart.appendChild(bar);
    });
}

/* Generate Line Chart */
function generateLineChart() {
    const latencyLine = document.getElementById('latency-line');
    const throughputLine = document.getElementById('throughput-line');
    
    if (!latencyLine || !throughputLine) return;
    
    const latencyPoints = [
        {x: 50, y: 200},
        {x: 130, y: 170},
        {x: 210, y: 140},
        {x: 290, y: 110},
        {x: 370, y: 90},
        {x: 450, y: 80}
    ];
    
    const throughputPoints = [
        {x: 50, y: 100},
        {x: 130, y: 120},
        {x: 210, y: 150},
        {x: 290, y: 180},
        {x: 370, y: 210},
        {x: 450, y: 230}
    ];
    
    const latencyPolyline = latencyPoints.map(p => `${p.x},${p.y}`).join(' ');
    const throughputPolyline = throughputPoints.map(p => `${p.x},${p.y}`).join(' ');
    
    latencyLine.setAttribute('points', latencyPolyline);
    throughputLine.setAttribute('points', throughputPolyline);
}

/* Generate Pie Chart */
function generatePieChart() {
    const pieChart = document.getElementById('pie-chart');
    if (!pieChart) return;
    
    const reasons = [
        { label: 'Performance Priority', value: 35, color: '#FF6B6B' },
        { label: 'Privacy Priority', value: 40, color: '#4ECDC4' },
        { label: 'Balanced Approach', value: 15, color: '#FFE66D' },
        { label: 'Situational', value: 10, color: '#95E1D3' }
    ];
    
    const total = reasons.reduce((sum, r) => sum + r.value, 0);
    let currentAngle = 0;
    const centerX = 140;
    const centerY = 140;
    const radius = 100;
    
    pieChart.innerHTML = '';
    
    reasons.forEach(reason => {
        const sliceAngle = (reason.value / total) * 360;
        const startAngle = currentAngle;
        const endAngle = currentAngle + sliceAngle;
        
        const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
        const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
        const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
        const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
        
        const largeArc = sliceAngle > 180 ? 1 : 0;
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const pathData = `
            M ${centerX} ${centerY}
            L ${startX} ${startY}
            A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}
            Z
        `;
        
        path.setAttribute('d', pathData);
        path.setAttribute('fill', reason.color);
        path.setAttribute('class', 'pie-slice');
        
        path.addEventListener('mouseenter', function() {
            this.style.opacity = '0.8';
        });
        
        path.addEventListener('mouseleave', function() {
            this.style.opacity = '1';
        });
        
        pieChart.appendChild(path);
        currentAngle += sliceAngle;
    });
}

/* Initialize all components */
document.addEventListener("DOMContentLoaded", () => {
    console.log('Initializing Zynex Dashboard...');
    updateClock();
    setInterval(updateClock, 1000);
    generateHeatmap();
    initializeNavigation();
    generateBarChart();
    generateLineChart();
    generatePieChart();
    console.log('Dashboard initialized successfully!');
});
