import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [sent, setSent]       = useState(false);
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await apiClient.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Hero Panel ── */}
      <section
        className="hidden lg:flex flex-1 relative overflow-hidden items-center px-14 py-16 text-white"
        style={{ background: 'linear-gradient(135deg, #0d47a1 0%, #1976D2 40%, #2196F3 100%)' }}
      >
        {/* Background glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.15) 0%, transparent 50%)',
          }}
        />

        {/* Floating shapes */}
        <div className="absolute -top-28 -right-28 w-80 h-80 rounded-full animate-[float_20s_ease-in-out_infinite]"
          style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full animate-[float_20s_ease-in-out_7s_infinite]"
          style={{ background: 'rgba(255,255,255,0.08)' }} />

        <div className="relative z-10 max-w-lg">
          {/* Brand Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-white/25"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
            >
              <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L19 5V10C19 15 15.5 19.7 12 22C8.5 19.7 5 15 5 10V5L12 2Z"
                  fill="white" opacity="0.95" />
                <path d="M12 8V14M9 11H15" stroke="#1976D2" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Rabies Care</h2>
              <p className="text-sm opacity-90 font-medium">Management System</p>
            </div>
          </div>

          <h1 className="text-5xl font-bold leading-tight tracking-tight mb-5"
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
          >
            Account Recovery
          </h1>
          <p className="text-lg leading-relaxed opacity-95 mb-10">
            Enter the email associated with your account and we'll send you a temporary password to regain access.
          </p>

          {/* Steps */}
          <div className="flex flex-col gap-4">
            {[
              {
                step: '01',
                label: 'Enter Your Email',
                desc: 'Provide the email linked to your account',
              },
              {
                step: '02',
                label: 'Check Your Inbox',
                desc: 'We\'ll send a temporary password to your email',
              },
              {
                step: '03',
                label: 'Log In & Change Password',
                desc: 'Use the temporary password then update it in settings',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="flex items-center gap-4 p-4 rounded-xl border border-white/15 transition-all duration-300"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20 flex-shrink-0 font-bold text-sm"
                  style={{ background: 'rgba(255,255,255,0.15)' }}
                >
                  {s.step}
                </div>
                <div>
                  <h3 className="font-bold text-base mb-0.5">{s.label}</h3>
                  <p className="text-sm opacity-90 leading-snug">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes float {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(20px, -20px) scale(1.05); }
            50% { transform: translate(-15px, 15px) scale(0.95); }
            75% { transform: translate(15px, 20px) scale(1.02); }
          }
        `}</style>
      </section>

      {/* ── Right Panel ── */}
      <aside className="w-full lg:w-[560px] flex items-center justify-center bg-white px-8 py-12">
        <div className="w-full max-w-md">

          {/* Back to Login */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Login
          </button>

          {!sent ? (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'linear-gradient(135deg, #1976D2, #1565C0)' }}>
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Forgot Password?</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  No worries! Enter your email address and we'll send you a temporary password.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 px-4 py-3 mb-5 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 8V12M12 16H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 transition-all duration-200 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-white font-bold text-base transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #1976D2, #1565C0)',
                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.boxShadow = '0 8px 20px rgba(25, 118, 210, 0.35)')}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(25, 118, 210, 0.25)'}
                >
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Temporary Password</span>
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Remember your password?{' '}
                <button onClick={() => navigate('/login')} className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
                  Sign in here
                </button>
              </p>
            </>
          ) : (
            /* ── Success State ── */
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-emerald-500" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check Your Email</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                A temporary password has been sent to:
              </p>
              <p className="font-semibold text-blue-600 text-sm mb-6 bg-blue-50 px-4 py-2 rounded-lg inline-block">
                {email}
              </p>
              <p className="text-gray-400 text-xs mb-8">
                Use it to log in, then change your password from the Settings page. If you don't see it, check your spam folder.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl text-white font-bold text-base transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(135deg, #1976D2, #1565C0)',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.25)',
                }}
              >
                Back to Login
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
            <p>© 2026 Rabies Care Management System</p>
            <p className="mt-1">For authorized personnel only</p>
          </div>
        </div>
      </aside>
    </div>
  );
}