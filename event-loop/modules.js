console.log(arguments);
console.log(require('module').wrapper);

const Calculator = require('./module-two');
const calculatorOne = new Calculator();
console.log(calculatorOne.add(1, 2));

const calculatorTwo = require('./module-one');
console.log(calculatorTwo.add(1, 4));

const { multiply } = require('./module-one')
console.log(multiply(2, 3));

require('./module-three')()
require('./module-three')()
require('./module-three')()
