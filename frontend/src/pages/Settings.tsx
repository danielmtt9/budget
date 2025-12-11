import { useState, useEffect } from 'react';
import type { TagRule, Tag } from '../services/api';
import { getUser, setupSimplefin, triggerSync, getTagRules, createTagRule, deleteTagRule, getTags, applyRulesToAll, getSyncStatus } from '../services/api';

const Settings = () => {
  const [setupToken, setSetupToken] = useState(''); // New state for the input field
  const [configuredAccessUrl, setConfiguredAccessUrl] = useState(''); // State to display the currently configured Access URL
  const [loading, setLoading] = useState(true);
  const [settingUpSimpleFin, setSettingUpSimpleFin] = useState(false); // For setup button loading state
  const [syncing, setSyncing] = useState(false);
  const [applyingRules, setApplyingRules] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ configured: false, message: 'Loading status...' });
  
  // Tag Rules State
  const [rules, setRules] = useState<TagRule[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  
  // Add Rule Form State
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleType, setNewRuleType] = useState('contains');
  const [newRuleTagId, setNewRuleTagId] = useState<number | ''>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [user, loadedRules, loadedTags, status] = await Promise.all([
            getUser(),
            getTagRules(),
            getTags(),
            getSyncStatus()
        ]);
        setConfiguredAccessUrl(user.simplefin_access_url || '');
        setRules(loadedRules);
        setTags(loadedTags);
        setSyncStatus(status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSetupSimpleFin = async () => {
      setSettingUpSimpleFin(true);
      try {
        await setupSimplefin(setupToken);
        alert('SimpleFIN connection setup successfully. Sync initiated.');
        setSetupToken(''); // Clear input
        // Re-fetch user to update configured Access URL and sync status
        const [user, status] = await Promise.all([getUser(), getSyncStatus()]);
        setConfiguredAccessUrl(user.simplefin_access_url || '');
        setSyncStatus(status);
      } catch (err: any) {
        console.error('SimpleFIN Setup failed:', err);
        alert(`Failed to set up SimpleFIN connection: ${err.response?.data?.detail || err.message}`);
      } finally {
        setSettingUpSimpleFin(false);
      }
  };

  const handleSync = async () => {
      setSyncing(true);
      try {
        await triggerSync();
        alert('Sync initiated. Data will be updated shortly.');
        const status = await getSyncStatus();
        setSyncStatus(status);
      } catch (err: any) {
        console.error('Sync failed:', err);
        alert(`Sync failed: ${err.response?.data?.detail || err.message}`);
      } finally {
        setSyncing(false);
      }
  };

  const handleApplyRules = async () => {
      setApplyingRules(true);
      try {
          const res = await applyRulesToAll();
          alert(`Rules applied. Updated ${res.updated_count} transactions.`);
      } catch (err) {
          alert('Failed to apply rules.');
      } finally {
          setApplyingRules(false);
      }
  };
  
  const handleAddRule = async () => {
      if (!newRulePattern || !newRuleTagId) return;
      try {
          const rule = await createTagRule({
              pattern: newRulePattern,
              match_type: newRuleType,
              tag_id: Number(newRuleTagId)
          });
          const tag = tags.find(t => t.id === Number(newRuleTagId));
          setRules([...rules, { ...rule, tag }]); 
          setNewRulePattern('');
          setNewRuleTagId('');
      } catch (err) {
          console.error(err);
          alert('Failed to add rule.');
      }
  };

  const handleDeleteRule = async (id: number) => {
      try {
          await deleteTagRule(id);
          setRules(rules.filter(r => r.id !== id));
      } catch (err) {
          console.error(err);
          alert('Failed to delete rule.');
      }
  };

  if (loading) return <div className="flex justify-center mt-20"><span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span></div>;

  return (
    <div className="flex flex-col p-8 w-full max-w-7xl mx-auto gap-8">
        <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Settings</h1>

        {/* Bank Sync Card */}
        <div className="bg-white dark:bg-slate-800/20 border border-slate-200/80 dark:border-white/10 p-6 rounded-xl flex flex-col gap-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">SimpleFIN Integration</h2>
            <div className="flex flex-col gap-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">
                    To connect your bank accounts, get a **Setup Token** from SimpleFIN bridge. This token is temporary and used only once.
                    <a className="text-primary hover:underline ml-1" href="https://beta-bridge.simplefin.org/simplefin/create" target="_blank" rel="noreferrer">Get your Setup Token here</a>.
                </p>
                <label className="flex flex-col flex-1">
                    <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">SimpleFIN Setup Token</p>
                    <input 
                        className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:border-primary h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 text-base font-normal leading-normal" 
                        placeholder="Paste your base64-encoded Setup Token here..." 
                        type="text" // Changed to text as it's a token, not password
                        value={setupToken}
                        onChange={(e) => setSetupToken(e.target.value)}
                    />
                </label>
                {configuredAccessUrl && (
                    <div className="flex flex-col gap-2">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Current SimpleFIN Access URL:</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 break-all">{configuredAccessUrl}</p>
                    </div>
                )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                <button 
                    onClick={handleSetupSimpleFin} 
                    disabled={settingUpSimpleFin || !setupToken}
                    className="flex items-center justify-center rounded-lg h-10 bg-primary text-white text-sm font-semibold px-5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {settingUpSimpleFin ? 'Connecting...' : 'Connect SimpleFIN'}
                </button>
                <button 
                    onClick={handleSync}
                    disabled={syncing || !configuredAccessUrl} // Enable only if Access URL is configured
                    className="flex items-center justify-center gap-2 rounded-lg h-10 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold px-5 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-lg">sync</span>
                    <span>{syncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal">Sync Status:</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">{syncStatus.message}</p>
            </div>
        </div>

        {/* Auto-Tagging Rules Card */}
        <div className="bg-white dark:bg-slate-800/20 border border-slate-200/80 dark:border-white/10 p-6 rounded-xl flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Auto-Tagging Rules</h2>
                <button 
                    onClick={handleApplyRules}
                    disabled={applyingRules || rules.length === 0}
                    className="flex items-center justify-center gap-2 rounded-lg h-10 border border-primary text-primary text-sm font-semibold px-5 hover:bg-primary/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">history</span>
                    <span>{applyingRules ? 'Running...' : 'Run on History'}</span>
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">Current Rules</h3>
                <div className="border border-slate-200/80 dark:border-white/10 rounded-lg overflow-hidden">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {rules.map(rule => (
                            <li key={rule.id} className="flex items-center justify-between py-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <p className="text-slate-800 dark:text-slate-200 text-sm">
                                    If description <span className="font-semibold">{rule.match_type}</span> "{rule.pattern}" → Tag as <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium" style={{backgroundColor: rule.tag?.color + '40', color: rule.tag?.color}}>{rule.tag?.name}</span>
                                </p>
                                <button 
                                    onClick={() => handleDeleteRule(rule.id)}
                                    className="flex items-center justify-center size-8 rounded-md text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">delete</span>
                                </button>
                            </li>
                        ))}
                        {rules.length === 0 && <li className="py-3 px-4 text-center text-slate-500 text-sm">No rules defined.</li>}
                    </ul>
                </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 flex flex-col gap-4">
                <h3 className="text-base font-medium text-slate-800 dark:text-slate-200">Add New Rule</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <label className="flex flex-col flex-1">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Pattern</p>
                        <input 
                            className="form-input flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:border-primary h-10 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-3 text-sm" 
                            placeholder="e.g., 'Uber'"
                            value={newRulePattern}
                            onChange={(e) => setNewRulePattern(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col flex-1">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Type</p>
                        <select 
                            className="form-select w-full rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:border-primary h-10 px-3 text-sm"
                            value={newRuleType}
                            onChange={(e) => setNewRuleType(e.target.value)}
                        >
                            <option value="contains">Contains</option>
                            <option value="exact">Exact Match</option>
                            <option value="regex">Regex</option>
                        </select>
                    </label>
                    <label className="flex flex-col flex-1">
                        <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-normal pb-2">Tag</p>
                        <select 
                            className="form-select w-full rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 focus:border-primary h-10 px-3 text-sm"
                            value={newRuleTagId}
                            onChange={(e) => setNewRuleTagId(e.target.value)}
                        >
                            <option value="">Select Tag...</option>
                            {tags.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div className="flex justify-end">
                    <button 
                        onClick={handleAddRule}
                        disabled={!newRulePattern || !newRuleTagId}
                        className="flex items-center justify-center gap-2 rounded-lg h-10 bg-primary text-white text-sm font-semibold px-5 hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-lg">add</span>
                        <span>Add Rule</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Settings;