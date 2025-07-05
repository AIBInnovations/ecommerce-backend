// index.js
// Initializes API routes and starts the server

import app, { startServer } from "./express.js";
import userAuthRouter from "./routes/userAuth.route.js";
import userRouter from "./routes/user.route.js";

// Mount authentication routes
app.use("/api/auth", userAuthRouter);

// Mount user management routes
app.use("/api/users", userRouter);

// Initiate server startup
startServer();
