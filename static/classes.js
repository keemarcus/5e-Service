// get table element
const class_list = document.getElementById('class list')

getInfo()

async function getInfo(){
    let url = "http://localhost:5000/classes"
    let response = await fetch(url)
    let info = await response.json()

    info.forEach(x => {
        let li = document.createElement("li")
        li.appendChild(document.createTextNode(x["name"]))
        class_list.appendChild(li)

        let index = x["index"]
        li.onclick = function(){
            localStorage.setItem("selectedClass",index)
            window.location.href = "file:///E:/Projects/DDInfoService/static/class.html"
        }
    })
}
