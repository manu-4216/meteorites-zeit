const checkValidParam = require('./checkValidParam');

const checkValidationError = req => {
  let validationError = '';
  let errorField = '';

  // Apply default values if no value passed by the user
  const queryObject = {
    query: req.body.query || '',
    isWordQuery: req.body.isWordQuery || 'off',
    limit: req.body.limit || '',
    offset: req.body.offset || '',
    sort: req.body.sort || ''
  };

  for (const field of ['query', 'isWordQuery', 'offset', 'limit', 'sort']) {
    const value = queryObject[field];

    switch (field) {
      case 'query':
        validationError = checkValidParam({ value, type: 'STRING' });
        break;

      case 'isWordQuery':
        validationError = checkValidParam({ value, type: 'STRING', okValues: ['on', 'off'] });
        break;

      case 'offset':
        validationError = checkValidParam({ value, type: 'NUMBER', min: 0, max: 10000 });
        break;

      case 'limit':
        validationError = checkValidParam({ value, type: 'NUMBER', min: 0, max: 1000 });
        break;

      case 'sort':
        validationError = checkValidParam({ value, type: 'NUMBER', okValues: [-1, 1] });
        break;

      default:
        validationError = '';
        break;
    }

    validationError && console.log('validationError', validationError);

    if (validationError) {
      errorField = field;
      break;
    }
  }

  if (validationError) {
    return {
      error: validationError,
      field: errorField
    };
  }

  return null;
};

module.exports = checkValidationError;
