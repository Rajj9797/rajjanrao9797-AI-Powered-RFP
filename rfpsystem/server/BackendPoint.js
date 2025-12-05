const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const PORT = parseInt(process.env.PORT, 10) || 5000;

module.exports = `http://localhost:${PORT}`;