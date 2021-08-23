// get table element
const table = document.getElementById('class table')

getInfo(localStorage.getItem("selectedClass"))

async function getInfo(className){
    let url = "http://localhost:5000/classes/" + className
    let response = await fetch(url)
    let info = await response.json()

    const class_name = document.getElementById('class name')
    const hit_die = document.getElementById('hit die')
    class_name.innerText = info["name"]
    hit_die.innerText = "1d" + info["hit_die"]
    const proficiencies = document.getElementById('proficiencies')
    info["proficiencies"].forEach(x => {let li = document.createElement("li"); li.appendChild(document.createTextNode(x["name"])); proficiencies.appendChild(li)})

    const skill_head = document.getElementById('skill head')
    const skill_proficiency_number = document.getElementById('skill proficiency number')
    const skill_proficiencies = document.getElementById('skill proficiencies')
    const tool_head = document.getElementById('tool head')
    const tool_proficiency_number = document.getElementById('tool proficiency number')
    const tool_proficiencies = document.getElementById('tool proficiencies')
    const inst_head = document.getElementById('inst head')
    const inst_proficiency_number = document.getElementById('inst proficiency number')
    const inst_proficiencies = document.getElementById('inst proficiencies')
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
    if(skill_proficiencies.childElementCount == 0){skill_head.hidden = true; skill_proficiency_number.hidden = true}
    if(tool_proficiencies.childElementCount == 0){tool_head.hidden = true; tool_proficiency_number.hidden = true}
    if(inst_proficiencies.childElementCount == 0){inst_head.hidden = true; inst_proficiency_number.hidden = true}

    const save_proficiencies = document.getElementById('save proficiencies')
    info["saving_throws"].forEach(x => {let li = document.createElement("li"); li.appendChild(document.createTextNode(x["name"])); save_proficiencies.appendChild(li)})

    const starting_equipment = document.getElementById('starting equipment')
    info["starting_equipment"].forEach(x => {
        if(x["quantity"] > 1){let li = document.createElement("li"); li.appendChild(document.createTextNode(x["quantity"] + " " + x["equipment"]["name"] + "s")); starting_equipment.appendChild(li)} 
        else{let li = document.createElement("li"); li.appendChild(document.createTextNode(x["equipment"]["name"])); starting_equipment.appendChild(li)}
    })
    info["starting_equipment_options"].forEach(x => {
        let li = document.createElement("li"); li.appendChild(document.createTextNode("Choose " + x["choose"])); starting_equipment.appendChild(li)
        let ul = document.createElement("ul"); starting_equipment.appendChild(ul)
        x["from"].forEach(x => {
            if(typeof x[0] !== 'undefined'){
                let li = document.createElement("li")
                for (let i = 0; i < Object.keys(x).length; i++) {
                    if(x[i]["quantity"] > 1){li.appendChild(document.createTextNode(x[i]["quantity"] + " " + x[i]["equipment"]["name"] + "s"))} 
                    else{li.appendChild(document.createTextNode(x[i]["equipment"]["name"] + " and "))}
                }
                ul.appendChild(li)
            }
            else if(x["quantity"] > 1){let li = document.createElement("li"); li.appendChild(document.createTextNode(x["quantity"] + " " + x["equipment"]["name"] + "s")); ul.appendChild(li)} 
            else if(typeof x["equipment_option"] !== 'undefined'){
                // let li = document.createElement("li")
                // li.appendChild(document.createTextNode(x["equipment_option"]["choose"] + " "))
                // x["equipment_option"]["from"].forEach(x => {
                //     li.appendChild(document.createTextNode(x["equipment"]["name"]))
                // })
                // ul.appendChild(li)
            }
            else{let li = document.createElement("li"); li.appendChild(document.createTextNode(x["equipment"]["name"])); ul.appendChild(li)}
        })
    })
    

    for([key, val] of Object.entries(info)) {
        // add a new row
        let row = table.insertRow(-1)
        let cell1 = row.insertCell(0)
        let cell2 = row.insertCell(1)
        cell1.innerText = key
        cell2.innerText = val
    }
}