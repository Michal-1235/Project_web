var express = require('express'); // ESM: import
var { hashPassword } = require('../../utils/authHelpers.js');
var { check_username_email, register } = require('../../models/register_api/register.js')

var router = express.Router(); // ESM: import

router.get('/', function (req, res, next) {
    const username = req.query.username;
    if (!username) {
        res.status(400).end();
        return;
    }
    check_username_email(username).then(
        (query) => {
            if (query.rowCount === 0) {
                res.status(404).end(); // username doesnt exist
            } else {
                res.status(200).end(); // username exists
            }
        }
    ).catch(
        (err) => {
            console.log(err);
            res.status(500).end(); 
        }
    );
});

router.post('/', async function (req, res, next) { // Add 'async' here
    try {
        req.body.password = await hashPassword(req.body.password); // Await works now
        console.log(req.body);
        await register(req.body); 
        res.status(200).end(); 
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
});



module.exports = router; // ESM: export
