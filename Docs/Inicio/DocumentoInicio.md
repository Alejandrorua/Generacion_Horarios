## 1. Declaración de la visión del proyecto
Enunciado de visión
Para los coordinadores académicos, docentes y estudiantes de la Universidad Continental que presentan dificultades en la planificación, generación y consulta de horarios académicos en entornos de currículo flexible, el Sistema Inteligente de Planificación de Horarios Académicos (SIPHA) es una aplicación web que permite construir automáticamente horarios válidos, coherentes y sin conflictos, considerando restricciones académicas, operativas y de disponibilidad.
A diferencia de los procesos manuales o herramientas tradicionales con limitada adaptabilidad, SIPHA incorpora un motor de optimización basado en satisfacción de restricciones (CSP), el cual permite generar soluciones eficientes en tiempos reducidos, facilitando además la visualización interactiva de horarios según el rol del usuario y la posibilidad de realizar ajustes manuales con validación inmediata del sistema.

Valor del sistema por actor
Actor	Valor generado
Estudiantes	Acceden a un horario personalizado, realizan su matrícula con validación automática de prerrequisitos y límites de créditos, y pueden identificar posibles conflictos antes de confirmar su inscripción.
Docentes	Registran su disponibilidad horaria y consultan su carga académica asignada, reduciendo la necesidad de coordinación manual con el área administrativa.
Coordinadores académicos	Generan horarios completos de manera automatizada en corto tiempo, con herramientas que permiten ajustes manuales y detección inmediata de inconsistencias.
Administradores	Gestionan los períodos académicos, configuran parámetros del sistema y acceden a reportes sobre ocupación de recursos y trazabilidad de cambios.

---
## 2. Identificación de los roles clave
Para el desarrollo del Sistema Inteligente de Planificación de Horarios Académicos, se han definido los siguientes roles clave, los cuales permiten asegurar una adecuada gestión del proyecto, una correcta implementación técnica y el cumplimiento de los objetivos establecidos bajo el enfoque ágil Scrum.

Rol	Descripción	Responsabilidades principales
Product Owner	Representa los intereses del cliente y define el valor del producto.	Priorizar el Product Backlog, definir criterios de aceptación, validar entregables y asegurar que el producto cumpla con los objetivos del negocio.
Scrum Master	Facilita la aplicación de la metodología Scrum dentro del equipo.	Organizar ceremonias Scrum, eliminar impedimentos, asegurar el cumplimiento del proceso ágil y promover la mejora continua.
Equipo de Desarrollo	Grupo multidisciplinario encargado de la construcción del sistema.	Diseñar, desarrollar, probar e integrar las funcionalidades del sistema de acuerdo con los requerimientos definidos.
Desarrollador Backend	Responsable de la lógica del sistema y servicios del lado del servidor.	Implementar la API REST, gestionar la base de datos, desarrollar la lógica de negocio y asegurar la seguridad del sistema.
Desarrollador Frontend	Encargado de la interfaz de usuario del sistema.	Desarrollar la aplicación web, implementar vistas interactivas y garantizar una experiencia de usuario adecuada.
Especialista en CSP	Responsable del motor de generación de horarios basado en restricciones.	Diseñar e implementar el algoritmo de optimización (CSP), definir restricciones y asegurar la eficiencia en la generación de horarios.
QA / DevOps	Encargado de la calidad del software y despliegue del sistema.	Realizar pruebas unitarias e integración, gestionar la automatización (CI/CD) y configurar entornos de despliegue.

---
## 3. Registro de interesados (Stakeholders)
La identificación de los interesados permite reconocer a todas las personas, grupos u organizaciones que pueden influir o verse afectados por el desarrollo del Sistema Inteligente de Planificación de Horarios Académicos (SIPHA). Este registro facilita la gestión de expectativas, la comunicación efectiva y la toma de decisiones durante el proyecto.
Stakeholder	Rol en el proyecto	Interés principal	Nivel de influencia
Docente del curso	Sponsor / Evaluador	Asegurar la calidad académica del proyecto y el cumplimiento de la rúbrica establecida.	Alto
Equipo de desarrollo	Equipo del proyecto	Lograr la correcta implementación del sistema, adquirir competencias profesionales y cumplir con los objetivos del curso.	Alto
Área académica / Registros	Usuario institucional	Optimizar el proceso de generación de horarios y reducir errores operativos.	Medio
Docentes universitarios	Usuario final	Contar con horarios alineados a su disponibilidad y carga académica.	Medio
Estudiantes	Usuario final	Acceder a horarios sin conflictos y acordes a su planificación académica.	Bajo
Administradores del sistema	Usuario operativo	Gestionar la configuración del sistema y supervisar su correcto funcionamiento.	Medio

