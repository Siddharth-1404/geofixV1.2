/* =========================================
   1. GLOBAL FUNCTIONS (DOM Manipulation)
   ========================================= */
function showToast(message) {
    const toastBox = document.getElementById('toast-box');
    const toastMessage = document.getElementById('toast-message');
    if (toastBox && toastMessage) {
        toastMessage.innerText = message;
        toastBox.classList.remove('hidden');
        setTimeout(() => toastBox.classList.add('hidden'), 3000);
    }
}

function goToPage(url) {
    document.body.classList.add('page-fade-out');
    setTimeout(() => {
        window.location.href = url;
    }, 500);
}

window.addEventListener('pageshow', (event) => {
    if (event.persisted || document.body.classList.contains('page-fade-out')) {
        document.body.classList.remove('page-fade-out');
    }
});


/* =========================================
   2. SMART WORKFLOW LOGIC (Form Handling)
   ========================================= */
let finalCategory = "Plumbing"; 
let finalLocation = "Block 34, 2nd Floor"; 

function startAIFlow() {
    const uploadBox = document.getElementById('upload-box');
    const uploadContent = document.getElementById('upload-content');
    const aiProcessing = document.getElementById('ai-processing');
    const aiReviewBox = document.getElementById('ai-review-box');
    
    if(!uploadBox) return; 
    
    uploadContent.classList.add('hidden');
    aiProcessing.classList.remove('hidden');
    uploadBox.style.borderColor = "var(--amber-solid)";
    
    setTimeout(() => {
        uploadBox.classList.add('hidden'); 
        aiReviewBox.classList.remove('hidden'); 
    }, 2500);
}

function confirmAI() {
    const actions = document.getElementById('ai-actions');
    if(actions) {
        actions.innerHTML = `<span style="color: #10B981; font-weight: 600; font-size: 13px;">✓ Category Confirmed by User</span>`;
        showToast("Category locked successfully.");
    }
}

function editManual() {
    document.getElementById('ai-review-box').classList.add('hidden');
    document.getElementById('manual-category-box').classList.remove('hidden');
}

function setLoc(type) {
    const btnQR = document.getElementById('btn-qr');
    const btnGPS = document.getElementById('btn-gps');
    const qrResult = document.getElementById('qr-result');
    const gpsResult = document.getElementById('gps-result');

    if (!btnQR) return; 

    if (type === 'QR') {
        btnQR.classList.add('active');
        btnGPS.classList.remove('active');
        qrResult.classList.remove('hidden');
        gpsResult.classList.add('hidden');
        finalLocation = "Block 34, 2nd Floor";
    } else {
        btnGPS.classList.add('active');
        btnQR.classList.remove('active');
        qrResult.classList.add('hidden');
        
        gpsResult.innerHTML = "Fetching Satellites... ⏳";
        gpsResult.classList.remove('hidden');
        
        setTimeout(() => {
            gpsResult.innerHTML = `<span style="margin-right: 8px;">🛰️</span> GPS Locked: Near Main Library (Lat: 28.53, Lng: 77.39)`;
            finalLocation = "Near Main Library";
        }, 1500);
    }
}

function submitSmartTicket() {
    const submitBtn = document.getElementById('final-submit-btn');
    if(!submitBtn) return;
    
    submitBtn.innerHTML = 'Routing Ticket... ⏳';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
        showToast(`✅ Submitted at: ${finalLocation}.`);
        submitBtn.innerHTML = '✓ Ticket Submitted';
        submitBtn.style.background = '#10B981';
        submitBtn.style.color = '#fff';
    }, 1500);
}


/* =========================================
   3. PAGE LOAD LOGIC (Session Storage - Unit V)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    
    // Theme Logic
    const themeBtn = document.getElementById('theme-btn');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        if(themeBtn) themeBtn.innerHTML = '☾';
    }

    if (themeBtn) {
        themeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            if (document.body.classList.contains('dark-mode')) {
                themeBtn.innerHTML = '☾';
                localStorage.setItem('theme', 'dark');
            } else {
                themeBtn.innerHTML = '☼';
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Smart Login Form Logic (Event Handling & Session Storage)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        const submitBtn = loginForm.querySelector('.btn-submit'); 
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            const usernameInput = document.getElementById('username').value.trim().toLowerCase();
            
            showToast("Verifying your details...");
            submitBtn.innerHTML = 'Verifying... ⏳';
            submitBtn.style.opacity = '0.7';
            
            setTimeout(() => {
                // Session Storage set kar rahe hain
                sessionStorage.setItem('loggedInUser', usernameInput);
                document.body.classList.add('page-fade-out');
                
                setTimeout(() => {
                    if (usernameInput.includes('warden') || usernameInput.includes('incharge') || usernameInput.includes('admin') || usernameInput.includes('welfare')) {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 500); 
            }, 1500);
        });
    }

    // Dashboard par naam dikhane ka logic
    const welcomeText = document.getElementById('welcome-text');
    if (welcomeText) {
        const savedUser = sessionStorage.getItem('loggedInUser');
        if (savedUser) {
            const formattedName = savedUser.charAt(0).toUpperCase() + savedUser.slice(1);
            welcomeText.innerText = "Welcome, " + formattedName;
            welcomeText.style.display = "inline-block";
        }
    }

    const catPills = document.querySelectorAll('.cat-pill');
    catPills.forEach(pill => {
        pill.addEventListener('click', () => {
            catPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            finalCategory = pill.innerText;
        });
    });

    // Page load hone par local storage se ideas load karna
    loadSavedIdeas();
});


/* =========================================
   4. ADMIN PANEL & DYNAMIC ROUTING
   ========================================= */
