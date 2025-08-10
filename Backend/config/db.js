const mongoose = require('mongoose');

const ConnectDB = async (mongoURL) => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Database connected')
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);

    }
}

module.exports = ConnectDB;