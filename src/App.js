import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { practiceFlowerBeds, flowerBeds, practiceFlowerRegions, flowerRegions } from './flowerBeds.js';
import { GardenManager } from './gardenManager.js';

const App = () => {
  // CONSTANT VARIABLES
  const [stage, setStage] = useState('intake');
  const [subjectId, setSubjectId] = useState('');
  const [gardenManager, setGardenManager] = useState(null);
  const [garden, setGarden] = useState([]);
  const [error, setError] = useState('');
  const [roseCount, setRoseCount] = useState(0);
  const [roundCount, setRoundCount] = useState(1);
  const [isPractice, setIsPractice] = useState(true);
  const [selectedStore, setSelectedStore] = useState('');
  const [currentGardenerPair, setCurrentGardenerPair] = useState([]);
  const [selectedGardener, setSelectedGardener] = useState([]);
  const [newestRoseIndex, setNewestRoseIndex] = useState(null);

  const [currentBeds, setCurrentBeds] = useState(practiceFlowerBeds);
  const [currentFlowerRegions, setCurrentFlowerRegions] = useState(practiceFlowerRegions);
  const [redRegionIndex, setRedRegionIndex] = useState(0);
  const [yellowRegionIndex, setYellowRegionIndex] = useState(0);
  const [redOccupiedPositions, setRedOccupiedPositions] = useState(new Set());
  const [yellowOccupiedPositions, setYellowOccupiedPositions] = useState(new Set());

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [data, setData] = useState([]); // Stores game data and user choices
  const [gameStartTime, setGameStartTime] = useState(null);
  const [stage1StartTime, setStage1StartTime] = useState(null);
  const [stage2StartTime, setStage2StartTime] = useState(null);
  const [keyPressEnabled, setKeyPressEnabled] = useState(false);
  const stage1ChoiceRef = useRef(false);
  const stage2ChoiceRef = useRef(false);

  // CONSTANT GAME VALUES
  const gardenWidth = 32 * 29; // the last number should equal number of columns in flowerBeds array
  const gardenHeight = 32 * 21; // the last number should be number of rows in flowerBeds array
  const practiceRounds = 10;
  const maxRounds = 30; // need to set to 150 for real game
  const intertrialinterval1 = [400, 600, 800][Math.floor(Math.random() * 3)]; // delay after stage 1 choice, before stage 2 display
  const intertrialinterval2 = [400, 600, 800][Math.floor(Math.random() * 3)]; // delay after stage 2 choice, before adding rose
  const rewardinterval = 1000; // delay after adding rose, before stage 1 display
  const gardenerPairs = {
    pair1: ['/gardener_1A.png', '/gardener_1B.png'],
    pair2: ['/gardener_2A.png', '/gardener_2B.png']
  };
  const roseColorConditions = [
    {
      'gardener_1A': { red: 0.8, yellow: 0.2 },
      'gardener_1B': { red: 0.2, yellow: 0.8 },
      'gardener_2A': { red: 0.6, yellow: 0.4 },
      'gardener_2B': { red: 0.4, yellow: 0.6 }
    },
    {
      'gardener_1A': { red: 0.6, yellow: 0.4 },
      'gardener_1B': { red: 0.2, yellow: 0.8 },
      'gardener_2A': { red: 0.8, yellow: 0.2 },
      'gardener_2B': { red: 0.4, yellow: 0.6 }
    },
    {
      'gardener_1A': { red: 0.6, yellow: 0.4 },
      'gardener_1B': { red: 0.4, yellow: 0.6 },
      'gardener_2A': { red: 0.8, yellow: 0.2 },
      'gardener_2B': { red: 0.2, yellow: 0.8 }
    }
  ];
  // Choose a random rose color condition from above
  const randomIndex = Math.floor(Math.random() * roseColorConditions.length);
  const roseColorProbabilities = roseColorConditions[randomIndex];
  console.log("rose probabilities: ", roseColorProbabilities);
  const chosenRoseProbabilityCondition = randomIndex + 1;

  // Setup GardenManager before game start
  useEffect(() => {
    // Initialize garden manager when component mounts
    setGardenManager(new GardenManager(
      isPractice ? practiceFlowerBeds : flowerBeds,
      isPractice ? practiceFlowerRegions : flowerRegions
    ));
  }, [isPractice]);

  // GAME METHODS

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
      const startTime = Date.now();
      const startTimestamp = new Date().toISOString();
      setGameStartTime(startTime);
      setError('');
      setStage('instructions');
      setData([{
        gameStartTime: startTime,
        timestamp: startTimestamp,
        stage: 'intake',
        subjectId: subjectId,
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
        <li>You will receive a rose, which will be added to your garden plot.</li>
        <li>Roses can be either yellow or red.</li>
        <li>Different gardeners have different color roses!</li>
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
        setRoundCount(1);
        setGarden([]);
        setRoseCount(0);
        // Change flower bed configuration and regions and reset for real game
        setCurrentBeds(flowerBeds);
        setCurrentFlowerRegions(flowerRegions);
        setRedRegionIndex(0);
        setYellowRegionIndex(0);
        setRedOccupiedPositions(new Set());
        setYellowOccupiedPositions(new Set());
      }}>Start Game</button>
    </div>
  );

  const handleKeyPress = (event) => {
    if (!keyPressEnabled) return;

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      if (!stage1ChoiceRef.current && stage === 'stage1') {
        const store = event.key === 'ArrowLeft' ? 'Store 1' : 'Store 2';
        handleStage1Choice(store, event.key);
      } else if (!stage2ChoiceRef.current && stage === 'stage2') {
        const gardener = event.key === 'ArrowLeft' ? 'Gardener 1' : 'Gardener 2';
        handleStage2Choice(gardener, event.key);
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
    // Enable key presses during Stage 1 and Stage 2
    setKeyPressEnabled(stage === 'stage1' || stage === 'stage2');

  }, [stage]);

  // Record timing for game stage transitions
  useEffect(() => {
    if (stage === 'stage1') {
      const stage1Time = Date.now();
      setStage1StartTime(stage1Time);
      setData(prevData => [...prevData, {
        stage: 'stage1Start',
        trial: roundCount,
        timeFromStart: stage1Time - gameStartTime
      }]);
    } else if (stage === 'stage2') {
      const stage2Time = Date.now();
      setStage2StartTime(stage2Time);
      setData(prevData => [...prevData, {
        stage: 'stage2Start',
        trial: roundCount,
        timeFromStart: stage2Time - gameStartTime
      }]);
    }
  }, [stage]);


  const showStage1 = () => {
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
      <p>{isPractice ? 'Practice ' : ''}Round: {roundCount} / {isPractice ? practiceRounds : maxRounds}</p>
    </div>)
  };

  const handleStage1Choice = (store, keypress) => {
    console.log("stage 1 choice made A: ", stage1ChoiceRef.current);
    if (stage1ChoiceRef.current) { return; }
    stage1ChoiceRef.current = true;
    console.log("stage 1 choice made B: ", stage1ChoiceRef.current);

    // Set store and gardener pair
    const choiceTime = Date.now();
    setSelectedStore(store);

    // Choose gardener pair and get probabilities
    const randomValue = Math.random();
    let gardenerPair;
    if (store === 'Store 1') {
      gardenerPair = randomValue < 0.8 ? gardenerPairs.pair1 : gardenerPairs.pair2;
    } else {
      gardenerPair = randomValue < 0.8 ? gardenerPairs.pair2 : gardenerPairs.pair1;
    }

    setCurrentGardenerPair(gardenerPair);

    // Save data
    setData(prevData => [...prevData, {
      stage: isPractice ? 'stage1Practice' : 'stage1',
      timeFromStart: choiceTime - gameStartTime,
      timeFromStage1Start: choiceTime - stage1StartTime,
      userChoice: keypress,
      trial: roundCount,
      selectedStore: store,
      gardenerPair: gardenerPair
    }]);

    // Intertrial interval delay before moving onto stage 2
    setTimeout(() => {
      setStage('stage2');
      setSelectedStore(''); // reset selection box display
    }, intertrialinterval1); // delay before stage 2

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
      <p>{isPractice ? 'Practice ' : ''}Round: {roundCount} / {isPractice ? practiceRounds : maxRounds}</p>
    </div>
  );


  const handleStage2Choice = (gardener, keypress) => {
    console.log("stage 2 choice made A: ", stage2ChoiceRef.current);
    if (stage2ChoiceRef.current) return; // Prevent multiple roses from being added
    stage2ChoiceRef.current = true;
    console.log("stage 2 choice made B: ", stage2ChoiceRef.current);
    // Save gardener choice
    const choiceTime = Date.now();
    setSelectedGardener(gardener);
    setStage('reward'); // set stage here so that keypresses are no longer enabled
    // setRoseAddedThisStage(true); // Mark that a rose has been added

    // Determine the selected gardener's ID from the current pair for rose probability lookup
    const gardenerId = currentGardenerPair[gardener === 'Gardener 1' ? 0 : 1].split('/').pop().split('.')[0];
    // Checks whether the user selection was Gardener 1 (the left side gardener).
    // If so, choose the first element in gardener pair, if not, choose second gardener in gardener pair

    // Get probabilities for chosen gardener
    const gardenerProbabilities = roseColorProbabilities[gardenerId];

    // Determine rose color
    const roseColor = Math.random() < gardenerProbabilities.red ? 'red' : 'yellow';

    // Record data from Stage 2
    setData(prevData => [...prevData, {
      stage: isPractice ? 'stage2Practice' : 'stage2',
      timeFromStart: choiceTime - gameStartTime,
      timeFromStage2Start: choiceTime - stage2StartTime,
      userChoice: keypress,
      trial: roundCount,
      gardenerPair: currentGardenerPair,
      selectedGardener: gardenerId,
      gardenerProbabilities: gardenerProbabilities,
    }]);

    setTimeout(() => { // Start reward phase after a delay
      setSelectedGardener(''); // Clear selection box from Phase 2 display
      showReward(roseColor); // Display rose
    }, intertrialinterval2); // Delay before adding rose to garden (reward display)

  };

  const showReward = (roseColor) => {
    // Add rose to garden and record its position
    const rosePosition = addRoseToGarden(roseColor);
    if (rosePosition) {
      const currentTime = Date.now();
      setData(prevData => [...prevData, {
        // timestamp: new Date().toISOString(),
        timeFromStart: currentTime - gameStartTime,
        stage: 'reward',
        roseColor: roseColor,
        trial: roundCount,
        rosePosition: { x: rosePosition.x / 32, y: rosePosition.y / 32 }
      }]);
    }
    // Pause before going to the next trial or finishing experiment
    setTimeout(() => {
      goToNextTrial();
    }, rewardinterval);

  }

  const goToNextTrial = () => {
    // Reset choice locks
    stage1ChoiceRef.current = false;
    stage2ChoiceRef.current = false;

    // Increment rose and round count
    setRoseCount(roseCount + 1);
    const newRoundCount = roundCount + 1;
    setRoundCount(newRoundCount);

    // Check if practice or game should end
    if (isPractice && newRoundCount > practiceRounds) {
      setStage('transition'); // go to transition screen
    } else if (!isPractice && newRoundCount > maxRounds) {
      setStage('gameOver');
    } else {
      setStage('stage1'); // proceed to next trial
    }
  }


  const addRoseToGarden = (roseColor) => {
    if (!gardenManager) return null;

    const position = gardenManager.addRose(roseColor);
    if (!position) {
      console.warn(`No available positions for ${roseColor} roses.`);
      return null;
    }

    const newRose = {
      roseColor,
      x: position.x,
      y: position.y
    };

    setGarden(prevGarden => {
      const newGarden = [...prevGarden, newRose];
      setNewestRoseIndex(newGarden.length - 1);
      return newGarden;
    });

    if (roseColor === 'red') {
      setRedRegionIndex(position.regionIndex);
    } else {
      setYellowRegionIndex(position.regionIndex);
    }

    // Clear highlight after 2 seconds
    setTimeout(() => {
      setNewestRoseIndex(null);
    }, rewardinterval);

    return position;
  };


  // Redraw roses when garden gets updated
  useEffect(() => {
    const drawGarden = async () => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, gardenWidth, gardenHeight); // Clear the canvas before re-drawing

        // Draw all existing roses in garden
        for (const rose of garden) {
          await drawRose(ctx, rose);
        }

        console.log("newestRoseIndex ", newestRoseIndex)

        // Draw highlight circle around new rose after roses are loaded
        if (newestRoseIndex !== null) {
          console.log('Adding new rose:', garden[newestRoseIndex]);
          const newRose = garden[newestRoseIndex];
          ctx.beginPath();
          ctx.arc(newRose.x + 16, newRose.y + 16, 32, 0, Math.PI * 2);
          ctx.strokeStyle = 'white'; // Set the outline color
          ctx.fillStyle = 'grey';
          ctx.lineWidth = 5; // Set the outline width
          ctx.stroke();
        }
      }
    };

    drawGarden();
  }, [garden, newestRoseIndex]);

  // Helper function for drawing rose
  const drawRose = (ctx, rose) => {
    // return new Promise((resolve) => {
    const img = new Image();
    img.src = rose.roseColor === 'yellow' ? '/yellow_rose.png' : '/red_rose.png';
    img.onload = () => {
      ctx.save(); // Save the current canvas state
      // Make roses appear round in shape instead of squares
      ctx.beginPath();
      ctx.arc(rose.x + 16, rose.y + 16, 16, 0, Math.PI * 2); // Create a circle with a radius of 16px
      ctx.closePath();
      ctx.clip();
      // Draw the image within the clipped area
      ctx.drawImage(img, rose.x, rose.y, 32, 32);
      ctx.restore(); // Restore the previous canvas state
      // resolve();
    };
    // });
  };


  const showGarden = () => {
    return (
      <div className="garden">

        {/* Hide H3 text at end of game */}
        {stage !== 'gameOver' && <h3>Your rose garden is growing...</h3>}

        <div ref={containerRef}>
          <canvas
            ref={canvasRef}
            width={gardenWidth}
            height={gardenHeight}
            className="garden-canvas"
          />

        </div>
      </div>
    );
  };


  const showGameOver = () => {
    return (
      <div className="game-over">
        <h2>Game Complete</h2>
        <p>Congratulations! You've completed the game.</p>
        <p>Your final garden has {roseCount} roses.</p>
      </div>
    );
  };

  // Function to convert data to CSV and download
  const saveChoicesToCSV = (data) => {
    if (!data?.length) return;

    const flattenObject = (obj) => {
      const flattened = {};
      Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (Array.isArray(obj[key])) {
            // Join array elements with a separator, removing extraneous quotes
            flattened[key] = obj[key].join(" | ");
          } else {
            const nested = flattenObject(obj[key]);
            Object.keys(nested).forEach(nestedKey => {
              flattened[`${key}_${nestedKey}`] = nested[nestedKey];
            });
          }
        } else {
          flattened[key] = obj[key] || '';  // Ensure empty fields don't have quotes
        }
      });
      return flattened;
    };

    const flattenedData = data.map(row => flattenObject(row));
    const headers = [...new Set(flattenedData.flatMap(Object.keys))];
    const csvRows = [
      headers.join(','),
      ...flattenedData.map(row =>
        headers.map(header =>
          // Remove JSON.stringify for basic string values to avoid extra quotes
          typeof row[header] === 'string' ? row[header] : JSON.stringify(row[header] ?? '')
        ).join(',')
      )
    ];

    // Create CSV and trigger automatic download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rose_garden_game_${subjectId}.csv`;
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
      {(stage === 'stage2' || stage === 'reward') && showStage2()}
      {stage === 'gameOver' && showGameOver()}
      {stage !== 'intake' && stage !== 'instructions' && stage !== 'transition' && showGarden()}
    </div>
  );



};

export default App;
