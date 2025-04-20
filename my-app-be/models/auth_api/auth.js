var pool = require('../../config/db.js');



exports.get_user = function(username_email) {   
    console.log("get_user", username_email);
    return pool.query(
        `select "Account_id","password","is_admin" from "public"."Account" WHERE username = $1 OR email = $1`,
        [username_email]
    );
};

