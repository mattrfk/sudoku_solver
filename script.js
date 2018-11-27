function l(msg){ console.log(msg)}
function gebi(id){ return document.getElementById(id)}
let tries = 0

window.onload = function() {
	generateGrid(gebi('grid'))

	gebi('print').onclick = printTxt
	gebi('read').onclick = readTxt
	gebi('load').onclick = () => { setGrid(sample) }
	gebi('solve').onclick = solve

	document.addEventListener('keydown', keypress)
}

function printTxt(){
	let g = getGrid()
	let s = ""
	for(let i = 0; i < 9; i++){
		for(let n = 0; n < 9; n++){
			if(isBlank(g[i][n])) { 
				s += '0' 
			}

			else { s += g[i][n] }
			if(n < 8) s += ' '
		}

		if(i < 8) s += "\n"
	}

	let ta = gebi('text')
	//ta.textContent = s
	ta.value = s
}

function readTxt() {
	let ta = gebi('text')
	let button = gebi('read')
	let s = ta.value

	let grid = s.split('\n')
	for(i in grid){
		grid[i] = grid[i].split(' ')
	}

	if(isValid(grid)) { 
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
			if(event.shiftKey){	
				if(x > 0) { --x }
				else if(y > 0){ --y; x=8 }
			} 
			else {
				if(x < 8) { ++x }
				else if(y < 8){ ++y; x=0 }
			}
	}

	let n = gebi(''+x+y)
	n.focus()
	event.preventDefault()
}

function generateGrid(grid){
	let t = document.createElement('table')
	grid.appendChild(t)
	for(let i = 0; i < 9; i++) {
		let row = document.createElement('tr')
		t.appendChild(row)
		for(let n = 0; n < 9; n++){
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

function getGrid(){
	grid = []
	for(let i = 0; i < 9; i++) {
		grid.push([])
		for(let n = 0; n < 9; n++){
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
		for(let n = 0; n < 9; n++){
			val = grid[i][n]
			if(val.length > 1 || isBlank(val)) {val = ' '}
			c = gebi(''+n+i)
			c.value = val
		}
	}
}

function solve(){
	let grid = getGrid()
	// initialize with options
	for(let i = 0; i < 9; i++){
		for(let n = 0; n < 9; n++){
			if(grid[i][n] === ' '){
				grid[i][n] = '123456789'
			}
		}
	}
	
	t = Date.now()
	grid = solver(grid) // the magic method
	t2 = Date.now()

	l('time ' + (t2 - t) / 1000 + 's')
	l('tries ' + tries)
	l('empties ' + empties)
	setGrid(grid)
}

function solver(g) {
	tries++
	// success or failure, either way we are done
	if(!isValid(g)) { return g }	
		
	let grid = doEliminations(g)
	
	if(!isSolved(grid) && isValid(grid)) { // need to guess
		let saved = copyGrid(grid) // save state before guessing
		
		for(let i=0; i<9; i++) { 
			for(let n=0; n<9; n++) {
				if(grid[i][n].length > 1) { 	// find the 1st cell with possibilities
					let e = grid[i][n]
					grid[i][n] = e.slice(-1) 		// Pop the last possibility and try it,
					saved[i][n] = e.slice(0,-1) // store the remainders in saved.
					grid = solver(grid)         // Recursively try this guess.

					// if we got an invalid grid then start over
					if(!isValid(grid)) { 
						grid = copyGrid(saved) 
					}
				}
			}
		}
	}

	// if here, then there are no more guesses to make;
	// it is either solved or we are stuck
	return grid
}

// for each place with possibilities, 
// check its row, column and square and make eliminations
function doEliminations(g){

	// eliminate possibilities in el using certainties in arr
	function elim(arr, el){
		if(el.length === 1) { // no more eliminations to make here
			return el
		}
		for(let i=0; i < arr.length; i++){
			if(arr[i].length === 1) { // act only when certain
				el = el.replace(arr[i], '')
			}
		}
		return el
	}

	let grid = copyGrid(g)
	let oldGrid
	do { // keep doing eliminations until no progress is made
		oldGrid = copyGrid(grid)
		for(let i = 0; i < 9; i++){
			for(let n = 0; n < 9; n++){
				let val = grid[i][n]
				//if(val.length === 1) { continue } 
				val = elim(getSquare(grid, i, n), val) //square
				val = elim(getColumn(grid, n), val) //column
				val = elim(grid[i], val) //row
				grid[i][n] = val
			}
		}
	} while(!gridsEqual(oldGrid, grid)) // nothing has changed, move on
	return grid
}

let empties = 0
// return true even if incomplete but everything checks out
function isValid(g){
	// check for duplicates
	function checkDup(arr){
		let c = ''
		for(let i=0; i<arr.length; i++){
			if(arr[i].length === 1 && !isBlank(arr[i])) { 
				if(c.includes(arr[i])) { 
					return false 
				}
				c += arr[i]
			}
		}
		return true
	}

	// check grid for empties
	for(let i=0; i<9; i++){ 
		for(let n=0; n<9; n++){
			if(g[i][n].length < 1) { 
				empties++
				return false 
			}
		}
	}

	for(let i = 0; i < 9; i++) {
		if(!checkDup(getColumn(g,i))) { 
			return false
		}
		if(!checkDup(g[i])) { 
			return false 
		}
	}

	for(let s in getSquares(g)){
		if(!checkDup(s)) { 
			return false 
		}
	}

	return true
}

function isSolved(g){
	let f = (x,y) => (Number(x) + Number(y))

	for(let i = 0; i < 9; i++) {
		if(g[i].reduce(f) !== 45){ 
			return false 
		}
		if(getColumn(g, i).reduce(f) !== 45){ 
			return false 
		}
	}

	let sqs = getSquares(g)
	for(let i in sqs){
		if(sqs[i].reduce(f) !== 45){ 
			return false 
		}
	}

	return true
}

function copyGrid(g) {
	gnew = []
	for(let i = 0; i < g.length; i++){
		gnew.push([])
		for(let n = 0; n < g.length; n++){
			gnew[i].push(g[i][n])
		}
	}
	return gnew
}

function gridsEqual(g1, g2){
	for(let i = 0; i < g1.length; i++){
		for(let n = 0; n < g1.length; n++){
			if( g1[i][n] !== g2[i][n] ) return false
		}
	}
	return true
}

function isBlank(c){
	if(c === ' ' || c === ''  || c === '0' ) { 
		return true }
	return false
}

function getColumn(grid, x){
	let col = []
	for(let i = 0; i < 9; i++){
		col.push(grid[i][x])
	}
	return col
}

function getSquares(g) {
	let squares = []
	for(let i = 0; i < 2; i += 3){
		for(let n = 0; n < 2; n += 3){
			squares.push(getSquare(g, i, n))
		}
	}
	return squares
}

function getSquare(grid, i, n){
	const x1 = 3 * Math.floor(i/3)
	const y1 = 3 * Math.floor(n/3)
	const x2 = 3 + x1
	const y2 = 3 + y1

	let box = []
	for(let x = x1; x < x2; x++){
		for(let y = y1; y < y2; y++){
			box.push(grid[x][y])
		}
	}
	return box
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
