# Level-Up Gamer - E-Commerce y Gestión de Comunidad

Plataforma web desacoplada para la venta de productos gamer, gestión de usuarios, sistema de fidelización y soporte al cliente.

## Arquitectura del Sistema

El proyecto está dividido en tres capas principales:

1. **Frontend (SPA):** React + Vite (Puerto por defecto: `5173`)
2. **Backend (API REST):** Java 17/21 + Spring Boot (Puerto configurado: `8081`)
3. **Base de Datos:** MySQL (Base de datos: `demo_db`, Puerto: `3306`)

---

## Requisitos Previos

Asegúrate de tener instalado lo siguiente antes de comenzar:

* **Node.js** (v18 o superior) y **npm**
* **Java JDK** (v17 o v21)
* **MySQL Server** (escuchando en el puerto 3306)
* **Visual Studio Code** (con extensiones para Java y React recomendadas)

---

## Paso 1: Configuración de la Base de Datos (MySQL)

1. Abre tu cliente MySQL (Workbench, phpMyAdmin o terminal) y crea la base de datos:
   ```sql
   CREATE DATABASE demo_db;

## Paso 2: Levantar el Backend (Spring Boot)
El backend corre en el puerto 8081. Para ejecutarlo desde VS Code:
Abre la carpeta backend-java en VS Code.
Navega en el explorador de archivos a:src/main/java/com/example/demo/BackendApplication.java
Haz clic en el botón Run (o Ejecutar) que aparece directamente sobre la función main() o presiona F5.

## Paso 3: Levantar el Frontend (React + Vite)

cd frontend
npm install
npm run dev


## Paso 4: Ejecutar Pruebas Unitarias(Vitest)

cd frontend
npm run test



