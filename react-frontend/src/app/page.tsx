'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>This is your main page (Dashboard or Home page)</p>
    </div>
  );
};

export default HomePage;
