import { useState, useEffect, useMemo ,useRef} from "react";
import Confetti from "react-confetti";
import "./App.css";

const gameIcons = ["✌️", "👍", "🦷", "🦴", "😍", "😘", "😁", "👽", "🤖"];

function App() {
  const [pieces, setPices] = useState([]);
  const [difficulty,setDifficulty]=useState("easy");

  let timeout=useRef();


  const easyIcons=gameIcons.slice(0,4);
  const mediumIcons=gameIcons.slice(0,6);
  const hardIcons=gameIcons;


  const iconsToUse=useMemo(()=>{
    if(difficulty==="easy") return easyIcons;
    if(difficulty==="medium") return mediumIcons;
    return hardIcons;
  },[difficulty]);

  

  const isGameCompleted = useMemo(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.solved)) {
      return true;
    }
    return false;
  }, [pieces]);

  const startGame = () => {
    const duplicateGameIcons = iconsToUse.concat(iconsToUse);
    const newGameIcons = [];
    while (newGameIcons.length < iconsToUse.length * 2) {
      const randomIndex = Math.floor(Math.random() * duplicateGameIcons.length);
      newGameIcons.push({
        emoji: duplicateGameIcons[randomIndex],
        flipped: false,
        solved: false,
        position: newGameIcons.length,
      });
      duplicateGameIcons.splice(randomIndex, 1);
    }

    setPices(newGameIcons);
  };

  useEffect(() => {
    startGame();
  }, [iconsToUse]);

  const handleActive = (data) => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData === 2) return;
    const newPieces = pieces.map((piece) => {
      if (piece.position === data.position) {
        piece.flipped = !piece.flipped;
      }
      return piece;
    });
    setPices(newPieces);
  };

  const gameLogicForFlipped = () => {
    const flippedData = pieces.filter((data) => data.flipped && !data.solved);
    if (flippedData.length === 2) {
    timeout.current=setTimeout(() => {
        setPices(
          pieces.map((data) => {
              if (
                data.position === flippedData[0].position ||
                data.position === flippedData[1].position
              ) {
                if (flippedData[0].emoji === flippedData[1].emoji) {
                data.solved = true;
              }
              else{
                data.flipped = false;
              }
            }
              return data;
          })
        );
      }, 800);
    }
  };

  useEffect(() => {
    gameLogicForFlipped();

    return ()=>{
      clearTimeout(timeout.current)
    };
  }, [pieces]);

  const restartGame=()=>{
    setPices([]);
    startGame();
  }

  return (
    <main>
      <h1>Memory Game </h1>
      <div className="difficulty-selector">
        <label>Difficulty:</label>
        <select value={difficulty} onChange={(e)=>setDifficulty(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>


        </select>
      </div>
      <div className={`container ${difficulty==="easy"? "easy":""}`}>
        {pieces.map((data, index) => (
          <div
            className={`flip-card ${
              data.flipped || data.solved ? "active" : ""
            }`}
            key={index}
            onClick={() => handleActive(data)}
          >
            <div className="flip-card-inner">
              <div className="flip-card-front" />
              <div className="flip-card-back">{data.emoji}</div>
            </div>
          </div>
        ))}
      </div>

      {isGameCompleted && (
        <div className="game-completed">
          <h1>YOU WIN!!!</h1>
          <Confetti width={window.innerWidth} height={window.innerHeight} />
          <button onClick={restartGame}>Restart Game</button>
        </div>
      )}
    </main>
  );
}

export default App;
