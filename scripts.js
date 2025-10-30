/* Digital Clock - Automatically detects user's local timezone
 * This clock will display the correct time for any user worldwide
 * based on their device's system timezone setting.
 * Examples:
 * - User in China: Shows China time (UTC+8)
 * - User in USA: Shows their local US time (UTC-5 to UTC-8)
 * - User in UK: Shows UK time (UTC+0 or UTC+1)
 * - User in Australia: Shows Australian time (UTC+8 to UTC+11)
 * - User in India: Shows India time (UTC+5:30)
 */
function updateClock() {
    // Get current date/time in user's local timezone
    const now = new Date();
    
    // Extract time components in user's local timezone
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Display hours in 24-hour format (00-23)
    const displayHours = now.getHours().toString().padStart(2, '0');

    // Update time display
    document.getElementById('hours').textContent = displayHours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('ampm').textContent = ampm;

    // Extract date components in user's local timezone
    const year = now.getFullYear();
    const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const month = monthNames[now.getMonth()];
    const day = now.getDate().toString().padStart(2, '0');

    // Update date display
    document.getElementById('year').textContent = year;
    document.getElementById('month').textContent = month;
    document.getElementById('day').textContent = day;

    // Highlight current day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = now.getDay();
    document.querySelectorAll('.day').forEach(d => d.classList.remove('active'));
    document.querySelectorAll('.day')[dayOfWeek].classList.add('active');
}

/* Navigation System */
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Remove active class from all nav links
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked nav link
            this.classList.add('active');
            
            // Hide all pages
            pages.forEach(page => page.classList.remove('active'));
            
            // Show target page
            const targetPageElement = document.getElementById(`${targetPage}-page`);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
            }
            
            console.log(`Navigated to: ${targetPage}`);
        });
    });
}

/* Heatmap Generator */
/* Heatmap Generator */
let currentHeatmapYear = 2025;
const MIN_HEATMAP_YEAR = 2025;
const MAX_HEATMAP_YEAR = 2035;

function generateHeatmap() {
    const heatmap = document.getElementById("heatmap");
    if (!heatmap) return;
    heatmap.innerHTML = "";

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Calculate days in each month for current year
    const daysInMonth = [];
    for (let month = 0; month < 12; month++) {
        daysInMonth.push(new Date(currentHeatmapYear, month + 1, 0).getDate());
    }
    
    // Generate cells column by column (month by month)
    for (let month = 0; month < 12; month++) {
        const days = daysInMonth[month];
        
        for (let day = 1; day <= days; day++) {
            const cell = document.createElement("div");
            cell.classList.add("heatmap-cell");
            
            // Random activity level
            const level = Math.floor(Math.random() * 4) + 1;
            cell.classList.add(`level-${level}`);
            
            // Calculate participant count based on level
            const participantCount = getParticipantCount(level);
            
            // Store data attributes
            cell.setAttribute('data-date', `${monthNames[month]} ${day}, ${currentHeatmapYear}`);
            cell.setAttribute('data-participants', participantCount);
            cell.setAttribute('data-level', level);
            
            // Add hover events
            cell.addEventListener('mouseenter', showHeatmapTooltip);
            cell.addEventListener('mouseleave', hideHeatmapTooltip);
            cell.addEventListener('mousemove', moveHeatmapTooltip);
            
            heatmap.appendChild(cell);
        }
    }
    
    updateYearSelector();
}

function getParticipantCount(level) {
    switch(level) {
        case 1: return Math.floor(Math.random() * 10) + 1;      // 1-10
        case 2: return Math.floor(Math.random() * 15) + 11;     // 11-25
        case 3: return Math.floor(Math.random() * 15) + 26;     // 26-40
        case 4: return Math.floor(Math.random() * 10) + 41;     // 41-50
        default: return 0;
    }
}

function showHeatmapTooltip(e) {
    const tooltip = document.getElementById('heatmap-tooltip');
    if (!tooltip) return;
    
    const date = this.getAttribute('data-date');
    const participants = this.getAttribute('data-participants');
    
    tooltip.textContent = `${participants} participants on ${date}`;
    tooltip.style.opacity = '1';
    moveHeatmapTooltip(e);
}

function hideHeatmapTooltip() {
    const tooltip = document.getElementById('heatmap-tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
    }
}

function moveHeatmapTooltip(e) {
    const tooltip = document.getElementById('heatmap-tooltip');
    if (!tooltip) return;
    
    tooltip.style.left = (e.pageX + 15) + 'px';
    tooltip.style.top = (e.pageY + 15) + 'px';
}

function updateYearSelector() {
    const yearButtons = document.querySelectorAll('.year-option');
    
    yearButtons.forEach(button => {
        const year = parseInt(button.getAttribute('data-year'));
        if (year === currentHeatmapYear) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function initializeYearSelector() {
    const yearButtons = document.querySelectorAll('.year-option');
    
    yearButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedYear = parseInt(this.getAttribute('data-year'));
            currentHeatmapYear = selectedYear;
            generateHeatmap();
        });
    });
    
    // Set initial active state
    updateYearSelector();
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
        {x: 50, y: 200}, {x: 130, y: 170}, {x: 210, y: 140},
        {x: 290, y: 110}, {x: 370, y: 90}, {x: 450, y: 80}
    ];
    
    const throughputPoints = [
        {x: 50, y: 100}, {x: 130, y: 120}, {x: 210, y: 150},
        {x: 290, y: 180}, {x: 370, y: 210}, {x: 450, y: 230}
    ];
    
    latencyLine.setAttribute('points', latencyPoints.map(p => `${p.x},${p.y}`).join(' '));
    throughputLine.setAttribute('points', throughputPoints.map(p => `${p.x},${p.y}`).join(' '));
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
    const centerX = 140, centerY = 140, radius = 100;
    
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
        const pathData = `M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;
        
        path.setAttribute('d', pathData);
        path.setAttribute('fill', reason.color);
        path.setAttribute('class', 'pie-slice');
        
        path.addEventListener('mouseenter', function() { this.style.opacity = '0.8'; });
        path.addEventListener('mouseleave', function() { this.style.opacity = '1'; });
        
        pieChart.appendChild(path);
        currentAngle += sliceAngle;
    });
}


/* ============================================
   USER ID MANAGEMENT
   ============================================ */

// Generate User ID on page load and store in localStorage
function generateUserId() {
    // Check if user already has an ID stored
    let userId = localStorage.getItem('zynex_user_id');
    
    // If no ID exists, generate a new one
    if (!userId) {
        const random = Math.floor(Math.random() * 9000) + 1000;
        userId = `U-${random}`;
        localStorage.setItem('zynex_user_id', userId);
    }
    
    return userId;
}

// Clear user ID (for testing - generates new ID on next load)
function clearUserId() {
    localStorage.removeItem('zynex_user_id');
}

let privacyState = {
    epsilon: 0.1,
    settingsChanged: 0,
    userId: generateUserId(),
    epsilonValues: [], // Track all epsilon values for average calculation
    totalEpsilonSum: 0, // Track sum for efficient average calculation
    sessionStartTime: new Date(), // Track when session started
    sessionEndTime: null, // Track when session ended
    sessionEnded: false // Track if session has ended
};

// Track completion status with timestamps
let completionStatus = {
    consentCompleted: false,
    consentCompletedTime: null,
    privacyCompleted: false,
    privacyCompletedTime: null
};

function initializePrivacyControls() {
    const slider = document.getElementById('privacy-slider');
    const surveyButton = document.getElementById('survey-button');
    
    if (!slider) return;
    
    // Use 'input' event for real-time display updates
    slider.addEventListener('input', function() {
        const epsilon = parseFloat(this.value);
        updatePrivacyDisplay(epsilon);
        updateTradeoffMetrics(epsilon);
        updatePerformanceMetrics(epsilon);
        privacyState.epsilon = epsilon;
    });
    
    // Use 'change' event to count actual epsilon selections (when user releases slider)
    slider.addEventListener('change', function() {
        const epsilon = parseFloat(this.value);
        
        // Only count this as a new selection
        privacyState.settingsChanged++;
        
        // Track epsilon value for average calculation
        privacyState.epsilonValues.push(epsilon);
        privacyState.totalEpsilonSum += epsilon;
        
        console.log('Epsilon changed to:', epsilon);
        console.log('Total selections:', privacyState.settingsChanged);
        console.log('Epsilon values:', privacyState.epsilonValues);
        console.log('Average:', (privacyState.totalEpsilonSum / privacyState.epsilonValues.length).toFixed(2));
        
        updateSessionInfo();
        updateAccountInfo(); // Update average epsilon display
        
        // Update activity status
        updateRecentActivityStatus();
        
        // Trigger CAPTCHA based on epsilon value
        triggerCaptcha(() => {
            console.log('Privacy setting adjustment confirmed');
        });
    });
        
    if (surveyButton) {
        surveyButton.addEventListener('click', function() {
            openSurveyModal();
        });
    }
    
    updatePrivacyDisplay(0.1);
    updateTradeoffMetrics(0.1);
    updatePerformanceMetrics(0.1);
    updateSessionInfo();
}

/* ============================================
   ACCOUNT PAGE FUNCTIONALITY
   ============================================ */

function initializeAccountPage() {
    // Sync with privacy state
    updateAccountInfo();
    
    // Update session timer
    let sessionStartTime = Date.now();
    
    setInterval(() => {
        const elapsed = Date.now() - sessionStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const sessionDuration = document.getElementById('session-duration');
        if (sessionDuration) {
            sessionDuration.textContent = `${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
    
    // Update last updated time
    updateAccountTimestamp();
}

// Function to mark consent as completed
function markConsentCompleted() {
    completionStatus.consentCompleted = true;
    completionStatus.consentCompletedTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    updateRecentActivityStatus();
}

// Function to mark privacy questionnaire as completed (call this when actual questionnaire is submitted)
function markPrivacyQuestionnaireCompleted() {
    completionStatus.privacyCompleted = true;
    completionStatus.privacyCompletedTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    updateRecentActivityStatus();
}

