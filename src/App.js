import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const flowerBeds = [
  [1, 1, 1, 0, 2, 2, 2, 2, 2, 1, 1, 0, 2, 0, 2, 2, 1, 1, 1, 1, 1, 0, 2, 2, 2],
  [1, 1, 1, 0, 0, 2, 2, 2, 0, 1, 1, 2, 2, 2, 2, 2, 0, 1, 1, 1, 0, 0, 2, 2, 2],
  [1, 1, 1, 0, 0, 0, 2, 0, 0, 1, 1, 0, 2, 0, 2, 2, 0, 0, 1, 0, 0, 0, 2, 2, 2],
  [0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 2, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 2, 0, 2, 2, 2, 0, 0, 1, 1, 0],
  [2, 2, 2, 2, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 2, 2, 0, 0, 2, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 2, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2],
  [0, 1, 1, 0, 0, 2, 2, 2, 0, 1, 1, 2, 2, 2, 2, 2, 0, 1, 1, 1, 0, 0, 2, 2, 0],
  [0, 0, 0, 0, 0, 2, 2, 2, 0, 1, 1, 0, 2, 0, 2, 2, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [2, 2, 2, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 0, 2, 2, 0, 0, 2, 0, 0, 0, 1, 1, 1],
  [2, 2, 2, 0, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 2, 2, 0, 2, 2, 2, 0, 0, 1, 1, 1],
  [2, 2, 2, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, 2, 2, 2, 2, 2, 2, 0, 1, 1, 1],
];

const App = () => {
  const [stage, setStage] = useState('instructions');
  const [garden, setGarden] = useState([]);
  const [roseCount, setRoseCount] = useState(0);
  const [selectedStore, setSelectedStore] = useState('');
  const [currentGardenerPair, setCurrentGardenerPair] = useState([]);
  const canvasRef = useRef(null);

  const gardenerPairs = {
    pair1: ['/gardener_1A.png', '/gardener_1B.png'],
    pair2: ['/gardener_2A.png', '/gardener_2B.png']
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
        <li>The rose will be added to your garden plot at a random location.</li>
      </ul>
      <br></br>
      <br></br>
      <button onClick={() => setStage('stage1')}>Start Game</button>
    </div>
  );

  const showStage1 = () => (
    <div className="stage">
      <h2>Step 1: Choose a Gardening Store</h2>
      <span>
        <img
          src="/gardenstore-red.png"
          alt="Red Garden Store"
          className="store-image"
          onClick={() => chooseStore('Store 1')}
        />
        <img
          src="/gardenstore-blue.png"
          alt="Blue Garden Store"
          className="store-image"
          onClick={() => chooseStore('Store 2')}
        />
      </span>
    </div>
  );

  const chooseStore = (store) => {
    setSelectedStore(store);
    setStage('stage2');
    chooseGardenerPair(store);
  };

  const chooseGardenerPair = (store) => {
    let randomValue = Math.random();
    let gardenerPair;
    if (store === 'Store 1') {
      gardenerPair = randomValue < 0.8 ? gardenerPairs.pair1 : gardenerPairs.pair2;
    } else {
      gardenerPair = randomValue < 0.2 ? gardenerPairs.pair1 : gardenerPairs.pair2;
    }
    setCurrentGardenerPair(gardenerPair);
  };

  const showStage2 = () => (
    <div className="stage">
      <h2>Step 2: Choose a Gardener to Talk To</h2>
      <div className="gardener-selection">
        <img 
          src={currentGardenerPair[0]} 
          alt="Gardener A" 
          className="gardener-image" 
          onClick={() => chooseGardener('Gardener 1')}
        />
        <img 
          src={currentGardenerPair[1]} 
          alt="Gardener B" 
          className="gardener-image" 
          onClick={() => chooseGardener('Gardener 2')}
        />
      </div>
    </div>
  );

  const chooseGardener = (gardener) => {
    const roseColor = Math.random() < 0.5 ? 'yellow' : 'red';
    addRoseToGarden(roseColor);
    setRoseCount(roseCount + 1);
    setStage('stage1');
  };

  const gardenWidth = 32 * 25; // the last number should multiply to 300 (2 x number of trials)
  const gardenHeight = 32 * 12; // the last number should multiply to 300 (2 x number of trials)
  // 25 x 12 = 300 roses that can be filled 
  // 150 red roses + 150 yellow roses

  const addRoseToGarden = (roseColor) => {
    let x, y;
    let positionIsTaken = true;
    
    // Keep generating random coordinates until an empty spot is found
    while (positionIsTaken)  {
      x = Math.floor(Math.random() * (gardenWidth / 32)) * 32;
      y = Math.floor(Math.random() * (gardenHeight / 32)) * 32;
      console.log("x: " + x + " | y: " + y)
      // Check if the chosen coordinates are marked for the right flower color
      if ((flowerBeds[y/32][x/32] === 1 && roseColor === 'red') || 
          (flowerBeds[y/32][x/32] === 2 && roseColor === 'yellow')) {
        // Check if these coordinates are already taken by another rose
        positionIsTaken = garden.some(rose => rose.x === x && rose.y === y);
      }
    }
    setGarden([...garden, { roseColor, x, y }]);
    
  };

  const drawRose = (ctx, rose) => {
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
      // Draw the image within the clipped area
      ctx.drawImage(img, rose.x, rose.y, 32, 32);

      ctx.restore(); // Restore the previous canvas state
    };
  };

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, gardenWidth, gardenHeight); // Clear the canvas before re-drawing
      garden.forEach(rose => drawRose(ctx, rose));
    }
  }, [garden]);

  const showGarden = () => (
    <div className="garden">
      <h3>Your rose garden is growing...</h3>
      <canvas ref={canvasRef} width={gardenWidth} height={gardenHeight} className="garden-canvas"></canvas>
    </div>
  );

  return (
    <div className="container">
      <h1>Rose Garden Game</h1>
      {stage === 'instructions' && showInstructions()}
      {stage === 'stage1' && showStage1()}
      {stage === 'stage2' && showStage2()}
      {stage !== 'instructions' && showGarden()}
    </div>
  );
};

export default App;
