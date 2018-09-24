const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://shopify:password1@ds119702.mlab.com:19702/graphql-tutorial');
mongoose.connection.once('open', () => {
  console.log('connected to database');
})

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(3000,() => {console.log("Now listening on port 3000")});
