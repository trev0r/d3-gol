function step(board){
  var width  = board[0].length,
      height = board.length;

  return _.map(board, function(row, y){
    var z = _.map(row, function(cell, x){
      return updateCell(cell, pointValues(validPoints(neighbors(x, y), width, height), board));
    });
    return z;
  })

}

function updateCell(cell, neighbors){
   var numLivingNeighbors = _.compact(neighbors).length
   if (cell) {
     if (numLivingNeighbors < 2) { return false;}
     if (numLivingNeighbors > 3) { return false;}
     // Two or three neighbors lives.
     return true
   }
   // If the cell is dead and has three neighbors it becomes alive.
   return numLivingNeighbors == 3;
}

function neighbors(x, y){
  return [[ x , y + 1 ],
          [ x , y - 1 ],
          [ x + 1, y + 1 ],
          [ x + 1, y - 1 ],
          [ x - 1, y + 1 ],
          [ x - 1, y - 1 ],
          [ x + 1, y ],
          [ x - 1, y ]]
}

function validPoints(points, width, height) {
  // Just do a bounds check for each point.
  return _.filter(points, function(point){
    return (point[0] > 0 && point[0] < width) && (point[1] > 0 && point[1] < height);
  });
}

function pointValues(points, board) {
  return _.map(points, function(point){
    return board[point[1]][point[0]];
  });
}
