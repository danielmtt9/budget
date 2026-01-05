import React from 'react';
import { usePrivacy } from '../contexts/PrivacyContext';

interface BlurredAmountProps {
    amount: string | number;
    className?: string;
    isCurrency?: boolean;
}

const BlurredAmount: React.FC<BlurredAmountProps> = ({ amount, className = "", isCurrency = true }) => {
    const { isPrivacyMode } = usePrivacy();

    const safeAmount = amount ?? 0;

    const formattedAmount = typeof safeAmount === 'number'
        ? safeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        : String(safeAmount);

    const displayAmount = isCurrency && !formattedAmount.startsWith('$') && !formattedAmount.startsWith('-') && !formattedAmount.startsWith('+')
        ? `$${formattedAmount}`
        : formattedAmount;

    return (
        <span
            className={`transition-all duration-300 ${isPrivacyMode ? 'blur-md select-none' : ''} ${className}`}
            aria-hidden={isPrivacyMode}
        >
            {displayAmount}
        </span>
    );
};

export default BlurredAmount;
