import React, { createContext, useContext, useState } from 'react';

interface PrivacyContextType {
    isPrivacyMode: boolean;
    togglePrivacyMode: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export const PrivacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isPrivacyMode, setIsPrivacyMode] = useState(() => {
        const saved = localStorage.getItem('privacyMode');
        return saved ? JSON.parse(saved) : false;
    });

    const togglePrivacyMode = () => {
        setIsPrivacyMode((prev: boolean) => {
            const newValue = !prev;
            localStorage.setItem('privacyMode', JSON.stringify(newValue));
            return newValue;
        });
    };

    return (
        <PrivacyContext.Provider value={{ isPrivacyMode, togglePrivacyMode }}>
            {children}
        </PrivacyContext.Provider>
    );
};

export const usePrivacy = () => {
    const context = useContext(PrivacyContext);
    if (context === undefined) {
        throw new Error('usePrivacy must be used within a PrivacyProvider');
    }
    return context;
};