---
## 4. Acta de Constitución del Proyecto (Project Charter)
 Información general del proyecto
Campo	Detalle
Nombre del proyecto	Sistema Inteligente de Planificación de Horarios Académicos en Entornos de Currículo Flexible
Código del proyecto	PFA-TP2-2026-02
Asignatura	Taller de Proyectos 2 — Ingeniería de Sistemas e Informática
Institución	Universidad Continental — Huancayo, Perú
Ciclo académico	2026-I
Fecha de inicio	Semana 1 del ciclo 2026-I
Fecha estimada de fin	Semana 16 del ciclo 2026-I
Metodología	Scrum (iteraciones de 2 a 3 semanas)
Repositorio	https://github.com/jean12371/PROYECTO-HORARIO.git

---

## Propósito y justificación del proyecto
La planificación de horarios académicos en instituciones con currículo flexible representa un proceso complejo, que involucra múltiples variables y restricciones, tales como disponibilidad de docentes, asignación de aulas, carga académica de los estudiantes y políticas institucionales.
Actualmente, este proceso se realiza de manera manual o mediante herramientas limitadas, lo que genera conflictos de horarios, uso ineficiente de recursos y una alta inversión de tiempo por parte del personal administrativo.
El presente proyecto tiene como propósito desarrollar una solución tecnológica que automatice la generación de horarios académicos mediante un enfoque basado en satisfacción de restricciones (CSP), permitiendo optimizar el proceso, reducir errores y mejorar la calidad del servicio académico.

---
 Objetivos del proyecto
 Objetivo general
Desarrollar una aplicación web que permita generar horarios académicos óptimos de manera automatizada, considerando restricciones académicas, operativas y de disponibilidad, mediante el uso de técnicas de optimización.

Objetivos específicos
Código	Objetivo	Criterio de éxito
OE1	Analizar el problema identificando variables, restricciones y actores involucrados.	Documento de análisis validado
OE2	Diseñar la arquitectura del sistema bajo estándares de ingeniería de software.	Diagrama aprobado por el equipo
OE3	Implementar el sistema incluyendo el motor de generación de horarios.	Sistema funcional con pruebas exitosas
OE4	Evaluar el impacto del sistema en el entorno académico.	Informe de impacto entregado
OE5	Documentar el desarrollo y decisiones técnicas del proyecto.	Documentación completa

---
Alcance del proyecto
Dentro del alcance
•	Gestión de usuarios (estudiantes, docentes, administradores) 
•	Registro de cursos, aulas y disponibilidad 
•	Validación de matrícula (prerrequisitos y créditos) 
•	Generación automática de horarios 
•	Visualización interactiva de horarios 
•	Detección de conflictos 
•	Exportación de reportes 
Fuera del alcance
•	Integración con sistemas externos (ERP, SAP, etc.) 
•	Desarrollo de aplicación móvil nativa 
•	Módulo de pagos o gestión financiera 
•	Soporte multilenguaje 

---
## Requerimientos de alto nivel
ID	Tipo	Descripción
RAN-01	Funcional	Generar horarios automáticamente sin conflictos
RAN-02	Funcional	Gestionar usuarios con roles definidos
RAN-03	Funcional	Validar matrícula según prerrequisitos
RAN-04	Funcional	Visualizar horarios y exportarlos
RAN-05	No funcional	Cumplir estándares de seguridad (OWASP)
RAN-06	No funcional	Generar horarios en tiempo menor a 30 segundos

---
## Cronograma de alto nivel
Fase	Descripción
Sprint 0	Inicio del proyecto y planificación
Sprint 1	Diseño y autenticación
Sprint 2	Matrícula y lógica del sistema
Sprint 3	Generación de horarios
Sprint 4	Pruebas y entrega final

---
## Stakeholders clave
Stakeholder	Rol	Influencia
Docente del curso	Sponsor	Alta
Equipo de desarrollo	Ejecutor	Alta
Área académica	Usuario	Media
Docentes	Usuario	Media
Estudiantes	Usuario	Baja

