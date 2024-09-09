import React from 'react'; // Certifique-se de importar o React
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react';
import { RecoilRoot } from 'recoil';
import useMovingPiecesEngine from '../../../hooks/useMovingPieces';

describe('useMovingPiecesEngine', () => {
  it('should handle piece movement correctly', () => {
    const { result } = renderHook(() => useMovingPiecesEngine(), {
      wrapper: RecoilRoot,
    });

    // Verifique se o hook retorna handleMove corretamente
    const { movingPiecesEngine, handleMove } = result.current;

    // Mock the pieces and tiles
    const selectedPiece = { rowIndex: 2, colIndex: 3, pieceColor: 'b' };
    const selectedTile = { rowIndex: 4, colIndex: 5, content: null };

    // Mock the required functions
    jest
      .spyOn(result.current.movingPiecesEngine, 'handleMove')
      .mockImplementation(() => {});

    // Act - Call the function under test
    act(() => {
      movingPiecesEngine(selectedPiece, selectedTile);
    });

    // Assertions - Validate if the expected actions were performed
    expect(handleMove).toHaveBeenCalledWith(selectedPiece, selectedTile);
  });
});
