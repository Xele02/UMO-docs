import { createContext } from 'react';
import { LoadLanguage } from "@umo-generator/js/languages";

export const LanguageContext_ = createContext(null);

export const LanguageContext = ({children, files}) =>
{
  const languageStr = LoadLanguage(files);
  return (<>
    <LanguageContext_.Provider value={languageStr}>
    {children}
    </LanguageContext_.Provider>
  </>);
}
