import fs from 'fs';
import { readLogFile, parseLogFile, addDataToMatch, updateCurrentMatch } from '../src/parser.js';

// log content from file
const logFilePath = './src/data/qgames.log';
const logContent = fs.readFileSync(logFilePath, 'utf-8');

// Tests for parseLogFile function
describe('parseLogFile', () => {
  test('should correctly parse the log file', () => {
    const games = parseLogFile(logContent);

    expect(games).toHaveProperty('game_1');
    expect(games.game_1).toHaveProperty('total_kills');
    expect(games.game_1).toHaveProperty('players');
    expect(games.game_1).toHaveProperty('kills');
  });
});

// Tests for updateCurrentMatch function
describe('updateCurrentMatch', () => {
  let currentMatch;

  beforeEach(() => {
    currentMatch = {
      total_kills: 0,
      players: new Set(),
      kills: {}
    };
  });

  test('should correctly update total kills and call addDataToMatch', () => {
    const line = '20:54 Kill: 1022 2 22: <world> killed Isgalamido by MOD_TRIGGER_HURT';
    updateCurrentMatch(line, currentMatch);

    expect(currentMatch.total_kills).toBe(1);
    expect(currentMatch.kills['Isgalamido']).toBe(-1); // Assuming addDataToMatch was correctly called and processed
  });

  test('should not call addDataToMatch if no match is found', () => {
    const line = '20:54 Kill: invalid format';
    updateCurrentMatch(line, currentMatch);

    expect(currentMatch.total_kills).toBe(1); // Still increments because it doesn't validate match
    expect(currentMatch.kills['Player2']).toBeUndefined();
  });
});

// Tests for addDataToMatch function
describe('addDataToMatch', () => {
  let currentMatch;

  beforeEach(() => {
    currentMatch = {
      total_kills: 0,
      players: new Set(),
      kills: {}
    };
  });

  test('should correctly add a player kill', () => {
    addDataToMatch(currentMatch, 'Player1', 'Player2');
    
    expect(currentMatch.players.has('Player1')).toBe(true);
    expect(currentMatch.players.has('Player2')).toBe(true);
    expect(currentMatch.kills['Player1']).toBe(1);
  });

  test('should correctly handle world kill', () => {
    addDataToMatch(currentMatch, '<world>', 'Player2');

    expect(currentMatch.players.has('Player2')).toBe(true);
    expect(currentMatch.kills['Player2']).toBe(-1);
    expect(currentMatch.kills['<world>']).toBeUndefined();
  });
});

