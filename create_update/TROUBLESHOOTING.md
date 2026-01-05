# Troubleshooting Guide

## ✅ Issue Fixed: Backend Not Starting

**Problem:** Resume-Matcher frontend showed "Failed to fetch" errors because the backend wasn't running.

**Root Causes:**
1. `uv` command not found in system PATH
2. Backend only listening on localhost (127.0.0.1) instead of all interfaces

**Solutions Applied:**
1. Updated service PATH to include `/opt/conda/envs/python/bin` where `uv` is located
2. Added `--host 0.0.0.0` flag to backend startup command to listen on all interfaces

**Verification:**
```bash
# Check if services are running
sudo systemctl status resume-matcher.service
sudo systemctl status open-resume.service

# Check if ports are listening
sudo netstat -tlnp | grep -E '30001|50001|50002'

# Test backend API
curl http://localhost:50001/api/v1/config/llm-api-key

# Test frontend
curl http://localhost:30001 | grep title
```

## Common Issues

### 1. "uv: not found" Error

**Symptoms:**
- Backend fails to start
- Logs show: `sh: 1: uv: not found`

**Solution:**
Ensure the service file includes the correct PATH:
```bash
# Check where uv is installed
which uv

# Update service file PATH
# Edit: /etc/systemd/system/resume-matcher.service
# Add uv location to PATH environment variable
```

### 2. "Failed to fetch" or "Connection refused"

**Symptoms:**
- Frontend can't connect to backend
- Browser console shows fetch errors

**Possible Causes & Solutions:**

**A. Backend not running**
```bash
# Check status
sudo systemctl status resume-matcher.service

# View logs
sudo journalctl -u resume-matcher.service -n 50

# Restart service
sudo systemctl restart resume-matcher.service
```

**B. Backend listening on wrong interface**
```bash
# Check if backend is listening on all interfaces
sudo netstat -tlnp | grep 50001

# Should show: 0.0.0.0:50001 (good) or :::50001 (good)
# NOT: 127.0.0.1:50001 (bad - only localhost)

# Fix: Add --host 0.0.0.0 to uvicorn command in package.json
```

**C. Firewall blocking ports**
```bash
# Check firewall status
sudo ufw status

# Allow ports
sudo ufw allow 30001/tcp
sudo ufw allow 50001/tcp
sudo ufw allow 50002/tcp
sudo ufw reload
```

### 3. API Key Configuration Errors

**Symptoms:**
- Backend starts but AI features don't work
- Errors about missing API keys in logs

**Solution:**
Configure API key using the helper script:
```bash
cd ~/applications/create_update
./configure_api_key.sh
```

Or manually edit `/home/danielaroko/applications/Resume-Matcher/apps/backend/.env`

See `API_CONFIGURATION_GUIDE.md` for details.

### 4. Service Won't Start After Configuration

**Check logs:**
```bash
sudo journalctl -u resume-matcher.service -n 100 --no-pager
```

**Common issues:**
- Syntax errors in `.env` file
- Missing required environment variables
- Port already in use

**Solutions:**
```bash
# Restore backup if needed
ls -l /home/danielaroko/applications/Resume-Matcher/apps/backend/.env.backup.*
cp /path/to/.env.backup.TIMESTAMP /home/danielaroko/applications/Resume-Matcher/apps/backend/.env

# Check if ports are in use
sudo netstat -tlnp | grep -E '30001|50001|50002'

# Kill process using port (if needed)
sudo kill -9 <PID>

# Restart service
sudo systemctl restart resume-matcher.service
```

### 5. Open-Resume Not Accessible

**Symptoms:**
- Can't connect to port 50002

**Check:**
```bash
# Check if service is running
sudo systemctl status open-resume.service

# Check if port is listening
sudo netstat -tlnp | grep 50002

# View logs
sudo journalctl -u open-resume.service -n 50
```

**Solution:**
```bash
# Restart service
sudo systemctl restart open-resume.service

# If that doesn't work, rebuild
cd /home/danielaroko/applications/open-resume
npm install
npm run build
sudo systemctl restart open-resume.service
```

### 6. Permission Denied Errors

**Symptoms:**
- Service fails to start
- Permission errors in logs

**Solution:**
```bash
# Fix ownership
sudo chown -R danielaroko:danielaroko /home/danielaroko/applications/Resume-Matcher
sudo chown -R danielaroko:danielaroko /home/danielaroko/applications/open-resume

# Restart services
sudo systemctl restart resume-matcher.service
sudo systemctl restart open-resume.service
```

### 7. Memory or Performance Issues

**Symptoms:**
- Services crash or become unresponsive
- System runs out of memory

**Check:**
```bash
# Check memory usage
free -h

# Check service memory
systemctl status resume-matcher.service | grep Memory

# Check system resources
top
```

**Solutions:**
- Use local Ollama instead of cloud APIs to reduce memory usage
- Restart services periodically
- Consider using smaller AI models

## Quick Diagnostic Commands

```bash
# Full system check
cd ~/applications/create_update

# 1. Check service status
./manage_services.sh status

# 2. Check logs
./manage_services.sh logs

# 3. Check ports
sudo netstat -tlnp | grep -E '30001|50001|50002'

# 4. Test backend API
curl http://localhost:50001/api/v1/config/llm-api-key

# 5. Test frontend
curl -I http://localhost:30001

# 6. Check firewall
sudo ufw status | grep -E '30001|50001|50002'

# 7. Check disk space
df -h

# 8. Check system logs
sudo journalctl -xe | tail -50
```

## Getting More Help

1. **Check logs first:**
   ```bash
   sudo journalctl -u resume-matcher.service -n 100 --no-pager
   sudo journalctl -u open-resume.service -n 100 --no-pager
   ```

2. **Review configuration:**
   - Service files: `/etc/systemd/system/*.service`
   - Environment: `/home/danielaroko/applications/Resume-Matcher/apps/backend/.env`
   - Package config: `/home/danielaroko/applications/Resume-Matcher/package.json`

3. **Test components individually:**
   ```bash
   # Test backend manually
   cd /home/danielaroko/applications/Resume-Matcher/apps/backend
   source .venv/bin/activate
   uvicorn app.main:app --host 0.0.0.0 --port 50001

   # Test frontend manually
   cd /home/danielaroko/applications/Resume-Matcher
   npm run dev:frontend
   ```

4. **Start fresh:**
   ```bash
   # Stop services
   sudo systemctl stop resume-matcher.service
   sudo systemctl stop open-resume.service

   # Clean and reinstall
   cd /home/danielaroko/applications/Resume-Matcher
   ./setup.sh

   # Restart services
   sudo systemctl restart resume-matcher.service
   ```

## Preventive Maintenance

**Regular checks:**
```bash
# Weekly: Check service health
./manage_services.sh status

# Monthly: Update dependencies
cd /home/danielaroko/applications/Resume-Matcher
git pull
./setup.sh
sudo systemctl restart resume-matcher.service

cd /home/danielaroko/applications/open-resume
git pull
npm install
npm run build
sudo systemctl restart open-resume.service

# Monthly: Clean logs
sudo journalctl --vacuum-time=30d
```

**Monitor disk space:**
```bash
# Check disk usage
df -h

# Clean npm cache if needed
npm cache clean --force

# Clean old backups
ls -lth /home/danielaroko/applications/Resume-Matcher/apps/backend/.env.backup.* | tail -n +6
```
