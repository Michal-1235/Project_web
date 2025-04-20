const {Pool} = require('pg');
const {config} = require('../config.secrets')

const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
  });

exports.getMessages = function() {
    return pool.query(`
        select m.*, u.avatar
        from messages m
        left join users u on m.user_id=u.id
    `);
};

exports.addMessage = function(message) {
    return pool.query("insert into messages(id, user_id, text) values($1, $2, $3)", 
[message.id, message.user_id, message.text]);    
};
