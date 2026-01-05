#!/bin/bash

# Service management helper script for Resume-Matcher and Open-Resume
# Usage: ./manage_services.sh {start|stop|restart|status|logs|enable|disable}

SERVICE1="resume-matcher"
SERVICE2="open-resume"

show_usage() {
    echo "Usage: $0 {start|stop|restart|status|logs|enable|disable|info}"
    echo ""
    echo "Commands:"
    echo "  start    - Start both services"
    echo "  stop     - Stop both services"
    echo "  restart  - Restart both services"
    echo "  status   - Show status of both services"
    echo "  logs     - Show recent logs for both services"
    echo "  enable   - Enable services to start on boot"
    echo "  disable  - Disable services from starting on boot"
    echo "  info     - Show service URLs and useful commands"
    exit 1
}

show_info() {
    IP=$(hostname -I | awk '{print $1}')
    echo ""
    echo "📝 Service Information:"
    echo "======================"
    echo "Resume-Matcher Frontend: http://$IP:30001"
    echo "Resume-Matcher Backend:  http://$IP:50001"
    echo "Open-Resume:             http://$IP:50002"
    echo ""
    echo "💡 Useful commands:"
    echo "   View logs live:           $0 logs"
    echo "   Check status:             $0 status"
    echo "   Restart services:         $0 restart"
    echo "   Stop services:            $0 stop"
    echo "   Start services:           $0 start"
    echo ""
    echo "📖 For more information, see: ~/applications/create_update/SERVICES_README.md"
    echo ""
}

if [ -z "$1" ]; then
    show_usage
fi

case "$1" in
    start)
        echo "🎬 Starting services..."
        sudo systemctl start ${SERVICE1}.service
        sudo systemctl start ${SERVICE2}.service
        echo "✅ Services started"
        show_info
        ;;
    stop)
        echo "🛑 Stopping services..."
        sudo systemctl stop ${SERVICE1}.service
        sudo systemctl stop ${SERVICE2}.service
        echo "✅ Services stopped"
        ;;
    restart)
        echo "🔄 Restarting services..."
        sudo systemctl restart ${SERVICE1}.service
        sudo systemctl restart ${SERVICE2}.service
        echo "✅ Services restarted"
        show_info
        ;;
    status)
        echo "📊 Service Status:"
        echo "=================="
        echo ""
        echo "Resume-Matcher:"
        sudo systemctl status ${SERVICE1}.service --no-pager -l | head -15
        echo ""
        echo "Open-Resume:"
        sudo systemctl status ${SERVICE2}.service --no-pager -l | head -15
        ;;
    logs)
        echo "📋 Recent logs (last 50 lines):"
        echo "================================"
        echo ""
        echo "--- Resume-Matcher ---"
        sudo journalctl -u ${SERVICE1}.service -n 50 --no-pager
        echo ""
        echo "--- Open-Resume ---"
        sudo journalctl -u ${SERVICE2}.service -n 50 --no-pager
        echo ""
        echo "💡 To follow logs in real-time:"
        echo "   Resume-Matcher: sudo journalctl -u ${SERVICE1}.service -f"
        echo "   Open-Resume:    sudo journalctl -u ${SERVICE2}.service -f"
        ;;
    enable)
        echo "✅ Enabling services to start on boot..."
        sudo systemctl enable ${SERVICE1}.service
        sudo systemctl enable ${SERVICE2}.service
        echo "✅ Services enabled"
        ;;
    disable)
        echo "❌ Disabling services from starting on boot..."
        sudo systemctl disable ${SERVICE1}.service
        sudo systemctl disable ${SERVICE2}.service
        echo "✅ Services disabled"
        ;;
    info)
        show_info
        ;;
    *)
        show_usage
        ;;
esac