// Update Recent Activity status based on completion
function updateRecentActivityStatus() {
    // Update consent form status
    const consentDot = document.getElementById('consent-dot');
    const consentTitle = document.getElementById('consent-title');
    const consentTime = document.getElementById('consent-time');
    
    if (consentDot && consentTitle && consentTime) {
        if (completionStatus.consentCompleted) {
            consentDot.classList.remove('pending');
            consentDot.classList.add('active');
            consentTitle.textContent = 'Consent Form Completed';
            consentTime.textContent = completionStatus.consentCompletedTime || new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
        } else {
            consentDot.classList.add('pending');
            consentDot.classList.remove('active');
            consentTitle.textContent = 'Consent Form Not Completed';
            consentTime.textContent = 'Pending';
        }
    }
    
    // Update privacy form status (questionnaire completion, NOT epsilon adjustment)
    const privacyDot = document.getElementById('privacy-dot');
    const privacyTitle = document.getElementById('privacy-title');
    const privacyTime = document.getElementById('privacy-time');

    if (privacyDot && privacyTitle && privacyTime) {
        if (completionStatus.privacyCompleted) {
            privacyDot.classList.remove('pending');
            privacyDot.classList.add('active');
            privacyTitle.textContent = 'Privacy Form Completed';
            privacyTime.textContent = completionStatus.privacyCompletedTime || new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
        } else {
            privacyDot.classList.remove('active');
            privacyDot.classList.add('pending');
            privacyTitle.textContent = 'Privacy Form Not Completed';
            privacyTime.textContent = 'Pending';
        }
    }
}

function updateAccountInfo() {
    // Update User ID throughout the page
    const accountUserId = document.getElementById('account-user-id');
    const sidebarUserId = document.getElementById('sidebar-user-id');
    const privacySessionId = document.getElementById('session-id');
    
    if (accountUserId) {
        accountUserId.textContent = privacyState.userId;
    }
    if (sidebarUserId) {
        sidebarUserId.textContent = privacyState.userId;
    }
    if (privacySessionId) {
        privacySessionId.textContent = privacyState.userId;
    }
    
    // Update epsilon value
    const accountEpsilon = document.getElementById('account-epsilon');
    if (accountEpsilon) {
        accountEpsilon.textContent = privacyState.epsilon.toFixed(2);
    }
    
    // Update privacy badge
    const privacyBadge = document.getElementById('account-privacy-badge');
    if (privacyBadge) {
        const epsilon = privacyState.epsilon;
        if (epsilon <= 0.5) {
            privacyBadge.textContent = 'Maximum Privacy';
            privacyBadge.style.backgroundColor = '#00ff00';
        } else if (epsilon <= 1.5) {
            privacyBadge.textContent = 'Moderate Privacy';
            privacyBadge.style.backgroundColor = '#ff8c00';
        } else if (epsilon <= 3.0) {
            privacyBadge.textContent = 'Low Privacy';
            privacyBadge.style.backgroundColor = '#ff4444';
        } else {
            privacyBadge.textContent = 'Minimal Privacy';
            privacyBadge.style.backgroundColor = '#cc0000';
        }
    }
    
    // Update epsilon changes count
    const epsilonChanges = document.getElementById('epsilon-changes');
    const decisionsCount = document.getElementById('decisions-count');
    if (epsilonChanges) {
        epsilonChanges.textContent = privacyState.settingsChanged;
    }
    if (decisionsCount) {
        decisionsCount.textContent = privacyState.settingsChanged;
    }
    
    // Calculate and display average epsilon
    const averageEpsilon = document.getElementById('average-epsilon');
    if (averageEpsilon) {
        if (privacyState.epsilonValues.length > 0) {
            const average = privacyState.totalEpsilonSum / privacyState.epsilonValues.length;
            averageEpsilon.textContent = average.toFixed(2);
        } else {
            averageEpsilon.textContent = '0.00';
        }
    }
}

/* ============================================
   SURVEY MODAL FUNCTIONALITY
   ============================================ */

function openSurveyModal() {
    const modal = document.getElementById('survey-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeSurveyModal() {
    const modal = document.getElementById('survey-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initializeSurveyModal() {
    const closeBtn = document.getElementById('survey-close-btn');
    const modal = document.getElementById('survey-modal');
    const surveyForm = document.getElementById('survey-form');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeSurveyModal();
        });
    }
    
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeSurveyModal();
            }
        });
    }
    
    if (surveyForm) {
        surveyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for completing the survey!\n\nYour feedback helps us improve privacy controls for everyone.');
            surveyForm.reset();
            closeSurveyModal();
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.getElementById('survey-modal');
            if (modal && modal.classList.contains('active')) {
                closeSurveyModal();
            }
        }
    });
}

/* ============================================
   PRIVACY PAGE FUNCTIONALITY
   ============================================ */

function updatePrivacyDisplay(epsilon) {
    const epsilonValue = document.getElementById('epsilon-value');
    const recommendationTitle = document.getElementById('recommendation-title');
    const recommendationText = document.getElementById('recommendation-text');
    const privacyLevelDisplay = document.querySelector('.privacy-level-display');
    
    if (epsilonValue) {
        epsilonValue.textContent = epsilon.toFixed(1);
    }
    
    if (privacyLevelDisplay) {
        const ratio = (epsilon - 0.1) / (5.0 - 0.1);
        const startR = 30, startG = 150, startB = 150;
        const endR = 10, endG = 40, endB = 40;
        
        const r = Math.round(startR + (endR - startR) * ratio);
        const g = Math.round(startG + (endG - startG) * ratio);
        const b = Math.round(startB + (endB - startB) * ratio);
        
        privacyLevelDisplay.style.background = `linear-gradient(135deg, rgb(${r}, ${g}, ${b}) 0%, #0a0a0a 100%)`;
    }
    
    if (recommendationTitle && recommendationText) {
        if (epsilon <= 0.5) {
            recommendationTitle.textContent = 'Maximum Privacy';
            recommendationText.textContent = 'Highest privacy protection with reduced utility';
        } else if (epsilon <= 1.5) {
            recommendationTitle.textContent = 'Balanced Privacy';
            recommendationText.textContent = 'Good balance between privacy and utility';
        } else if (epsilon <= 3.0) {
            recommendationTitle.textContent = 'Moderate Privacy';
            recommendationText.textContent = 'Better performance with moderate privacy';
        } else {
            recommendationTitle.textContent = 'Performance Priority';
            recommendationText.textContent = 'Maximum performance with minimal privacy';
        }
    }
}

function updateTradeoffMetrics(epsilon) {
    const accuracyBar = document.getElementById('accuracy-bar');
    const accuracyValue = document.getElementById('accuracy-value');
    const latencyBar = document.getElementById('latency-bar');
    const latencyValue = document.getElementById('latency-value');
    const throughputBar = document.getElementById('throughput-bar');
    const throughputValue = document.getElementById('throughput-value');
    
    const accuracy = Math.round(40 + (epsilon / 5.0) * 50);
    const latency = Math.round(100 - (epsilon / 5.0) * 50);
    const throughput = Math.round(30 + (epsilon / 5.0) * 60);
    
    if (accuracyBar && accuracyValue) {
        accuracyBar.style.width = accuracy + '%';
        accuracyValue.textContent = accuracy + '%';
    }
    
    if (latencyBar && latencyValue) {
        const latencyPercent = (latency / 100) * 100;
        latencyBar.style.width = latencyPercent + '%';
        latencyValue.textContent = latency + 'ms';
    }
    
    if (throughputBar && throughputValue) {
        throughputBar.style.width = throughput + '%';
        throughputValue.textContent = throughput + '%';
    }
}

function updatePerformanceMetrics(epsilon) {
    const responseTime = document.getElementById('response-time');
    const noiseLevel = document.getElementById('noise-level');
    const dataQuality = document.getElementById('data-quality');
    const privacyScore = document.getElementById('privacy-score');
    
    const responseMs = Math.round(250 - (epsilon / 5.0) * 100);
    const noise = Math.round(50 - (epsilon / 5.0) * 40);
    const quality = Math.round(50 + (epsilon / 5.0) * 40);
    const privacy = Math.round(10 - (epsilon / 5.0) * 6);
    
    if (responseTime) responseTime.textContent = responseMs;
    if (noiseLevel) noiseLevel.textContent = noise;
    if (dataQuality) dataQuality.textContent = quality;
    if (privacyScore) privacyScore.textContent = privacy;
}

function updateSessionInfo() {
    const sessionIdEl = document.getElementById('session-id');
    const settingsChangedEl = document.getElementById('settings-changed');
    const lastUpdatedEl = document.getElementById('last-updated');
    
    if (sessionIdEl) {
        sessionIdEl.textContent = privacyState.userId;
    }
    
    if (settingsChangedEl) {
        settingsChangedEl.textContent = privacyState.settingsChanged + ' times';
    }
    
    if (lastUpdatedEl) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        lastUpdatedEl.textContent = timeString;
    }
    
    // Update account info including privacy score in real-time
    updateAccountInfo();
}

/* ============================================
   CALENDAR FUNCTIONALITY
   
   AUTOMATIC TIMEZONE DETECTION:
   This calendar automatically detects and displays dates
   based on the user's local timezone. Just like the clock,
   it uses JavaScript's Date object which automatically
   adapts to the user's device settings.
   
   Examples of automatic adaptation:
   - User in China (UTC+8): Calendar shows Chinese date
   - User in USA (UTC-5 to UTC-8): Shows US date
   - User in UK (UTC+0/+1): Shows UK date
   - User in Australia (UTC+8 to UTC+11): Shows Australian date
   - User in Japan (UTC+9): Shows Japanese date
   
   The calendar will correctly show:
   ✓ Today's date for the user's location
   ✓ Current month for the user's location
   ✓ Current year for the user's location
   ✓ Correct day of the week for the user's location
   ============================================ */

let currentMonth = new Date().getMonth(); // Gets user's local current month (0-11)
let currentYear = new Date().getFullYear(); // Gets user's local current year
let selectedDate = new Date().getDate(); // Gets user's local current date
let selectedMonth = new Date().getMonth(); // Track selected month
let selectedYear = new Date().getFullYear(); // Track selected year
const today = new Date(); // Captures user's actual current date/time in their timezone

const MIN_YEAR = 2025;
const MAX_YEAR = 2035;
let pickerYear = currentYear; // Track picker year separately

