import { createContext, useContext } from 'react';
import { LanguageLink } from "@umo-generator/components/LanguageLink";
import { getTranslatedString, TranslatedString } from "@umo-generator/components/TranslatedString";
import useBaseUrl from '@docusaurus/useBaseUrl';
import db_data from "@site/static/data/database/costume/costume.data.json";

export const CostumeIdContext_ = createContext({});


export function getCostumeInfo(cosInfo)
{
    if(!cosInfo)
        return null;
    const cosData = db_data.CDENCMNHNGA_Costumes.find(c => {
        if(cosInfo.id) 
            return c.JPIDIENBGKH_CostumeId == cosInfo.id;
        return c.AHHJLDLAPAN_PrismDivaId == cosInfo.divaId && c.DAJGPBLEEOB_PrismCostumeModelId == cosInfo.cosId;
    });
    if(!cosData)
        return undefined;
    return {
        id:cosData.JPIDIENBGKH_CostumeId, 
        divaId: cosData?.AHHJLDLAPAN_PrismDivaId, 
        cosId:cosData?.DAJGPBLEEOB_PrismCostumeModelId, 
        hasColor:cosData?.BJGNGNPHCBA_LevelsInfo.find(c => c.INDDJNMPONH_UnlockType == "4") != null,
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
    const str = props.id.replace("##ID##", costumeInfo.id.toString().padStart(2, '0'))
                    .replace("##ID4##", costumeInfo.id.toString().padStart(4, '0'));
    return (<LanguageLink {...props} id={str} />);
};

export const CostumeString = (props) =>
{
    const costumeInfo = getCostumeInfo(props.costumeId) ?? useContext(CostumeIdContext_);
    const str = props.id.replace("##ID##", costumeInfo.id.toString().padStart(2, '0'))
                    .replace("##ID4##", costumeInfo.id.toString().padStart(4, '0'));
    return (<><TranslatedString {...props} id={str} /></>);
}

export const CostumeImage = (props) =>
{
    const type = props.type ?? "costume";
    const costumeInfo = getCostumeInfo(props.costumeId, props.colorId) ?? useContext(CostumeIdContext_);
    const divaId = costumeInfo.divaId ?? 1;
    const cosId = costumeInfo.cosId ?? 1;
    const colId = props.colorId ?? 0;
    if(colId != 0 && !costumeInfo.hasColor)
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
    const id = costumeInfo.id.toString().padStart(4, '0');
    const idStr = props.colorId ? "cos_"+id+"_01" : "cos_"+id;
    const costumeName = getTranslatedString("master", idStr, "en");
    if(costumeName == "")
        return getTranslatedString("master", idStr, "ja");
    return costumeName;
}
