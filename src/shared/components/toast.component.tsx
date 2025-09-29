import React, { useEffect } from 'react';
import { useWhiteLabelColors } from '../../providers/white-label-provider';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  isVisible
}) => {
  const { primaryColor, secondaryColor, textColor, accentColor } = useWhiteLabelColors();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'error':
        return { backgroundColor: '#ef4444', color: textColor }; // Keep red for error
      case 'success':
        return { backgroundColor: primaryColor, color: textColor };
      case 'warning':
        return { backgroundColor: accentColor, color: textColor };
      default:
        return { backgroundColor: secondaryColor, color: textColor };
    }
  };

  const toastStyles = getToastStyles();

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
      <div
        className="px-6 py-4 rounded-lg shadow-lg min-w-80 max-w-md arabic-text text-sm font-medium flex items-center justify-center"
        style={toastStyles}
      >
        {message}
      </div>
    </div>
  );
};
