import { readLogFile, parseLogFile } from './parser.js';
import { generateReport } from './reportGenerator.js';

// Read the log file and parse its content
const logFilePath = './src/data/qgames.log';
const logContent = readLogFile(logFilePath);
const games = parseLogFile(logContent);

console.log(JSON.stringify(games, null, 2));

// Generate and print the report
generateReport(games);
