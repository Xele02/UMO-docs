import { createContext, useContext } from 'react';
import { LanguageLink } from "@umo-generator/components/LanguageLink";
import { getTranslatedString, TranslatedString } from "@umo-generator/components/TranslatedString";
import useBaseUrl from '@docusaurus/useBaseUrl';
import db_data from "@site/static/data/database/costume/costume.data.json";

export const CostumeIdContext_ = createContext({});


export const CostumeIdContext = ({children, costumeId}) => {
    return (<>
        <CostumeIdContext_.Provider value={costumeId}>
        {children}
        </CostumeIdContext_.Provider>
    </>);
};

export function getCostumeIdsFromGlobalId(cosId, colorId)
{
    const cosData = db_data.CDENCMNHNGA_Costumes.find(c => c.JPIDIENBGKH_CostumeId == cosId);
    return {divaId: cosData?.AHHJLDLAPAN_PrismDivaId, cosId:cosData?.DAJGPBLEEOB_PrismCostumeModelId, color:colorId ?? 0 }
}

export const CostumeLanguageLink = (props) =>
{
    var costumeId = props.costumeId ?? useContext(CostumeIdContext_);
    const str = props.id.replace("##ID##", costumeId.id.toString().padStart(2, '0'))
                    .replace("##ID4##", costumeId.id.toString().padStart(4, '0'));
    return (<LanguageLink {...props} id={str} />);
};

export const CostumeString = (props) =>
{
    var costumeId = props.costumeId ?? useContext(CostumeIdContext_);
    const str = props.id.replace("##ID##", costumeId.id.toString().padStart(2, '0'))
                    .replace("##ID4##", costumeId.id.toString().padStart(4, '0'));
    return (<><TranslatedString {...props} id={str} /></>);
}

export const CostumeImage = (props) =>
{
    const type = props.type ?? "costume";
    var costumeId = props.costumeId ?? useContext(CostumeIdContext_);
    if(costumeId.id)
        costumeId = getCostumeIdsFromGlobalId(costumeId.id, costumeId.color ?? props.colorId ?? 0);
    const divaId = costumeId.divaId ?? 1;
    const cosId = costumeId.cosId ?? 1;
    const colId = costumeId.color ?? props.colorId ?? 0;
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
    var costumeId = props.costumeId ?? useContext(CostumeIdContext_);
    const id = costumeId.id.toString().padStart(4, '0');
    const costumeName = getTranslatedString("master", "cos_"+id, "en");
    if(costumeName == "")
        return getTranslatedString("master", "cos_"+id, "ja");
    return costumeName;
}
