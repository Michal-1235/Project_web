var pool = require('../../config/db.js');

exports.register = async function(data) {
    
    return pool.query(`
        INSERT INTO "public"."Account" ("username", "password", "email", "is_admin")
        VALUES 
            ($1, $2, $3, false);`,
        [data.username, data.password, data.email]);
};

exports.check_username_email = function(username_email) {
    return pool.query(`
        SELECT * from "public"."Account" 
            WHERE username = $1 OR email = $1`,
        [username_email]);  
};
