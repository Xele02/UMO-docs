
import fb_version from "@site/static/data/database/version/version.fb.json"

export const GameVersion = ({version}) =>
{
  var versionData = fb_version.MFLNKKKEGJH.find(c => c.OFMGALJGDAO == version);
  if(versionData == undefined)
  {
    for(var v of fb_version.MFLNKKKEGJH)
    {
        if(parseInt(v.OFMGALJGDAO) < parseInt(version))
        {
            versionData = v;
            break;
        }
    }
  }
  return <>[{version}] {new Date(versionData.IBDFJIDNDJH * 1000).toLocaleDateString(undefined, {dateStyle:'short'})} : {versionData.IIDCFMHCPLJ}</>;
}
