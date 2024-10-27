import GameCostumeContent from '@umo-generator/templates/game-info-costume.mdx'
import DatabaseDisplayContent from '@umo-generator/templates/database-template.mdx'
import MDXContent from '@theme/MDXContent';


export const GameInfoCostume = (props) =>
{
    return <MDXContent></MDXContent>
}

export const DatabaseDisplay = (props) =>
{
    return <MDXContent><DatabaseDisplayContent db_struct={props.db_struct} db_data={props.db_data} fb_data={props.fb_data} /></MDXContent>
}
