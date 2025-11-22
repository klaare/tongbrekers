import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface PageMetaConfig {
  title: string;
  favicon: string;
  description: string;
}

const pageMetaMap: Record<string, PageMetaConfig> = {
  '/': {
    title: 'AI Absurditeiten - Nederlandse AI Generators',
    favicon: '/favicon.svg',
    description: 'Collectie van absurde AI-generators voor de Nederlandse taal'
  },
  '/tongbrekers': {
    title: 'Tongbrekers Generator - AI Absurditeiten',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🔥</text></svg>',
    description: 'Genereer uitdagende Nederlandse tongbrekers met AI'
  },
  '/condoleances': {
    title: 'Curieuze Condoleances - AI Absurditeiten',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🕊️</text></svg>',
    description: 'Genereer absurde, satirische condoleanceberichten met AI'
  },
  '/spreuken': {
    title: 'Spreuken Generator - AI Absurditeiten',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏺</text></svg>',
    description: 'Genereer Nederlandse wijsheden en spreuken met AI'
  },
  '/kansloze-cv': {
    title: 'Kansloze CV Generator - AI Absurditeiten',
    favicon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📄</text></svg>',
    description: 'Genereer absurd slechte curriculum vitaes met AI'
  }
};

export const usePageMeta = () => {
  const location = useLocation();

  useEffect(() => {
    const pageMeta = pageMetaMap[location.pathname] || pageMetaMap['/'];

    // Update title
    document.title = pageMeta.title;

    // Update favicon
    const faviconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (faviconLink) {
      faviconLink.href = pageMeta.favicon;
    }

    // Update meta description
    const metaDescription = document.querySelector<HTMLMetaElement>("meta[name='description']");
    if (metaDescription) {
      metaDescription.content = pageMeta.description;
    }
  }, [location.pathname]);
};
