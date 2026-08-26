// ============================================================
// Inventario Escolar CBTA 15 - App (sidebar, tema, modales)
// ============================================================

// --- Tema ---
(function () {
    var root = document.documentElement;
    var saved = localStorage.getItem('inv-theme');
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
    localStorage.setItem('inv-theme', next);
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

// --- Modales ---
function openModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('show');
}

function closeModal(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('show');
}

document.addEventListener('click', function (e) {
    document.querySelectorAll('.modal.show').forEach(function (modal) {
        if (e.target === modal) modal.classList.remove('show');
    });
});

// --- Toast ---
function showToast(message, type) {
    type = type || 'info';
    var existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'toast-notification toast-' + type;
    toast.innerHTML = '<span>' + message + '</span><button onclick="this.parentElement.remove()">&times;</button>';
    document.body.appendChild(toast);

    setTimeout(function () { toast.classList.add('show'); }, 10);
    setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () { toast.remove(); }, 300);
    }, 4000);
}

// --- Auth guard + user info ---
document.addEventListener('DOMContentLoaded', function () {
    requireInvAuth();
    var user = getInvUser();
    var role = getInvRole();

    var footer = document.querySelector('.sidebar-footer');
    if (footer && user) {
        var info = document.createElement('div');
        info.style.cssText = 'padding:0 20px 10px;font-size:0.82rem;opacity:0.8;border-top:1px solid var(--border,#ddd);margin-top:10px;padding-top:10px;';
        var name = user.email || 'Usuario';
        info.innerHTML = '<i class="fa-solid fa-user"></i> ' + name + '<br><small style="text-transform:capitalize;">' + role + '</small>';
        footer.insertBefore(info, footer.firstChild);
    }

    // Hide admin-only nav items for visualizadores
    if (role !== 'admin') {
        document.querySelectorAll('.admin-only').forEach(function (el) {
            el.style.display = 'none';
        });
    }
});
