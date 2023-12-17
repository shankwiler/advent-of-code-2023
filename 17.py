import heapq

with open('17-input.txt') as f:
  input_str = f.read().strip()

def part_one():
  grid = [[int(e) for e in line] for line in input_str.split('\n')]

  # row, col, up_remain, right_remain, down_remain, left_remain
  start_entry = (0,0,3,3,3,3)
  dists = {
    start_entry: 0,
  }

  queue = [(0, start_entry, None)]
  prev = {}

  while queue:
    dist, entry, prev_entry = heapq.heappop(queue)

    if entry in dists and entry != start_entry:
      continue

    prev[entry] = prev_entry
    row, col, up_remain, right_remain, down_remain, left_remain = entry

    if row == len(grid) - 1 and col == len(grid[0]) - 1:
      return dist

    dists[entry] = dist

    new_entries = []
    if up_remain > 0 and row > 0:
      new_entries.append((row - 1, col, up_remain - 1, 3, 0, 3))
    if right_remain > 0 and col < len(grid[0]) - 1:
      new_entries.append((row, col + 1, 3, right_remain - 1, 3, 0))
    if down_remain > 0 and row < len(grid) - 1:
      new_entries.append((row + 1, col, 0, 3, down_remain - 1, 3))
    if left_remain > 0 and col > 0:
      new_entries.append((row, col - 1, 3, 0, 3, left_remain - 1))

    for new_entry in new_entries:
      heapq.heappush(queue, (dist + grid[new_entry[0]][new_entry[1]], new_entry, entry))

def part_two():
  grid = [[int(e) for e in line] for line in input_str.split('\n')]

  # row, col, up_remain, right_remain, down_remain, left_remain
  max_move = 10
  start_entry = (0,0,max_move,max_move,max_move,max_move)
  dists = {
    start_entry: 0,
  }

  queue = [(0, start_entry, None)]
  prev = {}

  while queue:
    dist, entry, prev_entry = heapq.heappop(queue)

    if entry in dists and entry != start_entry:
      continue

    prev[entry] = prev_entry
    row, col, up_remain, right_remain, down_remain, left_remain = entry

    if row == len(grid) - 1 and col == len(grid[0]) - 1:
      return dist

    dists[entry] = dist

    new_entries = []

    if up_remain == max_move and row > 3:
      new_entries.append((row - 4, col, up_remain - 4, max_move, 0, max_move))
    if 0 < up_remain < max_move and row > 0:
      new_entries.append((row - 1, col, up_remain - 1, max_move, 0, max_move))

    if right_remain == max_move and col < len(grid[0]) - 4:
      new_entries.append((row, col + 4, max_move, right_remain - 4, max_move, 0))
    if 0 < right_remain < max_move and col < len(grid[0]) - 1:
      new_entries.append((row, col + 1, max_move, right_remain - 1, max_move, 0))

    if down_remain == max_move and row < len(grid) - 4:
      new_entries.append((row + 4, col, 0, max_move, down_remain - 4, max_move))
    if 0 < down_remain < max_move and row < len(grid) - 1:
      new_entries.append((row + 1, col, 0, max_move, down_remain - 1, max_move))
    
    if left_remain == max_move and col > 3:
      new_entries.append((row, col - 4, max_move, 0, max_move, left_remain - 4))
    if 0 < left_remain < max_move and col > 0:
      new_entries.append((row, col - 1, max_move, 0, max_move, left_remain - 1))

    for new_entry in new_entries:
      add_dist = None

      if row < new_entry[0]:
        add_dist = sum([grid[r][col] for r in range(row + 1, new_entry[0] + 1)])
      elif row > new_entry[0]:
        add_dist = sum([grid[r][col] for r in range(new_entry[0], row)])
      
      if col < new_entry[1]:
        add_dist = sum([grid[row][c] for c in range(col + 1, new_entry[1] + 1)])
      elif col > new_entry[1]:
        add_dist = sum([grid[row][c] for c in range(new_entry[1], col)])

      heapq.heappush(queue, (dist + add_dist, new_entry, entry))

print(part_one(), part_two())

"""
I ended up using python, despite planning to execute all the solutions from the
Chrome console. Javascript just doesn't have any heap/priority queue built-ins
unfortunately.

The idea here is that instead of considering each cell in the grid a node in a
big graph, we consider the (cell + metadata about how many cells it can access
in each direction) a node in the graph. So if you get to row X col Y with the
ability to go right 2 more cells, that's a completely different "node" in the
graph than row X col Y with the ability to go right 3 more cells.

Once we've established that we can use Djikstra's (I had to look at wikipedia for
the pseudocode, it's been awhile...). One nasty bug that came up was setting prev
whenever I added a node to the queue, but this is bad because I'm often adding
garbage to the queue that will get ignored because the node already was visited.
Instead prev needs to be set once the node is popped from the queue and processed.

Part two was a pretty straightforward tweak to part one. There are a number of
improvements I could make, like you really don't need to visit row X col Y with
2 right movements remaining if you've already visited row X col Y with 3 right
movements remaining (assuming the other directional requirements are also more
or equally as restricted as in your prior visit). But part 2 still ran (in the
relatively slow runtime provided by python compared to v8 :)) in around 5 seconds
so I'll leave it be for now.
"""
