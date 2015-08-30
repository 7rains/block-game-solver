'use strict';


let assert = require('assert');
let solver = require('../solver');



describe('Private', function () {

  describe('valid', function () {
    let blocks = [
      {coordinates: {x: 5, y: 5}, color: 'yellow'},
      {coordinates: {x: 6, y: 6}, color: 'purple'}
    ];
    it('should return false if tile is occupied', function () {
      assert.equal(false, solver.__testonly__.valid(blocks, 5, 5));
    });

    it('should return false if tile is out of bounds', function () {
      assert.equal(false, solver.__testonly__.valid(blocks, -5, 6));
    });

    it('should return true if tile is not blocked or out of bounds', function () {
      assert.equal(true, solver.__testonly__.valid(blocks, 5, 6));
    });
  });

  describe('cloneState', function () {
    it('should create copy of current state', function () {
      let blocks = [
        {coordinates: {x: 5, y: 5}, color: 'yellow'},
        {coordinates: {x: 6, y: 6}, color: 'purple'}
      ];
      let clone = solver.__testonly__.cloneState(blocks);
      assert.notEqual(blocks, clone);
      assert.deepEqual(blocks, clone);
    });
  });

  describe('move', function () {
    it('blocks should keep moving in a given direction until they run into another block or the edge of the board', function () {
      let blocks = [
        {coordinates: {x: 0, y: 1}, color: 'yellow'},
        {coordinates: {x: 6, y: 1}, color: 'purple'}
      ];
      solver.__testonly__.move(blocks, 0, 'east');
      assert.deepEqual(blocks[0].coordinates, {x: 5, y: 1});
      solver.__testonly__.move(blocks, 0, 'north');
      assert.deepEqual(blocks[0].coordinates, {x: 5, y: 7});
    });
  });


  describe('pathObstructed', function () {
    it('should return false if two points are adjacent', function () {
      let blocks = [];
      assert.equal(false, solver.__testonly__.pathObstructed({x: 4, y: 2}, {x: 5, y: 2}, blocks));
      assert.equal(false, solver.__testonly__.pathObstructed({x: 4, y: 3}, {x: 4, y: 2}, blocks));
    });

    it('should return true if block is between two points', function () {
      let blocks = [{coordinates: {x: 4, y: 5}, color: 'blah'}];
      assert.equal(true, solver.__testonly__.pathObstructed({x: 3, y: 5}, {x: 5, y: 5}, blocks));
      assert.equal(true, solver.__testonly__.pathObstructed({x: 4, y: 4}, {x: 4, y: 6}, blocks));

      blocks = [{coordinates: {x: 4, y: 0}, color: 'blah'}, {coordinates: {x: 1, y: 0}, color: 'blah'}];
      assert.equal(true, solver.__testonly__.pathObstructed({x: 0, y: 0}, {x: 7, y: 0}, blocks));
    });

    it('should return false if block is not between two points', function () {
      let blocks = [{coordinates: {x: 4, y: 6}, color: 'blah'}];
      assert.equal(false, solver.__testonly__.pathObstructed({x: 0, y: 6}, {x: 3, y: 6}, blocks));
      assert.equal(false, solver.__testonly__.pathObstructed({x: 4, y: 7}, {x: 6, y: 7}, blocks));
    });
  });

});



describe('Public', function () {

  describe('solve', function () {
    it('should solve the given state in 8 moves', function () {
      let state = {
        blocks: [
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
      assert.equal(solver.solve(state), 8);
    });
  });

});
