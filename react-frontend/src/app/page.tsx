'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


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
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ fontSize: '2.2rem', color: '#222', marginBottom: '1rem' }}>
        Welcome to EventSphere
      </h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#444' }}>
        EventSphere is your all-in-one platform to discover, organize, and manage events effortlessly.
        Whether you are attending exciting gatherings or hosting your own, EventSphere makes it easy to
        connect with others, customize your preferences, and keep everything in one place. Start finding your event in the{' '}
        <Link href="/browse">
          <span style={{ color: '#0070f3', textDecoration: 'underline', fontWeight: 'bold', cursor: 'pointer' }}>
            Browsing
          </span>
        </Link>{' '}
        section!
      </p>
    </div>
  );
};

export default HomePage;
