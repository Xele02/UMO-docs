import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Tooltip } from 'primereact/tooltip';
import React, { useEffect } from 'react';
import { getPageData, useReportError } from './PageContext';

export function getDatabaseValue(database_name, path)
{
    const data = require("@site/static/data/database/"+database_name+"/"+database_name+".data.json");
    return getDatabaseValueFromData(data, path)
}
export function getDatabaseValueFromData(data, path, return_error_func)
{
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
            else
            {
                const matchingKey = Object.keys(value).find(key =>
                    key.startsWith(p)
                );
                if(matchingKey)
                {
                    value = value[matchingKey]
                    continue;
                }
            }
        }
        if(return_error_func)
            return_error_func([p, path]);
        return undefined;
    }
    return value;
}

export function getFBValue(database_name, path)
{
    const data = require("@site/static/data/database/"+database_name+"/"+database_name+".fb.json");
    return getFBValueFromData(data, path)
}

export function getFBValueFromData(data, path, return_error_func)
{
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
        if(return_error_func)
            return_error_func([p, path]);
        return undefined;
    }
    return value;
}

export const DatabaseValue = ({database_name, path, display_type}) =>
{
    const data_ = getPageData();
    const reportError = useReportError();

    useEffect(() => {
        if(!data_)
            reportError('Missing data');
        else if(!data_.database)
            reportError('Missing data.database'+JSON.stringify(data_)); //  
        else if(!data_.database[database_name])
            reportError('Missing data.database['+database_name+']');
    }, [data_, reportError]);

    const data = data_?.database?.[database_name];

    //const data = require("@site/static/data/database/"+database_name+"/"+database_name+".data.json");
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
                let dictData = value.find(c => c.key == p);
                if(dictData === undefined)
                {
                    dictData = value.find(c => c.key == p.substring(0, 11))
                    if(dictData === undefined)
                    {
                        useEffect(() => {
                            reportError('Missing database value '+p+' in data.database.'+database_name+'.'+path);
                        }, [dictData, reportError]);
                        return <>Value {p} not found for {path}</>;
                    }
                }
                value = dictData.value;
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
        useEffect(() => {
            reportError('Missing database value '+p+' in data.database.'+database_name+'.'+path);
        }, [data, reportError]);

        return <>Value {p} not found for {path}</>;
    }
    tooltip_class = tooltip_class.join("_");
    if(typeof(value) == "object")
    {
        value = JSON.stringify(value)
    }
    else if(display_type == "date")
    {
        value = new Date(parseInt(value) * 1000).toLocaleDateString(undefined, {dateStyle:'short'});
    }
    return (<><Tooltip target={"."+tooltip_class} >database://{database_name}/{path}</Tooltip><code className={tooltip_class}
        data-pr-position="top"
        data-pr-at="center top-6"
        data-pr-my="center bottom"
        style={{ cursor: 'pointer' }}>{value}</code></>);
}
