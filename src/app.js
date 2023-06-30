import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
// import ProductManager from "./dao/managers/ProductsManager.js";
import productsManagerDB from './dao/models/products.manager.js';
import mongoose from "mongoose";
// const passwordDB = "fcKP3TXvcILtCNWu"
const MONGO_URL = `mongodb+srv://Matias-Perroni:fcKP3TXvcILtCNWu@cluster0.ymwavy3.mongodb.net/ecommerce?retryWrites=true&w=majority`;

//instance of server
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mongoose
    .connect(MONGO_URL)
    .then((conn) => console.log("Conected with MongoDB in URL " + MONGO_URL))
    .catch((err) => console.log(err));

//static files
app.use(express.static(__dirname + "/public"));

//setting handlerbars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

//server http
const serverHttp = app.listen(8080, () => {
    console.log("Listening port 8080");
});

const productManager = new productsManagerDB();
app.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts");
});
//websocket
const io = new Server(serverHttp);
//function to get products
const sendProductList = async () => {
    const products = await productManager.getProducts();
    return products;
};

//routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

io.on("connection", async (socket) => {
    console.log("Nuevo cliente conectado");
    const products = await sendProductList();
    socket.emit("sendProducts", products);
});
