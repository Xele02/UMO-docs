import { useContext } from 'react';
import { LanguageContext_ } from "@umo-generator/components/LanguageContext";

export const TranslatedString = ({bank, id, language}) =>
    {
      const languageStr = useContext(LanguageContext_);
      const str = languageStr[bank][language][id];
      return (
          <>{str}</>
      );
    };
    