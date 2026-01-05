import { useState, useEffect } from 'react';
import { getUser, updateUser } from '../services/api';
import { type User } from '../services/api';

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await getUser();
        setUser(currentUser);
        setFullName(currentUser.full_name || '');
        setAvatarUrl(currentUser.avatar_url || '');
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        // Optionally redirect to login or show error message
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const updatedData = await updateUser({ full_name: fullName, avatar_url: avatarUrl });
      setUser(updatedData);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update user profile:', err);
      alert('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center mt-20">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
      </div>
    );
  }

  if (!user) {
    return <div className="p-8 text-center text-red-500">Error: User not found or not logged in.</div>;
  }

  return (
    <div className="flex flex-col p-8 w-full max-w-7xl mx-auto gap-8">
      <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">User Profile</h1>

      <div className="bg-white dark:bg-slate-800/20 border border-slate-200/80 dark:border-white/10 p-6 rounded-xl flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Profile Information</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col flex-1">
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Email</p>
            <input
              className="form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 h-12 px-4 text-base font-normal leading-normal"
              type="text"
              value={user.email}
              disabled // Email is not editable
              data-testid="profile-email-input"
            />
          </label>

          <label className="flex flex-col flex-1">
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Full Name</p>
              <input
              className="form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:border-primary min-h-[44px] h-11 md:h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base font-normal leading-normal"
              type="text"
              inputMode="text"
              autoCapitalize="words"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              data-testid="profile-name-input"
              name="full_name"
            />
          </label>

          <label className="flex flex-col flex-1">
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Avatar URL</p>
              <input
              className="form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:border-primary min-h-[44px] h-11 md:h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base font-normal leading-normal"
              type="url"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="URL to your avatar image"
            />
          </label>

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center rounded-lg min-h-[44px] h-11 bg-primary text-white text-sm font-semibold px-5 hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-95"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-slate-800/20 border border-red-200/50 dark:border-red-500/10 p-6 rounded-xl flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Account Actions</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Sign out of your account on this device.</p>
        </div>

        <div className="flex">
          <a
            href="/login" // Simple link to login for now, assuming it clears session or user can re-login
            className="flex items-center gap-2 justify-center rounded-lg h-12 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-bold px-6 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-red-100 dark:border-red-500/20"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Profile;