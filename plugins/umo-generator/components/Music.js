import { createContext, useContext } from 'react';
import { LanguageLink } from "@umo-generator/components/LanguageLink";
import { TranslatedString } from "@umo-generator/components/TranslatedString";
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import { getLinkById } from "@umo-generator/js/link"
import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Tooltip } from 'primereact/tooltip';
import musicDb from "@site/static/data/database/music/music.data.json";

export const MusicIdContext_ = createContext(0);

export const MusicIdContext = ({children, musicId}) => {
    return (<>
        <MusicIdContext_.Provider value={musicId}>
        {children}
        </MusicIdContext_.Provider>
    </>);
};
  
export const MusicLanguageLink = (props) =>
{
    const musicId = useContext(MusicIdContext_);
    const textId = musicDb.EPMMNEFADAP_Musics[musicId - 1].KNMGEEFGDNI_Nam;
    const id = textId.toString().padStart(4, '0');
    const str = props.id.replace("##ID##", id);
    return (<LanguageLink {...props} id={str} />);
};

export const MusicString = (props) =>
{
    const musicId = useContext(MusicIdContext_);
    const textId = musicDb.EPMMNEFADAP_Musics[musicId - 1].KNMGEEFGDNI_Nam;
    const id = textId.toString().padStart(4, '0');
    const str = props.id.replace("##ID##", id);
    return (<><TranslatedString {...props} id={str} /></>);
}
    
export const MusicLink = ({musicId}) =>
{
    const textId = musicDb.EPMMNEFADAP_Musics[musicId - 1].KNMGEEFGDNI_Nam;
    const musicIdStr = textId.toString().padStart(4, '0');
    const musicStr = "musicName_" + musicIdStr+"_musicname";
    return (<>
        <Tooltip target={".music_link_"+musicId} ><MusicImage musicId={musicId} /></Tooltip>
        <Link href={getLinkById("documentation_game_music_"+musicId)} className={"music_link_"+musicId}
        data-pr-position="top"
        data-pr-at="center top-6"
        data-pr-my="center bottom" ><TranslatedString bank="music_text" id={musicStr} language="en" fallback="1" /></Link>
    </>);
};

export const MusicImage = (props) =>
{
    const musicId = props.musicId ?? useContext(MusicIdContext_);
    const type = props.type ?? "select";
    const imgList = {
        select:              "##ID##_select.png",
        detail:              "##ID##_detail.png",
    };
    const imgName = imgList[type].replace("##ID##", musicId.toString().padStart(3, '0'));
    const musicImgSrc = useBaseUrl("/data/images/musics/" + imgName);
    return (<img src={musicImgSrc} style={props.style} />)
}
