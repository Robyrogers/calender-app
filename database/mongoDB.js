import mongoose from 'mongoose';

const connection = mongoose.connection;

const connectToDb = async (uri) => {
    await mongoose.connect(uri);
}

const disconnectFromDb = async () => {
    await connection.close();
}

connection.on('connected', () => {
    console.info('Connected to the Database!');
});

connection.on('disconnected', () => {
    console.info('Disconnected to the Database!');
})

export { connectToDb, disconnectFromDb };