
export function LoadLanguage(def)
{
    var res = {}
    for(const bank of def)
    {
        res[bank.name] = {}
        for(const lang of bank.lang)
        {
            const langExt = (lang == "ja" ? "" : "_"+lang);
            const data = require("@site/static/data/texts/"+bank.name+langExt+".data.js");
            res[bank.name][lang] = data[bank.name + langExt];
        }
    }
    
    return res;
};