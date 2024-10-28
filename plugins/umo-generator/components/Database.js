import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Tooltip } from 'primereact/tooltip';

export function getDatabaseValue(database_name, path)
{
    const data = require("@site/static/data/database/"+database_name+"/"+database_name+".data.json");
    const splitPath = path.toString().split('/');
    var value = data;
    for(var p of splitPath)
    {
        if(p == ".")
            continue;
        if(Array.isArray(value))
        {
            if(typeof(value[0]) == "object" && "key" in value[0] && "value" in value[0])
            {
                // dict
                value = value.find(c => c.key == p).value;
                continue;
            }
            const idx = parseInt(p);
            value = value[p];
            continue;
        }
        else if(typeof(value) == "object")
        {
            if(p in value)
            {
                value = value[p];
                continue;
            }
        }
        return undefined;
    }
    return value;
}

export function getFBValue(database_name, path)
{
    const data = require("@site/static/data/database/"+database_name+"/"+database_name+".fb.json");
    const splitPath = path.toString().split('/');
    var value = data;
    for(var p of splitPath)
    {
        if(p == ".")
            continue;
        if(Array.isArray(value))
        {
            const idx = parseInt(p);
            value = value[p];
            continue;
        }
        else if(typeof(value) == "object")
        {
            if(p in value)
            {
                value = value[p];
                continue;
            }
        }
        return undefined;
    }
    return value;
}

export const DatabaseValue = ({database_name, path}) =>
{
    const data = require("@site/static/data/database/"+database_name+"/"+database_name+".data.json");
    const splitPath = path.toString().split('/');
    var value = data;
    var tooltip_class = []
    for(var p of splitPath)
    {
        if(p == ".")
            continue;
        tooltip_class.push(p);
        if(Array.isArray(value))
        {
            if(typeof(value[0]) == "object" && "key" in value[0] && "value" in value[0])
            {
                // dict
                value = value.find(c => c.key == p).value;
                continue;
            }
            const idx = parseInt(p);
            value = value[p];
            continue;
        }
        else if(typeof(value) == "object")
        {
            if(p in value)
            {
                value = value[p];
                continue;
            }
        }
        return <>Value {p} not found for {path}</>;
    }
    tooltip_class = tooltip_class.join("_");
    return (<><Tooltip target={"."+tooltip_class} >database://{database_name}/{path}</Tooltip><code className={tooltip_class}
        data-pr-position="top"
        data-pr-at="center top-6"
        data-pr-my="center bottom"
        style={{ cursor: 'pointer' }}>{typeof(value) == "object" ? JSON.stringify(value) : value}</code></>);
}
