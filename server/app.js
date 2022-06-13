const express = require('express');
const app = express();
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors()); // to allow cross-origin requests



// connect with db

mongoose.connect('mongodb+srv://graphqltest:graphqltest@cluster0.4irfi.mongodb.net/test');

mongoose.connection.once('open',()=>{
    console.log('Connected to db');
})

// middleware to handle graphQl=> single(super charged endpoint) to handle all graphql request
app.use('/graphql',graphqlHTTP({
    schema,  // This schema is defining graph and object types on this graph
    graphiql:true
}))

app.listen(4000,()=>{
    console.log('listening at 4000')
})