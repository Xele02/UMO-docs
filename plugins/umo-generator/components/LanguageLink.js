
export const LanguageLink = ({bank, id, language}) =>
    {
      const href = "https://umo-translate.xele.org/translate/umo/database/"+bank+"/"+language+"/?q="+id;
      return (
          <a href={href} target="_blank" rel="noopener noreferrer">
              <code>{bank}</code> <code>{id}</code>
          </a>
      )
    };
    