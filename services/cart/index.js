// index.js
// Initializes API routes and starts the server

import app, { startServer } from "./express.js";
import cartRouter from "./routes/cart.route.js";
import wishlistRouter from "./routes/wishlist.route.js";

app.use("/api/cart", cartRouter);

app.use("/api/wishlist", wishlistRouter);

// Initiate server startup
startServer();
