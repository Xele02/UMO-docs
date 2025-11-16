import json
import os
import re
import jmespath
from pathlib import Path
from jmespath_extended import jmes_search

ROOT = Path(__file__).resolve().parent.parent.parent
CONTENT = ROOT / "scripts" / "generator" / "content.json"
OUTPUT = ROOT / "static" / "json"
DATABASE = ROOT / "scripts" / "generator" / "data" / "database"
TEXTS = ROOT / "scripts" / "generator" / "data" / "texts"

def array_to_indexed_object(obj):
    """
    Transforme récursivement tous les tableaux en objets {idx: value, ...}.
    """
    if isinstance(obj, list):
        return {str(i): array_to_indexed_object(elem) for i, elem in enumerate(obj)}
    elif isinstance(obj, dict):
        return {k: array_to_indexed_object(v) for k, v in obj.items()}
    else:
        return obj

def merge_json_recursive(a, b):
    """
    Merge récursivement deux objets JSON.
    - a et b doivent être des dict.
    - Si une clé existe dans les deux dicts :
      - si les valeurs sont dicts → merge récursif
      - sinon → la valeur de b remplace celle de a
    """
    if not isinstance(a, dict) or not isinstance(b, dict):
        return b  # b écrase a si ce n'est pas des dicts

    merged = dict(a)  # copie de a
    for key, b_value in b.items():
        if key in merged:
            merged[key] = merge_json_recursive(merged[key], b_value)
        else:
            merged[key] = b_value
    return merged

def get_entry_or_create(data, name):
    if not name in data:
        data[name] = {}
    return data[name]

def add_json_data(dst_data, src_data, path):
    step = path.split("/")
    parent = None
    key = ''
    add_json_data_recurs(dst_data, src_data, step, parent, key, path)

def add_json_data_recurs(dst_data, src_data, step, parent, key, path):
    while step:
        p = step.pop(0)
        if src_data == None:
            print(f"No data for {p} in {path}")
            return
        elif type(src_data) == list:
            src_data = src_data[int(p)]
            parent = dst_data
            key = p
            dst_data = get_entry_or_create(dst_data, p)
            continue
        elif p in src_data:
            src_data = src_data[p]
            parent = dst_data
            key = p
            dst_data = get_entry_or_create(dst_data, p)
            continue
        else:
            req = p.split('|')
            try:
                rx = re.compile(req[0])
                result = [k for k in src_data if rx.fullmatch(k)]
                if len(result) > 0:
                    parent = dst_data
                    for r in result:
                        valid = True
                        if len(req) > 1:
                            valid = jmespath.search(req[1], src_data[r])
                        if not valid:
                            continue
                        key = r
                        dst_data = get_entry_or_create(parent, r)
                        add_json_data_recurs(dst_data, src_data[r], step.copy(), parent, key, path)
                    return
            except re.error:
                None
        print(f"{p} not in data for {path}")
        return
    parent[key] = src_data

def get_database_data(database_name):
    DB_PATH = DATABASE / database_name
    with open(DB_PATH / f"{database_name}.data.json" ) as f:
        database_data = json.load(f)
    return database_data

def add_database_data(data, database_name, path):
    if not isinstance(path, list):
        path = [path]
    database_data = array_to_indexed_object(get_database_data(database_name))
    out_data = get_entry_or_create(data["database"], database_name)
    for p in path:
        cur_data = database_data
        add_json_data(out_data, cur_data, p)

def add_fb_data(data, database_name, path):
    if not isinstance(path, list):
        path = [path]
    DB_PATH = DATABASE / database_name
    with open(DB_PATH / f"{database_name}.fb.json" ) as f:
        database_data = json.load(f)
    database_data = array_to_indexed_object(database_data)
    out_data = get_entry_or_create(data["fb"], database_name)
    for p in path:
        cur_data = database_data
        add_json_data(out_data, cur_data, p)

