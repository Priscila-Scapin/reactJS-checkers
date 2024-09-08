import BoardTile from './components/BoardTile';
import Board from './components/Board';
import Piece from './components/Piece';
import { RecoilRoot } from 'recoil';
import './App.css';

function App() {
  return (
    <RecoilRoot>
      <div className="App">
        <header className="App-header">
          <Board />
        </header>
      </div>
    </RecoilRoot>
  );
}

export default App;