---
## Riesgos del proyecto
Riesgo	Probabilidad	Impacto	Mitigación
Fallo del algoritmo CSP	Media	Alta	Limitar alcance y optimizar algoritmo
Mala distribución de tareas	Alta	Media	Definir roles claros
Cambios en requerimientos	Alta	Media	Revisiones por sprint
Problemas técnicos	Media	Media	Pruebas tempranas

 Project Manager
Campo	Descripción
Rol	Project Manager (integrante del equipo)
Responsabilidad	Planificar, coordinar y supervisar el proyecto
Autoridad	Asignar tareas y tomar decisiones operativas

 Aprobación del proyecto
Rol	Nombre	Firma
Sponsor	Docente del curso	__________
Project Manager	Por designar	__________


## 5. Desarrollo de Épicas del Producto
Definición de épicas
Las épicas representan conjuntos de funcionalidades de alto nivel que agrupan requerimientos relacionados del sistema. Estas permiten organizar el Product Backlog y facilitan la planificación incremental del desarrollo bajo el enfoque ágil Scrum.

Lista de épicas del sistema

ÉPICA E1 — Gestión de usuarios y autenticación
Descripción:
El sistema debe permitir la gestión de usuarios mediante mecanismos de registro, autenticación y control de acceso basado en roles.
Actores:
Administrador, docente, estudiante, coordinador
Funcionalidades principales:
•	Registro de usuarios 
•	Inicio de sesión (login) 
•	Gestión de roles (admin, docente, estudiante) 
•	Recuperación de contraseña 
•	Control de acceso a funcionalidades 
Criterios de aceptación:
•	El sistema permite el acceso solo a usuarios autenticados 
•	Se restringe el acceso según el rol del usuario 
•	Las credenciales se almacenan de forma segura 
•	La sesión del usuario se gestiona correctamente 

ÉPICA E2 — Gestión de información académica
Descripción:
El sistema debe permitir el registro, edición y administración de la información académica necesaria para la generación de horarios.
Actores:
Administrador
Funcionalidades principales:
•	Registro de estudiantes, docentes, cursos y aulas 
•	Edición y eliminación de registros 
•	Validación de datos ingresados 
Criterios de aceptación:
•	Los registros se almacenan correctamente en la base de datos 
•	No se permite duplicidad de información 
•	Los datos obligatorios son validados 
•	Se pueden actualizar y eliminar registros sin errores 

ÉPICA E3 — Matrícula académica
Descripción:
El sistema debe permitir a los estudiantes realizar su matrícula con validación automática de restricciones académicas.
Actores:
Estudiante
Funcionalidades principales:
•	Selección de cursos 
•	Validación de prerrequisitos 
•	Control de créditos por ciclo 
•	Confirmación de matrícula 
Criterios de aceptación:
•	El sistema valida prerrequisitos antes de permitir la matrícula 
•	Se respeta el límite de créditos permitido 
•	Se muestran mensajes de error en caso de inconsistencias 
•	La matrícula se registra correctamente 

ÉPICA E4 — Generación automática de horarios
Descripción:
El sistema debe generar horarios académicos de manera automática, considerando restricciones académicas y operativas.
Actores:
Coordinador académico
Funcionalidades principales:
•	Generación automática de horarios 
•	Aplicación de restricciones (docente, aula, horario) 
•	Detección de conflictos 
•	Modificación manual de horarios 
Criterios de aceptación:
•	No existen conflictos en la asignación de horarios 
•	Se respeta la disponibilidad de docentes y aulas 
•	El sistema genera resultados en tiempo eficiente 
•	Permite ajustes con validación automática 

ÉPICA E5 — Visualización de horarios
Descripción:
El sistema debe permitir visualizar los horarios generados de forma gráfica e interactiva.
Actores:
Todos los usuarios
Funcionalidades principales:
•	Visualización en formato calendario semanal 
•	Filtros por docente, curso y aula 
•	Visualización personalizada según usuario 
Criterios de aceptación:
•	El horario se muestra correctamente 
•	Los filtros funcionan sin errores 
•	La interfaz es clara y fácil de usar 
•	Compatible con diferentes dispositivos 

ÉPICA E6 — Reportes y exportación
Descripción:
El sistema debe permitir generar reportes del estado de los horarios y exportarlos en diferentes formatos.
Actores:
Administrador, coordinador
Funcionalidades principales:
•	Exportación de horarios en PDF y Excel 
•	Reportes de carga docente 
•	Reportes de uso de aulas 
Criterios de aceptación:
•	Los reportes se generan correctamente 
•	Los archivos exportados son legibles 
•	La información coincide con los datos del sistema 
•	El tiempo de generación es adecuado 