def add_language_data(data, database_name, path):
    if not isinstance(path, list):
        path = [path]
    DB_PATH = TEXTS
    langs = ["en","fr","jp","zh_Hans"]
    out_data = get_entry_or_create(data["language"], database_name)
    for lang in langs:
        if not os.path.exists(DB_PATH / f"{database_name}_{lang}.data.json"):
            print("File not found : "+str(DB_PATH / f"{database_name}_{lang}.data.json"))
            continue
        with open(DB_PATH / f"{database_name}_{lang}.data.json" ) as f:
            database_data = json.load(f)
        out_lang = get_entry_or_create(out_data, lang)
        for p in path:
            cur_data = database_data
            add_json_data(out_lang, cur_data, p)

def generate_data(OUTPUT_PATH, jsons):
    OUTPUT_PATH.mkdir(parents=True, exist_ok=True)

    regenerated = 0
    #existing_files = {p.stem for p in OUTPUT_PATH.glob("*.json")}

    for k in jsons:
        json_path = OUTPUT_PATH / (k["name"]+".json")

        content = json.dumps(k["content"], indent=4)
        # print(content)

        if json_path.exists() and json_path.read_text(encoding="utf-8") == content:
            continue
        json_path.write_text(content, encoding="utf-8")
        regenerated += 1
        print(f"📝 {json_path.name} regénéré") 
    return regenerated

