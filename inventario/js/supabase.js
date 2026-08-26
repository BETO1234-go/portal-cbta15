// ============================================================
// Inventario Escolar CBTA 15 - Supabase Config
// ============================================================

const INV_URL = 'https://fqfrqwyoehxakesfwhpw.supabase.co';
const INV_KEY = 'sb_publishable_IdH-OaL4gU8rAIzhk3-iAw_ZIBsiTT1';

var invClient = null;

function initInventario() {
    try {
        var lib = window.supabase || window.Supabase;
        if (lib && typeof lib.createClient === 'function') {
            invClient = lib.createClient(INV_URL, INV_KEY);
            console.log('Inventario Supabase conectado');
            return true;
        }
    } catch (e) {
        console.warn('initInventario error:', e);
    }
    console.log('Inventario en modo demo');
    return false;
}

async function invLogin(email, password) {
    if (!invClient) {
        var user = { email: email, nombre: 'Admin Inventario', rol: 'admin' };
        localStorage.setItem('inv_user', JSON.stringify(user));
        localStorage.setItem('inv_role', 'admin');
        return { user: user, error: null };
    }

    var result = await invClient.auth.signInWithPassword({ email: email, password: password });
    if (result.error) return { user: null, error: result.error.message };

    localStorage.setItem('inv_session', JSON.stringify(result.data.session));

    var perfilResult = await invClient
        .from('inv_usuarios')
        .select('rol, nombre')
        .eq('correo', email)
        .single();

    var perfil = perfilResult.data;

    var user = {
        id: result.data.user.id,
        email: result.data.user.email,
        nombre: (perfil && perfil.nombre) || result.data.user.email,
        rol: (perfil && perfil.rol) || 'admin'
    };

    localStorage.setItem('inv_user', JSON.stringify(user));
    localStorage.setItem('inv_role', user.rol);

    return { user: user, error: null };
}

async function invLogout() {
    if (invClient) {
        await invClient.auth.signOut();
    }
    localStorage.removeItem('inv_user');
    localStorage.removeItem('inv_role');
    localStorage.removeItem('inv_session');
    window.location.href = '../login.html';
}

function getInvUser() {
    try { return JSON.parse(localStorage.getItem('inv_user')); }
    catch (e) { return null; }
}

function getInvRole() {
    return localStorage.getItem('inv_role') || 'visualizador';
}

function requireInvAuth() {
    var user = getInvUser();
    if (!user) {
        window.location.href = '../login.html';
        return false;
    }
    return true;
}

function invIsAdmin() {
    return getInvRole() === 'admin';
}

document.addEventListener('DOMContentLoaded', function () {
    initInventario();
});