## 6. Product Backlog

 Lista de historias de usuario
ID	Historia de usuario	Actor	Prioridad
HU-01	Como administrador, quiero registrar usuarios en el sistema para gestionar el acceso a la plataforma.	Administrador	Alta
HU-02	Como usuario, quiero iniciar sesión con mis credenciales para acceder al sistema de forma segura.	Todos	Alta
HU-03	Como administrador, quiero asignar roles a los usuarios para controlar el acceso a funcionalidades.	Administrador	Alta
HU-04	Como administrador, quiero registrar cursos para gestionar la oferta académica.	Administrador	Alta
HU-05	Como administrador, quiero registrar docentes para asignarlos a cursos.	Administrador	Alta
HU-06	Como administrador, quiero registrar aulas para gestionar espacios disponibles.	Administrador	Alta
HU-07	Como estudiante, quiero seleccionar cursos para realizar mi matrícula.	Estudiante	Alta
HU-08	Como sistema, quiero validar prerrequisitos para evitar matrículas incorrectas.	Sistema	Alta
HU-09	Como sistema, quiero controlar el límite de créditos por ciclo para cumplir normas académicas.	Sistema	Alta
HU-10	Como estudiante, quiero confirmar mi matrícula para asegurar mi inscripción.	Estudiante	Alta
HU-11	Como docente, quiero registrar mi disponibilidad horaria para evitar conflictos.	Docente	Alta
HU-12	Como coordinador, quiero generar horarios automáticamente para ahorrar tiempo.	Coordinador	Alta
HU-13	Como sistema, quiero detectar conflictos de horarios para garantizar consistencia.	Sistema	Alta
HU-14	Como coordinador, quiero modificar horarios generados para ajustarlos según necesidad.	Coordinador	Media
HU-15	Como usuario, quiero visualizar mi horario en formato calendario para entenderlo fácilmente.	Todos	Alta
HU-16	Como usuario, quiero filtrar horarios por curso, docente o aula para facilitar la búsqueda.	Todos	Media
HU-17	Como coordinador, quiero exportar horarios en PDF para compartirlos.	Coordinador	Media
HU-18	Como administrador, quiero generar reportes de uso de aulas para análisis.	Administrador	Baja
HU-19	Como administrador, quiero generar reportes de carga docente para control académico.	Administrador	Baja
HU-20	Como sistema, quiero registrar auditoría de cambios para mantener trazabilidad.	Sistema	Media

Relación con las épicas
•	HU-01 a HU-03 → ÉPICA E1 (Usuarios y autenticación) 
•	HU-04 a HU-06 → ÉPICA E2 (Información académica) 
•	HU-07 a HU-10 → ÉPICA E3 (Matrícula) 
•	HU-11 a HU-14 → ÉPICA E4 (Generación de horarios) 
•	HU-15 a HU-16 → ÉPICA E5 (Visualización) 
•	HU-17 a HU-20 → ÉPICA E6 (Reportes)

## 7. Backlog Priorizado del Producto