function renderCalendar() {
    const calendarDays = document.getElementById('calendar-days');
    const currentDateEl = document.getElementById('current-date');
    const dateSelectorText = document.getElementById('date-selector-text');
    
    if (!calendarDays || !currentDateEl) return;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    currentDateEl.textContent = `${monthNames[currentMonth]}, ${currentYear}`;
    
    // Always show today's date at the top
    if (dateSelectorText) {
        const dayName = dayNames[today.getDay()];
        dateSelectorText.textContent = `${dayName}, ${monthNames[today.getMonth()]} ${today.getDate()}`;
    }
    
    calendarDays.innerHTML = '';
    
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day inactive';
        day.textContent = daysInPrevMonth - i;

        // Add click event
        day.addEventListener('click', function() {
            // Remove selected from all days
            document.querySelectorAll('.calendar-day.selected').forEach(d => {
                d.classList.remove('selected');
            });
            
            // Update selected date tracking
            selectedDate = parseInt(this.textContent);
            selectedMonth = currentMonth;
            selectedYear = currentYear;
            
            // Add selected to clicked day (unless it's today)
            if (!this.classList.contains('today')) {
                this.classList.add('selected');
            }
        });
        
        calendarDays.appendChild(day);
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        // Check if this is today
        if (i === today.getDate() && 
            currentMonth === today.getMonth() && 
            currentYear === today.getFullYear()) {
            day.classList.add('today');
        }
        
        // Check if this is the selected date
        if (i === selectedDate && 
            currentMonth === selectedMonth && 
            currentYear === selectedYear &&
            !day.classList.contains('today')) {
            day.classList.add('selected');
        }
        
        // Add click event
        day.addEventListener('click', function() {
            if (!this.classList.contains('inactive')) {
                // Remove selected from all days
                document.querySelectorAll('.calendar-day.selected').forEach(d => {
                    d.classList.remove('selected');
                });
                
                // Update selected date tracking
                selectedDate = parseInt(this.textContent);
                selectedMonth = currentMonth;
                selectedYear = currentYear;
                
                // Add selected to clicked day (unless it's today)
                if (!this.classList.contains('today')) {
                    this.classList.add('selected');
                }
            }
        });
        
        calendarDays.appendChild(day);
    }
    
    // Next month's days (to fill the grid)
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let i = 1; i <= remainingCells; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day inactive';
        day.textContent = i;
        
        // Add click event for next month days
        day.addEventListener('click', function() {
            // Remove selected from all days
            document.querySelectorAll('.calendar-day.selected').forEach(d => {
                d.classList.remove('selected');
            });
            
            // Add selected to this day
            this.classList.add('selected');
        });
        
        calendarDays.appendChild(day);
    }
}

function canGoToPrevMonth() {
    if (currentYear === MIN_YEAR && currentMonth === 0) {
        return false;
    }
    return true;
}

function canGoToNextMonth() {
    if (currentYear === MAX_YEAR && currentMonth === 11) {
        return false;
    }
    return true;
}

function initializeCalendar() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    const currentDateEl = document.getElementById('current-date');
    
    // Month/Year picker elements
    const picker = document.getElementById('month-year-picker');
    const prevYearBtn = document.getElementById('prev-year');
    const nextYearBtn = document.getElementById('next-year');
    const pickerYearEl = document.getElementById('picker-year');
    
    // Click on month/year to open picker
    if (currentDateEl) {
        currentDateEl.addEventListener('click', function() {
            pickerYear = currentYear; // Set picker to current calendar year
            openMonthYearPicker();
        });
    }
    
    // Previous year button
    if (prevYearBtn) {
        prevYearBtn.addEventListener('click', function() {
            if (pickerYear > MIN_YEAR) {
                pickerYear--;
                updatePickerDisplay();
            }
        });
    }
    
    // Next year button
    if (nextYearBtn) {
        nextYearBtn.addEventListener('click', function() {
            if (pickerYear < MAX_YEAR) {
                pickerYear++;
                updatePickerDisplay();
            }
        });
    }
    
    // Close picker when clicking outside
    if (picker) {
        document.addEventListener('click', function(e) {
            if (picker.classList.contains('active') && 
                !picker.contains(e.target) && 
                !currentDateEl.contains(e.target)) {
                closeMonthYearPicker();
            }
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (canGoToPrevMonth()) {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar();
                updateNavigationButtons();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (canGoToNextMonth()) {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar();
                updateNavigationButtons();
            }
        });
    }
    
    function updateNavigationButtons() {
        if (prevBtn) {
            prevBtn.style.opacity = canGoToPrevMonth() ? '1' : '0.3';
            prevBtn.style.cursor = canGoToPrevMonth() ? 'pointer' : 'not-allowed';
        }
        if (nextBtn) {
            nextBtn.style.opacity = canGoToNextMonth() ? '1' : '0.3';
            nextBtn.style.cursor = canGoToNextMonth() ? 'pointer' : 'not-allowed';
        }
    }
    
    renderCalendar();
    updateNavigationButtons();
    generateMonthsGrid();
}

/* ============================================
   NOTIFICATIONS PAGE FUNCTIONALITY
   ============================================ */

let notificationCount = 0;
let unreadCount = 0;

function updateNotificationBadge(count) {
    const badge = document.getElementById('bell-count');
    if (badge) {
        badge.textContent = count > 0 ? count : '0';
    }
}

function updateNotificationCounters() {
    const allCount = document.getElementById('all-count');
    const notificationsList = document.getElementById('notifications-list');
    
    if (notificationsList) {
        const notificationItems = notificationsList.querySelectorAll('.notification-item');
        notificationCount = notificationItems.length;
        
        if (allCount) allCount.textContent = notificationCount;
        
        updateNotificationBadge(unreadCount);
    }
}

function generateNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;

    const notificationTypes = [
        { icon: 'fa-sign-out-alt', title: 'User Left', getMessage: (userId) => `${userId} has exited the Zynex website`, tag: 'Exit' },
        { icon: 'fa-clipboard-check', title: 'Privacy Form Completed', getMessage: (userId) => `${userId} has completed the privacy form`, tag: 'Privacy' },
        { icon: 'fa-file-signature', title: 'Consent Form Completed', getMessage: (userId) => `${userId} has completed the consent form`, tag: 'Consent' },
        { icon: 'fa-eye', title: 'User Entered', getMessage: (userId) => `${userId} has entered the Zynex website`, tag: 'Page Access' }
    ];

    notificationsList.innerHTML = '';
    const now = Date.now();

    for (let userIndex = 0; userIndex < 27; userIndex++) {
        const random = Math.floor(Math.random() * 9000) + 1000;
        const userId = `U-${random}`; 
        for (let i = 0; i < 4; i++) {
            const type = notificationTypes[i];
            const notificationIndex = (userIndex * 4) + i;
            const secondsAgo = notificationIndex * 2;
            
            // Calculate actual time ago
            const timestamp = new Date(now - (secondsAgo * 1000));
            
            // Calculate time difference
            const diffMs = now - timestamp.getTime();
            const totalSeconds = Math.floor(diffMs / 1000);
            const totalMinutes = Math.floor(totalSeconds / 60);
            const totalHours = Math.floor(totalMinutes / 60);
            
            // Calculate remaining seconds, minutes after extracting hours/minutes
            const hours = totalHours;
            const minutes = totalMinutes % 60;
            const seconds = totalSeconds % 60;
            
            // Build time ago string with detailed format
            let timeAgo;
            if (hours > 0) {
                // Format: "3 hours 10 mins 50 seconds ago"
                timeAgo = `${hours} hour${hours !== 1 ? 's' : ''}`;
                if (minutes > 0) {
                    timeAgo += ` ${minutes} min${minutes !== 1 ? 's' : ''}`;
                }
                if (seconds > 0) {
                    timeAgo += ` ${seconds} second${seconds !== 1 ? 's' : ''}`;
                }
                timeAgo += ' ago';
            } else if (minutes > 0) {
                // Format: "10 mins 50 seconds ago"
                timeAgo = `${minutes} min${minutes !== 1 ? 's' : ''}`;
                if (seconds > 0) {
                    timeAgo += ` ${seconds} second${seconds !== 1 ? 's' : ''}`;
                }
                timeAgo += ' ago';
            } else {
                // Format: "50 seconds ago"
                timeAgo = `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
            }
            
            // Format timestamp for display
            const hoursDisplay = timestamp.getHours();
            const minutesDisplay = timestamp.getMinutes().toString().padStart(2, '0');
            const secondsDisplay = timestamp.getSeconds().toString().padStart(2, '0');
            const ampm = hoursDisplay >= 12 ? 'PM' : 'AM';
            const displayHours = (hoursDisplay % 12 || 12).toString().padStart(2, '0');
            const formattedTime = `${displayHours}:${minutesDisplay}:${secondsDisplay} ${ampm}`;
            
            const notification = document.createElement('div');
            notification.className = 'notification-item';
            notification.setAttribute('data-timestamp', timestamp.getTime()); // ADD THIS LINE
            notification.innerHTML = `
                <div class="notification-icon"><i class="fas ${type.icon}"></i></div>
                <div class="notification-content">
                    <h3 class="notification-title">${type.title}</h3>
                    <p class="notification-message">${type.getMessage(userId)}</p>
                    <div class="notification-footer">
                        <span class="notification-time">${timeAgo} at ${formattedTime}</span>
                    </div>
                </div>

                <div class="notification-status"></div>
                <div class="notification-actions">
                    <button class="notification-read-btn" data-read="false">
                        <i class="fas fa-envelope"></i>
                    </button>
                    <button class="notification-delete-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            notificationsList.appendChild(notification);
            unreadCount++;
        }
    }

    updateNotificationCounters();
    attachNotificationReadListeners();
}

