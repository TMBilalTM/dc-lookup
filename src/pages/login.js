import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();

  // useEffect kullanarak token varsa otomatik olarak yönlendirme yap
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/profile');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);

    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await axios.post('/api/login', { email, password });

      if (response.status === 200) {
        setErrorMessage('Giriş başarılı');
        const { token } = response.data;

        // Token'i localStorage veya sessionStorage'a saklayabilirsiniz
        localStorage.setItem('token', token);

        // Kullanıcı oturumu başarıyla kontrol edilmişse profil sayfasına yönlendirme yapın
        router.push('/profile');
        event.target.reset(); // Formu sıfırlayın
      } else {
        setErrorMessage('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please try again.');
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold text-center">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" name="email" id="email" placeholder="Email" required className="w-full p-2 mt-1 border rounded-md text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" name="password" id="password" placeholder="Password" required className="w-full p-2 mt-1 text-gray-600 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            {errorMessage && <div className="text-sm text-red-600">{errorMessage}</div>}
            <button type="submit" disabled={pending} className={`w-full py-2 mt-4 font-semibold text-white bg-indigo-600 rounded-md ${pending ? 'cursor-not-allowed opacity-50' : 'hover:bg-indigo-700'}`}>
              {pending ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
