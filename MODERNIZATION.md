# Guía de Modernización - IoTicos God Level App

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Estado Actual del Proyecto](#estado-actual-del-proyecto)
3. [Fase 1: Preparación](#fase-1-preparación)
4. [Fase 2: Modernización del Backend](#fase-2-modernización-del-backend)
5. [Fase 3: Migración a Nuxt 3 y Vue 3](#fase-3-migración-a-nuxt-3-y-vue-3)
6. [Fase 4: Dockerización](#fase-4-dockerización)
7. [Fase 5: CI/CD con GitHub Actions](#fase-5-cicd-con-github-actions)
8. [Fase 6: Testing y Calidad](#fase-6-testing-y-calidad)
9. [Referencias y Recursos](#referencias-y-recursos)

---

## 🎯 Introducción

Esta guía proporciona un plan paso a paso para modernizar la plataforma IoTicos God Level App, transformándola de una aplicación con tecnologías de 2019-2020 a un proyecto moderno que sigue las mejores prácticas de 2025.

### Objetivos Principales
- ✅ Migrar de Nuxt 2 (Vue 2) a Nuxt 3 (Vue 3 con Composition API)
- ✅ Actualizar todas las dependencias obsoletas
- ✅ Implementar prácticas modernas de seguridad
- ✅ Dockerizar toda la aplicación
- ✅ Implementar CI/CD automatizado
- ✅ Mejorar documentación y testing

### Stack Tecnológico Final
- **Frontend**: Nuxt 3, Vue 3, Element Plus, Bootstrap 5, TypeScript
- **Backend**: Express.js (latest), Mongoose 8+, JWT, MQTT 5
- **Base de Datos**: MongoDB 7+
- **DevOps**: Docker, GitHub Actions
- **Testing**: Vitest, Playwright

---

## 📊 Estado Actual del Proyecto

### Dependencias Actuales (Frontend)
```json
{
  "nuxt": "^2.14.7",
  "element-ui": "^2.14.1",
  "bootstrap": "4.3.1",
  "chart.js": "^2.7.1",
  "d3": "^5.7.0",
  "vue-chartjs": "^3.4.0",
  "node-sass": "^4.12.0",
  "sass-loader": "^7.3.1"
}
```

### Dependencias Actuales (Backend)
```json
{
  "express": "^4.17.1",
  "mongoose": "^5.10.15",
  "jsonwebtoken": "^8.5.1",
  "mqtt": "^4.2.5",
  "bcrypt": "^5.0.0"
}
```

### Problemas Identificados
1. **Seguridad**: JWT secret hardcodeado, sin validación de entrada
2. **Obsolescencia**: Node-sass deprecado, Element UI no compatible con Vue 3
3. **Arquitectura**: No hay separación clara frontend/backend en producción
4. **DevOps**: Sin Docker, sin CI/CD
5. **Testing**: Sin infraestructura de testing

---

## 🚀 Fase 1: Preparación

### 1.1 Backup y Control de Versiones
```bash
# Crear rama de desarrollo
git checkout -b modernization/2025

# Hacer backup de configuraciones importantes
cp package.json package.json.backup
cp nuxt.config.js nuxt.config.js.backup
```

### 1.2 Crear Variables de Entorno
Crear `.env.example` en la raíz:
```env
# API Configuration
API_PORT=3001
NODE_ENV=development

# MongoDB Configuration
MONGO_USERNAME=admin
MONGO_PASSWORD=your_secure_password
MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=ioticos_db

# JWT Configuration
JWT_SECRET=your_very_secure_jwt_secret_here_min_32_chars
JWT_EXPIRATION=30d

# MQTT Configuration
MQTT_PREFIX=/ioticos
MQTT_HOST=mqtt://localhost
MQTT_PORT=1883
MQTT_USERNAME=mqtt_user
MQTT_PASSWORD=mqtt_password

# Frontend Configuration
AXIOS_BASE_URL=http://localhost:3001
NUXT_PUBLIC_API_BASE=http://localhost:3001/api

# SSL/Security
SSLREDIRECT=false

# EMQX API (if using EMQX)
EMQX_API_HOST=http://localhost:18083
EMQX_API_USER=admin
EMQX_API_PASSWORD=public
```

### 1.3 Documentar Arquitectura Actual
Ver [ARCHITECTURE.md](./ARCHITECTURE.md) para diagramas detallados.

---

## 🔧 Fase 2: Modernización del Backend

### 2.1 Actualizar Dependencias del Backend

#### Paso 1: Actualizar package.json
```bash
cd api  # Si separamos el backend
# O en la raíz si mantenemos estructura monorepo
```

Actualizar `package.json` con versiones modernas:
```json
{
  "dependencies": {
    "express": "^4.19.2",
    "mongoose": "^8.1.0",
    "jsonwebtoken": "^9.0.2",
    "mqtt": "^5.3.5",
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.1",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "express-rate-limit": "^7.1.5",
    "morgan": "^1.10.0",
    "colors": "^1.4.0"
  },
  "devDependencies": {
    "@babel/cli": "^7.23.9",
    "@babel/core": "^7.23.9",
    "@babel/node": "^7.23.9",
    "@babel/preset-env": "^7.23.9",
    "nodemon": "^3.0.3"
  }
}
```

#### Paso 2: Instalar dependencias
```bash
npm install
```

**Documentación oficial**:
- Express: https://expressjs.com/
- Mongoose: https://mongoosejs.com/docs/guide.html
- JWT: https://github.com/auth0/node-jsonwebtoken
- MQTT: https://github.com/mqttjs/MQTT.js

### 2.2 Implementar Seguridad Moderna

#### 2.2.1 Mover JWT Secret a Variables de Entorno
**Archivo**: `api/middlewares/authentication.js`

**ANTES**:
```javascript
jwt.verify(token, "securePasswordHere", (err, decoded) => {
  // ...
});
```

**DESPUÉS**:
```javascript
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

jwt.verify(token, JWT_SECRET, (err, decoded) => {
  // ...
});
```

#### 2.2.2 Agregar Helmet para Seguridad HTTP
**Archivo**: `api/index.js`

```javascript
const helmet = require('helmet');

// Agregar después de crear la app
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

**Documentación**: https://helmetjs.github.io/

#### 2.2.3 Implementar Rate Limiting
**Archivo**: `api/index.js`

```javascript
const rateLimit = require('express-rate-limit');

// Limitar intentos de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos
  message: 'Too many login attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Aplicar a rutas específicas
app.use('/api/login', loginLimiter);

// Rate limit general
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);
```

**Documentación**: https://github.com/express-rate-limit/express-rate-limit

#### 2.2.4 Agregar Validación de Entrada
**Archivo**: `api/routes/users.js`

```javascript
const { body, validationResult } = require('express-validator');

// Validación para login
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Must be a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

router.post('/login', loginValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error', 
      errors: errors.array() 
    });
  }
  // ... resto del código
});
```

**Documentación**: https://express-validator.github.io/docs/

### 2.3 Actualizar Conexión a MongoDB

#### Archivo: `api/index.js`

**ANTES**:
```javascript
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  authSource: "admin"
};

mongoose.connect(uri, options);
```

**DESPUÉS**:
```javascript
// Mongoose 8+ ya no necesita useNewUrlParser ni useUnifiedTopology
const options = {
  authSource: "admin",
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose.connect(uri, options)
  .then(() => {
    console.log("✔ Mongo Successfully Connected!".green);
    global.check_mqtt_superuser();
  })
  .catch(err => {
    console.log("Mongo Connection Failed".red);
    console.error(err);
    process.exit(1); // Exit on connection failure
  });

// Manejo de errores de conexión
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
```

**Documentación**: https://mongoosejs.com/docs/migrating_to_8.html

### 2.4 Mejorar Implementación MQTT

#### 2.4.1 Agregar Lógica de Reconexión
Crear `api/services/mqttService.js`:

```javascript
const mqtt = require('mqtt');

class MQTTService {
  constructor() {
    this.client = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
  }

  connect() {
    const options = {
      host: process.env.MQTT_HOST,
      port: process.env.MQTT_PORT,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      reconnectPeriod: 5000,
      keepalive: 60,
      clean: true,
      clientId: `ioticos_api_${Math.random().toString(16).slice(3)}`,
    };

    this.client = mqtt.connect(options);

    this.client.on('connect', () => {
      console.log('✔ MQTT Connected!'.green);
      this.reconnectAttempts = 0;
    });

    this.client.on('error', (err) => {
      console.error('MQTT Error:', err);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.client.end();
      }
    });

    this.client.on('close', () => {
      console.log('MQTT connection closed');
    });

    this.client.on('reconnect', () => {
      console.log('MQTT attempting to reconnect...');
    });

    return this.client;
  }

  publish(topic, message, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.client.connected) {
        return reject(new Error('MQTT client not connected'));
      }

      this.client.publish(topic, message, options, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  subscribe(topic, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.client || !this.client.connected) {
        return reject(new Error('MQTT client not connected'));
      }

      this.client.subscribe(topic, options, (err, granted) => {
        if (err) {
          reject(err);
        } else {
          resolve(granted);
        }
      });
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
    }
  }
}

module.exports = new MQTTService();
```

**Documentación**: https://github.com/mqttjs/MQTT.js#api

### 2.5 Agregar Documentación API con Swagger

```bash
npm install swagger-jsdoc swagger-ui-express
```

Crear `api/swagger.js`:
```javascript
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IoTicos God Level API',
      version: '2.0.0',
      description: 'API for IoT device management',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
```

Agregar a `api/index.js`:
```javascript
const { swaggerUi, specs } = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
```

**Documentación**: https://swagger.io/docs/

---

## 🎨 Fase 3: Migración a Nuxt 3 y Vue 3

### 3.1 Crear Nuevo Proyecto Nuxt 3

```bash
# En un directorio temporal
npx nuxi@latest init ioticos-nuxt3

# Copiar estructura base
cd ioticos-nuxt3
```

### 3.2 Configuración de Nuxt 3

#### Crear `nuxt.config.ts`:
```typescript
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  ssr: false, // SPA mode como el proyecto original
  
  runtimeConfig: {
    // Private keys (server-only)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
      mqttHost: process.env.MQTT_HOST || 'ws://localhost:9001',
      mqttPort: process.env.MQTT_PORT || '9001',
      mqttPrefix: process.env.MQTT_PREFIX || '/ioticos',
    }
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@element-plus/nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: [
    '~/assets/css/main.css',
    '~/assets/sass/black-dashboard.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/sass/_variables.scss" as *;'
        }
      }
    }
  },

  app: {
    head: {
      title: 'IoT GL',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'IoTicos God Level Platform' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css?family=Poppins:200,300,400,600,700,800' 
        },
        { 
          rel: 'stylesheet', 
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' 
        }
      ]
    }
  },

  compatibilityDate: '2025-01-01',
})
```

**Documentación**: https://nuxt.com/docs/getting-started/configuration

### 3.3 Reemplazar Dependencias Obsoletas

#### 3.3.1 Element UI → Element Plus

**Instalar**:
```bash
npm install element-plus @element-plus/nuxt
```

**Uso en componentes**:

**ANTES (Vue 2 + Element UI)**:
```vue
<template>
  <el-button type="primary" @click="handleClick">Click</el-button>
