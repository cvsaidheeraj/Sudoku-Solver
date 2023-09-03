document.addEventListener("DOMContentLoaded", () => {
    const inputSudokuGrid = document.getElementById("sudoku-grid-input");
    const solutionSudokuGrid = document.getElementById("sudoku-grid-solution");
    const solveButton = document.getElementById("solve-button");
    const clearButton = document.getElementById("clear-button");
    const outputDiv = document.getElementById("output");

    // Create a 9x9 empty Sudoku grid
    const emptyGrid = Array.from({ length: 9 }, () => Array(9).fill(null));

    // Function to render a Sudoku grid in the DOM
    function renderGrid(grid, container) {
        container.innerHTML = "";
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const cell = document.createElement("div");
                cell.classList.add("sudoku-cell");
                cell.contentEditable = true; // Allow user input
                cell.addEventListener("input", () => {
                    // Ensure cell value is a digit between 1 and 9
                    const value = cell.textContent;
                    if (/^[1-9]$/.test(value)) {
                        grid[row][col] = parseInt(value, 10);
                    } else {
                        cell.textContent = "";
                        grid[row][col] = null;
                    }
                });
                if (grid[row][col] !== null) {
                    cell.textContent = grid[row][col];
                }
                container.appendChild(cell);
            }
        }
    }

    // Function to check if a Sudoku board is valid
    function isValidSudoku(board) {
        // Check rows and columns
        for (let i = 0; i < 9; i++) {
            const rowSet = new Set();
            const colSet = new Set();
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== null && rowSet.has(board[i][j])) {
                    return false; // Duplicate in row
                }
                if (board[j][i] !== null && colSet.has(board[j][i])) {
                    return false; // Duplicate in column
                }
                rowSet.add(board[i][j]);
                colSet.add(board[j][i]);
            }
        }

        // Check 3x3 subgrids
        for (let blockRow = 0; blockRow < 9; blockRow += 3) {
            for (let blockCol = 0; blockCol < 9; blockCol += 3) {
                const subgridSet = new Set();
                for (let i = blockRow; i < blockRow + 3; i++) {
                    for (let j = blockCol; j < blockCol + 3; j++) {
                        if (board[i][j] !== null && subgridSet.has(board[i][j])) {
                            return false; // Duplicate in subgrid
                        }
                        subgridSet.add(board[i][j]);
                    }
                }
            }
        }

        return true;
    }

    // Function to check if a value can be placed in a cell
    function isValid(board, row, col, num) {
        for (let i = 0; i < 9; i++) {
            if (board[row][i] === num || board[i][col] === num) {
                return false;
            }
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (board[i][j] === num) {
                    return false;
                }
            }
        }

        return true;
    }

    // Function to solve Sudoku using backtracking
    function solveSudoku(board) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === null) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solveSudoku(board)) {
                                return true;
                            }
                            board[row][col] = null;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Event listener for the solve button
    solveButton.addEventListener("click", () => {
        const inputGrid = Array.from({ length: 9 }, (_, row) =>
            Array.from(inputSudokuGrid.querySelectorAll(".sudoku-cell"))
                .slice(row * 9, (row + 1) * 9)
                .map((cell) => (cell.textContent === "" ? null : parseInt(cell.textContent, 10)))
        );

        // Create a copy of the input grid to solve
        const solvedGrid = inputGrid.map((row) => [...row]);

        if (solveSudoku(solvedGrid)) {
            renderGrid(solvedGrid, solutionSudokuGrid);
            outputDiv.textContent = "Sudoku solved!";
        } else {
            renderGrid(emptyGrid, solutionSudokuGrid); // Clear solution grid
            outputDiv.textContent = "Invalid Sudoku!";
        }
    });

    // Event listener for the clear button
    clearButton.addEventListener("click", () => {
        renderGrid(emptyGrid, inputSudokuGrid);
        renderGrid(emptyGrid, solutionSudokuGrid);
        outputDiv.textContent = ""; // Clear the message

        // Clear all input values
        Array.from(document.querySelectorAll(".sudoku-cell")).forEach((cell) => {
            cell.textContent = "";
        });
    });


    // Initialize the input grid with empty cells
    renderGrid(emptyGrid, inputSudokuGrid);
});
