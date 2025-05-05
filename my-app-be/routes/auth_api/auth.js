var express = require('express'); // ESM: import
var { get_user } = require('../../models/auth_api/auth.js');
var { comparePassword } = require('../../utils/authHelpers.js');
const { config } = require('../../config/config.js');
var router = express.Router();

router.post("/", (req, res) => {
    const { username, password } = req.body;
        get_user(username)
        .then((result) => {          
            if (result.rows && result.rows.length === 1) {                
                const Account_Id = result.rows[0].Account_id;
                const hashedPassword = result.rows[0].password;    
                const is_admin = result.rows[0].is_admin;            
                comparePassword(password, hashedPassword)
                    .then((isValid) => {
                        if (isValid) {
                            req.session.Account_Id = Account_Id;  // creates session
                            req.session.is_admin = is_admin;  
                            console.log(Account_Id, is_admin);
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
    console.log(req.session.Account_Id);
    if (req.session.Account_Id) {        
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
        return res.status(400).end();  // bad request - session doesn't exist
    }
});

router.get("/", (req, res) => {
    if (req.session.Account_Id) {
      return res.status(200).json({
        isLoggedIn: true,
        is_admin: req.session.is_admin || false,
        Account_Id: req.session.Account_Id
      });
    } else {
      return res.status(200).json({
        isLoggedIn: false,
        is_admin: false,
        Account_Id: null
      });
    }
  });

module.exports = router;