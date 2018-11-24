function gebi(id){return document.getElementById(id)}
function l(msg){console.log(msg)}

window.onload = function() {
	grid = gebi("grid")
	generateGrid(grid)
	document.addEventListener('keypress', (event) => {
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
	})
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
			var newContent = document.createTextNode(i)
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