</template>

<script>
export default {
  methods: {
    handleClick() {
      // ...
    }
  }
}
</script>
```

**DESPUÉS (Vue 3 + Element Plus)**:
```vue
<template>
  <el-button type="primary" @click="handleClick">Click</el-button>
</template>

<script setup lang="ts">
const handleClick = () => {
  // ...
}
</script>
```

**Documentación**: https://element-plus.org/

#### 3.3.2 Bootstrap 4 → Bootstrap 5

```bash
npm install bootstrap@5.3.2
```

**Cambios principales**:
- `.ml-*` → `.ms-*` (margin-left → margin-start)
- `.mr-*` → `.me-*` (margin-right → margin-end)
- `.pl-*` → `.ps-*` (padding-left → padding-start)
- `.pr-*` → `.pe-*` (padding-right → padding-end)
- jQuery ya no es requerido
- Popper.js v2 incluido

**Documentación**: https://getbootstrap.com/docs/5.3/migration/

#### 3.3.3 Chart.js 2 → Chart.js 4

```bash
npm install chart.js@^4.4.1 vue-chartjs@^5.3.0
```

**ANTES**:
```javascript
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  mounted() {
    this.renderChart(data, options)
  }
}
```

**DESPUÉS**:
```vue
<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const chartData = ref({
  labels: ['January', 'February', 'March'],
  datasets: [{ data: [40, 20, 12] }]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false
})
</script>
```

**Documentación**: https://www.chartjs.org/docs/latest/

#### 3.3.4 D3.js 5 → D3.js 7

```bash
npm install d3@^7.8.5
```

**Cambios menores**, la API es mayormente compatible. Principal cambio:
```javascript
// Importación moderna
import * as d3 from 'd3'
// O importar solo lo necesario
import { select, scaleLinear } from 'd3'
```

**Documentación**: https://d3js.org/

#### 3.3.5 Node-sass → Dart Sass

```bash
npm install -D sass
```

**No requiere cambios en el código**, solo actualizar la configuración de build (ya incluida en nuxt.config.ts).

### 3.4 Migrar Store de Vuex a Pinia

**Instalar Pinia**:
```bash
npm install pinia @pinia/nuxt
```

**ANTES (Vuex - store/index.js)**:
```javascript
export const state = () => ({
  devices: [],
  selectedDevice: null
})

