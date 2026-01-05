
import { useEffect, useState } from 'react';

const InstallPWA = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);

    useEffect(() => {
        // Check if already dismissed
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedTime = parseInt(dismissed, 10);
            const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
            if (dismissedTime > weekAgo) {
                return; // Don't show if dismissed within last week
            }
        }

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            return;
        }

        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBtn(true);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install declaration: ${outcome}`);
        setDeferredPrompt(null);
        setShowInstallBtn(false);
        if (outcome === 'accepted') {
            localStorage.removeItem('pwa-install-dismissed');
        }
    };

    const handleDismiss = () => {
        setShowInstallBtn(false);
        localStorage.setItem('pwa-install-dismissed', Date.now().toString());
    };

    if (!showInstallBtn) return null;

    // Detect iOS
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

    return (
        <div className="fixed bottom-24 md:bottom-20 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300" style={{ marginBottom: `calc(env(safe-area-inset-bottom) + 1rem)` }}>
            <div className="bg-primary text-white p-4 rounded-xl shadow-2xl flex items-center justify-between gap-3 max-w-md mx-auto">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="material-symbols-outlined text-2xl flex-shrink-0">install_mobile</span>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-sm">Install App</span>
                        <span className="text-xs opacity-90">
                            {isIOS ? 'Tap Share, then "Add to Home Screen"' : 'Add to home screen for offline access'}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {!isIOS && (
                        <button
                            onClick={handleInstallClick}
                            className="bg-white text-primary px-3 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors active:scale-95 min-h-[44px]"
                        >
                            Install
                        </button>
                    )}
                    <button
                        onClick={handleDismiss}
                        className="text-white/80 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Dismiss"
                    >
                        <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPWA;
