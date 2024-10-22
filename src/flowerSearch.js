// randomized depth-first search algorithm for populating flowers by regions

// export function flowerSearch(flowerBeds) {
//     const visited = new Set();
//     const height = flowerBeds.length;
//     const width = flowerBeds[0].length;

//     function dfs(x, y, targetColor) {
//         const key = `${x},${y}`;
//         if (visited.has(key)) return null;

//         visited.add(key);

//         if (flowerBeds[y][x] === targetColor) {
//             return { x, y };
//         }

//         // Randomize the order of directions
//         const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]].sort(() => Math.random() - 0.5);
//         for (const [dx, dy] of directions) {
//             const newX = x + dx;
//             const newY = y + dy;
//             if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
//                 const result = dfs(newX, newY, targetColor);
//                 if (result) return result;
//             }
//         }

//         return null;
//     }

//     function findNextPosition() {
//         // Randomly choose between red (1) and yellow (2)
//         const targetColor = Math.random() < 0.5 ? 1 : 2;

//         // Start from a random position
//         const startX = Math.floor(Math.random() * width);
//         const startY = Math.floor(Math.random() * height);

//         const result = dfs(startX, startY, targetColor);
//         if (result) {
//             return { ...result, color: targetColor === 1 ? 'red' : 'yellow' };
//         }

//         // If we didn't find the target color, try the other color
//         const otherColor = targetColor === 1 ? 2 : 1;
//         visited.clear(); // Clear visited set to search again
//         const otherResult = dfs(startX, startY, otherColor);
//         if (otherResult) {
//             return { ...otherResult, color: otherColor === 1 ? 'red' : 'yellow' };
//         }

//         return null; // No more positions available
//     }

//     return findNextPosition;
// }

export function flowerSearch(flowerBeds, flowerRegions) {
    const visited = new Set();
    let regions = Object.entries(flowerRegions);

    // Randomize the order of regions
    regions = regions.sort(() => Math.random() - 0.5);

    let currentRegionIndex = 0;

    function dfs(x, y, color) {
        const key = `${x},${y}`;
        if (visited.has(key)) return false;

        visited.add(key);

        if (flowerBeds[y][x] === (color === 'red' ? 1 : 2)) {
            return { x, y };
        }

        // Randomize the order of directions
        const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]].sort(() => Math.random() - 0.5);
        for (const [dx, dy] of directions) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX >= 0 && newX < flowerBeds[0].length && newY >= 0 && newY < flowerBeds.length) {
                const result = dfs(newX, newY, color);
                if (result) return result;
            }
        }

        return false;
    }

    function findNextPosition() {
        while (currentRegionIndex < regions.length) {
            const [color, regionList] = regions[currentRegionIndex];

            // Ensure regionList is always an array
            const regionsToSearch = Array.isArray(regionList) ? regionList : [regionList];

            for (const region of regionsToSearch) {
                let xmin, xmax, ymin, ymax;

                // Handle different possible structures of region
                if (Array.isArray(region)) {
                    if (region.length === 2 && Array.isArray(region[0]) && Array.isArray(region[1])) {
                        [[xmin, xmax], [ymin, ymax]] = region;
                    } else if (region.length === 4) {
                        [xmin, xmax, ymin, ymax] = region;
                    } else {
                        console.error('Unexpected region array format:', region);
                        continue;
                    }
                } else if (typeof region === 'object') {
                    ({ xmin, xmax, ymin, ymax } = region);
                } else {
                    console.error('Unexpected region format:', region);
                    continue;
                }

                // Add random offsets within the region
                const startX = Math.floor(Math.random() * (xmax - xmin + 1)) + xmin;
                const startY = Math.floor(Math.random() * (ymax - ymin + 1)) + ymin;
                const result = dfs(startX, startY, color);
                if (result) return { ...result, color };
            }
            currentRegionIndex++;
        }
        return null; // No more positions available
    }

    return findNextPosition;
}