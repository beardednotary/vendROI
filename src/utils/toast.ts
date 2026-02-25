// src/utils/toast.ts

type ToastCallback = (options: {
  type: 'success' | 'error' | 'info';
  text1: string;
  text2?: string;
}) => void;

let listeners: ToastCallback[] = [];

export const Toast = {
  show: (options: {
    type: 'success' | 'error' | 'info';
    text1: string;
    text2?: string;
  }) => {
    listeners.forEach(listener => listener(options));
  },
  
  _subscribe: (callback: ToastCallback) => {
    listeners.push(callback);
    return () => {
      listeners = listeners.filter(listener => listener !== callback);
    };
  },
};