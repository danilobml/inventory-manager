export type ProductProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  departmentId?: string | null;
};

export class Product {
  private constructor(readonly props: ProductProps) {}

  public static build(name: string, price: number, departmentId?: string) {
    const productProps: ProductProps = {
      id: crypto.randomUUID().toString(),
      name,
      price,
      quantity: 0,
      departmentId: departmentId || null,
    };
    return new Product(productProps);
  }

  public static with(id: string, name: string, price: number, quantity: number, departmentId?: string | null) {
    return new Product({
      id,
      name,
      price,
      quantity,
      departmentId,
    });
  }

  public get id(): string {
    return this.props.id;
  }

  public get name(): string {
    return this.props.name;
  }

  public get price(): number {
    return this.props.price;
  }

  public get quantity(): number {
    return this.props.quantity;
  }

  public get departmentId(): string | null {
    return this.props.departmentId ?? null;
  }

  public increaseQuantityInStock(amount: number): void {
    this.props.quantity += amount;
  }

  public sell(amount: number): void {
    if (this.props.quantity < amount) {
      throw new Error('The amount in stock in not enough to complete the sell operation.');
    }
    this.props.quantity -= amount;
  }

  public assignDepartment(departmentId: string) {
    this.props.departmentId = departmentId;
  }
}
