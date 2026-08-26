/* ============================================================
   HORARIOS - Algoritmo de generacion automatica
   Portado de HorarioController::generar() (PHP -> JS)
   ============================================================ */

var HorariosEngine = {
    DIAS: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'],
    HORAS: ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'],

    shuffle: function(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
        }
        return a;
    },

    generar: function(materias, maestros, maxDia, maxSem, dias) {
        maxDia = maxDia || 6;
        maxSem = maxSem || 30;
        dias = dias || this.DIAS.slice();

        var sinMaestro = 0, sinGrupo = 0;
        var totalMaterias = 0;

        var validMaterias = materias.filter(function(m) {
            if (!m.maestro_id) { sinMaestro++; return false; }
            if (!m.grupo_id) { sinGrupo++; return false; }
            return true;
        });
        totalMaterias = validMaterias.length;

        if (totalMaterias === 0) {
            return { success: true, total: 0, asignadas: 0, sinAsignar: [], sinMaestro: sinMaestro, sinGrupo: sinGrupo, items: [] };
        }

        var best = null;

        for (var attempt = 0; attempt < 40; attempt++) {
            var shuffled = this.shuffle(validMaterias);
            var teacherBusy = {};
            var groupBusy = {};
            var teacherDayCount = {};
            var teacherTotal = {};
            var items = [];
            var sinAsignar = [];

            for (var mi = 0; mi < shuffled.length; mi++) {
                var mat = shuffled[mi];
                var tId = String(mat.maestro_id);
                var gId = String(mat.grupo_id);

                var maxD = maxDia;
                var maxS = maxSem;
                var days = dias;

                var placed = false;
                var orderDias = this.shuffle(dias);

                for (var di = 0; di < orderDias.length; di++) {
                    var dia = orderDias[di];
                    if ((teacherDayCount[tId] && teacherDayCount[tId][dia] || 0) >= maxD) continue;
                    if ((teacherTotal[tId] || 0) >= maxS) break;

                    var horas = this.shuffle(this.HORAS);
                    for (var hi = 0; hi < horas.length; hi++) {
                        var hora = horas[hi];
                        if (teacherBusy[tId] && teacherBusy[tId][dia] && teacherBusy[tId][dia][hora]) continue;
                        if (groupBusy[gId] && groupBusy[gId][dia] && groupBusy[gId][dia][hora]) continue;

                        var horaFin = this.HORAS[this.HORAS.indexOf(hora) + 1] || '17:00';
                        items.push({
                            docente_id: parseInt(tId),
                            dia: dia,
                            hora_inicio: hora,
                            hora_fin: horaFin,
                            materia_id: mat.id,
                            grupo_id: parseInt(gId),
                            salon: null
                        });

                        if (!teacherBusy[tId]) teacherBusy[tId] = {};
                        if (!teacherBusy[tId][dia]) teacherBusy[tId][dia] = {};
                        teacherBusy[tId][dia][hora] = true;

                        if (!groupBusy[gId]) groupBusy[gId] = {};
                        if (!groupBusy[gId][dia]) groupBusy[gId][dia] = {};
                        groupBusy[gId][dia][hora] = true;

                        if (!teacherDayCount[tId]) teacherDayCount[tId] = {};
                        teacherDayCount[tId][dia] = (teacherDayCount[tId][dia] || 0) + 1;
                        teacherTotal[tId] = (teacherTotal[tId] || 0) + 1;
                        placed = true;
                        break;
                    }
                    if (placed) break;
                }

                if (!placed) {
                    sinAsignar.push({
                        clave: mat.clave || '',
                        materia: mat.nombre || mat.materia_nombre || '',
                        maestro: mat.maestro_nombre || '',
                        grupo: mat.grado_nombre ? mat.grado_nombre + ' ' + (mat.grupo_nombre || '') : (mat.grupo_nombre || '-')
                    });
                }
            }

            if (best === null || items.length > best.items.length) {
                best = { items: items, sinAsignar: sinAsignar };
            }
            if (best.items.length === totalMaterias) break;
        }

        return {
            success: true,
            total: totalMaterias,
            asignadas: best.items.length,
            sinAsignar: best.sinAsignar,
            sinMaestro: sinMaestro,
            sinGrupo: sinGrupo,
            items: best.items
        };
    }
};

/* ============================================================
   PDF - Generacion client-side con jsPDF
   Replica el template de horarios/pdf.blade.php
   ============================================================ */

