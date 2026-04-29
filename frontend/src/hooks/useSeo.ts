import { useEffect } from 'react';

interface SeoOptions {
  title: string;
  description?: string;
}

const SITE_SUFFIX = 'Yooreed Events';

export const useSeo = ({ title, description }: SeoOptions) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | ${SITE_SUFFIX}`;
    }

    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;

      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }

      meta.content = description;
    }
  }, [title, description]);
};


