const mongoose = require('mongoose');

function connect() {
    mongoose.connect(process.env.DB_URL)
        .then(() => console.log('Connected!'))
        .catch(() => console.log('Error!!!'));
}

module.exports = { connect };