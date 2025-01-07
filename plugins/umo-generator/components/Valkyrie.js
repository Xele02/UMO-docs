import { createContext, useContext } from 'react';
import { LanguageLink } from "@umo-generator/components/LanguageLink";
import { TranslatedString } from "@umo-generator/components/TranslatedString";
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import { getLinkById } from "@umo-generator/js/link"
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Tooltip } from 'primereact/tooltip';

export const ValkyrieIdContext_ = createContext(0);

export const ValkyrieIdContext = ({children, valkId}) => {
    return (<>
        <ValkyrieIdContext_.Provider value={valkId}>
        {children}
        </ValkyrieIdContext_.Provider>
    </>);
};
  
export const ValkyrieLanguageLink = (props) =>
{
    const valkId = useContext(ValkyrieIdContext_);
    const id = valkId.toString().padStart(4, '0');
    const str = props.id.replace("##ID##", id);
    return (<LanguageLink {...props} id={str} />);
};

export const ValkyrieString = (props) =>
{
    const valkId = useContext(ValkyrieIdContext_);
    const id = valkId.toString().padStart(4, '0');
    const str = props.id.replace("##ID##", id);
    return (<><TranslatedString {...props} id={str} /></>);
}
    
export const ValkyrieLink = ({valkId}) =>
{
    const valkIdStr = valkId.toString().padStart(4, '0');
    const valkStr = "vn_" + valkIdStr;
    return (<>
        <Tooltip target={".valk_link_"+valkId} ><ValkyrieImage valkId={valkId} /></Tooltip>
        <Link href={getLinkById("documentation_game_valkyrie_"+valkId)} className={"valk_link_"+valkId}
        data-pr-position="top"
        data-pr-at="center top-6"
        data-pr-my="center bottom" ><TranslatedString bank="master" id={valkStr} language="en" fallback="1" /></Link>
    </>);
};

export const ValkyrieImage = (props) =>
{
    const valkId = props.valkId ?? useContext(ValkyrieIdContext_);
    const type = props.type ?? "portrait";
    const formId = props.form ?? 1;
    const imgList = {
        icon:              "##ID##_##FORM##_icon.png",
        portrait:       "##ID##_##FORM##_portrait.png"
    };
    const imgName = imgList[type].replace("##ID##", valkId.toString().padStart(2, '0')).replace("##FORM##", formId.toString().padStart(2, '0'));
    const valkImgSrc = useBaseUrl("/data/images/valkyries/" + imgName);
    return (<img src={valkImgSrc} style={props.style} />)
}
