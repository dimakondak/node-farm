const fs = require('fs');
const server = require('http').createServer();
const stream = require('stream');

server.on('request', (req, res) => {
    // Solution 1: Read the entire file into memory and ONLY THEN send it
    fs.readFile('test-file.txt', (err, data) => {
        if (err) console.log(err);
        res.end(data);
    });

    // Solution 2.1: Create a readable stream and pipe it to the response
    const readableStreamManualPipe = fs.createReadStream('test-file.txt');
    readableStreamManualPipe.on('data', (chunk) => res.write(chunk));
    readableStreamManualPipe.on('end', () => res.end());
    readableStreamManualPipe.on('error', (err) => {
        console.log(err);
        res.statusCode = 500;
        res.end('File not found!');
    });

    // Solution 2.2: Create a readable stream and pipe it to the response
    // with BACKPRESSURE handling
    const readableStreamManualPipeWithBackpressureHandling = fs.createReadStream('test-file.txt');
    readableStreamManualPipeWithBackpressureHandling.on('data', (chunk) => {
        const canContinue = res.write(chunk);
        if (!canContinue) readableStreamManualPipeWithBackpressureHandling.pause();
        res.once('drain', () => readableStreamManualPipeWithBackpressureHandling.resume());
    });
    readableStreamManualPipeWithBackpressureHandling.once('end', () => res.end());

    // Solution 3.1: Use the pipe method
    const readableStreamPipe = fs.createReadStream('test-file.txt');
    readableStreamPipe.pipe(res);

    // Solution 3.2: Use the pipeline method
    const readableStreamPipeline = fs.createReadStream('test-file.txt');
    stream.pipeline(readableStreamPipeline, res, console.log);
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Waiting for requests...');
});