-- ============================================================
-- Portal CBTA 15 - Datos iniciales para Supabase
-- ============================================================

-- Catalogos
INSERT INTO catalogo_grados (nombre, numero, descripcion) VALUES
('I', 1, 'Primer grado'), ('II', 2, 'Segundo grado'), ('III', 3, 'Tercer grado'),
('IV', 4, 'Cuarto grado'), ('V', 5, 'Quinto grado'), ('VI', 6, 'Sexto grado'),
('EGRESADO', 7, 'Egresado');

INSERT INTO catalogo_lugares (nombre) VALUES
('BOLONCHEN'), ('KESTE'), ('SEDE');

INSERT INTO catalogo_carreras (nombre) VALUES
('TECNICO AGROPECUARIO'), ('COMPONENTE BASICO Y PROPEDEUTICO'),
('TECNICO AGROPECUARIO (2023)'), ('TECNICO EN ADMINISTRACION DE RECURSOS HUMANOS 2022');

INSERT INTO catalogo_modalidades (nombre) VALUES
('ESCOLARIZADA'), ('AUTOPLANEADA');

INSERT INTO catalogo_causas (tipo, nombre, descripcion) VALUES
('reprobacion', 'Reprobacion parcial', 'Alumno reprobo un parcial'),
('reprobacion', 'Bajo rendimiento', 'Promedio general bajo'),
('reprobacion', 'Inasistencia', 'Falta asistencia repetidamente'),
('abandono', 'Abandono escolar', 'Alumno dejo de asistir'),
('abandono', 'Baja administrativa', 'Baja por decision administrativa'),
('abandono', 'Traslado', 'Alumno se traslado a otro plantel');

-- Grupos (6 grados x 4 grupos = 24)
INSERT INTO grupos (nombre, grado_id)
SELECT g.grupo_nombre, cg.id
FROM (SELECT 'A' AS grupo_nombre UNION SELECT 'B' UNION SELECT 'C' UNION SELECT 'D') g
CROSS JOIN catalogo_grados cg
WHERE cg.numero <= 6;

-- Maestros de prueba
INSERT INTO maestros (numero_empleado, nombre, apellido_paterno, apellido_materno, especialidad) VALUES
('T001', 'Fernando', 'Sohl', 'Tun', 'Matematicas'),
('T002', 'Ana Luisa', 'Pech', 'Cu', 'Espanol'),
('T003', 'Carlos', 'Romero', 'Diaz', 'Quimica'),
('T004', 'Maria del Carmen', 'Itza', '', 'Biologia'),
('T005', 'Javier', 'Tzab', 'Cauich', 'Fisica'),
('T006', 'Rosa Elena', 'Puc', '', 'Historia');

-- Materias de prueba (10)
INSERT INTO materias (clave, nombre, grupo_id, grado_id, maestro_id) VALUES
('MAT-001', 'Matematicas I',
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='I')),
    (SELECT id FROM catalogo_grados WHERE nombre='I'),
    (SELECT id FROM maestros WHERE numero_empleado='T001')),
('ESP-001', 'Espanol I',
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='I')),
    (SELECT id FROM catalogo_grados WHERE nombre='I'),
    (SELECT id FROM maestros WHERE numero_empleado='T002')),
('QUI-001', 'Quimica General',
    (SELECT id FROM grupos WHERE nombre='B' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='I')),
    (SELECT id FROM catalogo_grados WHERE nombre='I'),
    (SELECT id FROM maestros WHERE numero_empleado='T003')),
('BIO-001', 'Biologia I',
    (SELECT id FROM grupos WHERE nombre='B' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='I')),
    (SELECT id FROM catalogo_grados WHERE nombre='I'),
    (SELECT id FROM maestros WHERE numero_empleado='T004')),
('FIS-001', 'Fisica I',
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='II')),
    (SELECT id FROM catalogo_grados WHERE nombre='II'),
    (SELECT id FROM maestros WHERE numero_empleado='T005')),
('HIS-001', 'Historia de Mexico',
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='II')),
    (SELECT id FROM catalogo_grados WHERE nombre='II'),
    (SELECT id FROM maestros WHERE numero_empleado='T006')),
('MAT-002', 'Matematicas II',
    (SELECT id FROM grupos WHERE nombre='C' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='II')),
    (SELECT id FROM catalogo_grados WHERE nombre='II'),
    (SELECT id FROM maestros WHERE numero_empleado='T001')),
('ESP-002', 'Espanol II',
    (SELECT id FROM grupos WHERE nombre='C' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='II')),
    (SELECT id FROM catalogo_grados WHERE nombre='II'),
    (SELECT id FROM maestros WHERE numero_empleado='T002')),
