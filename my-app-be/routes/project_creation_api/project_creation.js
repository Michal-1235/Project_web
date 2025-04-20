var express = require('express'); // ESM: import
var { getMessages, addMessage } = require('../../models/project_creation_api/project_creation')

var router = express.Router(); // ESM: import

router.get('/', function (req, res, next) {
  getMessages().then(
      (messages) => {
          res.json(messages.rows);
      }
  ).catch(
      (err) => {
          console.log(err);
          res.status(500);
      }
  );
});


router.post('/', function (req, res, next) {
  addMessage(req.body).then(
      (r) => res.status(200)
  ).catch(
      (e) => {
          console.log(e);
          res.status(500);
      }
  );
});



module.exports = router; // ESM: export
