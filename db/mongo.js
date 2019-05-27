const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const checkValidationError = require('./utils/checkValidationError');

const url = process.env.DB_URL_QUERY;
const dbName = 'mydbname';
const meteoritesCollectionName = 'meteorites';

const getConvertedQueryParams = ({ body }) => ({
  query: body.query.toLowerCase(),
  isWordQuery: body.isWordQuery || 'off',
  offset: +body.offset,
  limit: +body.limit,
  sort: +body.sort
});

const mongo = (req, res) => {
  const validationError = checkValidationError(req);
  if (validationError) {
    res.status(400).json({
      field: validationError.field,
      error: validationError.error
    });
    console.log('Validation error!. Not continuing');
    return;
  }

  const convertedQueryParams = getConvertedQueryParams(req);
  const { query, isWordQuery, offset, limit, sort } = convertedQueryParams;

  MongoClient.connect(
    url,
    { useNewUrlParser: true, keepAlive: true, keepAliveInitialDelay: 300000 },
    function(err, client) {
      if (err) {
        res.json({ error: err });
        console.log('Error connecting to the db', err);
        return;
      }

      console.log('Connected successfully to server');
      const db = client.db(dbName);
      const collection = db.collection(meteoritesCollectionName);

      const formatedQuery = {};

      // Make use of the faster word query. If not, use the regex
      if (isWordQuery === 'on' && query) {
        formatedQuery.$text = { $search: query };
      } else if (query) {
        formatedQuery.name = new RegExp(query, 'i');
      }

      collection
        .find(formatedQuery)
        .sort({ name: sort })
        .skip(offset)
        .limit(limit)
        .toArray(function(err, result) {
          if (err) {
            res.json({ error: err });
            console.log('Error quering the db', err);
            client.close();
            return;
          }

          res.json({ queryDetails: convertedQueryParams, result: result });
          console.log('Success quering the db. Result count:', result.length);
          client.close();
        });
    }
  );
};

module.exports = mongo;
