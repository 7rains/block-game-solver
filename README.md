### Find optimal solution for blocks game

## The Game

The object of the game is to position the colored blocks over their respectively colored tiles. A block can only move in 4 directions (up, down, left, right). A block will continue along a path until it encounters another block or the edge of the board. White colored blocks can't be moved.


## Examples

```
let gameSolver = require('solver');

let state = {
  blocks: [
    {coordinates: {x: 2, y: 2}, color: 'white'},
    {coordinates: {x: 2, y: 2}, color: 'blue'},
    {coordinates: {x: 3, y: 3}, color: 'green'},
    {coordinates: {x: 5, y: 5}, color: 'yellow'}
  ],

  tiles: [
    {coordinates: {x: 0, y: 0}, color: 'blue'},
    {coordinates: {x: 1, y: 7}, color: 'green'},
    {coordinates: {x: 1, y: 6}, color: 'yellow'}
  ]
};

console.log(gameSolver.solve(state));  // 8
```


## Todo

Optimize heuristic function.
Exit if game is not solvable.
Add a build step to strip out test only code to expose private functions. 



