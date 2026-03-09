/* ==================== */
/* GLOBAL VARIABLES */
/* ==================== */
let currentTeacher = "";
let attendanceData = [];
let participantsData = [];
let eventsData = [];
let currentMonth = new Date();

/* ==================== */
/* NAVIGATION FUNCTION */
/* ==================== */
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Update sidebar button active state
    const buttons = document.querySelectorAll('.sidebar-menu button');
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    
    // Find the button that calls this function and make it active
    const activeButton = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }

    // If calendar section is shown, render calendar
    if (sectionId === 'schedule') {
        renderCalendar();
    }
}

/* ==================== */
/* PARTICIPANTS MANAGEMENT */
/* ==================== */
function addParticipant() {
    const name = document.getElementById('participantName').value;
    const section = document.getElementById('participantSection').value;
    const grade = document.getElementById('participantGrade').value;

    if (name && section) {
        participantsData.push({ name, section, grade });
        renderParticipants();
        
        // Clear inputs
        document.getElementById('participantName').value = '';
        document.getElementById('participantSection').value = '';
        document.getElementById('participantGrade').value = '';
    } else {
        alert('Please fill in all fields');
    }
}

function renderParticipants() {
    const tbody = document.getElementById('participantsBody');
    tbody.innerHTML = '';

    participantsData.forEach((participant, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${participant.name}</td>
            <td>${participant.section}</td>
            <td>${participant.grade || 'N/A'}</td>
            <td><button class="delete-btn" onclick="deleteParticipant(${index})">Delete</button></td>
        `;
        tbody.appendChild(row);
    });
}

function deleteParticipant(index) {
    participantsData.splice(index, 1);
    renderParticipants();
}

/* ==================== */
/* EVENT MANAGEMENT */
/* ==================== */
function addEvent() {
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;

    if (title && date) {
        eventsData.push({ title, date, time });
        alert('Event added successfully!');
        
        // Clear inputs
        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('eventTime').value = '';
        
        // Re-render calendar
        renderCalendar();
    } else {
        alert('Please fill in all event fields');
    }
}

function showEventDetails(day, month, year) {
    const eventDetails = document.getElementById('eventDetails');
    
    // Find events for this date
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayEvents = eventsData.filter(event => event.date === dateStr);
    
    if (dayEvents.length > 0) {
        let html = '<h4>📅 Events on ' + day + ' ' + month + ' ' + year + ':</h4>';
        dayEvents.forEach(event => {
            html += `
                <p><strong>Event:</strong> ${event.title}</p>
                <p><strong>Time:</strong> ${event.time || 'TBD'}</p>
            `;
        });
        eventDetails.innerHTML = html;
    } else {
        eventDetails.innerHTML = `
            <p><strong>Event:</strong> No events scheduled</p>
            <p><strong>Date:</strong> ${day} ${month} ${year}</p>
            <p><strong>Time:</strong> -</p>
            <p><strong>Venue:</strong> -</p>
        `;
    }
}

/* ==================== */
/* CALENDAR FUNCTIONALITY */
/* ==================== */
function renderCalendar() {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = document.getElementById('calendarDays');
    calendarDays.innerHTML = '';

    // Update month header
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day');
        emptyCell.style.visibility = 'hidden';
        calendarDays.appendChild(emptyCell);
    }

    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = i;
        dayCell.onclick = () => showEventDetails(i, monthNames[month], year);
        calendarDays.appendChild(dayCell);
    }
}

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() - 1);
    renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth.setMonth(currentMonth.getMonth() + 1);
    renderCalendar();
});

/* ==================== */
/* ATTENDANCE SYSTEM */
/* ==================== */
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const statusMsg = document.getElementById('loginStatusMsg');

    // Simple validation (In a real system, this would check a database)
    if (username && password) {
        currentTeacher = username;
        statusMsg.textContent = "";

        // Show attendance dashboard
        document.getElementById('attendanceDashboard').style.display = 'block';
        document.getElementById('attendanceFormContainer').style.display = 'block';
        document.getElementById('attendanceListContainer').style.display = 'block';

        // Update display names
        document.getElementById('displayTeacherName').textContent = currentTeacher;
        document.getElementById('listTeacherName').textContent = currentTeacher;

        // Clear inputs
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";

        // Render the list
        renderAttendance();
    } else {
        statusMsg.textContent = "Please enter username and password.";
    }
}

function addAttendance() {
    const level = document.getElementById('attLevel').value;
    const grade = document.getElementById('attGrade').value;
    const section = document.getElementById('attSection').value;
    const name = document.getElementById('attName').value;

    if (level && grade && section && name) {
        // Add to array
        attendanceData.push({
            level: level,
            grade: grade,
            section: section,
            name: name
        });

        // Clear inputs
        document.getElementById('attLevel').value = "";
        document.getElementById('attGrade').value = "";
        document.getElementById('attSection').value = "";
        document.getElementById('attName').value = "";

        // Re-render the list
        renderAttendance();
    } else {
        alert('Please fill in all attendance fields');
    }
}

function renderAttendance() {
    const tbody = document.getElementById('attendanceBody');
    tbody.innerHTML = '';

    // Filter attendance by logged-in teacher
    const filteredData = attendanceData.filter(item => item.teacher === currentTeacher);

    filteredData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.level}</td>
            <td>${item.grade}</td>
            <td>${item.section}</td>
            <td>${item.name}</td>
        `;
        tbody.appendChild(row);
    });
}

/* ==================== */
/* VENUE STATUS UPDATES */
/* ==================== */
function updateVenueStatus() {
    // This function can be used to save venue status to localStorage
    const stageStatus = document.getElementById('stageStatus').value;
    const soundStatus = document.getElementById('soundStatus').value;
    const seatingStatus = document.getElementById('seatingStatus').value;
    const lightingStatus = document.getElementById('lightingStatus').value;
    
    const venueData = {
        stage: stageStatus,
        sound: soundStatus,
        seating: seatingStatus,
        lighting: lightingStatus
    };
    
    localStorage.setItem('venueData', JSON.stringify(venueData));
    alert('Venue status updated!');
}

/* ==================== */
/* INITIALIZATION */
/* ==================== */
window.onload = function() {
    // Set initial calendar
    renderCalendar();
    
    // Load venue data if exists
    const savedVenue = localStorage.getItem('venueData');
    if (savedVenue) {
        const venueData = JSON.parse(savedVenue);
        document.getElementById('stageStatus').value = venueData.stage || 'Ready';
        document.getElementById('soundStatus').value = venueData.sound || 'Installed';
        document.getElementById('seatingStatus').value = venueData.seating || 'Arranged';
        document.getElementById('lightingStatus').value = venueData.lighting || 'Ready';
    }
};