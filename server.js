const morgan=require('morgan');
const helmet=require('helmet');
const express=require('express');
const server=express();

const dbConnection = require('./data/data-config');

const requiresAuth = require('./auth/requires-auth')

const session =require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const sessionConfig = {
    name: 'bicycle',
    secret: 'secret',
    cookie: {
        maxAge: 1000 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
        knex: dbConnection,
        createtable: true,
        clearInterval: 1000*60*60*24,
    })
};

server.use(session(sessionConfig));

server.use(helmet());
server.use(morgan());
server.use(express.json());

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

server.use(`/api/auth`, authRouter);
server.use(`/api/users`, requiresAuth,usersRouter)

module.exports=server;