/* Real-time notification time updater */
function updateNotificationTimes() {
    const now = Date.now();
    const notificationsList = document.getElementById('notifications-list');
    if (!notificationsList) return;
    
    const notifications = notificationsList.querySelectorAll('.notification-item');
    
    notifications.forEach(notification => {
        const timeElement = notification.querySelector('.notification-time');
        if (!timeElement) return;
        
        // Get the stored timestamp from data attribute
        const timestamp = parseInt(notification.getAttribute('data-timestamp'));
        if (!timestamp) return;
        
        // Calculate time difference
        const diffMs = now - timestamp;
        const totalSeconds = Math.floor(diffMs / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        
        // Calculate remaining seconds, minutes after extracting hours/minutes
        const hours = totalHours;
        const minutes = totalMinutes % 60;
        const seconds = totalSeconds % 60;
        
        // Build time ago string with detailed format
        let timeAgo;
        if (hours > 0) {
            timeAgo = `${hours} hour${hours !== 1 ? 's' : ''}`;
            if (minutes > 0) {
                timeAgo += ` ${minutes} min${minutes !== 1 ? 's' : ''}`;
            }
            if (seconds > 0) {
                timeAgo += ` and ${seconds} second${seconds !== 1 ? 's' : ''}`;
            }
            timeAgo += ' ago';
        } else if (minutes > 0) {
            timeAgo = `${minutes} min${minutes !== 1 ? 's' : ''}`;
            if (seconds > 0) {
                timeAgo += ` and ${seconds} second${seconds !== 1 ? 's' : ''}`;
            }
            timeAgo += ' ago';
        } else {
            timeAgo = `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        }
        
        // Get the formatted time from the existing text
        const fullText = timeElement.textContent;
        const atIndex = fullText.indexOf(' at ');
        const formattedTime = atIndex !== -1 ? fullText.substring(atIndex) : '';
        
        // Update the time display
        timeElement.textContent = `${timeAgo}${formattedTime}`;
    });
}

function attachNotificationReadListeners() {
    const readButtons = document.querySelectorAll('.notification-read-btn');
    
    readButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const notificationItem = this.closest('.notification-item');
            const isRead = this.getAttribute('data-read') === 'true';
            
            if (isRead) {
                // Mark as unread
                this.setAttribute('data-read', 'false');
                this.innerHTML = '<i class="fas fa-envelope"></i>';
                notificationItem.classList.remove('read');
                notificationItem.classList.add('unread');
                unreadCount++;
            } else {
                // Mark as read
                this.setAttribute('data-read', 'true');
                this.innerHTML = '<i class="fas fa-envelope-open"></i>';
                notificationItem.classList.remove('unread');
                notificationItem.classList.add('read');
                unreadCount--;
            }
            
            updateNotificationCounters();
        });
    });
    
    // Attach delete button listeners
    attachNotificationDeleteListeners();
}

function attachNotificationDeleteListeners() {
    const deleteButtons = document.querySelectorAll('.notification-delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const notificationItem = this.closest('.notification-item');
            const icon = this.querySelector('i');
            
            // Add closing animation class
            icon.classList.add('bin-closing');
            
            // Wait for animation, then remove notification
            setTimeout(() => {
                // Check if notification was unread
                const readButton = notificationItem.querySelector('.notification-read-btn');
                const isRead = readButton.getAttribute('data-read') === 'true';
                
                if (!isRead) {
                    unreadCount--;
                }
                
                // Remove the notification with fade out
                notificationItem.style.opacity = '0';
                notificationItem.style.transform = 'translateX(50px)';
                
                setTimeout(() => {
                    notificationItem.remove();
                    updateNotificationCounters();
                }, 300);
            }, 300);
        });
    });
}

function initializeNotifications() {
    const markReadBtn = document.querySelector('.mark-read-btn');
    const markUnreadBtn = document.querySelector('.mark-unread-btn');
    const clearBtn = document.querySelector('.clear-btn');
    const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');

    if (markReadBtn) {
        markReadBtn.addEventListener('click', function() {
            const readButtons = document.querySelectorAll('.notification-read-btn');
            const notificationItems = document.querySelectorAll('.notification-item');
            
            readButtons.forEach(button => {
                button.setAttribute('data-read', 'true');
                button.innerHTML = '<i class="fas fa-envelope-open"></i>';
            });
            
            notificationItems.forEach(item => {
                item.classList.remove('unread');
                item.classList.add('read');
            });
            
            unreadCount = 0;
            updateNotificationCounters();
            alert('All notifications marked as read!');
        });
    }

    if (markUnreadBtn) {
        markUnreadBtn.addEventListener('click', function() {
            const readButtons = document.querySelectorAll('.notification-read-btn');
            const notificationItems = document.querySelectorAll('.notification-item');
            
            readButtons.forEach(button => {
                button.setAttribute('data-read', 'false');
                button.innerHTML = '<i class="fas fa-envelope"></i>';
            });
            
            notificationItems.forEach(item => {
                item.classList.remove('read');
                item.classList.add('unread');
            });
            
            unreadCount = notificationCount;
            updateNotificationCounters();
            alert('All notifications marked as unread!');
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear all notifications?')) {
                const notificationsList = document.getElementById('notifications-list');
                if (notificationsList) {
                    notificationsList.innerHTML = '<p style="color: #888; text-align: center; padding: 40px;">No notifications</p>';
                    notificationCount = 0;
                    unreadCount = 0;
                    
                    const allCount = document.getElementById('all-count');
                    if (allCount) allCount.textContent = '0';
                    
                    updateNotificationBadge(0);
                }
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log('Initializing Zynex Dashboard...');
    
    updateClock();
    setInterval(updateClock, 1000);
    
    generateHeatmap();
    initializeYearSelector();
    initializeNavigation();
    initializeAccountPage();
    generateBarChart();
    generateLineChart();
    generatePieChart();
    initializePrivacyControls();
    initializeSurveyModal();
    initializeCalendar();
    generateNotifications();
    initializeNotifications();
    initializeConsentForm();
    initializeAIButton();  // ADD THIS LINE
    initializeCaptcha();
    dragController = makeAIDraggable();  // STORE the return value


    // ADD THESE TWO LINES:
    // Start updating notification times every second
    setInterval(updateNotificationTimes, 1000);


    console.log('Dashboard initialized successfully!');
});



/* ============================================
   CONSENT FORM FUNCTIONALITY
   ============================================ */

let checkedCount = 0;

function toggleCheckbox(num) {
    const checkbox = document.getElementById('check' + num);
    checkbox.checked = !checkbox.checked;
    updateProgress();
}

function updateProgress() {
    checkedCount = 0;
    for (let i = 1; i <= 5; i++) {
        if (document.getElementById('check' + i) && document.getElementById('check' + i).checked) {
            checkedCount++;
        }
    }

    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const continueBtn = document.getElementById('continueBtn');

    if (!progressFill || !progressText || !continueBtn) return;

    const percentage = (checkedCount / 5) * 100;
    progressFill.style.width = percentage + '%';
    progressText.textContent = checkedCount + ' of 5 items confirmed';

    if (checkedCount === 5) {
        continueBtn.classList.add('active');
        continueBtn.disabled = false;
        continueBtn.textContent = 'Continue to Dashboard';
        continueBtn.onclick = proceedToStudy;
    } else {
        continueBtn.classList.remove('active');
        continueBtn.disabled = true;
        continueBtn.textContent = 'Complete All Items to Continue';
        continueBtn.onclick = null;
    }
}

function declineConsent() {
    if (confirm('Are you sure you want to decline participation? The application will close.')) {
        alert('Thank you for your time. You may now close this window.');
    }
}

function proceedToStudy() {
    alert('Thank you for providing your consent!\n\nYou will now proceed to the Zynex dashboard.');
    
    // ADD THIS LINE:
    markConsentCompleted();

    // Navigate to home page
    const homeLink = document.querySelector('[data-page="home"]');
    if (homeLink) {
        homeLink.click();
    }
}

function initializeConsentForm() {
    // Initialize all checkboxes with change listeners
    for (let i = 1; i <= 5; i++) {
        const checkbox = document.getElementById('check' + i);
        if (checkbox) {
            checkbox.addEventListener('change', updateProgress);
        }
    }
}

/* ============================================
   FLOATING AI BUTTON FUNCTIONALITY
   ============================================ */

let dragController;  // Global variable to track drag state

function initializeAIButton() {
    const aiButton = document.getElementById('floating-ai-btn');
    const aiIcon = document.querySelector('.ai-icon');  // ADD THIS - target the center icon
    const aiModal = document.getElementById('ai-modal');
    const aiCloseBtn = document.getElementById('ai-close-btn');
    const aiInput = document.getElementById('ai-input');
    const aiSendBtn = document.getElementById('ai-send-btn');
    const aiChatContainer = document.getElementById('ai-chat-container');

    // Open AI Modal - ONLY when clicking the CENTER ICON
    if (aiIcon) {
        aiIcon.addEventListener('click', function(e) {
            e.stopPropagation();  // Prevent event bubbling
            
            // Small delay to ensure drag state is updated
            setTimeout(() => {
                // Only open if not dragged
                if (!dragController || !dragController.hasMoved()) {
                    if (aiModal) {
                        aiModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        if (aiInput) {
                            setTimeout(() => aiInput.focus(), 300);
                        }
                    }
                }
                // Reset movement flag after checking
                if (dragController) {
                    dragController.resetMovement();
                }
            }, 10);
        });

        // Also add touch support for mobile
        aiIcon.addEventListener('touchend', function(e) {
            e.stopPropagation();  // Prevent event bubbling
            
            setTimeout(() => {
                if (!dragController || !dragController.hasMoved()) {
                    if (aiModal) {
                        aiModal.classList.add('active');
                        document.body.style.overflow = 'hidden';
                        if (aiInput) {
                            setTimeout(() => aiInput.focus(), 300);
                        }
                    }
                }
                if (dragController) {
                    dragController.resetMovement();
                }
            }, 10);
        });
    }

    // Close AI Modal
    if (aiCloseBtn) {
        aiCloseBtn.addEventListener('click', function() {
            if (aiModal) {
                aiModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Close modal when clicking outside
    if (aiModal) {
        aiModal.addEventListener('click', function(e) {
            if (e.target === aiModal) {
                aiModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // Send message function
    function sendMessage() {
        if (!aiInput || !aiChatContainer) return;
        
        const message = aiInput.value.trim();
        if (message === '') return;

        // Add user message
        const userMessage = document.createElement('div');
        userMessage.className = 'ai-message ai-message-user';
        userMessage.innerHTML = `
            <div class="ai-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="ai-message-content">${message}</div>
        `;
        aiChatContainer.appendChild(userMessage);

        // Clear input
        aiInput.value = '';

        // Scroll to bottom
        aiChatContainer.scrollTop = aiChatContainer.scrollHeight;

        // Simulate AI response after a delay
        setTimeout(() => {
            const botMessage = document.createElement('div');
            botMessage.className = 'ai-message ai-message-bot';
            botMessage.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-bolt"></i>
                </div>
                <div class="ai-message-content">${getAIResponse(message)}</div>
            `;
            aiChatContainer.appendChild(botMessage);
            aiChatContainer.scrollTop = aiChatContainer.scrollHeight;
        }, 1000);
    }

    // Send message on button click
    if (aiSendBtn) {
        aiSendBtn.addEventListener('click', sendMessage);
    }

    // Send message on Enter key
    if (aiInput) {
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && aiModal && aiModal.classList.contains('active')) {
            aiModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

/* ============================================
   DRAGGABLE AI BUTTON FUNCTIONALITY
   ============================================ */

function makeAIDraggable() {
    const aiButton = document.getElementById('floating-ai-btn');
    if (!aiButton) return;

    let isDragging = false;
    let hasMoved = false;
    let currentX = 0;
    let currentY = 0;
    let initialX = 0;
    let initialY = 0;
    let xOffset = 0;
    let yOffset = 0;
    let startX = 0;
    let startY = 0;

    aiButton.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    // Touch events for mobile
    aiButton.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            startX = e.clientX;
            startY = e.clientY;
        }

        if (e.target === aiButton || aiButton.contains(e.target)) {
            isDragging = true;
            hasMoved = false;
            aiButton.style.cursor = 'grabbing';
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();

            let clientX, clientY;
            if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
                currentX = clientX - initialX;
                currentY = clientY - initialY;
            } else {
                clientX = e.clientX;
                clientY = e.clientY;
                currentX = clientX - initialX;
                currentY = clientY - initialY;
            }

            xOffset = currentX;
            yOffset = currentY;

            // Mark as moved if position changed by more than 5 pixels from start
            const deltaX = Math.abs(clientX - startX);
            const deltaY = Math.abs(clientY - startY);
            if (deltaX > 5 || deltaY > 5) {
                hasMoved = true;
            }

            setTranslate(currentX, currentY, aiButton);
        }
    }

    function dragEnd(e) {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
            aiButton.style.cursor = 'grab';
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    // Set initial cursor
    aiButton.style.cursor = 'grab';

    // Return methods to check and reset movement
    return {
        hasMoved: () => hasMoved,
        resetMovement: () => { hasMoved = false; }
    };
}

/* ============================================
   CAPTCHA SYSTEM (UPDATED)
   ============================================ */

let captchaState = {
    required: 0,
    completed: 0,
    textCode: '',
    isActive: false,
    pendingAction: null
};

// Calculate required CAPTCHAs based on epsilon
function calculateRequiredCaptchas(epsilon) {
    if (epsilon <= 0.5) return 10;
    if (epsilon <= 1.0) return 8;
    if (epsilon <= 2.0) return 6;
    if (epsilon <= 3.0) return 4;
    if (epsilon <= 4.0) return 2;
    return 1;
}

// Trigger CAPTCHA when privacy settings change
function triggerCaptcha(action) {
    // Don't trigger if already active
    if (captchaState.isActive) {
        return;
    }
    
    const epsilon = parseFloat(document.getElementById('privacy-slider').value);
    const requiredCaptchas = calculateRequiredCaptchas(epsilon);
    
    captchaState.required = requiredCaptchas;
    captchaState.completed = 0;
    captchaState.pendingAction = action;
    captchaState.isActive = true;
    
    updateCaptchaCounter(false); // Show "1 of X" for first CAPTCHA
    showNextCaptcha();
}

// Show next CAPTCHA challenge
function showNextCaptcha() {
    // FIXED: Check if we've already completed all required CAPTCHAs
    if (captchaState.completed >= captchaState.required) {
        completeCaptchaFlow();
        return;
    }
    
    const modal = document.getElementById('captcha-modal');
    const textSection = document.getElementById('text-captcha-section');
    const successSection = document.getElementById('captcha-success');
    
    // Hide success, show CAPTCHA
    textSection.classList.remove('hidden');
    successSection.classList.add('hidden');
    
    generateTextCaptcha();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Generate text-based CAPTCHA
function generateTextCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const length = Math.floor(Math.random() * 3) + 6; // 6-8 characters
    captchaState.textCode = '';
    
    // Generate random characters
    for (let i = 0; i < length; i++) {
        captchaState.textCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Update character count display
    document.getElementById('character-count').textContent = length;
    
    // Draw CAPTCHA on canvas
    const canvas = document.getElementById('captcha-canvas');
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // White background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add random curved lines for noise
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.3)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        ctx.moveTo(startX, startY);
        
        const cp1x = Math.random() * canvas.width;
        const cp1y = Math.random() * canvas.height;
        const cp2x = Math.random() * canvas.width;
        const cp2y = Math.random() * canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;
        
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.stroke();
    }
    
    // Draw distorted text
    ctx.font = 'bold 48px Arial';
    ctx.textBaseline = 'middle';
    
    const totalWidth = canvas.width - 40;
    const charSpacing = totalWidth / length;
    
    for (let i = 0; i < captchaState.textCode.length; i++) {
        ctx.save();
        
        const x = 20 + i * charSpacing + (Math.random() - 0.5) * 10;
        const y = 60 + (Math.random() - 0.5) * 20;
        const angle = (Math.random() - 0.5) * 0.5;
        const scale = 0.8 + Math.random() * 0.4;
        
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(scale, scale);
        
        // Random dark color for each character
        ctx.fillStyle = `rgb(${Math.random() * 80}, ${Math.random() * 80}, ${Math.random() * 80})`;
        ctx.fillText(captchaState.textCode[i], 0, 0);
        
        ctx.restore();
    }
    
    // Add light border
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    // Clear input
    document.getElementById('captcha-input').value = '';
    document.getElementById('captcha-input').focus();
}

