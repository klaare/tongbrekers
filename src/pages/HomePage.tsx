import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-paper-dark via-paper to-paper-aged">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="font-headline text-6xl md:text-8xl text-ink mb-4">
            AI Absurditeiten
          </h1>
          <p className="text-xl text-ink-light italic">
            Waar kunstmatige intelligentie natuurlijke gekheid genereert
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Tongbrekers Card */}
          <Link
            to="/tongbrekers"
            className="group bg-gradient-to-br from-red-900 to-red-950 p-8 rounded-lg border-4 border-red-800 hover:border-red-600 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Tering Tongbrekers
            </h2>
            <p className="text-red-100 mb-4">
              Extreem moeilijke, absurd humoristische Nederlandse tongbrekers die je spraak tot struikelpartij maken.
            </p>
            <div className="text-red-300 text-sm italic">
              "De trillende trompetterende trol trapte twaalf tintelende turnsters..."
            </div>
            <div className="mt-6 text-white font-bold group-hover:translate-x-2 transition-transform">
              Genereer tongbreker →
            </div>
          </Link>

          {/* Condoleances Card */}
          <Link
            to="/condoleances"
            className="group bg-paper-aged p-8 rounded-lg border-4 border-ink hover:border-accent transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">🕊️</div>
            <h2 className="text-3xl font-bold text-ink mb-3">
              Curieuze Condoleances
            </h2>
            <p className="text-ink-light mb-4">
              Satirische rouwadvertenties die opzettelijk de plank misslaan met ongemakkelijke, absurde condoleances.
            </p>
            <div className="text-ink-faded text-sm italic">
              "Met verslagenheid vernamen wij het heengaan van uw geliefde cactus..."
            </div>
            <div className="mt-6 text-ink font-bold group-hover:translate-x-2 transition-transform">
              Genereer condoleance →
            </div>
          </Link>

          {/* Spreuken Card */}
          <Link
            to="/spreuken"
            className="group bg-gradient-to-br from-blue-800 to-blue-900 p-8 rounded-lg border-4 border-blue-700 hover:border-blue-500 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">🏺</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Onwijsheden Tegels
            </h2>
            <p className="text-blue-100 mb-4">
              Digitale delftsblauwe tegeltjes met onlogische spreuken die doen alsof ze eeuwenoude wijsheid bevatten.
            </p>
            <div className="text-blue-200 text-sm italic">
              "Een eekhoorn in de hand is beter dan tien op het dak..."
            </div>
            <div className="mt-6 text-white font-bold group-hover:translate-x-2 transition-transform">
              Bekijk tegels →
            </div>
          </Link>

          {/* Kansloze CV Card */}
          <Link
            to="/kansloze-cv"
            className="group bg-gradient-to-br from-purple-800 to-purple-900 p-8 rounded-lg border-4 border-purple-700 hover:border-purple-500 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">📄</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Kansloze CV's
            </h2>
            <p className="text-purple-100 mb-4">
              Absurd slechte curriculum vitae's vol met incompetentie, irrelevante vaardigheden en chaotische werkervaring.
            </p>
            <div className="text-purple-200 text-sm italic">
              "Professioneel Bankzitter met 5 jaar ervaring in niets doen..."
            </div>
            <div className="mt-6 text-white font-bold group-hover:translate-x-2 transition-transform">
              Genereer kansloos CV →
            </div>
          </Link>

          {/* Frappante Fobieën Card */}
          <Link
            to="/fobieen"
            className="group bg-gradient-to-br from-teal-800 to-cyan-900 p-8 rounded-lg border-4 border-teal-700 hover:border-teal-500 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">😰</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Frappante Fobieën
            </h2>
            <p className="text-teal-100 mb-4">
              Absurde, hilarische angsten (echt of fictief) met extreme humoristische twists die je doen lachen én nadenken.
            </p>
            <div className="text-teal-200 text-sm italic">
              "De irrationele angst dat er een eend is die je overal volgt..."
            </div>
            <div className="mt-6 text-white font-bold group-hover:translate-x-2 transition-transform">
              Genereer fobie →
            </div>
          </Link>

          {/* Excuus Ex Machina Card */}
          <Link
            to="/excuses"
            className="group bg-gradient-to-br from-amber-800 to-yellow-900 p-8 rounded-lg border-4 border-amber-700 hover:border-amber-500 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Excuus Ex Machina
            </h2>
            <p className="text-amber-100 mb-4">
              Genereer creatieve, gedetailleerde excuses voor elke situatie met een keten van onwaarschijnlijke gebeurtenissen.
            </p>
            <div className="text-amber-200 text-sm italic">
              "Het spijt me enorm, maar een loslopende therapiegeit at mijn sleutels..."
            </div>
            <div className="mt-6 text-white font-bold group-hover:translate-x-2 transition-transform">
              Genereer excuus →
            </div>
          </Link>

          {/* Destructieve Draaiboeken Card */}
          <Link
            to="/draaiboeken"
            className="group bg-gradient-to-br from-slate-800 to-gray-900 p-8 rounded-lg border-4 border-slate-700 hover:border-red-500 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">💣</div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Destructieve Draaiboeken
            </h2>
            <p className="text-slate-200 mb-4">
              Professioneel ogende stappenplannen die er logisch uitzien maar onvermijdelijk leiden tot catastrofe.
            </p>
            <div className="text-slate-300 text-sm italic">
              "Stap 1: Lokaliseer de koffiemachine... Stap 8: Informeer dat de brand 'normaal' is..."
            </div>
            <div className="mt-6 text-white font-bold group-hover:translate-x-2 transition-transform">
              Genereer draaiboek →
            </div>
          </Link>

          {/* Hopeloze Haiku's Card */}
          <Link
            to="/haikus"
            className="group bg-gradient-to-br from-gray-200 to-gray-300 p-8 rounded-lg border-4 border-gray-400 hover:border-gray-500 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-6xl mb-4">🍂</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Hopeloze Haiku's
            </h2>
            <p className="text-gray-700 mb-4">
              Melancholisch-absurde haiku's vol hopeloosheid, futiel verlangen en alledaagse teleurstelling.
            </p>
            <div className="text-gray-600 text-sm italic font-serif">
              "Koude koffie weer / mijn motivatie verdampt / nog voor de ochtend"
            </div>
            <div className="mt-6 text-gray-800 font-bold group-hover:translate-x-2 transition-transform">
              Genereer haiku →
            </div>
          </Link>
        </div>

        <footer className="text-center mt-20 text-ink-faded text-sm">
          <p>Aangedreven door Google Gemini AI • Voor humoristische doeleinden</p>
        </footer>
      </div>
    </div>
  );
};
