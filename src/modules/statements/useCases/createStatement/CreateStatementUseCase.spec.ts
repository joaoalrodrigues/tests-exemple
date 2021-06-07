import { CreateStatementError as error } from "./CreateStatementError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;

describe("Create Statement", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to create a statement", async () => {
        const user = await createUserUseCase.execute({
            name: "User Test",
            email: "user@teste.com",
            password: "usertest1234"
        });

        const statement = await createStatementUseCase.execute({
            user_id: user.id!,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: "Deposit"
        });

        expect(statement).toHaveProperty("id");
    });

    it("should not be able to create a statement with an unexistent user", async () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: "unexistent-user",
                type: OperationType.DEPOSIT,
                amount: 1000,
                description: "Deposit"
            });
        }).rejects.toBeInstanceOf(error.UserNotFound);
    });

    it("should not be able to create a withdraw statement with insuficient funds", async () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "User Test",
                email: "user@teste.com",
                password: "usertest1234"
            });

            await createStatementUseCase.execute({
                user_id: user.id!,
                type: OperationType.WITHDRAW,
                amount: 1000,
                description: "Withdraw"
            });
        }).rejects.toBeInstanceOf(error.InsufficientFunds);
    });

});