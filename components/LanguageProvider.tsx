"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProducts } from '@/lib/data/services';
import { TransportService } from '@/types';

type LanguageContextType = {
  language: "id" | "en";
  setLanguage: (lang: "id" | "en") => void;
  products: TransportService[];
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'id',
  setLanguage: () => {},
  products: getProducts('id'),
});

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<"id" | "en">('id');
  const [products, setProducts] = useState<TransportService[]>(getProducts('id'));

  useEffect(() => {
    // Detect user browser language
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'id' || browserLang === 'en') {
      setLanguage(browserLang);
      setProducts(getProducts(browserLang));
    } else {
      setLanguage('en'); // Default to English for other languages
      setProducts(getProducts('en'));
    }
  }, []);

  const handleSetLanguage = (lang: "id" | "en") => {
    setLanguage(lang);
    setProducts(getProducts(lang));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, products }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

