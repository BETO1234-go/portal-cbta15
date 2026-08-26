// ============================================================
// Portal CBTA 15 - Operaciones CRUD (Supabase + fallback mock)
// ============================================================

var DB = {
    // ========================================================
    // ALUMNOS
    // ========================================================
    async getAlumnos(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        if (supabase) {
            const { data, count, error } = await supabase
                .from('alumnos')
                .select('*', { count: 'exact' })
                .order('apellido_paterno')
                .range(from, to);
            if (error) throw error;
            return { data: data, total: count, page: page, perPage: perPage };
        }
        // Mock fallback
        var all = MOCK_DATA.alumnos;
        return { data: all.slice(from, to + 1), total: all.length, page: page, perPage: perPage };
    },

    async createAlumno(alumno) {
        if (supabase) {
            const { data, error } = await supabase.from('alumnos').insert(alumno).select();
            if (error) throw error;
            return data[0];
        }
        alumno.id = Date.now();
        MOCK_DATA.alumnos.push(alumno);
        return alumno;
    },

    async deleteAlumno(id) {
        if (supabase) {
            const { error } = await supabase.from('alumnos').delete().eq('id', id);
            if (error) throw error;
            return true;
        }
        MOCK_DATA.alumnos = MOCK_DATA.alumnos.filter(a => a.id !== id);
        return true;
    },

    async deleteAllAlumnos() {
        if (supabase) {
            const { error } = await supabase.from('alumnos').delete().neq('id', 0);
            if (error) throw error;
            return true;
        }
        MOCK_DATA.alumnos = [];
        return true;
    },

    // ========================================================
    // GRUPOS
    // ========================================================
    async getGrupos(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        if (supabase) {
            const { data, count, error } = await supabase
                .from('grupos')
                .select('*, catalogo_grados!grado_id(nombre)', { count: 'exact' })
                .order('id')
                .range(from, to);
            if (error) throw error;
            return { data: data, total: count, page: page, perPage: perPage };
        }
        var all = MOCK_DATA.grupos;
        return { data: all.slice(from, to + 1), total: all.length, page: page, perPage: perPage };
    },

    async createGrupo(grupo) {
        if (supabase) {
            const { data, error } = await supabase.from('grupos').insert(grupo).select();
            if (error) throw error;
            return data[0];
        }
        grupo.id = Date.now();
        MOCK_DATA.grupos.push(grupo);
        return grupo;
    },

    async deleteGrupo(id) {
        if (supabase) {
            const { error } = await supabase.from('grupos').delete().eq('id', id);
            if (error) throw error;
            return true;
        }
        MOCK_DATA.grupos = MOCK_DATA.grupos.filter(g => g.id !== id);
        return true;
    },

    // ========================================================
    // MAESTROS
    // ========================================================
    async getMaestros(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        if (supabase) {
            const { data, count, error } = await supabase
                .from('maestros')
                .select('*, usuarios!usuario_id(correo)', { count: 'exact' })
                .order('apellido_paterno')
                .range(from, to);
            if (error) throw error;
            return { data: data, total: count, page: page, perPage: perPage };
        }
        var all = MOCK_DATA.maestros;
        return { data: all.slice(from, to + 1), total: all.length, page: page, perPage: perPage };
    },

    async createMaestro(maestro) {
        if (supabase) {
            const { data, error } = await supabase.from('maestros').insert(maestro).select();
            if (error) throw error;
            return data[0];
        }
        maestro.id = Date.now();
        MOCK_DATA.maestros.push(maestro);
        return maestro;
    },

    async deleteMaestro(id) {
        if (supabase) {
            const { error } = await supabase.from('maestros').delete().eq('id', id);
            if (error) throw error;
            return true;
        }
        MOCK_DATA.maestros = MOCK_DATA.maestros.filter(m => m.id !== id);
        return true;
    },

    // ========================================================
    // MATERIAS
    // ========================================================
    async getMaterias(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        if (supabase) {
            const { data, count, error } = await supabase
                .from('materias')
                .select('*, grupos!grupo_id(nombre, catalogo_grados!grado_id(nombre)), maestros!maestro_id(nombre)', { count: 'exact' })
                .order('clave')
                .range(from, to);
            if (error) throw error;
            return { data: data, total: count, page: page, perPage: perPage };
        }
        var all = MOCK_DATA.materias;
        return { data: all.slice(from, to + 1), total: all.length, page: page, perPage: perPage };
    },

    async createMateria(materia) {
        if (supabase) {
            const { data, error } = await supabase.from('materias').insert(materia).select();
            if (error) throw error;
            return data[0];
        }
        materia.id = Date.now();
        MOCK_DATA.materias.push(materia);
        return materia;
    },

    async deleteMateria(id) {
        if (supabase) {
            const { error } = await supabase.from('materias').delete().eq('id', id);
            if (error) throw error;
            return true;
        }
        MOCK_DATA.materias = MOCK_DATA.materias.filter(m => m.id !== id);
        return true;
    },

    // ========================================================
    // CALIFICACIONES
    // ========================================================
    async getCalificaciones(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        if (supabase) {
            const { data, count, error } = await supabase
                .from('calificaciones')
                .select('*, alumnos!alumno_id(numero_control, nombre_completo), materias!materia_id(nombre, clave)', { count: 'exact' })
                .range(from, to);
            if (error) throw error;
            return { data: data, total: count, page: page, perPage: perPage };
        }
        var all = MOCK_DATA.calificaciones;
        return { data: all.slice(from, to + 1), total: all.length, page: page, perPage: perPage };
    },

    async createCalificacion(cal) {
        if (supabase) {
            const { data, error } = await supabase.from('calificaciones').insert(cal).select();
            if (error) throw error;
            return data[0];
        }
        cal.id = Date.now();
        MOCK_DATA.calificaciones.push(cal);
        return cal;
    },

    // ========================================================
    // ASISTENCIAS
    // ========================================================
    async getAsistencias(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        if (supabase) {
            const { data, count, error } = await supabase
                .from('asistencias')
                .select('*, alumnos!alumno_id(numero_control, nombre_completo), materias!materia_id(nombre)', { count: 'exact' })
                .range(from, to);
            if (error) throw error;
            return { data: data, total: count, page: page, perPage: perPage };
        }
        var all = MOCK_DATA.asistencias;
        return { data: all.slice(from, to + 1), total: all.length, page: page, perPage: perPage };
    },

    async createAsistencia(asi) {
        if (supabase) {
            const { data, error } = await supabase.from('asistencias').insert(asi).select();
            if (error) throw error;
            return data[0];
        }
        asi.id = Date.now();
        MOCK_DATA.asistencias.push(asi);
        return asi;
    },

    // ========================================================
    // RIESGO ACADEMICO
    // ========================================================
    async getRiesgos(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        const from = (page - 1) * perPage;
        const to = from + perPage - 1;

        if (supabase) {
            const { data, count, error } = await supabase
                .from('riesgo_academico')
                .select('*, alumnos!alumno_id(numero_control, nombre_completo), materias!materia_id(nombre), catalogo_causas!causa_id(nombre)', { count: 'exact' })
                .order('created_at', { ascending: false })
                .range(from, to);
            if (error) throw error;
            return { data: data, total: count, page: page, perPage: perPage };
        }
        var all = MOCK_DATA.riesgo;
        return { data: all.slice(from, to + 1), total: all.length, page: page, perPage: perPage };
    },

    async createRiesgo(riesgo) {
        if (supabase) {
            const { data, error } = await supabase.from('riesgo_academico').insert(riesgo).select();
            if (error) throw error;
            return data[0];
        }
        riesgo.id = Date.now();
        MOCK_DATA.riesgo.push(riesgo);
        return riesgo;
    },

    // ========================================================
    // SOLICITUDES
    // ========================================================
    async getSolicitudes() {
        if (supabase) {
            const { data, error } = await supabase
                .from('solicitudes_inscripcion')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        }
        return [];
    },

    async createSolicitud(sol) {
        if (supabase) {
            const { data, error } = await supabase.from('solicitudes_inscripcion').insert(sol).select();
            if (error) throw error;
            return data[0];
        }
        sol.id = Date.now();
        sol.estatus = 'pendiente';
        return sol;
    },

    // ========================================================
    // CATALOGOS (para selects)
    // ========================================================
    async getCatalogo(table) {
        if (supabase) {
            const { data, error } = await supabase.from(table).select('*').eq('activo', true).order('nombre');
            if (error) throw error;
            return data;
        }
        // Mock
        if (table === 'catalogo_grados') return MOCK_DATA._grados || [];
        if (table === 'catalogo_causas') return MOCK_DATA._causas || [];
        return [];
    },

    async getGrados() {
        if (supabase) {
            const { data } = await supabase.from('catalogo_grados').select('*').eq('activo', true).order('numero');
            return data || [];
        }
        return [
            { id: 1, nombre: 'I' }, { id: 2, nombre: 'II' }, { id: 3, nombre: 'III' },
            { id: 4, nombre: 'IV' }, { id: 5, nombre: 'V' }, { id: 6, nombre: 'VI' }
        ];
    },

    async getCausas() {
        if (supabase) {
            const { data } = await supabase.from('catalogo_causas').select('*').eq('activo', true);
            return data || [];
        }
        return [
            { id: 1, nombre: 'Reprobacion parcial' }, { id: 2, nombre: 'Bajo rendimiento' },
            { id: 3, nombre: 'Inasistencia' }, { id: 4, nombre: 'Abandono escolar' },
            { id: 5, nombre: 'Baja administrativa' }, { id: 6, nombre: 'Traslado' }
        ];
    },

    // ========================================================
    // HORARIOS
    // ========================================================
    async getCatalogosHorarios() {
        if (supabase) {
            const [maestros, grados, grupos, materias] = await Promise.all([
                supabase.from('maestros').select('id, nombre, apellido_paterno, apellido_materno'),
                supabase.from('catalogo_grados').select('id, nombre'),
                supabase.from('grupos').select('id, nombre, grado_id'),
                supabase.from('materias').select('id, clave, nombre, grupo_id, maestro_id')
            ]);
            return {
                maestros: maestros.data || [],
                grados: grados.data || [],
                grupos: grupos.data || [],
                materias: materias.data || []
            };
        }
        return { maestros: [], grados: [], grupos: [], materias: [] };
    },

    async getHorario(docenteId, grupoId) {
        if (supabase) {
            let query = supabase.from('horarios_docentes').select('*');
            if (docenteId) query = query.eq('docente_id', docenteId);
            if (grupoId) query = query.eq('grupo_id', grupoId);
            const { data, error } = await query;
            if (error) throw error;
            return data || [];
        }
        return [];
    },

    async saveHorario(horarios) {
        if (supabase) {
            const { error } = await supabase.from('horarios_docentes').insert(horarios);
            if (error) throw error;
            return true;
        }
        return true;
    },

    async deleteHorario(docenteId, dia, hora) {
        if (supabase) {
            const { error } = await supabase.from('horarios_docentes')
                .delete()
                .eq('docente_id', docenteId)
                .eq('dia', dia)
                .eq('hora_inicio', hora);
            if (error) throw error;
            return true;
        }
        return true;
    },

    async clearHorarios() {
        if (supabase) {
            const { error } = await supabase.from('horarios_docentes').delete().neq('id', 0);
            if (error) throw error;
            return true;
        }
        return true;
    },

    // ========================================================
    // ALUMNO DASHBOARD
    // ========================================================
    async getAlumnoDashboard(alumnoId) {
        if (!supabase) return { alumno: null, calificaciones: [], asistencias: [], materias: [] };

        const [alumno, cal, asi, mat] = await Promise.all([
            supabase.from('alumnos').select('*').eq('id', alumnoId).single(),
            supabase.from('calificaciones').select('*, materias!materia_id(nombre)').eq('alumno_id', alumnoId),
            supabase.from('asistencias').select('*, materias!materia_id(nombre)').eq('alumno_id', alumnoId),
            supabase.from('materias').select('*, maestros!maestro_id(nombre)')
                .in('grupo_id', [alumno.data?.grupo_id])
        ]);

        return {
            alumno: alumno.data,
            calificaciones: cal.data || [],
            asistencias: asi.data || [],
            materias: mat.data || []
        };
    }
};
