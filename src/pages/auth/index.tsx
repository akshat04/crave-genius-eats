import React from 'react';

export default function AuthPage() {
  const providers = [
    { name: 'Google', url: '/api/auth/oauth?provider=google' },
    { name: 'GitHub', url: '/api/auth/oauth?provider=github' },
  ];

  return (
    <div className="auth-container">
      <h2>Login / Signup</h2>
      <div className="buttons">
        {providers.map((prov) => (
          <a key={prov.name} href={prov.url} className="oauth-btn">
            Continue with {prov.name}
          </a>
        ))}
      </div>
    </div>
  );
}
