var express = require('express'); // ESM: import
var { get_user } = require('../../models/auth_api/auth.js');
var { comparePassword } = require('../../utils/authHelpers.js');
const { config } = require('../../config/config.js');
var router = express.Router();

router.post("/", (req, res) => {
    const { username, password } = req.body;
    console.log(req.body);
        get_user(username)
        .then((result) => {   
            console.log(result.rows);         
            if (result.rows && result.rows.length === 1) {                
                const userId = result.rows[0].user_id;
                const hashedPassword = result.rows[0].password;    
                const is_admin = result.rows[0].is_admin;            
                comparePassword(password, hashedPassword)
                    .then((isValid) => {
                        if (isValid) {
                            req.session.userId = userId;  // creates session
                            req.session.is_admin = is_admin;  
                            if (is_admin) {
                                return res.status(200).json({ is_admin: true }).end();  
                            }
                            return res.status(200).json({ is_admin: false }).end();  
                      
                        }
                        // invalid password
                        else {
                            console.log("Invalid password");
                            return res.status(401).end();
                        }
                    })
                    .catch((e) => { 
                        console.log(e); 
                        // internal server error
                        res.status(500).end(); 
                    })
            }
            // user does not exist
            else {
                console.log("User does not exist");
                return res.status(401).end();
            }
        })
        .catch((e) => {
            console.log(e);
            return res.status(500).end();
        })
});

router.delete("/", (req, res) => {
    console.log(req.session);
    if (req.session) {        
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                return res.status(500).end();  // internal server error
            } else {
                // clear the cookie in the browser
                res.clearCookie(config.session.cookieName);
                console.log("Session destroyed successfully");
                return res.status(200).end();  // successful logout
            }
        });
    } else {
        console.log("Session does not exist");
        return res.status(400).end();  // bad request - session doesn't exist
    }
});

module.exports = router;