let ticketData = [
    { id: "TKT-101", issue: "Water Cooler Pipe Leakage", category: "Plumbing", location: "Block 34, 2nd Fl", reporter: "Siddharth (RK2P26BZB51)", status: "Pending" },
    { id: "TKT-102", issue: "Broken Corridor Light", category: "Electrical", location: "Hostel B7, Ground Fl", reporter: "Snigdha (RK2P26B123)", status: "Resolved" },
    { id: "TKT-103", issue: "AC Not Cooling", category: "Electrical", location: "Lab 4, Block 28", reporter: "Roshan (RK2P26B456)", status: "Pending" },
    { id: "TKT-104", issue: "Projector Cable Missing", category: "IT", location: "Room 102, Block 34", reporter: "Aman (RK2P26B789)", status: "Pending" }
];

const tableBody = document.getElementById('ticket-table-body');
const statusFilter = document.getElementById('status-filter');

if (tableBody) {
    renderTable(ticketData);
    
    if(statusFilter) {
        statusFilter.addEventListener('change', function() {
            let selectedStatus = this.value;
            if (selectedStatus === 'All') {
                renderTable(ticketData); 
            } else {
                renderTable(ticketData.filter(t => t.status === selectedStatus));
            }
        });
    }
}

function renderTable(dataArray) {
    if (!tableBody) return;
    tableBody.innerHTML = ""; 
    
    let currentUser = sessionStorage.getItem('loggedInUser') || 'admin';
    let filteredData = dataArray;
    let pageTitle = document.querySelector('h2'); 
    let ideasSection = document.getElementById('welfare-ideas-section'); 
    let maintenanceWrapper = document.getElementById('maintenance-only'); 
    
    if (currentUser.includes('warden')) { 
        filteredData = dataArray.filter(t => t.location.includes('Hostel B7') || t.location.includes('BH'));
        if(pageTitle) pageTitle.innerText = "Hostel BH7 - Warden Dashboard";
        if(ideasSection) ideasSection.style.display = "none"; 
        if(maintenanceWrapper) maintenanceWrapper.style.display = "block";
        
    } else if (currentUser.includes('incharge')) {
        filteredData = dataArray.filter(t => t.location.includes('Block 34'));
        if(pageTitle) pageTitle.innerText = "Block 34 - Admin Dashboard";
        if(ideasSection) ideasSection.style.display = "none";
        if(maintenanceWrapper) maintenanceWrapper.style.display = "block";
        
    } else if (currentUser.includes('welfare')) {
        filteredData = []; 
        if(pageTitle) pageTitle.innerText = "Student Welfare Wing Dashboard";
        if(maintenanceWrapper) maintenanceWrapper.style.display = "none"; 
        if(ideasSection) ideasSection.style.display = "block"; 
        
    } else {
        if(pageTitle) pageTitle.innerText = "University Master Dashboard";
        if(ideasSection) ideasSection.style.display = "none"; 
        if(maintenanceWrapper) maintenanceWrapper.style.display = "block";
    }

    filteredData.forEach((ticket) => {
        let originalIndex = ticketData.indexOf(ticket); 
        let statusBadge = ticket.status === 'Pending' 
            ? `<span class="step-status text-amber">Pending</span>` 
            : `<span class="step-status text-green">Resolved</span>`;
            
        let actionButton = ticket.status === 'Pending'
            ? `<button class="btn-resolve no-print" onclick="resolveTicket(${originalIndex})">✓ Resolve</button>`
            : `<span class="text-gray no-print" style="font-size:12px;">Resolved</span>`;

        let rowHTML = `
            <tr>
                <td class="text-bold">${ticket.id}</td>
                <td>${ticket.issue}</td>
                <td><span class="badge-outline" style="font-size:10px;">${ticket.category}</span></td>
                <td>${ticket.location}</td>
                <td><span class="light-text" style="font-size:12px;">${ticket.reporter}</span></td>
                <td>${statusBadge}</td>
                <td class="no-print">${actionButton}</td>
            </tr>
        `;
        tableBody.innerHTML += rowHTML;
    });

    updateKPIs(filteredData);
}

