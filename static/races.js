// get table element
const race_list = document.getElementById('race list')

getInfo()

async function getInfo(){
    let url = "http://localhost:5000/races"
    let response = await fetch(url)
    let info = await response.json()

    info.forEach(x => {
        let li = document.createElement("li")
        li.appendChild(document.createTextNode(x["name"]))
        race_list.appendChild(li)

        let index = x["index"]
        li.onclick = function(){
            localStorage.setItem("selectedRace",index)
            window.location.href = "E:/Projects/DDInfoService/5e-Service/static/race.html"
        }
    })
}