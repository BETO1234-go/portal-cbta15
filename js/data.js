// ============================================================
// Portal CBTA 15 - Carga de datos via DB.* (Supabase o mock)
// ============================================================

function populateTable(tableId, data, columns) {
    var table = document.getElementById(tableId);
    if (!table) return;
    var tbody = table.querySelector('tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    data.forEach(function(row) {
        var tr = document.createElement('tr');
        columns.forEach(function(col) {
            var td = document.createElement('td');
            td.textContent = row[col.key] || '-';
            if (col.style) td.style.cssText = col.style;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

async function populateAlumnos() {
    var result = await DB.getAlumnos(1, 100);
    var rows = result.data.map(function(a) {
        return {
            no_control: a.numero_control || a.no_control,
            nombre: a.nombre_completo || a.nombre,
            grado: a.grado || '-',
            grupo: a.grupo || '-',
            lugar: a.lugar || '-',
            carrera: a.carrera || '-',
            modalidad: a.modalidad || '-',
            generacion: a.generacion || '-',
            sexo: a.sexo || '-',
            activo: a.activo ? 'Si' : 'No'
        };
    });
    populateTable('tabla_alumnos', rows, [
        { key: 'no_control' },
        { key: 'nombre' },
        { key: 'grado' },
        { key: 'grupo' },
        { key: 'lugar' },
        { key: 'carrera' },
        { key: 'modalidad' },
        { key: 'generacion' },
        { key: 'sexo' },
        { key: 'activo' },
        { key: '_acciones' }
    ]);
    document.getElementById('tabla_alumnos').querySelectorAll('tr').forEach(function(tr) {
        var lastTd = tr.lastElementChild;
        if (lastTd) {
            lastTd.innerHTML = '<button type="button" class="btn btn-danger btn-sm" onclick="showAlert(\'Funcionalidad pendiente de Supabase\', \'Eliminar\')">Eliminar</button>';
        }
    });
}

async function populateGrupos() {
    var result = await DB.getGrupos(1, 100);
    var rows = result.data.map(function(g) {
        return {
            grado: g.grado || (g.catalogo_grados ? g.catalogo_grados.nombre : g.grado) || '-',
            grupo: g.grupo || g.nombre || '-'
        };
    });
    populateTable('tabla_grupos', rows, [
        { key: 'grado' },
        { key: 'grupo' },
        { key: '_acciones' }
    ]);
    document.getElementById('tabla_grupos').querySelectorAll('tr').forEach(function(tr) {
        var lastTd = tr.lastElementChild;
        if (lastTd) {
            lastTd.innerHTML = '<button type="button" class="btn btn-danger btn-sm" onclick="showAlert(\'Funcionalidad pendiente de Supabase\', \'Eliminar\')">Eliminar</button>';
        }
    });
}

async function populateMaestros() {
    var result = await DB.getMaestros(1, 100);
    var rows = result.data.map(function(m) {
        return {
            no_empleado: m.numero_empleado || m.no_empleado,
            nombre: m.nombre_completo || m.nombre,
            especialidad: m.especialidad || '-',
            usuario: (m.usuarios ? m.usuarios.correo : m.usuario) || '-'
        };
    });
    populateTable('tabla_maestros', rows, [
        { key: 'no_empleado' },
        { key: 'nombre' },
        { key: 'especialidad' },
        { key: 'usuario' },
        { key: '_acciones' }
    ]);
    document.getElementById('tabla_maestros').querySelectorAll('tr').forEach(function(tr) {
        var lastTd = tr.lastElementChild;
        if (lastTd) {
            lastTd.innerHTML = '<button type="button" class="btn btn-danger btn-sm" onclick="showAlert(\'Funcionalidad pendiente de Supabase\', \'Eliminar\')">Eliminar</button>';
        }
    });
}

async function populateMaterias() {
    var result = await DB.getMaterias(1, 100);
    var rows = result.data.map(function(m) {
        var grupoNombre = '-';
        if (m.grupos) {
            grupoNombre = m.grupos.nombre;
            if (m.grupos.catalogo_grados) grupoNombre = m.grupos.catalogo_grados.nombre + ' ' + m.grupos.nombre;
        }
        var maestroNombre = '-';
        if (m.maestros) maestroNombre = m.maestros.nombre_completo || m.maestros.nombre;
        return {
            clave: m.clave,
            nombre: m.nombre,
            grupo: grupoNombre,
            maestro: maestroNombre
        };
    });
    populateTable('tabla_materias', rows, [
        { key: 'clave' },
        { key: 'nombre' },
        { key: 'grupo' },
        { key: 'maestro' },
        { key: '_acciones' }
    ]);
    document.getElementById('tabla_materias').querySelectorAll('tr').forEach(function(tr) {
        var lastTd = tr.lastElementChild;
        if (lastTd) {
            lastTd.innerHTML = '<button type="button" class="btn btn-danger btn-sm" onclick="showAlert(\'Funcionalidad pendiente de Supabase\', \'Eliminar\')">Eliminar</button>';
        }
    });
}

async function populateCalificaciones() {
    var result = await DB.getCalificaciones(1, 100);
    var rows = result.data.map(function(c) {
        var alumno = c.alumnos || {};
        var materia = c.materias || {};
        return {
            matricula: alumno.numero_control || '-',
            alumno: alumno.nombre_completo || '-',
            materia: materia.nombre || '-',
            p1: c.parcial_1 || '-',
            p2: c.parcial_2 || '-',
            p3: c.parcial_3 || '-',
            promedio: c.promedio || '-'
        };
    });
    populateTable('tabla_calificaciones', rows, [
        { key: 'matricula' },
        { key: 'alumno' },
        { key: 'materia' },
        { key: 'p1' },
        { key: 'p2' },
        { key: 'p3' },
        { key: 'promedio' }
    ]);
}

async function populateAsistencias() {
    var result = await DB.getAsistencias(1, 100);
    var rows = result.data.map(function(a) {
        var alumno = a.alumnos || {};
        var materia = a.materias || {};
        var porcentaje = a.total_sesiones > 0 ? Math.round((a.asistencias / a.total_sesiones) * 100) + '%' : '-';
        return {
            matricula: alumno.numero_control || '-',
            alumno: alumno.nombre_completo || '-',
            materia: materia.nombre || '-',
            parcial: a.parcial || '-',
            sesiones: a.total_sesiones || '-',
            asistencias: a.asistencias || '-',
            porcentaje: porcentaje,
            cumple: a.cumple ? 'Si' : 'No'
        };
    });
    populateTable('tabla_asistencias', rows, [
        { key: 'matricula' },
        { key: 'alumno' },
        { key: 'materia' },
        { key: 'parcial' },
        { key: 'sesiones' },
        { key: 'asistencias' },
        { key: 'porcentaje' },
        { key: 'cumple' }
    ]);
}

async function populateRiesgo() {
    var result = await DB.getRiesgos(1, 100);
    var rows = result.data.map(function(r) {
        var alumno = r.alumnos || {};
        var materia = r.materias || {};
        var causa = r.catalogo_causas || {};
        return {
            alumno: alumno.numero_control ? alumno.numero_control + ' - ' + (alumno.nombre_completo || '-') : (r.alumno || '-'),
            materia: materia.nombre || '-',
            causa: causa.nombre || '-',
            estatus: r.estatus || '-',
            detalle: r.detalle || '-',
            fecha: r.created_at ? r.created_at.substring(0, 10) : (r.fecha || '-')
        };
    });
    populateTable('tabla_riesgos', rows, [
        { key: 'alumno' },
        { key: 'materia' },
        { key: 'causa' },
        { key: 'estatus' },
        { key: 'detalle' },
        { key: 'fecha' }
    ]);
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('tabla_alumnos')) populateAlumnos();
    if (document.getElementById('tabla_grupos')) populateGrupos();
    if (document.getElementById('tabla_maestros')) populateMaestros();
    if (document.getElementById('tabla_materias')) populateMaterias();
    if (document.getElementById('tabla_calificaciones')) populateCalificaciones();
    if (document.getElementById('tabla_asistencias')) populateAsistencias();
    if (document.getElementById('tabla_riesgos')) populateRiesgo();
});