// Verify text CAPTCHA
function verifyTextCaptcha() {
    const input = document.getElementById('captcha-input').value.trim();
    
    if (input === captchaState.textCode) {
        captchaState.completed++;
        showCaptchaSuccess();
    } else {
        alert('Incorrect code. Please try again.');
        generateTextCaptcha();
    }
}

// Show success message briefly, then move to next CAPTCHA
function showCaptchaSuccess() {
    const textSection = document.getElementById('text-captcha-section');
    const successSection = document.getElementById('captcha-success');
    
    if (!textSection || !successSection) return;
    
    // Hide the input section
    textSection.classList.add('hidden');
    
    // SHOW the success section by removing the hidden class
    successSection.classList.remove('hidden');
    
    updateCaptchaCounter(true); // Show completed number (e.g., "1 of 2")
    
    // FIXED: Check if we're done BEFORE showing success
    if (captchaState.completed >= captchaState.required) {
        // Show success for 1.5 seconds, then close
        setTimeout(() => {
            completeCaptchaFlow();
        }, 1500);
    } else {
        // Show success for 1.5 seconds, then show next CAPTCHA
        setTimeout(() => {
            showNextCaptcha();
        }, 1500);
    }
}

// Show next CAPTCHA challenge
function showNextCaptcha() {
    // FIXED: Check if we've already completed all required CAPTCHAs
    if (captchaState.completed >= captchaState.required) {
        completeCaptchaFlow();
        return;
    }
    
    const modal = document.getElementById('captcha-modal');
    const textSection = document.getElementById('text-captcha-section');
    const successSection = document.getElementById('captcha-success');
    
    if (!textSection || !successSection) return;
    
    // Hide success, show CAPTCHA
    textSection.classList.remove('hidden');
    successSection.classList.add('hidden');  // ADD THIS - hide success
    
    // Update counter for the next CAPTCHA to work on
    updateCaptchaCounter(false); // Show "2 of 2" etc.
    
    generateTextCaptcha();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Complete CAPTCHA flow
function completeCaptchaFlow() {
    const modal = document.getElementById('captcha-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    captchaState.isActive = false;
    
    // Execute pending action if any
    if (captchaState.pendingAction) {
        captchaState.pendingAction();
        captchaState.pendingAction = null;
    }
    
    alert(`Verification complete! You completed ${captchaState.completed} CAPTCHA(s) successfully.`);
}

// Update CAPTCHA counter display
// When inSuccess is true, show the number just completed
// When false, show the number about to work on
function updateCaptchaCounter(inSuccess = false) {
    const displayNumber = inSuccess ? captchaState.completed : captchaState.completed + 1;
    document.getElementById('captcha-current').textContent = displayNumber;
    document.getElementById('captcha-total').textContent = captchaState.required;
}

// Initialize CAPTCHA event listeners
function initializeCaptcha() {
    const verifyTextBtn = document.getElementById('verify-text-captcha');
    const captchaInput = document.getElementById('captcha-input');
    const audioBtn = document.querySelectorAll('.captcha-icon-btn')[0];
    const refreshBtn = document.querySelectorAll('.captcha-icon-btn')[1];
    
    if (verifyTextBtn) {
        verifyTextBtn.addEventListener('click', verifyTextCaptcha);
    }
    
    if (captchaInput) {
        // Prevent paste
        captchaInput.addEventListener('paste', function(e) {
            e.preventDefault();
            alert('Pasting is not allowed. Please type the characters manually.');
        });
        
        // Submit on Enter
        captchaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                verifyTextCaptcha();
            }
        });
    }
    
    // Audio button - reads the CAPTCHA code aloud
    if (audioBtn) {
        audioBtn.addEventListener('click', function() {
            // Use Web Speech API to read the text
            const utterance = new SpeechSynthesisUtterance(captchaState.textCode);
            utterance.rate = 0.8; // Slower speech for clarity
            utterance.pitch = 1;
            utterance.volume = 1;
            window.speechSynthesis.cancel(); // Cancel any previous speech
            window.speechSynthesis.speak(utterance);
        });
    }
    
    // Refresh button to generate new CAPTCHA
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            generateTextCaptcha();
        });
    }
}

/* ============================================
   ACCOUNT PAGE FUNCTIONALITY
   ============================================ */

function initializeAccountPage() {
    console.log('Initializing Account Page...');
    
    // Generate dynamic session ID with 6 random digits (S-XXXXXX format)
    const randomSixDigits = Math.floor(100000 + Math.random() * 900000); // Generates 100000-999999
    const sessionId = `S-${randomSixDigits}`;
    
    const accountSessionId = document.getElementById('account-session-id');
    if (accountSessionId) {
        accountSessionId.textContent = sessionId;
        console.log('Session ID set:', sessionId);
    }
    
    // Sync with privacy state
    updateAccountInfo();

    // Sync with privacy state
    updateAccountInfo();
    
    // ADD THIS LINE BELOW:
    updateRecentActivityStatus();
    
    // Update session timer
    let sessionStartTime = Date.now();
    
    setInterval(() => {
        const elapsed = Date.now() - sessionStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        
        const sessionDuration = document.getElementById('session-duration');
        if (sessionDuration) {
            sessionDuration.textContent = `${hours}h ${minutes}m ${seconds}s`;
        }
    }, 1000);
    
    // Update last updated time
    updateAccountTimestamp();
    
    console.log('Account Page initialized successfully');
}