export const mutations = {
  SET_DEVICES(state, devices) {
    state.devices = devices
  },
  SET_SELECTED_DEVICE(state, device) {
    state.selectedDevice = device
  }
}

export const actions = {
  async fetchDevices({ commit }) {
    const devices = await this.$axios.$get('/api/devices')
    commit('SET_DEVICES', devices)
  }
}
```

**DESPUÉS (Pinia - stores/devices.ts)**:
```typescript
import { defineStore } from 'pinia'

export const useDevicesStore = defineStore('devices', {
  state: () => ({
    devices: [] as Device[],
    selectedDevice: null as Device | null,
  }),

  getters: {
    deviceCount: (state) => state.devices.length,
  },

  actions: {
    async fetchDevices() {
      const { data } = await useFetch('/api/devices')
      this.devices = data.value || []
    },

    selectDevice(device: Device) {
      this.selectedDevice = device
    },
  },
})
```

**Uso en componentes**:
```vue
<script setup lang="ts">
const devicesStore = useDevicesStore()

onMounted(() => {
  devicesStore.fetchDevices()
})
</script>
```

**Documentación**: https://pinia.vuejs.org/

### 3.5 Migrar Páginas a Composition API

**ANTES (pages/dashboard.vue - Options API)**:
```vue
<template>
  <div class="row" v-if="$store.state.devices.length > 0">
    <!-- ... -->
  </div>
