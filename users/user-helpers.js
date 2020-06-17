const db = require('../data/data-config');

function getAll(){
    return db('users')
}

function addUser(user){
    return db('users')
    .insert(user)
}

function findBy(filter){
    return db("users").where(filter).orderBy("id");
}

module.exports = {getAll, addUser, findBy}