# IoTicos God Level App - Modernized 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

> Plataforma IoT moderna para gestión y monitoreo de dispositivos en tiempo real

Este proyecto ha sido modernizado en 2025 con las últimas tecnologías y mejores prácticas para IoT.

## ✨ Características

- 🎨 **Frontend Moderno**: Nuxt 3 + Vue 3 (Composition API)
- 🔧 **Backend Robusto**: Express.js con seguridad mejorada
- 📊 **Visualización**: Charts.js 4 + D3.js 7 para gráficos interactivos
- 🔌 **IoT Ready**: Comunicación MQTT con Mosquitto/EMQX
- 🗄️ **Base de Datos**: MongoDB 7+ con Mongoose
- 🐳 **Dockerizado**: Despliegue fácil con Docker Compose
- 🔒 **Seguro**: JWT, Helmet, Rate Limiting, validación de entrada
- 🚀 **CI/CD**: GitHub Actions para automatización

[![IoTicos GL](https://yt-embed.herokuapp.com/embed?v=ZePfdyJPCvM)](https://www.youtube.com/watch?v=ZePfdyJPCvM "IoTicos GL")

## 📚 Documentación

- **[MODERNIZATION.md](./MODERNIZATION.md)** - Guía completa de modernización paso a paso
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del sistema y flujos de datos
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guía de despliegue en diferentes entornos

## 🚀 Quick Start

### Prerrequisitos

- Node.js >= 18
- Docker y Docker Compose
- Git

### Instalación Rápida con Docker

```bash
# 1. Clonar el repositorio
git clone https://github.com/Amaury78/ioticos_god_level_app.git
cd ioticos_god_level_app

# 2. Copiar y configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores (especialmente JWT_SECRET)

# 3. Generar un JWT secret seguro
openssl rand -base64 32
# Copiar el resultado en .env

# 4. Iniciar todos los servicios
docker-compose up -d

# 5. Acceder a la aplicación
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# MongoDB: localhost:27017
# MQTT: localhost:1883 (WebSocket: 9001)
```

### Desarrollo Local (sin Docker)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar .env
cp .env.example .env

# 3. Asegúrate de tener MongoDB y MQTT corriendo

# 4. Iniciar backend
npm run devn

# 5. En otra terminal, iniciar frontend
npm run dev
```

## 🏗️ Stack Tecnológico

### Frontend
- **Nuxt 3** - Framework Vue.js moderno
- **Vue 3** - Con Composition API
- **Element Plus** - Biblioteca de componentes UI
- **Bootstrap 5** - Framework CSS
- **Chart.js 4** - Gráficos interactivos
- **D3.js 7** - Visualizaciones avanzadas
- **Pinia** - State management
- **MQTT.js 5** - Cliente MQTT para browser

### Backend
- **Express.js** - Framework web
- **Mongoose 8** - ODM para MongoDB
- **JWT** - Autenticación
- **Helmet** - Seguridad HTTP headers
- **Express Validator** - Validación de entrada
- **MQTT.js 5** - Cliente MQTT
- **Bcrypt** - Hash de passwords

### Infraestructura
- **MongoDB 7** - Base de datos
- **Mosquitto 2** - MQTT Broker
- **Docker** - Contenedores
- **GitHub Actions** - CI/CD

## 📁 Estructura del Proyecto

```
ioticos_god_level_app/
├── api/                    # Backend Express.js
│   ├── middlewares/       # Middlewares (auth, validación)
│   ├── models/            # Modelos Mongoose
│   ├── routes/            # Rutas de API
│   └── index.js           # Entry point
├── assets/                # Assets estáticos
├── components/            # Componentes Vue
│   ├── Cards/
│   ├── Charts/
│   ├── Dashboard/
│   └── Widgets/          # Widgets IoT
├── layouts/              # Layouts de Nuxt
├── middleware/           # Middleware de Nuxt
├── pages/                # Páginas (auto-routing)
├── plugins/              # Plugins de Nuxt
├── store/                # Vuex/Pinia store
├── mosquitto/            # Configuración MQTT
├── .github/              # GitHub Actions workflows
├── docker-compose.yml    # Docker Compose config
├── Dockerfile.backend    # Dockerfile backend
├── nuxt.config.js        # Configuración Nuxt
└── package.json
```

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Iniciar frontend dev
npm run devn         # Iniciar backend dev
npm run build        # Build para producción
npm run start        # Iniciar producción

# Docker
docker-compose up -d           # Iniciar servicios
docker-compose down            # Detener servicios
docker-compose logs -f         # Ver logs
docker-compose ps              # Estado de servicios

# Testing (por implementar en modernización completa)
npm test                       # Correr tests
npm run test:coverage          # Coverage report
```

## 🔐 Seguridad

Este proyecto implementa múltiples capas de seguridad:

- ✅ JWT con secrets seguros en variables de entorno
- ✅ Passwords hasheados con bcrypt
- ✅ Helmet para headers HTTP seguros
- ✅ Rate limiting en endpoints sensibles
- ✅ Validación y sanitización de entrada
- ✅ CORS configurado correctamente
- ✅ MQTT con autenticación por dispositivo
- ✅ HTTPS ready para producción

Ver [MODERNIZATION.md](./MODERNIZATION.md#fase-2-modernización-del-backend) para detalles completos.

## 📊 Características IoT

### Dispositivos Soportados
- ESP32
- ESP8266
- Raspberry Pi
- Cualquier dispositivo compatible con MQTT

### Widgets Disponibles
- 📈 **Charts** - Gráficos en tiempo real
- 🎚️ **Switches** - Control on/off
- 🔘 **Buttons** - Acciones momentáneas
- 💡 **Indicators** - Estados visuales
- 📊 **Number Charts** - Valores numéricos con gráficos

### Comunicación MQTT
```
Topics:
/ioticos/{userId}/{deviceId}/{variable}          # Telemetría
/ioticos/{userId}/{deviceId}/{variable}/actuator # Control
```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: amazing feature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Ver [CONTRIBUTING.md](./CONTRIBUTING.md) (por crear) para más detalles.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 👥 Autores

- **IoTicos.org** - Proyecto Original
- Modernizado en 2025 para seguir las mejores prácticas

## 🔗 Enlaces Útiles

- **Curso Original**: [IoT Bootcamp God Level](https://www.udemy.com/course/iot-god-level/learn/lecture/24850534)
- **Demo**: [demo.ioticos.org](https://demo.ioticos.org)
- **Instalador Original**: [ioticos_god_level_services](https://github.com/ioticos/ioticos_god_level_services)
- **Documentación Nuxt 3**: [nuxt.com](https://nuxt.com)
- **Documentación MQTT**: [mqtt.org](https://mqtt.org)

## 📞 Soporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/Amaury78/ioticos_god_level_app/issues)
- 📧 **Email**: [Contacto a través de GitHub]
- 💬 **Comunidad**: [Discusiones](https://github.com/Amaury78/ioticos_god_level_app/discussions)

---

⭐ Si este proyecto te resulta útil, por favor considera darle una estrella en GitHub!

![IOTICOS%20GL%20APP%203aecd292ad5447b9aff5744b6608d234/Snip20210311_8.png](IOTICOS%20GL%20APP%203aecd292ad5447b9aff5744b6608d234/Snip20210311_8.png)