</template>

<script>
export default {
  middleware: 'authenticated',
  data() {
    return {
      // ...
    }
  },
  mounted() {
    // ...
  },
  methods: {
    // ...
  }
}
</script>
```

**DESPUÉS (pages/dashboard.vue - Composition API)**:
```vue
<template>
  <div class="row" v-if="devicesStore.devices.length > 0">
    <div
      v-for="(widget, index) in devicesStore.selectedDevice?.template.widgets"
      :key="index"
      :class="widget.column"
    >
      <component :is="widgetComponent(widget)" :config="fixWidget(widget)" />
    </div>
  </div>
  <div v-else>Select a Device...</div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'authenticated'
})

const devicesStore = useDevicesStore()

const widgetComponent = (widget: Widget) => {
  const componentMap: Record<string, any> = {
    numberchart: resolveComponent('Rtnumberchart'),
    switch: resolveComponent('Iotswitch'),
    button: resolveComponent('Iotbutton'),
    indicator: resolveComponent('Iotindicator'),
  }
  return componentMap[widget.widget]
}

const fixWidget = (widget: Widget) => {
  return {
    ...widget,
    userId: devicesStore.selectedDevice?.userId,
    dId: devicesStore.selectedDevice?._id,
  }
}

onMounted(async () => {
  await devicesStore.fetchDevices()
})
</script>
```

**Documentación**: https://vuejs.org/guide/extras/composition-api-faq.html

### 3.6 Migrar Componentes

**Ejemplo: BaseButton.vue**

**ANTES**:
```vue
<template>
  <button :class="classes" :type="nativeType" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    type: String,
    nativeType: {
      type: String,
      default: 'button'
    }
  },
  computed: {
    classes() {
      return `btn btn-${this.type || 'default'}`
    }
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
```

**DESPUÉS**:
```vue
<template>
  <button :class="classes" :type="nativeType" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
interface Props {
  type?: string
  nativeType?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  nativeType: 'button'
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const classes = computed(() => `btn btn-${props.type}`)

const handleClick = (evt: MouseEvent) => {
  emit('click', evt)
}
</script>
```

### 3.7 Actualizar Middleware

**ANTES (middleware/authenticated.js)**:
```javascript
export default function ({ store, redirect }) {
  if (!store.state.auth) {
    return redirect('/login')
  }
}
```

**DESPUÉS (middleware/authenticated.ts)**:
```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
```

### 3.8 Migrar Layouts

**ANTES (layouts/default.vue)**:
```vue
<template>
  <div class="wrapper">
    <side-bar />
    <div class="main-panel">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // ...
    }
  }
}
</script>
```

**DESPUÉS (layouts/default.vue)**:
```vue
<template>
  <div class="wrapper" :class="{ 'nav-open': sidebarOpen }">
    <Notifications />
    <SideBar 
      :background-color="sidebarBackground"
      short-title="GL"
      title="IoTicos GL"
    />
    <div class="main-panel">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
