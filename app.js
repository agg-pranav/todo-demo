const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const chalk = require('chalk');
const {MongoClient} = require('mongodb');
const passport  = require('passport');
const cookieParser = require('cookie-parser')
const session = require('express-session')

const PORT  = process.env.PORT || 3000;
const app = express();

app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser())
app.use(session({secret:"TodoAppSecret"}))

require('./src/config/passport.js')(app);

app.set('view engine', 'ejs');
app.set('views', './src/views');

const todoRouter = express.Router();

app.get('/',(req,res) => {
    res.render('index',{title:'ToDo app'});
})

app.post('/todos',(req,res) => {
    debug(req.body)
    const {username, password} = req.body;
    if(!username || !password) {
        res.status(400).json({message:'Please provide username and password'});
    }
    else {
        const url = 'mongodb://localhost:27017';
        const dbName = 'todos';
        const client = new MongoClient(url);
        debug('Here1')
        try {
            client.connect(async (err) => {
                if(err) {
                    debug(err);
                    return res.status(500).json({message:'Internal Server Error'});
                }
                debug('Connected successfully to server');
                const db = client.db(dbName);
                const col = db.collection('users');
                const user = await col.findOne({username});
                if(user) {
                    return res.status(400).json({message:'User already exists'});
                }
                const userObj = {username,password};
                const result = await col.insertOne(userObj);
                debug(result);
            });
        } catch (err) {
            res.status(400).json({message:'Unable to connect to database'});
        }
    }
    res.render('todo',{user:username});
})

app.listen(PORT,() => {debug(`Running on port ${chalk.red(PORT)}`)});