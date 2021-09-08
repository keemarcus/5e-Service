const form = document.getElementById("new character")
const select_race = document.getElementById("select race")
const select_alignment = document.getElementById("select alignment")
const select_class = document.getElementById("select class")
const select_subrace = document.getElementById("select subrace")
const subrace_head = document.getElementById("subrace head")
const subrace_desc = document.getElementById("subrace desc")

const skill_profs_info = document.getElementById('skill profs info')
const tool_profs_info = document.getElementById('tool profs info')
const inst_profs_info = document.getElementById('inst profs info')
const race_skill_profs = document.getElementById('race skill profs')
const class_skill_profs = document.getElementById('class skill profs')
const race_tool_profs = document.getElementById('race tool profs')
const class_tool_profs = document.getElementById('class tool profs')
const race_inst_profs = document.getElementById('race inst profs')
const class_inst_profs = document.getElementById('class inst profs')

getChoices()

async function getChoices() {
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

select_race.onchange = async function () {
    let url = "http://localhost:5000/races/" + this.value
    let response = await fetch(url)
    let info = await response.json()
    parseRaceInfo(info, "race")


    // add options for subraces
    while (select_subrace.childElementCount > 1) { select_subrace.removeChild(select_subrace.lastChild) }
    select_subrace.selectedIndex = 0
    info["subraces"].forEach(x => {
        let option = document.createElement("option")
        option.id = x["index"]
        option.value = x["index"]
        option.innerText = x["name"]
        select_subrace.appendChild(option)
    })
    if (select_subrace.childElementCount > 1) { select_subrace.hidden = false; subrace_head.hidden = false; subrace_desc.hidden = false }
    else { select_subrace.hidden = true; subrace_head.hidden = true; subrace_desc.hidden = true }
}

select_subrace.onchange = async function () {
    let url = "http://localhost:5000/subraces/" + this.value
    let response = await fetch(url)
    let info = await response.json()
    parseRaceInfo(info, "subrace")
}

select_alignment.onchange = async function () {
    let url = "http://localhost:5000/alignments/" + this.value
    let response = await fetch(url)
    let info = await response.json()

    const alignment_desc = document.getElementById('alignment desc')
    alignment_desc.innerText = info["abbreviation"] + " - " + info["desc"]
}

select_class.onchange = async function () {
    let url = "http://localhost:5000/classes/" + this.value
    let response = await fetch(url)
    let info = await response.json()

    const hit_die = document.getElementById('hit die')
    hit_die.innerText = "- d" + info["hit_die"]
    const class_weapon_proficiencies = document.getElementById('class weapon proficiencies')
    while (class_weapon_proficiencies.firstChild) { class_weapon_proficiencies.removeChild(class_weapon_proficiencies.firstChild) }
    info["proficiencies"].forEach(x => addWeaponProf(x["name"], class_weapon_proficiencies, "class"))

    const class_skill_proficiency_number = document.getElementById('class skill proficiency number')
    const class_tool_proficiency_number = document.getElementById('class tool proficiency number')
    const class_inst_proficiency_number = document.getElementById('class inst proficiency number')

    while (class_skill_profs.childElementCount > 0) { class_skill_profs.removeChild(class_skill_profs.lastChild) }
    while (class_tool_profs.childElementCount > 0) { class_tool_profs.removeChild(class_tool_profs.lastChild) }
    while (class_inst_profs.childElementCount > 0) { class_inst_profs.removeChild(class_inst_profs.lastChild) }

    info["proficiency_choices"].forEach(x => {
        let first_prof = x["from"][0]["index"].split("-")
        if (first_prof[0] == "skill") {
            class_skill_proficiency_number.innerText = "Choose " + x["choose"] + " (from class)"
            let name = "skill prof~" + x["choose"] + "~class"
            x["from"].forEach(x => addProfOption(x["name"].slice(7), x["index"], class_skill_profs, name))
        } else if (["kit", "tools", "supplies", "utensils", "set"].indexOf(first_prof[first_prof.length - 1]) > -1) {
            class_tool_proficiency_number.innerText = "Choose " + x["choose"] + " (from class)"
            let name = "tool prof~" + x["choose"] + "~class"
            x["from"].forEach(x => addProfOption(x["name"], x["index"], class_tool_profs, name))
        } else {
            class_inst_proficiency_number.innerText = "Choose " + x["choose"] + " (from class)"
            let name = "inst prof~" + x["choose"] + "~class"
            x["from"].forEach(x => addProfOption(x["name"], x["index"], class_inst_profs, name))
        }
    })
    if (class_skill_profs.childElementCount > 0) { class_skill_proficiency_number.hidden = false; class_skill_profs.hidden = false } else { class_skill_proficiency_number.hidden = true; class_skill_profs.hidden = true }
    if (class_tool_profs.childElementCount > 0) { class_tool_proficiency_number.hidden = false; class_tool_profs.hidden = false } else { class_tool_proficiency_number.hidden = true; class_tool_profs.hidden = true }
    if (class_inst_profs.childElementCount > 0) { class_inst_proficiency_number.hidden = false; class_inst_profs.hidden = false } else { class_inst_proficiency_number.hidden = true; class_inst_profs.hidden = true }

    if (class_skill_profs.childElementCount > 0 || race_skill_profs.childElementCount > 0) { skill_profs_info.hidden = false } else { skill_profs_info.hidden = true }
    if (class_tool_profs.childElementCount > 0 || race_tool_profs.childElementCount > 0) { tool_profs_info.hidden = false } else { tool_profs_info.hidden = true }
    if (class_inst_profs.childElementCount > 0 || race_inst_profs.childElementCount > 0) { inst_profs_info.hidden = false } else { inst_profs_info.hidden = true }

    const save_proficiencies = document.getElementById('save proficiencies')
    while (save_proficiencies.firstChild) { save_proficiencies.removeChild(save_proficiencies.firstChild) }
    info["saving_throws"].forEach(x => { let li = document.createElement("li"); li.appendChild(document.createTextNode(x["name"])); save_proficiencies.appendChild(li) })

    const class_info = document.getElementById("class info")
    class_info.hidden = false
}

function checkboxLimit() {
    let limit = this.name.split("~")[1]
    if (document.querySelectorAll('input[type="checkbox"][name="' + this.name + '"]:checked').length > limit) {
        this.checked = false
    }
}

async function getTrait(index, parent) {
    let url = "http://localhost:5000/traits/" + index
    let response = await fetch(url)
    let info = await response.json()
    let p = document.createElement("p")
    p.innerText = info["desc"]
    parent.appendChild(p)
}

function addWeaponProf(name, parent, source) {
    let li = document.createElement("li")
    li.innerText = name + " (from " + source + ")"
    parent.appendChild(li)
}

function addProfOption(profName, index, parent, inputName) {
    let checkbox = document.createElement("input")
    checkbox.type = "checkbox"
    checkbox.value = index
    checkbox.name = inputName
    let label = document.createElement("label")
    label.for = index
    label.innerText = profName
    let br = document.createElement("br")
    parent.appendChild(checkbox)
    parent.appendChild(label)
    parent.appendChild(br)
    checkbox.addEventListener("click", checkboxLimit)
}

function parseRaceInfo(info, type) {
    if (type === "race") {
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
    } else {
        subrace_desc.innerText = info["desc"]
    }


    
    if (type === "race") {
        ability_bonuses = document.getElementById('ability bonus')
        let subrace_ability_bonuses = document.getElementById('subrace ability bonus')
        while (subrace_ability_bonuses.firstChild) {
            subrace_ability_bonuses.removeChild(subrace_ability_bonuses.firstChild);
        }
    } else {
        ability_bonuses = document.getElementById('subrace ability bonus')
    }
    while (ability_bonuses.firstChild) {
        ability_bonuses.removeChild(ability_bonuses.firstChild);
    }
    info["ability_bonuses"].forEach(x => {
        let li = document.createElement("li")
        li.innerText = "+" + x["bonus"] + " " + x["ability_score"]["name"]
        ability_bonuses.appendChild(li)
    })

    if(type === "race"){
        language_desc = document.getElementById('language desc')
        languages = document.getElementById('languages')
        language_number = document.getElementById('language number')
        language_options = document.getElementById('language options')
        language_desc.innerText = info["language_desc"]
        let subrace_languages = document.getElementById('subrace languages')
        let subrace_language_number = document.getElementById('subrace language number')
        let subrace_language_options = document.getElementById('subrace language options')
        while (subrace_languages.firstChild) {subrace_languages.removeChild(subrace_languages.firstChild)}
        while (subrace_language_options.firstChild) {subrace_language_options.removeChild(subrace_language_options.firstChild)}
        subrace_language_number.hidden = true; subrace_language_options.hidden = true
    } else {
        languages = document.getElementById('subrace languages')
        language_number = document.getElementById('subrace language number')
        language_options = document.getElementById('subrace language options')
    }
    while (languages.firstChild) {languages.removeChild(languages.firstChild)}
    info["languages"].forEach(x => {
        let li = document.createElement("li")
        li.innerText = x["name"]
        languages.appendChild(li)
    })
    while (language_options.firstChild) {language_options.removeChild(language_options.firstChild)}
    if (typeof info["language_options"] !== 'undefined'){
       language_number.innerText = "Choose " + info["language_options"]["choose"] + " (from " + type + ")"
       let name = "language~" + info["language_options"]["choose"]
       info["language_options"]["from"].forEach(x => addProfOption(x["name"], x["index"], language_options, name))
    }
    if(language_options.childElementCount > 0){language_number.hidden = false; language_options.hidden = false}
    else {language_number.hidden = true; language_options.hidden = true}

    if (type === "race") {
        traits = document.getElementById('race traits')
        while (traits.firstChild) {
            traits.removeChild(traits.firstChild);
        }
        info["traits"].forEach(x => {
            let div = document.createElement("div")
            let h3 = document.createElement("h3")
            h3.innerText = x["name"]
            traits.appendChild(div)
            div.appendChild(h3)
            getTrait(x["index"], div)
        })
    } else {
        traits = document.getElementById('subrace traits')
        while (traits.firstChild) {
            traits.removeChild(traits.firstChild);
        }
        info["racial_traits"].forEach(x => {
            let div = document.createElement("div")
            let h3 = document.createElement("h3")
            h3.innerText = x["name"]
            traits.appendChild(div)
            div.appendChild(h3)
            getTrait(x["index"], div)
        })
    }


    const race_skill_proficiency_number = document.getElementById('race skill proficiency number')
    const race_tool_proficiency_number = document.getElementById('race tool proficiency number')
    const race_inst_proficiency_number = document.getElementById('race inst proficiency number')

    while (race_skill_profs.childElementCount > 0) { race_skill_profs.removeChild(race_skill_profs.lastChild) }
    while (race_tool_profs.childElementCount > 0) { race_tool_profs.removeChild(race_tool_profs.lastChild) }
    while (race_inst_profs.childElementCount > 0) { race_inst_profs.removeChild(race_inst_profs.lastChild) }

    const race_weapon_proficiencies = document.getElementById('race weapon proficiencies')
    while (race_weapon_proficiencies.firstChild) { race_weapon_proficiencies.removeChild(race_weapon_proficiencies.firstChild) }

    if (typeof info["starting_proficiencies"][0] !== 'undefined') {
        let first_prof = info["starting_proficiencies"][0]["index"].split("-")
        if (first_prof[0] == "skill") {
            let list = document.createElement("ul")
            info["starting_proficiencies"].forEach(x => {
                let li = document.createElement("li")
                li.innerText = x["name"].slice(7) + " (from race)"
                list.appendChild(li)
            })
            race_skill_profs.prepend(list)
        } else {
            info["starting_proficiencies"].forEach(x => addWeaponProf(x["name"], race_weapon_proficiencies, "race"))
        }
    }

    if (typeof info["starting_proficiency_options"] !== 'undefined') {
        let first_prof = info["starting_proficiency_options"]["from"][0]["index"].split("-")
        if (first_prof[0] == "skill") {
            race_skill_proficiency_number.innerText = "Choose " + info["starting_proficiency_options"]["choose"] + " (from race)"
            let name = "skill prof~" + info["starting_proficiency_options"]["choose"] + "~race"
            info["starting_proficiency_options"]["from"].forEach(x => addProfOption(x["name"].slice(7), x["index"], race_skill_profs, name))
        } else if (["kit", "tools", "supplies", "utensils", "set"].indexOf(first_prof[first_prof.length - 1]) > -1) {
            race_tool_proficiency_number.innerText = "Choose " + info["starting_proficiency_options"]["choose"] + " (from race)"
            let name = "tool prof~" + info["starting_proficiency_options"]["choose"] + "~race"
            info["starting_proficiency_options"]["from"].forEach(x => addProfOption(x["name"], x["index"], race_tool_profs, name))
        } else {
            race_inst_proficiency_number.innerText = "Choose " + info["starting_proficiency_options"]["choose"] + " (from race)"
            let name = "inst prof~" + info["starting_proficiency_options"]["choose"] + "~race"
            info["starting_proficiency_options"]["from"].forEach(x => addProfOption(x["name"], x["index"], race_inst_profs, name))
        }
    }

    if (race_skill_profs.childElementCount > 0) { race_skill_proficiency_number.hidden = false; race_skill_profs.hidden = false } else { race_skill_proficiency_number.hidden = true; race_skill_profs.hidden = true }
    if (race_tool_profs.childElementCount > 0) { race_tool_proficiency_number.hidden = false; race_tool_profs.hidden = false } else { race_tool_proficiency_number.hidden = true; race_tool_profs.hidden = true }
    if (race_inst_profs.childElementCount > 0) { race_inst_proficiency_number.hidden = false; race_inst_profs.hidden = false } else { race_inst_proficiency_number.hidden = true; race_inst_profs.hidden = true }

    if (class_skill_profs.childElementCount > 0 || race_skill_profs.childElementCount > 0) { skill_profs_info.hidden = false } else { skill_profs_info.hidden = true }
    if (class_tool_profs.childElementCount > 0 || race_tool_profs.childElementCount > 0) { tool_profs_info.hidden = false } else { tool_profs_info.hidden = true }
    if (class_inst_profs.childElementCount > 0 || race_inst_profs.childElementCount > 0) { inst_profs_info.hidden = false } else { inst_profs_info.hidden = true }

    const race_info = document.getElementById("race info")
    race_info.hidden = false
}