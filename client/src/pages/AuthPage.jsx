import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const { authenticate } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await authenticate(isLogin ? '/auth/login' : '/auth/register', form);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-lg border border-stone-200 bg-white p-6">
        <div>
          <h1 className="text-xl font-semibold">{isLogin ? 'Sign in' : 'Create your account'}</h1>
          <p className="mt-1 text-sm text-stone-500">
            {isLogin ? 'Pick up where you left off.' : 'Keep your tasks in one place.'}
          </p>
        </div>

        {error && <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        {!isLogin && (
          <label className="block text-sm font-medium">
            Name
            <input className="input mt-1 font-normal" name="name" value={form.name} onChange={set} required autoComplete="name" />
          </label>
        )}
        <label className="block text-sm font-medium">
          Email
          <input className="input mt-1 font-normal" type="email" name="email" value={form.email} onChange={set} required autoComplete="email" />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            className="input mt-1 font-normal"
            type="password"
            name="password"
            value={form.password}
            onChange={set}
            required
            minLength={isLogin ? undefined : 6}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
          />
        </label>

        <button className="btn-primary w-full" disabled={busy}>
          {busy ? 'Please wait' : isLogin ? 'Sign in' : 'Create account'}
        </button>

        <p className="text-center text-sm text-stone-500">
          {isLogin ? 'New here? ' : 'Already have an account? '}
          <Link className="font-medium text-teal-700 hover:underline" to={isLogin ? '/register' : '/login'}>
            {isLogin ? 'Create an account' : 'Sign in'}
          </Link>
        </p>
      </form>
    </main>
  );
}
