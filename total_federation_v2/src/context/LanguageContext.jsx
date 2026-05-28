import React from '../utils/react-shim.js';

const LanguageContext = React.createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = React.useState(() => {
    return localStorage.getItem('artron_lang') || 'GEO';
  });
  
  const [translations, setTranslations] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch('/src/locales/geo.json').then(res => {
        if (!res.ok) throw new Error("GEO locale failed to load");
        return res.json();
      }),
      fetch('/src/locales/eng.json').then(res => {
        if (!res.ok) throw new Error("ENG locale failed to load");
        return res.json();
      })
    ])
    .then(([geo, eng]) => {
      setTranslations({ GEO: geo, ENG: eng });
      setLoading(false);
    })
    .catch(err => {
      console.error("Localization loading failed:", err);
      // Fallback empty dictionaries
      setTranslations({ GEO: {}, ENG: {} });
      setLoading(false);
    });
  }, []);

  const changeLanguage = (newLang) => {
    if (newLang !== 'GEO' && newLang !== 'ENG') return;
    localStorage.setItem('artron_lang', newLang);
    setLangState(newLang);
  };

  const t = (key) => {
    if (!translations[lang]) return key;
    return translations[lang][key] || key;
  };

  if (loading) {
    return (
      <div style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#121418",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-emerald-core)",
        fontFamily: "sans-serif"
      }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: "32px" }}></i>
          <span>Loading system localization...</span>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return {
    t: context.t,
    i18n: {
      changeLanguage: context.changeLanguage,
      language: context.lang
    }
  };
};
export default LanguageContext;
