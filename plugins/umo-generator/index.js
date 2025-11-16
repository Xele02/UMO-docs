import path from 'path';
import fs from 'fs-extra';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default async function umoGeneratorPlugin(context, options) {
    const docsDir = path.join(context.siteDir, 'docs');
    const staticDir = path.join(context.siteDir, 'static');
    const pluginDir = path.join(context.siteDir, 'plugins/umo-generator');
    const tmplDir = path.join(pluginDir, '/generated-page-templates');
    
    return {
      name: 'umo-generator',
      /*async contentLoaded({content, actions}) {
        const {addRoute} = actions;

        addRoute({
            path: '/documentation/game-info/divas/test/',
            component: '@site/docs/03-documentation/01-game-info/01-divas/_test.js',
            
            exact: true,
          });
      },*/
      getPathsToWatch() {
        //return [pluginDir];
      },
      
      configureWebpack() {
        return {
            resolve: {
                alias:{
                  '@umo-generator': path.resolve(pluginDir)
                },
            },
        };
      },

      // async updateFile(outputfile, content, onlyNew)
      // {
      //   const fileExists = await fs.exists(outputfile);
      //   var fileExistContent = "";
      //   if(fileExists)
      //   {
      //     if(onlyNew)
      //       return;
      //     fileExistContent = await fs.readFile(outputfile, 'utf-8');
      //   }
      //   if(fileExistContent != content)
      //     fs.outputFile(outputfile, content);
      // },

      // async generateFiles(page)
      // {
      //   const fileContent = await fs.readFile(page.template, 'utf-8');
      //   for(const outPage of page.toGenerate)
      //   {
      //     var newFileContent = fileContent;
      //     for(const rep of outPage.replace)
      //     {
      //       newFileContent = newFileContent.replaceAll(rep[0], rep[1]);
      //     };
      //     await this.updateFile(outPage.destName, newFileContent, outPage.onlyNew);
      //   };
      // },

      // async loadContent() {
      //   const { master_en } = await import(path.join(staticDir,"data/texts/master_en.data.js"));
      //   const { master_jp } = await import(path.join(staticDir,"data/texts/master_jp.data.js"));
      //   const { music_text_jp } = await import(path.join(staticDir,"data/texts/music_text_jp.data.js"));

      //   // Divas
      //   const divaIds = []
      //   for(var i = 1; i <= 10; i++)
      //   {
      //     divaIds.push(i);
      //   }
      //   await this.generateFiles({
      //     template: path.join(tmplDir, 'game-info-diva.mdx'),
      //     toGenerate: divaIds.map(k => {
      //       const id = k.toString().padStart(2, '0');
      //       const divaName = master_en["diva_" + id];
      //       return {
      //         destName: path.join(docsDir, '03-documentation/01-game-info/01-divas/'+id+'-diva-'+id+'/index.mdx'),
      //         replace: [
      //           ["_#_SLUG_#_", "/documentation/game-info/divas/"+divaName.replaceAll(" ", "-").toLowerCase()],
      //           ["_#_DIVA_ID_#_", k],
      //           ["_#_DIVA_NAME_#_", divaName]
      //         ]
      //       }
      //     })
      //   });

      //   // Database
      //   const db_names = await import(path.join(staticDir,"data/database/db_struct.json"));
      //   await this.generateFiles({
      //     template: path.join(tmplDir, 'database-template.mdx'),
      //     toGenerate: db_names.map(k => {
      //       return {
      //         destName: path.join(docsDir, '03-documentation/02-database/01-data-content/'+k+'.mdx'),
      //         replace: [
      //           ["_#_DB_NAME_#_", k],
      //           ["_#_DB_NAME_UPPERCASE_#_", capitalizeFirstLetter(k)]
      //         ]
      //       }
      //     })
      //   });

      //   // Costumes
      //   const costumesDb = await import(path.join(staticDir,"data/database/costume/costume.data.json"));
      //   const costumesIds = costumesDb.CDENCMNHNGA_Costumes.filter(c => c.PPEGAKEIEGM_Enabled == 2).map(c => {
      //     return {id:c.JPIDIENBGKH_CostumeId, d_id:c.AHHJLDLAPAN_PrismDivaId, l_id:c.DAJGPBLEEOB_PrismCostumeModelId};
      //   });
      //   await this.generateFiles({
      //     template: path.join(tmplDir, 'game-info-costume.mdx'),
      //     toGenerate: costumesIds.map(k => {
      //       const id = k.id.toString().padStart(4, '0');
      //       const l_id = k.l_id.toString().padStart(4, '0');
      //       const d_id = k.d_id.toString().padStart(2, '0');
      //       const costumeName = (master_en["cos_" + id] && master_en["cos_" + id] != "") ? master_en["cos_" + id] : master_jp["cos_" + id];
      //       const hasColor = costumesDb.CDENCMNHNGA_Costumes[k.id - 1].BJGNGNPHCBA_LevelsInfo.find(c => c.INDDJNMPONH_UnlockType == "4") != null;
      //       const coloCostumeName = hasColor ? " / " + ((master_en["cos_" + id + "_01"] && master_en["cos_" + id + "_01"] != "") ? master_en["cos_" + id + "_01"] : master_jp["cos_" + id + "_01"]) : "";
      //       const divaName = master_en["diva_" + d_id];
      //       return {
      //         destName: path.join(docsDir, '03-documentation/01-game-info/01-divas/'+d_id+'-diva-'+d_id+'/costume/'+l_id+'-costume-'+id+'.mdx'),
      //         replace: [
      //           ["_#_SLUG_#_", "/documentation/game-info/divas/"+(divaName.replaceAll(" ", "-").toLowerCase())+"/costume/"+id],
      //           ["_#_COSTUME_ID_#_", k.id],
      //           ["_#_COSTUME_NAME_#_", costumeName + coloCostumeName]
      //         ]
      //       }
      //     })
      //   });

      //   // Valkyrie
      //   const valkDb = await import(path.join(staticDir,"data/database/valkyrie/valkyrie.data.json"));
      //   const valkIds = valkDb.CDENCMNHNGA_ValkyrieList.filter(c => c.PPEGAKEIEGM_Enabled == "2").map(c => {
      //     return {id:c.GPPEFLKGGGJ_Id};
      //   });
      //   await this.generateFiles({
      //     template: path.join(tmplDir, 'game-info-valkyrie.mdx'),
      //     toGenerate: valkIds.map(k => {
      //       const id = k.id.toString().padStart(4, '0');
      //       const valkName = (master_en["vn_" + id] && master_en["vn_" + id] != "") ? master_en["vn_" + id] : master_jp["vn_" + id];
      //       return {
      //         destName: path.join(docsDir, '03-documentation/01-game-info/02-valkyries/'+id+'-valkyrie-'+id+'.mdx'),
      //         replace: [
      //           ["_#_SLUG_#_", "/documentation/game-info/valkyries/"+k.id+"-"+(valkName.replaceAll(" ", "-").toLowerCase())],
      //           ["_#_VALK_ID_#_", k.id],
      //           ["_#_VALK_NAME_#_", valkName]
      //         ]
      //       }
      //     })
      //   });
      //   // Music
      //   const musicDb = await import(path.join(staticDir,"data/database/music/music.data.json"));
      //   const musicIds = musicDb.EPMMNEFADAP_Musics.filter(c => c.JNCPEGJGHOG_Cov != "0").map(c => {
      //     return {id:c.DLAEJOBELBH_Id, txt:c.KNMGEEFGDNI_Nam};
      //   });
      //   await this.generateFiles({
      //     template: path.join(tmplDir, 'game-info-music.mdx'),
      //     toGenerate: musicIds.map(k => {
      //       const id = k.id.toString().padStart(3, '0');
      //       const id4 = k.txt.toString().padStart(4, '0');
      //       const musicName = music_text_jp["musicName_"+id4+"_musicname"];
      //       return {
      //         destName: path.join(docsDir, '03-documentation/01-game-info/05-musics/02-list/'+id+'-music-'+id+'.mdx'),
      //         replace: [
      //           ["_#_SLUG_#_", "/documentation/game-info/musics/"+k.id/*+"-"+encodeURIComponent(musicName)*//*+(musicName.replaceAll(" ", "-").toLowerCase())*/],
      //           ["_#_MUSIC_ID_#_", k.id],
      //           ["_#_MUSIC_NAME_#_", musicName]
      //         ]
      //       }
      //     })
      //   });
      //   // AR event
      //   const arEventDb = await import(path.join(staticDir, "data/database/ar_event/ar_event.data.json"));
      //   const arEventIds = arEventDb.m_eventList.filter(c => c.enable == "2").map(c => {
      //     return {id:c.no, evId: c.eventId, name:c.eventName};
      //   });
      //   await this.generateFiles({
      //     template: path.join(tmplDir, 'game-info-ar-event.mdx'),
      //     toGenerate: arEventIds.map(k => {
      //       const id = k.id.toString().padStart(2, '0');
      //       return {
      //         destName: path.join(docsDir, '03-documentation/01-game-info/20-ar-mode/05-events/'+id+"-"+k.evId+'.mdx'),
      //         replace: [
      //           ["_#_SLUG_#_", "/documentation/game-info/ar-mode/events/"+k.evId],
      //           ["_#_EVENT_ID_#_", k.id],
      //           ["_#_EVENT_EVID_#_", k.evId],
      //           ["_#_EVENT_NAME_#_", k.name],
      //           ["_#_EVENT_IDX_#_", k.id-1]
      //         ]
      //       }
      //     })
      //   });
      // },
    };
  }