// ====================
// ENHANCED JAVASCRIPT
// ====================

// Change section with animation
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
        sec.style.opacity = '0';
        sec.style.transform = 'translateY(20px)';
    });
    
    // Show selected section with animation
    setTimeout(() => {
        const activeSection = document.getElementById(sectionId);
        if (activeSection) {
            activeSection.classList.add('active');
            activeSection.style.opacity = '1';
            activeSection.style.transform = 'translateY(0)';
        }
    }, 100);
    
    // Add visual feedback
    showNotification(`Navigating to ${sectionId}...`);
}

// Login validation with enhanced feedback
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;
    const status = document.getElementById("loginStatus");
    
    if(user === "teacher" && pass === "1234") {
        status.innerHTML = "✅ Login Successful! Welcome, Teacher!";
        status.className = "success";
        showNotification("Login Successful! Redirecting to Attendance...");
        
        // Add success animation
        const loginSection = document.getElementById("login");
        loginSection.style.animation = "pulse 0.5s";
        
        setTimeout(() => {
            showSection("attendance");
            startScanner();
        }, 1000);
    } else {
        status.innerHTML = "❌ Access Denied! Please check your credentials.";
        status.className = "error";
        showNotification("Login Failed! Please try again.");
        
        // Add shake animation for error
        const loginSection = document.getElementById("login");
        loginSection.style.animation = "shake 0.5s";
        setTimeout(() => {
            loginSection.style.animation = "none";
        }, 500);
    }
}

// Start QR scanner with better UX
function startScanner() {
    function onScanSuccess(decodedText) {
        document.getElementById("result").innerHTML = 
            "✅ Attendance Recorded: " + decodedText;
        showNotification(`Attendance Recorded: ${decodedText}`);
        playSuccessSound();
    }
    
    function onScanFailure(error) {
        // Don't show error on every frame
    }
    
    let scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: 250, aspectRatio: 1.0 });
    
    scanner.render(onScanSuccess, onScanFailure);
}

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        font-weight: bold;
        font-size: 14px;
    `;
    notification.innerHTML = `📢 ${message}`;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Success Sound Effect
function playSuccessSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-positive-notification-951.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play failed:", e));
}

// Add emoji icons to buttons
const buttonIcons = {
    'home': '🏠',
    'schedule': '📅',
    'participants': '👥',
    'venue': '🏟️',
    'announcement': '📢',
    'login': '🔐'
};

// Add icons after page loads
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.button-container button').forEach(button => {
        const section = button.getAttribute('onclick').match(/'([^']+)'/)[1];
        if (buttonIcons[section]) {
            button.innerHTML = buttonIcons[section] + ' ' + button.innerHTML;
        }
    });
});

// Add keyboard support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        if (document.activeElement.tagName === 'INPUT') {
            if (document.getElementById('password') === document.activeElement) {
                login();
            }
        }
    }
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut { 
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

/* =========================
   SECTION NAVIGATION
========================= */
function showSection(sectionId) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.remove("active");
    });

    document.getElementById(sectionId).classList.add("active");
}

/* =========================
   CALENDAR SYSTEM
========================= */

const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

let currentDate = new Date();

/* SAMPLE SCHOOL EVENTS */
const events = {
    "2026-03-10": "🎤 Talent Practice - 3:00 PM",
    "2026-03-15": "🏫 School Program Proper",
    "2026-03-20": "🎓 Awarding Ceremony",
    "2026-04-05": "📢 Meeting with Participants"
};

/* GENERATE CALENDAR */
function generateCalendar(date) {

    const year = date.getFullYear();
    const month = date.getMonth();

    document.getElementById("currentMonth").innerText =
        monthNames[month] + " " + year;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const calendarDays = document.getElementById("calendarDays");
    calendarDays.innerHTML = "";

    // Empty boxes before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        empty.classList.add("calendar-day");
        calendarDays.appendChild(empty);
    }

    // Create days
    for (let day = 1; day <= lastDate; day++) {

        const dayBox = document.createElement("div");
        dayBox.classList.add("calendar-day");
        dayBox.innerText = day;

        const fullDate =
            year + "-" +
            String(month + 1).padStart(2, "0") + "-" +
            String(day).padStart(2, "0");

        /* Highlight today */
        const today = new Date();
        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayBox.style.background = "#38ef7d";
            dayBox.style.color = "white";
            dayBox.style.fontWeight = "bold";
        }

        /* If event exists */
        if (events[fullDate]) {
            dayBox.style.border = "2px solid #11998e";
        }

        /* Click event */
        dayBox.onclick = () => showEvent(fullDate);

        calendarDays.appendChild(dayBox);
    }
}

/* SHOW EVENT DETAILS */
function showEvent(date) {

    const box = document.getElementById("eventDetails");

    if (events[date]) {
        box.innerHTML = `
            <h4>${date}</h4>
            <p>${events[date]}</p>
        `;
    } else {
        box.innerHTML = `
            <h4>${date}</h4>
            <p>No scheduled event.</p>
        `;
    }
}

/* MONTH BUTTONS */
document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
};

document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
};

/* LOAD CALENDAR ON START */
generateCalendar(currentDate);
/* =========================
   PARTICIPANTS SYSTEM
========================= */

let participants = [
    { name: "Juan Dela Cruz", section: "ICT 12" },
    { name: "Maria Santos", section: "STEM 11" }
];

/* DISPLAY PARTICIPANTS */
function renderParticipants() {

    const body = document.getElementById("participantsBody");
    body.innerHTML = "";

    participants.forEach((p, index) => {

        body.innerHTML += `
            <tr>
                <td>${p.name}</td>
                <td>${p.section}</td>
                <td>
                    <button class="delete-btn"
                        onclick="deleteParticipant(${index})">
                        🗑️ Delete
                    </button>
                </td>
            </tr>
        `;
    });
}

/* ADD PARTICIPANT */
function addParticipant() {

    const nameInput = document.getElementById("participantName");
    const sectionInput = document.getElementById("participantSection");

    const name = nameInput.value.trim();
    const section = sectionInput.value.trim();

    if (name === "" || section === "") {
        alert("Please fill all fields.");
        return;
    }

    participants.push({ name, section });

    nameInput.value = "";
    sectionInput.value = "";

    renderParticipants();
}

/* DELETE PARTICIPANT */
function deleteParticipant(index) {

    participants.splice(index, 1);
    renderParticipants();
}

/* LOAD DATA */
renderParticipants();