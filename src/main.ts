import { ApiExpress } from './api/api.express';
import { ProductController } from './controllers/product.controller';
import { AuthController } from './controllers/auth.controller';
import { validateRequest } from './middleware/validate.middleware';
import {
  createUpdateProductSchema,
  buySellProductSchema,
  assignDepartmentToProductSchema,
} from './validation/product.validation';
import { authSchema } from './validation/auth.validation';
import { authenticateRoute } from './middleware/authenticate.middleware';
import { PORT } from './utils/constants.util';
import { DepartmentController } from './controllers/department.controller';
import { createUpdateDepartmentSchema } from './validation/department.validation';

function main() {
  const api = ApiExpress.build();
  const version = api.version;
  const apiBaseRoute = `/api/${version}`;

  // Adding routes:
  const productController = ProductController.build();
  const authController = AuthController.build();
  const departmentController = DepartmentController.build();

  const productsBaseRoute = 'products';
  const authBaseRoute = 'auth';
  const departmentsBaseRoute = 'departments';

  // Auth
  api.addPostRoute(`${apiBaseRoute}/${authBaseRoute}/register`, validateRequest(authSchema), authController.register);

  api.addPostRoute(`${apiBaseRoute}/${authBaseRoute}/login`, validateRequest(authSchema), authController.login);

  // Products
  api.addGetRoute(`${apiBaseRoute}/${productsBaseRoute}`, authenticateRoute, productController.listProductsInInventory);
  api.addGetRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`, authenticateRoute, productController.getProductInfo);
  api.addPostRoute(
    `${apiBaseRoute}/${productsBaseRoute}`,
    authenticateRoute,
    validateRequest(createUpdateProductSchema),
    productController.createNewProduct,
  );
  api.addPostRoute(
    `${apiBaseRoute}/${productsBaseRoute}/:id/buy`,
    authenticateRoute,
    validateRequest(buySellProductSchema),
    productController.buyProduct,
  );
  api.addPostRoute(
    `${apiBaseRoute}/${productsBaseRoute}/:id/sell`,
    authenticateRoute,
    validateRequest(buySellProductSchema),
    productController.sellProduct,
  );
  api.addPutRoute(
    `${apiBaseRoute}/${productsBaseRoute}/:id`,
    authenticateRoute,
    validateRequest(createUpdateProductSchema),
    productController.updateProductInfo,
  );
  api.addPostRoute(
    `${apiBaseRoute}/${productsBaseRoute}/:id/assign-department`,
    authenticateRoute,
    validateRequest(assignDepartmentToProductSchema),
    productController.assigndepartmentToProduct,
  );
  api.addDeleteRoute(`${apiBaseRoute}/${productsBaseRoute}/:id`, authenticateRoute, productController.removeProduct);

  // Department:
  api.addGetRoute(`${apiBaseRoute}/${departmentsBaseRoute}`, authenticateRoute, departmentController.getAllDepartments);
  api.addPostRoute(
    `${apiBaseRoute}/${departmentsBaseRoute}`,
    authenticateRoute,
    validateRequest(createUpdateDepartmentSchema),
    departmentController.createDepartment,
  );
  api.addPostRoute(
    `${apiBaseRoute}/${departmentsBaseRoute}/:id`,
    authenticateRoute,
    validateRequest(createUpdateDepartmentSchema),
    departmentController.updateDepartment,
  );
  api.addDeleteRoute(
    `${apiBaseRoute}/${departmentsBaseRoute}/:id`,
    authenticateRoute,
    departmentController.removeDepartment,
  );

  api.addGetRoute(
    `${apiBaseRoute}/${departmentsBaseRoute}/:id/products`,
    authenticateRoute,
    departmentController.getDepartmentProducts,
  );

  api.start(PORT);
}

main();