const sidebarBackground = ref('blue')
</script>
```

**Documentación**: https://nuxt.com/docs/guide/directory-structure/layouts

---

## 🐳 Fase 4: Dockerización

### 4.1 Dockerfile para Backend

Crear `backend.Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Exponer puerto
EXPOSE 3001

# Variable de entorno por defecto
ENV NODE_ENV=production

# Comando de inicio
CMD ["node", "api/index.js"]
```

### 4.2 Dockerfile para Frontend

Crear `frontend.Dockerfile`:
```dockerfile
FROM node:20-alpine as builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de la aplicación
RUN npm run build

# Etapa de producción
FROM node:20-alpine

WORKDIR /app

# Copiar archivos necesarios desde builder
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

# Instalar solo dependencias de producción
RUN npm ci --only=production

# Exponer puerto
EXPOSE 3000

ENV NODE_ENV=production

# Comando de inicio
CMD ["node", ".output/server/index.mjs"]
```

### 4.3 Docker Compose para Desarrollo

Crear `docker-compose.yml`:
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7
    container_name: ioticos-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME:-admin}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD:-admin123}
      MONGO_INITDB_DATABASE: ${MONGO_DATABASE:-ioticos_db}
    ports:
      - "${MONGO_PORT:-27017}:27017"
    volumes:
      - mongodb_data:/data/db
    networks:
      - ioticos-network

  mosquitto:
    image: eclipse-mosquitto:2
    container_name: ioticos-mqtt
    restart: unless-stopped
    ports:
      - "${MQTT_PORT:-1883}:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    networks:
      - ioticos-network

  backend:
    build:
      context: .
      dockerfile: backend.Dockerfile
    container_name: ioticos-backend
    restart: unless-stopped
    ports:
      - "${API_PORT:-3001}:3001"
    environment:
      - NODE_ENV=development
      - API_PORT=3001
      - MONGO_HOST=mongodb
      - MONGO_PORT=27017
      - MONGO_USERNAME=${MONGO_USERNAME:-admin}
      - MONGO_PASSWORD=${MONGO_PASSWORD:-admin123}
      - MONGO_DATABASE=${MONGO_DATABASE:-ioticos_db}
      - MQTT_HOST=mqtt://mosquitto
      - MQTT_PORT=1883
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb
      - mosquitto
    volumes:
      - ./api:/app/api
      - ./node_modules:/app/node_modules
    networks:
      - ioticos-network

  frontend:
    build:
      context: .
      dockerfile: frontend.Dockerfile
    container_name: ioticos-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - NUXT_PUBLIC_API_BASE=http://backend:3001/api
    depends_on:
      - backend
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.nuxt
    networks:
      - ioticos-network

volumes:
  mongodb_data:

networks:
  ioticos-network:
    driver: bridge
```

