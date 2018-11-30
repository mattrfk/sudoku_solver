;'use strict';

function l(msg) { console.log(msg) }

function SudokuSolver() {

	const Interface = {
		solve: solve,
		isBlank: isBlank,
		isValid: isValid,
		isSolved: isSolved,
	}

	let solveCycles = 0 // for logging

	// take a grid that is a 9x9 2D array
	// with either single digit or blank represented by 
	// a space ' '
	function solve(grid) {
		// initialize with options
		for(let i = 0; i < 9; i++) {
			for(let n = 0; n < 9; n++) {
				if(isBlank(grid[i][n])) {
					grid[i][n] = '123456789'
				}
			}
		}

		let t1 = Date.now()

		grid = solver(grid) // do the magic

		t2 = Date.now()

		l('time to solve ' + (t2 - t1) / 1000 + 's')
		l('tries ' + solveCycles)
		solveCycles = 0

		return solver(grid)
	}

	function isBlank(c) {
		if(c === ' ' || c === ''  || c === '0' ) { 
			return true }
		return false
	}

	function solver(g) {
		solveCycles++
		// success or failure, either way we are done
		if(!isValid(g)) { return g }	
			
		let grid = doEliminations(g)
		
		if(!isSolved(grid) && isValid(grid)) { // need to guess
			let saved = copyGrid(grid) // save state before guessing
			
			x = findPossibilities(grid)
			while(x !== null) {
				let e = grid[x.i][x.n]
				
				// Pop the last possibility and try it,
				grid[x.i][x.n] = e.slice(-1) 		
				saved[x.i][x.n] = e.slice(0,-1) // store the remainders in saved.
				grid = solver(grid)         // Recursively try this guess.

				// if we got an invalid grid then start over
				if(!isValid(grid)) { 
					grid = copyGrid(saved) 
				}
				x = findPossibilities(grid)
			}
		}
		
		// if here, then there are no more guesses to make;
		// it is either solved or we are stuck
		return grid
	}

	function findPossibilities(grid) {
		let shortest = 9
		let coordinates = null
		for(let i = 0; i < 9; i++) { 
			for(let n = 0; n < 9; n++) {
				let len = grid[i][n].length
				if(len > 1) {
					if(len === 2) {
						return {i:i, n:n}
					}
					else if( len < shortest ) {
						shortest = len
						coordinates = {i:i, n:n}
					}
				}
			}
		}
		return coordinates
	}

	// for each place with possibilities, 
	// check its row, column and square and make eliminations
	function doEliminations(g) {

		// eliminate possibilities in el using certainties in arr
		function elim(arr, el) {
			if(el.length === 1) { // no more eliminations to make here
				return el
			}
			for(let i=0; i < arr.length; i++) {
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
			for(let i = 0; i < 9; i++) {
				for(let n = 0; n < 9; n++) {
					let val = grid[i][n]
					val = elim(getSquare(grid, i, n), val) //square
					val = elim(getColumn(grid, n), val) //column
					val = elim(grid[i], val) //row
					grid[i][n] = val
				}
			}
		} while(!gridsEqual(oldGrid, grid)) // nothing has changed, move on
		return grid
	}

	// return true even if incomplete but everything checks out
	function isValid(g) {
		// check for duplicates
		function checkDup(arr) {
			let c = ''
			for(let i=0; i<arr.length; i++) {
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
		for(let i=0; i<9; i++) { 
			for(let n=0; n<9; n++) {
				if(g[i][n].length < 1) { 
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

		for(let s in getSquares(g)) {
			if(!checkDup(s)) { 
				return false 
			}
		}

		return true
	}

	function isSolved(g) {
		let f = (x,y) => (Number(x) + Number(y))

		for(let i = 0; i < 9; i++) {
			if(g[i].reduce(f) !== 45) { 
				return false 
			}
			if(getColumn(g, i).reduce(f) !== 45) { 
				return false 
			}
		}

		let sqs = getSquares(g)
		for(let i in sqs) {
			if(sqs[i].reduce(f) !== 45) { 
				return false 
			}
		}

		return true
	}

	function copyGrid(g) {
		gnew = []
		for(let i = 0; i < g.length; i++) {
			gnew.push([])
			for(let n = 0; n < g.length; n++) {
				gnew[i].push(g[i][n])
			}
		}
		return gnew
	}

	function gridsEqual(g1, g2) {
		for(let i = 0; i < g1.length; i++) {
			for(let n = 0; n < g1.length; n++) {
				if( g1[i][n] !== g2[i][n] ) return false
			}
		}
		return true
	}

	function getColumn(grid, x) {
		let col = []
		for(let i = 0; i < 9; i++) {
			col.push(grid[i][x])
		}
		return col
	}

	function getSquares(g) {
		let squares = []
		for(let i = 0; i < 2; i += 3) {
			for(let n = 0; n < 2; n += 3) {
				squares.push(getSquare(g, i, n))
			}
		}
		return squares
	}

	function getSquare(grid, i, n) {
		const x1 = 3 * Math.floor(i/3)
		const y1 = 3 * Math.floor(n/3)
		const x2 = 3 + x1
		const y2 = 3 + y1

		let box = []
		for(let x = x1; x < x2; x++) {
			for(let y = y1; y < y2; y++) {
				box.push(grid[x][y])
			}
		}
		return box
	}

	return Interface
}
