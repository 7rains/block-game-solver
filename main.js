'use strict';

let solver = require('./solver');

let state = {"solve": 10, "gridSize":8,"blocks":[{"color":"blue","coordinates":{"x":"4","y":"5"}},{"color":"white","coordinates":{"x":"3","y":"2"}},{"color":"white","coordinates":{"x":"4","y":"2"}},{"color":"white","coordinates":{"x":"5","y":"2"}},{"color":"white","coordinates":{"x":"6","y":"2"}},{"color":"white","coordinates":{"x":"3","y":"1"}},{"color":"white","coordinates":{"x":"4","y":"1"}},{"color":"white","coordinates":{"x":"5","y":"1"}},{"color":"white","coordinates":{"x":"6","y":"1"}},{"color":"green","coordinates":{"x":"4","y":"0"}},{"color":"white","coordinates":{"x":"5","y":"0"}},{"color":"white","coordinates":{"x":"6","y":"0"}},{"color":"orange","coordinates":{"x":"7","y":"0"}}],"tiles":[{"color":"green","coordinates":{"x":"0","y":"4"}},{"color":"orange","coordinates":{"x":"0","y":"3"}},{"color":"blue","coordinates":{"x":"6","y":"3"}}]};

console.log(solver.solve(state));
