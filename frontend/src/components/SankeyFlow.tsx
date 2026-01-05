import React from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import { usePrivacy } from '../contexts/PrivacyContext';

interface SankeyFlowProps {
    income: number;
    expenses: number;
    categories: { category: string; total: number }[];
}

const SankeyFlow: React.FC<SankeyFlowProps> = ({ income, expenses, categories }) => {
    const { isPrivacyMode } = usePrivacy();

    // Redesign logic: 
    // Nodes: [Income, Expenses, ...Categories, Savings, Shortfall]
    // Links: 
    // 1. Income -> Expenses (min(income, expenses))
    // 2. Income -> Savings (if income > expenses)
    // 3. Shortfall -> Expenses (if expenses > income)
    // 4. Expenses -> Category A, B, C...

    const nodes: any[] = [];
    const links: any[] = [];

    const totalCategorySpending = categories.reduce((sum, c) => sum + c.total, 0);
    // Categorized vs Uncategorized (to make it balance)
    const uncategorized = Math.max(0, expenses - totalCategorySpending);

    const displayCategories = [...categories];
    if (uncategorized > 0.01) {
        displayCategories.push({ category: 'Uncategorized', total: uncategorized });
    }

    // Add Nodes
    nodes.push({ name: 'Income', color: '#10b981' });
    nodes.push({ name: 'Expenses', color: '#f43f5e' });
    displayCategories.forEach(c => nodes.push({ name: c.category }));

    const isOverSpent = expenses > income;
    if (isOverSpent) {
        nodes.push({ name: 'Shortfall', color: '#ef4444' });
    } else {
        nodes.push({ name: 'Savings/Net', color: '#3b82f6' });
    }

    const incomeIdx = 0;
    const expensesIdx = 1;
    const resultIdx = nodes.length - 1;

    // Link: Income to Expenses
    links.push({
        source: incomeIdx,
        target: expensesIdx,
        value: Math.max(0.1, Math.min(income, expenses))
    });

    // Link: Balance
    if (isOverSpent) {
        links.push({
            source: resultIdx, // Shortfall
            target: expensesIdx,
            value: Math.max(0.1, expenses - income)
        });
    } else {
        links.push({
            source: incomeIdx,
            target: resultIdx, // Savings
            value: Math.max(0.1, income - expenses)
        });
    }

    // Links: Expenses to Categories
    displayCategories.forEach((c, idx) => {
        links.push({
            source: expensesIdx,
            target: idx + 2,
            value: Math.max(0.1, c.total)
        });
    });

    const data = { nodes, links };

    return (
        <div className="h-[400px] w-full mt-8">
            <h2 className="text-xl font-bold tracking-[-0.015em] text-slate-900 dark:text-white mb-6">Cash Flow Topology</h2>
            <ResponsiveContainer width="100%" height="100%">
                <Sankey
                    data={data}
                    node={{ stroke: '#3b82f6', strokeWidth: 2 }}
                    link={{ stroke: '#3b82f6', fill: '#3b82f6', fillOpacity: 0.1 }}
                    margin={{ top: 20, left: 20, right: 120, bottom: 20 }}
                    nodePadding={50}
                >
                    <Tooltip
                        formatter={(value: any) => [isPrivacyMode ? '••••' : `$${Number(value).toFixed(2)}`, 'Value']}
                    />
                </Sankey>
            </ResponsiveContainer>
        </div>
    );
};

export default SankeyFlow;
