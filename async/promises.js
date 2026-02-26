const fs = require('fs');
const superagent = require('superagent');

const readFile = async (path) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

const writeFile = async (path, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

readFile('dog.txt')
.then((breed) => superagent.get(
    `https://dog.ceo/api/breed/${breed}/images/random`))
.then((res) => writeFile('dog-image.txt', res.body.message))
.catch((err) => console.log(err));

const getDogImage = async () => {
    try {
        const breed = await readFile('dog.txt');
        console.log('Breed:', breed);

        const res = await superagent.get(
            `https://dog.ceo/api/breed/${breed}/images/random`);
        console.log(res.body.message);

        await writeFile('dog-image.txt', res.body.message);
        console.log('Dog image was saved');
    } catch (err) {
        console.log(err);
    }
    return 'PROMISE RETURN';
};

console.log('Fetching dog image');
const x = getDogImage();
console.log(x);

getDogImage().then(x => {
    console.log(x);
    console.log('Done');
});

(async () => {
    const x = await getDogImage();
    console.log(x);
})();
