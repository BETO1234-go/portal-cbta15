document.addEventListener('DOMContentLoaded', function () {
    var root = document.documentElement;
    var savedTheme = localStorage.getItem('inventario-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        root.dataset.theme = savedTheme;
    }

    var user = getInvUser();
    if (!user) {
        var path = window.location.pathname;
        if (!path.endsWith('login.html') && !path.includes('/login')) {
            window.location.href = '../login.html';
        }
        return;
    }

    var nameEl = document.getElementById('userName');
    var roleEl = document.getElementById('userRole');
    if (nameEl) nameEl.textContent = user.nombre || user.email;
    if (roleEl) roleEl.textContent = user.rol === 'admin' ? 'Administrador' : 'Visualizador';

    if (!invIsAdmin()) {
        document.querySelectorAll('.admin-only').forEach(function (el) { el.style.display = 'none'; });
    }

    syncSidebarForViewport();
});

function toggleTheme() {
    var root = document.documentElement;
    var current = root.dataset.theme === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('inventario-theme', next);

    var label = document.querySelector('[data-theme-label]');
    if (label) label.textContent = next === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro';

    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) toggle.checked = next === 'dark';
}

function getSidebarElements() {
    return {
        sidebar: document.getElementById('mainSidebar') || document.querySelector('.sidebar'),
        content: document.querySelector('.contenido'),
        overlay: document.getElementById('sidebarOverlay'),
        button: document.getElementById('hamburgerFixed')
    };
}

function isDesktopSidebar() {
    return window.innerWidth > 1000;
}

function clearMobileSidebarState(elements) {
    if (!elements) elements = getSidebarElements();
    if (elements.sidebar) elements.sidebar.classList.remove('open');
    if (elements.overlay) elements.overlay.classList.remove('show');
    document.body.classList.remove('sidebar-open');
}

function setMobileSidebar(open, elements) {
    if (!elements) elements = getSidebarElements();
    if (!elements.sidebar) return;
    elements.sidebar.classList.remove('hidden');
    if (elements.content) elements.content.classList.remove('sidebar-hidden');
    elements.sidebar.classList.toggle('open', open);
    if (elements.overlay) elements.overlay.classList.toggle('show', open);
    document.body.classList.toggle('sidebar-open', open);
}

function syncSidebarForViewport() {
    var elements = getSidebarElements();
    if (!elements.sidebar) return;
    clearMobileSidebarState(elements);
    if (isDesktopSidebar()) {
        if (elements.content) elements.content.classList.toggle('sidebar-hidden', elements.sidebar.classList.contains('hidden'));
    } else {
        elements.sidebar.classList.remove('hidden');
        if (elements.content) elements.content.classList.remove('sidebar-hidden');
    }
}

function toggleSidebar() {
    var elements = getSidebarElements();
    if (!elements.sidebar) return;
    if (isDesktopSidebar()) {
        clearMobileSidebarState(elements);
        elements.sidebar.classList.toggle('hidden');
        if (elements.content) elements.content.classList.toggle('sidebar-hidden', elements.sidebar.classList.contains('hidden'));
    } else {
        setMobileSidebar(!elements.sidebar.classList.contains('open'), elements);
    }
}

function closeSidebar() {
    var elements = getSidebarElements();
    if (isDesktopSidebar()) {
        clearMobileSidebarState(elements);
        if (elements.content && elements.sidebar) elements.content.classList.toggle('sidebar-hidden', elements.sidebar.classList.contains('hidden'));
        return;
    }
    setMobileSidebar(false, elements);
}

var lastSidebarDesktopState = isDesktopSidebar();
window.addEventListener('resize', function () {
    var current = isDesktopSidebar();
    if (current !== lastSidebarDesktopState) {
        lastSidebarDesktopState = current;
        syncSidebarForViewport();
    }
});

function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('show');
}

function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('show');
}

document.addEventListener('click', function (e) {
    document.querySelectorAll('.component-modal.show').forEach(function (modal) {
        if (e.target === modal) modal.classList.remove('show');
    });
});

var confirmCallback = null;

function showConfirm(message, callback, title) {
    document.getElementById('confirmModalMessage').textContent = message;
    document.getElementById('confirmModalTitle').textContent = title || 'Confirmar';
    confirmCallback = callback;
    openModal('confirmModal');
}

function closeConfirmModal() {
    confirmCallback = null;
    closeModal('confirmModal');
}

document.addEventListener('DOMContentLoaded', function () {
    var confirmBtn = document.getElementById('confirmModalBtn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function () {
            if (confirmCallback) { confirmCallback(); confirmCallback = null; }
            closeModal('confirmModal');
        });
    }
});

function showAlert(message, title) {
    document.getElementById('alertModalMessage').textContent = message;
    document.getElementById('alertModalTitle').textContent = title || 'Aviso';
    openModal('alertModal');
}

function closeAlertModal() {
    closeModal('alertModal');
}
