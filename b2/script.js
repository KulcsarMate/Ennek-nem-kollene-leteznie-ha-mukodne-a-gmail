let timeAttack = 0;
let foundAmount;
let solutionGrid;
let stepCounter;
let totalShipCells = 0;
let foundShipCells = 0;
let gameOver;
let gameBoard;
let stepCounterSpan;
const GRID_SIZE = 12;
const SHIP_DEFINITIONS = [
    // Rajz: [ ][█][█]
    //       [█][█][ ]
    { id: 1, shape: [[0, 1, 1], [1, 1, 0]] },
    
    // Rajz: [█][█][█]
    //       [ ][ ][█]
    { id: 2, shape: [[1, 1, 1], [0, 0, 1]] },
    
    // Rajz: [█][█][█][█]
    { id: 3, shape: [[1, 1, 1, 1]] },
    
    // Rajz: [█][█]
    //       [█][█]
    { id: 4, shape: [[1, 1], [1, 1]] },
    
    // Rajz: [ ][█][ ]
    //       [█][█][█]
    { id: 5, shape: [[0, 1, 0], [1, 1, 1]] },
    
    // Rajz: [█][█][ ]
    //       [ ][█][█]
    { id: 6, shape: [[1, 1, 0], [0, 1, 1]] },
    
    // Rajz: [ ][ ][█]
    //       [█][█][█]
    { id: 7, shape: [[0, 0, 1], [1, 1, 1]] }
];

const gameWinMessage = document.getElementById('game-win-message');
const gameLoseMessage = document.getElementById('game-lose-message');

function rotateShape(shape) {
    const rows = shape.length;
    const cols = shape[0].length;
    const newShape = Array(cols).fill(0).map(() => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            newShape[c][rows - 1 - r] = shape[r][c];
        }
    }
    return newShape;
}

function isValidPlacement(shape, startRow, startCol) {
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[0].length; c++) {
            if (shape[r][c] === 1) {
                const gridRow = startRow + r;
                const gridCol = startCol + c;

                if (gridRow >= GRID_SIZE || gridCol >= GRID_SIZE) {
                    return false;
                }

                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        const checkRow = gridRow + dr;
                        const checkCol = gridCol + dc;

                        if (checkRow >= 0 && checkRow < GRID_SIZE && checkCol >= 0 && checkCol < GRID_SIZE) {
                            if (solutionGrid[checkRow][checkCol] !== 0) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}

function placeShips() {
    for (const ship of SHIP_DEFINITIONS) {
        let placed = false;
        while (!placed) {
            let currentShape = ship.shape;
            const rotationCount = Math.floor(Math.random() * 4);
            for (let i = 0; i < rotationCount; i++) {
                currentShape = rotateShape(currentShape);
            }

            const startRow = Math.floor(Math.random() * GRID_SIZE);
            const startCol = Math.floor(Math.random() * GRID_SIZE);
            
            if (isValidPlacement(currentShape, startRow, startCol)) {
                for (let r = 0; r < currentShape.length; r++) {
                    for (let c = 0; c < currentShape[0].length; c++) {
                        if (currentShape[r][c] === 1) {
                            solutionGrid[startRow + r][startCol + c] = ship.id;
                            totalShipCells++;
                        }
                    }
                }
                placed = true;
            }
        }
    }
}

function createGameBoardHTML() {
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}


function calculateMinDistance(probeRow, probeCol) {
    let minDistance = Infinity;
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (solutionGrid[r][c] !== 0) {
                const distance = Math.abs(r - probeRow) + Math.abs(c - probeCol);
                if (distance < minDistance) {
                    minDistance = distance;
                }
            }
        }
    }
    return minDistance;
}

function handleCellClick(event) {
    if (gameOver) return;

    const cell = event.target;
    if (cell.textContent !== '' || cell.classList.contains('hit')) {
        return;
    }
    
    stepCounter += timeAttack ? -1 : 1;
    stepCounterSpan.textContent = stepCounter;

    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const cellValue = solutionGrid[row][col];

    if (cellValue !== 0) {
        cell.classList.add('hit');
        foundShipCells++;
        
        foundAmount[cellValue-1]++;
        if (foundShipCells === totalShipCells) {
            gameOver = true;
            document.getElementById("game-end").style.display= "block";
            gameWinMessage.style.display = 'block';
        }
        if (foundAmount[cellValue-1] == 4) {
            stepCounter += 7;
            stepCounterSpan.textContent = stepCounter;
        }
        if (stepCounter == 0) {
            gameOver = true;
            document.getElementById("game-end").style.display= "block";
            gameLoseMessage.style.display = 'block';
        }
    } else {
        cell.classList.add('miss');
        const distance = calculateMinDistance(row, col);
        cell.textContent = distance;
    }
}

function initGame(mode = 0) {
    gameOver = false;
    timeAttack = mode;
    foundAmount = [0,0,0,0,0,0,0]
    gameBoard = document.querySelectorAll('.game-board')[timeAttack];
    stepCounterSpan = document.querySelectorAll('.step-counter')[timeAttack];
    gameBoard.innerHTML = "";
    stepCounter = mode == 1 ? 20 : 0;
    stepCounterSpan.textContent = stepCounter;
    let modeName = mode == 1 ? "time-attack" : "normal";
    let otherMode = mode == 1 ? "normal" : "time-attack";
    document.getElementById("game-end").style.display= "none";
    document.getElementById(`${modeName}`).style.display= "block";
    document.getElementById(`${otherMode}`).style.display= "none";
    document.querySelector("nav").style.display = "none";
    solutionGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    
    placeShips();
    createGameBoardHTML();
    console.log("Pálya generálva. A megoldás megtekintéséhez írd be a konzolba: console.table(solutionGrid)");
}