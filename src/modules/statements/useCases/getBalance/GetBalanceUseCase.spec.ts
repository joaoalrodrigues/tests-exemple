import { GetBalanceError } from "./GetBalanceError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let createUserUseCase: CreateUserUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;

describe("Get Balance", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to get balance", async () => {
        const createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);

        const user = await createUserUseCase.execute({
            name: "User Test",
            email: "user@teste.com",
            password: "usertest1234"
        });

        const depositValue = 500;

        await createStatementUseCase.execute({
            user_id: user.id!,
            type: OperationType.DEPOSIT,
            amount: depositValue,
            description: "Deposit"
        });

        const response = await getBalanceUseCase.execute({
            user_id: user.id!
        });

        expect(response.balance).toBe(depositValue);
    });

    it("should not be able to get balance of an unexistent user", async () => {
        expect(async () => {
            await getBalanceUseCase.execute({
                user_id: "unexistent-user"
            });
        }).rejects.toBeInstanceOf(GetBalanceError);
    });

});