const http = require('http');
const url = require('url');
const fs = require('fs');

const Path = {
    OVERVIEW: '/overview',
    PRODUCT: '/product',
    API: '/api',
};

const products = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const cardTemplate = fs.readFileSync(
    `${__dirname}/templates/template-card.html`, 'utf8');
const overviewTemplate = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`, 'utf8');
const productTemplate = fs.readFileSync(
    `${__dirname}/templates/template-product.html`, 'utf8');

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);
    const productsJson = JSON.parse(products)

    switch (pathname) {
        case Path.OVERVIEW:
            const productCardTemplate =
                productsJson
            .map(product => templateCreator
            .createProductCardTemplate(cardTemplate, product))
            .join('');

            res.writeHead(200, {
                'Content-type': 'text/html',
            });
            res.end(templateCreator.createOverviewTemplate(overviewTemplate,
                productCardTemplate));
            break;
        case Path.PRODUCT:
            const product = productsJson[query.id];
            res.writeHead(200, {
                'Content-type': 'text/html',
            });
            res.end(templateCreator
            .createProductCardTemplate(productTemplate, product));
            break;
        case Path.API:
            res.writeHead(200, {
                'Content-type': 'application/json',
            });
            res.end(products);
            break;
        default:
            res.writeHead(404, {
                'Content-type': 'text/html',
            });
            res.end('<h1>Not Found!</h1>');
    }

});

server.listen(8080, '127.0.0.1', () => {
    console.log('Server listening on port 8080');
});

const templateCreator = {
    createProductCardTemplate: (cardTemplate, product) => cardTemplate
    .replace(/{%PRODUCT_NAME%}/g, product?.productName)
    .replace(/{%ICON%}/g, product?.image)
    .replace(/{%PRICE%}/g, product?.price)
    .replace(/{%FROM%}/g, product?.from)
    .replace(/{%NUTRIENTS_NAME%}/g, product?.nutrients)
    .replace(/{%QUANTITY%}/g, product?.quantity)
    .replace(/{%PRICE%}/g, product?.price)
    .replace(/{%DESCRIPTION%}/g, product?.description)
    .replace(/{%NOT_ORGANIC%}/g, product?.organic ? '' : 'not-organic')
    .replace(/{%ID%}/g, product?.id),
    createOverviewTemplate: (overviewTemplate,
        productCardTemplate) => overviewTemplate
    .replace('{%PRODUCT_CARDS%}', productCardTemplate),
};



