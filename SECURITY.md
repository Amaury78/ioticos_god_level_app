# Security Policy

## 🔒 Reporting a Vulnerability

We take the security of IoTicos God Level App seriously. If you discover a security vulnerability, please follow these steps:

### Do NOT

- ❌ Open a public GitHub issue
- ❌ Disclose the vulnerability publicly
- ❌ Test the vulnerability on production systems you don't own

### Do

1. ✅ Email the details to the maintainers (via GitHub contact)
2. ✅ Include detailed steps to reproduce the vulnerability
3. ✅ Allow reasonable time for a fix before public disclosure
4. ✅ Provide your contact information for follow-up

### What to Include

When reporting a vulnerability, please include:

- **Type of vulnerability** (e.g., XSS, SQL injection, authentication bypass)
- **Full paths** of source file(s) related to the vulnerability
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the vulnerability
- **Suggested fix** (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Target**: Within 30 days for critical issues, 90 days for others

## 🛡️ Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x.x   | ✅ Yes             |
| 1.x.x   | ⚠️ Security fixes only |
| < 1.0   | ❌ No              |

## 🔐 Security Features

### Current Implementation

#### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ JWT secret from environment variables (min 32 chars)
- ✅ Token expiration (configurable)
- ✅ Token validation on protected routes

#### Input Validation
- ✅ Email format validation
- ✅ Password length validation (min 6 chars)
- ✅ Duplicate user check on registration
- ✅ Required field validation

#### Security Headers
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block

#### Database Security
- ✅ MongoDB authentication
- ✅ Password exclusion from API responses
- ✅ Connection string not exposed in logs

#### MQTT Security
- ✅ Per-user MQTT credentials
- ✅ Topic-based access control
- ⚠️ Anonymous access enabled by default (should be disabled in production)

### Planned Improvements

#### Short Term (Phase 2)
- [ ] Helmet.js for comprehensive security headers
- [ ] Express-validator for all endpoints
- [ ] Rate limiting per endpoint
- [ ] Request size limits
- [ ] Content Security Policy (CSP)

#### Medium Term (Phase 3-4)
- [ ] Refresh tokens for JWT
- [ ] 2FA support (optional)
- [ ] API key authentication for devices
- [ ] Input sanitization against XSS
- [ ] SQL injection prevention (NoSQL injection for MongoDB)
- [ ] CSRF protection

#### Long Term (Phase 5+)
- [ ] Security audit logging
- [ ] Intrusion detection
- [ ] Automated security scanning in CI/CD
- [ ] Penetration testing
- [ ] Bug bounty program

## 🚨 Known Security Considerations

### Current State (v2.0.0)

#### Critical
None currently identified.

#### High
- **JWT Secret**: Must be set in environment. Application validates but does not enforce complexity beyond length.
- **MQTT Anonymous Access**: Default configuration allows anonymous MQTT connections. Should be disabled in production.

#### Medium
- **Rate Limiting**: Not yet implemented. API is vulnerable to brute force attacks.
- **Advanced Security Headers**: Only basic headers implemented. Helmet.js not yet integrated.
- **Input Validation**: Basic validation only. Comprehensive validation with express-validator pending.

#### Low
- **Error Messages**: Some error messages could leak information about system internals.
- **Logging**: Sensitive data may appear in logs if not careful.

## 🔧 Security Configuration

### Required Security Setup

#### 1. JWT Secret
```bash
# Generate secure secret (minimum 32 characters)
openssl rand -base64 32

# Add to .env
JWT_SECRET=your_generated_secret_here
```

#### 2. MongoDB Credentials
```bash
# Use strong passwords
MONGO_USERNAME=admin
MONGO_PASSWORD=<strong_password>
```

#### 3. MQTT Security
Edit `mosquitto/config/mosquitto.conf`:
```conf
# Disable anonymous access
allow_anonymous false
password_file /mosquitto/config/passwd
```

Create password file:
```bash
docker-compose exec mosquitto mosquitto_passwd -c /mosquitto/config/passwd username
```

#### 4. HTTPS/SSL
In production, always use HTTPS. Configure nginx or use a service like Cloudflare.

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # ... rest of config
}
```

#### 5. Environment Variables
Never commit .env files or secrets to git:
```bash
# .env should be in .gitignore
echo ".env" >> .gitignore
```

#### 6. CORS Configuration
Set appropriate CORS origins:
```bash
FRONTEND_URL=https://yourdomain.com
```

### Security Checklist for Production

- [ ] JWT_SECRET is set and is at least 32 characters
- [ ] All default passwords changed
- [ ] MQTT anonymous access disabled
- [ ] MongoDB authentication enabled
- [ ] HTTPS/SSL configured
- [ ] Firewall rules configured
- [ ] Rate limiting implemented
- [ ] Security headers configured
- [ ] Error messages don't leak sensitive info
- [ ] Logs don't contain sensitive data
- [ ] Regular backups configured
- [ ] Monitoring and alerting set up
- [ ] Dependencies are up to date
- [ ] Security audit performed

## 🔍 Security Best Practices

### For Developers

1. **Never Hardcode Secrets**
   ```javascript
   // ❌ Bad
   const secret = "mySecret123";
   
   // ✅ Good
   const secret = process.env.JWT_SECRET;
   ```

2. **Validate All Input**
   ```javascript
   // ❌ Bad
   const email = req.body.email;
   
   // ✅ Good
   const email = req.body.email;
   if (!email || !isValidEmail(email)) {
     return res.status(400).json({ error: "Invalid email" });
   }
   ```

3. **Use Prepared Statements/ORMs**
   ```javascript
   // ✅ Good - Mongoose handles this
   User.findOne({ email: email });
   ```

4. **Hash Passwords**
   ```javascript
   // ✅ Always hash passwords
   const hashedPassword = bcrypt.hashSync(password, 10);
   ```

5. **Sanitize Output**
   ```javascript
   // ✅ Remove sensitive fields
   user.set("password", undefined, { strict: false });
   ```

### For Deployers

1. **Use Environment Variables**
   - Never expose .env files
   - Use secrets management in production (e.g., AWS Secrets Manager)

2. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Use Security Scanning**
   ```bash
   # Run Snyk or similar
   npx snyk test
   ```

4. **Monitor Logs**
   - Set up log monitoring
   - Alert on suspicious activity

5. **Regular Backups**
   - Automated daily backups
   - Test restore procedures

6. **Least Privilege**
   - Database users with minimal permissions
   - Container users are non-root

## 📚 Security Resources

### OWASP Top 10
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- Focus on: Injection, Broken Authentication, XSS, Insecure Deserialization

### Node.js Security
- [Node.js Security Best Practices](https://nodejs.org/en/learn/getting-started/security-best-practices)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)

### IoT Security
- [IoT Security Foundation](https://www.iotsecurityfoundation.org/)
- [OWASP IoT Top 10](https://owasp.org/www-project-internet-of-things/)

### Tools
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [SonarQube](https://www.sonarqube.org/)

## 📝 Security Updates

Security updates and advisories will be published:
1. In this SECURITY.md file
2. As GitHub Security Advisories
3. In the CHANGELOG.md
4. Via GitHub releases

## 🏆 Hall of Fame

Contributors who responsibly disclose security vulnerabilities will be acknowledged here (with permission).

---

**Last Updated**: 2025-01-15  
**Version**: 2.0.0
