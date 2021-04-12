var gBoard;
var gGridSize = 20;
var slider = document.getElementById("slider");
var gSpeed = 500 - slider.value;
var gameIsOn = false;
var  gInterval;

function init() {
  gBoard = buildBoard();
  renderBoard(gBoard);

  initShapeRpentamino();
}

function initShapeRpentamino() {
  renderCell(8, 9, "X");
  renderCell(9, 9, "X");
  renderCell(9, 10, "X");
  renderCell(10, 8, "X");
  renderCell(10, 9, "X");
  gBoard[8][9].isAlive = true;
  gBoard[9][9].isAlive = true;
  gBoard[9][10].isAlive = true;
  gBoard[10][8].isAlive = true;
  gBoard[10][9].isAlive = true;
  renderBoard(gBoard);
}

function playGen() {
  if (gameIsOn) {
    clearInterval(gInterval);
  }
  gameIsOn = true;
  gInterval = setInterval(function () {
    gSpeed = 500 - slider.value;
    gBoard = runGeneration(gBoard);
    renderBoard(gBoard);
  }, gSpeed);
}

function stopGen() {
  clearInterval(gInterval);
  gameIsOn = false;
}

function runGeneration(board) {
  var duppBoard = JSON.parse(JSON.stringify(board)); //שיבוט הלוח במקום העתקה
  for (var i = 0; i < gGridSize; i++) {
    for (var j = 0; j < gGridSize; j++) {
      var currCell = board[i][j];
      var neighbours = checkNeighbours(i, j, board);
      if (currCell.isAlive) {
        //האם התא חי
        if (neighbours < 2 || neighbours > 3) {
          duppBoard[i][j].isAlive = false;
        } else {
          // 2 or 3 neighbours
          duppBoard[i][j].isAlive = true;
        }
      } else {
        // האם התא מת
        if (neighbours !== 3) {
          duppBoard[i][j].isAlive = false;
        } else {
          duppBoard[i][j].isAlive = true;
        }
      }
    }
  }

  return duppBoard;
}

function buildBoard() {
  // בונה את הלוח במודל
  var board = [];
  for (var i = 0; i < gGridSize; i++) {
    board[i] = [];
    for (let j = 0; j < gGridSize; j++) {
      board[i][j] = {
        neighbours: 0,
        isAlive: false,
      };
    }
  }
  //   console.table(board);
  return board;
}

function renderBoard(board) {
  // מרנדרת את הלוח בדום

  var elBoard = document.querySelector(".board");
  var strHTML = "";
  for (var i = 0; i < gGridSize; i++) {
    strHTML += "<tr>\n";
    for (var j = 0; j < gGridSize; j++) {
      strHTML += `\t<td class="`;
      var currCell = board[i][j];
      var cellClass = getClassName(i, j);
      if (currCell.isAlive) {
        strHTML += "alive ";
      }
      strHTML += ` cell ${cellClass}" onclick="cellClicked(${i},${j})"> 
      \n${" "} </td>`;
    }
    strHTML += "\n</tr>\n";
  }
  elBoard.innerHTML = strHTML;
  //   console.table(board);
}

function checkNeighbours(cellI, cellJ, board) {
  // בודקת האם השכנים הם פצצות
  var neighbours = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isAlive) neighbours++;
    }
  }
  //console.log(neighbours);
  return neighbours;
}

function getClassName(i, j) {
  var cellClass = "cell-" + i + "-" + j;
  return cellClass;
}

function cellClicked(i, j) {
  if (gBoard[i][j].isAlive) {
    gBoard[i][j].isAlive = false;
    renderCell(i, j, " ");
  } else {
    gBoard[i][j].isAlive = true;
    renderCell(i, j, "X");
  }
}

function renderCell(i, j, value) {
  var elCell = document.querySelector(".cell-" + i + "-" + j);
  if (value === "X") {
    elCell.classList.add("alive");
    // elCell.style.backgroundColor = "black";
  } else {
    elCell.classList.remove("alive");

    // elCell.style.backgroundColor = "white";
  }

  //   elCell.innerText = `${value}`;
}
