// ============================================================
// Inventario Escolar CBTA 15 - CRUD Operations
// ============================================================

var InvDB = {
    // ========================================================
    // BIENES
    // ========================================================
    async getBienes(page, perPage, filters) {
        page = page || 1;
        perPage = perPage || 25;
        var from = (page - 1) * perPage;
        var to = from + perPage - 1;

        if (invClient) {
            var query = invClient.from('inv_bienes')
                .select('*, inv_areas!id_area(nombre_area), inv_personal!id_personal(nombre, apellido_paterno, apellido_materno), inv_marcas!id_marca(nombre_marca)', { count: 'exact' })
                .eq('eliminado', false)
                .order('id', { ascending: false })
                .range(from, to);

            if (filters) {
                if (filters.search) {
                    query = query.or('nombre_bien.ilike.%' + filters.search + '%,no_inventario.ilike.%' + filters.search + '%,serie.ilike.%' + filters.search + '%,codigo_barras.ilike.%' + filters.search + '%');
                }
                if (filters.estatus) query = query.eq('estatus', filters.estatus);
                if (filters.area) query = query.eq('id_area', filters.area);
            }

            var result = await query;
            if (result.error) throw result.error;
            return { data: result.data || [], total: result.count || 0, page: page, perPage: perPage };
        }
        return { data: [], total: 0, page: page, perPage: perPage };
    },

    async getBienesEliminados(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        var from = (page - 1) * perPage;
        var to = from + perPage - 1;

        if (invClient) {
            var result = await invClient.from('inv_bienes')
                .select('*, inv_areas!id_area(nombre_area), inv_personal!id_personal(nombre, apellido_paterno)', { count: 'exact' })
                .eq('eliminado', true)
                .order('id', { ascending: false })
                .range(from, to);
            if (result.error) throw result.error;
            return { data: result.data || [], total: result.count || 0 };
        }
        return { data: [], total: 0 };
    },

    async getBien(id) {
        if (invClient) {
            var result = await invClient.from('inv_bienes')
                .select('*, inv_areas!id_area(nombre_area), inv_personal!id_personal(nombre, apellido_paterno, apellido_materno), inv_marcas!id_marca(nombre_marca)')
                .eq('id', id)
                .single();
            if (result.error) throw result.error;
            return result.data;
        }
        return null;
    },

    async createBien(bien) {
        if (invClient) {
            var result = await invClient.from('inv_bienes').insert(bien).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    async updateBien(id, updates) {
        if (invClient) {
            var result = await invClient.from('inv_bienes').update(updates).eq('id', id).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    async softDeleteBien(id) {
        if (invClient) {
            var result = await invClient.from('inv_bienes').update({ eliminado: true }).eq('id', id);
            if (result.error) throw result.error;
            return true;
        }
        return false;
    },

    async restoreBien(id) {
        if (invClient) {
            var result = await invClient.from('inv_bienes').update({ eliminado: false }).eq('id', id);
            if (result.error) throw result.error;
            return true;
        }
        return false;
    },

    async forceDeleteBien(id) {
        if (invClient) {
            var result = await invClient.from('inv_bienes').delete().eq('id', id);
            if (result.error) throw result.error;
            return true;
        }
        return false;
    },

    async deleteAllBienes() {
        if (invClient) {
            var result = await invClient.from('inv_bienes').update({ eliminado: true }).neq('id', 0);
            if (result.error) throw result.error;
            return true;
        }
        return false;
    },

    async getNextInventario() {
        if (invClient) {
            var result = await invClient.from('inv_bienes')
                .select('no_inventario')
                .order('id', { ascending: false })
                .limit(1);
            if (result.error) throw result.error;
            var last = result.data && result.data[0] ? result.data[0].no_inventario : 'INV-00000';
            var num = parseInt(last.replace('INV-', '')) + 1;
            return 'INV-' + String(num).padStart(5, '0');
        }
        return 'INV-00001';
    },

    // ========================================================
    // PERSONAL
    // ========================================================
    async getPersonal(page, perPage, search) {
        page = page || 1;
        perPage = perPage || 100;
        var from = (page - 1) * perPage;
        var to = from + perPage - 1;

        if (invClient) {
            var query = invClient.from('inv_personal')
                .select('*, inv_areas!id_area(nombre_area)', { count: 'exact' })
                .order('apellido_paterno')
                .range(from, to);
            if (search) {
                query = query.or('nombre.ilike.%' + search + '%,apellido_paterno.ilike.%' + search + '%,apellido_materno.ilike.%' + search + '%');
            }
            var result = await query;
            if (result.error) throw result.error;
            return { data: result.data || [], total: result.count || 0 };
        }
        return { data: [], total: 0 };
    },

    async createPersonal(data) {
        if (invClient) {
            var result = await invClient.from('inv_personal').insert(data).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    async updatePersonal(id, data) {
        if (invClient) {
            var result = await invClient.from('inv_personal').update(data).eq('id', id).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    async deletePersonal(id) {
        if (invClient) {
            var result = await invClient.from('inv_personal').delete().eq('id', id);
            if (result.error) throw result.error;
            return true;
        }
        return false;
    },

    // ========================================================
    // AREAS
    // ========================================================
    async getAreas(page, perPage, search) {
        page = page || 1;
        perPage = perPage || 100;
        var from = (page - 1) * perPage;
        var to = from + perPage - 1;

        if (invClient) {
            var query = invClient.from('inv_areas')
                .select('*', { count: 'exact' })
                .order('nombre_area')
                .range(from, to);
            if (search) {
                query = query.ilike('nombre_area', '%' + search + '%');
            }
            var result = await query;
            if (result.error) throw result.error;
            return { data: result.data || [], total: result.count || 0 };
        }
        return { data: [], total: 0 };
    },

    async createArea(data) {
        if (invClient) {
            var result = await invClient.from('inv_areas').insert(data).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    async updateArea(id, data) {
        if (invClient) {
            var result = await invClient.from('inv_areas').update(data).eq('id', id).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    async deleteArea(id) {
        if (invClient) {
            var result = await invClient.from('inv_areas').delete().eq('id', id);
            if (result.error) throw result.error;
            return true;
        }
        return false;
    },

    // ========================================================
    // MARCAS
    // ========================================================
    async getMarcas() {
        if (invClient) {
            var result = await invClient.from('inv_marcas').select('*').order('nombre_marca');
            if (result.error) throw result.error;
            return result.data || [];
        }
        return [];
    },

    async createMarca(data) {
        if (invClient) {
            var result = await invClient.from('inv_marcas').insert(data).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    // ========================================================
    // HISTORIAL
    // ========================================================
    async getHistorial(page, perPage, filters) {
        page = page || 1;
        perPage = perPage || 25;
        var from = (page - 1) * perPage;
        var to = from + perPage - 1;

        if (invClient) {
            var query = invClient.from('inv_historial')
                .select('*, inv_bienes!id_bien(no_inventario, nombre_bien), personal_anterior:inv_personal!id_personal_anterior(nombre, apellido_paterno), personal_nuevo:inv_personal!id_personal_nuevo(nombre, apellido_paterno), area_anterior:inv_areas!id_area_anterior(nombre_area), area_nueva:inv_areas!id_area_nueva(nombre_area)', { count: 'exact' })
                .order('fecha_movimiento', { ascending: false })
                .range(from, to);

            if (filters) {
                if (filters.tipo) query = query.eq('tipo_movimiento', filters.tipo);
                if (filters.fechaInicio) query = query.gte('fecha_movimiento', filters.fechaInicio);
                if (filters.fechaFin) query = query.lte('fecha_movimiento', filters.fechaFin + 'T23:59:59');
            }

            var result = await query;
            if (result.error) throw result.error;
            return { data: result.data || [], total: result.count || 0 };
        }
        return { data: [], total: 0 };
    },

    async createHistorial(data) {
        if (invClient) {
            var result = await invClient.from('inv_historial').insert(data).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    // ========================================================
    // ASIGNACIONES
    // ========================================================
    async getAsignaciones(page, perPage, search) {
        page = page || 1;
        perPage = perPage || 25;
        var from = (page - 1) * perPage;
        var to = from + perPage - 1;

        if (invClient) {
            var query = invClient.from('inv_bienes')
                .select('*, inv_areas!id_area(nombre_area), inv_personal!id_personal(nombre, apellido_paterno, apellido_materno)', { count: 'exact' })
                .eq('eliminado', false)
                .order('no_inventario')
                .range(from, to);
            if (search) {
                query = query.or('nombre_bien.ilike.%' + search + '%,no_inventario.ilike.%' + search + '%');
            }
            var result = await query;
            if (result.error) throw result.error;
            return { data: result.data || [], total: result.count || 0 };
        }
        return { data: [], total: 0 };
    },

    async asignarBien(bienId, tipoMovimiento, nuevaArea, nuevoPersonal, observaciones) {
        if (!invClient) return false;

        var bien = await this.getBien(bienId);
        if (!bien) return false;

        var updates = {};
        if (nuevaArea) updates.id_area = nuevaArea;
        if (nuevoPersonal) updates.id_personal = nuevoPersonal;
        updates.estatus = nuevoPersonal ? 'Asignado' : 'Disponible';

        await this.updateBien(bienId, updates);

        await this.createHistorial({
            id_bien: bienId,
            id_personal_anterior: bien.id_personal,
            id_personal_nuevo: nuevoPersonal || null,
            id_area_anterior: bien.id_area,
            id_area_nueva: nuevaArea || null,
            tipo_movimiento: tipoMovimiento,
            observaciones: observaciones
        });

        return true;
    },

    // ========================================================
    // PENDIENTES
    // ========================================================
    async getPendientes(page, perPage) {
        page = page || 1;
        perPage = perPage || 25;
        var from = (page - 1) * perPage;
        var to = from + perPage - 1;

        if (invClient) {
            var result = await invClient.from('inv_bienes')
                .select('*, inv_areas!id_area(nombre_area), inv_personal!id_personal(nombre, apellido_paterno)', { count: 'exact' })
                .eq('eliminado', false)
                .in('estatus', ['Pendiente', 'En revision', 'En mantenimiento', 'Danado'])
                .order('estatus')
                .range(from, to);
            if (result.error) throw result.error;
            return { data: result.data || [], total: result.count || 0 };
        }
        return { data: [], total: 0 };
    },

    // ========================================================
    // DASHBOARD
    // ========================================================
    async getDashboardStats() {
        if (!invClient) return { total: 0, asignados: 0, disponibles: 0, pendientes: 0, baja: 0, personal: 0, areas: 0, historial: [] };

        var [total, asignados, disponibles, pendientes, baja, personalCount, areasCount, historial] = await Promise.all([
            invClient.from('inv_bienes').select('*', { count: 'exact', head: true }).eq('eliminado', false),
            invClient.from('inv_bienes').select('*', { count: 'exact', head: true }).eq('eliminado', false).eq('estatus', 'Asignado'),
            invClient.from('inv_bienes').select('*', { count: 'exact', head: true }).eq('eliminado', false).eq('estatus', 'Disponible'),
            invClient.from('inv_bienes').select('*', { count: 'exact', head: true }).eq('eliminado', false).in('estatus', ['Pendiente', 'En revision', 'En mantenimiento', 'Danado']),
            invClient.from('inv_bienes').select('*', { count: 'exact', head: true }).eq('eliminado', false).eq('estatus', 'Baja'),
            invClient.from('inv_personal').select('*', { count: 'exact', head: true }),
            invClient.from('inv_areas').select('*', { count: 'exact', head: true }),
            invClient.from('inv_historial').select('*, inv_bienes!id_bien(no_inventario, nombre_bien), inv_personal!id_personal_nuevo(nombre, apellido_paterno)').order('fecha_movimiento', { ascending: false }).limit(8)
        ]);

        return {
            total: total.count || 0,
            asignados: asignados.count || 0,
            disponibles: disponibles.count || 0,
            pendientes: pendientes.count || 0,
            baja: baja.count || 0,
            personal: personalCount.count || 0,
            areas: areasCount.count || 0,
            historial: historial.data || []
        };
    },

    // ========================================================
    // USUARIOS
    // ========================================================
    async getUsuarios() {
        if (invClient) {
            var result = await invClient.from('inv_usuarios').select('*').order('nombre');
            if (result.error) throw result.error;
            return result.data || [];
        }
        return [];
    },

    async deleteUsuario(id) {
        if (invClient) {
            var result = await invClient.from('inv_usuarios').delete().eq('id', id);
            if (result.error) throw result.error;
            return true;
        }
        return false;
    },

    async createUsuario(data) {
        if (invClient) {
            var result = await invClient.from('inv_usuarios').insert(data).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    },

    async updateUsuario(id, data) {
        if (invClient) {
            var result = await invClient.from('inv_usuarios').update(data).eq('id', id).select();
            if (result.error) throw result.error;
            return result.data[0];
        }
        return null;
    }
};
