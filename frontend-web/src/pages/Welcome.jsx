import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Welcome() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-blue-400 text-white">

      {/* Background radial blobs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-3/4 w-64 h-64 bg-white rounded-full blur-2xl" />
      </div>

      {/* Floating shapes */}
      <div
        className="absolute -top-36 -right-36 w-96 h-96 rounded-full animate-[float_20s_ease-in-out_infinite]"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full animate-[float_20s_ease-in-out_7s_infinite]"
        style={{ background: 'rgba(255,255,255,0.07)' }}
      />
      <div
        className="absolute top-1/2 left-3/4 w-48 h-48 rounded-full animate-[float_20s_ease-in-out_3s_infinite]"
        style={{ background: 'rgba(255,255,255,0.06)' }}
      />

      {/* Main container */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 py-16 flex flex-col lg:flex-row items-center gap-16 lg:gap-24 w-full">

        {/* Logo Section */}
        <div
          className={`flex flex-col items-center transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="relative flex items-center justify-center">
          {/* Logo Section */}
<div
  className={`flex flex-col items-center transition-all duration-700 ease-out ${
    visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`}
>
  {/* iRabiesCare SVG Logo - no circle */}
  <svg width="220" height="220" viewBox="255 55 170 250" xmlns="http://www.w3.org/2000/svg">
    {/* Shield background */}
    <path d="M340 55 L425 88 L425 202 Q425 268 340 300 Q255 268 255 202 L255 88 Z" fill="rgba(255,255,255,0.9)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
    {/* Shield inner */}
    <path d="M340 72 L410 100 L410 200 Q410 254 340 282 Q270 254 270 200 L270 100 Z" fill="rgba(255,255,255,0.7)" stroke="none"/>
    {/* Cross symbol */}
    <rect x="322" y="118" width="36" height="100" rx="6" fill="#1a5fa8" opacity="0.95"/>
    <rect x="292" y="148" width="96" height="36" rx="6" fill="#1a5fa8" opacity="0.95"/>
    {/* Syringe on cross */}
    <rect x="335" y="128" width="10" height="60" rx="3" fill="white"/>
    <rect x="330" y="155" width="20" height="24" rx="2" fill="#5ba4e6"/>
    <line x1="340" y1="188" x2="340" y2="200" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    {/* Paw prints */}
    <circle cx="302" cy="158" r="5" fill="white"/>
    <circle cx="378" cy="158" r="5" fill="white"/>
    <circle cx="302" cy="172" r="5" fill="white"/>
    <circle cx="378" cy="172" r="5" fill="white"/>
  </svg>

  
</div>
</div>

          {/* iRabiesCare name under logo */}
          <div className="mt-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight drop-shadow">
              <span className="italic text-red-400">i</span>
              <span className="text-white">Rabies</span>
              <span className="text-blue-200">Care</span>
            </h2>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`flex flex-col items-center lg:items-start transition-all duration-700 delay-200 ease-out ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Title Block */}
          <div className="text-center lg:text-left mb-8">
            <p className="uppercase tracking-widest text-xs font-semibold opacity-90 mb-5">
              Case Management System and Vaccination Monitoring for Rabies Prevention in Bohol
            </p>
            <div className="w-20 h-1 rounded-full mx-auto lg:mx-0 mb-5"
              style={{ background: 'linear-gradient(90deg, transparent, #fff, transparent)', opacity: 0.7 }}
            />
            <p className="text-lg leading-relaxed opacity-95 max-w-lg font-light">
              Protecting Lives Through Timely Vaccination &amp; Comprehensive Care
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-xl">
            {[
              {
                label: 'Track Cases',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <rect x="8" y="2" width="8" height="4" rx="1" stroke="white" strokeWidth="2" />
                    <path d="M6 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4H18"
                      stroke="white" strokeWidth="2" strokeLinecap="round" />
                    <path d="M8 12H16M8 16H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                label: 'Vaccinations',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M18 3L21 6M14 7L17 10M3 21L9 15L14 20L8 26L3 21Z"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.5 6.5L9 12L12 15L17.5 9.5"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="11" cy="13" r="1" fill="white" />
                  </svg>
                ),
              },
              {
                label: 'Smart Reminders',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
              {
                label: 'Analytics & Reports',
                icon: (
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path d="M3 3V21H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 16L12 11L15 14L21 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M16 8H21V13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
              },
            ].map((feature) => (
              <div
                key={feature.label}
                className="group flex flex-col items-center p-5 rounded-2xl border border-white/20 cursor-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                style={{
                  background: 'rgba(255,255,255,0.11)',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.11)'}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 border-2 border-white/25"
                  style={{ background: 'rgba(255,255,255,0.18)' }}
                >
                  {feature.icon}
                </div>
                <span className="text-xs font-semibold text-center leading-snug">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        className={`relative z-10 flex flex-col items-center pb-12 px-8 transition-all duration-700 delay-400 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <button
          onClick={() => navigate('/login')}
          className="group relative w-full max-w-md h-16 rounded-full overflow-hidden shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-900/40 active:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #ffffff, #f0f4f8)' }}
        >
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(33,150,243,0.12), transparent)' }}
          />
          <span className="relative flex items-center justify-center gap-3 text-blue-700 font-bold text-lg tracking-wide">
            Get Started
            <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {/* Footer info */}
        <div className="flex items-center gap-2 mt-5 opacity-90">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M3 11V18C3 18.5304 3.21071 19.0391 3.58579 19.4142C3.96086 19.7893 4.46957 20 5 20H19C19.5304 20 20.0391 19.7893 20.4142 19.4142C20.7893 19.0391 21 18.5304 21 18V11"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11"
              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-semibold">Department of Health</span>
        </div>
        <p className="text-xs opacity-60 mt-2 font-medium">iRabiesCare — Rabies Prevention Program v1.0</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, 20px) scale(0.95); }
          75% { transform: translate(20px, 30px) scale(1.02); }
        }
      `}</style>
    </div>
  );
}