def main():
    data = {}

    regenerated = 0

    # Rework? List all data to get, for each source file, get the data and fill the output json, save all

    # Generate divas data
    diva_db = get_database_data("diva")
    diva_list = jmespath.search("CDENCMNHNGA[].AHHJLDLAPAN", diva_db)
    diva_db = None

    generate_jsons = []    
    data["divas"] = []

    for id_ in diva_list:
        generate_json = {}
        
        id = int(id_)
        generate_json["name"] = str(id)

        # generate
        json_content = {
            "divaId":id,
            "database":{},
            "language":{},
            "fb":{}
        }

        # Add the diva full data
        add_database_data(json_content, "diva", ["AGNCAAFGLBE", "CDENCMNHNGA/"+str(id-1)])
        # Remove all CMCKNKKCNDK, and readd only what's needed
        json_content["database"]["diva"]["CDENCMNHNGA"][str(id-1)]["CMCKNKKCNDK"] = {}
        add_database_data(json_content, "diva", "CDENCMNHNGA/"+str(id-1)+"/CMCKNKKCNDK/.*|to_number(ANAJIAENLNB) <= `"+json_content["database"]["diva"]["AGNCAAFGLBE"]+"`")
        add_database_data(json_content, "costume", ["CDENCMNHNGA/.*|AHHJLDLAPAN=='"+str(id)+"' && PPEGAKEIEGM=='2'/AHHJLDLAPAN",
            "CDENCMNHNGA/.*|AHHJLDLAPAN=='"+str(id)+"' && PPEGAKEIEGM=='2'/PPEGAKEIEGM",
            "CDENCMNHNGA/.*|AHHJLDLAPAN=='"+str(id)+"' && PPEGAKEIEGM=='2'/JPIDIENBGKH",
            "CDENCMNHNGA/.*|AHHJLDLAPAN=='"+str(id)+"' && PPEGAKEIEGM=='2'/DAJGPBLEEOB",
            "CDENCMNHNGA/.*|AHHJLDLAPAN=='"+str(id)+"' && PPEGAKEIEGM=='2'/BJGNGNPHCBA/.*|INDDJNMPONH=='4'/INDDJNMPONH"])

        add_language_data(json_content, "common", "profile_diva"+str(id).zfill(3)+".*") #|contains(t, 'Nov')
        add_language_data(json_content, "menu", "story_diva_desc_"+str(id).zfill(2))
        # add_text for each costume
        master_list = [
            "diva_"+str(id).zfill(2),
            "diva_s_"+str(id).zfill(2)
        ]
        for k in json_content["database"]["costume"]["CDENCMNHNGA"]:
            cos_id = json_content["database"]["costume"]["CDENCMNHNGA"][k]["JPIDIENBGKH"]
            master_list.append("cos_"+str(cos_id).zfill(4))
            has_color = len(json_content["database"]["costume"]["CDENCMNHNGA"][k]["BJGNGNPHCBA"]) > 0
            json_content["database"]["costume"]["CDENCMNHNGA"][k]["_has_color"] = has_color
            json_content["database"]["costume"]["CDENCMNHNGA"][k].pop("BJGNGNPHCBA", None)
            if has_color:
                master_list.append("cos_"+str(cos_id).zfill(4)+"_01")
        add_language_data(json_content, "master", master_list)

        add_fb_data(json_content, "diva", "NCMGOKNHGNL/"+str(id - 1)+"/OFMGALJGDAO")

        # Update content.json
        diva_data = {}
        diva_data["id"] = id_
        diva_data["name"] = json_content["language"]["master"]["en"]["diva_"+str(id).zfill(2)]
        data["divas"].append(diva_data)

        generate_json["content"] = json_content
        generate_jsons.append(generate_json)
    
    generate_data(OUTPUT / "divas", generate_jsons)
    generate_jsons = None

    # Generate costume data
    costume_db = get_database_data("costume")
    cos_list = jmespath.search("CDENCMNHNGA[?PPEGAKEIEGM=='2'].JPIDIENBGKH", costume_db)
    costume_db = None

    generate_jsons = []
    data["costumes"] = []

    for id_ in cos_list:
        generate_json = {}

        id = int(id_)
        generate_json["name"] = str(id)

        # generate
        json_content = {
            "costumeId":id,
            "database":{},
            "language":{},
            "fb":{}
        }

        # Add the datas
        add_database_data(json_content, "costume", ["CDENCMNHNGA/"+str(id-1), "FDNBEPCEHBH/.*", "MBLNIECELNK/.*", "AKKDOIJNMBH/.*"])
        master_list = [
            "cos_"+str(id).zfill(4)
        ]
        has_color = jmes_search("to_entries(BJGNGNPHCBA)[?value.INDDJNMPONH == '4'] | [0] != null", json_content["database"]["costume"]["CDENCMNHNGA"][str(id-1)])
        if has_color:
            master_list.append("cos_"+str(id).zfill(4)+"_01")
        d_id = json_content["database"]["costume"]["CDENCMNHNGA"][str(id-1)]["AHHJLDLAPAN"]
        master_list.append("diva_"+d_id.zfill(2))
        add_language_data(json_content, "master", master_list)

        # Update content.json
        cos_data = {}
        cos_data["id"] = id_
        cos_data["d_id"] = d_id
        cos_data["l_id"] = json_content["database"]["costume"]["CDENCMNHNGA"][str(id-1)]["DAJGPBLEEOB"]
        cos_data["name"] = json_content["language"]["master"]["en"]["cos_"+str(id).zfill(4)]
        if cos_data["name"] == "":
            cos_data["name"] = json_content["language"]["master"]["jp"]["cos_"+str(id).zfill(4)]
        coloCostumeName = ""
        if has_color:
            coloCostumeName = json_content["language"]["master"]["en"]["cos_" + str(id).zfill(4) + "_01"]
            if coloCostumeName == "":
                coloCostumeName = json_content["language"]["master"]["jp"]["cos_" + str(id).zfill(4) + "_01"]
        if coloCostumeName != "":
            coloCostumeName = coloCostumeName
        cos_data["coloCostumeName"] = coloCostumeName
        cos_data["diva_name"] = json_content["language"]["master"]["en"]["diva_"+str(d_id).zfill(2)]
        data["costumes"].append(cos_data)

        generate_json["content"] = json_content
        generate_jsons.append(generate_json)
    
    generate_data(OUTPUT / "costumes", generate_jsons)
    generate_jsons = None

    # export content json
    content = json.dumps(data, indent=4)
    if not(CONTENT.exists() and CONTENT.read_text(encoding="utf-8") == content):
        CONTENT.write_text(content, encoding="utf-8")
    

    print(f"✅ Terminé — {regenerated} fichier(s) mis à jour")


if __name__ == "__main__":
    main()