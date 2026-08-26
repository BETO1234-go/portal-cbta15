// ============================================================
// Portal CBTA 15 - Configuracion de Supabase
// ============================================================

const SUPABASE_URL = 'https://fqfrqwyoehxakesfwhpw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IdH-OaL4gU8rAIzhk3-iAw_ZIBsiTT1';

// ============================================================
// Inicializar cliente Supabase
// ============================================================

var sbClient = null;

function initSupabase() {
    try {
        var lib = window.supabase || window.Supabase;
        if (lib && typeof lib.createClient === 'function' && SUPABASE_URL !== 'TU_URL_DE_SUPABASE') {
            sbClient = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('Supabase conectado');
            return true;
        }
    } catch (e) {
        console.warn('initSupabase error:', e);
    }
    console.log('Supabase en modo demo (datos mock)');
    return false;
}

// ============================================================
// Auth helpers
// ============================================================

async function supabaseLogin(correo, password) {
    if (!sbClient) {
        var user = { email: correo, nombre: 'Administrador', rol: 'administrador' };
        localStorage.setItem('supabase_user', JSON.stringify(user));
        localStorage.setItem('supabase_role', 'administrador');
        return { user: user, error: null };
    }

    var result = await sbClient.auth.signInWithPassword({
        email: correo,
        password: password
    });

    var data = result.data;
    var error = result.error;

    if (error) return { user: null, error: error.message };

    localStorage.setItem('supabase_session', JSON.stringify(data.session));

    var perfilResult = await sbClient
        .from('usuarios')
        .select('rol, nombre_completo')
        .eq('correo', correo)
        .single();

    var perfil = perfilResult.data;

    var user = {
        id: data.user.id,
        email: data.user.email,
        nombre: (perfil && perfil.nombre_completo) || data.user.email,
        rol: (perfil && perfil.rol) || 'maestro'
    };

    localStorage.setItem('supabase_user', JSON.stringify(user));
    localStorage.setItem('supabase_role', user.rol);

    return { user: user, error: null };
}

async function supabaseLoginAlumno(matricula) {
    if (!sbClient) {
        var user = { matricula: matricula, nombre: 'Alumno de Prueba' };
        localStorage.setItem('supabase_user', JSON.stringify(user));
        localStorage.setItem('supabase_role', 'alumno');
        return { user: user, error: null };
    }

    var result = await sbClient
        .from('alumnos')
        .select('id, numero_control, nombre_completo, grupo')
        .eq('numero_control', matricula)
        .eq('activo', true)
        .single();

    var data = result.data;
    var error = result.error;

    if (error || !data) return { user: null, error: 'Matricula no encontrada' };

    var user = {
        id: data.id,
        matricula: data.numero_control,
        nombre: data.nombre_completo,
        grupo: data.grupo,
        rol: 'alumno'
    };

    localStorage.setItem('supabase_user', JSON.stringify(user));
    localStorage.setItem('supabase_role', 'alumno');

    return { user: user, error: null };
}

async function supabaseLogout() {
    if (sbClient) {
        await sbClient.auth.signOut();
    }
    localStorage.removeItem('supabase_user');
    localStorage.removeItem('supabase_role');
    localStorage.removeItem('supabase_session');
    window.location.href = '../index.html';
}

// ============================================================
// Inicializar al cargar
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    initSupabase();
});
