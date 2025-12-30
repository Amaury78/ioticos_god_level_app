# Guía de Contribución - IoTicos God Level App

¡Gracias por tu interés en contribuir a IoTicos God Level App! Este documento te guiará a través del proceso de contribución.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Guías de Estilo](#guías-de-estilo)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 🤝 Código de Conducta

Este proyecto y todos los que participan en él se rigen por el [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/). Al participar, se espera que mantengas este código. Por favor reporta comportamientos inaceptables abriendo un issue.

## 🚀 Cómo Contribuir

### Tipos de Contribuciones

Aceptamos varios tipos de contribuciones:

1. **Corrección de Bugs** 🐛
2. **Nuevas Funcionalidades** ✨
3. **Mejoras de Documentación** 📚
4. **Mejoras de Rendimiento** ⚡
5. **Refactoring de Código** 🔨
6. **Tests** 🧪

### Antes de Empezar

1. **Busca Issues Existentes**: Verifica si ya existe un issue para lo que quieres trabajar
2. **Crea un Issue**: Si no existe, crea uno describiendo lo que planeas hacer
3. **Espera Feedback**: Espera comentarios de los mantenedores antes de empezar a trabajar

## 💻 Configuración del Entorno de Desarrollo

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker y Docker Compose
- Git

### Configuración Inicial

```bash
# 1. Fork el repositorio en GitHub

# 2. Clonar tu fork
git clone https://github.com/TU-USUARIO/ioticos_god_level_app.git
cd ioticos_god_level_app

# 3. Agregar upstream remoto
git remote add upstream https://github.com/Amaury78/ioticos_god_level_app.git

# 4. Instalar dependencias
npm install

# 5. Copiar variables de entorno
cp .env.example .env

# 6. Generar JWT secret
openssl rand -base64 32
# Copiar resultado en .env como JWT_SECRET

# 7. Iniciar servicios con Docker
docker-compose up -d

# 8. En otra terminal, iniciar backend
npm run devn

# 9. En otra terminal, iniciar frontend
npm run dev
```

### Verificar Instalación

Accede a:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/api/health

## 🔄 Proceso de Pull Request

### 1. Crear una Rama

```bash
# Asegúrate de estar en la rama principal actualizada
git checkout main
git pull upstream main

# Crear nueva rama para tu feature/fix
git checkout -b feature/nombre-descriptivo
# o
git checkout -b fix/nombre-del-bug
```

### 2. Hacer Cambios

- Haz commits pequeños y frecuentes
- Escribe mensajes de commit descriptivos
- Sigue las guías de estilo del proyecto

### 3. Probar tus Cambios

```bash
# Lint (cuando esté configurado)
npm run lint

# Tests (cuando estén configurados)
npm test

# Build
npm run build
```

### 4. Actualizar tu Rama

```bash
# Obtener últimos cambios del upstream
git fetch upstream
git rebase upstream/main

# Resolver conflictos si los hay
# Luego continuar el rebase
git rebase --continue
```

### 5. Push y Crear PR

```bash
# Push a tu fork
git push origin feature/nombre-descriptivo

# Ir a GitHub y crear Pull Request
```

### Plantilla de Pull Request

```markdown
## Descripción
[Descripción clara de qué hace este PR]

## Tipo de Cambio
- [ ] Bug fix (cambio que corrige un issue)
- [ ] Nueva funcionalidad (cambio que agrega funcionalidad)
- [ ] Breaking change (cambio que afecta funcionalidad existente)
- [ ] Documentación

## ¿Cómo se ha Probado?
[Describe cómo probaste tus cambios]

## Checklist
- [ ] Mi código sigue el estilo del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código en áreas complejas
- [ ] He actualizado la documentación correspondiente
- [ ] Mis cambios no generan nuevas advertencias
- [ ] He agregado tests que prueban mi corrección/funcionalidad
- [ ] Tests unitarios nuevos y existentes pasan localmente

## Screenshots (si aplica)
[Agrega screenshots si hay cambios visuales]

## Issues Relacionados
Closes #[issue number]
```

## 📝 Guías de Estilo

### JavaScript/Node.js

- Usa **2 espacios** para indentación
- Usa **comillas simples** para strings
- Usa **const** y **let**, nunca **var**
- Nombra funciones y variables de forma descriptiva
- Comenta código complejo

```javascript
// ✅ Bien
const getUserById = async (userId) => {
  const user = await User.findById(userId);
  return user;
};

// ❌ Mal
var getUser = function(id) {
  return User.findById(id);
}
```

### Vue.js/Nuxt

- Usa **Composition API** en componentes nuevos
- Nombra componentes con PascalCase
- Props con camelCase, emits con kebab-case
- Usa TypeScript cuando sea posible

```vue
<!-- ✅ Bien -->
<script setup lang="ts">
const props = defineProps<{
  userId: string
}>()

const emit = defineEmits<{
  'user-selected': [userId: string]
}>()
</script>

<!-- ❌ Mal -->
<script>
export default {
  props: ['userId'],
  methods: {
    selectUser() {
      this.$emit('userSelected', this.userId)
    }
  }
}
</script>
```

### Git Commits

Sigue [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato
<type>(<scope>): <subject>

# Tipos
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Cambios en documentación
style:    Formato, punto y coma, etc; sin cambio de código
refactor: Refactoring sin cambiar funcionalidad
test:     Agregar tests
chore:    Mantenimiento, configuración, etc

# Ejemplos
feat(auth): add JWT refresh token functionality
fix(mqtt): resolve connection timeout issue
docs(readme): update installation instructions
refactor(api): simplify user authentication logic
```

## 🐛 Reportar Bugs

### Antes de Reportar

1. **Verifica la documentación**: Asegúrate de que no sea comportamiento esperado
2. **Busca issues existentes**: Puede que ya esté reportado
3. **Prueba con la última versión**: El bug puede estar ya corregido

### Template de Bug Report

```markdown
**Descripción del Bug**
[Descripción clara y concisa del bug]

**Para Reproducir**
Pasos para reproducir:
1. Ir a '...'
2. Hacer click en '....'
3. Scroll hasta '....'
4. Ver error

**Comportamiento Esperado**
[Qué esperabas que sucediera]

**Screenshots**
[Si es posible, agrega screenshots]

**Entorno:**
 - OS: [e.g. Ubuntu 22.04]
 - Node: [e.g. 20.0.0]
 - Browser: [e.g. chrome 120]
 - Version: [e.g. 2.0.0]

**Logs**
```
[Pegar logs relevantes aquí]
```

**Contexto Adicional**
[Cualquier otro contexto sobre el problema]
```

## 💡 Sugerir Mejoras

### Template de Feature Request

```markdown
**¿Tu feature request está relacionado con un problema?**
[Descripción clara del problema. Ej: "Siempre me frustra cuando..."]

**Describe la solución que te gustaría**
[Descripción clara de lo que quieres que suceda]

**Describe alternativas que consideraste**
[Descripción de soluciones alternativas]

**Contexto Adicional**
[Capturas, mockups, ejemplos de otros proyectos, etc]

**Impacto Estimado**
- [ ] Mejora UX significativamente
- [ ] Resuelve problema común
- [ ] Facilita desarrollo
- [ ] Mejora rendimiento
- [ ] Mejora seguridad
```

## 📚 Recursos Útiles

### Documentación del Proyecto
- [MODERNIZATION.md](./MODERNIZATION.md) - Guía de modernización
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Guía de despliegue

### Tecnologías Principales
- [Nuxt.js](https://nuxt.com/docs)
- [Vue.js](https://vuejs.org/guide/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [MQTT](https://mqtt.org/)

### Herramientas de Desarrollo
- [Docker](https://docs.docker.com/)
- [GitHub Actions](https://docs.github.com/en/actions)

## 🎖️ Reconocimientos

Los contribuidores serán listados en el [README.md](./README.md) y en GitHub Contributors.

## ❓ Preguntas

Si tienes preguntas, puedes:
1. Abrir un [Discussion](https://github.com/Amaury78/ioticos_god_level_app/discussions)
2. Abrir un [Issue](https://github.com/Amaury78/ioticos_god_level_app/issues)
3. Contactar a los mantenedores

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones serán licenciadas bajo la misma licencia MIT del proyecto.

---

¡Gracias por contribuir a IoTicos God Level App! 🚀