function updateAccountInfo() {
    console.log('Updating account info...', privacyState);
    
    // Update User ID throughout the page
    const accountUserId = document.getElementById('account-user-id');
    const sidebarUserId = document.getElementById('sidebar-user-id');
    const privacySessionId = document.getElementById('session-id');
    
    if (accountUserId) {
        accountUserId.textContent = privacyState.userId;
        console.log('Updated account user ID:', privacyState.userId);
    }
    if (sidebarUserId) {
        sidebarUserId.textContent = privacyState.userId;
    }
    if (privacySessionId) {
        privacySessionId.textContent = privacyState.userId;
    }
    
    // Update epsilon value
    const accountEpsilon = document.getElementById('account-epsilon');
    if (accountEpsilon) {
        accountEpsilon.textContent = privacyState.epsilon.toFixed(2);
        console.log('Updated epsilon:', privacyState.epsilon);
    }
    
    // Update privacy badge
    const privacyBadge = document.getElementById('account-privacy-badge');
    if (privacyBadge) {
        const epsilon = privacyState.epsilon;
        if (epsilon <= 0.5) {
            privacyBadge.textContent = 'Maximum Privacy';
            privacyBadge.style.backgroundColor = '#00ff00';
        } else if (epsilon <= 1.5) {
            privacyBadge.textContent = 'Moderate Privacy';
            privacyBadge.style.backgroundColor = '#ff8c00';
        } else if (epsilon <= 3.0) {
            privacyBadge.textContent = 'Low Privacy';
            privacyBadge.style.backgroundColor = '#ff4444';
        } else {
            privacyBadge.textContent = 'Minimal Privacy';
            privacyBadge.style.backgroundColor = '#cc0000';
        }
        console.log('Updated privacy badge');
    }
    
    // Update epsilon changes count
    const epsilonChanges = document.getElementById('epsilon-changes');
    const decisionsCount = document.getElementById('decisions-count');
    if (epsilonChanges) {
        epsilonChanges.textContent = privacyState.settingsChanged;
    }
    if (decisionsCount) {
        decisionsCount.textContent = privacyState.settingsChanged;
    }
    
    // Calculate and display average epsilon
    const averageEpsilon = document.getElementById('average-epsilon');
    if (averageEpsilon) {
        if (privacyState.epsilonValues && privacyState.epsilonValues.length > 0) {
            const average = privacyState.totalEpsilonSum / privacyState.epsilonValues.length;
            averageEpsilon.textContent = average.toFixed(2);
            console.log('Updated average epsilon:', average.toFixed(2), 'from', privacyState.epsilonValues.length, 'values');
        } else {
            averageEpsilon.textContent = '0.00';
            console.log('No epsilon values yet');
        }
    } else {
        console.log('average-epsilon element not found');
    }
    
    console.log('Account info update complete');
}

function updateAccountTimestamp() {
    // Update session started time (one time)
    const sessionStarted = document.getElementById('session-started');
    if (sessionStarted && !sessionStarted.dataset.initialized) {
        const timeString = privacyState.sessionStartTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit'
        });
        sessionStarted.textContent = timeString;
        sessionStarted.dataset.initialized = 'true';
    }
    
    // Update session ended status
    const sessionEnded = document.getElementById('session-ended');
    if (sessionEnded) {
        if (privacyState.sessionEnded && privacyState.sessionEndTime) {
            const timeString = privacyState.sessionEndTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            sessionEnded.textContent = timeString;
        } else {
            sessionEnded.textContent = 'Session Ongoing';
        }
    }
    
    // Update account created date (one time)
    const accountCreated = document.getElementById('account-created');
    if (accountCreated && !accountCreated.dataset.initialized) {
        const now = new Date();
        accountCreated.textContent = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
        accountCreated.dataset.initialized = 'true';
    }
    
    // Calculate and update session duration in real-time
    updateSessionDuration();
}

// Function to calculate and update session duration
function updateSessionDuration() {
    const sessionDuration = document.getElementById('session-duration');
    if (!sessionDuration) return;
    
    const endTime = privacyState.sessionEnded ? privacyState.sessionEndTime : new Date();
    const elapsed = endTime - privacyState.sessionStartTime;
    
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
    
    sessionDuration.textContent = `${hours}h ${minutes}m ${seconds}s`;
}

// Hook into the existing updateSessionInfo to also update account page
const originalUpdateSessionInfo = updateSessionInfo;
updateSessionInfo = function() {
    if (typeof originalUpdateSessionInfo === 'function') {
        originalUpdateSessionInfo();
    }
    updateAccountInfo();
    updateAccountTimestamp();
};

function openMonthYearPicker() {
    const picker = document.getElementById('month-year-picker');
    if (picker) {
        picker.classList.add('active');
        updatePickerDisplay();
    }
}

function closeMonthYearPicker() {
    const picker = document.getElementById('month-year-picker');
    if (picker) {
        picker.classList.remove('active');
    }
}

function updatePickerDisplay() {
    const pickerYearEl = document.getElementById('picker-year');
    if (pickerYearEl) {
        pickerYearEl.textContent = pickerYear;
    }
    
    // Update month cells selection
    const monthCells = document.querySelectorAll('.month-cell');
    monthCells.forEach((cell, index) => {
        cell.classList.remove('selected');
        if (index === currentMonth && pickerYear === currentYear) {
            cell.classList.add('selected');
        }
    });
}

function generateMonthsGrid() {
    const monthsGrid = document.getElementById('months-grid');
    if (!monthsGrid) return;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    monthsGrid.innerHTML = '';
    
    monthNames.forEach((month, index) => {
        const monthCell = document.createElement('div');
        monthCell.className = 'month-cell';
        monthCell.textContent = month;
        
        if (index === currentMonth && pickerYear === currentYear) {
            monthCell.classList.add('selected');
        }
        
        monthCell.addEventListener('click', function() {
            currentMonth = index;
            currentYear = pickerYear;
            renderCalendar();
            closeMonthYearPicker();
        });
        
        monthsGrid.appendChild(monthCell);
    });
}
/* ===== Session History Generator ===== */

// Generate realistic session durations (in minutes)
function generateSessionDuration() {
    // Most sessions between 5-45 minutes, with some outliers
    const durations = [
        { min: 5, max: 15, weight: 0.3 },    // Short sessions
        { min: 15, max: 30, weight: 0.4 },   // Average sessions
        { min: 30, max: 45, weight: 0.2 },   // Longer sessions
        { min: 45, max: 90, weight: 0.1 }    // Extended sessions
    ];
    
    const random = Math.random();
    let cumWeight = 0;
    
    for (const range of durations) {
        cumWeight += range.weight;
        if (random <= cumWeight) {
            return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
        }
    }
    
    return 20; // fallback
}

// Generate random date in October 2025
function generateRandomDate() {
    const day = Math.floor(Math.random() * 22) + 1; // Days 1-22
    return `${day.toString().padStart(2, '0')}/10/25`;
}

// Generate random time
function generateRandomTime() {
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);
    const second = Math.floor(Math.random() * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
}

