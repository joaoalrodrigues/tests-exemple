import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";


let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;

describe("Create User", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should create an user", async () => {
        const user = await createUserUseCase.execute({
            name: "User Test",
            email: "user@teste.com",
            password: "usertest1234"
        });

        expect(user).toHaveProperty("id");
    });

    it("should not create an user who already exists", async () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "User Test",
                email: "user@teste.com",
                password: "usertest1234"
            });

            await createUserUseCase.execute({
                name: "User Test 2",
                email: user.email,
                password: "usertest123456"
            });
        }).rejects.toBeInstanceOf(CreateUserError);
    });

});