import { useEffect, useState, useMemo } from 'react';
import { getTransactions, updateTransaction, categorizeTransaction, type Tag } from '../services/api';
import TagInput from '../components/TagInput';
import TagFilter from '../components/TagFilter';
import BlurredAmount from '../components/BlurredAmount';
import { getMerchantLogo } from '../services/merchantLogos';

interface Transaction {
  id: number;
  date: string;
  description: string;
  amount: number;
  category_id: number | null;
  category_name?: string;
  is_manual_category?: boolean;
  tags: Tag[];
  account_id: number;
}

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editTags, setEditTags] = useState<Tag[]>([]);

  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction | 'category_name'; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc'
  });

  useEffect(() => {
    fetchTransactions();
  }, [selectedTagIds]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const tagsParam = selectedTagIds.length > 0 ? selectedTagIds.join(',') : undefined;
      const data = await getTransactions(tagsParam);
      setTransactions(data);
    } catch (err) {
      setError('Failed to load transactions. Please ensure you are logged in.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const sortedTransactions = useMemo(() => {
    const sortableItems = [...transactions];
    sortableItems.sort((a, b) => {
      let aValue: any = a[sortConfig.key] || '';
      let bValue: any = b[sortConfig.key] || '';

      if (sortConfig.key === 'date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortableItems;
  }, [transactions, sortConfig]);

  const requestSort = (key: keyof Transaction | 'category_name') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Transaction | 'category_name') => {
    if (sortConfig.key !== key) return 'unfold_more';
    return sortConfig.direction === 'asc' ? 'expand_less' : 'expand_more';
  };

  const handleEditClick = (tx: Transaction) => {
    setEditingTx(tx);
    setEditTags(tx.tags || []);
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editingTx) return;
    try {
      await updateTransaction(editingTx.id, {
        tag_ids: editTags.map(t => t.id)
      });
      setShowEditModal(false);
      fetchTransactions(); // Refresh list
    } catch (err) {
      console.error("Failed to save transaction", err);
      alert("Failed to save");
    }
  };

  // ... existing code ...
  const [showCatModal, setShowCatModal] = useState(false);
  const [catTx, setCatTx] = useState<Transaction | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [createRule, setCreateRule] = useState(false);
  const [ruleKeyword, setRuleKeyword] = useState("");

  const handleCategorizeClick = (tx: Transaction) => {
    setCatTx(tx);
    setNewCategory(tx.category_name || "");
    setCreateRule(false);
    setRuleKeyword(tx.description);
    setShowCatModal(true);
  };

  const handleCategorizeSave = async () => {
    if (!catTx) return;
    try {
      await categorizeTransaction(catTx.id, {
        category: newCategory,
        create_rule: createRule,
        rule_keyword: createRule ? ruleKeyword : undefined
      });
      setShowCatModal(false);
      fetchTransactions();
    } catch (err) {
      console.error("Failed to categorize", err);
      alert("Failed to categorize");
    }
  };

  return (
    <div className="flex flex-col p-4 md:p-8 w-full max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6 md:mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-normal leading-normal">View and manage all your synchronized and manual transactions.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <label className="flex flex-col w-full">
            <div className="flex w-full flex-1 items-stretch rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 h-11 md:h-10">
              <div className="text-slate-500 dark:text-slate-400 flex items-center justify-center pl-3 md:pl-4">
                <span className="material-symbols-outlined text-xl md:text-lg">search</span>
              </div>
              <input 
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-r-lg text-slate-900 dark:text-white focus:outline-0 focus:ring-0 border-none bg-transparent h-full placeholder:text-slate-500 dark:placeholder:text-slate-400 pl-2 text-base font-normal leading-normal" 
                placeholder="Search transactions..." 
                type="search"
                inputMode="search"
              />
            </div>
          </label>
        </div>
        <div className="relative">
          <TagFilter selectedTagIds={selectedTagIds} onFilterChange={setSelectedTagIds} />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <span className="material-symbols-outlined animate-spin text-primary text-2xl">sync</span>
            <div className="text-center text-slate-500 dark:text-slate-400">Loading transactions...</div>
          </div>
        ) : error ? (
          <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>
        ) : sortedTransactions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">No transactions found.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedTransactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm"
                data-testid="transaction-row"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {getMerchantLogo(tx.description) ? (
                      <img
                        src={getMerchantLogo(tx.description)!}
                        alt=""
                        className="size-10 rounded-lg object-contain bg-white p-1 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-700 flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">payments</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{tx.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(tx.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <div className={`text-right flex-shrink-0 ${tx.amount < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                    <p className="text-base font-bold">
                      {tx.amount > 0 ? '+' : ''}<BlurredAmount amount={tx.amount} />
                    </p>
                  </div>
                </div>

                {(tx.category_name || (tx.tags && tx.tags.length > 0)) && (
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    {tx.category_name && (
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${tx.is_manual_category ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                          {tx.category_name}
                          {tx.is_manual_category && <span className="material-symbols-outlined text-[10px] ml-1">lock</span>}
                        </span>
                        {!tx.is_manual_category && (
                          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 text-[9px] font-black uppercase tracking-tighter">
                            <span className="material-symbols-outlined text-[10px]">priority_high</span>
                          </span>
                        )}
                      </div>
                    )}
                    {tx.tags && tx.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tx.tags.map(t => (
                          <span 
                            key={t.id} 
                            className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-700 dark:text-slate-200" 
                            style={{ backgroundColor: t.color ? `${t.color}20` : undefined, color: t.color }}
                          >
                            {t.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleCategorizeClick(tx)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-primary transition-colors active:scale-95"
                    title="Categorize"
                  >
                    <span className="material-symbols-outlined text-xl">category</span>
                  </button>
                  <button
                    onClick={() => handleEditClick(tx)}
                    className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-primary transition-colors active:scale-95"
                    title="Edit Tags"
                    data-testid="edit-button"
                  >
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block mt-6">
        {loading ? (
          <div className="text-center mt-5 text-slate-500">Loading...</div>
        ) : error ? (
          <div className="mt-4 p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">{error}</div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 bg-background-light dark:divide-slate-800 dark:bg-background-dark">
              <thead className="bg-slate-50 dark:bg-slate-900/40">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
                    scope="col"
                    onClick={() => requestSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date
                      <span className="material-symbols-outlined text-sm">{getSortIcon('date')}</span>
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
                    scope="col"
                    onClick={() => requestSort('description')}
                  >
                    <div className="flex items-center gap-1">
                      Description
                      <span className="material-symbols-outlined text-sm">{getSortIcon('description')}</span>
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
                    scope="col"
                    onClick={() => requestSort('category_name')}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      <span className="material-symbols-outlined text-sm">{getSortIcon('category_name')}</span>
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400 cursor-pointer hover:text-primary transition-colors"
                    scope="col"
                    onClick={() => requestSort('amount')}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Amount
                      <span className="material-symbols-outlined text-sm">{getSortIcon('amount')}</span>
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400" scope="col">Tags</th>
                  <th className="relative px-4 py-3" scope="col"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-slate-500">No transactions found.</td>
                  </tr>
                ) : (
                  sortedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors" data-testid="transaction-row">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                        <div className="flex items-center gap-3">
                          {getMerchantLogo(tx.description) ? (
                            <img
                              src={getMerchantLogo(tx.description)!}
                              alt=""
                              className="size-8 rounded-lg object-contain bg-white p-1 border border-slate-200 dark:border-slate-700"
                              onError={(e) => (e.currentTarget.style.display = 'none')}
                            />
                          ) : (
                            <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
                              <span className="material-symbols-outlined text-xl">payments</span>
                            </div>
                          )}
                          <span>{tx.description}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                        {tx.category_name ? (
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tx.is_manual_category ? "bg-primary/20 text-primary" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"}`}>
                              {tx.category_name}
                              {tx.is_manual_category && <span className="material-symbols-outlined text-[10px] ml-1">lock</span>}
                            </span>
                            {!tx.is_manual_category && (
                              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 text-[9px] font-black uppercase tracking-tighter" title="AI Categorized - Review?">
                                <span className="material-symbols-outlined text-[10px]">priority_high</span>
                                Review
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Uncategorized</span>
                        )}
                      </td>
                      <td className={`px-4 py-4 whitespace-nowrap text-right text-sm ${tx.amount < 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>
                        <BlurredAmount amount={tx.amount} />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-wrap gap-1">
                          {tx.tags && tx.tags.map(t => (
                            <span key={t.id} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200" style={{ backgroundColor: t.color ? `${t.color}20` : undefined, color: t.color }}>
                              {t.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium flex gap-2 justify-end">
                        <button
                          onClick={() => handleCategorizeClick(tx)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary transition-colors"
                          title="Categorize"
                        >
                          <span className="material-symbols-outlined text-lg">category</span>
                        </button>
                        <button
                          onClick={() => handleEditClick(tx)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-primary transition-colors"
                          title="Edit Tags"
                          data-testid="edit-button"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingTx && (
        <div 
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm md:p-4 animate-in fade-in duration-200"
          onClick={() => setShowEditModal(false)}
        >
          <div 
            className="w-full md:w-full md:max-w-md md:rounded-xl bg-background-light p-6 shadow-2xl dark:bg-background-dark md:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Transaction</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Modify the tags for this transaction.</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <input
                  className="mt-2 block w-full rounded-lg border-slate-200 bg-slate-100 px-4 py-3 text-slate-600 focus:border-primary focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 h-11"
                  type="text"
                  value={editingTx.description}
                  disabled
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tags</label>
                <div className="mt-2">
                  <TagInput selectedTags={editTags} onTagsChange={setEditTags} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-slate-100 text-slate-700 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categorize Modal */}
      {showCatModal && catTx && (
        <div 
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-sm md:p-4 animate-in fade-in duration-200"
          onClick={() => setShowCatModal(false)}
        >
          <div 
            className="w-full md:w-full md:max-w-md md:rounded-xl bg-background-light p-6 shadow-2xl dark:bg-background-dark md:max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Categorize Transaction</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Set a category and optionally create a rule.</p>
              </div>
              <button
                onClick={() => setShowCatModal(false)}
                className="md:hidden flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Transaction</label>
                <p className="text-base text-slate-900 dark:text-white font-medium mt-2">{catTx.description}</p>
                <p className="text-sm text-slate-500 mt-1"><BlurredAmount amount={catTx.amount} /></p>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
                <input
                  type="text"
                  className="mt-2 block w-full rounded-lg border-slate-200 bg-white px-4 py-3 text-slate-900 focus:border-primary focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white h-11"
                  placeholder="e.g. Groceries"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  autoCapitalize="words"
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  type="checkbox"
                  id="createRule"
                  checked={createRule}
                  onChange={(e) => setCreateRule(e.target.checked)}
                  className="mt-1 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <div className="flex flex-col flex-1">
                  <label htmlFor="createRule" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Always apply to similar transactions</label>

                  {createRule && (
                    <div className="mt-3 animate-in slide-in-from-top-1 fade-in duration-200">
                      <label className="text-xs text-slate-500 uppercase font-bold block mb-2">Match Keyword</label>
                      <input
                        type="text"
                        className="block w-full rounded-lg border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-primary focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white h-11"
                        value={ruleKeyword}
                        onChange={(e) => setRuleKeyword(e.target.value)}
                        autoCapitalize="none"
                      />
                      <p className="text-xs text-slate-500 mt-2">If transaction description contains this, the category will be applied automatically.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowCatModal(false)}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-slate-100 text-slate-700 text-sm font-bold leading-normal tracking-[0.015em] hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors active:scale-95"
              >
                Cancel
              </button>
              <button
                onClick={handleCategorizeSave}
                className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-primary/90 transition-colors active:scale-95"
              >
                Save & Learn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
