import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import useTurns from './useTurns';
import boardAtom from '../atoms/board';
import playerAtom from '../atoms/player';
import winnerAtom from '../atoms/winner';
import movedPieceAtom from '../atoms/movedPiece';
import selectedPieceAtom from '../atoms/selectedPiece';
import endOfTurnValidations from '../handlers/endOfTurnValidations';
import movingPiecesRulesValidations from '../handlers/movingPiecesRulesValidations';

const {
  turnedIntoKing,
  getPlayerPieces,
  getValidCaptures,
  findCapturedPiece,
  isMovementDiagonal,
  checkAdjacentTilesContent,
  checkAdjacentTilesEmptiness,
} = movingPiecesRulesValidations;

const { checkForWinner } = endOfTurnValidations;

const useMovingPiecesEngine = () => {
  const currentPlayer = useRecoilValue(playerAtom);
  const [winner, setWinner] = useRecoilState(winnerAtom);
  const [boardState, setBoardState] = useRecoilState(boardAtom);
  const [movedPiece, setMovedPiece] = useRecoilState(movedPieceAtom);
  const [selectedPiece, setSelectedPiece] = useRecoilState(selectedPieceAtom);

  const [opponent, setOpponent] = useState();
  const [captures, setCaptures] = useState([]);

  const [leftCaptures, setLeftCaptures] = useState();

  const { timeLeft } = useTurns();

  const getOpponent = () => {
    if (currentPlayer === 'w') {
      setOpponent('b');
    } else {
      setOpponent('w');
    }
  };

  const handleSimpleMove = (selectedPiece, selectedTile) => {
    if (currentPlayer === selectedPiece?.pieceColor && !movedPiece) {
      const isMovingDiagonally = isMovementDiagonal(
        selectedPiece,
        selectedTile
      );

      if (selectedPiece && selectedTile && selectedTile?.content === null) {
        // Ensure that is a 1 tile movement:
        const isOneStepMove =
          Math.abs(selectedPiece.rowIndex - selectedTile.rowIndex) === 1 &&
          Math.abs(selectedPiece.colIndex - selectedTile.colIndex) === 1;

        if (isMovingDiagonally && isOneStepMove) {
          const newBoardState = boardState.map((row) => [...row]);
          newBoardState[selectedPiece.rowIndex][selectedPiece.colIndex] = null;
          newBoardState[selectedTile.rowIndex][selectedTile.colIndex] =
            selectedPiece.pieceColor;
          checkForLeftCaptures();
          setMovedPiece(selectedPiece);
          setBoardState(newBoardState);
        } else {
          console.log(
            'Movimento inválido: O jogador só pode mover uma casa por vez.'
          );
        }
      }
    }
  };

  const checkForLeftCaptures = () => {
    const numRows = boardState.length;
    const numCols = boardState[0].length;

    const countPieces = (boardState, currentPlayer) => {
      const numRows = boardState.length;
      const numCols = boardState[0].length;

      const piecesWithPositions = boardState.flatMap((row, rowIndex) =>
        row
          .map((piece, colIndex) => {
            if (piece === currentPlayer) {
              return { rowIndex, colIndex, piece };
            }
            return null;
          })
          .filter((item) => item !== null)
      );

      return piecesWithPositions;
    };

    const isTileOnBoard = (rowIndex, colIndex) => {
      return (
        rowIndex >= 0 &&
        rowIndex < numRows &&
        colIndex >= 0 &&
        colIndex < numCols
      );
    };

    const adjacentOpponentPieces = countPieces?.map((piece) => piece);

    console.log('TEST', adjacentOpponentPieces);
    // if (adjacentOpponentPieces) {
    //   const validCaptures = Object.values(adjacentOpponentPieces)
    //     .flatMap((opponentPiece) =>
    //       checkAdjacentTilesEmptiness(opponentPiece, boardState)
    //     )
    //     ?.filter(
    //       (item) =>
    //         item !== null &&
    //         isTileOnBoard(item.position.rowIndex, item.position.colIndex)
    //     );

    //   setLeftCaptures(validCaptures);
    //   return validCaptures;
    // }
  };
  console.log('BS', boardState[0]?.length);

  const removePieceDueLeftCapture = (leftCaptures) => {
    const newBoardState = boardState.map((row) => [...row]);
    // if (leftCaptures) {
    //   newBoardState[selectedPiece.rowIndex][selectedPiece.colIndex] = null;
    //   setBoardState(newBoardState);
    // }
  };

  const handleCapture = (selectedPiece, selectedTile) => {
    if (currentPlayer === selectedPiece?.pieceColor && !movedPiece) {
      const newBoardState = boardState.map((row) => [...row]);
      const adjacentOpponentPieces = checkAdjacentTilesContent(
        selectedPiece,
        selectedPiece,
        boardState
      );
      if (adjacentOpponentPieces !== null) {
        const adjArray = Object.values(adjacentOpponentPieces);
        const checkForEmptyTilesAroundOpponent = adjArray?.map(
          (opponentPiece) =>
            checkAdjacentTilesEmptiness(opponentPiece, boardState)
        );
        const filteringArrToGetValidEmptyPositions =
          checkForEmptyTilesAroundOpponent?.flatMap((item) =>
            item
              ?.map((item) => item?.position)
              ?.filter((item) => item?.colIndex !== selectedPiece?.colIndex)
          );

        const validCapture = getValidCaptures(
          filteringArrToGetValidEmptyPositions,
          selectedTile
        );

        setCaptures(validCapture);

        if (validCapture?.length > 0) {
          const capturedPiece = findCapturedPiece(
            selectedPiece,
            selectedTile,
            boardState
          );

          setSelectedPiece({
            rowIndex: selectedTile?.rowIndex,
            colIndex: selectedTile?.colIndex,
            pieceColor: selectedPiece?.pieceColor,
          });
          if (capturedPiece) {
            newBoardState[capturedPiece.position.rowIndex][
              capturedPiece.position.colIndex
            ] = null;
            newBoardState[selectedPiece.rowIndex][selectedPiece.colIndex] =
              null;
            newBoardState[selectedTile.rowIndex][selectedTile.colIndex] =
              selectedPiece.pieceColor;
            setMovedPiece(null);
            checkForLeftCaptures(selectedPiece, selectedTile, boardState);

            setBoardState(newBoardState);
          }
        }
      } else {
        handleSimpleMove(selectedPiece, selectedTile);
        checkForLeftCaptures(selectedPiece, selectedTile, boardState);
      }
    }
  };

  const validateWinnerAndLeftCaptures = () => {
    const countOpponentPieces = boardState
      .flat()
      .filter((piece) => piece === opponent)?.length;

    if (countOpponentPieces === 0) {
      setWinner(currentPlayer);
    }
    removePieceDueLeftCapture(leftCaptures);
  };

  useEffect(() => {
    getOpponent();
    validateWinnerAndLeftCaptures();
  }, [currentPlayer]);

  const movingPiecesEngine = (selectedPiece, selectedTile) => {
    handleCapture(selectedPiece, selectedTile);
  };

  return { movingPiecesEngine };
};

export default useMovingPiecesEngine;
