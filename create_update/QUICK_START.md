# Quick Start Guide - Resume Applications

## ✅ Current Setup

Your Resume-Matcher and Open-Resume applications are now fully configured and running!

### 🌐 Access URLs

| Application | URL | Purpose |
|------------|-----|---------|
| **Resume-Matcher Frontend** | http://172.23.118.177:30001 | AI-powered resume matching |
| **Resume-Matcher Backend** | http://172.23.118.177:50001 | API endpoint |
| **Open-Resume** | http://172.23.118.177:50002 | Resume builder & parser |

Access these URLs from any device on your LAN.

## 🤖 AI Provider Configuration

### Currently Active: Ollama (Local - No API Key Required) ✅

```
Provider: Ollama (Local)
LLM Model: gpt-oss:120b-cloud
Embedding Model: nomic-embed-text:latest
API Key: Not required (uses local Ollama)
Ollama Status: Running ✓
```

**Benefits:**
- ✅ **Free** - No API costs
- ✅ **Private** - All processing happens locally
- ✅ **Offline** - Works without internet
- ✅ **No API Keys** - Simple setup

## 🚀 Common Commands

### Check Service Status
```bash
cd ~/applications/create_update
./manage_services.sh status
```

### View Logs
```bash
./manage_services.sh logs
```

### Restart Services
```bash
./manage_services.sh restart
```

### Stop Services
```bash
./manage_services.sh stop
```

### Start Services
```bash
./manage_services.sh start
```

### Show Service Info
```bash
./manage_services.sh info
```

## 🔧 Configuration Files

### Backend Configuration
**File**: `/home/danielaroko/applications/Resume-Matcher/apps/backend/.env`

Contains:
- AI provider settings (OpenAI/Ollama)
- API keys
- Model selections
- Database configuration

### Frontend Configuration
**File**: `/home/danielaroko/applications/Resume-Matcher/apps/frontend/.env`

Contains:
- Backend API URL (currently: http://172.23.118.177:50001)

### Service Files
**Location**: `/etc/systemd/system/`
- `resume-matcher.service`
- `open-resume.service`

## 🔄 Switching Between Providers

### Current: OpenAI → Switch to Ollama

```bash
# 1. Edit the config file
nano /home/danielaroko/applications/Resume-Matcher/apps/backend/.env

# 2. Comment out OpenAI lines (add # at start):
#LLM_PROVIDER="openai"
#OPENAI_API_KEY="sk-..."
#LL_MODEL="gpt-4o-mini"
#EMBEDDING_PROVIDER="openai"
#EMBEDDING_MODEL="text-embedding-3-large"

# 3. Uncomment Ollama lines (remove # from start):
LLM_PROVIDER="ollama"
LLM_BASE_URL="http://localhost:11434"
LL_MODEL="gpt-oss:120b-cloud"
EMBEDDING_PROVIDER="ollama"
EMBEDDING_BASE_URL="http://localhost:11434"
EMBEDDING_MODEL="nomic-embed-text:latest"

# 4. Restart service
cd ~/applications/create_update
./manage_services.sh restart
```

## 📊 Port Summary

| Port | Service | Firewall |
|------|---------|----------|
| 30001 | Resume-Matcher Frontend | Open to LAN |
| 50001 | Resume-Matcher Backend | Open to LAN |
| 50002 | Open-Resume | Open to LAN |

## 🔒 Security Notes

- API keys are stored in `.env` files (not in git)
- Backups of `.env` files contain API keys - handle carefully
- Services are accessible from LAN only (not internet)
- For external access, use a reverse proxy with SSL

## 🐛 Troubleshooting

### "Failed to fetch" errors
**Solution**: Check service status and logs
```bash
./manage_services.sh status
./manage_services.sh logs
```

### Services won't start
**Check logs**:
```bash
sudo journalctl -u resume-matcher.service -n 50
sudo journalctl -u open-resume.service -n 50
```

### Can't access from other devices
**Check firewall**:
```bash
sudo ufw status | grep -E '30001|50001|50002'
```

**Check ports are listening**:
```bash
sudo netstat -tlnp | grep -E '30001|50001|50002'
```

### OpenAI API errors
- Verify API key is correct
- Check you have credits in your OpenAI account
- View logs for specific error messages

### Ollama not working
- Ensure Ollama is installed and running: `ollama list`
- Check models are pulled: `ollama pull gpt-oss:120b-cloud`
- Verify Ollama is accessible: `curl http://localhost:11434/api/tags`

## 📚 Documentation Files

All documentation is in `~/applications/create_update/`:

| File | Description |
|------|-------------|
| `QUICK_START.md` | This file - quick reference |
| `SERVICES_README.md` | Complete service management guide |
| `API_CONFIGURATION_GUIDE.md` | Detailed API setup instructions |
| `TROUBLESHOOTING.md` | Comprehensive troubleshooting |
| `PORT_REFERENCE.txt` | Quick port reference card |

## 🎯 Using the Applications

### Resume-Matcher
1. Open http://172.23.118.177:30001
2. Upload your resume (PDF/DOC/DOCX)
3. Add job descriptions you're interested in
4. Get AI-powered matching analysis
5. Receive suggestions to improve your resume

### Open-Resume
1. Open http://172.23.118.177:50002
2. Build a resume from scratch or upload existing one
3. Edit using the visual editor
4. Download as PDF
5. Test resume parsing to ensure ATS compatibility

## 📝 Tips

1. **Resume-Matcher uses Ollama** - Free and runs locally
2. **Open-Resume runs in optimized standalone mode** - No warnings
3. **Services auto-start** on system boot
4. **Logs are kept** for 30 days automatically
5. **Backups are created** whenever you change configuration
6. **Open-Resume storage is browser-only** - Download resumes regularly

## 🆘 Need Help?

1. Check `TROUBLESHOOTING.md` for common issues
2. View service logs: `./manage_services.sh logs`
3. Check all documentation files in this directory
4. Verify configuration: `cat ~/applications/Resume-Matcher/apps/backend/.env`

## 📅 Maintenance

### Weekly
```bash
# Check service health
./manage_services.sh status
```

### Monthly
```bash
# Update applications
cd ~/applications/Resume-Matcher
git pull
./setup.sh
sudo systemctl restart resume-matcher.service

cd ~/applications/open-resume
git pull
npm install
npm run build
sudo systemctl restart open-resume.service

# Clean old logs
sudo journalctl --vacuum-time=30d
```

---

**Last Updated**: Configuration completed with OpenAI API key
**Ollama Config**: Available as alternative (commented out in .env)
**All Services**: Running and accessible on LAN
