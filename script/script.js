// DOM MANIPULATION & EVENT HANDLING - DARK MODE TOGGLE

// 1. DOM ELEMENT SELECTION (DOM Manipulation)
const themeToggleBtn = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const themeText = document.querySelector('.theme-text');
const headerTitle = document.getElementById('headerTitle');
const modeStatus = document.getElementById('modeStatus');
const body = document.body;

// 2. VARIABEL STATE
let isDarkMode = false;

// 3. EVENT HANDLING - Button Click Event
themeToggleBtn.addEventListener('click', function() {
    console.log('Theme toggle button clicked!'); // Debug log
    
    // Toggle state
    isDarkMode = !isDarkMode;
    
    // DOM MANIPULATION - Apply theme changes
    toggleDarkMode();
    
    // DOM MANIPULATION - Update button appearance
    updateToggleButton();
    
    // DOM MANIPULATION - Update status text
    updateModeStatus();
    
    // DOM MANIPULATION - Add click animation
    addClickAnimation();
    
    // Local Storage - Save user preference
    localStorage.setItem('darkModeEnabled', isDarkMode);
});

// 4. DOM MANIPULATION FUNCTIONS

function toggleDarkMode() {
    if (isDarkMode) {
        // DOM Manipulation: Add dark theme class
        body.classList.add('dark-theme');
        console.log('Dark mode activated');
    } else {
        // DOM Manipulation: Remove dark theme class
        body.classList.remove('dark-theme');
        console.log('Light mode activated');
    }
}

function updateToggleButton() {
    if (isDarkMode) {
        // DOM Manipulation: Change button content for dark mode
        themeIcon.innerHTML = '<i class="fas fa-sun"></i>';
        themeText.textContent = 'Light Mode';
        themeToggleBtn.style.backgroundColor = '#ffd700';
        themeToggleBtn.style.color = '#333';
    } else {
        // DOM Manipulation: Change button content for light mode
        themeIcon.innerHTML = '<i class="fas fa-moon"></i>';
        themeText.textContent = 'Dark Mode';
        themeToggleBtn.style.backgroundColor = '#333745';
        themeToggleBtn.style.color = 'white';
    }
}

function updateModeStatus() {
    // DOM Manipulation: Update status text
    const currentMode = isDarkMode ? 'Dark Mode' : 'Light Mode';
    modeStatus.textContent = `Mode Saat Ini: ${currentMode}`;
    
    // DOM Manipulation: Change status color
    modeStatus.style.color = isDarkMode ? '#ffd700' : '#4a90e2';
}

function addClickAnimation() {
    // DOM Manipulation: Add temporary animation class
    themeToggleBtn.classList.add('clicked');
    
    // DOM Manipulation: Remove animation class after delay
    setTimeout(() => {
        themeToggleBtn.classList.remove('clicked');
    }, 200);
}

// 5. EVENT HANDLING - Page Load Event
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded, initializing theme...');
    
    // DOM Manipulation: Load saved theme from localStorage
    const savedTheme = localStorage.getItem('darkModeEnabled');
    if (savedTheme === 'true') {
        isDarkMode = true;
        toggleDarkMode();
        updateToggleButton();
        updateModeStatus();
    }
    
    // DOM Manipulation: Add initial animation
    themeToggleBtn.style.opacity = '0';
    themeToggleBtn.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        themeToggleBtn.style.transition = 'all 0.3s ease';
        themeToggleBtn.style.opacity = '1';
        themeToggleBtn.style.transform = 'translateY(0)';
    }, 500);
});

// 6. EVENT HANDLING - Keyboard Shortcut (Bonus)
document.addEventListener('keydown', function(event) {
    // Ctrl + D untuk toggle dark mode
    if (event.ctrlKey && event.key === 'd') {
        event.preventDefault(); // Mencegah default browser action
        console.log('Keyboard shortcut activated!');
        
        // DOM Manipulation: Trigger click programmatically
        themeToggleBtn.click();
    }
});

// 7. EVENT HANDLING - Double Click (Bonus feature)
themeToggleBtn.addEventListener('dblclick', function() {
    // DOM Manipulation: Create notification
    showNotification('Double click detected! Theme toggled twice!');
});

// 8. DOM MANIPULATION - Create and show notification
function showNotification(message) {
    // DOM Manipulation: Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // DOM Manipulation: Set notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${isDarkMode ? '#ffd700' : '#4a90e2'};
        color: ${isDarkMode ? '#333' : 'white'};
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // DOM Manipulation: Add to page
    document.body.appendChild(notification);
    
    // DOM Manipulation: Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // DOM Manipulation: Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 2000);
}

// 9. EVENT HANDLING - Input focus effects (Form submit handler dipindah ke handleAPI.js)
const inputs = document.querySelectorAll('input[type="text"]');

// Note: Form submit handler dipindahkan ke handleAPI.js untuk integrasi database

// 10. EVENT HANDLING - Input focus effects
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        // DOM Manipulation: Add glow effect based on theme
        if (isDarkMode) {
            this.style.boxShadow = '0 0 10px #ffd700';
        } else {
            this.style.boxShadow = '0 0 10px #4a90e2';
        }
    });
    
    input.addEventListener('blur', function() {
        // DOM Manipulation: Remove glow effect
        this.style.boxShadow = 'none';
    });
});

console.log('🚀 Dark Mode Toggle dengan DOM Manipulation & Event Handling berhasil dimuat dari script.js!');