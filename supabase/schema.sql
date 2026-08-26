-- ============================================================
-- Portal CBTA 15 - Esquema PostgreSQL para Supabase
-- ============================================================

-- Enums
CREATE TYPE rol_usuario AS ENUM ('administrador', 'maestro');
CREATE TYPE estatus_solicitud AS ENUM ('pendiente', 'aprobada', 'rechazada');
CREATE TYPE estatus_riesgo AS ENUM ('reprobacion', 'abandono');
CREATE TYPE tipo_causa AS ENUM ('reprobacion', 'abandono');
CREATE TYPE dia_semana AS ENUM ('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes');

-- ============================================================
-- Tablas de catalogos
-- ============================================================

CREATE TABLE catalogo_grados (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(60) UNIQUE NOT NULL,
    numero INTEGER DEFAULT 0,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE catalogo_lugares (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(120) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE catalogo_carreras (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(150) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE catalogo_modalidades (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(120) UNIQUE NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE catalogo_causas (
    id BIGSERIAL PRIMARY KEY,
    tipo tipo_causa NOT NULL,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(tipo, nombre)
);

-- ============================================================
-- Usuarios (perfil vinculado a auth.users de Supabase)
-- ============================================================

CREATE TABLE usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    usuario VARCHAR(60) UNIQUE NOT NULL,
    correo VARCHAR(120) UNIQUE NOT NULL,
    nombre_completo VARCHAR(150),
    rol rol_usuario DEFAULT 'maestro',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Tablas de negocio
-- ============================================================

CREATE TABLE grupos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(60) NOT NULL,
    grado_id BIGINT REFERENCES catalogo_grados(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(nombre, grado_id)
);

CREATE TABLE alumnos (
    id BIGSERIAL PRIMARY KEY,
    numero_control VARCHAR(30) UNIQUE,
    nombre_completo VARCHAR(250),
    apellido_paterno VARCHAR(80),
    apellido_materno VARCHAR(80),
    sexo VARCHAR(1),
    fecha_nacimiento DATE,
    lugar VARCHAR(120),
    carrera VARCHAR(150),
    modalidad VARCHAR(120),
    generacion VARCHAR(30),
    grado_id BIGINT REFERENCES catalogo_grados(id),
    grupo_id BIGINT REFERENCES grupos(id),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE maestros (
    id BIGSERIAL PRIMARY KEY,
    numero_empleado VARCHAR(30) UNIQUE NOT NULL,
    nombre VARCHAR(150),
    apellido_paterno VARCHAR(80),
    apellido_materno VARCHAR(80),
    especialidad VARCHAR(150),
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE materias (
    id BIGSERIAL PRIMARY KEY,
    clave VARCHAR(30),
    nombre VARCHAR(150),
    grupo_id BIGINT REFERENCES grupos(id),
    grado_id BIGINT REFERENCES catalogo_grados(id),
    maestro_id BIGINT REFERENCES maestros(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE calificaciones (
    id BIGSERIAL PRIMARY KEY,
    alumno_id BIGINT REFERENCES alumnos(id) ON DELETE CASCADE,
    materia_id BIGINT REFERENCES materias(id) ON DELETE CASCADE,
    parcial_1 DECIMAL(5,2) DEFAULT 0,
    parcial_2 DECIMAL(5,2) DEFAULT 0,
    parcial_3 DECIMAL(5,2) DEFAULT 0,
    promedio DECIMAL(5,2) DEFAULT 0,
    UNIQUE(alumno_id, materia_id)
);

CREATE TABLE asistencias (
    id BIGSERIAL PRIMARY KEY,
    alumno_id BIGINT REFERENCES alumnos(id) ON DELETE CASCADE,
    materia_id BIGINT REFERENCES materias(id) ON DELETE CASCADE,
    parcial VARCHAR(1) NOT NULL,
    total_sesiones INTEGER DEFAULT 0,
    asistencias INTEGER DEFAULT 0,
    faltas INTEGER DEFAULT 0,
    porcentaje DECIMAL(5,2) DEFAULT 0,
    cumple BOOLEAN DEFAULT false,
    UNIQUE(alumno_id, materia_id, parcial)
);

CREATE TABLE riesgo_academico (
    id BIGSERIAL PRIMARY KEY,
    alumno_id BIGINT REFERENCES alumnos(id) ON DELETE CASCADE,
    materia_id BIGINT REFERENCES materias(id) ON DELETE SET NULL,
    causa_id BIGINT REFERENCES catalogo_causas(id),
    estatus VARCHAR(20),
    detalle TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE solicitudes_inscripcion (
    id BIGSERIAL PRIMARY KEY,
    nombre_completo VARCHAR(250),
    correo VARCHAR(150),
    telefono VARCHAR(20),
    direccion TEXT,
    ciclo_escolar VARCHAR(30),
    turno_preferente VARCHAR(20),
    estatus estatus_solicitud DEFAULT 'pendiente',
    observaciones TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Horarios
-- ============================================================

CREATE TABLE horarios_docentes (
    id BIGSERIAL PRIMARY KEY,
    docente_id BIGINT REFERENCES maestros(id) ON DELETE CASCADE,
    dia dia_semana NOT NULL,
    hora_inicio VARCHAR(10) NOT NULL,
    hora_fin VARCHAR(10),
    materia_id BIGINT REFERENCES materias(id) ON DELETE CASCADE,
    grupo_id BIGINT REFERENCES grupos(id) ON DELETE CASCADE,
    salon VARCHAR(60),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE parametros_sistema (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS - Deshabilitado para desarrollo (activar en produccion)
-- ============================================================

ALTER TABLE catalogo_grados ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogo_lugares ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogo_carreras ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogo_modalidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalogo_causas ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE maestros ENABLE ROW LEVEL SECURITY;
ALTER TABLE materias ENABLE ROW LEVEL SECURITY;
ALTER TABLE calificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE riesgo_academico ENABLE ROW LEVEL SECURITY;
ALTER TABLE solicitudes_inscripcion ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios_docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE parametros_sistema ENABLE ROW LEVEL SECURITY;

-- Politicas permisivas para desarrollo
CREATE POLICY "dev_all" ON catalogo_grados FOR ALL USING (true);
CREATE POLICY "dev_all" ON catalogo_lugares FOR ALL USING (true);
CREATE POLICY "dev_all" ON catalogo_carreras FOR ALL USING (true);
CREATE POLICY "dev_all" ON catalogo_modalidades FOR ALL USING (true);
CREATE POLICY "dev_all" ON catalogo_causas FOR ALL USING (true);
CREATE POLICY "dev_all" ON usuarios FOR ALL USING (true);
CREATE POLICY "dev_all" ON grupos FOR ALL USING (true);
CREATE POLICY "dev_all" ON alumnos FOR ALL USING (true);
CREATE POLICY "dev_all" ON maestros FOR ALL USING (true);
CREATE POLICY "dev_all" ON materias FOR ALL USING (true);
CREATE POLICY "dev_all" ON calificaciones FOR ALL USING (true);
CREATE POLICY "dev_all" ON asistencias FOR ALL USING (true);
CREATE POLICY "dev_all" ON riesgo_academico FOR ALL USING (true);
CREATE POLICY "dev_all" ON solicitudes_inscripcion FOR ALL USING (true);
CREATE POLICY "dev_all" ON horarios_docentes FOR ALL USING (true);
CREATE POLICY "dev_all" ON parametros_sistema FOR ALL USING (true);
