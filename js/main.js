var margin = {top: 20, right: 20, bottom: 20, left: 20};
var aspectRatio = 3/4;
var cellSize = 40;
var gridWidth = 24;
var gridHeight = gridWidth * aspectRatio;
var width = gridWidth * cellSize;
var height = width * aspectRatio;


var gridGraph = d3.select("#grid")
  .append("svg")
  .attr("width", width + margin.right + margin.left)     // Set width of the SVG canvas
  .attr("height", height + margin.top + margin.bottom)   // Set height of the SVG canvas
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var yaxiscoorddata = d3.range(0, height + cellSize, cellSize);
var xaxiscoorddata = d3.range(0, width + cellSize, cellSize);

// Using the xaxiscoorddata to generate vertical lines.
gridGraph.selectAll("line.vertical")
  .data(xaxiscoorddata)
  .enter().append("line")
  .attr("x1", function(d){return d;})
  .attr("y1", 0)
  .attr("x2", function(d){return d;})
  .attr("y2", height)
  .style("stroke", "rgb(0,0,0)")
  .style("stroke-width", 2);

// Using the yaxiscoorddata to generate horizontal lines.
gridGraph.selectAll("line.horizontal")
  .data(yaxiscoorddata)
  .enter().append("line")
  .attr("x1", 0)
  .attr("y1", function(d){return d;})
  .attr("x2", width)
  .attr("y2", function(d){return d;})
  .style("stroke", "rgb(0,0,0)")
  .style("stroke-width", 2);

// Takes
var translate = function(board){
  return _.chain(board)
    .map(function(row, y){
      return _.map(row, function(cell, x){
        if (cell) { return {x: x, y: y}; }
        return false;
      });})
    .flatten().compact().value();
};

var initialize = function(points, width, height) {
  // Creating arrays of a specific size is annoying.
  var board =  [];
  _(height).times(function(){
    var row = [];
    _(width).times(function() { row.push(false); });
    board.push(row);
  });
  points.forEach(function(point){
    board[point.y][point.x] = true
  });
  return board;
}

var drawCells = function(cells){
  gridGraph.selectAll("rect").remove();
  var grid = gridGraph.selectAll("rect")
    .data(cells)
  grid.enter().append("rect")
    .attr("x", function(c){ return c.x  * cellSize; })
    .attr("y", function(c){ return c.y  * cellSize;})
    .attr("width", cellSize).attr("height", cellSize);
}

var pattern = function(name){
  var board;
  switch(name)
  {
  case "diehard":
    board = [{x:15, y:9}, {x:14, y:9}, {x:13, y:9},
             {x:14, y:7},
             {x:9, y:8}, {x:9, y:9}, {x:8, y:8},
            ];
    break;
  case "glider":
    board =  [{x:2, y:1},
              {x:3, y:2},
              {x:1, y:3}, {x:2, y:3},{x:3, y:3},
             ];
    break;
  case "pulsar":
    board = [
      {x:9, y:7}, {x:8, y:7}, {x:7, y:7},
      {x:10, y:6}, {x:10, y:5}, {x:10, y:4},
      {x:9, y:2}, {x:8, y:2}, {x:7, y:2},
      {x:5, y:6}, {x:5, y:5}, {x:5, y:4},


      {x:12, y:6}, {x:12, y:5}, {x:12, y:4},
      {x:13, y:7}, {x:14, y:7}, {x:15, y:7},
      {x:13, y:2}, {x:14, y:2}, {x:15, y:2},
      {x:17, y:6}, {x:17, y:5}, {x:17, y:4},

      {x:13, y:9}, {x:14, y:9}, {x:15, y:9},
      {x:12, y:10}, {x:12, y:11}, {x:12, y:12},
      {x:13, y:14}, {x:14, y:14}, {x:15, y:14},
      {x:17, y:12}, {x:17, y:11}, {x:17, y:10},


      {x:10, y:10}, {x:10, y:11}, {x:10, y:12},
      {x:9, y:9}, {x:8, y:9}, {x:7, y:9},
      {x:9, y:14}, {x:8, y:14}, {x:7, y:14},
      {x:5, y:12}, {x:5, y:11}, {x:5, y:10},
    ];
    break;
  }

  return board;
}

var board = initialize(pattern('diehard'), gridWidth, gridHeight);
// Control variable to interrupt the animation.
var stop = true;

// Draw the default board.
drawCells(translate(board));

// Update the board whenever the selector changes.
$('#options').change(function(){
  board = initialize(pattern($('#options').val()), gridWidth, gridHeight);
  drawCells(translate(board));
  stop = true;
});

// Start animating when the button is pressed.
$('#button').click(function(){
  stop = false;
  (function animate() {
    var liveCells = translate(board);
    drawCells(liveCells);
    if (liveCells.length == 0 || stop){
      return;
    }
    board = step(board);

    setTimeout(animate, 750);
  })();
});
