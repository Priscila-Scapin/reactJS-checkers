const isMovementValid = (selectedPiece, selectedTile, board) => {
  const pieceColor = selectedPiece.pieceColor || selectedPiece.value;
  const numRows = board?.length;
  const numCols = board?.length;

  const isOnBoard = (rowIndex, colIndex) => {
    return (
      rowIndex >= 0 && rowIndex < numRows && colIndex >= 0 && colIndex < numCols
    );
  };

  const getTileValue = (rowIndex, colIndex) => {
    return isOnBoard(rowIndex, colIndex) ? board[rowIndex][colIndex] : null;
  };

  const isPathClear = (start, end) => {
    const rowStep = end.rowIndex > start.rowIndex ? 1 : -1;
    const colStep = end.colIndex > start.colIndex ? 1 : -1;

    let row = start.rowIndex + rowStep;
    let col = start.colIndex + colStep;

    while (row !== end.rowIndex && col !== end.colIndex) {
      if (getTileValue(row, col) !== null) {
        return false;
      }
      row += rowStep;
      col += colStep;
    }
    return true;
  };

  switch (pieceColor) {
    case 'w':
      if (
        (selectedTile.rowIndex === selectedPiece.rowIndex + 1 &&
          selectedTile.colIndex === selectedPiece.colIndex + 1) ||
        (selectedTile.rowIndex === selectedPiece.rowIndex + 1 &&
          selectedTile.colIndex === selectedPiece.colIndex - 1)
      ) {
        return (
          getTileValue(selectedTile.rowIndex, selectedTile.colIndex) === null
        );
      }
      return false;

    case 'b':
      if (
        (selectedTile.rowIndex === selectedPiece.rowIndex - 1 &&
          selectedTile.colIndex === selectedPiece.colIndex + 1) ||
        (selectedTile.rowIndex === selectedPiece.rowIndex - 1 &&
          selectedTile.colIndex === selectedPiece.colIndex - 1)
      ) {
        return (
          getTileValue(selectedTile.rowIndex, selectedTile.colIndex) === null
        );
      }
      return false;

    case 'bKing':
    case 'wKing':
      if (
        Math.abs(selectedPiece.rowIndex - selectedTile.rowIndex) ===
        Math.abs(selectedPiece.colIndex - selectedTile.colIndex)
      ) {
        return isPathClear(selectedPiece, selectedTile);
      }
      return false;

    default:
      return false;
  }
};

const checkAdjacentTilesEmptiness = (selectedPiece, board) => {
  const { rowIndex, colIndex } = selectedPiece.position;
  const pieceValue = selectedPiece.value;
  const directions =
    pieceValue === 'b'
      ? [
          [1, 1],
          [1, -1],
        ]
      : [
          [-1, 1],
          [-1, -1],
        ];

  const emptyTiles = directions.reduce((acc, [rowOffset, colOffset]) => {
    const adjacentTile = {
      rowIndex: rowIndex + rowOffset,
      colIndex: colIndex + colOffset,
    };

    const tileValue =
      board[adjacentTile.rowIndex]?.[adjacentTile.colIndex] ?? null;

    if (tileValue === null) {
      acc.push({
        position: adjacentTile,
        value: tileValue,
      });
    }

    return acc;
  }, []);

  return emptyTiles.length > 0 ? emptyTiles : null;
};

const turnedIntoKing = (selectedPiece, boardState, setBoardState) => {
  const newBoardState = boardState?.map((row) => [...row]);

  switch (selectedPiece?.pieceColor) {
    case 'w':
      if (selectedPiece?.rowIndex === 7) {
        newBoardState[selectedPiece.rowIndex][selectedPiece.colIndex] = 'wKing';
        setBoardState(newBoardState);
        return true;
      }
      break;

    case 'b':
      if (selectedPiece?.rowIndex === 0) {
        newBoardState[selectedPiece.rowIndex][selectedPiece.colIndex] = 'bKing';
        setBoardState(newBoardState);
        return true;
      }
      break;

    default:
      return false;
  }
};

