const router = require("express").Router();
const db=require('../users/user-helpers');
const bcrypt=require('bcryptjs');
const jwt = require('jsonwebtoken')

function createToken(user){
    const payload={
        subject: user.id,
        username: user.username,
        department: user.department
    };
    const secret = process.env.JWT_SECRET || 'secret'
    const options = {
        expiresIn: '1d',
    }
    return jwt.sign(payload, secret, options)
}

router.post('/register', (req, res)=>{
    const { username, password, department}=req.body;

    const rounds=8;
    const hash=bcrypt.hashSync(password, rounds);

    db.addUser({username, password:hash, department})
        .then(user=>{
            res.status(200).json(user)
        })
        .catch(err=>{
            console.log('Failed to register', err)
            res.status(500).json({message: 'error registering'})
        })
})

router.post('/login', (req,res) => {
    const { username, password } = req.body;
    db.findBy({ username })
    .then(([user]) => {
        console.log("USER IN LOGIN",user)
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = createToken(user)
            req.session.user = {id: user.id, username: user.username}
            res.status(200).json({welcome: user.username, session: req.session, token})
        } else {
            res.status(401).json({message: "you can not pass!!!"})
        }
    })
    .catch(err => res.send(err));
})

router.delete("/logout", (req, res) => {
    if(req.session) {
        req.session.destroy(error=>{
            if(error){
                res.status(500).json({message: "couldn't log out"});
            } else {
                res.status(204).end();
            }
        })
    } else {
        res.status(204).end();
    }
})
module.exports=router;