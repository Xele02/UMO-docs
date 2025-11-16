import { useContext } from 'react';
import { LanguageContext_ } from "@umo-generator/components/LanguageContext";
import { LanguageLink } from "@umo-generator/components/LanguageLink";
import React, { useEffect } from 'react';
import { getPageData, useReportError } from './PageContext';

export function getTranslatedString(bank, id, language)
{
  const reportError = useReportError();

  const languageStr = useContext(LanguageContext_);
  useEffect(() => {
      if(languageStr?.files?.[bank]?.[language ?? languageStr.currentLanguage]?.[id] == undefined)
        reportError('Missing language datas '+bank+'.'+id+' for language '+(language ?? languageStr.currentLanguage));
    }, [languageStr, reportError]);

  //if(!languageStr.files[bank])
  //  return "Bank \""+bank+"\" not found";
  //if(!languageStr.files[bank][language ?? languageStr.currentLanguage])
  //  return "Language \""+(language ?? languageStr.currentLanguage)+"\" not found";
  return languageStr?.files?.[bank]?.[language ?? languageStr.currentLanguage]?.[id];
}

export const TranslatedString = ({bank, id, language, fallback}) =>
{
  var str = getTranslatedString(bank, id, language);
  if(!str && fallback)
    str = getTranslatedString(bank, id, "jp");
  return (
      <>{str}</>
  );
};

export const TranslatedStringLink = ({bank, id, language}) =>
{
  const str = getTranslatedString(bank, id, language);
  const href = "https://umo-translate.xele.org/translate/umo/database/"+bank+"/"+language+"/?q="+id;
  return (
      <a href={href} target="_blank" rel="noopener noreferrer">
          <code>{str}</code>
      </a>
  )
};

export const TranslatedTextTableRow = ({data, language, templateLink, templateString}) =>
  {
    if(!data)
    {
      const reportError = useReportError();

      useEffect(() => {
          reportError('Missing data for TranslatedTextTableRow');
      }, [data, reportError]);
      return <></>
    }
    const params = data.params?.map((p, idx) => <li>&#123;{idx}&#125; {p}</li> );
    const paramsStr = params?.length > 0 && <><br />Parameters : <ul>{params}</ul></>;
    return (
      <tr>
      <td>{data.name}</td>
      <td>{(templateLink && templateLink(data, language)) ?? <LanguageLink bank={data.bank} id={data.id} language={language} />}</td>
      <td>{(templateString && templateString(data, language)) ?? <TranslatedString bank={data.bank} id={data.id} language={language} />}{paramsStr}</td>
      </tr>
    );
  };
  
export const TranslatedTextTable = ({language, datas, templateLink, templateString}) =>
{
  const languageStr = useContext(LanguageContext_);
  const language_ = language ?? languageStr.currentLanguage;
  const items = datas.map(k => (<TranslatedTextTableRow data={k} language={language_} templateLink={templateLink} templateString={templateString} />));
  return (
    <table>
    <thead>
    <tr>
    <th>Name</th>
    <th>String Id</th>
    <th>Text</th>
    </tr>
    </thead>
    <tbody>
    {items}
    </tbody>
    </table>
  );
}
