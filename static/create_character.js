const form = document.getElementById("new character")
const select_race = document.getElementById("select race")
const select_alignment = document.getElementById("select alignment")
const select_class = document.getElementById("select class")

getChoices()

async function getChoices(){
    let url = "http://localhost:5000/races"
    let response = await fetch(url)
    let info = await response.json()

    info.forEach(x => {
        let option = document.createElement("option")
        option.id = x["index"]
        option.value = x["index"]
        option.innerText = x["name"]
        select_race.appendChild(option)
    })

    url = "http://localhost:5000/alignments"
    response = await fetch(url)
    info = await response.json()

    info.forEach(x => {
        let option = document.createElement("option")
        option.id = x["index"]
        option.value = x["index"]
        option.innerText = x["name"]
        select_alignment.appendChild(option)
    })

    url = "http://localhost:5000/classes"
    response = await fetch(url)
    info = await response.json()

    info.forEach(x => {
        let option = document.createElement("option")
        option.id = x["index"]
        option.value = x["index"]
        option.innerText = x["name"]
        select_class.appendChild(option)
    })
}

select_race.onchange = async function(){
    let url = "http://localhost:5000/races/" + this.value
    let response = await fetch(url)
    let info = await response.json()

    const age = document.getElementById('age')
    const alignment_desc = document.getElementById('race alignment desc')
    const size = document.getElementById('size')
    const size_desc = document.getElementById('size desc')
    const speed = document.getElementById('speed')
    age.innerText = info["age"]
    alignment_desc.innerText = info["alignment"]
    size.innerText = "- " + info["size"]
    size_desc.innerText = info["size_description"]
    speed.innerText = "Your base walking speed is " + info["speed"] + " feet."

    const ability_bonuses = document.getElementById('ability bonus')
    while (ability_bonuses.firstChild) {
        ability_bonuses.removeChild(ability_bonuses.firstChild);
    }
    info["ability_bonuses"].forEach(x => {
        let li = document.createElement("li")
        li.innerText = "+" + x["bonus"] + " " + x["ability_score"]["name"]
        ability_bonuses.appendChild(li)
    })
    
    const languages = document.getElementById('languages')
    const language_desc = document.getElementById('language desc')
    while (languages.firstChild) {
        languages.removeChild(languages.firstChild);
    }
    info["languages"].forEach(x => {
        let li = document.createElement("li")
        li.innerText = x["name"]
        languages.appendChild(li)
    })
    language_desc.innerText = info["language_desc"]

    const race_info = document.getElementById("race info")
    race_info.hidden = false
}

select_alignment.onchange = async function(){
    let url = "http://localhost:5000/alignments/" + this.value
    let response = await fetch(url)
    let info = await response.json()

    const alignment_desc = document.getElementById('alignment desc')
    alignment_desc.innerText = info["abbreviation"] + " - " + info["desc"]
}

select_class.onchange = async function(){
    let url = "http://localhost:5000/classes/" + this.value
    let response = await fetch(url)
    let info = await response.json()

    const hit_die = document.getElementById('hit die')
    hit_die.innerText = "- d" + info["hit_die"]
    const weapon_proficiencies = document.getElementById('weapon proficiencies')
    while (weapon_proficiencies.firstChild) {weapon_proficiencies.removeChild(weapon_proficiencies.firstChild)}
    info["proficiencies"].forEach(x => {let li = document.createElement("li"); li.appendChild(document.createTextNode(x["name"])); weapon_proficiencies.appendChild(li)})

    const skill_profs_info = document.getElementById('skill profs info')
    const skill_proficiency_number = document.getElementById('skill proficiency number')
    const skill_proficiencies = document.getElementById('skill proficiencies')
    const tool_profs_info = document.getElementById('tool profs info')
    const tool_proficiency_number = document.getElementById('tool proficiency number')
    const tool_proficiencies = document.getElementById('tool proficiencies')
    const inst_profs_info = document.getElementById('inst profs info')
    const inst_proficiency_number = document.getElementById('inst proficiency number')
    const inst_proficiencies = document.getElementById('inst proficiencies')

    while (skill_proficiencies.firstChild) {skill_proficiencies.removeChild(skill_proficiencies.firstChild)}
    while (tool_proficiencies.firstChild) {tool_proficiencies.removeChild(tool_proficiencies.firstChild)}
    while (inst_proficiencies.firstChild) {inst_proficiencies.removeChild(inst_proficiencies.firstChild)}

    info["proficiency_choices"].forEach(x => {
        let first_prof = x["from"][0]["index"].split("-")
        if(first_prof[0] == "skill"){
            skill_proficiency_number.innerText = "Choose " + x["choose"]
            x["from"].forEach(x => {let li = document.createElement("li"); li.appendChild(document.createTextNode(x["name"].slice(7))); skill_proficiencies.appendChild(li)})
        } else if(["kit","tools","supplies","utensils","set"].indexOf(first_prof[first_prof.length - 1]) > -1) {
            tool_proficiency_number.innerText = "Choose " + x["choose"]
            x["from"].forEach(x => {let li = document.createElement("li"); li.appendChild(document.createTextNode(x["name"])); tool_proficiencies.appendChild(li)})
        } else{
            inst_proficiency_number.innerText = "Choose " + x["choose"]
            x["from"].forEach(x => {let li = document.createElement("li"); li.appendChild(document.createTextNode(x["name"])); inst_proficiencies.appendChild(li)})
        }
    })
    if(skill_proficiencies.childElementCount > 0){skill_profs_info.hidden = false} else{skill_profs_info.hidden = true}
    if(tool_proficiencies.childElementCount > 0){tool_profs_info.hidden = false} else{tool_profs_info.hidden = true}
    if(inst_proficiencies.childElementCount > 0){inst_profs_info.hidden = false} else{inst_profs_info.hidden = true}

    const save_proficiencies = document.getElementById('save proficiencies')
    info["saving_throws"].forEach(x => {let li = document.createElement("li"); li.appendChild(document.createTextNode(x["name"])); save_proficiencies.appendChild(li)})

    const class_info = document.getElementById("class info")
    class_info.hidden = false
}