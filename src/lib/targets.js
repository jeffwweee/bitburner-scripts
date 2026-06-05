export function scoreServer(server) {
  const maxMoney = server.maxMoney ?? 0;
  const requiredSkill = server.requiredSkill ?? 0;
  const playerSkill = server.playerSkill ?? 0;
  const minSecurity = Math.max(server.minSecurity ?? 1, 1);
  const hasRootAccess = server.hasRoot !== false;
  const eligible =
    maxMoney > 0 && requiredSkill <= playerSkill && hasRootAccess;
  const skillPenalty = 1 + requiredSkill / Math.max(playerSkill, 1);
  const score = eligible ? maxMoney / minSecurity / skillPenalty : 0;

  return {
    ...server,
    eligible,
    score
  };
}

export function rankTargets(servers) {
  return servers
    .map(scoreServer)
    .sort((left, right) => {
      if (left.eligible !== right.eligible) {
        return left.eligible ? -1 : 1;
      }

      if (left.score !== right.score) {
        return right.score - left.score;
      }

      return left.host.localeCompare(right.host);
    });
}
