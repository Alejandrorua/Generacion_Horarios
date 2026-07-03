-- Crear una extensión para búsquedas o UUIDs si fuesen necesarios (opcional)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tipo ENUM para los días de la semana
CREATE TYPE dia_semana AS ENUM ('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo');

-- 2. Tabla de Roles (Para diferenciar Administrador, Profesor, Estudiante)
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
);

-- 3. Tabla de Usuarios (Profesores, Alumnos y Administradores)
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_rol INT NOT NULL REFERENCES roles(id_rol) ON DELETE RESTRICT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabla de Edificios / Bloques (Útil si la universidad es grande)
CREATE TABLE edificios (
    id_edificio SERIAL PRIMARY KEY,
    nombre_edificio VARCHAR(100) UNIQUE NOT NULL,
    ubicacion_detallada TEXT
);

-- 5. Tabla de Aulas / Salones
CREATE TABLE aulas (
    id_aula SERIAL PRIMARY KEY,
    id_edificio INT REFERENCES edificios(id_edificio) ON DELETE SET NULL,
    codigo_aula VARCHAR(50) UNIQUE NOT NULL, -- Ej: "Aula 201", "Lab-Sistemas"
    capacidad INT NOT NULL CHECK (capacidad > 0),
    tipo_aula VARCHAR(50) DEFAULT 'Teoría' -- Ej: Laboratorio, Auditorio, Teoría
);

-- 6. Tabla de Materias / Experiencias Educativas
CREATE TABLE materias (
    id_materia SERIAL PRIMARY KEY,
    codigo_materia VARCHAR(20) UNIQUE NOT NULL, -- Ej: "INF-101"
    nombre_materia VARCHAR(150) NOT NULL,
    creditos INT NOT NULL CHECK (creditos >= 0),
    descripcion TEXT
);

-- 7. Tabla de Grupos (Secciones de una materia en un periodo académico)
CREATE TABLE grupos (
    id_grupo SERIAL PRIMARY KEY,
    id_materia INT NOT NULL REFERENCES materias(id_materia) ON DELETE CASCADE,
    id_profesor INT REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    codigo_grupo VARCHAR(20) NOT NULL, -- Ej: "Grupo 01", "Sección A"
    periodo_academico VARCHAR(50) NOT NULL, -- Ej: "2026-1"
    cupo_maximo INT NOT NULL CHECK (cupo_maximo > 0),
    CONSTRAINT uq_materia_grupo_periodo UNIQUE (id_materia, codigo_grupo, periodo_academico)
);

-- 8. Tabla de Detalle de Horarios (Clases individuales por grupo)
CREATE TABLE horarios_clase (
    id_horario SERIAL PRIMARY KEY,
    id_grupo INT NOT NULL REFERENCES grupos(id_grupo) ON DELETE CASCADE,
    dia dia_semana NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    id_aula INT NOT NULL REFERENCES aulas(id_aula) ON DELETE RESTRICT,
    
    -- Validaciones lógicas básicas
    CONSTRAINT chk_horas_coherentes CHECK (hora_fin > hora_inicio)
);

-- 9. Tabla de Inscripciones (Relación Muchos a Muchos de Estudiantes y sus Grupos)
CREATE TABLE inscripciones (
    id_estudiante INT NOT NULL REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    id_grupo INT NOT NULL REFERENCES grupos(id_grupo) ON DELETE CASCADE,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_estudiante, id_grupo)
);

--- AGREGAMOS INDICES PARA OPTIMIZAR BUSQUEDAS ---
-- Optimizar la búsqueda de los horarios que le corresponden a un grupo específico
CREATE INDEX idx_horarios_grupo ON horarios_clase(id_grupo);

-- Optimizar el filtrado de horarios por día de la semana
CREATE INDEX idx_horarios_dia ON horarios_clase(dia);

-- Optimizar la búsqueda de grupos por profesor asignado
CREATE INDEX idx_grupos_profesor ON grupos(id_profesor);

--- VISTA DE HORARIO COMPLETO ---
CREATE OR REPLACE VIEW vista_horario_completo AS
SELECT 
    hc.id_horario,
    m.codigo_materia,
    m.nombre_materia,
    g.codigo_grupo,
    g.periodo_academico,
    (u.nombre || ' ' || u.apellido) AS profesor,
    hc.dia,
    hc.hora_inicio,
    hc.hora_fin,
    a.codigo_aula,
    e.nombre_edificio
FROM horarios_clase hc
JOIN grupos g ON hc.id_grupo = g.id_grupo
JOIN materias m ON g.id_materia = m.id_materia
LEFT JOIN usuarios u ON g.id_profesor = u.id_usuario
JOIN aulas a ON hc.id_aula = a.id_aula
LEFT JOIN edificios e ON a.id_edificio = e.id_edificio;
--- agregamos tabla para las materias con pre-requisitos
CREATE TABLE materias_prerrequisitos (
    id_materia INT NOT NULL REFERENCES materias(id_materia) ON DELETE CASCADE,
    id_materia_prerrequisito INT NOT NULL REFERENCES materias(id_materia) ON DELETE CASCADE,
    
    -- Clave primaria compuesta para evitar duplicados
    PRIMARY KEY (id_materia, id_materia_prerrequisito),
    
    -- Restricción para evitar que una materia sea prerrequisito de sí misma
    CONSTRAINT chk_no_autorreferencia_directa CHECK (id_materia <> id_materia_prerrequisito)
);

--- Activar ojo no funciona en el postgresql verificar su posterior implementación ---
-- Activar extensión necesaria para operar tipos primitivos con GiST
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Alternativa avanzada para la tabla horarios_clase que bloquea colisiones automáticamente:
ALTER TABLE horarios_clase 
ADD CONSTRAINT bloquear_choque_aulas
EXCLUDE USING gist (
    id_aula WITH =,
    dia WITH =,
    tsrange(
        ('1970-01-01 ' || hora_inicio::text)::timestamp, 
        ('1970-01-01 ' || hora_fin::text)::timestamp
    ) WITH &&
);

---Por si no funciona el comando anterior de tabla_clase que bloquea colisiones automaticamente:
--- esto desplegando en render
-- Asegúrate de tener la extensión obligatoria activa
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Aplicar el constraint usando el constructor nativo de tsrange de forma inmutable
ALTER TABLE horarios_clase 
ADD CONSTRAINT bloquear_choque_aulas
EXCLUDE USING gist (
    id_aula WITH =,
    dia WITH =,
    tsrange(
        make_timestamp(1970, 1, 1, EXTRACT(HOUR FROM hora_inicio)::integer, EXTRACT(MINUTE FROM hora_inicio)::integer, 0),
        make_timestamp(1970, 1, 1, EXTRACT(HOUR FROM hora_fin)::integer, EXTRACT(MINUTE FROM hora_fin)::integer, 0)
    ) WITH &&
);