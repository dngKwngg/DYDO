import express from "express";
import cors from "cors";

import bodyParser from "body-parser";
import authRoute from "./routes/authRoute.js";
import orderRoute from "./routes/orderRoute.js";
import menuRoute from "./routes/menuRoute.js";
import restaurantRoute from "./routes/restaurantRoute.js";
import userRoute from "./routes/userRoute.js";

const app = express();
app.use(
    cors({
        origin: "http://localhost:3000", // Your frontend's URL
        credentials: true, // allow cookies to be sent from the front-end
    })
);


app.use(bodyParser.json());
app.use("/auth", authRoute);
app.use("/order", orderRoute);
app.use("/menu",menuRoute);
app.use("/restaurant",restaurantRoute);
app.use("/user",userRoute);

export default app;