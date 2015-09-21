'use strict';

let solver = require('./solver');







let state = {"gridSize":8,"blocks":[{"color":"white","coordinates":{"x":"0","y":"7"}},{"color":"white","coordinates":{"x":"1","y":"7"}},{"color":"white","coordinates":{"x":"2","y":"7"}},{"color":"white","coordinates":{"x":"3","y":"7"}},{"color":"white","coordinates":{"x":"4","y":"7"}},{"color":"white","coordinates":{"x":"5","y":"7"}},{"color":"white","coordinates":{"x":"6","y":"7"}},{"color":"white","coordinates":{"x":"7","y":"7"}},{"color":"white","coordinates":{"x":"0","y":"6"}},{"color":"white","coordinates":{"x":"7","y":"6"}},{"color":"white","coordinates":{"x":"0","y":"5"}},{"color":"red","coordinates":{"x":"2","y":"5"}},{"color":"blue","coordinates":{"x":"5","y":"5"}},{"color":"white","coordinates":{"x":"7","y":"5"}},{"color":"white","coordinates":{"x":"0","y":"4"}},{"color":"purple","coordinates":{"x":"3","y":"4"}},{"color":"white","coordinates":{"x":"7","y":"4"}},{"color":"white","coordinates":{"x":"0","y":"3"}},{"color":"yellow","coordinates":{"x":"4","y":"3"}},{"color":"white","coordinates":{"x":"7","y":"3"}},{"color":"white","coordinates":{"x":"0","y":"2"}},{"color":"orange","coordinates":{"x":"2","y":"2"}},{"color":"green","coordinates":{"x":"5","y":"2"}},{"color":"white","coordinates":{"x":"7","y":"2"}},{"color":"white","coordinates":{"x":"0","y":"1"}},{"color":"white","coordinates":{"x":"7","y":"1"}},{"color":"white","coordinates":{"x":"0","y":"0"}},{"color":"white","coordinates":{"x":"1","y":"0"}},{"color":"white","coordinates":{"x":"2","y":"0"}},{"color":"white","coordinates":{"x":"3","y":"0"}},{"color":"white","coordinates":{"x":"4","y":"0"}},{"color":"white","coordinates":{"x":"5","y":"0"}},{"color":"white","coordinates":{"x":"6","y":"0"}},{"color":"white","coordinates":{"x":"7","y":"0"}}],"tiles":[{"color":"green","coordinates":{"x":"3","y":"5"}},{"color":"red","coordinates":{"x":"4","y":"5"}},{"color":"blue","coordinates":{"x":"3","y":"2"}},{"color":"orange","coordinates":{"x":"4","y":"2"}}]};





console.log(solver.solve(state));
