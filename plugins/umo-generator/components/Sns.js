
import sns_data from "@site/static/data/database/sns/sns.data.json"
import { getTranslatedString } from "@umo-generator/components/TranslatedString";

export const SnsRoomLink = ({roomId}) =>
{
    return sns_data.NPKPBDIDBBG_Rooms[roomId].OPFGFINHFCE_Name;
}
    
export const SnsTalkLink = ({talkId}) =>
{
    return sns_data.NPKPBDIDBBG_Rooms[sns_data.CDENCMNHNGA_Talks[talkId - 1].MALFHCHNEFN_RoomId].OPFGFINHFCE_Name + "/"+ getTranslatedString("master", "sns_nm_"+sns_data.CDENCMNHNGA_Talks[talkId - 1].AIPLIEMLHGC_SnsId.toString().padStart(4, '0'), "ja");
}
    