const express = require("express");

const axios = require("axios");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

const cors = require("cors");

async function startApolloServer() {
    const app = express();
    const server = new ApolloServer({
        // this is schema for graphql
        // here we are defining the type of data we are going to use

        typeDefs: `
      type User {
        id: ID!
        name: String!
        email: String!
        todos: [Todo] 
      }
      type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
      }
      type Query {
        getTodos: [Todo]
        getAllUsers: [User]
        getUser(id: ID!): User
        getTodo (id: ID!): Todo
      }
    `,
        //  this is resolver for graphql
        // here we are defining the function for the type of data we are going to use

        resolvers: {
            // these are here to resolve the data from the api `Todo`
            // that means we are providing whole user object to the todo
            // graphql will then return even from nested query
            Todo: {
                user: async (todo) => {
                    return await axios
                        .get(
                            `https://jsonplaceholder.typicode.com/users/${todo.userId}`
                        )
                        .then((res) => res.data);
                },
            },
            User: {
                todos: async (user) => {
                    return await axios
                        .get(
                            `https://jsonplaceholder.typicode.com/users/${user.id}/todos`
                        )
                        .then((res) => res.data);
                },
            },

            Query: {
                getTodos: async () =>
                    await axios
                        .get(`https://jsonplaceholder.typicode.com/todos`)
                        .then((res) => res.data),

                getAllUsers: async () =>
                    await axios
                        .get(`https://jsonplaceholder.typicode.com/users`)
                        .then((res) => res.data),
                getUser: async (_, { id }) =>
                    await axios
                        .get(`https://jsonplaceholder.typicode.com/users/${id}`)
                        .then((res) => res.data),
                getTodo: async (_, { id }) =>
                    await axios
                        .get(`https://jsonplaceholder.typicode.com/todos/${id}`)
                        .then((res) => res.data),
            },
        },
    });

    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    await server.start();
    app.use("/graphql", expressMiddleware(server));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startApolloServer();
