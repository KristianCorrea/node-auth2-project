const router = require("express").Router();
const db = require('./user-helpers')

router.get('/', (req, res) => {
    db.getAll()
        .then(users => {
            res.status(200).json(users)
        })
})

module.exports=router;