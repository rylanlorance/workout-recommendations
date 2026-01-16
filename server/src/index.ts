import express from "express";
import { ApolloServer } from "apollo-server-express";
import { InMemoryLRUCache } from "apollo-server-caching";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import { typeDefs } from "./schema/typeDefs";
import { resolvers } from "./resolvers";

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
const PORT = process.env["PORT"] || 4000;

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env["CORS_ORIGIN"] || "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env["NODE_ENV"] || "development",
  });
});

// Create cache instance
const cache = new InMemoryLRUCache({
  maxSize: Math.pow(2, 20) * 50, // 50MB
});

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  cache,
  context: ({ req }) => {
    // Add any context you need here (auth, user info, etc.)
    return {
      req,
      cache,
      // Add user from JWT token or session here
      user: null,
    };
  },
  introspection: process.env["NODE_ENV"] !== "production",
  plugins: process.env["NODE_ENV"] !== "production" ? [] : [],
});

async function startServer() {
  try {
    await server.start();
    server.applyMiddleware({ app: app as any, path: "/graphql" });

    app.listen(PORT, () => {
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      );
      console.log(
        `📊 Health check available at http://localhost:${PORT}/health`
      );
      console.log(
        `🌍 Environment: ${process.env["NODE_ENV"] || "development"}`
      );

      if (process.env["NODE_ENV"] !== "production") {
        console.log(
          `🎮 GraphQL Playground: http://localhost:${PORT}${server.graphqlPath}`
        );
      }
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  server.stop().then(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  server.stop().then(() => {
    process.exit(0);
  });
});

startServer();
