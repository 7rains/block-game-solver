'use strict';

let PriorityQueue = require('priorityqueuejs');


/*
 * Gameboard coordinate system. [x,y]
 *  [0,n]              [n,n]
 *      ________________
 *     |                |
 *     |                |
 *     |                |
 *     |                |
 *     |                |
 *     |                |
 *     |                |
 *      ________________
 *  [0,0]              [n,0]
 */

 
const DIRECTIONS  = ['north', 'south', 'east', 'west'];
const GAME_BOARD_SIZE = 8;

let visitedStates = new Map();
let queue = new PriorityQueue(function(a, b) {
  return b.estimate - a.estimate;
});


function findByCoordinates (x, y, arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i].coordinates.x === x && arr[i].coordinates.y === y) {
      return arr[i].color;
    }
  }
  return null;
}


function findCoordByColor (c, arr) {
  for (let i = 0, len = arr.length; i < len; i++) {
    if (arr[i].color === c) {
      return {x: arr[i].coordinates.x, y: arr[i].coordinates.y};
    }
  }
  return null;
}


function gameWon (blocks, tiles) {
  for (let i = 0, len = tiles.length; i < len; i++) {
    if (tiles[i].color !== findByCoordinates(tiles[i].coordinates.x, tiles[i].coordinates.y, blocks)) {
      return false;
    }
  }
  return true;
}


function explore (blocks, tiles) {
  let moves = 0;
  let newState = cloneState(blocks);
  visitedStates.set(JSON.stringify(newState), {previousState: null, cost: 0});

  queue.enq({ state: newState, estimate: heuristic(newState, tiles) });

  while (queue.size() > 0) {
    let item = queue.deq();
    let currentState = item.state;
    let i, blockLength;

    for (i = 0, blockLength = currentState.length; i < blockLength; i++) {

      // Don't move white blocks
      if (currentState[i].color === 'white') {
        continue;
      }

      for (let j = 0, directionLength = DIRECTIONS.length; j < directionLength; j++) {
        let newState = cloneState(currentState);
        move(newState, i, DIRECTIONS[j]);

        let newCost = visitedStates.get(JSON.stringify(currentState)).cost + 1;

        if (!visitedStates.has(JSON.stringify(newState)) || newCost < visitedStates.get(JSON.stringify(newState)).cost ) {
          visitedStates.set(JSON.stringify(newState), {previousState: currentState, cost: newCost});
          queue.enq({ state: newState, estimate: newCost + heuristic(newState, tiles) });

          if (gameWon(newState, tiles)) {
            return newState;
          }
        }
      }
    }
  }
}


function getSolution (state) {
  let solution = [];
  solution.push(state);

  for ( ; state = visitedStates.get(JSON.stringify(state)).previousState; ) {
    solution.push(state);
  }

  return solution;
}


function move (blocks, blockIndex, direction) {
  let pos = nextTile(blocks[blockIndex], direction);
  if (valid(blocks, pos.x, pos.y)) {
    blocks[blockIndex].coordinates.x = pos.x;
    blocks[blockIndex].coordinates.y = pos.y; 
    move(blocks, blockIndex, direction);
  }
}


function nextTile (block, direction) {
  if (direction === 'north') {
    return {x: block.coordinates.x, y: block.coordinates.y + 1};
  } else if (direction === 'south') {
    return {x: block.coordinates.x, y: block.coordinates.y - 1};
  } else if (direction === 'east') {
    return {x: block.coordinates.x + 1, y: block.coordinates.y};
  } else if (direction === 'west') {
    return {x: block.coordinates.x - 1, y: block.coordinates.y};
  }
}


function valid (blocks, x, y) {
  return checkBounds(x, y) && !occupied(blocks, x, y);
}


function checkBounds (x, y) {
  if ((x >= 0 && x < GAME_BOARD_SIZE) && (y >= 0 && y < GAME_BOARD_SIZE)) {
    return true;
  }
  return false;
}


function occupied (blocks, x, y) {
  for (let i = 0, len = blocks.length; i < len; i++) {
    if (blocks[i].coordinates.x === x && blocks[i].coordinates.y === y) {
      return true
    }
  }
  return false;
}


function heuristic (blocks, tiles) {
  let cost = 0;
  let coord = {};
  for (let i = 0, len = tiles.length; i < len; i++) {
    coord = findCoordByColor(tiles[i].color, blocks);
    if (coord.x === tiles[i].coordinates.x && coord.y === tiles[i].coordinates.y) {
      cost += 0;
    } else if (coord.x === tiles[i].coordinates.x || coord.y === tiles[i].coordinates.y) {
      cost += 1;
    } else {
      cost += 2;
    }
  }
  return cost;
}


function cloneState (blocks) {
  let clone = []; 
  for (let i = 0, len = blocks.length; i < len; i++) {
    clone.push({
      coordinates: {
        x: blocks[i].coordinates.x,
        y: blocks[i].coordinates.y,
      },
      color: blocks[i].color
    });
  }
  return clone;
}


function solve (level) {
  let winState = explore(level.blocks, level.tiles);
  let solution = getSolution(winState);
  // console.log(solution);
  return solution.length - 1;
}


module.exports = {
  /* private test api */
  __testonly__: {
    valid:             valid,
    cloneState:        cloneState,
    findByCoordinates: findByCoordinates,
    findCoordByColor:  findCoordByColor,
    gameWon:           gameWon,
    move:              move,
  },
  /* private test api */

  solve:             solve
};




