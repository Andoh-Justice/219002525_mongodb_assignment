const express = require('express');
const app = express();
const employees = require('./employees.json');
const todoitems = require('./todolist.json');
const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';

const dbName = 'employeedb';
let db;
let todoCollection;

const client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });

const myConn = async () => {
    try {

        const result = await client.connect();
        db = await result.db(dbName);
        todoCollection = await db.collection('to-do');

        console.log('Database Connected')

    } catch (error) {
        console.log('Database connection failed')
    }
}
myConn();


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/employeeList', (req, res) => {
    res.render('employeelist', { 
        employees 
    });
});

app.get('/todoList', async (req, res)=>{
    const todos = await todoCollection.find().toArray();
    res.render('todolist', {
        todos
    });
});

app.post('/todoitem', async (req, res) => {
   await todoCollection.insertMany(todoitems);
   res.redirect('/todoList');

});

app.listen(3000, ()=>{
    console.log('Server has started on port 3000...')
});