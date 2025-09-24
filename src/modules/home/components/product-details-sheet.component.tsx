// Deprecated local sheet: Home now uses the shared ProductDetailsSheet from `src/modules/product-details`.
// Keep a minimal placeholder to satisfy TypeScript while preserving file history.
import React from 'react';

export const ProductDetailsSheet: React.FC<{ isOpen: boolean; onClose: () => void } & Record<string, unknown>> = () => {
  return null;
};
