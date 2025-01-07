import { Dropdown } from 'primereact/dropdown';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import React, { Fragment, useState } from "react";
import { getDatabaseValue, getFBValue } from "@umo-generator/components/Database"
import { Tooltip } from 'primereact/tooltip';
import styles from '@umo-generator/css/styles.module.css';
import { TranslatedString } from "@umo-generator/components/TranslatedString";
import { LanguageLink, LanguageTabs } from "@umo-generator/components/LanguageLink"
import useBaseUrl from '@docusaurus/useBaseUrl';
import advList from "@site/static/data/adv/advList.json"
import { GameVersion } from "@umo-generator/components/Game";

export const labels = {
    "0" : {name:"Nop", desc:"Do nothing"},
    "1" : {name:"CharaLoad", desc:<>Load the character data from <code>{"ad/ch/{charaId:D4}_{poseId:D3}.xab"}</code>, asset <code>CharaData</code> of type <code>AdvCharacterData</code></>, params:[
            {name:"charaId", desc:"The character id" },
            {name:"poseId", desc:"The pose id" }]}, 
    "2" : {name:"BgLoad", desc:<>Load the background from <code>{"ad/bg/{bgId:D4}.xab"}</code>, asset <code>{"{bgId:D4}"}</code></>, params:[{name:"bgId", desc:"The bg id"}]}, 
    "3" : {name:"BgmLoad", desc:"Not used"}, 
    "4" : {name:"SeLoad", desc:"Not used"}, 
    "5" : {name:"VoiceLoad", desc:<>Load the cue sheet named <code>{"cs_adv_{cueSheetAdvId:D6}"}</code> in the voice adventure player</>, params:[{name:"cueSheetAdvId", desc:"The cue sheet id"}]}, 
    "6" : {name:"SendLog", desc:"Send a log for the tutorial step", params:[{name:"logIdx", desc:"The tutorial step. Will be matched in the tutorial step log [19, 28, 29, 30, 35]"}]}, 
    "7" : {name:"VoiceDownLoad", desc:<>Download the cue sheet <code>{"cs_adv_{cueSheetAdvId:D6}"}</code></>, params:[{name:"cueSheetAdvIds", desc:"Cue sheet ids separated by ','"}]}, 
    "8" : {name:"AssetDownLoad", desc:"Download the assets", params:[{name:"assetsList", desc:"List of asset, separated by a ','"}]}, 
    "9" : {name:"CharaAuraLoad", desc:<>Like CharaLoad, with aura asset loaded from <code>{"ad/chb/{charaId:D4}_{poseId:D3}.xab"}</code>, asset <code>blur</code></>, params:[
        {name:"charaId", desc:"The character id" },
        {name:"poseId", desc:"The pose id" }
    ]}, 
    "10" : {name:"Chara", desc:"Display the character at the given position with the wanted pose and face. If charaId is the speaker, apply the current speaker effect", params:[
        {name:"charaId", desc:"The character id" },
        {name:"position", desc:"The position. Center(0)/Left(1)/Right(2)" },
        {name:"poseId", desc:"The pose id" },
        {name:"faceId", desc:"The faceId id" }]},
    "11" : {name:"CharaOff", desc:"Hide the character.", params:[{name:"charaId", desc:"The character id"}]}, 
    "12" : {name:"CharaDelete", desc:"Unload the character.", params:[{name:"charaId", desc:"The character id"}]}, 
    "13" : {name:"CharaAura", desc:"Display the character like Chara, with the aura.", params:[
        {name:"charaId", desc:"The character id" },
        {name:"position", desc:"The position. Center(0)/Left(1)/Right(2)" },
        {name:"poseId", desc:"The pose id" },
        {name:"faceId", desc:"The faceId id" },
        {name:"colorId", desc:"Aura color id, from sns color setup" }]},
    "20" : {name:"Bg", desc:"Set the background", params:[{name:"bgId", desc:"The background id"}]}, 
    "21" : {name:"BgOff", desc:"Hide the current background"}, 
    "23" : {name:"Window", desc:"Display the subtitle text window"}, 
    "24" : {name:"WindowOff", desc:"Hide th subtitle text window"}, 
    "25" : {name:"FadeIn", desc:"Fade in", params:[{name:"timeMs", desc:"Time in millisec."}]}, 
    "26" : {name:"FadeOut", desc:"Fade out", params:[{name:"timeMs", desc:"Time in millisec."}]}, 
    "27" : {name:"ChangeCurrentWindow", desc:"Change the subtitle window type", params:[{name:"windowIdx", desc:"Index of the window in the available type"}]}, 
    "30" : {name:"Face", desc:"Change the face of a character", params:[{name:"charaId", desc:"The character id"}, {name:"faceId", desc:"The face id"}]}, 
    "40" : {name:"Bgm", desc:"Change the music", params:[{name:"musicIdx", desc:"Music index. Will use MENU_BGM_ID_BASE(1000) + index"}]}, 
    "41" : {name:"StopBgm", desc:"Stop the music"}, 
    "42" : {name:"Se", desc:"Play the specified sound on the adventure special effect player.", params:[{name:"cueIdx", desc:"Cue index in the currently loaded cue sheet."}]}, 
    "43" : {name:"StopSe", desc:"Stop the sound played by the adventure special effect player"}, 
    "44" : {name:"Voice", desc:<>Play the character voice on the voice adventure player. Will use the cue <code>{"char_{charaId:D3}_{voiceId:D3}"}</code></>, params:[{name:"charaId", desc:"the character id"}, {name:"voiceId", desc:"The voice id"}]}, 
    "45" : {name:"FadeOutBgm", desc:"Fade out the music", params:[{name:"timeMs", desc:"Fade out time in milliseconds"}]}, 
    "46" : {name:"WaitFadeBgm", desc:"Wait for the music fade to end"}, 
    "47" : {name:"SyncVoice", desc:"Play a voice and play the mouth animation during the sound duration.", params:[{name:"charaId", desc:"The character id"}, {name:"voiceId", desc:"Cue id to play in the voice sound player"}]}, 
    "50" : {name:"FlashEf", desc:"Play a flash effect on the caracter and play the sound cue 1 on the adventure sound effect player", param:[{name:"charaId", desc:"The character id"}]}, 
    "51" : {name:"ImEf", desc:"Play a image(?) effect on the caracter and play the sound cue 2 on the adventure sound effect player", param:[{name:"charaId", desc:"The character id"}]}, 
    "52" : {name:"QaEf", desc:"Play a question(?) effect on the caracter and play the sound cue 4 on the adventure sound effect player", param:[{name:"charaId", desc:"The character id"}]},
    "53" : {name:"HappyEf", desc:"Play a happy effect on the caracter and play the sound cue 0 on the adventure sound effect player", param:[{name:"charaId", desc:"The character id"}]},  
    "54" : {name:"LoveEf", desc:"Play a love effect on the caracter and play the sound cue 3 on the adventure sound effect player", param:[{name:"charaId", desc:"The character id"}]}, 
    "60" : {name:"Info", desc:"Display a SNS notification", params:[{name:"snsId", desc:"The sns id to display"}]}, 
    "61" : {name:"Name", desc:"Display the popup to enter the player name and wait the end."}, 
    "62" : {name:"Valkyrie", desc:"Display the unlock valkyrie sequence.", params:[{name:"valkyrieId", desc:"The valkyrie id"}]}, 
    "63" : {name:"SnsShow", desc:"Open the SNS menu and display a sns message.", params:[{name:"snsId", desc:"The sns id to show"}]}, 
    "70" : {name:"EndScenario"}, 
    "71" : {name:"EndTutorial", desc:"End the tutorial sequence."}, 
    "72" : {name:"LiveSrart", desc:"Setup the adventure result & setup to launch the next live.", params:[{name:"freeMusicId", desc:"The free music id to launch"}, {name:"advId", desc:"The next adventure to start"}]}, 
    "73" : {name:"DivaSelect", desc:"Go to the diva select screen"}, 
    "74" : {name:"NextAdv", desc:"Go to the next adventure", params:[{name:"advId", desc:"The adventure id"}]}, 
    "75" : {name:"TutoReturnPoint", desc:"Save the tutorial checkpoint", params:[{name:"recoveryId", desc:"The id of the recovery point"}]}, 
    "76" : {name:"Wait", desc:"Wait for some time", params:[{name:"timeMs", desc:"Time in milliseconds"}]}, 
    "77" : {name:"Skip", desc:"Enable/Disable the skip button", params:[{name:"isOn", desc:"1 to enable, 0 to disable"}]}, 
    "78" : {name:"SnsNotificationTutorial", desc:"Enable the tutorial SNS"}, 
    "90" : {name:"LoadAnime", desc:<>Load an animation from <code>{"ad/am/{animId:D6}.xab"}</code>, asset <code>{"{animId:D6}"}</code> of type <code>LayoutUGUIRuntime</code></>, params:[{name:"animId", desc:"The animation id"}]}, 
    "91" : {name:"PlayAnime", desc:"Play an animation", params:[
        {name:"animId", desc:"The animation id"}, 
        {name:"playMode", desc:"0 for single, 1 for loop"}, 
        {name:"startLabel", desc:"Start label of the animation"}, 
        {name:"endLabel", desc:"(Optional) End label of the animation"}]}, 
    "92" : {name:"WaitAnime", desc:"Wait for the animation to end", params:[{name:"animId", desc:"The animation id"}]}, 
    "93" : {name:"DeleteAnime", desc:"Unload an animation", params:[{name:"animId", desc:"The animation id"}]}, 
    "94" : {name:"DispAnime", desc:"Display an animation", params:[{name:"animId", desc:"The animation id"}, {name:"isVisible", desc:"1 : visible, 0 : not visible"}]}, 
    "95" : {name:"SetPlateMaterial", desc:"Change the material of a plate in an animation", params:[
        {name:"animId", desc:"The animation id"},
        {name:"layerName", desc:"The RawImage to find"},
        {name:"sceneCardId", desc:"The plate id"},
        {name:"sceneRarity", desc:"The plate rarity"}]}, 
    "100" : {name:"LoadPrologue", desc:<>Load the prologue animation from <code>ly/083.xab</code>. Load the music from <code>snd/bgm/cs_bgm_tutorial.acb</code></>}, 
    "101" : {name:"StartPrologue", desc:"Start the prologue animation"}, 
    "102" : {name:"WaitPrologue", desc:"Wait for the prologue animation to end"}, 
    "103" : {name:"ReleasePrologue", desc:"Unload the prologue animation."}, 
    "104" : {name:"LoadTutorialResource", desc:<>Load the tutorial resources : <code>to.xab</code>, <code>ly/080.xab</code></>}, 
    "105" : {name:"ReleaseTutorialResource", desc:"Unload the tutorial resources"}, 
};

