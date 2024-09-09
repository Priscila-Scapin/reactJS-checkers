import { useRecoilState, useRecoilValue } from 'recoil';
import { useEffect, useState } from 'react';
import useTurns from './useTurns';
import boardAtom from '../atoms/board';
import playerAtom from '../atoms/player';
import winnerAtom from '../atoms/winner';
import movedPieceAtom from '../atoms/movedPiece';
import selectedPieceAtom from '../atoms/selectedPiece';
import movingPiecesRulesValidations from '../handlers/movingPiecesRulesValidations';

const {
  turnedIntoKing,
  isMovementValid,
  getValidCaptures,
  findCapturedPiece,
  checkAdjacentTilesContent,
  checkAdjacentTilesEmptiness,
} = movingPiecesRulesValidations;

const useMovingPiecesEngine = (notify, setShowCaptureAnimation) => {
  const moveSound = new Audio('./placingPieceSoundEffect.wav');
  const captureSound = new Audio('./214018-8bit-explosion-6.wav');

  const currentPlayer = useRecoilValue(playerAtom);

  const [_winner, setWinner] = useRecoilState(winnerAtom);
  const [boardState, setBoardState] = useRecoilState(boardAtom);
  const [movedPiece, setMovedPiece] = useRecoilState(movedPieceAtom);
  const [selectedPiece, setSelectedPiece] = useRecoilState(selectedPieceAtom);

  const [opponent, setOpponent] = useState();
  const [_captures, setCaptures] = useState([]);

  const getOpponent = () => {
    if (currentPlayer?.name === 'Player 1') {
      setOpponent({ piece: 'b', name: 'Player 2' });
    } else {
      setOpponent({ piece: 'w', name: 'Player 1' });
    }
  };

  const handleSimpleMove = (selectedPiece, selectedTile, captured) => {
    if (currentPlayer?.piece === selectedPiece?.pieceColor && !movedPiece) {
      if (selectedPiece && selectedTile && selectedTile?.content === null) {
        const isMovingDiagonally = isMovementValid(selectedPiece, selectedTile);

        if (isMovingDiagonally) {
          const newBoardState = boardState.map((row) => [...row]);
          newBoardState[selectedPiece.rowIndex][selectedPiece.colIndex] = null;
          newBoardState[selectedTile.rowIndex][selectedTile.colIndex] =
            selectedPiece.pieceColor;
          // checkForLeftCaptures(selectedPiece, selectedTile, boardState);
          setMovedPiece(selectedPiece);
          setBoardState(newBoardState);
          moveSound.play();
        }

        if (!isMovingDiagonally && !captured) {
          notify('❌ FORBIDDEN: Movement must be diagonal');
        }
      }
    }
    if (currentPlayer?.piece !== selectedPiece?.pieceColor) {
      notify('❌ FORBIDDEN: await your turn to start');
    }
  };

  const handleKingMove = (selectedPiece, selectedTile) => {
    if (currentPlayer?.piece === selectedPiece?.pieceColor[0] && !movedPiece) {
      const isMovementAllowed = isMovementValid(selectedPiece, selectedTile);

      if (
        selectedPiece &&
        selectedTile &&
        selectedTile?.content === null &&
        isMovementAllowed
      ) {
        const newBoardState = boardState.map((row) => [...row]);
        newBoardState[selectedPiece.rowIndex][selectedPiece.colIndex] = null;
        newBoardState[selectedTile.rowIndex][selectedTile.colIndex] =
          selectedPiece.pieceColor;
        // checkForLeftCaptures(selectedPiece, selectedTile, boardState);
        setMovedPiece(selectedPiece);
        setBoardState(newBoardState);
      }
    } else {
      console.log('invalid movement');
    }
  };

  const handleMove = (selectedPiece, selectedTile, captured) => {
    switch (selectedPiece?.pieceColor) {
      case 'b':
      case 'w':
        handleSimpleMove(selectedPiece, selectedTile, captured);

        return;

      case 'bKing':
      case 'wKing':
        handleKingMove(selectedPiece, selectedTile);
        break;

      default:
        console.log('Invalid movement');
        break;
    }
  };

  const handleCapture = (selectedPiece, selectedTile) => {
    if (currentPlayer?.piece !== selectedPiece?.pieceColor && selectedTile) {
      notify('❌ FORBIDDEN: Await your turn');
      return;
    }

    if (currentPlayer?.piece === selectedPiece?.pieceColor[0] && !movedPiece) {
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

            setShowCaptureAnimation(true);

            setTimeout(() => {
              captureSound.play();
              setShowCaptureAnimation(false);
              setBoardState(newBoardState);
              handleMove(selectedPiece, selectedTile, true);
            }, 1000);
          }
        } else {
          handleMove(selectedPiece, selectedTile, true);
        }
      } else {
        handleMove(selectedPiece, selectedTile, false);
      }
    }
  };

  const validateWinnerAndLeftCaptures = (boardState, opponent) => {
    const countOpponentPieces = boardState
      .flat()
      .filter((piece) => piece === opponent?.piece)?.length;

    console.log(
      'boardState?.length',
      boardState.map((piece) => piece)
    );
    if (opponent && countOpponentPieces === 0) {
      setWinner(currentPlayer);
    }
    // removePieceDueLeftCapture(leftCaptures);
  };

  useEffect(() => {
    getOpponent();

    turnedIntoKing(selectedPiece, boardState, setBoardState);
  }, [currentPlayer]);

  useEffect(() => {
    validateWinnerAndLeftCaptures(boardState, opponent);
  }, [opponent]);

  const movingPiecesEngine = (selectedPiece, selectedTile) => {
    handleCapture(selectedPiece, selectedTile);
  };

  return { movingPiecesEngine };
};

export default useMovingPiecesEngine;
