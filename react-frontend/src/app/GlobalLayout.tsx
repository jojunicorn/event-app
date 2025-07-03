'use client';

import { useEffect, useState } from "react";
import Navbar from './components/Navbar/NavBar';
import { AuthProvider } from './context/AuthContext';

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [globalSuccess, setGlobalSuccess] = useState<string | null>(null);

  useEffect(() => {
    const onError = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setGlobalError(customEvent.detail);
      setTimeout(() => setGlobalError(null), 5000);
    };
    const onSuccess = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setGlobalSuccess(customEvent.detail);
      setTimeout(() => setGlobalSuccess(null), 5000);
    };

    window.addEventListener('global-error', onError);
    window.addEventListener('global-success', onSuccess);
    return () => {
      window.removeEventListener('global-error', onError);
      window.removeEventListener('global-success', onSuccess);
    };
  }, []);

  return (
    <AuthProvider>
      <Navbar />
      {globalError && (
        <div className="toast toast-error">{globalError}</div>
      )}
      {globalSuccess && (
        <div className="toast toast-success">{globalSuccess}</div>
      )}
      {children}
    </AuthProvider>
  );
}
