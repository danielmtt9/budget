import { useEffect, useState } from 'react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOffline, setShowOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Hide offline indicator after a short delay when coming back online
      setTimeout(() => setShowOffline(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showOffline) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        showOffline ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ paddingTop: `calc(env(safe-area-inset-top))` }}
    >
      <div
        className={`px-4 py-3 text-center text-sm font-medium ${
          isOnline
            ? 'bg-emerald-500 text-white'
            : 'bg-red-500 text-white'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {isOnline ? (
            <>
              <span className="material-symbols-outlined text-base">cloud_done</span>
              <span>Back online. Syncing data...</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">cloud_off</span>
              <span>You're offline. Showing cached data.</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OfflineIndicator;
