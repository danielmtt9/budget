# Resume Applications Setup Guide

This guide documents the setup of two resume-related applications as system services on Ubuntu:

1. **Resume-Matcher** - AI-powered resume matcher with job descriptions
2. **Open-Resume** - Open-source resume builder and parser

## 📁 Applications Location

Both applications are cloned to:
- Resume-Matcher: `/home/danielaroko/applications/Resume-Matcher`
- Open-Resume: `/home/danielaroko/applications/open-resume`

## 🌐 Service Ports

| Service | Type | Port | URL |
|---------|------|------|-----|
| Resume-Matcher Frontend | Next.js | 30001 | http://YOUR_IP:30001 |
| Resume-Matcher Backend | FastAPI | 50001 | http://YOUR_IP:50001 |
| Open-Resume | Next.js | 50002 | http://YOUR_IP:50002 |

## 🚀 Setup Instructions

### Initial Setup (Already Completed)

The following steps have been completed:

1. ✅ Cloned both repositories
2. ✅ Installed dependencies
   - Resume-Matcher: Node.js frontend + Python backend (using uv)
   - Open-Resume: Node.js application
3. ✅ Fixed dependency conflicts in Resume-Matcher
4. ✅ Configured custom ports
5. ✅ Created systemd service files

### Installing and Starting Services

To install and start the services, run:

```bash
cd /home/danielaroko/applications/create_update
sudo ./setup_services.sh
```

This script will:
- Copy service files to `/etc/systemd/system/`
- Enable services to start on boot
- Configure firewall (ufw) to allow ports 30001, 50001, and 50002
- Start both services
- Display service status and access URLs

### Configuring API Keys (Resume-Matcher Only)

Resume-Matcher requires an LLM provider to function. You can configure this using the interactive script:

```bash
cd /home/danielaroko/applications/create_update
./configure_api_key.sh
```

The script supports:
- OpenAI (cloud, paid)
- OpenRouter (cloud, paid, access to many models)
- Local Ollama (free, runs on your machine)
- 90+ other providers via LlamaIndex

For detailed information, see: `API_CONFIGURATION_GUIDE.md`

**Note**: Open-Resume does not require API configuration - it works standalone.

## 🔧 Service Management

### View Service Status

```bash
# Resume-Matcher
sudo systemctl status resume-matcher.service

# Open-Resume
sudo systemctl status open-resume.service
```

### View Live Logs

```bash
# Resume-Matcher logs
sudo journalctl -u resume-matcher.service -f

# Open-Resume logs
sudo journalctl -u open-resume.service -f
```

### Stop Services

```bash
# Resume-Matcher
sudo systemctl stop resume-matcher.service

# Open-Resume
sudo systemctl stop open-resume.service
```

### Start Services

```bash
# Resume-Matcher
sudo systemctl start resume-matcher.service

# Open-Resume
sudo systemctl start open-resume.service
```

### Restart Services

```bash
# Resume-Matcher
sudo systemctl restart resume-matcher.service

# Open-Resume
sudo systemctl restart open-resume.service
```

### Disable Services (prevent auto-start on boot)

```bash
# Resume-Matcher
sudo systemctl disable resume-matcher.service

# Open-Resume
sudo systemctl disable open-resume.service
```

## 🔥 Firewall Configuration

The setup script automatically configures ufw to allow the following ports:

```bash
# Ports opened for LAN access:
- 30001/tcp - Resume-Matcher frontend
- 50001/tcp - Resume-Matcher backend
- 50002/tcp - Open-Resume

# View firewall status
sudo ufw status

# Manually add rules (if needed)
sudo ufw allow 30001/tcp comment 'Resume-Matcher frontend'
sudo ufw allow 50001/tcp comment 'Resume-Matcher backend'
sudo ufw allow 50002/tcp comment 'Open-Resume'
```

## 📝 Configuration Files

### Resume-Matcher

**Environment Files:**
- Backend: `/home/danielaroko/applications/Resume-Matcher/apps/backend/.env`
- Frontend: `/home/danielaroko/applications/Resume-Matcher/apps/frontend/.env`

**Service File:** `/etc/systemd/system/resume-matcher.service`

**Key Configuration:**
- Backend port: 50001 (configured in `package.json`)
- Frontend port: 30001 (configured in `package.json`)
- API URL: http://localhost:50001 (configured in frontend `.env`)

### Open-Resume

**Service File:** `/etc/systemd/system/open-resume.service`

**Key Configuration:**
- Port: 50002 (set via `PORT` environment variable in service file)

## 🛠️ Maintenance Scripts

All scripts are located in `/home/danielaroko/applications/create_update/`:

1. **create_python_env.sh** - Creates Python virtual environments for standalone apps
2. **setup_services.sh** - Installs and configures system services
3. **create_jupyterhub_env.sh** - Creates conda environments for JupyterHub
4. **install_packages_to_env.sh** - Installs conda packages
5. **pip_install_to_env.sh** - Installs pip packages
6. **update_env_packages.sh** - Updates environment packages

## 🐛 Troubleshooting

### Service won't start

1. Check service status:
   ```bash
   sudo systemctl status <service-name>.service
   ```

2. View detailed logs:
   ```bash
   sudo journalctl -u <service-name>.service -n 100
   ```

3. Verify port availability:
   ```bash
   sudo netstat -tlnp | grep -E '30001|50001|50002'
   ```

### Resume-Matcher issues

- Ensure Python 3.12+ and uv are installed
- Check backend environment: `/home/danielaroko/applications/Resume-Matcher/apps/backend/.venv/`
- Verify backend API is accessible: `curl http://localhost:50001`

### Open-Resume issues

- Ensure Node.js v18+ is installed
- Check if port 50002 is available
- Verify build was successful: check for `.next` directory

### Firewall blocking access

```bash
# Check firewall status
sudo ufw status

# If firewall is blocking, allow ports
sudo ufw allow 30001/tcp
sudo ufw allow 50001/tcp
sudo ufw allow 50002/tcp
sudo ufw reload
```

## 🔄 Updating Applications

### Resume-Matcher

```bash
cd /home/danielaroko/applications/Resume-Matcher
git pull
npm install
npm run install:backend
sudo systemctl restart resume-matcher.service
```

### Open-Resume

```bash
cd /home/danielaroko/applications/open-resume
git pull
npm install
npm run build
sudo systemctl restart open-resume.service
```

## 📚 Additional Resources

- Resume-Matcher: https://github.com/srbhr/Resume-Matcher
- Open-Resume: https://github.com/xitanggg/open-resume
- Systemd Documentation: https://www.freedesktop.org/software/systemd/man/systemd.service.html

## 💡 Notes

- Resume-Matcher runs in development mode (`npm run dev`) to avoid build issues
- Open-Resume runs in production mode (`npm start`) with pre-built static files
- Both services are configured to restart automatically on failure
- Services start automatically on system boot
- All ports are accessible from the LAN

## 🔒 Security Considerations

- These services are exposed to the LAN - ensure your network is secure
- Resume-Matcher backend may require API keys for AI features (configure in `.env`)
- Consider using nginx reverse proxy with SSL for production use
- Regularly update dependencies and check for security vulnerabilities
