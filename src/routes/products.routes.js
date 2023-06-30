import { Router } from "express";
// import ProductManager from "../dao/managers/ProductsManager.js";
import productsManagerDB from "../dao/models/products.manager.js";

const router = Router();

const productManager = new productsManagerDB();
let products = [];

router.get("/", async (req, res) => {
    let products = await productManager.getProducts();
    res.send(products);
});

router.get("/:pid", async (req, res) => {
    try {
        const pID = req.params.pid;
        console.log("soy el id", pID);
        const pFound = await productManager.getProductById(pID);
        res.send(pFound);
    } catch (error) {
        res.status(500).send("Error");
    }
});

router.post("/", (req, res) => {
    const product = req.body;
    productManager.addProduct(product);
    res.send({ status: "success" });
});

router.put("/:pid", async (req, res) => {
    const prodID = req.params.pid;
    const prodToAdd= req.body;
    const prodToUpdate = await productManager.updateProduct(prodID, prodToAdd)
    res.send(prodToUpdate)
});

router.delete("/:pid", async (req, res) => {
    try {
        const prodID = req.params.pid;
        const productToDelete = await productManager.deleteProduct(prodID);
        res.send(productToDelete);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error getting data.");
    }
});

export default router;
