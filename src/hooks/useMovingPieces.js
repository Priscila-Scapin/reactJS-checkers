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
  // checkMissedCaptures,
  checkAdjacentTilesContent,
  checkAdjacentTilesEmptiness,
} = movingPiecesRulesValidations;

const useMovingPiecesEngine = (notify, setShowCaptureAnimation) => {
  const moveSound = new Audio('./placingPieceSoundEffect.wav');
  const captureSound = new Audio('./214018-8bit-explosion-6.wav');
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
    if (currentPlayer?.name === 'Player 1') {
      setOpponent({ piece: 'b', name: 'Player 2' });
    } else {
      setOpponent('w');
    }
  };

  const handleSimpleMove = (selectedPiece, selectedTile, captured) => {
    if (currentPlayer?.piece === selectedPiece?.pieceColor && !movedPiece) {
      if (selectedPiece && selectedTile && selectedTile?.content === null) {
        const isMovingDiagonally = isMovementValid(
          selectedPiece,
          selectedTile,
          notify
        );
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
          console.log('AQUIIIII', captured);
          notify('❌ FORBIDDEN: Movement must be diagonal');
        }
      }
    }
    if (currentPlayer?.piece !== selectedPiece?.pieceColor) {
      notify('FORBIDDEN: await for your turn');
      console.log('Invalid Move: Moving diagonally is required');
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
    console.log('CAP', captured);
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

  const countPieces = (boardState, currentPlayer) => {
    const piecesWithPositions = boardState.flatMap((row, rowIndex) =>
      row
        .map((piece, colIndex) => {
          if (piece === currentPlayer?.piece) {
            return { rowIndex, colIndex, piece };
          }
          return null;
        })
        .filter((item) => item !== null)
    );

    console.log('teste', piecesWithPositions);
    return piecesWithPositions;
  };

  const checkingMissedCaptures = (selectedPiece, selectedTile, boardState) => {
    const numRows = boardState.length;
    const numCols = boardState[0].length;
    const allPieces = countPieces(boardState, currentPlayer);

    const adjacentOpponentPieces = allPieces?.map((piece) =>
      checkAdjacentTilesContent(piece, piece, boardState)
    );

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

  const removePieceDueLeftCapture = (leftCaptures) => {
    const newBoardState = boardState.map((row) => [...row]);
    if (leftCaptures) {
      newBoardState[selectedPiece.rowIndex][selectedPiece.colIndex] = null;
      setBoardState(newBoardState);
    }
  };

  const handleKingCapture = (selectedPiece, selectedTile) => {
    const newBoardState = boardState.map((row) => [...row]);

    const adjacentOpponentPieces = checkAdjacentTilesContent(
      selectedPiece,
      selectedTile,
      boardState
    );
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
            captureSound.play();
            setShowCaptureAnimation(true);

            setTimeout(() => {
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
    turnedIntoKing(selectedPiece, boardState, setBoardState);
  }, [currentPlayer]);

  const movingPiecesEngine = (selectedPiece, selectedTile) => {
    handleCapture(selectedPiece, selectedTile);
  };

  return { movingPiecesEngine };
};

export default useMovingPiecesEngine;
