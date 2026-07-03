# 🚀 PROYECTO-HORARIO
Sistema de Generación Óptima de Horarios Académicos en Entornos de Currículo Flexible

---

## 📑 Tabla de Contenidos

- [📌 Integrantes](#-Integrantes)
- [📌 Problemática](#-Problemática)
- [📌 Justificación del PMV](#-Justificación-del-PMV)
- [📌 Tecnologías Utilizadas](#-Tecnologías-Utilizadas)
- [📌 Arquitectura del Sistema](#-Arquitectura-del-Sistema)
- [📌 Instrucciones de instalación](#-Instrucciones-de-instalación)
- [📌 Instrucciones de build](#-Instrucciones-de-build)

---
## 📌 Integrantes
| Integrante | Rol |
| :--- | :--- |
| Ramos Rua Alejandro |	Product Owner - Scrum Master |
| Quispe Breña Joan Branko |	Responsable de Frontend |
| Quispe Breña Jean Carlos |	Responsable de Backend |

Foto Grupal:
[![foto-grupal-horarios.jpg](https://i.postimg.cc/1R0NBPt1/foto-grupal-horarios.jpg)](https://postimg.cc/Jtnn7fZp)

---

## 📌 Problemática

Problemática Abordada: Las universidades que implementan modelos de currículo flexible enfrentan múltiples desafíos en la planificación académica, tales como:

- Variabilidad en la matrícula estudiantil
- Disponibilidad limitada de recursos (aulas, docentes, horarios)
- Existencia de múltiples restricciones simultáneas

Estas condiciones generan problemas como:

- Cruces de horarios
- Uso ineficiente de aulas
- Dificultades en la asignación docente
- Limitaciones para que los estudiantes organicen su carga académica

---

## 📌 Justificación del PMV

La planificación de horarios académicos en instituciones con currículo flexible representa un proceso complejo, que involucra múltiples variables y restricciones, tales como disponibilidad de docentes, asignación de aulas, carga académica de los estudiantes y políticas institucionales. Actualmente, este proceso se realiza de manera manual o mediante herramientas limitadas, lo que genera conflictos de horarios, uso ineficiente de recursos y una alta inversión de tiempo por parte del personal administrativo. El presente proyecto tiene como propósito desarrollar una solución tecnológica que automatice la generación de horarios académicos mediante un enfoque basado en satisfacción de restricciones (CSP), permitiendo optimizar el proceso, reducir errores y mejorar la calidad del servicio académico.

---

## 📌 Tecnologías Utilizadas

Frontend: react con Tailwind
Backend: nodejs y express
Base de Datos: PostgreSQL
Pruebas: Thunder Client
Diseño: Figma
Versionado: GitHub

---

## 📌 Arquitectura del Sistema
### 1.	Arquitectura General
[![Arquitectura-Horarios.png](https://i.postimg.cc/bJhwv5h8/Arquitectura-Horarios.png)](https://postimg.cc/t1BjS2Jm)

### 2.	Flujo del Sistema
[![Flujo-Del-Sistema.png](https://i.postimg.cc/KYLYx2d1/Flujo-Del-Sistema.png)](https://postimg.cc/cKxWBV1W)

---

## 📌 Instrucciones de instalación

Sigue estos pasos para configurar el entorno de desarrollo local:

Requisitos Previos:
* **Motor de Base de Datos:** PostgreSQL (v14 o superior).
* **Entorno de Ejecución:** Node.js v18+ .
* **Gestor de Dependencias:**  NPM o Yarn (si es Node.js).
* **Git** instalado en el sistema.

Paso 1: Clonar el repositorio
Abre una terminal y ejecuta el siguiente comando para descargar el proyecto de forma local:

```
git clone https://github.com/jean12371/PROYECTO-HORARIO.git
cd PROYECTO-HORARIO
```

Paso 2: Configuración de la Base de Datos
Abre tu cliente de base de datos (pgAdmin, o terminal).  
Crea una base de datos limpia llamada proyecto_horario. 
Ejecuta el script de inicialización de tablas que se encuentra en la raíz o en la carpeta correspondiente:
```
Ejemplo para ejecutar desde consola si usas el archivo .sql provisto:
database/schema.sql  -- (En PostgreSQL)
```
Configura las credenciales en el archivo de variables de entorno del proyecto (ej: .env o application.properties).

Paso 3: Instalación de dependencias   
En proyecto de Node.js y Reactjs:
```
cd backend 
npm install
npm run dev

cd frontend
npm install
npm run dev
```

## 📌 Instrucciones de build
Para compilar el proyecto y generar el artefacto ejecutable listo para producción:      
En proyecto JavaScript/TypeScript:    
Si usas un transpilador o empaquetador, genera la versión de producción ejecutando:
```
npm run build
```

### a. Instrucciones de despliegue
**Despliegue en Servidor Local (Entorno de pruebas)**   
Para levantar el servidor de aplicaciones de manera local:  
- En Node.js: ``` npm start o node dist/index.js  ```

El sistema estará disponible en el navegador web a través de la dirección: ```http://localhost:3000``` (o el puerto configurado).

**Despliegue en Producción (Cloud / VPS)**
Si deseas subir el proyecto a la nube (como Render, Railway o AWS):   
1. Vincula el repositorio de GitHub a la plataforma de hosting elegida.
2. Configura las Variables de Entorno en el panel de control del servidor (ej: ```DB_HOST```, ```DB_USER```, ```DB_PASSWORD```).
3. Define el comando de inicio en la plataforma: ```npm start```

### b. Enlace a video explicativo
1ra versión:      
- Link: [https://drive.google.com/drive/folders/19EEgqakenTm3L_iFnC6RTcG64GocRoV_?usp=sharing-](https://drive.google.com/drive/folders/19EEgqakenTm3L_iFnC6RTcG64GocRoV_?usp=sharing-)      

2da versión:    
- Link: [https://drive.google.com/file/d/1MRmcmWBf48pa6fqQ_G3YlT9RakOTCaYx/view?usp=drive_link](https://drive.google.com/file/d/1MRmcmWBf48pa6fqQ_G3YlT9RakOTCaYx/view?usp=drive_link) 

### c. Enlaces a la documentación ubicada en la carpeta docs/
Link: [https://github.com/jean12371/PROYECTO-HORARIO/wiki](https://github.com/jean12371/PROYECTO-HORARIO/wiki) 

---

