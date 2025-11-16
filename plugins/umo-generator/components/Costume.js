import { createContext, useContext, useEffect } from 'react';
import { LanguageLink } from "@umo-generator/components/LanguageLink";
import { getTranslatedString, TranslatedString } from "@umo-generator/components/TranslatedString";
import useBaseUrl from '@docusaurus/useBaseUrl';
import { Tooltip } from 'primereact/tooltip';
import Link from '@docusaurus/Link';
import { getLinkById } from "@umo-generator/js/link"
import { getPageData, useReportError } from './PageContext';

export const CostumeIdContext_ = createContext({});


export function getCostumeInfo(cosInfo)
{
    if(!cosInfo)
        return null;
    const data = getPageData();
    const cosData = Object.entries(data?.database?.costume?.CDENCMNHNGA)?.find(([idx, c]) => {
        if(cosInfo.id) 
            return c.JPIDIENBGKH == cosInfo.id;
        return c.AHHJLDLAPAN == cosInfo.divaId && c.DAJGPBLEEOB == cosInfo.cosId;
    })[1];
    if(!cosData)
    {
        const reportError = useReportError();
        useEffect(() => {
            if(!data?.database?.costume?.CDENCMNHNGA)
                reportError('Missing data.database.costume.CDENCMNHNGA');
            else if(cosInfo.id)
                reportError('Missing data.database.costume.CDENCMNHNGA.'+cosInfo.id);
            else
                reportError('Missing costume in database for diva '+cosInfo.divaId+' and prism '+cosInfo.cosId);
        }, [cosData, reportError]);
        return undefined;
    }
    return {
        id:cosData.JPIDIENBGKH, 
        divaId: cosData.AHHJLDLAPAN, 
        cosId:cosData.DAJGPBLEEOB, 
        hasColor:cosData._has_color,
        data:cosData
    }
}

export const CostumeIdContext = ({children, costumeId}) => {
    const cosInfo = getCostumeInfo(costumeId)
    return (<>
        <CostumeIdContext_.Provider value={cosInfo}>
        {children}
        </CostumeIdContext_.Provider>
    </>);
};

export const CostumeLanguageLink = (props) =>
{
    const costumeInfo = getCostumeInfo(props.costumeId) ?? useContext(CostumeIdContext_);
    const str = props.id.replace("##ID##", costumeInfo?.id.toString().padStart(2, '0'))
                    .replace("##ID4##", costumeInfo?.id.toString().padStart(4, '0'));
    return (<LanguageLink {...props} id={str} />);
};

export const CostumeString = (props) =>
{
    const costumeInfo = getCostumeInfo(props.costumeId) ?? useContext(CostumeIdContext_);
    const str = props.id.replace("##ID##", costumeInfo?.id.toString().padStart(2, '0'))
                    .replace("##ID4##", costumeInfo?.id.toString().padStart(4, '0'));
    return (<><TranslatedString {...props} id={str} /></>);
}

export const CostumeLink = ({costumeId}) =>
    {
        const cosIdStr = costumeId.toString().padStart(4, '0');
        const cosStr = "cos_" + cosIdStr;
        return (<>
            <Tooltip target={".cos_link_"+costumeId} ><CostumeImage costumeId={{id:costumeId}} /></Tooltip>
            <Link href={getLinkById("documentation_game_costume_"+costumeId)} className={"cos_link_"+costumeId}
            data-pr-position="top"
            data-pr-at="center top-6"
            data-pr-my="center bottom" ><TranslatedString bank="master" id={cosStr} language="en" fallback="1" /></Link>
        </>);
    };
    
export const CostumeImage = (props) =>
{
    const type = props.type ?? "costume";
    const costumeInfo = getCostumeInfo(props.costumeId, props.colorId) ?? useContext(CostumeIdContext_);
    if(!costumeInfo)
    {
        const reportError = useReportError();
        useEffect(() => {
            reportError('Missing costume info for '+props.costumeId+' '+props.colorId+' or costume context '+CostumeName);
        }, [costumeInfo, reportError]);
        return "";
    }
    const divaId = costumeInfo?.divaId ?? 1;
    const cosId = costumeInfo?.cosId ?? 1;
    const colId = props.colorId ?? 0;
    if(colId != 0 && !costumeInfo?.hasColor)
        return <></>;
    const imgList = {
        s_size:             colId == 0 ? "##ID##_##COS##_diva-s-size.png" : "##ID##_##COS##_##COLOR##_diva-s-size-in-color.png",
        m_size:             colId == 0 ? "##ID##_##COS##_diva-m-size.png" : "##ID##_##COS##_##COLOR##_diva-m-size-in-color.png",
        l_size:             colId == 0 ? "##ID##_##COS##_diva-l-size.png" : "##ID##_##COS##_##COLOR##_diva-l-size-in-color.png",
        l_size_crop:        colId == 0 ? "##ID##_##COS##_diva-l-size_crop.png" : "##ID##_##COS##_##COLOR##_diva-l-size-in-color_crop.png",
        ps:                 colId == 0 ? "##ID##_##COS##_diva-ps.png" : "##ID##_##COS##_##COLOR##_diva-ps-size-in-color.png",
        costume:            colId == 0 ? "##ID##_##COS3##_costume.png" : "##ID##_##COS3##_##COLOR##_costume.png",
    };
    const imgName = imgList[type]
        .replace("##ID##", divaId.toString().padStart(2, '0'))
        .replace("##COS##", cosId.toString().padStart(2, '0'))
        .replace("##COS3##", cosId.toString().padStart(3, '0'))
        .replace("##COLOR##", colId.toString().padStart(2, '0'));
    const cosImgSrc = useBaseUrl("/data/images/costumes/" + imgName);
    return (<img src={cosImgSrc} />)
}

export const CostumeName = (props) =>
{
    var costumeInfo = getCostumeInfo(props.costumeId) ?? useContext(CostumeIdContext_);
    if(!costumeInfo)
    {
        const reportError = useReportError();
        useEffect(() => {
            reportError('Missing costume info for '+props.costumeId+' or costume context '+CostumeName);
        }, [costumeInfo, reportError]);
        return "";
    }
    const id = costumeInfo.id?.toString().padStart(4, '0');
    const idStr = props.colorId ? "cos_"+id+"_01" : "cos_"+id;
    const costumeName = getTranslatedString("master", idStr, "en");
    if(costumeName == "")
        return getTranslatedString("master", idStr, "jp");
    return costumeName;
}