export function foreachAdventure(callback)
{
    //const advDb = getDatabaseValue("adventure", "CDENCMNHNGA_List");
    for(var adv of advList)
    {
        const advData = require("@site/static/data/adv/"+adv.padStart(6, '0')+".fb.json");
        callback(advData, adv);
    }
} 

export const CommandParam = ({lbl, idx, self}) =>
{
    if(lbl.params?.[idx]?.name == "bgId")
    {
        const url = useBaseUrl("/data/images/adv/bg/"+self[idx].toString().padStart(4, '0')+".jpg");
        return (
            <>{lbl.params?.[idx].name} : <Tooltip target={".adv_bg_"+self[idx]} ><img style={{width:"150px"}} src={url} /></Tooltip><code  className={"adv_bg_"+self[idx]} 
            data-pr-position="top"
            data-pr-at="center top-6"
            data-pr-my="center bottom">{self[idx]}</code></>
        );
    }
    if(lbl.params?.[idx]?.name == "charaId" && lbl.params?.find(p => p?.name == "poseId"))
    {
        const poseId = self[lbl.params.findIndex(p => p.name == "poseId")];
        const url = useBaseUrl("/data/images/adv/chara/"+self[idx].toString().padStart(4, '0')+"_"+poseId.toString().padStart(3, '0')+".png");
        return (
            <>{lbl.params?.[idx].name} : <Tooltip target={".adv_chara_"+self[idx]+"_"+poseId} ><img style={{width:"150px"}} src={url} /></Tooltip><code  className={"adv_chara_"+self[idx]+"_"+poseId} 
            data-pr-position="top"
            data-pr-at="center top-6"
            data-pr-my="center bottom">{self[idx]}</code></>
        );
    }
    return <>{lbl.params?.[idx]?.name} : {self[idx]}</>
}

