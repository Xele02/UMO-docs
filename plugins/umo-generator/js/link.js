import useGlobalData from '@docusaurus/useGlobalData';
import useBaseUrl from '@docusaurus/useBaseUrl';

export function getLinkById(id)
{
    const pageInfo = useGlobalData()["docusaurus-plugin-content-docs"].default.versions[0].docs.find(doc => doc.id.endsWith(id));
    if(pageInfo == null)
        return "Page "+id+" not exists";
    const url = useBaseUrl(pageInfo.path);
    return url;
}