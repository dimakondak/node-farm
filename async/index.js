const fs = require('fs');
const https = require('https');
const superagent = require('superagent');

fs.readFile('dog.txt', 'utf8', (err, breed) => {
    if (err) {
        return console.log(err);
    }
    
    console.log(breed);

    // Native
    https.get(`https://dog.ceo/api/breed/${breed}/images/random`, (res) => {
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', (chunk) => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                console.log(parsedData);
            } catch (e) {
                console.error(e.message);
            }
        });
    });

    // Native node 18+
    fetch(`https://dog.ceo/api/breed/${breed}/images/random`)
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
    });

    // third-party superagent lib
    superagent
    .get(`https://dog.ceo/api/breed/${breed}/images/random`)
    .end((err, res) => {
        console.log(res.body);

        fs.writeFile('dog-image.txt', res.body.message, (err) => {
            if (err) {
                return console.log(err);
            }
            console.log('Finished');
        });
    });
});

