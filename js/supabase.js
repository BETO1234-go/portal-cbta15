// ============================================================
// Portal CBTA 15 - Configuracion de Supabase
// ============================================================
// INSTRUCCIONES:
// 1. Crea una cuenta en https://supabase.com
// 2. Crea un nuevo proyecto
// 3. Ve a Settings > API y copia:
//    - Project URL (ej: https://xxxxx.supabase.co)
//    - anon/public key (empieza con eyJ...)
// 4. Reemplaza los valores de abajo
// ============================================================

const SUPABASE_URL = 'https://fqfrqwyoehxakesfwhpw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_IdH-OaL4gU8rAIzhk3-iAw_ZIBsiTT1';

// ============================================================
// Inicializar cliente Supabase (carga desde CDN)
// ============================================================

let supabase = null;

function initSupabase() {
    if (typeof window.supabase !== 'undefined' && SUPABASE_URL !== 'TU_URL_DE_SUPABASE') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        console.log('Supabase conectado');
        return true;
    }
    console.log('Supabase en modo demo (datos mock)');
    return false;
}

// ============================================================
// Auth helpers
// ============================================================

async function supabaseLogin(correo, password) {
    if (!supabase) {
        // Modo demo
        var user = { email: correo, nombre: 'Administrador', rol: 'administrador' };
        localStorage.setItem('supabase_user', JSON.stringify(user));
        localStorage.setItem('supabase_role', 'administrador');
        return { user: user, error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email: correo,
        password: password
    });

    if (error) return { user: null, error: error.message };

    // Obtener rol del usuario desde la tabla usuarios
    const { data: perfil } = await supabase
        .from('usuarios')
        .select('rol, nombre_completo')
        .eq('correo', correo)
        .single();

    const user = {
        id: data.user.id,
        email: data.user.email,
        nombre: perfil?.nombre_completo || data.user.email,
        rol: perfil?.rol || 'maestro'
    };

    localStorage.setItem('supabase_user', JSON.stringify(user));
    localStorage.setItem('supabase_role', user.rol);

    return { user: user, error: null };
}

async function supabaseLoginAlumno(matricula) {
    if (!supabase) {
        var user = { matricula: matricula, nombre: 'Alumno de Prueba' };
        localStorage.setItem('supabase_user', JSON.stringify(user));
        localStorage.setItem('supabase_role', 'alumno');
        return { user: user, error: null };
    }

    const { data, error } = await supabase
        .from('alumnos')
        .select('id, numero_control, nombre_completo, grupo')
        .eq('numero_control', matricula)
        .eq('activo', true)
        .single();

    if (error || !data) return { user: null, error: 'Matricula no encontrada' };

    const user = {
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
    if (supabase) {
        await supabase.auth.signOut();
    }
    localStorage.removeItem('supabase_user');
    localStorage.removeItem('supabase_role');
    window.location.href = '../index.html';
}

// ============================================================
// Inicializar al cargar
// ============================================================

document.addEventListener('DOMContentLoaded', function () {
    initSupabase();
});