### 4.4 Configuración de Mosquitto

Crear `mosquitto/config/mosquitto.conf`:
```conf
# Mosquitto configuration for IoTicos

# Default listener
listener 1883
protocol mqtt

# WebSocket listener
listener 9001
protocol websockets

# Authentication (opcional - configurar según necesidades)
allow_anonymous true

# Persistence
persistence true
persistence_location /mosquitto/data/

# Logging
log_dest file /mosquitto/log/mosquitto.log
log_dest stdout
log_type error
log_type warning
log_type notice
log_type information

# Connection settings
max_connections -1
```

### 4.5 .dockerignore

Crear `.dockerignore`:
```
node_modules
npm-debug.log
.nuxt
.output
dist
.git
.gitignore
README.md
.env
.env.local
coverage
.vscode
.idea
```

### 4.6 Scripts Docker

Agregar a `package.json`:
```json
{
  "scripts": {
    "docker:dev": "docker-compose up",
    "docker:build": "docker-compose build",
    "docker:down": "docker-compose down",
    "docker:clean": "docker-compose down -v"
  }
}
```

**Uso**:
```bash
# Iniciar en desarrollo
npm run docker:dev

# Rebuild y start
npm run docker:build && npm run docker:dev

# Detener servicios
npm run docker:down

# Limpiar todo (incluyendo volúmenes)
npm run docker:clean
```

**Documentación**: 
- Docker: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/

---

## ⚙️ Fase 5: CI/CD con GitHub Actions

### 5.1 Workflow de Linting y Testing

Crear `.github/workflows/ci.yml`:
```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x]

    steps:
    - uses: actions/checkout@v4

    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run linter
      run: npm run lint

    - name: Run tests
      run: npm run test

    - name: Build application
      run: npm run build

    - name: Upload coverage
      uses: codecov/codecov-action@v3
      if: matrix.node-version == '20.x'
      with:
        files: ./coverage/coverage-final.json
        flags: unittests
        name: codecov-umbrella
```

### 5.2 Workflow de Seguridad

Crear `.github/workflows/security.yml`:
```yaml
name: Security Scan

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0' # Semanal

jobs:
  security:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Run npm audit
      run: npm audit --audit-level=moderate

    - name: Run Snyk Security Scan
      uses: snyk/actions/node@master
      env:
        SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
      with:
        args: --severity-threshold=high

    - name: Run Trivy vulnerability scanner
      uses: aquasecurity/trivy-action@master
      with:
        scan-type: 'fs'
        scan-ref: '.'
        format: 'sarif'
        output: 'trivy-results.sarif'

    - name: Upload Trivy results to GitHub Security
      uses: github/codeql-action/upload-sarif@v3
      with:
        sarif_file: 'trivy-results.sarif'
```

### 5.3 Workflow de Build y Deploy

