const fs = require('fs');
const crypto = require('crypto');
const start = Date.now();

process.env.UV_THREADPOOL_SIZE = 4;

console.log('START');

setTimeout(() => console.log('Timeout 1'), 0);
setTimeout(() => console.log('Timeout without props'));
setImmediate(() => console.log('Immediate 1'));

process.nextTick(() => console.log('next Tick 1'));

fs.readFile('test-file.txt', (file) => {
    console.log('I/O finished');
    console.log('------------------');

    setTimeout(() => console.log('Timeout 2'), 0);
    setTimeout(() => console.log('Timeout 3'), 3000);
    setTimeout(() => console.log('Timeout without props 2'));

    setImmediate(() => console.log('Immediate 2'));

    process.nextTick(() => console.log('next Tick 2'));

    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => console.log(Date.now() - start, 'Password encrypted'));
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => console.log(Date.now() - start, 'Password encrypted'));
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => console.log(Date.now() - start, 'Password encrypted'));
    crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => console.log(Date.now() - start, 'Password encrypted'));
    crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512');
    console.log(Date.now() - start, 'Password encrypted SYNC')

})

console.log('END');