// Add minutes to a time string
function addMinutesToTime(timeStr, minutesToAdd) {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + minutesToAdd;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Generate unique 4-digit user ID
function generateUniqueUserId(existingIds) {
    let userId;
    do {
        userId = Math.floor(1000 + Math.random() * 9000);
    } while (existingIds.has(userId));
    existingIds.add(userId);
    return `U-${userId}`;
}

// Generate epsilon changes (1-8, weighted towards lower numbers)
// Users must interact with the slider, so minimum is 1
function generateEpsilonChanges() {
    const random = Math.random();
    if (random < 0.4) return 1; // Single change (40%)
    if (random < 0.7) return Math.floor(Math.random() * 2) + 2; // 2-3 changes (30%)
    if (random < 0.9) return Math.floor(Math.random() * 2) + 4; // 4-5 changes (20%)
    return Math.floor(Math.random() * 3) + 6; // 6-8 changes (10%)
}

// Generate session data
function generateSessionData() {
    const sessions = [];
    const existingUserIds = new Set();
    const totalSessions = 50; // Generate 50 sessions
    
    // Create some dates with multiple users
    const popularDates = ['15/10/25', '18/10/25', '20/10/25', '22/10/25'];
    
    for (let i = 0; i < totalSessions; i++) {
        const date = Math.random() < 0.4 && popularDates.length > 0 
            ? popularDates[Math.floor(Math.random() * popularDates.length)]
            : generateRandomDate();
        
        const startTime = generateRandomTime();
        const durationMinutes = generateSessionDuration();
        const endTime = addMinutesToTime(startTime, durationMinutes);
        
        const userId = generateUniqueUserId(existingUserIds);
        const epsilonChanges = generateEpsilonChanges();
        
        // 70% chance consent form is completed
        const consentCompleted = Math.random() < 0.7;
        
        // Privacy form can ONLY be completed if consent form is completed first
        // If consent is completed, 75% chance privacy is also completed
        const privacyCompleted = consentCompleted ? (Math.random() < 0.75) : false;
        
        sessions.push({
            participant: i + 1,
            date: date,
            timeStarted: startTime,
            timeEnded: endTime,
            userId: userId,
            duration: durationMinutes,
            epsilonChanges: epsilonChanges,
            consentCompleted: consentCompleted,
            privacyCompleted: privacyCompleted
        });
    }
    
    // Sort by date and time
    sessions.sort((a, b) => {
        const dateA = new Date('20' + a.date.split('/').reverse().join('-') + 'T' + a.timeStarted);
        const dateB = new Date('20' + b.date.split('/').reverse().join('-') + 'T' + b.timeStarted);
        return dateB - dateA; // Most recent first
    });
    
    // Renumber participants after sorting
    sessions.forEach((session, index) => {
        session.participant = index + 1;
    });
    
    return sessions;
}

// Format duration for display
function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes}m`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
}

// Render session table
function renderSessionTable(sessions) {
    const tbody = document.getElementById('session-table-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    sessions.forEach(session => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${session.participant}</td>
            <td>${session.date}</td>
            <td>${session.timeStarted}</td>
            <td>${session.timeEnded}</td>
            <td>${session.userId}</td>
            <td>${formatDuration(session.duration)}</td>
            <td>${session.epsilonChanges}</td>
            <td>
                <div class="consent-form-cell">
                    <span class="status-icon ${session.consentCompleted ? 'status-completed' : 'status-incomplete'}">
                        <i class="fas ${session.consentCompleted ? 'fa-check' : 'fa-times'}"></i>
                    </span>
                    ${session.consentCompleted ? `
                        <div class="download-dropdown">
                            <button class="download-btn" onclick="toggleDownloadMenu(event, 'consent-${session.participant}')">
                                <i class="fas fa-download"></i>
                            </button>
                            <div class="download-menu" id="download-menu-consent-${session.participant}">
                                <button class="download-option" onclick="downloadConsentForm(${session.participant}, 'docx', '${session.userId}', '${session.date}')">
                                    <i class="fas fa-file-word"></i>
                                    <span>Download as Word</span>
                                </button>
                                <button class="download-option" onclick="downloadConsentForm(${session.participant}, 'pdf', '${session.userId}', '${session.date}')">
                                    <i class="fas fa-file-pdf"></i>
                                    <span>Download as PDF</span>
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </td>
            <td>
                <div class="privacy-form-cell">
                    <span class="status-icon ${session.privacyCompleted ? 'status-completed' : 'status-incomplete'}">
                        <i class="fas ${session.privacyCompleted ? 'fa-check' : 'fa-times'}"></i>
                    </span>
                    ${session.privacyCompleted ? `
                        <div class="download-dropdown">
                            <button class="download-btn" onclick="toggleDownloadMenu(event, ${session.participant})">
                                <i class="fas fa-download"></i>
                            </button>
                            <div class="download-menu" id="download-menu-${session.participant}">
                                <button class="download-option" onclick="downloadPrivacyForm(${session.participant}, 'docx', '${session.userId}', '${session.date}')">
                                    <i class="fas fa-file-word"></i>
                                    <span>Download as Word</span>
                                </button>
                                <button class="download-option" onclick="downloadPrivacyForm(${session.participant}, 'pdf', '${session.userId}', '${session.date}')">
                                    <i class="fas fa-file-pdf"></i>
                                    <span>Download as PDF</span>
                                </button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filter sessions by time period
function filterSessions(sessions, filterType) {
    const today = new Date();
    const currentDate = '22/10/25'; // Current date based on your requirement
    
    switch(filterType) {
        case 'today':
            return sessions.filter(s => s.date === currentDate);
        case 'week':
            // Filter sessions from the past week (days 15-22)
            return sessions.filter(s => {
                const day = parseInt(s.date.split('/')[0]);
                return day >= 15 && day <= 22;
            });
        case 'month':
            // All sessions in October
            return sessions;
        case 'all':
        default:
            return sessions;
    }
}

// Initialize session logs
function initializeSessionLogs() {
    const allSessions = generateSessionData();
    
    // Initial render
    renderSessionTable(allSessions);
    
    // Setup filter
    const filterDropdown = document.getElementById('time-filter');
    if (filterDropdown) {
        filterDropdown.addEventListener('change', function() {
            const filtered = filterSessions(allSessions, this.value);
            renderSessionTable(filtered);
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeSessionLogs();
});
/* ===== Download Feature Functions ===== */

// Toggle download menu
function toggleDownloadMenu(event, participantId) {
    event.stopPropagation();
    
    // Close all other open menus
    document.querySelectorAll('.download-menu').forEach(menu => {
        if (menu.id !== `download-menu-${participantId}`) {
            menu.classList.remove('show');
        }
    });
    
    // Toggle current menu
    const menu = document.getElementById(`download-menu-${participantId}`);
    if (menu) {
        menu.classList.toggle('show');
    }
}

// Close dropdown when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.download-dropdown')) {
        document.querySelectorAll('.download-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// Download privacy form function
function downloadPrivacyForm(participantId, format, userId, date) {
    console.log(`Downloading privacy form for Participant ${participantId} (${userId}) as ${format}`);
    
    // Create a sample privacy form content
    const privacyFormData = {
        participantId: participantId,
        userId: userId,
        date: date,
        timestamp: new Date().toISOString(),
        title: 'Privacy Utility Tradeoff Research - Privacy Form',
        content: `
PRIVACY FORM
Research Study: Privacy Utility Tradeoff Dashboard

Participant ID: ${participantId}
User ID: ${userId}
Date: ${date}
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════

PRIVACY PREFERENCES RECORDED

This form documents your privacy preferences and epsilon parameter selections 
during your participation in the Privacy Utility Tradeoff Dashboard research study.

1. CONSENT STATUS
   ✓ Research consent form completed
   ✓ Privacy form completed

2. DATA COLLECTION
   Your session data has been recorded for research purposes, including:
   • Epsilon parameter adjustments
   • Decision timing and patterns
   • Trade-off selections

3. PRIVACY RIGHTS
   • Right to withdraw from the study at any time
   • Right to request data deletion
   • Right to access your collected data

4. DATA PROTECTION
   All data is stored securely and will be used solely for research purposes.
   Your personal information is protected under UCL research ethics guidelines.

5. CONTACT INFORMATION
   For questions or concerns, please contact:
   Kyle Ng - Security and Crime Science Research
   University College London (UCL)

═══════════════════════════════════════════════

This document serves as confirmation of your privacy preferences
for the research study conducted in October 2025.
        `
    };
    
    if (format === 'docx') {
        downloadAsWord(privacyFormData);
    } else if (format === 'pdf') {
        downloadAsPDF(privacyFormData);
    }
    
    // Close the dropdown menu
    const menu = document.getElementById(`download-menu-${participantId}`);
    if (menu) {
        menu.classList.remove('show');
    }
}

// Download as Word document
function downloadAsWord(data) {
    // Create HTML content for Word document
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${data.title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    color: #00ffff;
                    border-bottom: 3px solid #00ffff;
                    padding-bottom: 10px;
                }
                .metadata {
                    background: #f0f0f0;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .section {
                    margin: 20px 0;
                }
                .section h2 {
                    color: #333;
                    font-size: 16px;
                }
                pre {
                    white-space: pre-wrap;
                    font-family: 'Courier New', monospace;
                    background: #f9f9f9;
                    padding: 20px;
                    border-left: 4px solid #00ffff;
                }
            </style>
        </head>
        <body>
            <h1>${data.title}</h1>
            <div class="metadata">
                <p><strong>Participant ID:</strong> ${data.participantId}</p>
                <p><strong>User ID:</strong> ${data.userId}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <pre>${data.content}</pre>
        </body>
        </html>
    `;
    
    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Privacy_Form_${data.userId}_${data.date.replace(/\//g, '-')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`Downloaded as Word: Privacy_Form_${data.userId}_${data.date.replace(/\//g, '-')}.doc`);
}

// Download as PDF
function downloadAsPDF(data) {
    // Create a printable HTML page
    const printWindow = window.open('', '_blank');
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${data.title}</title>
            <style>
                @page {
                    margin: 1in;
                }
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                    color: #333;
                }
                h1 {
                    color: #00ffff;
                    border-bottom: 3px solid #00ffff;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .metadata {
                    background: #f0f0f0;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .metadata p {
                    margin: 5px 0;
                }
                pre {
                    white-space: pre-wrap;
                    font-family: 'Courier New', monospace;
                    background: #f9f9f9;
                    padding: 20px;
                    border-left: 4px solid #00ffff;
                    font-size: 12px;
                    line-height: 1.5;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <h1>${data.title}</h1>
            <div class="metadata">
                <p><strong>Participant ID:</strong> ${data.participantId}</p>
                <p><strong>User ID:</strong> ${data.userId}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <pre>${data.content}</pre>
            <div class="no-print" style="margin-top: 30px; text-align: center;">
                <button onclick="window.print();" style="padding: 10px 30px; font-size: 16px; cursor: pointer; background: #00ffff; border: none; border-radius: 5px;">
                    Print to PDF
                </button>
            </div>
            <script>
                // Auto-trigger print dialog after page loads
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    console.log(`Opening print dialog for PDF: Privacy_Form_${data.userId}_${data.date.replace(/\//g, '-')}.pdf`);
}


/* ===== Consent Form Download Functions ===== */

// Download consent form function
function downloadConsentForm(participantId, format, userId, date) {
    console.log(`Downloading consent form for Participant ${participantId} (${userId}) as ${format}`);
    
    // Create consent form content
    const consentFormData = {
        participantId: participantId,
        userId: userId,
        date: date,
        timestamp: new Date().toISOString(),
        title: 'Privacy Utility Tradeoff Research - Consent Form',
        content: `
CONSENT FORM
Research Study: Privacy Utility Tradeoff Dashboard

Participant ID: ${participantId}
User ID: ${userId}
Date: ${date}
Generated: ${new Date().toLocaleString()}

═══════════════════════════════════════════════

INFORMED CONSENT FOR RESEARCH PARTICIPATION

Study Title: Exploring User Decisions in Privacy-Utility Trade-offs with the 
            Zynex Dashboard

Principal Investigator: Kyle Ng
Institution: University College London (UCL)
Department: Security and Crime Science Research (SECU0053)

═══════════════════════════════════════════════

SECTION 1: STUDY PURPOSE

This research investigates how users make decisions when adjusting privacy 
parameters (epsilon) in the context of differential privacy. The study examines 
behavioral patterns and biases in privacy choices while analyzing how different 
consequences (performance, CAPTCHA frequency, ad relevance) influence decisions.

SECTION 2: WHAT YOUR PARTICIPATION INVOLVES

As a participant, you will:
• Use the Zynex interactive dashboard
• Adjust privacy budget (epsilon) parameters
• Make trade-off decisions between privacy and utility
• Have your interaction patterns recorded for analysis
• Spend approximately 15-45 minutes on the study

SECTION 3: DATA COLLECTION

The following data will be collected during your session:
• Epsilon parameter selections
• Decision timing and frequency
• Trade-off preferences
• Session duration and activity logs
• Anonymous user identifier (${userId})

SECTION 4: CONFIDENTIALITY AND DATA PROTECTION

• All data is anonymized and stored securely
• Your personal information is protected under GDPR
• Data will be used solely for research purposes
• Results will be published in aggregate form only
• Individual participants will not be identifiable

SECTION 5: YOUR RIGHTS AS A PARTICIPANT

You have the right to:
• Withdraw from the study at any time without penalty
• Request deletion of your data
• Access your collected data
• Ask questions about the research
• Receive information about study results

SECTION 6: RISKS AND BENEFITS

Risks: Minimal. You may experience minor inconvenience from CAPTCHA 
       challenges or adjusted system performance.

Benefits: Contributing to privacy research that may inform better privacy 
         tools and policies.

SECTION 7: CONSENT STATEMENT

By completing this form, I confirm that:

✓ I have read and understood the study information
✓ I have had the opportunity to ask questions
✓ I understand my participation is voluntary
✓ I understand I can withdraw at any time
✓ I consent to the collection and use of my data as described
✓ I understand my data will be anonymized and stored securely

═══════════════════════════════════════════════

CONTACT INFORMATION

For questions or concerns about this research:

Principal Investigator: Kyle Ng
Email: [contact information]
Department: Security and Crime Science Research
Institution: University College London (UCL)
Project Code: SECU0053

For questions about your rights as a research participant:
UCL Research Ethics Committee
[contact information]

═══════════════════════════════════════════════

PARTICIPANT CONFIRMATION

Participant ID: ${participantId}
User ID: ${userId}
Consent Date: ${date}
Consent Status: CONFIRMED

This document serves as proof of informed consent for participation 
in the Privacy Utility Tradeoff research study conducted at UCL 
in October 2025.

═══════════════════════════════════════════════
        `
    };
    
    if (format === 'docx') {
        downloadConsentAsWord(consentFormData);
    } else if (format === 'pdf') {
        downloadConsentAsPDF(consentFormData);
    }
    
    // Close the dropdown menu
    const menu = document.getElementById(`download-menu-consent-${participantId}`);
    if (menu) {
        menu.classList.remove('show');
    }
}

// Download consent as Word document
function downloadConsentAsWord(data) {
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${data.title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 40px;
                    max-width: 800px;
                    margin: 0 auto;
                }
                h1 {
                    color: #00ffff;
                    border-bottom: 3px solid #00ffff;
                    padding-bottom: 10px;
                }
                .metadata {
                    background: #f0f0f0;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                pre {
                    white-space: pre-wrap;
                    font-family: 'Courier New', monospace;
                    background: #f9f9f9;
                    padding: 20px;
                    border-left: 4px solid #00ffff;
                }
            </style>
        </head>
        <body>
            <h1>${data.title}</h1>
            <div class="metadata">
                <p><strong>Participant ID:</strong> ${data.participantId}</p>
                <p><strong>User ID:</strong> ${data.userId}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <pre>${data.content}</pre>
        </body>
        </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Consent_Form_${data.userId}_${data.date.replace(/\//g, '-')}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`Downloaded as Word: Consent_Form_${data.userId}_${data.date.replace(/\//g, '-')}.doc`);
}

// Download consent as PDF
function downloadConsentAsPDF(data) {
    const printWindow = window.open('', '_blank');
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>${data.title}</title>
            <style>
                @page {
                    margin: 1in;
                }
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    padding: 20px;
                    max-width: 800px;
                    margin: 0 auto;
                    color: #333;
                }
                h1 {
                    color: #00ffff;
                    border-bottom: 3px solid #00ffff;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .metadata {
                    background: #f0f0f0;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .metadata p {
                    margin: 5px 0;
                }
                pre {
                    white-space: pre-wrap;
                    font-family: 'Courier New', monospace;
                    background: #f9f9f9;
                    padding: 20px;
                    border-left: 4px solid #00ffff;
                    font-size: 12px;
                    line-height: 1.5;
                }
                @media print {
                    body {
                        padding: 0;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <h1>${data.title}</h1>
            <div class="metadata">
                <p><strong>Participant ID:</strong> ${data.participantId}</p>
                <p><strong>User ID:</strong> ${data.userId}</p>
                <p><strong>Date:</strong> ${data.date}</p>
                <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <pre>${data.content}</pre>
            <div class="no-print" style="margin-top: 30px; text-align: center;">
                <button onclick="window.print();" style="padding: 10px 30px; font-size: 16px; cursor: pointer; background: #00ffff; border: none; border-radius: 5px;">
                    Print to PDF
                </button>
            </div>
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    console.log(`Opening print dialog for PDF: Consent_Form_${data.userId}_${data.date.replace(/\//g, '-')}.pdf`);
}
/* Guide Page CTA Button Navigation */
document.addEventListener('DOMContentLoaded', function() {
    // Handle CTA button clicks in Guide page
    const ctaButtons = document.querySelectorAll('.cta-button[data-page]');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Remove active class from all nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to target nav link
            const targetNavLink = document.querySelector(`.nav-link[data-page="${targetPage}"]`);
            if (targetNavLink) {
                targetNavLink.classList.add('active');
            }
            
            // Hide all pages
            document.querySelectorAll('.page-content').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show target page
            const targetPageElement = document.getElementById(`${targetPage}-page`);
            if (targetPageElement) {
                targetPageElement.classList.add('active');
            }
            
            // Scroll to top smoothly
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log(`Navigated from Guide to: ${targetPage}`);
        });
    });
});


/* FAQ Accordion Functionality */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize FAQ when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeFAQ();
});
/* Resources Page Tab Functionality */
function initializeResourceTabs() {
    const tabs = document.querySelectorAll('.resource-tab');
    const categories = document.querySelectorAll('.resource-category');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const categoryName = tab.getAttribute('data-category');
            
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Hide all categories
            categories.forEach(cat => cat.classList.remove('active'));
            
            // Show selected category
            const selectedCategory = document.getElementById(`category-${categoryName}`);
            if (selectedCategory) {
                selectedCategory.classList.add('active');
            }
        });
    });
    
    // Add click handlers for resource arrows
    const resourceArrows = document.querySelectorAll('.resource-arrow');
    resourceArrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const url = arrow.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });
}

