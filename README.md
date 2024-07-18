# QGAMES Log Parser

This is a Node.js application designed to parse and generate reports from Quake game logs. It reads log files, processes the game events, and produces detailed match reports and player rankings.

## How to Install

### Before You Start

Ensure you have Node.js and npm installed. Verify your versions by running the following commands in your terminal:

```bash
node --version
npm --version
```

### Clone the Repository

Clone this repository to your local machine:

```bash
git clone <repository-url>
cd <repository-directory>
```

### Install Dependencies

Run the following command to install the required dependencies:

```bash
npm install
```

## How to Use

### Run the Script

To run the script and process the log files:

```bash
npm run start
```

This command will execute the `src/index.js` script, which reads the log file, parses it, and generates the reports.

### Change What You Track

If you want to change the log file path, modify the following:

  ```javascript
  const logFilePath = './src/data/qgames.log'; // Update the path if necessary
  ```

### Testing

To run the tests, use the following command:

```bash
npm test
```

This will run the tests using Jest and ensure your code is functioning as expected.

## Summary

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Run the script with `npm run start`.
4. Adjust log file path and parsing criteria as needed.
5. Run tests with `npm test`.