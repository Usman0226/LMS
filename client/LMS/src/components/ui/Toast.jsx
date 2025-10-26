import React from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const toastVariants = {
  success: {
    icon: CheckCircleIcon,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    iconColor: 'text-green-500'
  },
  error: {
    icon: XCircleIcon,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-900',
    iconColor: 'text-red-500'
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-900',
    iconColor: 'text-yellow-500'
  },
  info: {
    icon: InformationCircleIcon,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-900',
    iconColor: 'text-blue-500'
  }
};

export default function Toast({ toast, onClose }) {
  const variant = toastVariants[toast.type];
  const Icon = variant.icon;

  return (
    <div className={`
      ${variant.bgColor} ${variant.borderColor} ${variant.textColor}
      border rounded-lg shadow-lg p-4 pr-10 relative
      transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-right-full
    `}>
      <div className="flex items-start space-x-3">
        <Icon className={`h-5 w-5 ${variant.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium break-words">{toast.message}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          aria-label="Close toast"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