// Update the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    initializeFAQ();
    initializeResourceTabs();
});
/* Real-time Resource Statistics Counter */
function updateResourceStats() {
    // Count resources in each category
    const categories = {
        'websites': 'stat-websites',
        'papers': 'stat-papers',
        'news': 'stat-news',
        'videos': 'stat-videos',
        'tools': 'stat-tools'
    };
    
    Object.keys(categories).forEach(category => {
        const categoryElement = document.getElementById(`category-${category}`);
        if (categoryElement) {
            // Count all resource-item elements in this category
            const resourceCount = categoryElement.querySelectorAll('.resource-item').length;
            
            // Update the stat number
            const statElement = document.getElementById(categories[category]);
            if (statElement) {
                const currentCount = parseInt(statElement.textContent);
                if (currentCount !== resourceCount) {
                    statElement.textContent = resourceCount;
                    statElement.classList.add('updated');
                    
                    // Remove animation class after animation completes
                    setTimeout(() => {
                        statElement.classList.remove('updated');
                    }, 500);
                }
            }
        }
    });
}

/* Update Resource Tabs with Real-time Counts */
function updateResourceTabs() {
    const tabs = document.querySelectorAll('.resource-tab');
    const categories = ['websites', 'papers', 'news', 'videos', 'tools'];
    
    tabs.forEach((tab, index) => {
        const categoryName = categories[index];
        const categoryElement = document.getElementById(`category-${categoryName}`);
        
        if (categoryElement) {
            const resourceCount = categoryElement.querySelectorAll('.resource-item').length;
            
            // Update individual category stats within each category
            const categoryStats = categoryElement.querySelector('.resource-stats .stat-number');
            if (categoryStats) {
                categoryStats.textContent = resourceCount;
            }
        }
    });
}

// Initialize and update stats on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeFAQ();
    initializeResourceTabs();
    
    // Initial stats update
    updateResourceStats();
    updateResourceTabs();
    
    // Optional: Set up periodic updates (if resources are added dynamically)
    // setInterval(updateResourceStats, 5000); // Update every 5 seconds
});

// Update stats whenever a new resource is added (for future dynamic additions)
function addResourceItem(category, resourceData) {
    const categoryElement = document.getElementById(`category-${category}`);
    if (categoryElement) {
        // Create new resource item
        const resourceItem = document.createElement('div');
        resourceItem.className = 'resource-item';
        resourceItem.innerHTML = `
            <div class="resource-content">
                <h3>${resourceData.title} <i class="fa-solid fa-arrow-up-right-from-square"></i></h3>
                <p>${resourceData.description}</p>
                ${resourceData.meta ? `<div class="resource-meta">${resourceData.meta}</div>` : ''}
            </div>
            <button class="resource-arrow" data-url="${resourceData.url}">
                <i class="fa-solid fa-arrow-right"></i>
            </button>
        `;
        
        // Insert before the stats box
        const statsBox = categoryElement.querySelector('.resource-stats');
        if (statsBox) {
            categoryElement.insertBefore(resourceItem, statsBox);
        } else {
            categoryElement.appendChild(resourceItem);
        }
        
        // Update stats
        updateResourceStats();
        updateResourceTabs();
        
        // Add click handler for the new arrow button
        const arrow = resourceItem.querySelector('.resource-arrow');
        arrow.addEventListener('click', () => {
            const url = arrow.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    }
}

/* ============================================
   SESSION END TRACKING
   ============================================ */

// Track when user actually closes the browser/tab (not just navigating)
window.addEventListener('pagehide', function(e) {
    // Only mark as ended if it's a true close (not just navigation)
    if (e.persisted === false) {
        privacyState.sessionEnded = true;
        privacyState.sessionEndTime = new Date();
        
        // Store in localStorage so it persists
        try {
            localStorage.setItem('sessionEndTime', privacyState.sessionEndTime.toISOString());
            localStorage.setItem('sessionEnded', 'true');
        } catch (err) {
            console.log('Could not store session end time:', err);
        }
    }
});

// Initialize on page load
window.addEventListener('load', function() {
    // Clear any previous "ended" status since we're loading the page now
    // This means the session is ACTIVE again
    try {
        const wasEnded = localStorage.getItem('sessionEnded');
        
        // If there was a previous session that ended, we can optionally preserve that
        // But for the current session, we're active
        if (wasEnded === 'true') {
            // Clear the flags - this is a NEW session now
            localStorage.removeItem('sessionEnded');
            localStorage.removeItem('sessionEndTime');
        }
        
        // Current session is always ongoing when page loads
        privacyState.sessionEnded = false;
        privacyState.sessionEndTime = null;
        
    } catch (err) {
        console.log('Could not retrieve session end time:', err);
    }
    
    // Update display immediately
    updateAccountTimestamp();
});
