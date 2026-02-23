export const templateCreator = {
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