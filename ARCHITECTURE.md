# Arquitectura - IoTicos God Level App

## 📐 Visión General

IoTicos God Level App es una plataforma IoT moderna que permite la gestión y monitoreo de dispositivos IoT.

### Stack Tecnológico Modernizado

- **Frontend**: Nuxt 3, Vue 3 (Composition API), Element Plus, Bootstrap 5
- **Backend**: Express.js, Mongoose 8+, JWT, MQTT 5
- **Database**: MongoDB 7+
- **IoT Communication**: MQTT (Mosquitto/EMQX)
- **DevOps**: Docker, Docker Compose, GitHub Actions

## 🔄 Flujo de Datos Principal

### 1. Autenticación
```
Cliente → API → MongoDB (validación) → JWT Token → Cliente
```

### 2. Dispositivos IoT → Plataforma
```
Dispositivo → MQTT Broker → Webhook → API → MongoDB
```

### 3. Plataforma → Dispositivos IoT
```
Cliente → API → MQTT Broker → Dispositivo
```

Ver MODERNIZATION.md para diagramas detallados y arquitectura completa.
