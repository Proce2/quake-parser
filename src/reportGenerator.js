import { parseLogFile, readLogFile } from './parser.js';

// Read the log file and parse its content
const logFilePath = './src/data/qgames.log';
const logContent = readLogFile(logFilePath);
const games = parseLogFile(logContent);

// Main function to generate and print the report
export const generateReport = () => {
  const matchReport = generateMatchReport(games);
  const playerRanking = generatePlayerRanking(games);
  console.log(matchReport);
  console.log('\n', playerRanking);
};

// Generate report for each match
export const generateMatchReport = (games) => {
  return Object.keys(games).map(gameKey => {
    const { total_kills, players, kills } = games[gameKey];
    const report = `
      Match: ${gameKey}
      Total Kills: ${total_kills}
      Players: ${Array.from(players).join(', ')}
      Kills: ${generateKillsReport(kills)}
    `;
    return report.trim();
  }).join('\n\n');
};

// Generate kills report for each player in a match
export const generateKillsReport = (kills) => {
  return Object.keys(kills)
    .map(player => `${player}: ${kills[player]}`)
    .join(', ');
};

// Generate player ranking based on total kills across all matches
export const generatePlayerRanking = (games) => {
  const playerKills = {};

  Object.values(games).forEach(({ kills }) => {
    Object.entries(kills).forEach(([player, count]) => {
      playerKills[player] = (playerKills[player] || 0) + count;
    });
  });

  const ranking = Object.keys(playerKills)
    .sort((a, b) => playerKills[b] - playerKills[a])
    .map((player, index) => `${index + 1}. ${player}: ${playerKills[player]}`)
    .join('\n');

  return `Player Ranking:\n${ranking}`;
};

// Call the main function to generate the report
generateReport();

