const isMovementDiagonal = (selectedPiece, selectedTile) => {
  switch (selectedPiece?.pieceColor) {
    case 'b':
      const bRightDiagonal =
        selectedPiece?.rowIndex - 1 === selectedTile?.rowIndex &&
        selectedPiece?.colIndex + 1 === selectedTile?.colIndex;

      const bLeftDiagonal =
        selectedPiece.rowIndex - 1 === selectedTile?.rowIndex &&
        selectedPiece?.colIndex - 1 === selectedTile?.colIndex;

      if (bRightDiagonal || bLeftDiagonal) {
        return true;
      } else {
        //handleOpenModal();
        // console.log('FORBIDDEN');
        return false;
      }

    case 'w':
      const wRightDiagonal =
        selectedPiece.rowIndex + 1 === selectedTile?.rowIndex &&
        selectedPiece?.colIndex - 1 === selectedTile?.colIndex;
      const wLeftDiagonal =
        selectedPiece.rowIndex + 1 === selectedTile?.rowIndex &&
        selectedPiece?.colIndex + 1 === selectedTile?.colIndex;
      if (wRightDiagonal || wLeftDiagonal) {
        return true;
      } else {
        console.log('FORBIDDEN', selectedTile);

        return false;
      }

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

const isDestinyTileEmpty = (selectedTile) => {
  if (selectedTile?.content === null) {
    return true;
  } else {
    return false;
  }
};

const isFromSameTeamPiece = (selectedTile, board) => {
  switch (selectedTile?.content) {
    case 'b':
      const bRightAdjacentTile = {
        rowIndex: selectedTile.rowIndex - 1,
        colIndex: selectedTile.colIndex + 1,
        value:
          board[selectedTile.rowIndex - 1]?.[selectedTile.colIndex + 1] ?? null,
      };
      const bLeftAdjacentTile = {
        rowIndex: selectedTile.rowIndex - 1,
        colIndex: selectedTile.colIndex - 1,
        value:
          board[selectedTile.rowIndex - 1]?.[selectedTile.colIndex - 1] ?? null,
      };

      return {
        rightAdjacentTile: bRightAdjacentTile,
        leftAdjacentTile: bLeftAdjacentTile,
      };

    case 'w':
      const wRightAdjacentTile = {
        rowIndex: selectedTile.rowIndex + 1,
        colIndex: selectedTile.colIndex + 1,
        value:
          board[selectedTile.rowIndex + 1]?.[selectedTile.colIndex + 1] ?? null,
      };
      const wLeftAdjacentTile = {
        rowIndex: selectedTile.rowIndex + 1,
        colIndex: selectedTile.colIndex - 1,
        value:
          board[selectedTile.rowIndex + 1]?.[selectedTile.colIndex - 1] ?? null,
      };

      return {
        rightAdjacentTile: wRightAdjacentTile,
        leftAdjacentTile: wLeftAdjacentTile,
      };

    default:
      return null;
  }
};

const turnedIntoKing = (pieceColor, selectedPiece) => {
  switch (pieceColor) {
    case 'w':
      if (selectedPiece?.rowIndex === 7) {
        return true;
      }
      break;

    case 'b':
      if (selectedPiece?.rowIndex === 0) {
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

    default:
      return null;
  }

  return Object.keys(opponentPieces).length > 0 ? opponentPieces : null;
};

const checkAdjacentValuesForOpponentPieces = (adjacentTiles, selectedPiece) => {
  const cleanedFromNullAdjacents = [];

  adjacentTiles?.flatMap((tile) => {
    const rightAdjacent = tile?.rightAdjacent;
    const leftAdjacent = tile?.leftAdjacent;

    if (
      rightAdjacent?.value !== null &&
      rightAdjacent?.value !== selectedPiece?.pieceColor
    ) {
      cleanedFromNullAdjacents.push(rightAdjacent);
    } else {
      return [];
    }
    if (
      leftAdjacent?.value !== null &&
      leftAdjacent?.value !== selectedPiece.pieceColor
    ) {
      cleanedFromNullAdjacents.push(leftAdjacent);
    } else {
      return cleanedFromNullAdjacents;
    }
  });

  return cleanedFromNullAdjacents;
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

const getPlayerPieces = (playerColor, boardState) => {
  const playerPieces = [];
  for (let rowIndex = 0; rowIndex < boardState.length; rowIndex++) {
    const row = boardState[rowIndex];

    for (let colIndex = 0; colIndex < row.length; colIndex++) {
      const cell = row[colIndex];

      if (cell === playerColor) {
        playerPieces.push({
          position: { rowIndex, colIndex, pieceColor: cell },
        });
      }
    }
  }

  return playerPieces;
};

const getValidCaptures = (positionsArray, selectedTile) =>
  positionsArray?.filter(
    (item) =>
      item?.rowIndex === selectedTile?.rowIndex &&
      item?.colIndex === selectedTile?.colIndex
  );

const movingPiecesRulesValidations = {
  turnedIntoKing,
  getPlayerPieces,
  getValidCaptures,
  findCapturedPiece,
  isMovementDiagonal,
  isDestinyTileEmpty,
  isFromSameTeamPiece,
  checkAdjacentTilesContent,
  checkAdjacentTilesEmptiness,
  checkAdjacentValuesForOpponentPieces,
};

export default movingPiecesRulesValidations;
