# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-15 (Modernization Release)

### 🎉 Major Changes

This release represents a complete modernization of the IoTicos God Level App platform with focus on security, scalability, and modern development practices.

### ✨ Added

#### Documentation
- **MODERNIZATION.md**: Comprehensive step-by-step modernization guide
- **ARCHITECTURE.md**: Detailed system architecture and data flow diagrams
- **DEPLOYMENT.md**: Complete deployment guide for multiple environments
- **CONTRIBUTING.md**: Contribution guidelines and development workflow
- **CHANGELOG.md**: This changelog file
- Updated **README.md** with modern structure and badges

#### Infrastructure & DevOps
- **Docker Support**: Complete containerization with Docker Compose
  - Backend Dockerfile for production builds
  - MongoDB 7 container with health checks
  - Mosquitto 2 MQTT broker with configuration
  - Frontend development container
  - Volume management for data persistence
- **GitHub Actions CI/CD**:
  - Continuous Integration workflow for linting and building
  - Docker image build and push workflow
  - Security scanning workflow (template)
- **.env.example**: Template with all required environment variables
- **.dockerignore**: Optimized Docker build context

#### Backend Security
- JWT secret management via environment variables with validation
- Input validation for authentication endpoints
- Improved error handling and consistent API responses
- Basic security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- CORS configuration from environment variables
- Health check endpoint (`/api/health`)
- Graceful shutdown handler for MongoDB connections
- MongoDB connection with modern error handling

#### Configuration
- Mosquitto MQTT broker configuration with WebSocket support
- Enhanced .gitignore for modern development

### 🔄 Changed

#### Dependencies
- **Mongoose**: 5.10.15 → 8.1.0 (major update with breaking changes)
- **jsonwebtoken**: 8.5.1 → 9.0.2 (security updates)
- **mqtt**: 4.2.5 → 5.3.5 (protocol improvements)
- **express**: 4.17.1 → 4.18.2 (security patches)
- **dotenv**: 8.2.0 → 16.4.1
- **bcrypt**: 5.0.0 → 5.1.1
- **core-js**: 3.7.0 → 3.35.0
- **nodemon**: Added to devDependencies (3.0.3)

#### Added New Dependencies
- **helmet**: 7.1.0 (HTTP security headers)
- **express-validator**: 7.0.1 (input validation)
- **mongoose-unique-validator**: 5.0.0 (updated version)

#### Configuration Updates
- Mongoose connection: Removed deprecated options (useNewUrlParser, useCreateIndex, useUnifiedTopology)
- MongoDB connection now uses promises with proper error handling
- API port now has default fallback (3001)
- Environment variables validated on startup

#### Code Quality
- Consistent error responses across API endpoints
- Better logging with colors package
- Improved code comments and documentation
- Added Node.js and npm version requirements in package.json

### 🔒 Security

- **Critical**: JWT secret moved from hardcoded to environment variable
- **High**: Added validation to ensure JWT_SECRET is at least 32 characters
- **Medium**: Input validation for email format and password length
- **Medium**: Added check for existing users before registration
- **Medium**: Basic security headers implementation
- **Low**: Improved error messages to avoid information leakage

### 🐛 Fixed

- MongoDB connection no longer logs sensitive credentials
- MongoDB connection properly handles disconnection events
- API server gracefully shuts down on SIGINT/SIGTERM
- Error handling in registration endpoint returns proper status codes
- Missing token now returns proper error message

### 📝 Documentation Improvements

- Complete modernization guide with 8 phases
- Architecture diagrams and data flow explanations
- Deployment instructions for 4 different scenarios
- Docker setup guide with troubleshooting
- Security best practices and checklist
- MQTT communication patterns documented
- Database schema documentation

### ⚠️ Breaking Changes

#### Mongoose 8.x Migration
- Removed `useNewUrlParser`, `useCreateIndex`, `useUnifiedTopology` options
- Connection now uses promise-based approach
- May require model updates for some advanced features

#### Environment Variables (Required)
The following environment variables are now **required**:
- `JWT_SECRET` (minimum 32 characters)
- `MONGO_USERNAME`
- `MONGO_PASSWORD`
- `MONGO_HOST`
- `MONGO_DATABASE`

Application will fail to start if these are not provided.

#### API Responses
- Error responses now have consistent structure
- Some error codes changed for REST API compliance:
  - Registration success: 200 → 201 (Created)
  - Missing credentials: returns 400 instead of processing

### 📦 Migration Guide

If upgrading from v1.x:

1. **Update Environment Variables**
   ```bash
   cp .env.example .env
   # Fill in all required values
   openssl rand -base64 32  # For JWT_SECRET
   ```

2. **Update Dependencies**
   ```bash
   npm install
   ```

3. **Test MongoDB Connection**
   - Update any code using deprecated Mongoose options
   - Test connection before deploying

4. **Update API Clients**
   - Check that error handling works with new response format
   - Verify JWT token handling

### 🚀 Upgrade Path

#### From 1.x to 2.0

**Backend:**
```bash
# 1. Backup data
docker-compose exec mongodb mongodump --out /backup

# 2. Update code
git pull origin main

# 3. Update .env
cp .env.example .env
# Edit with your values

# 4. Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

**Frontend:** (To be updated in Phase 3 - Nuxt 3 migration)

### 📊 Statistics

- **Files Changed**: 20+
- **Lines Added**: ~3000
- **Lines Removed**: ~100
- **New Documentation**: 4 major files
- **Dependencies Updated**: 12
- **New Dependencies**: 3
- **Docker Services**: 4 (frontend, backend, mongodb, mosquitto)
- **Security Improvements**: 10+

### 🔮 Coming Next (Roadmap)

#### Phase 3: Frontend Migration (Planned)
- Migrate to Nuxt 3
- Vue 3 with Composition API
- Element Plus (Element UI replacement)
- Bootstrap 5
- Chart.js 4
- D3.js 7
- Pinia state management

#### Phase 4: Testing & Quality (Planned)
- Vitest for unit testing
- Playwright for E2E testing
- ESLint & Prettier configuration
- Test coverage reporting

#### Phase 5: Advanced Features (Planned)
- Swagger/OpenAPI documentation
- Enhanced rate limiting per endpoint
- Advanced MQTT reconnection logic
- WebSocket support for real-time updates
- Redis caching layer
- Comprehensive monitoring

### 🙏 Contributors

- **IoTicos.org** - Original platform development
- **Modernization Team** - 2025 updates and improvements

### 📝 Notes

This is a modernization-in-progress release. The platform maintains backward compatibility for the most part, but some breaking changes were necessary for security and best practices compliance.

For detailed migration instructions, see [MODERNIZATION.md](./MODERNIZATION.md).

---

## [1.0.0] - 2021-03-11 (Original Release)

### Initial Release

- Nuxt 2 + Vue 2 frontend
- Express.js backend
- MongoDB with Mongoose
- MQTT communication for IoT devices
- User authentication with JWT
- Device management
- Real-time dashboards with widgets
- Template system for devices
- Alarm system
- Data visualization with Chart.js and D3.js

---

[2.0.0]: https://github.com/Amaury78/ioticos_god_level_app/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/Amaury78/ioticos_god_level_app/releases/tag/v1.0.0
