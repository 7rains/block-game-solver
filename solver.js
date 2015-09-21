'use strict';

let PriorityQueue = require('priorityqueuejs');
// var Map = require('es6-map/polyfill');
var md5 = require('md5');


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
  let item = {};
  visitedStates.set(hasher(newState), {previousState: null, cost: 0});

  queue.enq({ state: newState, estimate: heuristic(newState, tiles) });

  while (queue.size() > 0) {

    item = queue.deq();

    let currentState = item.state;
    let i, blockLength;



    for (i = 0, blockLength = currentState.length; i < blockLength; i++) {

      // Don't move white blocks
      if (currentState[i].color === 'white') {
        continue;
      }

      for (let j = 0, directionLength = DIRECTIONS.length; j < directionLength; j++) {
        newState = cloneState(currentState);
        move(newState, i, DIRECTIONS[j]);

        let newCost = visitedStates.get(hasher(currentState)).cost + 1;

        if (!visitedStates.has(hasher(newState)) || newCost < visitedStates.get(hasher(newState)).cost ) {
          visitedStates.set(hasher(newState), {previousState: currentState, cost: newCost});

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

  for ( ; state = visitedStates.get(hasher(state)).previousState; ) {
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
      if (pathObstructed(coord, tiles[i].coordinates, blocks)) {
        cost += 2;
      } else {
        cost += 1;
      }
    } else {
      cost += 2;
    }
  }
  return cost;
}


function pathObstructed (a, b, blocks) {
  if (a.x === b.x) {
    let min = Math.min(a.y, b.y) + 1;
    let max = Math.max(a.y, b.y) - 1;

    // if blocks are next to eachother
    if (max < min) {
      return false
    }

    // check path for blocks
    for (let i = min; i <= max; i++) {
      if (findByCoordinates(a.x, i, blocks)) {
        return true
      }
    }

    // no blocks found
    return false;
  }

  else if (a.y === b.y) {
    let min = Math.min(a.x, b.x) + 1;
    let max = Math.max(a.x, b.x) - 1;

    // if blocks are next to eachother
    if (max < min) {
      return false
    }

    // check path for blocks
    for (let i = min; i <= max; i++) {
      if (findByCoordinates(i, a.y, blocks)) {
        return true
      }
    }

    // no blocks found
    return false;
  }
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

function cleanLevel(level) {
  for (let i = 0, len = level.blocks.length; i < len; i++) {
    level.blocks[i].coordinates.x = parseInt(level.blocks[i].coordinates.x);
    level.blocks[i].coordinates.y = parseInt(level.blocks[i].coordinates.y);
  }

  for (let i = 0, len = level.tiles.length; i < len; i++) {
    level.tiles[i].coordinates.x = parseInt(level.tiles[i].coordinates.x);
    level.tiles[i].coordinates.y = parseInt(level.tiles[i].coordinates.y);
  }
}

function getStepsToSolve (solution) {
  let steps = [];
  for (let i = solution.length - 1; i >= 1; i--) {
    // compare with the next state
    steps.push(deriveMoveFromStates(solution[i], solution[i-1]));
  }
  console.log(JSON.stringify(steps));
}

function deriveMoveFromStates (s1, s2) {
  for (let i = 0, len = s1.length; i < len; i++) {
    if (s1[i].color !== 'white') {
      if (!compareCoordinates(s1[i].coordinates, s2[i].coordinates)) {
        return {blockColor: s1[i].color, direction: getDirectionFromCoordinates(s1[i].coordinates, s2[i].coordinates)};
      }
    }
  }
}


function getDirectionFromCoordinates (c1, c2) {
  if (c1.y > c2.y) {
    return 'north';
  } else if (c1.y < c2.y) {
    return 'south';
  } else if (c1.x > c2.x) {
    return 'west';
  } else if (c1.x < c2.x) {
    return 'east';
  } else {
    return 'none';
  }
}

function compareCoordinates (c1, c2) {
  return c1.x === c2.x && c1.y === c2.y;
}


function solve (level) {
  cleanLevel(level);
  let winState = explore(level.blocks, level.tiles);
  let solution = getSolution(winState);
  for (let i = solution.length -1 ; i >= 0; i--) {
    // printState(solution[i]);
  }
  getStepsToSolve(solution);
  return solution.length - 1;
}

function findBlockByCoordinates (state, coordinates) {
  for (let i = 0, len = state.length; i < len; i++) {
    if (compareCoordinates(state[i].coordinates, coordinates)) {
      return state[i];
    }
  }
  return null;
}

function hasher (state) {
  // let str = '';

  // for (let i = 0, len = state.length; i < len; i++) {
  //   if (state[i].color !== 'white') {
  //     str += state[i].color + state[i].coordinates.x + state[i].coordinates.y;
  //   }
  // }
  // return md5(str);
  return md5(JSON.stringify(state));

}

function printState (s) {
  let string = '';
  let block = {};
  // iterate through all blocks in state
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      block = findBlockByCoordinates(s, {x: i, y: j})
      if (block) {
        string += '[ ' + block.color[0] + ' ]';
      } else {
        string += '[   ]';
      }
    } 
    string += '\n';
  }

  console.log(string);
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
    pathObstructed:    pathObstructed
  },
  /* private test api */

  solve:             solve
};




