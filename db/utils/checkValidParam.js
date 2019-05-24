const MAX_STRING_LENGTH = 15;

const checkValidParam = ({ value, type, min, max, okValues = [] }) => {
  // No values are allowed to be larger than MAX_STRING_LENGTH characters.
  if (value.length > MAX_STRING_LENGTH) {
    return `The query value should have less than ${MAX_STRING_LENGTH} characters`;
  }

  if (type === 'NUMBER') {
    // Check if it matches a number
    if (!/^-?\d+$/.test(value)) {
      return `The field value should be a number`;
    }

    if ((min && max && +value < min) || +value > max) {
      return `The field value should be in the range: [${min} - ${max}]`;
    }

    if (okValues.length && !okValues.includes(type === 'NUMBER' ? +value : value)) {
      return `The field value is not valid. Acceptable values: ${okValues}`;
    }
  }
};

module.exports = checkValidParam;
