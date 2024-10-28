import { createContext } from 'react';
import { LoadLanguage } from "@umo-generator/js/languages";

export const LanguageContext_ = createContext({files:[], currentLanguage:""});

export const LanguageContext = ({children, files}) =>
{
  const languageStr = LoadLanguage(files);
  return (<>
    <LanguageContext_.Provider value={{files:languageStr, currentLanguage:""}}>
    {children}
    </LanguageContext_.Provider>
  </>);
}
