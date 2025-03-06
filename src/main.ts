import { ApiExpress } from "./api/api.express";
import { ProductController } from "./controllers/product.controller";
import { AuthController } from "./controllers/auth.controller";
import { validateRequest } from "./middlewares/validate.middleware";
import { createProductSchema, buySellProductSchema } from "./validation/product.validation";
import { authSchema } from "./validation/auth.validation";
import { authenticateRoute } from "./middlewares/authenticate.middleware";
import { PORT } from "./utils/constants.util";


function main() {
    const api = ApiExpress.build();
    const version = api.version;
    const apiBaseRoute = `/api/${version}`;

    // Adding routes:
    const productController = ProductController.build();
    const authController = AuthController.build();

    const productsBaseRoute = "products";
    const authBaseRoute = "auth";

    api.addGetRoute(
        `${apiBaseRoute}/${productsBaseRoute}`,
        authenticateRoute,
        productController.listProductsInInventory
    );
    api.addGetRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`, productController.getProductInfo);
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}`, 
        validateRequest(createProductSchema), 
        productController.createNewProduct
    );
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}/:id/buy`, 
        validateRequest(buySellProductSchema), 
        productController.buyProduct
    );
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}/:id/sell`, 
        validateRequest(buySellProductSchema), 
        productController.sellProduct
    );
    api.addDeleteRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`, productController.removeProduct);
    
    api.addPostRoute(
        `${apiBaseRoute}/${authBaseRoute}/register`,
        validateRequest(authSchema),
        authController.register
    )
    api.addPostRoute(
        `${apiBaseRoute}/${authBaseRoute}/login`,
        validateRequest(authSchema),
        authController.login
    )

    api.start(PORT);
}

main();