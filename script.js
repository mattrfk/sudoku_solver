function gebi(id){return document.getElementById(id)}
function l(msg){console.log(msg)}

window.onload = function() {
	grid = gebi("grid")
	generateGrid(grid)
}

//TODO: only one digit allowed
//TODO: intercept arrow keys

function generateGrid(grid){
	let t = document.createElement("table")
	grid.appendChild(t)
	for(let i = 0; i < 9; i++) {
		let row = document.createElement("tr")
		t.appendChild(row)
		for(let n = 0; n < 9; n++){
			let td = document.createElement("td")
			var textArea = document.createElement("textarea")
			var newContent = document.createTextNode(i)
			textArea.setAttribute("id", ""+i+n)
			textArea.setAttribute("contenteditable", "true")
			textArea.onfocus = function(e) {
				e.target.select()
			}
			textArea.appendChild(newContent)
			td.appendChild(textArea)
			row.appendChild(td)
		}
	}
}
