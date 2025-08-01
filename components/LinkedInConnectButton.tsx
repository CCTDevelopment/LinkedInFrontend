'use client';

import { useState } from 'react';

export default function LinkedInConnectButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Not logged in.');
        return;
      }

      const res = await fetch('/api/linkedin/oauth_url', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      const authUrl = data.auth_url;

      const popup = window.open('', '_blank', 'width=600,height=700');
      if (!popup) {
        alert('Popup blocked.');
        return;
      }

      popup.location.href = authUrl;
    } catch (err) {
      console.error('OAuth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      {loading ? 'Connecting...' : 'Connect LinkedIn'}
    </button>
  );
}