ID	Historia de usuario	Actor	Prioridad	Valor de negocio	Esfuerzo (SP)
HU-02	Como usuario, quiero iniciar sesión para acceder al sistema de forma segura.	Todos	Alta	Alto	3
HU-01	Como administrador, quiero registrar usuarios para gestionar accesos al sistema.	Administrador	Alta	Alto	5
HU-03	Como administrador, quiero asignar roles a los usuarios para controlar permisos.	Administrador	Alta	Alto	3
HU-04	Como administrador, quiero registrar cursos para gestionar la oferta académica.	Administrador	Alta	Alto	5
HU-05	Como administrador, quiero registrar docentes para asignarlos a cursos.	Administrador	Alta	Alto	5
HU-06	Como administrador, quiero registrar aulas para gestionar los espacios disponibles.	Administrador	Alta	Alto	5
HU-11	Como docente, quiero registrar mi disponibilidad horaria para evitar conflictos.	Docente	Alta	Alto	5
HU-07	Como estudiante, quiero seleccionar cursos para realizar mi matrícula.	Estudiante	Alta	Alto	5
HU-08	Como sistema, quiero validar prerrequisitos para evitar matrículas incorrectas.	Sistema	Alta	Alto	8
HU-09	Como sistema, quiero controlar el límite de créditos por ciclo para cumplir normas académicas.	Sistema	Alta	Alto	5
HU-10	Como estudiante, quiero confirmar mi matrícula para asegurar mi inscripción.	Estudiante	Alta	Alto	3
HU-12	Como coordinador, quiero generar horarios automáticamente para optimizar tiempo.	Coordinador	Alta	Muy alto	13
HU-13	Como sistema, quiero detectar conflictos de horarios para garantizar consistencia.	Sistema	Alta	Muy alto	8
HU-15	Como usuario, quiero visualizar mi horario en formato calendario para facilitar su comprensión.	Todos	Alta	Alto	5
HU-14	Como coordinador, quiero modificar horarios generados para ajustarlos según necesidad.	Coordinador	Media	Medio	5
HU-16	Como usuario, quiero filtrar horarios por distintos criterios para facilitar la búsqueda.	Todos	Media	Medio	3
HU-17	Como coordinador, quiero exportar horarios en PDF para compartirlos.	Coordinador	Media	Medio	5
HU-20	Como sistema, quiero registrar auditoría de cambios para mantener trazabilidad.	Sistema	Media	Medio	5
HU-18	Como administrador, quiero generar reportes de uso de aulas para análisis.	Administrador	Baja	Bajo	3
HU-19	Como administrador, quiero generar reportes de carga docente para control académico.	Administrador	Baja	Bajo	3

Planificación de Lanzamiento

Estrategia de lanzamiento
El proyecto se desarrollará bajo la metodología Scrum, mediante iteraciones cortas (sprints) que permitirán entregar incrementos funcionales del sistema de manera progresiva.
Cada sprint tendrá una duración aproximada de 2 a 3 semanas, considerando un total de 16 semanas para el desarrollo completo del proyecto.

 Planificación por sprints
Sprint 0 — Inicio del proyecto
Objetivo:
Definir la base del proyecto y los artefactos iniciales.
Entregables:
•	Declaración de visión 
•	Project Charter 
•	Product Backlog 
•	Backlog priorizado 
•	Configuración del repositorio 

Sprint 1 — Fundamentos del sistema
Objetivo:
Implementar la base funcional del sistema y la gestión de usuarios.
Historias de usuario:
•	HU-02 (Login) 
•	HU-01 (Registro de usuarios) 
•	HU-03 (Gestión de roles) 
•	HU-04 (Registro de cursos) 
•	HU-05 (Registro de docentes) 
•	HU-06 (Registro de aulas) 
Resultado esperado:
Sistema base funcional con autenticación y gestión de datos iniciales.

Sprint 2 — Matrícula académica
Objetivo:
Desarrollar el módulo de matrícula con validaciones académicas.
Historias de usuario:
•	HU-07 (Selección de cursos) 
•	HU-08 (Validación de prerrequisitos) 
•	HU-09 (Control de créditos) 
•	HU-10 (Confirmación de matrícula) 
•	HU-11 (Disponibilidad docente) 
Resultado esperado:
Módulo de matrícula funcional con validaciones automáticas.

Sprint 3 — Generación de horarios
Objetivo:
Implementar el motor de generación automática de horarios.
Historias de usuario:
•	HU-12 (Generación automática) 
•	HU-13 (Detección de conflictos) 
Resultado esperado:
Sistema capaz de generar horarios sin conflictos.

Sprint 4 — Visualización y ajustes
Objetivo:
Desarrollar la visualización de horarios y funcionalidades de ajuste.
Historias de usuario:
•	HU-15 (Visualización de horarios) 
•	HU-14 (Modificación de horarios) 
•	HU-16 (Filtros de búsqueda) 
Resultado esperado:
Interfaz gráfica funcional para visualización y edición de horarios.

Sprint 5 — Reportes y cierre
Objetivo:
Implementar funcionalidades complementarias y preparar la entrega final.
Historias de usuario:
•	HU-17 (Exportación de horarios) 
•	HU-20 (Auditoría de cambios) 
•	HU-18 (Reporte de aulas) 
•	HU-19 (Reporte de carga docente) 
Resultado esperado:
Sistema completo con funcionalidades de reporte y documentación final.

 Hitos del proyecto
Hito	Descripción	Semana
H1	Aprobación de documentos iniciales	Semana 2
H2	Sistema base funcional	Semana 4
H3	Módulo de matrícula completo	Semana 8
H4	Motor de generación implementado	Semana 12
H5	Sistema final integrado	Semana 16
