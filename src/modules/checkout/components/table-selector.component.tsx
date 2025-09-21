import React, { useRef, useEffect, useState } from 'react';
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
                className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-3 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-medium text-gray-700 arabic-text">
                    رقم الطاولة
                </span>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 arabic-text">
                        {selectedTable ? `الطاولة رقم ${selectedTable.number}` : "اختر"}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute top-full right-0 left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-20 overflow-hidden">
                    {tableOptions.map((table) => (
                        <div
                            key={table.id}
                            className={`flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${!table.isAvailable ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            onClick={() => table.isAvailable && handleTableSelect(table)}
                        >
                            <div className="relative">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedTable?.id === table.id
                                        ? 'border-[#50BF63] bg-[#50BF63]'
                                        : 'border-gray-300'
                                    }`}>
                                    {selectedTable?.id === table.id && (
                                        <div className="w-2 h-2 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1">
                                <span className="text-sm font-medium text-gray-800 arabic-text">
                                    الطاولة رقم {table.number}
                                </span>
                                {table.capacity && (
                                    <span className="text-xs text-gray-500 arabic-text block">
                                        {table.capacity} أشخاص
                                    </span>
                                )}
                            </div>
                            {!table.isAvailable && (
                                <span className="text-xs text-red-500 arabic-text">
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
