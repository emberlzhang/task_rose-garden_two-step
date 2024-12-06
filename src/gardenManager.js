export class GardenManager {
  constructor(flowerBeds, flowerRegions) {
    this.flowerBeds = flowerBeds;
    this.regions = this.preprocessRegions(flowerRegions);
    this.occupiedSpaces = new Set();
    this.roseCount = { red: 0, yellow: 0 };

    // Pre-calculate valid positions for each region
    this.validPositionsByRegion = this.initializeValidPositions();
  }

  // Preprocess regions into a more efficient format
  preprocessRegions(regions) {
    const processed = { red: [], yellow: [] };

    for (const color of ['red', 'yellow']) {
      processed[color] = regions[color].map((region) => {
        const [xmin, xmax, ymin, ymax] = region;
        return {
          bounds: { xmin, xmax, ymin, ymax },
          availablePositions: new Set(), // Will be populated in initializeValidPositions
          totalPositions: 0 // Will be set during initialization
        };
      });
    }

    return processed;
  }

  // Initialize all valid positions for each region
  initializeValidPositions() {
    const positions = { red: [], yellow: [] };

    for (const color of ['red', 'yellow']) {
      const colorValue = color === 'red' ? 1 : 2;

      this.regions[color].forEach((region, regionIndex) => {
        const { bounds } = region;
        const validPositions = new Set();

        for (let y = bounds.ymin - 1; y <= bounds.ymax - 1; y++) {
          for (let x = bounds.xmin - 1; x <= bounds.xmax - 1; x++) {
            if (this.flowerBeds[y][x] === colorValue) {
              const posKey = `${x},${y}`;
              validPositions.add(posKey);
            }
          }
        }

        region.availablePositions = validPositions;
        region.totalPositions = validPositions.size;
        positions[color][regionIndex] = validPositions;
      });
    }

    return positions;
  }

  // Get a random position from a region
  getRandomPosition(validPositions) {
    if (validPositions.size === 0) return null;
    const positions = Array.from(validPositions);
    return positions[Math.floor(Math.random() * positions.length)];
  }

  // Find next available position for a rose
  findNextPosition(color) {
    // First, try regions with more available positions
    const sortedRegions = [...this.regions[color]]
      .filter(region => region.availablePositions.size > 0)
      .sort((a, b) => b.availablePositions.size - a.availablePositions.size);

    for (const region of sortedRegions) {
      const position = this.getRandomPosition(region.availablePositions);
      if (position) {
        return {
          position: position,
          regionIndex: this.regions[color].indexOf(region)
        };
      }
    }

    return null;
  }

  // Add a rose to the garden
  addRose(color) {
    const result = this.findNextPosition(color);
    if (!result) return null;

    const { position, regionIndex } = result;
    const [x, y] = position.split(',').map(Number);

    // Remove position from all regions that might contain it
    this.regions[color].forEach(region => {
      region.availablePositions.delete(position);
    });

    this.occupiedSpaces.add(position);
    this.roseCount[color]++;

    // Return the pixel coordinates and region info
    return {
      x: x * 32,
      y: y * 32,
      regionIndex,
      gridPosition: { x, y }
    };
  }

  // Check if position is available
  isPositionAvailable(x, y, color) {
    const posKey = `${x},${y}`;
    return !this.occupiedSpaces.has(posKey) &&
      this.flowerBeds[y][x] === (color === 'red' ? 1 : 2);
  }

  // Get statistics about the garden
  getStats() {
    return {
      totalRoses: this.roseCount.red + this.roseCount.yellow,
      rosesByColor: { ...this.roseCount },
      availableSpaces: {
        red: this.regions.red.reduce((sum, region) => sum + region.availablePositions.size, 0),
        yellow: this.regions.yellow.reduce((sum, region) => sum + region.availablePositions.size, 0)
      }
    };
  }
}