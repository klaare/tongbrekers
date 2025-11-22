import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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

          {/* Navigation Links */}
          <div className="flex gap-1 flex-wrap justify-end">
            <Link
              to="/tongbrekers"
              className={`
                px-4 py-2 font-serif font-bold uppercase tracking-wider text-xs
                border-2 transition-all
                ${
                  isActive('/tongbrekers')
                      ? 'bg-ink text-paper border-ink'
                      : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                }
              `}
            >
              🔥 Tongbrekers
            </Link>
            <Link
              to="/condoleances"
              className={`
                px-4 py-2 font-serif font-bold uppercase tracking-wider text-xs
                border-2 transition-all
                ${
                  isActive('/condoleances')
                    ? 'bg-ink text-paper border-ink'
                    : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                }
              `}
            >
              🕊️ Condoleances
            </Link>
            <Link
              to="/spreuken"
              className={`
                px-4 py-2 font-serif font-bold uppercase tracking-wider text-xs
                border-2 transition-all
                ${
                  isActive('/spreuken')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                }
              `}
            >
              🏺 Spreuken
            </Link>
            <Link
              to="/kansloze-cv"
              className={`
                px-4 py-2 font-serif font-bold uppercase tracking-wider text-xs
                border-2 transition-all
                ${
                  isActive('/kansloze-cv')
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                }
              `}
            >
              📄 Kansloze CV
            </Link>
            <Link
              to="/fobieen"
              className={`
                px-4 py-2 font-serif font-bold uppercase tracking-wider text-xs
                border-2 transition-all
                ${
                  isActive('/fobieen')
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                }
              `}
            >
              😰 Fobieën
            </Link>
            <Link
              to="/excuses"
              className={`
                px-4 py-2 font-serif font-bold uppercase tracking-wider text-xs
                border-2 transition-all
                ${
                  isActive('/excuses')
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                }
              `}
            >
              🙏 Excuses
            </Link>
            <Link
              to="/draaiboeken"
              className={`
                px-4 py-2 font-serif font-bold uppercase tracking-wider text-xs
                border-2 transition-all
                ${
                  isActive('/draaiboeken')
                    ? 'bg-slate-700 text-white border-slate-700'
                    : 'bg-transparent text-ink border-ink hover:bg-ink hover:text-paper'
                }
              `}
            >
              💣 Draaiboeken
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