var HorariosPDF = {
    generar: function(docente, horarios, periodo) {
        if (typeof jspdf === 'undefined' && typeof window.jspdf === 'undefined') {
            alert('jsPDF no esta cargado. Agrega: <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js"></script>');
            return;
        }

        var jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jspdf;
        var doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'letter' });

        var pageW = 215.9;
        var pageH = 279.4;
        var margin = 9;
        var contentW = pageW - margin * 2;

        var x = margin;
        var y = margin;

        // Header - SEP logo (left)
        try {
            doc.addImage('img/horario/logo-sep.jpg', 'JPEG', x, y, 25, 16);
        } catch(e) {}
        x += 28;

        // Title
        doc.setFontSize(7);
        doc.setFont('helvetica', 'bold');
        doc.text('DIRECCION GENERAL DE EDUCACION TECNOLOGICA AGROPECUARIA', x, y + 5, { align: 'center' });
        doc.text('Y CIENCIAS DEL MAR', x, y + 9, { align: 'center' });
        doc.text('CENTRO DE BACHILLERATO TECNOLOGICO AGROPECUARIO NO. 15', x, y + 13, { align: 'center' });
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.text('HORARIO DE CLASES SEMESTRAL', x, y + 18, { align: 'center' });
        doc.text(periodo, x, y + 22, { align: 'center' });

        x = pageW - margin - 18;
        try {
            doc.addImage('img/horario/logo-escudo.jpg', 'JPEG', x, y, 18, 16);
        } catch(e) {}

        y += 30;

        // Docente
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('DOCENTE: ', margin, y);
        doc.setFont('helvetica', 'normal');
        doc.text(docente.toUpperCase(), margin + 20, y);
        y += 5;

        // Table
        var DIAS_MAP = { 'Lun': 'LUNES', 'Mar': 'MARTES', 'Mie': 'MIERCOLES', 'Jue': 'JUEVES', 'Vie': 'VIERNES' };
        var HORAS = ['07:00','08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00'];
        var DIAS_KEYS = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];

        var colHora = 20;
        var colDia = (contentW - colHora - 15) / 5;
        var colTotal = 15;
        var rowH = 12;

        // Header row
        doc.setFillColor(112, 112, 112);
        doc.rect(x, y, contentW, 7, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(6);
        doc.setFont('helvetica', 'bold');

        var cx = x;
        doc.text('HORA', cx + colHora / 2, y + 5, { align: 'center' });
        cx += colHora;

        for (var d = 0; d < DIAS_KEYS.length; d++) {
            var diaCount = horarios.filter(function(h) { return h.dia === DIAS_KEYS[d]; }).length;
            var label = DIAS_MAP[DIAS_KEYS[d]];
            if (diaCount > 0) label += ' (' + diaCount + ')';
            doc.text(label, cx + colDia / 2, y + 5, { align: 'center' });
            cx += colDia;
        }
        doc.text('TOTAL', cx + colTotal / 2, y + 5, { align: 'center' });
        y += 7;

        // Data rows
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(5.5);

        for (var hi = 0; hi < HORAS.length; hi++) {
            var hora = HORAS[hi];
            var horaFin = HORAS[hi + 1] || '17:00';

            doc.setFillColor(239, 239, 239);
            doc.rect(x, y, colHora, rowH, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5.5);
            doc.text(hora + ' - ' + horaFin, x + colHora / 2, y + rowH / 2 + 1, { align: 'center' });

            cx = x + colHora;
            doc.setFont('helvetica', 'normal');

            for (var d = 0; d < DIAS_KEYS.length; d++) {
                doc.setDrawColor(200, 200, 200);
                doc.rect(cx, y, colDia, rowH, 'D');

                var clase = horarios.find(function(h) { return h.dia === DIAS_KEYS[d] && h.hora_inicio === hora; });
                if (clase) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(5);
                    doc.text(clase.materia_nombre || 'Materia', cx + colDia / 2, y + 4, { align: 'center' });
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(4.5);
                    doc.text(clase.grupo_nombre || '', cx + colDia / 2, y + 8, { align: 'center' });
                }
                cx += colDia;
            }

            // Total column
            doc.setDrawColor(200, 200, 200);
            doc.rect(cx, y, colTotal, rowH, 'D');

            y += rowH;
        }

        // Summary row
        doc.setFillColor(239, 239, 239);
        doc.rect(x, y, contentW, 7, 'FD');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.text('TOTAL HORAS/SEMANA', x + 5, y + 5);
        doc.text(String(horarios.length), x + contentW - 5, y + 5, { align: 'right' });
        y += 12;

        // Signatures
        var firmas = ['DOCENTE', 'JEFE DE DOCENCIA', 'SUBDIRECTOR ACADEMICO', 'DIRECTOR', 'SELLO'];
        var firmaW = contentW / firmas.length;

        for (var f = 0; f < firmas.length; f++) {
            var fx = x + f * firmaW + firmaW / 2;
            doc.setDrawColor(0, 0, 0);
            doc.line(fx - 12, y + 20, fx + 12, y + 20);
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(5);
            doc.text(firmas[f], fx, y + 24, { align: 'center' });
        }

        doc.save('horario_docente_' + docente.replace(/\s+/g, '_') + '.pdf');
    }
};
