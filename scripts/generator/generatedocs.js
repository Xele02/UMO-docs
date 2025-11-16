const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

const contentPath = path.join(__dirname, "content.json");
//const outputDir = path.join(__dirname, "../docs/auto");
//const templatePath = path.join(__dirname, "./template.hbs");

function generateDocs(build_data) {
  const templateSrc = fs.readFileSync(build_data["template"], "utf-8");
  const template = Handlebars.compile(templateSrc);
  const outputDir = build_data["out_dir"]

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Liste actuelle des fichiers générés
  //const existingFiles = new Set(fs.readdirSync(outputDir).map(f => f.replace(/\.mdx$/, "")));

  let regenerated = 0;

  for (const item of build_data["toGenerate"]) {
    const outputFile = path.join(outputDir, item.destName);

    //const json_data = fs.readFileSync(item.json_file, "utf-8");
    const json_data = JSON.parse(fs.readFileSync(item.json_file, "utf8"));

    Handlebars.registerHelper("json_pretty", function (context) {
      const json = JSON.stringify(context, null, 2);
      return new Handlebars.SafeString(json);
    });

    item["replace"]["json_data"] = json_data;

    const mdContent = template(item["replace"]);
    
    const outputDirFile = path.dirname(outputFile);
    if (!fs.existsSync(outputDirFile)) fs.mkdirSync(outputDirFile, { recursive: true });

    // Vérifie si le fichier existe et si le contenu a changé
    let shouldWrite = true;
    if (fs.existsSync(outputFile)) {
      const existingContent = fs.readFileSync(outputFile, "utf-8");
      if (existingContent === mdContent) shouldWrite = false;
    }

    if (shouldWrite) {
      fs.writeFileSync(outputFile, mdContent);
      regenerated++;
      console.log(`📝 ${item.destName} (regénéré)`);
    }

    // Marque comme traité
    //existingFiles.delete(item.id);
  }

  // Supprime les fichiers qui n'existent plus dans le JSON
  /*for (const removed of existingFiles) {
    fs.unlinkSync(path.join(outputDir, `${removed}.mdx`));
    console.log(`🗑️  ${removed}.mdx supprimé (non présent dans content.json)`);
  }*/

  console.log(`✅ Génération terminée — ${regenerated} fichier(s) mis à jour`);
}

const tmplDir = path.join(__dirname, 'templates');
const docsDir = path.join(__dirname, '../../docs');
const staticDir = path.join(__dirname, '../../static');

const data = JSON.parse(fs.readFileSync(contentPath, "utf-8"));

const divas = data["divas"];
const costumes = data["costumes"];
const data_to_build = [
    {
        build_type: "diva",
        template: path.join(tmplDir, 'game-info-common.mdx'),
        out_dir: path.join(docsDir, '03-documentation/01-game-info/01-divas'),
        toGenerate: divas.map(k => {
            const id = k.id.toString().padStart(2, '0');
            const divaName = k.name;
            return {
                destName: id+'-diva-'+id+'/index.mdx',
                json_file:path.join(staticDir, 'json/divas/'+k.id.toString()+'.json'),
                replace: {
                    slug:"/documentation/game-info/divas/"+divaName.replaceAll(" ", "-").toLowerCase(),
                    id: k.id,
                    name: divaName,
                    type:'diva',
                    json_data:'{}'
                }
            }
        })
    },
    {
        build_type: "costume",
        template: path.join(tmplDir, 'game-info-common.mdx'),
        out_dir: path.join(docsDir, '03-documentation/01-game-info/01-divas'),
        toGenerate: costumes.map(k => {
            const id = k.id.toString().padStart(4, '0');
            const l_id = k.l_id.toString().padStart(4, '0');
            const d_id = k.d_id.toString().padStart(2, '0');
            const costumeName = k.name;
            const coloCostumeName = k.coloCostumeName != "" ? " / " + k.coloCostumeName : "";
            const divaName = k.diva_name;
            return {
                destName: path.join(d_id+'-diva-'+d_id+'/costume/'+l_id+'-costume-'+id+'.mdx'),
                json_file:path.join(staticDir, 'json/costumes/'+k.id.toString()+'.json'),
                replace: {
                    slug:"/documentation/game-info/divas/"+(divaName.replaceAll(" ", "-").toLowerCase())+"/costume/"+id,
                    id: k.id,
                    name: costumeName + coloCostumeName,
                    type:'costume',
                    json_data:'{}'
                }
            }
        })
    }
]

data_to_build.forEach(data => {
    generateDocs(data);
});
