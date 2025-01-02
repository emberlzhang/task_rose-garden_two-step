// Garden dimensions
export const GARDEN_TILE_SIZE = 32;
export const GARDEN_COLUMNS = 29;
export const GARDEN_ROWS = 21;
export const GARDEN_WIDTH = GARDEN_TILE_SIZE * GARDEN_COLUMNS;
export const GARDEN_HEIGHT = GARDEN_TILE_SIZE * GARDEN_ROWS;

// Game rounds
export const PRACTICE_ROUNDS = 10;
export const MAX_ROUNDS = 150; // need to set to 150 for real game

// Intervals
export const REWARD_INTERVAL = 1000;
export const INTERTRIAL_INTERVAL_1 = [400, 600, 800][
  Math.floor(Math.random() * 3)
];
export const INTERTRIAL_INTERVAL_2 = [400, 600, 800][
  Math.floor(Math.random() * 3)
];

// Gardener pairs
export const GARDENER_PAIRS = {
  pair1: ["/gardener_1A.png", "/gardener_1B.png"],
  pair2: ["/gardener_2A.png", "/gardener_2B.png"],
};

// Rose color conditions
const ROSE_COLOR_CONDITIONS = [
  {
    gardener_1A: { red: 0.8, yellow: 0.2 },
    gardener_1B: { red: 0.2, yellow: 0.8 },
    gardener_2A: { red: 0.6, yellow: 0.4 },
    gardener_2B: { red: 0.4, yellow: 0.6 },
  },
  {
    gardener_1A: { red: 0.6, yellow: 0.4 },
    gardener_1B: { red: 0.2, yellow: 0.8 },
    gardener_2A: { red: 0.8, yellow: 0.2 },
    gardener_2B: { red: 0.4, yellow: 0.6 },
  },
  {
    gardener_1A: { red: 0.6, yellow: 0.4 },
    gardener_1B: { red: 0.4, yellow: 0.6 },
    gardener_2A: { red: 0.8, yellow: 0.2 },
    gardener_2B: { red: 0.2, yellow: 0.8 },
  },
];

// Initialize and export rose probabilities
const randomIndex = Math.floor(Math.random() * ROSE_COLOR_CONDITIONS.length);
export const ROSE_COLOR_PROBABILITIES = ROSE_COLOR_CONDITIONS[randomIndex];
export const CHOSEN_CONDITION = randomIndex + 1;
console.log("Initializing rose probabilities:", ROSE_COLOR_PROBABILITIES);
