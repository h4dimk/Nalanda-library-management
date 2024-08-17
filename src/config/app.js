import { ApolloServer } from "apollo-server-express";
import { typeDefs } from "../graphql/typeDefs.js";
import { resolvers } from "../graphql/resolvers.js";
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./db.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import userRoutes from "../routes/userRoutes.js";
import bookRoutes from "../routes/bookRoutes.js";
import borrowRoutes from "../routes/borrowRoutes.js";
import reportRoutes from "../routes/reportRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

// Set up API routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/borrow", borrowRoutes);
app.use("/api/reports", reportRoutes);

const context = ({ req }) => {
  const token = req.cookies?.access_token || "";
  if (token) {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
    } catch (err) {
      console.error("Invalid token:", err);
      throw new Error("Unauthorized");
    }
  }
  return { req };
};

// Set up GraphQL API
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
});

const startServer = async () => {
  try {
    await server.start();
    server.applyMiddleware({ app });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

startServer();

export default app;
