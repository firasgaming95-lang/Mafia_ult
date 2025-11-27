import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  AuthError
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

interface AuthProps {
  onLogin: () => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle Email/Password Auth
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onLogin(); // Trigger parent state change
    } catch (err: any) {
      const firebaseError = err as AuthError;
      let msg = 'حدث خطأ غير معروف';
      
      // Translate common errors to Arabic
      switch (firebaseError.code) {
        case 'auth/email-already-in-use': msg = 'البريد الإلكتروني مستخدم بالفعل.'; break;
        case 'auth/invalid-email': msg = 'البريد الإلكتروني غير صالح.'; break;
        case 'auth/user-not-found': msg = 'المستخدم غير موجود.'; break;
        case 'auth/wrong-password': msg = 'كلمة المرور غير صحيحة.'; break;
        case 'auth/weak-password': msg = 'كلمة المرور ضعيفة جداً.'; break;
        default: msg = firebaseError.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Auth
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onLogin();
    } catch (err: any) {
      setError('فشل تسجيل الدخول عبر جوجل.');
    } finally {
      setLoading(false);
    }
  };

  // Inline Styles
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#050308',
    color: '#fff',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 9999, // Ensure it sits on top of the game
    direction: 'rtl',
    fontFamily: "'Tajawal', sans-serif"
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    padding: '40px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: '90%',
    maxWidth: '400px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    margin: '10px 0',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    color: '#fff',
    fontSize: '1rem',
    textAlign: 'right'
  };

  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px',
    margin: '10px 0',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: '0.3s'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: '20px', color: '#ffd700' }}>
          {isSignUp ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
        </h1>
        
        {error && (
          <div style={{ color: '#ff4757', background: 'rgba(255,71,87,0.1)', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleAuth}>
          <input 
            type="email" 
            placeholder="البريد الإلكتروني" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={inputStyle} 
            required 
          />
          <input 
            type="password" 
            placeholder="كلمة المرور" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={inputStyle} 
            required 
          />
          
          <button 
            type="submit" 
            style={{ ...btnStyle, background: 'linear-gradient(135deg, #00d2ff, #3a7bd5)', color: '#fff' }}
            disabled={loading}
          >
            {loading ? 'جاري التحميل...' : (isSignUp ? 'إنشاء حساب' : 'دخول')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
          <span style={{ padding: '0 10px', color: '#aaa', fontSize: '0.9rem' }}>أو</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.2)' }}></div>
        </div>

        <button 
          onClick={handleGoogleSignIn} 
          style={{ ...btnStyle, background: '#fff', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
          <span>الدخول عبر جوجل</span>
        </button>

        <p style={{ marginTop: '20px', color: '#ccc', fontSize: '0.9rem' }}>
          {isSignUp ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
          <span 
            onClick={() => setIsSignUp(!isSignUp)} 
            style={{ color: '#00d2ff', cursor: 'pointer', marginRight: '5px', fontWeight: 'bold' }}
          >
            {isSignUp ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </span>
        </p>
      </div>
    </div>
  );
}
