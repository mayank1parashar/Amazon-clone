import { supabase } from './supabase.js';

const isLoginPage = window.location.pathname.includes('login.html');
const isSignupPage = window.location.pathname.includes('signup.html');

if (isLoginPage) {
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
} else if (isSignupPage) {
  document.getElementById('signupForm').addEventListener('submit', handleSignup);
}

async function handleLogin(e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('loginBtn');
  const errorDiv = document.getElementById('errorMessage');

  loginBtn.disabled = true;
  loginBtn.textContent = 'Signing in...';
  errorDiv.classList.add('hidden');

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    window.location.href = '/';
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
    loginBtn.disabled = false;
    loginBtn.textContent = 'Sign In';
  }
}

async function handleSignup(e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const repassword = document.getElementById('repassword').value;
  const signupBtn = document.getElementById('signupBtn');
  const errorDiv = document.getElementById('errorMessage');

  errorDiv.classList.add('hidden');

  if (password !== repassword) {
    errorDiv.textContent = 'Passwords do not match';
    errorDiv.classList.remove('hidden');
    return;
  }

  if (password.length < 6) {
    errorDiv.textContent = 'Password must be at least 6 characters';
    errorDiv.classList.remove('hidden');
    return;
  }

  signupBtn.disabled = true;
  signupBtn.textContent = 'Creating account...';

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name
        }
      }
    });

    if (error) throw error;

    alert('Account created successfully! Redirecting to login...');
    window.location.href = '/pages/login.html';
  } catch (error) {
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
    signupBtn.disabled = false;
    signupBtn.textContent = 'Create Account';
  }
}

async function checkAuth() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export { checkAuth };