const checkAdjacentTilesContent = (selectedPiece, selectedTile, board) => {
  const pieceColor = selectedPiece.pieceColor || selectedPiece.value;
  const numRows = board.length;
  const numCols = board[0].length;

  const isPieceOnBoard = (rowIndex, colIndex) => {
    return (
      rowIndex >= 0 && rowIndex < numRows && colIndex >= 0 && colIndex < numCols
    );
  };

  const getAdjacentTile = (rowOffset, colOffset) => {
    const adjacentTile = {
      rowIndex: selectedTile.rowIndex + rowOffset,
      colIndex: selectedTile.colIndex + colOffset,
    };

    if (!isPieceOnBoard(adjacentTile.rowIndex, adjacentTile.colIndex)) {
      return null;
    }

    const tileValue = board[adjacentTile.rowIndex]?.[adjacentTile.colIndex];

    return tileValue !== pieceColor && tileValue !== null
      ? { position: adjacentTile, value: tileValue }
      : null;
  };

  let opponentPieces = {};

  switch (pieceColor) {
    case 'b': {
      const rightOpponent = getAdjacentTile(-1, 1);
      const leftOpponent = getAdjacentTile(-1, -1);

      if (rightOpponent) {
        opponentPieces['right'] = rightOpponent;
      }
      if (leftOpponent) {
        opponentPieces['left'] = leftOpponent;
      }
      break;
    }

    case 'bKing': {
      const rightOpponent = getAdjacentTile(-1, 1);
      const leftOpponent = getAdjacentTile(-1, -1);

      if (rightOpponent) {
        opponentPieces['right'] = rightOpponent;
      }
      if (leftOpponent) {
        opponentPieces['left'] = leftOpponent;
      }
      break;
    }

    case 'w': {
      const rightOpponent = getAdjacentTile(1, 1);
      const leftOpponent = getAdjacentTile(1, -1);

      if (rightOpponent) {
        opponentPieces['right'] = rightOpponent;
      }
      if (leftOpponent) {
        opponentPieces['left'] = leftOpponent;
      }

      break;
    }

    case 'wKing': {
      const rightOpponent = getAdjacentTile(1, 1);
      const leftOpponent = getAdjacentTile(1, -1);

      if (rightOpponent) {
        opponentPieces['right'] = rightOpponent;
      }
      if (leftOpponent) {
        opponentPieces['left'] = leftOpponent;
      }

      break;
    }

    default:
      return null;
  }

  return Object.keys(opponentPieces).length > 0 ? opponentPieces : null;
};

const findCapturedPiece = (selectedPiece, selectedTile, board) => {
  const rowDiff = selectedTile.rowIndex - selectedPiece.rowIndex;
  const colDiff = selectedTile.colIndex - selectedPiece.colIndex;

  const capturedRowIndex = selectedPiece.rowIndex + rowDiff / 2;
  const capturedColIndex = selectedPiece.colIndex + colDiff / 2;

  if (
    capturedRowIndex >= 0 &&
    capturedRowIndex < board.length &&
    capturedColIndex >= 0 &&
    capturedColIndex < board[0].length
  ) {
    const capturedPiece = board[capturedRowIndex][capturedColIndex];

    if (capturedPiece && capturedPiece !== selectedPiece.pieceColor) {
      return {
        position: { rowIndex: capturedRowIndex, colIndex: capturedColIndex },
        value: capturedPiece,
      };
    }
  }

  return null;
};

const getValidCaptures = (positionsArray, selectedTile) =>
  positionsArray?.filter(
    (item) =>
      item?.rowIndex === selectedTile?.rowIndex &&
      item?.colIndex === selectedTile?.colIndex
  );

const checkMissedCaptures = (pieces, board, currentPlayer) => {
  const opponentColor = currentPlayer === 'b' ? 'w' : 'b';
  const numRows = board.length;
  const numCols = board[0].length;

  const isTileEmpty = (rowIndex, colIndex) => {
    return (
      rowIndex >= 0 &&
      rowIndex < numRows &&
      colIndex >= 0 &&
      colIndex < numCols &&
      board[rowIndex][colIndex] === null
    );
  };

  const getAdjacentTiles = (rowIndex, colIndex) => {
    return [
      { rowIndex: rowIndex - 1, colIndex: colIndex - 1 },
      { rowIndex: rowIndex - 1, colIndex: colIndex + 1 },
      { rowIndex: rowIndex + 1, colIndex: colIndex - 1 },
      { rowIndex: rowIndex + 1, colIndex: colIndex + 1 },
    ];
  };

  const checkCapturePossibility = (piece) => {
    const { rowIndex, colIndex } = piece.position;

    const adjacentTiles = getAdjacentTiles(rowIndex, colIndex);

    for (const tile of adjacentTiles) {
      const tileValue = board[tile.rowIndex]?.[tile.colIndex];
      if (tileValue === opponentColor) {
        const landingTile = {
          rowIndex: tile.rowIndex + (tile.rowIndex - rowIndex),
          colIndex: tile.colIndex + (tile.colIndex - colIndex),
        };

        if (isTileEmpty(landingTile.rowIndex, landingTile.colIndex)) {
          return {
            piece,
            opponentTile: tile,
            landingTile: landingTile,
          };
        }
      }
    }

    return null;
  };

  const missedCaptures = [];

  pieces.forEach((piece) => {
    if (piece.color === currentPlayer) {
      const capture = checkCapturePossibility(piece);
      if (capture) {
        missedCaptures.push(capture);
      }
    }
  });

  return missedCaptures.length > 0 ? missedCaptures : null;
};

const movingPiecesRulesValidations = {
  turnedIntoKing,
  isMovementValid,
  getValidCaptures,
  findCapturedPiece,
  checkMissedCaptures,
  checkAdjacentTilesContent,
  checkAdjacentTilesEmptiness,
};

export default movingPiecesRulesValidations;