('AGRO-001', 'Agropecuaria I',
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='III')),
    (SELECT id FROM catalogo_grados WHERE nombre='III'),
    (SELECT id FROM maestros WHERE numero_empleado='T004')),
('ADM-001', 'Administracion I',
    (SELECT id FROM grupos WHERE nombre='B' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='III')),
    (SELECT id FROM catalogo_grados WHERE nombre='III'),
    (SELECT id FROM maestros WHERE numero_empleado='T006'));

-- Alumnos de prueba (12)
INSERT INTO alumnos (numero_control, nombre_completo, apellido_paterno, apellido_materno, sexo, fecha_nacimiento, lugar, generacion, modalidad, grado_id, grupo_id) VALUES
('A001', 'Maria Lopez Garcia', 'Lopez', 'Garcia', 'M', '2008-03-15', 'BOLONCHEN', '2025-2028', 'ESCOLARIZADA',
    (SELECT id FROM catalogo_grados WHERE nombre='I'),
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='I'))),
('A002', 'Juan Perez Tun', 'Perez', 'Tun', 'H', '2008-07-22', 'KESTE', '2025-2028', 'ESCOLARIZADA',
    (SELECT id FROM catalogo_grados WHERE nombre='I'),
    (SELECT id FROM grupos WHERE nombre='B' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='I'))),
('A003', 'Ana Cuevas Brito', 'Cuevas', 'Brito', 'M', '2007-11-10', 'SEDE', '2024-2027', 'AUTOPLANEADA',
    (SELECT id FROM catalogo_grados WHERE nombre='II'),
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='II'))),
('A004', 'Carlos Mendez Torres', 'Mendez', 'Torres', 'H', '2007-05-03', 'BOLONCHEN', '2024-2027', 'ESCOLARIZADA',
    (SELECT id FROM catalogo_grados WHERE nombre='II'),
    (SELECT id FROM grupos WHERE nombre='C' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='II'))),
('A005', 'Laura Ik Balam', 'Ik', 'Balam', 'M', '2006-09-18', 'KESTE', '2023-2026', 'ESCOLARIZADA',
    (SELECT id FROM catalogo_grados WHERE nombre='III'),
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='III'))),
('A006', 'Pedro Uicab Diaz', 'Uicab', 'Diaz', 'H', '2006-02-28', 'SEDE', '2023-2026', 'AUTOPLANEADA',
    (SELECT id FROM catalogo_grados WHERE nombre='III'),
    (SELECT id FROM grupos WHERE nombre='B' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='III'))),
('A007', 'Sofia Chi Perez', 'Chi', 'Perez', 'M', '2005-12-05', 'BOLONCHEN', '2022-2025', 'ESCOLARIZADA',
    (SELECT id FROM catalogo_grados WHERE nombre='IV'),
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='IV'))),
('A008', 'Miguel Tuz Ha', 'Tuz', 'Ha', 'H', '2005-06-14', 'KESTE', '2022-2025', 'ESCOLARIZADA',
    (SELECT id FROM catalogo_grados WHERE nombre='IV'),
    (SELECT id FROM grupos WHERE nombre='D' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='IV'))),
('A009', 'Valentina Rosado', 'Rosado', '', 'M', '2004-08-20', 'SEDE', '2021-2024', 'AUTOPLANEADA',
    (SELECT id FROM catalogo_grados WHERE nombre='V'),
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='V'))),
('A010', 'Diego Puc Caamal', 'Puc', 'Caamal', 'H', '2004-01-30', 'BOLONCHEN', '2021-2024', 'ESCOLARIZADA',
    (SELECT id FROM catalogo_grados WHERE nombre='V'),
    (SELECT id FROM grupos WHERE nombre='C' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='V'))),
('A011', 'Camila Tun Pech', 'Tun', 'Pech', 'M', '2003-04-12', 'KESTE', '2020-2023', 'ESCOLARIZADA',
    (SELECT id FROM catalogo_grados WHERE nombre='VI'),
    (SELECT id FROM grupos WHERE nombre='A' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='VI'))),
('A012', 'Roberto Hau Cux', 'Hau', 'Cux', 'H', '2003-10-25', 'SEDE', '2020-2023', 'AUTOPLANEADA',
    (SELECT id FROM catalogo_grados WHERE nombre='VI'),
    (SELECT id FROM grupos WHERE nombre='B' AND grado_id=(SELECT id FROM catalogo_grados WHERE nombre='VI')));

-- Parametros del sistema
INSERT INTO parametros_sistema (clave, valor) VALUES
('SEMESTRE_ACTUAL', '2025-2'),
('MAX_FALTAS_PERMITIDAS', '5'),
('MIN_PROMEDIO_APROBACION', '70');
