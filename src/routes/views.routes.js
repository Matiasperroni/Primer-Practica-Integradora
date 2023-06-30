import { Router } from 'express';
// import ProductManager from '../dao/managers/ProductsManager.js';
import productsManagerDB from '../dao/models/products.manager.js';
const productManager = new productsManagerDB();

const router = Router();

router.get("/", async (req, res) => {
    console.log("estas en /");
    const products = await productManager.getProducts()
    console.log(products);
    res.render("home", {products})
})




export default router;