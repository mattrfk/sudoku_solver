;'use strict';

function gebi(id) { return document.getElementById(id) }

const ss = SudokuSolver()

window.onload = function() {
	generateGrid(gebi('grid'))

	gebi('print').onclick = printTxt
	gebi('read').onclick = readTxt
	gebi('load').onclick = () => { setGrid(sample) }
	gebi('solve').onclick = solveButton

	document.addEventListener('keydown', keypress)
}

function solveButton() {
	let grid = getGrid()
	grid = ss.solve(grid)
	setGrid(grid)
}

function printTxt() {
	let g = getGrid()
	let s = ""
	for(let i = 0; i < 9; i++) {
		for(let n = 0; n < 9; n++) {
			if( ss.isBlank(g[i][n])) { 
				s += '0' 
			}

			else { s += g[i][n] }
			if(n < 8) s += ' '
		}

		if(i < 8) s += "\n"
	}

	let ta = gebi('text')
	ta.value = s
}

function readTxt() {
	let ta = gebi('text')
	let button = gebi('read')
	let s = ta.value

	let grid = s.split('\n')
	for(i in grid) {
		grid[i] = grid[i].split(' ')
	}

	if(ss.isValid(grid)) { 
		setGrid(grid) 
	}
	else { 
		//alert("bad data") 
	}
}

function keypress(event) {
	let c = document.activeElement

	if (c.tagName !== 'INPUT') { return }

	let id = c.getAttribute('id').split('')
	let x = Number(id[0])
	let y = Number(id[1])
	let key = event.key

	if (/^[1-9]$/.test(key)) {
		c.value = key
		event.preventDefault()
		return
	}

	let deletes = [ 'Backspace', 'Delete', ' ' ]
	if (deletes.includes(key)) {
		c.value = ' '
	}

	switch(key) {
		case 'ArrowUp':
			if(y > 0) --y
			break
		case 'ArrowRight':
			if(x < 8) ++x
			break
		case 'ArrowDown':
			if(y < 8) ++y 
			break
		case 'ArrowLeft':
			if(x > 0) --x 
			break
		case 'Tab':
			if(event.shiftKey) {	
				if(x > 0) { --x }
				else if(y > 0) { --y; x=8 }
			} 
			else {
				if(x < 8) { ++x }
				else if(y < 8) { ++y; x=0 }
			}
	}

	let n = gebi(''+x+y)
	n.focus()
	event.preventDefault()
}

function generateGrid(grid) {
	let t = document.createElement('table')
	grid.appendChild(t)
	for(let i = 0; i < 9; i++) {
		let row = document.createElement('tr')
		t.appendChild(row)
		for(let n = 0; n < 9; n++) {
			let td = document.createElement('td')
			var textArea = document.createElement('input')
			var newContent = document.createTextNode(' ')
			textArea.setAttribute('id', ''+n+i)
			textArea.setAttribute('type', 'tel')
			textArea.setAttribute('pattern', '/d*')

			textArea.onfocus = function(e) {
				e.target.select()
			}
			textArea.appendChild(newContent)
			td.appendChild(textArea)
			row.appendChild(td)

			let thick = '5px '
			let thin = '1px '
			let l = (n === 0 || n === 3 || n === 6) ? thick : thin
			let t = (i === 0 || i === 3 || i === 6) ? thick : thin
			let b = (i === 8) ? thick : thin
			let r = (n === 8) ? thick : thin
			td.setAttribute('style', 'border-width:'+t+r+b+l+';')
		}
	}
	gebi('00').setAttribute('autofocus', 'true')
}

function getGrid() {
	grid = []
	for(let i = 0; i < 9; i++) {
		grid.push([])
		for(let n = 0; n < 9; n++) {
			val = gebi(''+n+i).value
			grid[i].push(val)
		}
	}
	return grid
}

// put the data into the html
function setGrid(grid) {
	if(grid.length !== 9) {  // TODO better validation
		l('bad grid')
		return
	}
	for(let i = 0; i < 9; i++) {
		for(let n = 0; n < 9; n++) {
			val = grid[i][n]
			if(val.length > 1 || ss.isBlank(val)) {val = ' '}
			c = gebi(''+n+i)
			c.value = val
		}
	}
}


// "the worlds hardest sudoku"
// http://sw-amt.ws/sudoku/worlds-hardest-sudoku/xx-world-hardest-sudoku.html#introduction
let s3 = 
[["8", " ", " ", " ", " ", " ", " ", " ", " "],
 [" ", " ", "3", "6", " ", " ", " ", " ", " "],
 [" ", "7", " ", " ", "9", " ", "2", " ", " "],
 [" ", "5", " ", " ", " ", "7", " ", " ", " "],
 [" ", " ", " ", " ", "4", "5", "7", " ", " "],
 [" ", " ", " ", "1", " ", " ", " ", "3", " "],
 [" ", " ", "1", " ", " ", " ", " ", "6", "8"],
 [" ", " ", "8", "5", " ", " ", " ", "1", " "],
 [" ", "9", " ", " ", " ", " ", "4", " ", " "]]

let sample = s3
