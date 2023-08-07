const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE_PATH = path.join(__dirname, './db/db.json');

module.exports = { PORT, DB_FILE_PATH };