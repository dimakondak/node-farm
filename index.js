const http = require('http');
const url = require('url');
const fs = require('fs');
const slugify = require('slugify');

const TemplateCreator = require('./modules/templateCreator');

const Path = {
    OVERVIEW: '/overview',
    PRODUCT: '/product',
    API: '/api',
};

const cardTemplate = fs.readFileSync(
    `${__dirname}/templates/template-card.html`,
    'utf8'
);
const overviewTemplate = fs.readFileSync(
    `${__dirname}/templates/template-overview.html`,
    'utf8'
);
const productTemplate = fs.readFileSync(
    `${__dirname}/templates/template-product.html`,
    'utf8'
);

const products = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const productsJson = JSON.parse(products);

const slugsMap = new Map(
    productsJson.map(({ id, productName }) => [
        slugify(productName, { lower: true }),
        id,
    ])
);
const templateCreator = new TemplateCreator(slugsMap);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    switch (pathname) {
        case Path.OVERVIEW:
            const productCardTemplate = productsJson
                .map((product) =>
                    templateCreator.createProductCardTemplate(
                        cardTemplate,
                        product
                    )
                )
                .join('');

            res.writeHead(200, {
                'Content-type': 'text/html',
            });
            res.end(
                templateCreator.createOverviewTemplate(
                    overviewTemplate,
                    productCardTemplate
                )
            );
            break;
        case Path.PRODUCT:
            const product = productsJson[slugsMap.get(query.id)];
            res.writeHead(200, {
                'Content-type': 'text/html',
            });
            res.end(
                templateCreator.createProductCardTemplate(
                    productTemplate,
                    product
                )
            );
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