Crear `.github/workflows/deploy.yml`:
```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
    tags:
      - 'v*'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
    - uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Log in to Container Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}

    - name: Extract metadata for Backend
      id: meta-backend
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-backend

    - name: Build and push Backend
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./backend.Dockerfile
        push: true
        tags: ${{ steps.meta-backend.outputs.tags }}
        labels: ${{ steps.meta-backend.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

    - name: Extract metadata for Frontend
      id: meta-frontend
      uses: docker/metadata-action@v5
      with:
        images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}-frontend

    - name: Build and push Frontend
      uses: docker/build-push-action@v5
      with:
        context: .
        file: ./frontend.Dockerfile
        push: true
        tags: ${{ steps.meta-frontend.outputs.tags }}
        labels: ${{ steps.meta-frontend.outputs.labels }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to production
      # Aquí irían los pasos específicos de tu infraestructura
      # Por ejemplo: AWS, DigitalOcean, etc.
      run: echo "Deploy to production"
```

### 5.4 Dependabot

Crear `.github/dependabot.yml`:
```yaml
version: 2
updates:
  # npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "your-github-username"
    labels:
      - "dependencies"
      - "npm"

  # Docker dependencies
  - package-ecosystem: "docker"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

**Documentación**: https://docs.github.com/en/actions

---

## 🧪 Fase 6: Testing y Calidad

### 6.1 Configurar Vitest

```bash
npm install -D vitest @vue/test-utils happy-dom @vitest/ui
```

Crear `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.nuxt/',
        'test/',
      ],
    },
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
```

### 6.2 Tests de Ejemplo

Crear `test/components/BaseButton.spec.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseButton from '@/components/BaseButton.vue'