export const AdventureData = ({data}) =>
{
    if(data == null)
        return <></>;

    const advData = require("@site/static/data/adv/"+data.name.padStart(6, '0')+".fb.json");
    const content = advData.PIIOHCJFHBD.map(c => {
        const commands = c.IIBAJDOLFBM.map((c2, c2idx) => {
            const lbl = labels[c2.BNFLNMGOJCM]; //{c2.BNFLNMGOJCM} 
            return (<React.Fragment key={"Command_"+c2idx.toString()}><code className={"adv_command_"+c2.BNFLNMGOJCM} id={data.name+" "+c.BBPHAPFBFHK+"_"+c2idx}
                data-pr-position="top"
                data-pr-at="center top-6"
                data-pr-my="center bottom">{lbl.name}</code>({c2.BPODDGNIDBG.map((p, idx, self) => <React.Fragment key={idx.toString()}>{!!idx && ", "}<CommandParam idx={idx} lbl={lbl} self={self} /></React.Fragment>)})<br /></React.Fragment>)
        });
        return (<React.Fragment key={data.name+"Step_"+c.BBPHAPFBFHK}>
        <h3>Step {c.BBPHAPFBFHK}</h3>
        {c.GELNDPJNLJM != 0 && <><strong>Speaker</strong> : ({c.GELNDPJNLJM}) <TranslatedString bank="snsDb_text" id={"chara_name_"+((parseInt(c.GELNDPJNLJM) - 1).toString().padStart(4, '0'))+"_txt"} language="fr" fallback="1" />< br /></>}
        {c.IAHNDJDBCAJ != "" && <>Message : <LanguageTabs><LanguageLink bank="adv_text" id={"adv_"+data.name.padStart(6, '0')+"_"+(c.BBPHAPFBFHK - 1).toString().padStart(4, '0')+"_msg"} /><TranslatedString bank="adv_text" id={"adv_"+data.name.padStart(6, '0')+"_"+(c.BBPHAPFBFHK - 1).toString().padStart(4, '0')+"_msg"} /></LanguageTabs>< br /></>}
        {commands}
        </React.Fragment>)})
    const advDbVersion = getFBValue("adventure","EJNIGLEDAFJ").find(k => k.JCIIGMCDKAH == data.name)?.OFMGALJGDAO;
    return (<>
        <h2>{data.name}</h2>
        {advDbVersion && <>* Added in version : <GameVersion version={advDbVersion} /></>}
        {content}</>);
    /*
    PIIOHCJFHBD / HEHPAMADHGC []
        BBPHAPFBFHK / PPFNGGCBJKC int
        IIBAJDOLFBM / PBOHDAFOEIA [] commands
            BNFLNMGOJCM / KAPMOPMDHJE int command label
            BPODDGNIDBG / PIBLLGLCJEO string[] command param
        GELNDPJNLJM / PMJAGEJIOJE int speaker id
        IAHNDJDBCAJ / IPBHCLIHAPG str message
    */
}

