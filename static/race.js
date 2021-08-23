getInfo(localStorage.getItem("selectedRace"))

async function getInfo(raceName){
    let url = "http://localhost:5000/races/" + raceName
    let response = await fetch(url)
    let info = await response.json()

    const name = document.getElementById('race name')
    const age = document.getElementById('age')
    const alignment = document.getElementById('alignment')
    const size = document.getElementById('size')
    const size_desc = document.getElementById('size desc')
    const speed = document.getElementById('speed')
    name.innerText = info["name"]
    age.innerText = info["age"]
    alignment.innerText = info["alignment"]
    size.innerText = "- " + info["size"]
    size_desc.innerText = info["size_description"]
    speed.innerText = "Your base walking speed is " + info["speed"] + " feet."

    const ability_bonuses = document.getElementById('ability bonus')
    info["ability_bonuses"].forEach(x => {
        let li = document.createElement("li")
        li.innerText = "+" + x["bonus"] + " " + x["ability_score"]["name"]
        ability_bonuses.appendChild(li)
    })
    
    const languages = document.getElementById('languages')
    const language_desc = document.getElementById('language desc')
    info["languages"].forEach(x => {
        let li = document.createElement("li")
        li.innerText = x["name"]
        languages.appendChild(li)
    })
    language_desc.innerText = info["language_desc"]

    const traits = document.getElementById('traits')
    info["traits"].forEach(x => {
        let div = document.createElement("div")
        let h3 = document.createElement("h3")
        h3.innerText = x["name"]
        traits.appendChild(div)
        div.appendChild(h3)
        getTrait(x["index"], div)
    })
}

async function getTrait(index, parent){
    let url = "http://localhost:5000/traits/" + index
    let response = await fetch(url)
    let info = await response.json()
    let p = document.createElement("p")
    p.innerText = info["desc"]
    parent.appendChild(p)
}