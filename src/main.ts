import dotenv from "dotenv"

import { ApiExpress } from "./api/api.express";
import { ProductController } from "./controllers/product.controller";

dotenv.config();
const PORT = process.env.PORT || 3001;

function main() {
    const api = ApiExpress.build()

    const version = api.version;
    const apiBaseRoute = `/api/${version}`

    // Adding routes:
    const productController = ProductController.build();
    const productsBaseRoute = "products";
    
    api.addGetRoute(`${apiBaseRoute}/${productsBaseRoute}`, productController.listProductsInInventory);
    api.addGetRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`, productController.getProductInfo);
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}`, productController.createNewProduct);
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}/:id/buy`, productController.buyProduct);
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}/:id/sell`, productController.sellProduct);
    api.addDeleteRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`, productController.removeProduct)

    api.start(PORT);
}

main();
