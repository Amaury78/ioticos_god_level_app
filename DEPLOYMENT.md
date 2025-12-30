# Guía de Despliegue - IoTicos God Level App

## 🚀 Opciones de Despliegue

### Opción 1: Desarrollo Local con Docker

#### Prerrequisitos
- Docker y Docker Compose instalados
- Git instalado
- Puertos disponibles: 3000, 3001, 27017, 1883, 9001

#### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Amaury78/ioticos_god_level_app.git
cd ioticos_god_level_app
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus valores
nano .env  # o tu editor preferido
```

3. **Generar JWT secret seguro**
```bash
# En Linux/Mac
openssl rand -base64 32

# Copiar el resultado en .env como JWT_SECRET
```

4. **Iniciar servicios**
```bash
docker-compose up -d
```

5. **Verificar que todo esté corriendo**
```bash
docker-compose ps
```

6. **Acceder a la aplicación**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- MongoDB: localhost:27017
- MQTT: localhost:1883 (WebSocket: 9001)

7. **Ver logs**
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo frontend
docker-compose logs -f frontend
```

8. **Detener servicios**
```bash
docker-compose down
```

---

### Opción 2: Despliegue en VPS (DigitalOcean, Linode, etc.)

#### Prerrequisitos
- VPS con Ubuntu 22.04 LTS
- Dominio configurado (opcional pero recomendado)
- SSH access

#### Pasos

1. **Conectar al servidor**
```bash
ssh root@tu-servidor-ip
```

2. **Actualizar sistema**
```bash
apt update && apt upgrade -y
```

3. **Instalar Docker y Docker Compose**
```bash
# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Docker Compose
apt install docker-compose-plugin -y
```

4. **Instalar Git**
```bash
apt install git -y
```

5. **Clonar repositorio**
```bash
cd /opt
git clone https://github.com/Amaury78/ioticos_god_level_app.git
cd ioticos_god_level_app
```

6. **Configurar variables de entorno para producción**
```bash
cp .env.example .env
nano .env
```

Configuración recomendada para producción:
```env
NODE_ENV=production
API_PORT=3001
MONGO_USERNAME=admin
MONGO_PASSWORD=<password-seguro-generado>
JWT_SECRET=<secret-seguro-generado>
SSLREDIRECT=true
FRONTEND_URL=https://tu-dominio.com
```

7. **Configurar firewall**
```bash
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 1883/tcp  # MQTT
ufw allow 9001/tcp  # MQTT WebSocket
ufw enable
```

8. **Iniciar servicios**
```bash
docker-compose up -d
```

9. **Configurar Nginx como reverse proxy (opcional)**
```bash
apt install nginx -y
```

Crear `/etc/nginx/sites-available/ioticos`:
```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
    }
}
```

Activar sitio:
```bash
ln -s /etc/nginx/sites-available/ioticos /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

10. **Configurar SSL con Let's Encrypt**
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d tu-dominio.com
```

---

### Opción 3: Despliegue con Docker Swarm (Alta Disponibilidad)

#### Prerrequisitos
- 3+ servidores Ubuntu 22.04
- Docker instalado en todos

#### Pasos

1. **Inicializar Swarm en el nodo manager**
```bash
docker swarm init --advertise-addr <IP-del-manager>
```

2. **Unir nodos workers**
```bash
# Copiar el comando que genera el init y ejecutarlo en cada worker
docker swarm join --token <token> <manager-ip>:2377
```

3. **Crear red overlay**
```bash
docker network create --driver overlay ioticos-network
```

4. **Desplegar stack**
```bash
docker stack deploy -c docker-compose.yml ioticos
```

5. **Verificar servicios**
```bash
docker service ls
docker stack ps ioticos
```

---

### Opción 4: Kubernetes (K8s)

Para despliegue en Kubernetes, consultar la guía detallada en `docs/kubernetes-deployment.md` (por crear).

---

## 🔧 Configuración Post-Despliegue

### Crear Usuario Administrador

1. Acceder al frontend
2. Registrar primera cuenta (será admin)
3. O usar API directamente:

```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@ioticos.org",
    "password": "SecurePassword123!"
  }'
```

### Configurar MQTT Broker

Si usas autenticación en Mosquitto:

1. Crear archivo de passwords:
```bash
docker-compose exec mosquitto mosquitto_passwd -c /mosquitto/config/passwd usuario
```

2. Actualizar `mosquitto.conf`:
```conf
allow_anonymous false
password_file /mosquitto/config/passwd
```

3. Reiniciar:
```bash
docker-compose restart mosquitto
```

---

## 📊 Monitoreo

### Logs

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend

# Últimas 100 líneas
docker-compose logs --tail=100 backend
```

### Salud de Servicios

```bash
# Estado de contenedores
docker-compose ps

# Uso de recursos
docker stats
```

### Backups

#### MongoDB
```bash
# Backup manual
docker-compose exec mongodb mongodump --out /data/backup/$(date +%Y%m%d)

# Restaurar
docker-compose exec mongodb mongorestore /data/backup/20250115
```

#### Automatizar backups (cron)
```bash
# Editar crontab
crontab -e

# Agregar línea para backup diario a las 2 AM
0 2 * * * cd /opt/ioticos_god_level_app && docker-compose exec -T mongodb mongodump --out /data/backup/$(date +\%Y\%m\%d)
```

---

## 🔄 Actualización

### Actualizar a Nueva Versión

1. **Backup de datos**
```bash
docker-compose exec mongodb mongodump --out /backup
```

2. **Detener servicios**
```bash
docker-compose down
```

3. **Actualizar código**
```bash
git pull origin main
```

4. **Rebuild imágenes**
```bash
docker-compose build --no-cache
```

5. **Iniciar servicios**
```bash
docker-compose up -d
```

6. **Verificar logs**
```bash
docker-compose logs -f
```

---

## 🆘 Troubleshooting

### Problema: "Cannot connect to MongoDB"

**Solución**:
```bash
# Verificar que MongoDB está corriendo
docker-compose ps

# Ver logs
docker-compose logs mongodb

# Reiniciar
docker-compose restart mongodb
```

### Problema: "MQTT connection failed"

**Solución**:
```bash
# Verificar configuración
cat mosquitto/config/mosquitto.conf

# Verificar logs
docker-compose logs mosquitto

# Test de conexión
docker-compose exec mosquitto mosquitto_sub -t test -v
```

### Problema: "Port already in use"

**Solución**:
```bash
# Identificar proceso usando el puerto
sudo lsof -i :3000

# Matar proceso
sudo kill -9 <PID>
```

### Problema: "Out of disk space"

**Solución**:
```bash
# Limpiar contenedores no usados
docker system prune -a

# Limpiar volúmenes no usados
docker volume prune

# Ver uso de espacio
df -h
du -sh /var/lib/docker
```

---

## 🔒 Seguridad

### Checklist de Seguridad para Producción

- [ ] JWT_SECRET generado de forma segura (min 32 chars)
- [ ] Passwords de MongoDB seguros
- [ ] HTTPS configurado (Let's Encrypt)
- [ ] Firewall configurado
- [ ] MQTT con autenticación
- [ ] Rate limiting activo
- [ ] CORS configurado correctamente
- [ ] Backups automatizados
- [ ] Logs centralizados
- [ ] Monitoreo activo

---

## 📞 Soporte

Para problemas o preguntas:
- GitHub Issues: https://github.com/Amaury78/ioticos_god_level_app/issues
- Documentación completa: Ver MODERNIZATION.md
- Arquitectura: Ver ARCHITECTURE.md

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025
