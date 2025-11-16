import { createContext } from 'react';
import { LoadLanguage } from "@umo-generator/js/languages";
import React, { useEffect } from 'react';
import { getPageData, useReportError } from './PageContext';

export const LanguageContext_ = createContext({files:[], currentLanguage:""});

/*
Files format : 
[
  { name:"common", lang:["ja", "fr", "en", "zh_Hans"] },
  { name:"menu", lang:["ja", "fr", "en", "zh_Hans"] },
  { name:"master", lang:["ja", "fr", "en", "zh_Hans"] },
]
*/
export const LanguageContext = ({children, files}) =>
{
  const data = getPageData();
  const reportError = useReportError();
  const languageStr = data?.language;//LoadLanguage(files);
  return (<>
    <LanguageContext_.Provider value={{files:languageStr, currentLanguage:""}}>
    {children}
    </LanguageContext_.Provider>
  </>);
}
