import React, { useEffect, useState } from 'react';
import Auth from './Auth';
import { auth } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Optional: Refresh page to reset game state
      window.location.reload();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        background: '#050308', 
        color: '#fff',
        fontFamily: 'Tajawal, sans-serif'
      }}>
        جاري التحميل...
      </div>
    );
  }

  // If user is not logged in, show Auth component
  // This sits on top of the HTML game (via z-index in Auth.tsx)
  if (!user) {
    return <Auth onLogin={() => {}} />;
  }

  // If user is logged in, show the "Sign Out" button overlaid on the game
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      left: '10px', 
      zIndex: 2000 
    }}>
      <button 
        onClick={handleLogout}
        style={{
          background: 'rgba(255, 46, 99, 0.8)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '8px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'Tajawal, sans-serif',
          fontSize: '0.9rem',
          backdropFilter: 'blur(4px)'
        }}
      >
        🚪 خروج ({user.email?.split('@')[0]})
      </button>
    </div>
  );
};

export default App;
