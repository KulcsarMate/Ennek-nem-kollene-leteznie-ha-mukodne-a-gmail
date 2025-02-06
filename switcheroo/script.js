function Create(){
    var height = parseInt(document.getElementById("line").value)
    var width = parseInt(document.getElementById("collumn").value)
    var box = document.getElementById("box")
    const liszt = Scramble(Fill(new Array(), height, width), height*width)
    document.getElementById('alertMessage').style.display = 'none';
    Visualize(width, height, liszt, box)
}

function WinCheck(list) {
    let i = 0;
    let good = true;
    while (i < list.length && good) {
        if (!(i + 1 === list[i]) && list[i] != " ") {
            good = false;
        }
        i++;
    }
    if (good) {
        document.getElementById('alertMessage').style.display = 'block';
    }
}

function IndexFinder(i, j, line) {
    return i*line + j
}

function Inside(i, j, height, width){
    return i >= 0 && i < height && j >= 0 && j < width
}

function Test(list, i, j, line, collumn){
    const ways = [[-1,0], [0,1], [1,0], [0, -1]]
    console.log(i, j)
    for (let k = 0; k < ways.length; k++) {
        if (Inside(i + ways[k][0],j + ways[k][1], line, collumn) && list[IndexFinder(i + ways[k][0],j + ways[k][1], line)] === " "){
            const empty = IndexFinder(i + ways[k][0],j + ways[k][1], line)
            const current = IndexFinder(i, j, line)
            list[empty] = list[current]
            list[current] = " "
            WinCheck(list)
        }
    }
    
    Visualize(line, collumn, list, box)
}

function Winable(){

    return false
}

function Scramble(liszt, max){
    for(let i = 0; i <= max; i++){
        let r1 = random(0, max-1)
        let r2 = random(0, max-1)
        let s = liszt[r1]
        liszt[r1] = liszt[r2]
        liszt[r2] = s
    }
    if(Winable(liszt)){
        Scramble(liszt)
    }
    return liszt
}

function Visualize(height, width, liszt, box){
    box.innerText = ""
    var table = document.createElement("table")

    for(let i = 0; i < height; i++){
        var tr = document.createElement("tr")
        for(let j = 0; j < width; j++){
            var td = document.createElement("td")
            td.innerText = liszt[IndexFinder(i, j, width)]
            td.addEventListener("click", function (){
                Test(liszt, i, j, width, height)
            })
            tr.appendChild(td)
        }
        table.appendChild(tr)
    }
    box.appendChild(table)
}

function Search(liszt, num){
    for(let i = 0; i < liszt.length; i++){
        if(liszt[i] == num){
            return true
        }
    }
    return false
}

function random(min, max){
    return Math.floor(Math.random()*(max-min+1)+min)
}

function Fill(lista, height, width){
    for(let i = 0; i < height * width-1; i++){
        lista.push(i+1)
    }
    lista.push(" ")
   return lista
}