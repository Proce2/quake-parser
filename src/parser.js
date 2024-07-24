import fs from 'fs';

export function readLogFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

export function parseLogFile(content) {
  const lines = content.split('\n');
  const games = {};
  let currentMatch = null;
  let matchIndex = 0;

  lines.forEach(line => {
    if (detectInitGame(line)) {
      ({ currentMatch, matchIndex } = defineGameIndex(games, matchIndex));
    } else if (detectShutdownGame(line) && currentMatch) {
      cleanCurrentMatch(currentMatch);
      currentMatch = null;
    } else if (detectKillEvent(line, currentMatch)) {
      updateCurrentMatch(line, currentMatch);
    }
  });

  return games;
}

function detectInitGame(line) {
  return line.includes('InitGame');
}

function defineGameIndex(games, matchIndex) {
  matchIndex++;
  const currentMatch = {
    total_kills: 0,
    players: new Set(),
    kills: {},
  };
  games[`game_${matchIndex}`] = currentMatch;
  return { currentMatch, matchIndex };
}

function detectShutdownGame(line) {
  return line.includes('ShutdownGame');
}

function cleanCurrentMatch(currentMatch) {
  currentMatch.players = Array.from(currentMatch.players).filter(player => player !== '<world>');
}

function detectKillEvent(line, currentMatch) {
  return currentMatch && line.includes('Kill:');
}

export function updateCurrentMatch(line, currentMatch) {
  currentMatch.total_kills++;
  const match = detectAndExtractKillDetails(line);
  if (match) {
    const killer = match[1];
    const victim = match[2];
    addDataToMatch(currentMatch, killer, victim);
  }
}

function detectAndExtractKillDetails(line) {
  const killRegex = /Kill:\s+\d+\s+\d+\s+\d+:\s+(.+)\s+killed\s+(.+)\s+by\s+(.+)/;
  return line.match(killRegex);
}

export function addDataToMatch(currentMatch, killer, victim) {
  if (killer === victim) {
    decrementVictimKillCount(currentMatch, victim);
  } else if (player(killer)) {
    incrementKillerKillCount(currentMatch, killer);
  } else {
    decrementVictimKillCount(currentMatch, victim);
  }
  if (player(killer)) {
    ensurePlayerInCurrentMatch(currentMatch, killer);
  }
  ensurePlayerInCurrentMatch(currentMatch, victim);
}

function player(killer) {
  return killer !== '<world>';
}

function incrementKillerKillCount(currentMatch, killer) {
  currentMatch.players.add(killer);
  currentMatch.kills[killer] = (currentMatch.kills[killer] || 0) + 1;
}

function decrementVictimKillCount(currentMatch, victim) {
  currentMatch.kills[victim] = (currentMatch.kills[victim] || 0) - 1;
}

function ensurePlayerInCurrentMatch(currentMatch, player) {
  currentMatch.players.add(player);
  if (currentMatch.kills[player] === undefined) {
    currentMatch.kills[player] = 0;
  }
}
