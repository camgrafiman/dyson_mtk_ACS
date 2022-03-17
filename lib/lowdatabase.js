const Datastore = require('nedb');
const db = new Datastore({ filename: __dirname + '/nedb/database.db' })
db.loadDatabase();

export default function getDB() {
    /* BASE DE DATOS LOWDB */

    return db;
}


