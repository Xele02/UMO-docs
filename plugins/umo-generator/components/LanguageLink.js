import { useContext } from 'react';
import { LanguageContext_ } from "@umo-generator/components/LanguageContext";
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


export const LanguageLink = ({bank, id, language}) =>
{
    const languageStr = useContext(LanguageContext_);
    const language_ = language ?? languageStr.currentLanguage;
    const href = bank == "string_literals" ? "https://umo-translate.xele.org/translate/umo/code/stringliterals/"+language_+"/?q="+id : "https://umo-translate.xele.org/translate/umo/database/"+bank+"/"+language_+"/?q="+id;
    return (
        <a href={href} target="_blank" rel="noopener noreferrer">
            <code>{bank}</code> <code>{id}</code>
        </a>
    )
};
    
export const LanguageTabs = ({children}) =>
{
    const languageStr = useContext(LanguageContext_);
    return (
        <Tabs groupId="language">
        <TabItem value="ja" label="Japanese" default>
            <LanguageContext_.Provider value={{...languageStr, currentLanguage:"ja"}}>
            {children}
            </LanguageContext_.Provider>
        </TabItem>
        <TabItem value="en" label="English">
            <LanguageContext_.Provider value={{...languageStr, currentLanguage:"en"}}>
            {children}
            </LanguageContext_.Provider>
        </TabItem>
        <TabItem value="fr" label="French">
            <LanguageContext_.Provider value={{...languageStr, currentLanguage:"fr"}}>
            {children}
            </LanguageContext_.Provider>
        </TabItem>
        <TabItem value="zh_Hans" label="Chinese">
            <LanguageContext_.Provider value={{...languageStr, currentLanguage:"zh_Hans"}}>
            {children}
            </LanguageContext_.Provider>
        </TabItem>
        </Tabs>
    );
}