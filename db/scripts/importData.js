let exec = require('child_process').exec;
require('dotenv').config();

const { DB_WRITE_USER, DB_WRITE_PASSWORD } = process.env;

let command = `mongoimport --host Cluster0-shard-0/cluster0-shard-00-00-fuhgr.mongodb.net:27017,cluster0-shard-00-01-fuhgr.mongodb.net:27017,cluster0-shard-00-02-fuhgr.mongodb.net:27017 --ssl --username ${DB_WRITE_USER} --password ${DB_WRITE_PASSWORD} --authenticationDatabase ${DB_WRITE_USER} --db mydbname --collection meteorites --type csv --file db/seedData/meteorites.csv --headerline`;

exec(command, (err, stdout, stderr) => {
  console.log(stdout);
  console.log(stderr);

  if (err) {
    console.log('exec error:', err);
  }
});
