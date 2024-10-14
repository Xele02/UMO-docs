import { createContext, useContext } from 'react';
import { LanguageLink } from "@umo-generator/components/LanguageLink";
import { TranslatedString } from "@umo-generator/components/TranslatedString";
import useBaseUrl from '@docusaurus/useBaseUrl';


export const DivaIdContext_ = createContext(0);

export const DivaIdContext = ({children, divaId}) => {
    return (<>
        <DivaIdContext_.Provider value={divaId}>
        {children}
        </DivaIdContext_.Provider>
    </>);
};
  
export const DivaLanguageLink = (props) =>
{
    const divaId = useContext(DivaIdContext_);
    const id = divaId.toString().padStart(2, '0');
    const str = props.id.replace("##ID##", id);
    return (<LanguageLink {...props} id={str} />);
};

export const DivaString = (props) =>
{
    const divaId = useContext(DivaIdContext_);
    const id = divaId.toString().padStart(2, '0');
    const str = props.id.replace("##ID##", id);
    return (<><TranslatedString {...props} id={str} /></>);
}
    
export const DivaLink = ({id, handleClick_}) =>
{
    function handleClick(e) {
        e.preventDefault();
        handleClick_(id);
    }
    const divaStr = "diva_" + id.toString().padStart(2, '0');
    return (<a href="#" onClick={handleClick} ><TranslatedString bank="master" id={divaStr} language="en" /></a>);
};

export const DivaImage = (props) =>
{
    const divaId = props.divaId ?? useContext(DivaIdContext_);
    const type = props.type ?? "s_size";
    const cosId = (type == "standing_costume") ? [3, 2, 2, 2, 2, 2, 3, 2, 2, 2][divaId - 1] : (props.cosId ?? 1);
    const colId = props.color ?? 0;
    const imgList = {
        s_size:             colId == 0 ? "##ID##_##COS##_diva-s-size.png" : "##ID##_##COS##_##COLOR##_diva-s-size-in-color.png",
        m_size:             colId == 0 ? "##ID##_##COS##_diva-m-size.png" : "##ID##_##COS##_##COLOR##_diva-m-size-in-color.png",
        l_size:             colId == 0 ? "##ID##_##COS##_diva-l-size.png" : "##ID##_##COS##_##COLOR##_diva-l-size-in-color.png",
        l_size_crop:        colId == 0 ? "##ID##_##COS##_diva-l-size_crop.png" : "##ID##_##COS##_##COLOR##_diva-l-size-in-color_crop.png",
        ps:                 colId == 0 ? "##ID##_##COS##_diva-ps.png" : "##ID##_##COS##_##COLOR##_diva-ps-size-in-color.png",
        story:              "##ID##_##COS##_diva-story.png",
        small_bustup:       "##ID##_##COS##_diva-small-bustup.png",
        standing_costume:   "##ID##_##COS##_diva-standing-costume.png",
        event_go_diva:      "##ID##_01_diva-event-go-diva.png",
        event_go_diva_typed:"##ID##_##COS##_diva-event-go-diva-typed.png"
    };
    const imgName = imgList[type].replace("##ID##", divaId.toString().padStart(2, '0')).replace("##COS##", cosId.toString().padStart(2, '0')).replace("##COLOR##", colId.toString().padStart(2, '0'));
    const divaImgSrc = useBaseUrl("/data/images/divas/" + imgName);
    return (<img src={divaImgSrc} />)
}
