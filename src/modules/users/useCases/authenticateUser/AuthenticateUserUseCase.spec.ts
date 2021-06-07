import 'dotenv/config';
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";


let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: IUsersRepository;

describe("Authenticate User", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    });

    it("should authenticate an user", async () => {
        const password = "usertest1234";

        const user = await createUserUseCase.execute({
            name: "User Test",
            email: "user@teste.com",
            password: password
        });

        const response = await authenticateUserUseCase.execute({
            email: user.email,
            password: password
        });

        expect(response).toHaveProperty("token");
    });

    it("should not authenticate an unexistent user", async () => {
        expect(async () => {
            await authenticateUserUseCase.execute({
                email: "unexistent@user.com",
                password: "123456"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

    it("should not authenticate an user with incorrect password", async () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "User Test",
                email: "user@teste.com",
                password: "usertest1234"
            });

            await authenticateUserUseCase.execute({
                email: user.email,
                password: "123456"
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
    });

});