// pages/register.js

import { useState } from 'react';
import { useRouter } from 'next/router';

export default function RegisterPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const token = localStorage.getItem('token');
        if (token) {
          router.push('/profile');

        }
  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);

    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        router.push('/login'); // Kayıt başarılıysa login sayfasına yönlendir
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Register</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" name="name" id="name" placeholder="Name" required className="w-full p-2 mt-1 border rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" placeholder="Email" required className="w-full p-2 mt-1 border rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" id="password" placeholder="Password" required className="w-full p-2 mt-1 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
            <RegisterButton pending={pending} />
          </form>
        </div>
      </div>
    </>
  );
}

function RegisterButton({ pending }) {
  return (
    <button type="submit" disabled={pending} className={`w-full py-2 mt-4 font-semibold text-white bg-indigo-600 rounded-md ${pending ? 'cursor-not-allowed opacity-50' : 'hover:bg-indigo-700'}`}>
      {pending ? 'Registering...' : 'Register'}
    </button>
  );
}
