'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { UserRequest } from '@/models/user';
import { Roles } from '@/enums/roles';
import { login, register } from '@/apiCalls/user'
import { useAuth } from '../context/AuthContext';



const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [registeringMessage, setRegisteringMessage] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerRequest, setRegisterRequest] = useState<UserRequest>({
    name: '',
    username: '',
    email: '',
    password: '',
    role: Roles.USER,
    birthdate: ''
  });

  const router = useRouter();
  const { login: contextLogin } = useAuth();


  useEffect(() => {
    const hasToken = localStorage.getItem('token');
    if (hasToken) {
      router.push(`/`);
    }
  }, [router]);

  const toggleRegisterForm = () => {
    setShowRegister((prev) => !prev);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const loginRequest = { email, password };

    try {
      const response = await login(loginRequest);
      const { token, role, userId } = response;

      contextLogin(token, role, userId);

      setSuccessMessage('Login successful');
      router.push(`/mySphere`);

      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Invalid credentials or server error.');
      setSuccessMessage('');
      console.log(error)
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setRegisteringMessage('');
    const formattedRequest = {
      ...registerRequest,
      birthdate: new Date(registerRequest.birthdate).toISOString()
    };

    try {
      await register(formattedRequest);
      setRegisteringMessage('Registration Successful, you can log in now.');
      openPopup('green', 'Register Successful!', 'block');
    } catch (error) {
      setRegisteringMessage('Error during registration.');
      openPopup('red', 'Registration Failed', 'none');
      console.log(error)
    }
  };

  const openPopup = (color: string, heading: string, goLogin: string) => {
    console.log('Opening popup...');
    document.getElementById('popupHeading')!.textContent = heading;
    document.getElementById('popupHeading')!.style.color = color;
    document.getElementById('popupText')!.textContent = registeringMessage;
    document.getElementById('goLogin')!.style.display = goLogin;
    document.getElementById('popup')!.style.display = 'block';
  };
  

  return (
    <div className={styles['login-body']}>
      <h1 className={styles['event-heading']}>
        EventSphere
      </h1>

      <div className={styles['login-main']}>
        {/* Login Form */}
        {!showRegister && (
          <div className={styles['signup']}>
            <label className={styles['login-label']}>
              Login
            </label>
            <form onSubmit={handleLogin} id="loginForm">
              <input
                className={styles['login-input']}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                className={styles['login-input']}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button type="submit" className={styles['login-button']}>
                Login
              </button>
            </form>
            {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
            {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
            <p className={styles['register-link']} onClick={toggleRegisterForm}>
              Do not have an account? Register
            </p>
          </div>
        )}

        {/* Register Form */}
        {showRegister && (
          <div className={styles['login']}>
            <label className={`${styles['login-label']} ${styles['register']}`}>
              Register
            </label>

            <form onSubmit={handleRegister} className="register-form">
              <input
                type="text"
                className={styles['login-input']}
                placeholder="Name"
                value={registerRequest.name}
                onChange={(e) =>
                  setRegisterRequest({ ...registerRequest, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                className={styles['login-input']}
                placeholder="Username"
                value={registerRequest.username}
                onChange={(e) =>
                  setRegisterRequest({ ...registerRequest, username: e.target.value })
                }
                required
              />
              <input
                type="email"
                className={styles['login-input']}
                placeholder="Email"
                value={registerRequest.email}
                onChange={(e) =>
                  setRegisterRequest({ ...registerRequest, email: e.target.value })
                }
                required
              />
              <input
                type="password"
                className={styles['login-input']}
                placeholder="Password"
                value={registerRequest.password}
                onChange={(e) =>
                  setRegisterRequest({ ...registerRequest, password: e.target.value })
                }
                required
              />
              <input
                type="date"
                className={styles['login-input']}
                value={registerRequest.birthdate}
                onChange={(e) =>
                  setRegisterRequest({ ...registerRequest, birthdate: e.target.value })
                }
                required
              />

   
              <button type="submit" className={styles['login-button']}>
                Register
              </button>
            </form>
            <p className={styles['register-link']} onClick={toggleRegisterForm}>
              Already have an account? Login
            </p>
          </div>
        )}
      </div>
      <div id="popup" className={styles['popup']} style={{ display: 'none' }}>
        <h2 id="popupHeading">Popup Heading</h2>
        <p id="popupText">Popup message goes here</p>
        <button
          id="goLogin"
          onClick={() => {
            setShowRegister(false);
            document.getElementById('popup')!.style.display = 'none';
          }}
          className={styles['login-button']}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
