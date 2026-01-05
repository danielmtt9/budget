import { useEffect, useState } from 'react';
import { getCategories, updateCategory, getSpendingByCategory } from '../services/api';
import BlurredAmount from '../components/BlurredAmount';

interface Category {
    id: number;
    name: string;
    monthly_limit: number;
}

interface CategorySpending {
    category: string;
    total: number;
    limit: number;
}

const Budget = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [spending, setSpending] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    const fetchData = async () => {
        try {
            const [cats, spend] = await Promise.all([
                getCategories(),
                getSpendingByCategory()
            ]);
            setCategories(cats);

            const spendMap: Record<string, number> = {};
            spend.forEach((s: CategorySpending) => {
                spendMap[s.category] = s.total;
            });
            setSpending(spendMap);
        } catch (error) {
            console.error('Failed to fetch budget data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditValue(cat.monthly_limit.toString());
    };

    const handleSave = async (id: number) => {
        try {
            await updateCategory(id, { monthly_limit: parseFloat(editValue) || 0 });
            setEditingId(null);
            fetchData();
        } catch (error) {
            console.error('Failed to update category limit:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <div className="text-slate-500 dark:text-slate-400">Loading budget...</div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-4xl font-black tracking-[-0.033em] text-slate-900 dark:text-white">Budgeting</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your monthly spending limits by category.</p>
            </header>

            <div className="grid gap-6">
                {categories.map((cat) => {
                    const spent = spending[cat.name] || 0;
                    const limit = cat.monthly_limit;
                    const percentage = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
                    const isOver = limit > 0 && spent > limit;

                    return (
                        <div key={cat.id} className="rounded-2xl border border-slate-200/80 bg-background-light p-6 dark:border-slate-800 dark:bg-background-dark shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <span className="material-symbols-outlined">category</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider">{cat.name}</h3>
                                        <p className="text-sm text-slate-500">Monthly Target</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {editingId === cat.id ? (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-24 rounded-lg border border-slate-200 bg-white px-3 py-2 min-h-[44px] text-sm dark:border-slate-700 dark:bg-slate-800"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => handleSave(cat.id)}
                                                className="rounded-lg bg-primary px-4 py-2 min-h-[44px] text-sm font-bold text-white hover:bg-primary/90 active:scale-95 transition-transform"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-2 text-2xl font-black text-slate-900 dark:text-white">
                                                <BlurredAmount amount={limit} />
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-sm">edit</span>
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500">Limit per month</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Spent: <span className="font-bold text-slate-900 dark:text-white"><BlurredAmount amount={spent} /></span></span>
                                    <span className={`font-bold ${isOver ? 'text-red-500' : 'text-slate-500'}`}>
                                        {percentage.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-3 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-500 ease-out ${isOver ? 'bg-red-500' : percentage > 80 ? 'bg-amber-500' : 'bg-primary'}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                {isOver && (
                                    <p className="text-xs text-red-500 font-medium">Over budget by <BlurredAmount amount={spent - limit} /></p>
                                )}
                            </div>
                        </div>
                    );
                })}

                {categories.length === 0 && (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">category</span>
                        <p className="text-slate-500">No categories found. Sync transactions to see your categories.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Budget;
