import 'dotenv/config';
import { app } from './app.js';
import { connectToDb, disconnectFromDb } from './database/mongoDB.js'

const PORT = process.env.PORT;
const URI = process.env.URI;

let server = null;

// Connect to the Database and on success start the server
connectToDb(URI)
    .then(() => {
        server = app.listen(PORT, () => {
            console.log(`The server is listening on port ${PORT}`);
        });
    })
    .catch((err) => {
    console.error('Could not connect to the Database!')
    console.error(err);
    process.exit(1);
})

// Gracefully close the server once all running processes end
process.on('SIGTERM', async () => {
    await disconnectFromDb();
    if(server) {
        server.close(() => {
            console.log('Process terminated! Server will stop listening!');
        });
    }
});