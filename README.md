# 🛍️ Mini-Tienda de Productos - React Native

Esta es una aplicación móvil construida en **React Native CLI**, que consume la API de DummyJSON para listar productos y permite gestionar favoritos con almacenamiento persistente local.

---

## 🛠️ Stack Tecnológico y Versiones Clave

- **React Native:** `0.86.0` (React Native CLI)
- **React:** `19.2.3`
- **Node.js:** `>= 22.11.0`
- **Lenguaje:** TypeScript (`5.8.x`)
- **Gestión de Estado Global:** Zustand (`^5.0.14`)
- **Persistencia Local:** Async Storage (`^3.1.1`)
- **Navegación:** React Navigation v7 (Bottom Tabs + Native Stack)
- **Estilos:** NativeWind v4 (Tailwind CSS)
- **Animaciones:** React Native Reanimated (`^4.5.1`)
- **Testing:** Jest + React Native Testing Library

---

## 🚀 Requisitos Previos

Asegúrate de tener configurado tu entorno de desarrollo para React Native CLI antes de comenzar:
- **Node.js** (Versión 22.11 o superior).
- **Ruby** (Versión compatible con Cocoapods, usualmente >= 2.7).
- **Watchman** instalado (`brew install watchman` en macOS).
- **Xcode** (Para emular iOS).
- **Android Studio** (Para emular Android) con SDK y emuladores configurados.

---

## 📦 Instalación

1. **Clona el repositorio**
   ```bash
   git clone git@github.com:jesusorejarena/prueba-topaz.git
   cd prueba-topaz
   ```

2. **Ejecuta el comando de configuración inicial (Setup)**
   Si estás usando **macOS**, hemos configurado un comando único que instala todas las dependencias de Node, instala los CocoaPods de iOS y limpia la caché en un solo paso:
   ```bash
   npm run setup
   ```
   > **Nota para Windows / Linux:** Como el comando anterior incluye scripts exclusivos de iOS, si estás en estos sistemas operativos, simplemente ejecuta:
   > ```bash
   > npm install
   > ```

---

## ▶️ Correr la Aplicación


### Correr en iOS
En una nueva ventana de la terminal, ejecuta:
```bash
npm run ios
```

### Correr en Android
Abre un emulador en Android Studio o conecta un dispositivo físico y ejecuta:
```bash
npm run android
```

---

## 🧪 Pruebas Unitarias (Testing)

Se implementaron pruebas unitarias para componentes de interfaz y lógica de estado global utilizando **Jest** y **React Native Testing Library**.

Para correr la suite de pruebas:
```bash
npm run test
```

---

## 🌟 Características y Cumplimiento

- ✅ **Lista de Productos:** Consumo de la API con FlatList optimizado y estados de Carga/Error.
- ✅ **Detalle de Producto:** Información detallada con carrusel de imágenes paginado y botón de favorito interactivo.
- ✅ **Favoritos Locales:** Uso de Zustand integrado con AsyncStorage para una persistencia rápida y centralizada.
- ✅ **TypeScript Estricto:** Tipado completo de la API, componentes y Store.
- ✅ **UI Moderna y Consistente:** Uso de Tailwind (NativeWind) garantizando escalabilidad en diseño.
- ✅ **(Bonus) Animación:** Animación al añadir a favoritos usando Reanimated.
- ✅ **(Bonus) Unit Testing:** Tests funcionales comprobables en comandos nativos.

---

## ⚠️ Nota de Seguridad (Archivos Sensibles)

Para facilitar la revisión y ejecución inmediata de esta prueba técnica, se han incluido deliberadamente en el repositorio archivos que normalmente son ignorados (como el archivo `.env`, el archivo `my-upload-key.keystore` y sus contraseñas). 

> **Aviso:** En un entorno de producción o en un proyecto real, estos archivos **jamás** se suben al control de versiones (Git) por estrictas razones de seguridad, y sus valores se manejan exclusivamente a través de variables de entorno seguras en el servidor de CI/CD o de forma local.
