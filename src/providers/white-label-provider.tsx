import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { WhiteLabelConfig } from '../shared/types';

interface WhiteLabelContextType {
    whiteLabelConfig: WhiteLabelConfig | null;
    setWhiteLabelConfig: (config: WhiteLabelConfig | null) => void;
}

const WhiteLabelContext = createContext<WhiteLabelContextType | undefined>(undefined);

interface WhiteLabelProviderProps {
    children: ReactNode;
}

export const WhiteLabelProvider: React.FC<WhiteLabelProviderProps> = ({ children }) => {
    const [whiteLabelConfig, setWhiteLabelConfig] = useState<WhiteLabelConfig | null>(null);

    // Apply global styles when whiteLabelConfig changes
    useEffect(() => {
        if (whiteLabelConfig) {
            // Apply CSS custom properties
            const root = document.documentElement;
            root.style.setProperty('--primary-color', whiteLabelConfig.primaryColor);
            root.style.setProperty('--secondary-color', whiteLabelConfig.secondaryColor);
            root.style.setProperty('--background-color', whiteLabelConfig.backgroundColor);
            root.style.setProperty('--text-color', whiteLabelConfig.textColor);
            root.style.setProperty('--accent-color', whiteLabelConfig.accentColor);
            root.style.setProperty('--font-family', whiteLabelConfig.fontFamily);

            // Apply global background and font
            document.body.style.backgroundColor = whiteLabelConfig.backgroundColor;
            document.body.style.fontFamily = whiteLabelConfig.fontFamily;
        }
    }, [whiteLabelConfig]);

    return (
        <WhiteLabelContext.Provider value={{ whiteLabelConfig, setWhiteLabelConfig }}>
            {children}
        </WhiteLabelContext.Provider>
    );
};

export const useWhiteLabel = (): WhiteLabelContextType => {
    const context = useContext(WhiteLabelContext);
    if (context === undefined) {
        throw new Error('useWhiteLabel must be used within a WhiteLabelProvider');
    }
    return context;
};

// Helper hook to get colors from API only (no fallbacks)
export const useWhiteLabelColors = () => {
    const { whiteLabelConfig } = useWhiteLabel();

    return {
        primaryColor: whiteLabelConfig?.primaryColor,
        secondaryColor: whiteLabelConfig?.secondaryColor,
        backgroundColor: whiteLabelConfig?.backgroundColor,
        textColor: whiteLabelConfig?.textColor,
        accentColor: whiteLabelConfig?.accentColor,
        fontFamily: whiteLabelConfig?.fontFamily,
    };
};
