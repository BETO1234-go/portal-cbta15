// ============================================================
// Portal CBTA 15 - JavaScript compartido
// ============================================================

// --- Tema (light/dark) ---
(function () {
    var root = document.documentElement;
    var saved = localStorage.getItem('inventario-theme');
    if (saved === 'dark' || saved === 'light') {
        root.dataset.theme = saved;
    }
    document.querySelectorAll('[data-theme-label]').forEach(function (el) {
        el.textContent = root.dataset.theme === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro';
    });
})();

function toggleTheme() {
    var root = document.documentElement;
    var next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('inventario-theme', next);
    document.querySelectorAll('[data-theme-label]').forEach(function (el) {
        el.textContent = next === 'dark' ? 'Cambiar a claro' : 'Cambiar a oscuro';
    });
}

// --- Sidebar ---
function getSidebarElements() {
    return {
        sidebar: document.getElementById('mainSidebar'),
        content: document.querySelector('.contenido'),
        overlay: document.getElementById('sidebarOverlay'),
        button: document.getElementById('hamburgerFixed')
    };
}

function isDesktopSidebar() {
    return window.innerWidth > 1000;
}

function setSidebarButtonExpanded(expanded) {
    var button = document.getElementById('hamburgerFixed');
    if (button) button.setAttribute('aria-expanded', expanded ? 'true' : 'false');
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
    setSidebarButtonExpanded(open);
}

function syncSidebarForViewport() {
    var elements = getSidebarElements();
    if (!elements.sidebar) return;
    clearMobileSidebarState(elements);
    if (isDesktopSidebar()) {
        if (elements.content) {
            elements.content.classList.toggle('sidebar-hidden', elements.sidebar.classList.contains('hidden'));
        }
        setSidebarButtonExpanded(!elements.sidebar.classList.contains('hidden'));
    } else {
        elements.sidebar.classList.remove('hidden');
        if (elements.content) elements.content.classList.remove('sidebar-hidden');
        setSidebarButtonExpanded(false);
    }
}

function toggleSidebar() {
    var elements = getSidebarElements();
    if (!elements.sidebar) return;
    if (isDesktopSidebar()) {
        clearMobileSidebarState(elements);
        elements.sidebar.classList.toggle('hidden');
        if (elements.content) {
            elements.content.classList.toggle('sidebar-hidden', elements.sidebar.classList.contains('hidden'));
        }
        setSidebarButtonExpanded(!elements.sidebar.classList.contains('hidden'));
    } else {
        setMobileSidebar(!elements.sidebar.classList.contains('open'), elements);
    }
}

function closeSidebar() {
    var elements = getSidebarElements();
    if (isDesktopSidebar()) {
        clearMobileSidebarState(elements);
        if (elements.content && elements.sidebar) {
            elements.content.classList.toggle('sidebar-hidden', elements.sidebar.classList.contains('hidden'));
        }
        setSidebarButtonExpanded(elements.sidebar && !elements.sidebar.classList.contains('hidden'));
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

document.addEventListener('DOMContentLoaded', syncSidebarForViewport);

// --- Busqueda en tablas ---
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.table-search').forEach(function (input) {
        input.addEventListener('keyup', function () {
            var targetId = this.dataset.target;
            var table = document.getElementById(targetId);
            if (!table) return;
            var filter = this.value.toLowerCase().trim();
            var rows = table.querySelectorAll('tbody tr');
            rows.forEach(function (row) {
                var text = row.textContent.toLowerCase();
                row.style.display = text.indexOf(filter) !== -1 ? '' : 'none';
            });
        });
    });
});

// --- Modales ---
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-modal]').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var modal = document.getElementById(this.dataset.modal);
            if (modal) modal.classList.add('active');
        });
    });

    document.querySelectorAll('.modal-close, .modal-overlay').forEach(function (el) {
        el.addEventListener('click', function (e) {
            if (e.target === this) {
                var modal = this.closest('.modal-overlay');
                if (modal) modal.classList.remove('active');
            }
        });
    });
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

// --- Modal de Confirmacion ---
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
    var btn = document.getElementById('confirmModalBtn');
    if (btn) {
        btn.addEventListener('click', function () {
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

function closeAlertModal() { closeModal('alertModal'); }

// --- Logout (Supabase) ---
function logout() {
    localStorage.removeItem('supabase_user');
    localStorage.removeItem('supabase_role');
    window.location.href = '../index.html';
}

// --- Auth helper ---
function getAuthUser() {
    try {
        return JSON.parse(localStorage.getItem('supabase_user'));
    } catch (e) { return null; }
}

function getAuthRole() {
    return localStorage.getItem('supabase_role') || 'maestro';
}

function requireAuth() {
    var user = getAuthUser();
    if (!user) {
        window.location.href = '../login/personal.html';
        return false;
    }
    return true;
}
