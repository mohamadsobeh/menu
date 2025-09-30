import React, { useRef, useEffect, useState } from 'react';
import { useWhiteLabelColors } from '../../../providers/white-label-provider';
import type { TableOption } from '../types';

interface TableSelectorProps {
    tableOptions: TableOption[];
    selectedTable?: TableOption;
    onSelectTable: (table: TableOption) => void;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
    tableOptions,
    selectedTable,
    onSelectTable,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { backgroundColor, primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleTableSelect = (table: TableOption) => {
        onSelectTable(table);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                className="flex justify-between items-center rounded-lg p-3 cursor-pointer"
                style={{ backgroundColor: backgroundColor, border: `1px solid ${secondaryColor}` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-medium arabic-text" style={{ color: textColor }}>
                    رقم الطاولة
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-sm arabic-text" style={{ color: secondaryColor }}>
                        {selectedTable ? `الطاولة رقم ${selectedTable.number}` : "اختر"}
                    </span>
                    <svg
                        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke={textColor}
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full right-0 left-0 mt-1 rounded-lg shadow-xl z-20 overflow-hidden" style={{ backgroundColor: backgroundColor, border: `1px solid ${secondaryColor}` }}>
                    {tableOptions.map((table) => (
                        <div
                            key={table.id}
                            className={`flex items-center gap-3 p-4 cursor-pointer last:border-b-0 ${!table.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            style={{ borderBottom: `1px solid ${secondaryColor}` }}
                            onClick={() => table.isAvailable && handleTableSelect(table)}
                        >
                            <div className="relative">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                                    style={{ borderColor: selectedTable?.id === table.id ? primaryColor : secondaryColor, backgroundColor: selectedTable?.id === table.id ? primaryColor : backgroundColor }}>
                                    {selectedTable?.id === table.id && (
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: textColor }}></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium arabic-text" style={{ color: textColor }}>
                                    الطاولة رقم {table.number}
                                </span>
                                {table.capacity && (
                                    <span className="text-xs arabic-text block" style={{ color: secondaryColor }}>
                                        {table.capacity} أشخاص
                                    </span>
                                )}
                            </div>
                            {!table.isAvailable && (
                                <span className="text-xs arabic-text" style={{ color: accentColor }}>
                                    غير متاحة
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
