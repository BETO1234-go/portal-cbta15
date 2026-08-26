-- ============================================================
-- Inventario Escolar CBTA 15 - Schema Supabase
-- ============================================================

-- Enums
CREATE TYPE estatus_bien AS ENUM ('Disponible', 'Asignado', 'Pendiente', 'Baja', 'En revision', 'En mantenimiento', 'Danado');
CREATE TYPE tipo_movimiento AS ENUM ('Asignacion', 'Transferencia', 'Devolucion', 'Reasignacion', 'Cambio de area', 'Resolucion');
CREATE TYPE rol_usuario_inv AS ENUM ('admin', 'visualizador');

-- ============================================================
-- Tablas
-- ============================================================

CREATE TABLE inv_areas (
    id BIGSERIAL PRIMARY KEY,
    nombre_area VARCHAR(150) NOT NULL,
    descripcion TEXT,
    estatus VARCHAR(30) DEFAULT 'Activa',
    fecha_registro TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inv_personal (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(100) NOT NULL,
    apellido_materno VARCHAR(100),
    puesto VARCHAR(100),
    correo VARCHAR(150),
    telefono VARCHAR(20),
    id_area BIGINT REFERENCES inv_areas(id) ON DELETE SET NULL,
    estatus VARCHAR(30) DEFAULT 'Activo',
    fecha_registro TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inv_marcas (
    id BIGSERIAL PRIMARY KEY,
    nombre_marca VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE inv_bienes (
    id BIGSERIAL PRIMARY KEY,
    id_sep VARCHAR(50),
    no_inventario VARCHAR(100) UNIQUE NOT NULL,
    nombre_bien TEXT NOT NULL,
    marca VARCHAR(100),
    id_marca BIGINT REFERENCES inv_marcas(id) ON DELETE SET NULL,
    modelo VARCHAR(100),
    serie VARCHAR(150),
    adq VARCHAR(100),
    valor DECIMAL(12,2),
    resguardo_excel VARCHAR,
    codigo_barras VARCHAR(200),
    id_area BIGINT REFERENCES inv_areas(id) ON DELETE SET NULL,
    id_personal BIGINT REFERENCES inv_personal(id) ON DELETE SET NULL,
    estatus estatus_bien DEFAULT 'Disponible',
    fecha_registro TIMESTAMPTZ DEFAULT now(),
    eliminado BOOLEAN DEFAULT false
);

CREATE TABLE inv_historial (
    id BIGSERIAL PRIMARY KEY,
    id_bien BIGINT REFERENCES inv_bienes(id) ON DELETE CASCADE,
    id_personal_anterior BIGINT REFERENCES inv_personal(id) ON DELETE SET NULL,
    id_personal_nuevo BIGINT REFERENCES inv_personal(id) ON DELETE SET NULL,
    id_area_anterior BIGINT REFERENCES inv_areas(id) ON DELETE SET NULL,
    id_area_nueva BIGINT REFERENCES inv_areas(id) ON DELETE SET NULL,
    fecha_movimiento TIMESTAMPTZ DEFAULT now(),
    tipo_movimiento VARCHAR(100) NOT NULL,
    observaciones TEXT
);

CREATE TABLE inv_usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    rol rol_usuario_inv DEFAULT 'visualizador',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inv_parametros (
    clave VARCHAR(100) PRIMARY KEY,
    valor TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS (permisivo para desarrollo)
-- ============================================================

ALTER TABLE inv_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE inv_personal ENABLE ROW LEVEL SECURITY;
ALTER TABLE inv_marcas ENABLE ROW LEVEL SECURITY;
ALTER TABLE inv_bienes ENABLE ROW LEVEL SECURITY;
ALTER TABLE inv_historial ENABLE ROW LEVEL SECURITY;
ALTER TABLE inv_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE inv_parametros ENABLE ROW LEVEL SECURITY;

CREATE POLICY "dev_all" ON inv_areas FOR ALL USING (true);
CREATE POLICY "dev_all" ON inv_personal FOR ALL USING (true);
CREATE POLICY "dev_all" ON inv_marcas FOR ALL USING (true);
CREATE POLICY "dev_all" ON inv_bienes FOR ALL USING (true);
CREATE POLICY "dev_all" ON inv_historial FOR ALL USING (true);
CREATE POLICY "dev_all" ON inv_usuarios FOR ALL USING (true);
CREATE POLICY "dev_all" ON inv_parametros FOR ALL USING (true);

-- ============================================================
-- Seed data
-- ============================================================

INSERT INTO inv_areas (nombre_area, descripcion) VALUES
('Direccion', 'Direccion general del plantel'),
('Subdireccion Academica', 'Subdireccion de enseñanza'),
('Subdireccion Administrativa', 'Subdireccion de administracion y finanzas'),
('Taller de Agropecuaria', 'Taller de practicas agropecuarias'),
('Taller de Administracion', 'Taller de administracion'),
('Biblioteca', 'Biblioteca del plantel'),
('Laboratorio', 'Laboratorio de computo y ciencias'),
('Coords. de Grupo', 'Coordinaciones de grupo'),
('Servicio Social', 'Departamento de servicio social'),
('Control Escolar', 'Area de control escolar');

INSERT INTO inv_personal (nombre, apellido_paterno, apellido_materno, puesto, correo) VALUES
('Maria Elena', 'Lopez', 'Garcia', 'Direccion', 'maria.lopez@cbta15.edu.mx'),
('Carlos', 'Hernandez', 'Ruiz', 'Subdirector Academico', 'carlos.hernandez@cbta15.edu.mx'),
('Ana Laura', 'Martinez', 'Perez', 'Subdirectora Administrativa', 'ana.martinez@cbta15.edu.mx'),
('Pedro', 'Gonzalez', 'Diaz', 'Maestro de Agropecuaria', 'pedro.gonzalez@cbta15.edu.mx'),
('Laura', 'Sanchez', 'Morales', 'Maestra de Administracion', 'laura.sanchez@cbta15.edu.mx'),
('Roberto', 'Ramirez', 'Torres', 'Tecnico en Computo', 'roberto.ramirez@cbta15.edu.mx'),
('Sandra', 'Flores', 'Jimenez', 'Bibliotecaria', 'sandra.flores@cbta15.edu.mx'),
('Miguel', 'Torres', 'Vargas', 'Maestro de Servicio Social', 'miguel.torres@cbta15.edu.mx');

INSERT INTO inv_marcas (nombre_marca) VALUES
('HP'), ('Dell'), ('Lenovo'), ('Samsung'), ('Canon'),
('Epson'), ('Brother'), ('LG'), ('Acer'), ('Asus'),
('Kingston'), ('Logitech'), ('Epson'), ('Cisco'), ('TP-Link');

INSERT INTO inv_bienes (no_inventario, nombre_bien, marca, modelo, serie, adq, valor, id_area, id_personal, estatus, codigo_barras) VALUES
('INV-00001', 'Computadora de escritorio', 'HP', 'ProDesk 400 G7', '5CG1234XYZ', 'Compra directa', 15000.00, 7, 6, 'Asignado', 'CBTA00001'),
('INV-00002', 'Computadora de escritorio', 'Dell', 'OptiPlex 7090', '5CG5678ABC', 'Compra directa', 14500.00, 7, 6, 'Asignado', 'CBTA00002'),
('INV-00003', 'Laptop', 'Lenovo', 'ThinkPad E14', 'PF3ABCD123', 'Convenio', 12000.00, 2, 2, 'Asignado', 'CBTA00003'),
('INV-00004', 'Impresora laser', 'HP', 'LaserJet Pro M404dn', 'VNB1234567', 'Compra directa', 8500.00, 10, NULL, 'Disponible', 'CBTA00004'),
('INV-00005', 'Proyector', 'Epson', 'EB-X51', 'X4NB567890', 'Donacion', 9800.00, 1, 1, 'Asignado', 'CBTA00005'),
('INV-00006', 'Telefono IP', 'Cisco', 'SPA525G2', 'FCH2345678', 'Compra directa', 3200.00, 3, 3, 'Asignado', 'CBTA00006'),
('INV-00007', 'Router inalambrico', 'TP-Link', 'Archer AX50', '20A1234567', 'Compra directa', 1800.00, 3, NULL, 'Disponible', 'CBTA00007'),
('INV-00008', 'Escritorio ejecutivo', 'Generico', 'Modelo Oficina', 'N/A', 'Compra directa', 4500.00, 1, 1, 'Asignado', 'CBTA00008'),
('INV-00009', 'Silla ergonomica', 'Generico', 'Modelo Ergo', 'N/A', 'Compra directa', 3200.00, 1, 1, 'Asignado', 'CBTA00009'),
('INV-00010', 'Computadora portatil', 'Acer', 'Aspire 5', 'NXHKABC123', 'Donacion', 11000.00, 4, 4, 'En mantenimiento', 'CBTA00010'),
('INV-00011', 'Monitor 24 pulgadas', 'LG', '24MP400', '405ABCDE12', 'Compra directa', 4200.00, 7, NULL, 'Pendiente', 'CBTA00011'),
('INV-00012', 'Impresora multifuncional', 'Epson', 'L3150', 'X8VY123456', 'Compra directa', 5500.00, 10, 10, 'Asignado', 'CBTA00012'),
('INV-00013', 'Switch de red 24 puertos', 'Cisco', 'SF200-24', 'FCW1234567', 'Compra directa', 6800.00, 3, 6, 'Asignado', 'CBTA00013'),
('INV-00014', 'Bocinas multimedia', 'Logitech', 'Z313', 'Y00ABCDE12', 'Donacion', 1200.00, 9, 8, 'Danado', 'CBTA00014'),
('INV-00015', 'Tablet educativa', 'Samsung', 'Galaxy Tab A8', 'R52T123456', 'Convenio', 5800.00, 2, 2, 'Asignado', 'CBTA00015');

INSERT INTO inv_historial (id_bien, id_area_nueva, id_personal_nuevo, tipo_movimiento, observaciones) VALUES
(1, 7, 6, 'Asignacion', 'Asignacion inicial de equipo de computo'),
(2, 7, 6, 'Asignacion', 'Asignacion de equipo de computo para laboratorio'),
(3, 2, 2, 'Asignacion', 'Laptop para subdireccion academica'),
(5, 1, 1, 'Asignacion', 'Proyector paraDireccion'),
(6, 3, 3, 'Asignacion', 'Telefono IP para subadministrativa'),
(8, 1, 1, 'Asignacion', 'Escritorio para direccion'),
(9, 1, 1, 'Asignacion', 'Silla para direccion'),
(10, 4, 4, 'Asignacion', 'Laptop para taller de agropecuaria'),
(10, 4, 4, 'Transferencia', 'Transferido a taller por cambio de area'),
(12, 10, 10, 'Asignacion', 'Impresora para control escolar');

INSERT INTO inv_parametros (clave, valor) VALUES
('inventario_prefijo', 'INV-'),
('inventario_empresa', 'CBTA 15 - Campeche'),
('inventario_direccion', 'Calle 50 No. 123, Xmuch, Campeche');
