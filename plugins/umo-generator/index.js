import path from 'path';
import fs from 'fs-extra';

export default async function umoGeneratorPlugin(context, options) {
    const docsDir = path.join(context.siteDir, 'docs');
    const staticDir = path.join(context.siteDir, 'static');
    const pluginDir = path.join(context.siteDir, 'plugins/umo-generator');
    const tmplDir = path.join(pluginDir, '/templates');
    
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
      configureWebpack() {
        return {
            resolve: {
                alias:{
                  '@umo-generator': path.resolve(pluginDir)
                },
            },
        };
      },

      async updateFile(outputfile, content)
      {
        const fileExists = await fs.exists(outputfile);
        var fileExistContent = "";
        if(fileExists)
        {
          fileExistContent = await fs.readFile(outputfile, 'utf-8');
        }
        if(fileExistContent != content)
          fs.outputFile(outputfile, content);
      },

      async generateFiles(page)
      {
        const fileContent = await fs.readFile(page.template, 'utf-8');
        for(const outPage of page.toGenerate)
        {
          var newFileContent = fileContent;
          for(const rep of outPage.replace)
          {
            newFileContent = newFileContent.replaceAll(rep[0], rep[1]);
          };
          await this.updateFile(outPage.destName, newFileContent);
        };
      },

      async loadContent() {
        const { master_en } = await import(path.join(staticDir,"data/texts/master_en.data.js"));

        const divaIds = []
        for(var i = 1; i <= 10; i++)
        {
          divaIds.push(i);
        }
        await this.generateFiles({
          template: path.join(tmplDir, 'game-info-diva.mdx'),
          toGenerate: divaIds.map(k => {
            const id = k.toString().padStart(2, '0');
            const divaName = master_en["diva_" + id];
            return {
              destName: path.join(docsDir, '03-documentation/01-game-info/01-divas/'+id+'-diva-'+id+'/index.mdx'),
              replace: [
                ["_#_SLUG_#_", "/documentation/game-info/divas/"+divaName.replaceAll(" ", "-").toLowerCase()],
                ["_#_DIVA_ID_#_", k],
                ["_#_DIVA_NAME_#_", divaName]
              ]
            }
          })
        });
        await this.generateFiles({
          template: path.join(tmplDir, 'database_template.mdx'),
          toGenerate: divaIds.map(k => {
            const idx = (k - 1).toString().padStart(2, '0');
            return {
              destName: path.join(docsDir, '03-documentation/02-database/01-divas/'+idx+'-diva-'+idx+'.mdx'),
              replace: [
                ["_#_DIVA_IDX_#_", k - 1]
              ]
            }
          })
        });
      },
    };
  }