export function discoverServers(scan, start = "home") {
  const discovered = [];
  const visited = new Set([start]);
  const queue = [{ host: start, parent: null, depth: 0 }];

  for (let index = 0; index < queue.length; index += 1) {
    const current = queue[index];
    discovered.push(current);

    for (const host of scan(current.host)) {
      if (visited.has(host)) {
        continue;
      }

      visited.add(host);
      queue.push({
        host,
        parent: current.host,
        depth: current.depth + 1
      });
    }
  }

  return discovered;
}
