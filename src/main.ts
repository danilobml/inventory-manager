import { ApiExpress } from "./api/api.express";
import { ProductController } from "./controllers/product.controller";
import { AuthController } from "./controllers/auth.controller";
import { validateRequest } from "./middlewares/validate.middleware";
import { createUpdateProductSchema, buySellProductSchema } from "./validation/product.validation";
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

    // Auth
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

    // Products
    api.addGetRoute(
        `${apiBaseRoute}/${productsBaseRoute}`,
        authenticateRoute,
        productController.listProductsInInventory
    );
    api.addGetRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`,
        authenticateRoute,
        productController.getProductInfo
    );
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}`,
        authenticateRoute,
        validateRequest(createUpdateProductSchema), 
        productController.createNewProduct
    );
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}/:id/buy`,
        authenticateRoute,
        validateRequest(buySellProductSchema), 
        productController.buyProduct
    );
    api.addPostRoute(`${apiBaseRoute}/${productsBaseRoute}/:id/sell`,
        authenticateRoute,
        validateRequest(buySellProductSchema), 
        productController.sellProduct
    );
    api.addPutRoute(
        `${apiBaseRoute}/${productsBaseRoute}/:id`,
        authenticateRoute,
        validateRequest(createUpdateProductSchema),
        productController.updateProductInfo
    )
    api.addDeleteRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`,
        authenticateRoute,
        productController.removeProduct
    );

    api.start(PORT);
}

main();