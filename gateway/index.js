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
  "/order",
  createProxyMiddleware({
    target: "http://order:5001",
    changeOrigin: true,
    pathRewrite: { "^/order": "/api/order" },
  })
);

app.use("/health", (req, res) => {
  res.send("Gateway is running");
});

app.listen(8000, () => console.log("Gateway running on port 8000"));
