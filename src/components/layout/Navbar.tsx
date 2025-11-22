import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: '/tongbrekers', emoji: '🔥', label: 'Tongbrekers', activeColor: 'bg-ink text-paper border-ink' },
    { to: '/condoleances', emoji: '🕊️', label: 'Condoleances', activeColor: 'bg-ink text-paper border-ink' },
    { to: '/spreuken', emoji: '🏺', label: 'Spreuken', activeColor: 'bg-blue-600 text-white border-blue-600' },
    { to: '/kansloze-cv', emoji: '📄', label: 'Kansloze CV', activeColor: 'bg-purple-600 text-white border-purple-600' },
    { to: '/fobieen', emoji: '😰', label: 'Fobieën', activeColor: 'bg-teal-600 text-white border-teal-600' },
    { to: '/excuses', emoji: '🙏', label: 'Excuses', activeColor: 'bg-amber-600 text-white border-amber-600' },
    { to: '/draaiboeken', emoji: '💣', label: 'Draaiboeken', activeColor: 'bg-slate-700 text-white border-slate-700' },
  ];

  return (
    <nav className="bg-paper-aged border-b-2 border-ink">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-3 min-h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-ink font-headline text-2xl hover:text-accent transition-colors">
              AI Absurditeiten
            </Link>
          </div>

          {/* Hamburger Menu Button (Mobile Only) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden px-3 py-2 border-2 border-ink text-ink hover:bg-ink hover:text-paper transition-all"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation Links (Hidden on Mobile) */}
          <div className="hidden md:flex gap-1 flex-wrap justify-end max-w-4xl">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  px-4 py-2 font-serif font-bold uppercase tracking-wider text-xs
                  border-2 transition-all
                  ${
                    isActive(link.to)
                      ? link.activeColor
                      : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                  }
                `}
              >
                {link.emoji} {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu (Shows when hamburger is clicked) */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t-2 border-ink py-3">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    px-4 py-3 font-serif font-bold uppercase tracking-wider text-sm
                    border-2 transition-all
                    ${
                      isActive(link.to)
                        ? link.activeColor
                        : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                    }
                  `}
                >
                  {link.emoji} {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
