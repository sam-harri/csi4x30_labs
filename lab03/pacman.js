document.addEventListener("DOMContentLoaded", function() {
    const createGameBtn = document.getElementById("createGameBtn");
    const moveLeftBtn = document.getElementById("moveLeftBtn");
    const moveRightBtn = document.getElementById("moveRightBtn");
    const moveUpBtn = document.getElementById("moveUpBtn");
    const moveDownBtn = document.getElementById("moveDownBtn");
    const gameBoard = document.getElementById("gameBoard");

    let game = [];
    let pacmanPosition = { x: 0, y: 0 };
    let ghostPositions = [];
    let pelletCount = 0;
    const boardSize = { rows: 10, cols: 10 };

    function createGame(rows, cols) {
        game = new Array(rows).fill(null).map(() => new Array(cols).fill("."));
        pacmanPosition = { x: Math.floor(rows / 2), y: Math.floor(cols / 2) };
        game[pacmanPosition.x][pacmanPosition.y] = "C";
        pelletCount = placePellets(rows, cols);
        placeGhosts(2);
        updateGameBoard();
        moveGhosts();
    }

    function placePellets(rows, cols) {
        let count = 0;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (game[i][j] === ".") {
                    count++;
                }
            }
        }
        return count;
    }

    function placeRandomItem(item) {
        let placed = false;
        while (!placed) {
            const randomX = Math.floor(Math.random() * boardSize.rows);
            const randomY = Math.floor(Math.random() * boardSize.cols);
            if (game[randomX][randomY] === ".") {
                game[randomX][randomY] = item;
                placed = true;
            }
        }
    }

    function placeGhosts(numGhosts) {
        ghostPositions = [];
        for (let i = 0; i < numGhosts; i++) {
            let placed = false;
            while (!placed) {
                const randomX = Math.floor(Math.random() * boardSize.rows);
                const randomY = Math.floor(Math.random() * boardSize.cols);
                if (game[randomX][randomY] === ".") {
                    game[randomX][randomY] = "^";
                    ghostPositions.push({ x: randomX, y: randomY });
                    placed = true;
                }
            }
        }
    }

    function movePacman(newX, newY) {
        if (newX >= 0 && newX < boardSize.rows && newY >= 0 && newY < boardSize.cols) {
            if (game[newX][newY] === "^") {
                alert("Game Over! You were caught by a ghost!");
                clearInterval(ghostMovementInterval);
                return;
            }
            if (game[newX][newY] === ".") {
                pelletCount--;
                if (pelletCount === 0) {
                    alert("Congratulations! You ate all the pellets!");
                    clearInterval(ghostMovementInterval);
                    return;
                }
            }
            game[pacmanPosition.x][pacmanPosition.y] = " ";
            pacmanPosition = { x: newX, y: newY };
            game[pacmanPosition.x][pacmanPosition.y] = "C";
        }
        updateGameBoard();
    }

    let ghostMovementInterval;

    function moveGhosts() {
        ghostMovementInterval = setInterval(() => {
            for (let ghost of ghostPositions) {
                let previousPos = { ...ghost };
                game[ghost.x][ghost.y] = " ";
                const direction = Math.floor(Math.random() * 4);
                switch (direction) {
                    case 0: // Up
                        ghost.x = ghost.x > 0 ? ghost.x - 1 : ghost.x;
                        break;
                    case 1: // Down
                        ghost.x = ghost.x < boardSize.rows - 1 ? ghost.x + 1 : ghost.x;
                        break;
                    case 2: // Left
                        ghost.y = ghost.y > 0 ? ghost.y - 1 : ghost.y;
                        break;
                    case 3: // Right
                        ghost.y = ghost.y < boardSize.cols - 1 ? ghost.y + 1 : ghost.y;
                        break;
                }
                if (game[ghost.x][ghost.y] === "C") {
                    alert("Game Over! You were caught by a ghost!");
                    clearInterval(ghostMovementInterval);
                    return;
                }
                if (game[ghost.x][ghost.y] === ".") {
                    game[previousPos.x][previousPos.y] = ".";
                }
                game[ghost.x][ghost.y] = "^";
            }
            updateGameBoard();
        }, 2000);
    }

    function moveLeft() {
        movePacman(pacmanPosition.x, pacmanPosition.y - 1);
    }

    function moveRight() {
        movePacman(pacmanPosition.x, pacmanPosition.y + 1);
    }

    function moveUp() {
        movePacman(pacmanPosition.x - 1, pacmanPosition.y);
    }

    function moveDown() {
        movePacman(pacmanPosition.x + 1, pacmanPosition.y);
    }

    function updateGameBoard() {
        gameBoard.innerHTML = "";
        for (let row = 0; row < game.length; row++) {
            const rowDiv = document.createElement("div");
            rowDiv.classList.add("row", "no-gutters");
            for (let col = 0; col < game[row].length; col++) {
                const cellDiv = document.createElement("div");
                cellDiv.classList.add("col", "game-cell");
                if (game[row][col] === "C") {
                    cellDiv.innerHTML = '<i class="fas fa-dot-circle"></i>';
                } else if (game[row][col] === "^") {
                    cellDiv.innerHTML = '<i class="fas fa-ghost"></i>';
                } else if (game[row][col] === "@") {
                    cellDiv.innerHTML = '<i class="fas fa-apple-alt"></i>';
                } else if (game[row][col] === ".") {
                    cellDiv.innerHTML = '<i class="fas fa-circle"></i>';
                } else {
                    cellDiv.textContent = " ";
                }
                rowDiv.appendChild(cellDiv);
            }
            gameBoard.appendChild(rowDiv);
        }
    }

    createGameBtn.addEventListener("click", function() {
        createGame(boardSize.rows, boardSize.cols);
    });

    moveLeftBtn.addEventListener("click", function() {
        moveLeft();
    });

    moveRightBtn.addEventListener("click", function() {
        moveRight();
    });

    moveUpBtn.addEventListener("click", function() {
        moveUp();
    });

    moveDownBtn.addEventListener("click", function() {
        moveDown();
    });
});
