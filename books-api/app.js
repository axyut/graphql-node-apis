const express = require("express");
require("dotenv").config();

// const schema = require("./schema/schema");
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
} = require("graphql");

const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "world",
      },
    },
  }),
});
const { createHandler } = require("graphql-http/lib/use/express");

const app = express();

app.all(
  "/graphql",
  createHandler({
    schema,
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
