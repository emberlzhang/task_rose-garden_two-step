import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { practiceFlowerBeds, flowerBeds } from './flowerBeds.js';

const gardenWidth = 32 * 29; // the last number should equal number of columns in flowerBeds array
const gardenHeight = 32 * 21; // the last number should be number of rows in flowerBeds array

const intertrialinterval1 = [400, 600, 800][Math.floor(Math.random() * 3)]; // delay after stage 1 choice, before stage 2 display
const intertrialinterval2 = [400, 600, 800][Math.floor(Math.random() * 3)]; // delay after stage 2 choice, before adding rose

const App = () => {
  const [stage, setStage] = useState('intake');
  const [subjectId, setSubjectId] = useState('');
  const [garden, setGarden] = useState([]);
  const [error, setError] = useState('');
  const [roseCount, setRoseCount] = useState(0);
  const [roundCount, setRoundCount] = useState(0);
  const [isPractice, setIsPractice] = useState(true);
  const [selectedStore, setSelectedStore] = useState('');
  const [currentGardenerPair, setCurrentGardenerPair] = useState([]);
  const [selectedGardener, setSelectedGardener] = useState([]);
  const [currentBeds, setCurrentBeds] = useState(practiceFlowerBeds);
  const [highlightedRose, setHighlightedRose] = useState(null);
  const canvasRef = useRef(null);
  const [data, setData] = useState([]); // Stores game data and user choices
  const gardenerPairs = {
    pair1: ['/gardener_1A.png', '/gardener_1B.png'],
    pair2: ['/gardener_2A.png', '/gardener_2B.png']
  };
  const [keyPressEnabled, setKeyPressEnabled] = useState(false);

  const PRACTICE_ROUNDS = 10;
  const MAX_ROUNDS = 150;


  const showIntakeForm = () => (
    <div className="intake-form">
      <h2>Welcome to the Rose Garden Game</h2>
      <p>Please enter your subject ID to begin:</p>
      <input
        type="text"
        value={subjectId}
        onChange={(e) => setSubjectId(e.target.value)}
        placeholder="Enter Subject ID"
      />
      {error && <p className="error-message">{error}</p>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );

  const handleSubmit = () => {
    if (subjectId.trim() === '') {
      setError('Please enter a subject ID');
    } else {
      setError('');
      setStage('instructions');
      setData([...data, {
        timestamp: new Date().toISOString(),
        stage: 'intake',
        subjectId: subjectId
      }]);
    }
  };

  const showInstructions = () => (
    <div className="instructions">
      <h2>Instructions</h2>
      <p>
        Welcome to the Rose Garden Game! Your goal is to grow a beautiful rose garden by making strategic decisions at each stage.
      </p>
      <p>Here's how to play:</p>
      <ul>
        <li>In Stage 1, choose between two gardening stores.</li>
        <li>In Stage 2, choose between two gardeners to talk to.</li>
        <li>Based on your choices, you will receive either a yellow rose or a red rose.</li>
        <li>The rose will be added to your garden plot.</li>
        <li>You'll start with 10 practice rounds to get familiar with the game.</li>
        <li>After the practice, the real game will have 150 rounds.</li>
      </ul>
      <br></br>
      <br></br>
      <button onClick={() => setStage('stage1')}>Start Practice</button>
    </div>
  );

  const showTransitionScreen = () => (
    <div className="transition-screen">
      <h2>Practice Rounds Complete</h2>
      <p>Great job! You've completed the practice rounds.</p>
      <p>Now you're ready to start the real game, which will have 150 rounds.</p>
      <p>Press Start Game when ready!</p>
      <button onClick={() => {
        setStage('stage1');
        setIsPractice(false);
        setRoundCount(0);
        setGarden([]);
        setRoseCount(0);
        setCurrentBeds(flowerBeds); // Change flower bed configuration for real game
      }}>Start Game</button>
    </div>
  );

  const showStage1 = () => {
    setHighlightedRose(null);

    return (<div className="stage">
      <h2>Step 1: Choose a Gardening Store</h2>
      <p>Press Left Arrow for Left Store, Right Arrow for Right Store</p>
      <span>
        <img
          src="/gardenstore-red.png"
          alt="Red Garden Store"
          className={`store-image ${selectedStore === 'Store 1' ? 'selected' : ''}`}
        />
        <img
          src="/gardenstore-blue.png"
          alt="Blue Garden Store"
          className={`store-image ${selectedStore === 'Store 2' ? 'selected' : ''}`}
        />
      </span>
      <p>{isPractice ? 'Practice ' : ''}Round: {roundCount + 1} / {isPractice ? PRACTICE_ROUNDS : MAX_ROUNDS}</p>
    </div>)
  };

  const chooseStore = (store, keypress) => {
    // Set store and gardener pair
    setSelectedStore(store);
    chooseGardenerPair(store, keypress);

    // Intertrial interval delay before moving onto stage 2
    setTimeout(() => {
      setStage('stage2');
    }, intertrialinterval1); // delay before stage 2

  };

  const chooseGardenerPair = (store, keypress) => {
    let randomValue = Math.random();
    let gardenerPair;

    // Choose gardener pair based on user choice and 80/20 probabilities 
    if (store === 'Store 1') {
      gardenerPair = randomValue < 0.8 ? gardenerPairs.pair1 : gardenerPairs.pair2;
    } else {
      gardenerPair = randomValue < 0.2 ? gardenerPairs.pair1 : gardenerPairs.pair2;
    }
    setCurrentGardenerPair(gardenerPair);

    // Save data after setting the store and gardener pair
    setData(prevData => [...prevData, {
      timestamp: new Date().toISOString(),
      stage: 'stage1',
      userChoice: keypress,
      selectedStore: store,
      gardenerPair: gardenerPair,
    }])
  };

  const showStage2 = () => (
    <div className="stage">
      <h2>Step 2: Choose a Gardener to Talk To</h2>
      <p>Press Left Arrow for Left Gardener, Right Arrow for Right Gardener</p>
      <span>
        <div className="gardener-selection">
          <img
            src={currentGardenerPair[0]}
            alt="Gardener A"
            className={`gardener-image ${selectedGardener === 'Gardener 1' ? 'selected' : ''}`}
          />
          <img
            src={currentGardenerPair[1]}
            alt="Gardener B"
            className={`gardener-image ${selectedGardener === 'Gardener 2' ? 'selected' : ''}`}
          />
        </div>
      </span>
      <p>{isPractice ? 'Practice ' : ''}Round: {roundCount + 1} / {isPractice ? PRACTICE_ROUNDS : MAX_ROUNDS}</p>
    </div>
  );

  const handleKeyPress = (event) => {
    if (!keyPressEnabled) return;

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      if (stage === 'stage1') {
        const store = event.key === 'ArrowLeft' ? 'Store 1' : 'Store 2';
        chooseStore(store, event.key);
      } else if (stage === 'stage2') {
        const gardener = event.key === 'ArrowLeft' ? 'Gardener 1' : 'Gardener 2';
        chooseGardener(gardener, event.key);
      }
    }
  };

  // Adds event listener for key presses whenever:
  // a. key presses are enabled in the game
  // b. the game stage changes
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [stage, keyPressEnabled]);

  // Enables key presses to occur when stage is Stage1 or Stage2
  useEffect(() => {
    setKeyPressEnabled(stage === 'stage1' || stage === 'stage2');
  }, [stage]);

  const chooseGardener = (gardener, keypress) => {
    // Save gardener choice
    setSelectedGardener(gardener);
    setData(prevData => [...prevData, {
      timestamp: new Date().toISOString(),
      stage: 'stage2',
      userChoice: keypress,
      gardenerPair: currentGardenerPair,
      selectedGardener: gardener
    }])

    setTimeout(() => {
      // Add rose to garden
      const roseColor = Math.random() < 0.5 ? 'yellow' : 'red';
      addRoseToGarden(roseColor);
      setRoseCount(roseCount + 1);

      // Increment round count
      const newRoundCount = roundCount + 1;
      setRoundCount(newRoundCount);

      // Check if practice or game should end
      if (isPractice && newRoundCount >= PRACTICE_ROUNDS) {
        setStage('transition'); // go to transition screen before real game
      } else if (!isPractice && newRoundCount >= MAX_ROUNDS) {
        setStage('gameOver'); // end the game
      } else {
        // proceed to next round
        setStage('stage1');
      }
    }, intertrialinterval2); // Delay before adding rose and proceed to next round

  };

  const addRoseToGarden = (roseColor) => {
    let x, y;
    let positionIsTaken = true;

    // Keep generating random coordinates until an empty spot is found
    while (positionIsTaken) {
      x = Math.floor(Math.random() * (gardenWidth / 32)) * 32;
      y = Math.floor(Math.random() * (gardenHeight / 32)) * 32;

      // Check if the chosen coordinates are marked for the right flower color
      if ((currentBeds[y / 32][x / 32] === 1 && roseColor === 'red') ||
        (currentBeds[y / 32][x / 32] === 2 && roseColor === 'yellow')) {
        // Check if these coordinates are already taken by another rose
        positionIsTaken = garden.some(rose => rose.x === x && rose.y === y);
      }
    }
    const newRose = { roseColor, x, y };
    setGarden([...garden, newRose]);
    setHighlightedRose(newRose);

  };

  const drawRose = (ctx, rose, isHighlighted) => {
    const img = new Image();
    img.src = rose.roseColor === 'yellow' ? '/yellow_rose.png' : '/red_rose.png';

    img.onload = () => {
      // Make roses appear round in shape instead of squares
      // Draw a circular clipping path
      ctx.save(); // Save the current canvas state
      ctx.beginPath();
      ctx.arc(rose.x + 16, rose.y + 16, 16, 0, Math.PI * 2); // Create a circle with a radius of 16px
      ctx.closePath();
      ctx.clip(); // Clip to the circular path

      // Draw a glowing effect if this is the highlighted rose
      if (isHighlighted) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(255, 255, 0, 1)';
      }

      // Draw the image within the clipped area
      ctx.drawImage(img, rose.x, rose.y, 32, 32);
      // Restore the previous canvas state
      ctx.restore();
    };
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, gardenWidth, gardenHeight); // Clear the canvas before re-drawing

      garden.forEach(rose => {
        const isHighlighted = highlightedRose && highlightedRose.x === rose.x && highlightedRose.y === rose.y;
        drawRose(ctx, rose, isHighlighted);
      });

    }
  }, [garden, highlightedRose]);

  const showGarden = () => (
    <div className="garden">
      <h3>Your rose garden is growing...</h3>
      <canvas ref={canvasRef} width={gardenWidth} height={gardenHeight} className="garden-canvas"></canvas>
    </div>
  );

  const showGameOver = () => {
    setHighlightedRose(null) // Stop highlighting when the game ends
    return (
      <div className="game-over">
        <h2>Game Over</h2>
        <p>Congratulations! You've completed the game.</p>
        <p>Your final garden has {roseCount} roses.</p>
        {/* <button onClick={() => saveChoicesToCSV(data)}>Download Game Data</button> */}
      </div>
    );
  };

  // Function to convert data to CSV and download
  const saveChoicesToCSV = (data) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);
    console.log("CSV headers: " + headers)

    csvRows.push(headers.join(','));

    // Add each row of data
    for (const row of data) {
      csvRows.push(headers.map(header => JSON.stringify(row[header], (key, value) => value || '')).join(','));
    }

    // Create CSV and trigger automatic download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Function to ensure data saves when window/tab is closed
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Trigger the saveChoicesToCSV function when the user is about to leave the page
      event.preventDefault(); // Chrome requires this to show a confirmation dialog
      saveChoicesToCSV(data);
      event.returnValue = ''; // This is necessary for the confirmation dialog in some browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [data]);


  return (
    <div className="container">
      <h1>Rose Garden Game</h1>
      {stage === 'intake' && showIntakeForm()}
      {stage === 'instructions' && showInstructions()}
      {stage === 'transition' && showTransitionScreen()}
      {stage === 'stage1' && showStage1()}
      {stage === 'stage2' && showStage2()}
      {stage === 'gameOver' && showGameOver()}
      {stage !== 'intake' && stage !== 'instructions' && stage !== 'transition' && showGarden()}
    </div>
  );



};

export default App;
