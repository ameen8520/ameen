import { Storage } from './storage.js';
import { UI } from './ui_components.js';

let currentUser = null;
let currentView = 'dashboard';
let qrScanner = null;
let activeStudentId = null;

const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: 'home', roles: ['admin'] },
    { id: 'students', label: 'الطلاب', icon: 'users', roles: ['admin'] },
    { id: 'attendance', label: 'الحضور', icon: 'calendar-check', roles: ['admin'] },
    { id: 'sync', label: 'المزامنة', icon: 'refresh-cw', roles: ['admin'] }
];

window.handleLogin = () => {
    const pin = document.getElementById('pin-input').value;
    if (pin === '1234') {
        currentUser = 'admin';
        document.getElementById('auth-screen').classList.add('hidden');
        renderApp();
    } else if (pin === '0000') {
        currentUser = 'parent';
        document.getElementById('auth-screen').classList.add('hidden');
        renderApp('parent-portal');
    } else {
        alert('الرمز غير صحيح');
    }
};

window.logout = () => {
    currentUser = null;
    document.getElementById('auth-screen').classList.remove('hidden');
    document.getElementById('pin-input').value = '';
};

function renderApp(view = 'dashboard') {
    currentView = view;
    Storage.init();
    renderNav();
    renderView();
    lucide.createIcons();
}

function renderNav() {
    const adminNav = document.getElementById('admin-nav');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (currentUser === 'parent') {
        adminNav.innerHTML = '';
        mobileNav.innerHTML = `<button onclick="switchView('parent-portal')" class="flex flex-col items-center gap-1 text-primary">
            <i data-lucide="search"></i><span class="text-[10px]">بحث</span>
        </button>
        <button onclick="logout()" class="flex flex-col items-center gap-1 text-red-500">
            <i data-lucide="log-out"></i><span class="text-[10px]">خروج</span>
        </button>`;
        return;
    }

    const navHtml = navItems.map(item => `
        <button onclick="switchView('${item.id}')" class="flex flex-col md:flex-row items-center gap-3 p-3 rounded-2xl transition-all ${currentView === item.id ? 'nav-item-active' : 'text-gray-400'}">
            <i data-lucide="${item.icon}" class="${currentView === item.id ? 'text-primary' : ''}"></i>
            <span class="text-[10px] md:text-base">${item.label}</span>
        </button>
    `).join('');

    adminNav.innerHTML = navHtml;
    mobileNav.innerHTML = navHtml;
}

window.switchView = (view, studentId = null) => {
    currentView = view;
    activeStudentId = studentId;
    renderView();
    renderNav();
    lucide.createIcons();
};

function renderView() {
    const container = document.getElementById('view-container');
    const data = Storage.getData();

    switch (currentView) {
        case 'dashboard':
            container.innerHTML = UI.renderDashboard(data);
            break;
        case 'students':
            container.innerHTML = UI.renderStudentList(data.students);
            break;
        case 'student-detail':
            const student = data.students.find(s => s.id === activeStudentId);
            container.innerHTML = UI.renderStudentDetail(student);
            break;
        case 'attendance':
            container.innerHTML = UI.renderAttendance(data.students, data.attendance);
            break;
        case 'sync':
            container.innerHTML = UI.renderSync(data);
            break;
        case 'parent-portal':
            container.innerHTML = UI.renderParentPortal();
            break;
    }
    lucide.createIcons();
}

window.showAddStudentModal = () => {
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');
    modal.classList.remove('hidden');
    content.innerHTML = UI.renderStudentForm();
    lucide.createIcons();
};

window.closeModal = () => {
    document.getElementById('modal-container').classList.add('hidden');
};

window.saveStudent = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const student = Object.fromEntries(formData.entries());
    Storage.addStudent(student);
    closeModal();
    renderView();
};

window.saveMemorization = (e, studentId) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const entry = Object.fromEntries(formData.entries());
    Storage.addMemorization(studentId, entry);
    renderView();
};

window.toggleAttendance = (studentId, date) => {
    const data = Storage.getData();
    const current = data.attendance[date]?.[studentId] || 'absent';
    const next = current === 'present' ? 'absent' : 'present';
    Storage.markAttendance(date, studentId, next);
    renderView();
};

window.generateSyncQR = () => {
    const data = Storage.getData();
    const qrContainer = document.getElementById('sync-qr-container');
    qrContainer.innerHTML = '<canvas id="sync-canvas" class="mx-auto"></canvas>';
    
    const payload = JSON.stringify({
        t: 'tahfiz_sync_v2',
        d: data,
        v: Date.now()
    });

    QRCode.toCanvas(document.getElementById('sync-canvas'), payload, {
        width: 250,
        margin: 2
    });
};

window.startQRScanner = () => {
    const reader = document.getElementById('reader');
    reader.classList.remove('hidden');
    qrScanner = new Html5Qrcode("reader");
    qrScanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
            try {
                const imported = JSON.parse(decodedText);
                if (imported.t === 'tahfiz_sync_v2') {
                    Storage.saveData(imported.d);
                    alert('تم مزامنة البيانات بنجاح');
                    qrScanner.stop();
                    reader.classList.add('hidden');
                    location.reload();
                }
            } catch (e) {
                console.error(e);
            }
        }
    );
};

window.searchParent = () => {
    const nid = document.getElementById('parent-nid').value;
    const student = Storage.getData().students.find(s => s.nid === nid);
    const resultArea = document.getElementById('parent-result-area');
    
    if (student) {
        resultArea.innerHTML = UI.renderParentResult(student);
    } else {
        resultArea.innerHTML = `<div class="p-8 text-center text-gray-400">لم يتم العثور على طالب بهذا الرقم الوطني</div>`;
    }
    lucide.createIcons();
};

window.exportJSON = () => Storage.exportData();
window.handleImport = (e) => {
    Storage.importData(e.target.files[0]).then(() => {
        alert('تم الاستيراد بنجاح');
        location.reload();
    });
};

renderApp();