export const AventureList = () => {
    const [selectedAdv, setSelectedAdv] = useState(null);
    //const advDb = getDatabaseValue("adventure", "CDENCMNHNGA_List");
    //const advList = advDb.map(k => { return {name:k.KKPPFAHFOJI_FileId};}).sort((a, b) => parseInt(a.name) - parseInt(b.name));
    const advList_ = advList.map(k => { return {name:k};}).sort((a, b) => parseInt(a.name) - parseInt(b.name));

    return (
        <>
        <CommandTooltips />
        <div className="card flex justify-content-center">
            <Dropdown value={selectedAdv} onChange={(e) => setSelectedAdv(e.value)} options={advList_} optionLabel="name" filter
                placeholder="Select an Adventure" className="w-full md:w-14rem" />
        </div>
        <AdventureData data={selectedAdv} />
        </>
    )
}

export const CommandEntry = ({id}) =>
{
    const c = labels[id];
    return (
        <>
        <h2><code>{id} : {c.name}</code></h2>
        {c.desc}
        {c.params?.map((p, idx) => {
            return (<Fragment key={idx}>
            <blockquote><code>{p.name}</code> : {p.desc}</blockquote>
            </Fragment>);
        })}
        </>
    )
}

export const CommandsList = () =>
{
    return Object.entries(labels).map((k) => <CommandEntry key={k[0]} id={k[0]} />);
}

export const CommandTooltips = () =>
{
    return Object.entries(labels).map((k) => <CommandTooltip key={k[0]} commandId={k[0]} />);
}

export const CommandTooltip = ({commandId}) =>
{
    return (<><Tooltip target={".adv_command_"+commandId} >
        <div className={styles.tooltipOverride}><CommandEntry id={commandId} /></div>
        </Tooltip></>);
}

export const AdventureLink = ({advId}) =>
{
    return advId;
}
