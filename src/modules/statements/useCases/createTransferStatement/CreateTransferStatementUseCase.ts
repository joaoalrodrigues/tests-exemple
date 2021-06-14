import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { CreateTransferStatementError } from "./CreateTransferStatementError";

@injectable()
export class CreateTransferStatementUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository
    ) { }

    async execute({ user_id, type, amount, description, sender_id }: ICreateStatementDTO): Promise<Statement> {
        if (user_id === sender_id) {
            throw new CreateTransferStatementError.SameUser();
        }

        const receiver = await this.usersRepository.findById(user_id);

        if (!receiver) {
            throw new CreateTransferStatementError.UserNotFound();
        }

        const { balance } = await this.statementsRepository.getUserBalance({ user_id: sender_id! });

        if (balance < amount) {
            throw new CreateTransferStatementError.InsufficientFunds();
        }

        const statementOperation = await this.statementsRepository.create({
            user_id,
            type,
            amount,
            description,
            sender_id
        });
        console.log(statementOperation);
        return statementOperation;
    }
}
