// index.js
// Initializes API routes and starts the server

import app, { startServer } from "./express.js";
import productRouter from "./routes/product.route.js";
import categoryRouter from "./routes/category.route.js";
import couponRouter from "./routes/coupon.route.js";
import ratingreviewtRouter from "./routes/ratingreview.route.js";

app.use("/api/products", productRouter);

app.use("/api/categories", categoryRouter);

app.use("/api/coupons", couponRouter);

app.use("/api/ratings", ratingreviewtRouter);

// Initiate server startup
startServer();