describe('BaseButton', () => {
  it('renders properly', () => {
    const wrapper = mount(BaseButton, {
      props: { type: 'primary' },
      slots: { default: 'Click me' }
    })
    expect(wrapper.text()).toContain('Click me')
    expect(wrapper.classes()).toContain('btn-primary')
  })

  it('emits click event', async () => {
    const wrapper = mount(BaseButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
```

### 6.3 Configurar Playwright para E2E

```bash
npm install -D @playwright/test
npx playwright install
```

Crear `playwright.config.ts`:
```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

Crear `e2e/login.spec.ts`:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Login')
    await expect(page).toHaveURL('/login')
  })

  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })
})
```

### 6.4 ESLint y Prettier

```bash
npm install -D eslint @nuxt/eslint-config prettier eslint-config-prettier
```

Crear `.eslintrc.cjs`:
```javascript
module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config', 'prettier'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
  },
}
```

Crear `.prettierrc`:
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

### 6.5 Scripts de Testing

Actualizar `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write ."
  }
}
```

**Documentación**:
- Vitest: https://vitest.dev/
- Playwright: https://playwright.dev/
- ESLint: https://eslint.org/

---

## 📚 Referencias y Recursos

### Documentación Oficial

#### Frontend
- **Nuxt 3**: https://nuxt.com/docs
- **Vue 3**: https://vuejs.org/guide/introduction.html
- **Element Plus**: https://element-plus.org/
- **Chart.js**: https://www.chartjs.org/docs/latest/
- **D3.js**: https://d3js.org/

#### Backend
- **Express.js**: https://expressjs.com/
- **Mongoose**: https://mongoosejs.com/
- **MQTT.js**: https://github.com/mqttjs/MQTT.js
- **JWT**: https://jwt.io/

#### Seguridad
- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Helmet.js**: https://helmetjs.github.io/
- **Express Validator**: https://express-validator.github.io/

#### DevOps
- **Docker**: https://docs.docker.com/
- **GitHub Actions**: https://docs.github.com/en/actions

### Guías de Migración
- **Nuxt 2 to 3**: https://nuxt.com/docs/migration/overview
- **Vue 2 to 3**: https://v3-migration.vuejs.org/
- **Mongoose to 8**: https://mongoosejs.com/docs/migrating_to_8.html
- **Bootstrap 4 to 5**: https://getbootstrap.com/docs/5.3/migration/

### Mejores Prácticas 2025

#### Arquitectura
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
- **12 Factor App**: https://12factor.net/
- **Microservices**: https://microservices.io/

#### Seguridad
- **Node.js Security Best Practices**: https://nodejs.org/en/learn/getting-started/security-best-practices
- **JWT Best Practices**: https://curity.io/resources/learn/jwt-best-practices/

#### IoT
- **MQTT Best Practices**: https://www.hivemq.com/mqtt-essentials/
- **IoT Security**: https://www.iotsecurityfoundation.org/

### Herramientas Útiles
- **npm-check-updates**: Para actualizar dependencias
- **lighthouse**: Para auditoría de rendimiento
- **Snyk**: Para escaneo de vulnerabilidades
- **SonarQube**: Para análisis de código

---

## ✅ Checklist de Implementación

### Fase 1: Preparación
- [ ] Crear rama de modernización
- [ ] Hacer backup de archivos críticos
- [ ] Crear `.env.example`
- [ ] Documentar arquitectura actual

### Fase 2: Backend
- [ ] Actualizar dependencias
- [ ] Implementar Helmet
- [ ] Implementar Rate Limiting
- [ ] Agregar Express Validator
- [ ] Mover JWT secret a env
- [ ] Actualizar conexión MongoDB
- [ ] Mejorar MQTT service
- [ ] Agregar Swagger docs
- [ ] Testing backend

### Fase 3: Frontend
- [ ] Crear proyecto Nuxt 3
- [ ] Migrar configuración
- [ ] Instalar Element Plus
- [ ] Actualizar Bootstrap
- [ ] Migrar store a Pinia
- [ ] Migrar componentes a Composition API
- [ ] Migrar páginas
- [ ] Migrar layouts
- [ ] Migrar middleware
- [ ] Actualizar estilos (Dart Sass)
- [ ] Testing frontend

### Fase 4: Docker
- [ ] Crear Dockerfile backend
- [ ] Crear Dockerfile frontend
- [ ] Crear docker-compose.yml
- [ ] Configurar Mosquitto
- [ ] Probar stack completo

### Fase 5: CI/CD
- [ ] GitHub Actions para CI
- [ ] GitHub Actions para seguridad
- [ ] GitHub Actions para deploy
- [ ] Configurar Dependabot

### Fase 6: Testing
- [ ] Configurar Vitest
- [ ] Escribir tests unitarios
- [ ] Configurar Playwright
- [ ] Escribir tests E2E
- [ ] Configurar ESLint/Prettier

### Fase 7: Documentación
- [ ] README.md actualizado
- [ ] ARCHITECTURE.md completo
- [ ] CONTRIBUTING.md
- [ ] DEPLOYMENT.md
- [ ] API documentation

---

## 🚀 Próximos Pasos

Una vez completada la modernización, considerar:

1. **TypeScript Completo**: Migrar todo el código a TypeScript
2. **Microservicios**: Separar funcionalidades en servicios independientes
3. **Serverless**: Migrar funciones a AWS Lambda o similar
4. **GraphQL**: Considerar GraphQL en lugar de REST
5. **Real-time**: Mejorar comunicación real-time con WebSockets/Socket.io
6. **Monitoreo**: Implementar Prometheus + Grafana
7. **Logging**: Centralizar logs con ELK Stack
8. **CDN**: Implementar CDN para assets estáticos

---

## 🆘 Troubleshooting

### Problemas Comunes

#### Error: "Cannot find module '@nuxtjs/xxx'"
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error de MQTT Connection
- Verificar que el broker esté corriendo
- Verificar credenciales en `.env`
- Verificar puertos abiertos (1883, 9001)

#### Error de MongoDB Connection
- Verificar que MongoDB esté corriendo
- Verificar credenciales
- Verificar authSource en opciones de conexión

#### Build Errors con Sass
```bash
npm uninstall node-sass
npm install -D sass
```

---

**Versión**: 2.0.0  
**Última actualización**: Enero 2025  
**Autor**: IoTicos.org  
**Licencia**: MIT
