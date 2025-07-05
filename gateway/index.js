const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://auth:4000",
    changeOrigin: true,
    pathRewrite: { "^/auth": "/api/auth" },
  })
);

app.use(
  "/product",
  createProxyMiddleware({
    target: "http://product:4001",
    changeOrigin: true,
    pathRewrite: { "^/product": "/api/products" },
  })
);

app.use(
  "/categories",
  createProxyMiddleware({
    target: "http://categories:4001",
    changeOrigin: true,
    pathRewrite: { "^/categories": "/api/categories" },
  })
);

app.use(
  "/coupons",
  createProxyMiddleware({
    target: "http://coupons:4001",
    changeOrigin: true,
    pathRewrite: { "^/coupons": "/api/coupons" },
  })
);

app.use(
  "/ratings",
  createProxyMiddleware({
    target: "http://ratings:4001",
    changeOrigin: true,
    pathRewrite: { "^/ratings": "/api/ratings" },
  })
);

app.use(
  "/cart",
  createProxyMiddleware({
    target: "http://cart:4002",
    changeOrigin: true,
    pathRewrite: { "^/cart": "/api/cart" },
  })
);

app.use(
  "/wishlist",
  createProxyMiddleware({
    target: "http://wishlist:4002",
    changeOrigin: true,
    pathRewrite: { "^/wishlist": "/api/wishlist" },
  })
);

app.use("/health", (req, res) => {
  res.send("Gateway is running");
});

app.listen(8000, () => console.log("Gateway running on port 8000"));