function updateKPIs(currentData) {
    if(!document.getElementById('kpi-total')) return;
    let total = currentData.length;
    let resolved = currentData.filter(t => t.status === "Resolved").length;
    document.getElementById('kpi-total').innerText = total;
    document.getElementById('kpi-pending').innerText = total - resolved;
    document.getElementById('kpi-resolved').innerText = resolved;
}

function resolveTicket(index) {
    ticketData[index].status = "Resolved";
    showToast(`${ticketData[index].id} resolved!`);
    
    let currentFilter = statusFilter.value;
    if (currentFilter === 'All') {
        renderTable(ticketData);
    } else {
        renderTable(ticketData.filter(t => t.status === currentFilter));
    }
}


/* =========================================
   5. FEED PAGE LOGIC (Local Storage API & JSON)
   ========================================= */

function toggleProposalForm() {
    let form = document.getElementById("proposal-form");
    if (form) {
        if (form.style.display === "none" || form.style.display === "") {
            form.style.display = "block";
        } else {
            form.style.display = "none";
        }
    }
}

// Naya idea submit karne ka event handler (JSON + Web Storage API)
function submitNewIdea(event) {
    event.preventDefault(); 
    
    let title = document.getElementById('idea-title').value;
    let desc = document.getElementById('idea-desc').value;
    
    if(title === "" || desc === "") {
        alert("Please fill all details!");
        return;
    }

    let newIdea = { title: title, desc: desc };
    let savedIdeas = JSON.parse(localStorage.getItem('campusIdeas')) || [];
    
    savedIdeas.unshift(newIdea); 
    localStorage.setItem('campusIdeas', JSON.stringify(savedIdeas));

    showToast("Idea LIVE on Campus Feed! 🌟");
    toggleProposalForm(); 
    document.getElementById('idea-title').value = "";
    document.getElementById('idea-desc').value = "";

    loadSavedIdeas();
}

// Local Storage se data read karke screen par render karna
function loadSavedIdeas() {
    // Tumhare screenshot ke hisab se div ki id
    let feedContainer = document.getElementById('dynamic-feed-container');
    if(!feedContainer) return;

    let savedIdeas = JSON.parse(localStorage.getItem('campusIdeas')) || [];
    
    let existingDynamic = document.querySelectorAll('.dynamic-added-idea');
    existingDynamic.forEach(el => el.remove());

    savedIdeas.forEach(idea => {
        let cardHTML = `
            <div class="card proposal-card dynamic-added-idea" style="margin-bottom: 20px; border-left: 4px solid #10B981; background: #ffffff; padding: 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                <div class="flex" style="justify-content: space-between; align-items: start;">
                    <div>
                        <h3 style="color: #15803d; margin: 0 0 8px 0;">${idea.title}</h3>
                        <p style="color: #555; font-size: 14px; margin: 0 0 12px 0;">${idea.desc}</p>
                        <span style="font-size: 11px; background: #e2e8f0; padding: 4px 8px; border-radius: 4px;">Just Now • By You</span>
                    </div>
                </div>
            </div>
        `;
        feedContainer.insertAdjacentHTML('afterbegin', cardHTML);
    });
}

function simpleUpvote(cardNumber) {
    let countElement = document.getElementById("vote-count-" + cardNumber);
    if (!countElement) return;

    let currentVotes = parseInt(countElement.innerText);
    
    if (currentVotes < 50) {
        currentVotes = currentVotes + 1; 
        countElement.innerText = currentVotes; 
        
        if (currentVotes === 50) {
            alert("Success! Initiative is ready for Official Review.");
            countElement.style.color = "#3B82F6"; 
        }
    }
}










/* =========================================
   CAMERA ATTACHMENT & AI TRIGGER LOGIC
   ========================================= */
function updatePhotoLabel() {
    let input = document.getElementById('ticket-photo');
    let labelBox = document.getElementById('photo-label-box');
    
    if (input && input.files && input.files.length > 0) {
        let fileName = input.files[0].name;
        if (fileName.length > 15) {
            fileName = fileName.substring(0, 15) + "...";
        }
        
        // 1. Label ko green karna
        labelBox.innerHTML = "✅ Photo Attached: " + fileName;
        labelBox.style.background = "#dcfce7";
        labelBox.style.border = "1px solid #10B981";

        // 2. Thodi der baad AI verification animation start karna
        setTimeout(() => {
            startAIFlow();
        }, 800);
    }
}
