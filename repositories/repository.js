/**
 * 
 * Library to Oracle class
 */
require('dotenv').config(); // Load environment variables
const oracle = require('../database/oracle');

const connection = 
// development
{
    user: process.env.USER_DATABASE ,
    password: process.env.PASSWORD_DATABASE,
    connectString: process.env.CONNECT_STRING
};


/**
 * Repository class create the connection to batabase and recive the  connection variable
 */
class Repository extends oracle.Repository {
    constructor() {
        super(connection);
    }
}

module.exports = Repository;