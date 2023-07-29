import path from "path";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
//router files
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js"
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const port = process.env.PORT || 5000;

//Connect to MongoDB
connectDB();

const app = express();

//Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Cookie parser middleware
app.use(cookieParser());


//Mount the router
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

//when client need the PAYPAL_CLIENT_ID they can make a api calll to this route and get it.
app.get("/api/config/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Below part is once image/file is uploaded to uploads folder, then makes a route '/uploads' to serve static files 
// from the uploads directory located in the same directory as the current module.
const __dirname = path.resolve(); //setting __dirname to current directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


if(process.env.NODE_ENV === "production") {
//set static folder (build folder will be created in frontend ar the time of deployment by running built command).
app.use(express.static(path.join(__dirname, "/frontend/build")));

//This is wildcard route (*) and sends the index.html file from the "frontend/build" directory for any route that is not explicitly defined. 
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
});

} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}


//Error Handeling middleware
app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${port}`);
});