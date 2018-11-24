function gebi(id){return document.getElementById(id)}
function l(msg){console.log(msg)}

window.onload = function() {
	let grid = gebi("grid")
	let button = gebi("solve")
	generateGrid(grid)
	button.onclick = solve
	document.addEventListener('keypress', keypress)

	gebi("load").onclick = () => { setGrid(sample) }
}

function keypress(event) {
		let c = document.activeElement
		if(c.type !== "textarea") { return }
		let id = c.getAttribute("id").split("")
		let x = Number(id[0])
		let y = Number(id[1])
		switch(event.key) {
			case "ArrowUp":
				if(y > 0) y -= 1
				break
			case "ArrowRight":
				if(x < 8) x += 1
				break
			case "ArrowDown":
				if(y < 8) y += 1
				l("here")
				break
			case "ArrowLeft":
				if(x > 0) x -= 1
		}
		let n = gebi(""+x+y)
		n.focus()
		n.select()
}

//TODO: only one digit allowed
function generateGrid(grid){
	let t = document.createElement("table")
	grid.appendChild(t)
	for(let i = 0; i < 9; i++) {
		let row = document.createElement("tr")
		t.appendChild(row)
		for(let n = 0; n < 9; n++){
			let td = document.createElement("td")
			var textArea = document.createElement("textarea")
			var newContent = document.createTextNode("0")
			textArea.setAttribute("id", ""+n+i)
			textArea.setAttribute("contenteditable", "true")
			textArea.onfocus = function(e) {
				e.target.select()
			}
			textArea.appendChild(newContent)
			td.appendChild(textArea)
			row.appendChild(td)

			// there's probably a better way to do this
			let divider = "5px "
			let l = (n === 0 || n === 3 || n === 6) ? divider : "0 "
			let t = (i === 0 || i === 3 || i === 6) ? divider : "0 "
			let b = (i === 8) ? divider : "0 "
			let r = (n === 8) ? divider : "0 "
			td.setAttribute("style", "border-width:"+t+r+b+l+";")
		}
	}
}

function getGrid(){
	grid = []
	for(i = 0; i < 9; i++) {
		grid.push([])
		for(n = 0; n < 9; n++){
			//TODO check for valid input
			c = gebi(""+n+i)
			grid[i].push(c.value)
		}
	}
	return grid
}


function setGrid(grid) {
	if(grid.length !== 9) { 
		l("bad grid")
		return
	}
	for(i = 0; i < 9; i++) {
		for(n = 0; n < 9; n++){
			val = grid[i][n]
			if(val.length > 1) {val = "0"}
			c = gebi(""+n+i)
			c.value = val
		}
	}
}

function validate(grid){
	for(let i = 0; i < 9; i++){
		for(let n = 0; n < 9; n++){
			if(grid[i][n].length !== 0) {return false}
		}
	}
}

function elim(arr, el){
	for(let i=0; i < arr.length; i++){
		if(arr[i].length > 1) {continue}
		el = el.replace(arr[i], '')
	}
	return el
}

function solve(){
	grid = getGrid()

	// initialize with options
	for(i = 0; i < 9; i++){
		for(n = 0; n < 9; n++){
			if(grid[i][n] === "0"){
				grid[i][n] = "123456789"
			}
		}
	}

	for(i = 0; i < 9; i++){
		for(n = 0; n < 9; n++){
			val = grid[i][n]
			if(val.length === 1) { continue } 
			// eliminate by boxes
			let x1 = 0, x2 = 0, y1 = 0, y2 = 0
			if(i < 3 && n < 3) {
				x2 = 3
				y2 = 3
			} // top left
			else if (i < 3 && n < 6) {
				x2 = 3
				y1 = 3; y2 = 6
			} //middle left
			else if (i < 3) {
				x2 = 3
				y1 = 6; y2 = 9
			} //bottom left
			else if(i < 6 && n < 3) {
				x1 = 3; x2 = 6
				y2 = 3
			} // top middle
			else if (i < 6 && n < 6) {
				x1 = 3; x2 = 6
				y1 = 3; y2 = 6
			} //middle middle
			else if (i < 6) {
				x1 = 3; x2 = 6
				y1 = 6; y2 = 9
			} //bottom middle
			else if(n < 3) {
				x1 = 6; x2 = 9
				y2 = 3
			} // top right
			else if (n < 6) {
				x1 = 6; x2 = 9
				y1 = 3; y2 = 6
			} //right middle
			else {
				x1 = 6; x2 = 9
				y1 = 6; y2 = 9
			} // right bottom

			let box = []
			for(let x = x1; x < x2; x++){
				for(let y = y1; y < y2; y++){
					box.push(grid[x][y])
				}
			}
			val = elim(box, val)
			
			// eliminate by columns
			col = []
			for(x = 0; x < 9; x++){
				col.push(grid[x][n])
			}
			val = elim(col, val)

			// eliminate by rows
			val = elim(grid[i], val)
			grid[i][n] = val
		}
	}

	setGrid(grid)
	l(grid)
}

let sample_bad =
 [[ "2", "1", "3", "6", "9", "7", "4", "0", "5"],
  [ "4", "8", "0", "0", "0", "7", "3", "0", "2"],
  [ "1", "0", "0", "0", "2", "6", "7", "0", "0"],
  [ "3", "0", "1", "0", "0", "5", "9", "0", "0"],
  [ "7", "0", "8", "0", "4", "0", "2", "3", "0"],
  [ "6", "0", "0", "0", "8", "3", "0", "0", "0"],
  [ "0", "2", "0", "0", "0", "0", "0", "9", "0"],
  [ "8", "0", "6", "9", "7", "0", "5", "0", "0"],
	[ "9", "0", "0", "6", "0", "1", "8", "0", "3"]]
let sample =
 [[ "2", "0", "0", "0", "9", "0", "4", "0", "5"],
  [ "4", "8", "0", "0", "0", "7", "3", "0", "2"],
  [ "0", "0", "0", "0", "2", "6", "7", "0", "0"],
  [ "3", "0", "1", "0", "0", "5", "9", "0", "0"],
  [ "7", "0", "8", "0", "4", "0", "2", "3", "0"],
  [ "6", "0", "0", "0", "8", "3", "0", "0", "0"],
  [ "0", "2", "0", "0", "0", "0", "0", "9", "0"],
  [ "8", "0", "6", "9", "7", "0", "5", "0", "0"],
	[ "9", "0", "0", "6", "0", "1", "8", "0", "3"]]
