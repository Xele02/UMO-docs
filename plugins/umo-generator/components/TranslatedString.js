import { useContext } from 'react';
import { LanguageContext_ } from "@umo-generator/components/LanguageContext";

export function getTranslatedString(bank, id, language)
{
  const languageStr = useContext(LanguageContext_);
  return languageStr[bank][language][id];
}

export const TranslatedString = ({bank, id, language}) =>
{
  const str = getTranslatedString(bank, id, language);
  return (
      <>{str}</>
  );
};
    