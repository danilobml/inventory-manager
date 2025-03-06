export type UserProps = {
    id: string;
    email: string;
    password: string;
}

export class User {
    private constructor(readonly props: UserProps) {}

    public static build(email: string, password: string) {
        const productProps: UserProps = {
            id: crypto.randomUUID().toString(),
            email,
            password
        }
        return new User(productProps);
    }

    public static with(id: string, email: string, password: string) {
        return new User({id, email, password});
    }

    public get id(): string {
        return this.props.id;
    }

    public get email(): string {
        return this.props.email;
    }

    public get password(): string {
        return this.props.password;
    }
}