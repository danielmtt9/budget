#!/bin/bash

# Setup script for Resume-Matcher and Open-Resume services
# Run this script with sudo: sudo ./setup_services.sh

set -e

echo "🚀 Setting up Resume-Matcher and Open-Resume as system services..."

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Please run with sudo: sudo ./setup_services.sh"
    exit 1
fi

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Copy service files
echo "📋 Copying service files to /etc/systemd/system/..."
cp "$SCRIPT_DIR/resume-matcher.service" /etc/systemd/system/
cp "$SCRIPT_DIR/open-resume.service" /etc/systemd/system/

# Ensure Open-Resume standalone build has static files
echo "📚 Setting up Open-Resume standalone build..."
if [ -d "/home/danielaroko/applications/open-resume/.next/standalone" ]; then
    cp -r /home/danielaroko/applications/open-resume/.next/static /home/danielaroko/applications/open-resume/.next/standalone/.next/ 2>/dev/null || true
    cp -r /home/danielaroko/applications/open-resume/public /home/danielaroko/applications/open-resume/.next/standalone/ 2>/dev/null || true
    echo "✅ Open-Resume standalone setup complete"
else
    echo "⚠️  Open-Resume standalone build not found - please run 'npm run build' first"
fi

echo "✅ Service files copied"

# Reload systemd daemon
echo "🔄 Reloading systemd daemon..."
systemctl daemon-reload

# Enable services to start on boot
echo "✅ Enabling services to start on boot..."
systemctl enable resume-matcher.service
systemctl enable open-resume.service

# Configure firewall
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
    # Open port 30001 for Resume-Matcher frontend (accessible from LAN)
    echo "   Opening port 30001 (Resume-Matcher frontend)..."
    ufw allow 30001/tcp comment 'Resume-Matcher frontend'
    
    # Open port 50001 for Resume-Matcher backend (accessible from LAN)
    echo "   Opening port 50001 (Resume-Matcher backend)..."
    ufw allow 50001/tcp comment 'Resume-Matcher backend'
    
    # Open port 50002 for Open-Resume (accessible from LAN)
    echo "   Opening port 50002 (Open-Resume)..."
    ufw allow 50002/tcp comment 'Open-Resume'
    
    # Reload ufw
    echo "   Reloading firewall..."
    ufw reload
    
    echo "   Firewall status:"
    ufw status | grep -E '30001|50001|50002'
else
    echo "⚠️  ufw not found. Please manually configure your firewall to allow ports 30001, 50001, and 50002."
fi

# Start services
echo "🎬 Starting services..."
systemctl start resume-matcher.service
systemctl start open-resume.service

# Check status
echo ""
echo "📊 Service Status:"
echo "=================="
echo ""
echo "Resume-Matcher:"
systemctl status resume-matcher.service --no-pager -l | head -20
echo ""
echo "Open-Resume:"
systemctl status open-resume.service --no-pager -l | head -20
echo ""

echo "✅ Setup complete!"
echo ""
echo "📝 Service Information:"
echo "======================"
echo "Resume-Matcher Frontend: http://$(hostname -I | awk '{print $1}'):30001"
echo "Resume-Matcher Backend:  http://$(hostname -I | awk '{print $1}'):50001"
echo "Open-Resume:             http://$(hostname -I | awk '{print $1}'):50002"
echo ""
echo "💡 Useful commands:"
echo "   View Resume-Matcher logs: sudo journalctl -u resume-matcher.service -f"
echo "   View Open-Resume logs:    sudo journalctl -u open-resume.service -f"
echo "   Stop Resume-Matcher:      sudo systemctl stop resume-matcher.service"
echo "   Stop Open-Resume:         sudo systemctl stop open-resume.service"
echo "   Restart Resume-Matcher:   sudo systemctl restart resume-matcher.service"
echo "   Restart Open-Resume:      sudo systemctl restart open-resume.service"
