import { Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-paper-aged border-b-2 border-ink">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-ink font-headline text-2xl hover:text-accent transition-colors">
              AI Absurditeiten
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-1 flex-wrap">
            <Link
              to="/tongbrekers"
              className={`
                px-6 py-2 font-serif font-bold uppercase tracking-wider text-sm
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
                px-6 py-2 font-serif font-bold uppercase tracking-wider text-sm
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
                px-6 py-2 font-serif font-bold uppercase tracking-wider text-sm
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
                px-6 py-2 font-serif font-bold uppercase tracking-wider text-sm
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
          </div>
        </div>
      </div>
    </nav>
  );
};
