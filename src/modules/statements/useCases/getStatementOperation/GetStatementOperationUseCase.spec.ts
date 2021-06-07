import { GetStatementOperationError as error } from "./GetStatementOperationError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let usersRepository: IUsersRepository;
let statementsRepository: IStatementsRepository;

describe("Get Statement Operation", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);
        createUserUseCase = new CreateUserUseCase(usersRepository);
    });

    it("should be able to get a statement operation", async () => {
        const user = await createUserUseCase.execute({
            name: "User Test",
            email: "user@teste.com",
            password: "usertest1234"
        });

        const statementId = (await createStatementUseCase.execute({
            user_id: user.id!,
            type: OperationType.DEPOSIT,
            amount: 1000,
            description: "Deposit"
        })).id;

        const statement = await getStatementOperationUseCase.execute({
            user_id: user.id!,
            statement_id: statementId!
        });

        expect(statement.id).toBe(statementId);
    });

    it("should not be able to get a statement operation for an unexistent user", async () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({
                user_id: "unexistent-user",
                statement_id: ""
            });
        }).rejects.toBeInstanceOf(error.UserNotFound);
    });

    it("should not be able to get an unextistent statement operation", async () => {
        expect(async () => {
            const user = await createUserUseCase.execute({
                name: "User Test",
                email: "user@teste.com",
                password: "usertest1234"
            });

            await getStatementOperationUseCase.execute({
                user_id: user.id!,
                statement_id: "unexistent-statement"
            });
        }).rejects.toBeInstanceOf(error.StatementNotFound);
    });

});