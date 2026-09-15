'use client';

import React, { useEffect, ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
  description?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  className?: string;
  contentClassName?: string;
  footerClassName?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  header,
  footer,
  children,
  size = 'md',
  className = '',
  contentClassName = '',
  footerClassName = '',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  ariaLabel,
  ariaLabelledBy,
}: ModalProps) {
  // Close on Escape key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const defaultTitleId = 'modal-dialog-title';
  const titleId = ariaLabelledBy || (title ? defaultTitleId : undefined);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <div
        className={`w-full ${sizeClasses[size]} rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Custom header or default header */}
        {header ? (
          header
        ) : title ? (
          <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-5 bg-zinc-900/90">
            <div className="min-w-0 flex-1 pr-4">
              <h2 id={titleId} className="text-base sm:text-lg font-bold text-white truncate">
                {title}
              </h2>
              {description && (
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">{description}</p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ) : null}

        {/* Modal Body Content */}
        <div className={`flex-1 overflow-y-auto ${contentClassName || 'p-4 sm:p-5'}`}>
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className={`border-t border-zinc-800 p-3 sm:p-4 bg-zinc-900/90 flex justify-end ${footerClassName}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;