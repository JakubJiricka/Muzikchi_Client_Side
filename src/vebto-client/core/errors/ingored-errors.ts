export const ignoredErrors = [
    'Uncaught (in promise): [object Object]',
    'Uncaught (in promise): [object Undefined]',
    '[object Object]',
    '{"isTrusted"\n true}',

    // TEMP ANIMATIONS
    'The animation trigger "transform" has failed to build due to the following errors',
    "Cannot call method 'split' of undefined",
    "Cannot call method 'trim' of undefined",
    "Cannot read property 'length' of undefined",
    'undefined is not a function',
    "'undefined' is not an object",

    //TEMP "CLOSEST" DOM POLYFILL
    "has no method 'closest'",
    "Object doesn't support property or method 'closest'",

    //NOT SUPPORTED BROWSERS
    "Object doesn't support property or method 'setPrototypeOf'",
    'requestAnimationFrame is not defined',
    "Object [object DOMWindow] has no method 'cancelAnimationFrame'",
    "'block' member of ScrollIntoViewOptions 'center' is not a valid value for enumeration ScrollLogicalPosition.",
];