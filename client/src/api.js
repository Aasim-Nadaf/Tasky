const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default async function request(path, { method = 'GET', body } = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body && JSON.stringify(body),
  });

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (res.status === 401 && token) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  if (!res.ok) throw new Error(data?.message || 'Request failed');
  return data;
}
