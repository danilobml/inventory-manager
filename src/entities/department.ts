import { Product } from './product';
export type DepartmentProps = {
  id: string;
  name: string;
  products: Product[];
};

export class Department {
  private constructor(readonly props: DepartmentProps) {}

  public static build(name: string) {
    const departmentProps: DepartmentProps = {
      id: crypto.randomUUID().toString(),
      name,
      products: [],
    };
    return new Department(departmentProps);
  }

  public static with(id: string, name: string, products: Product[] = []) {
    return new Department({
      id,
      name,
      products,
    });
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get products(): Product[] {
    return this.props.products;
  }
}
