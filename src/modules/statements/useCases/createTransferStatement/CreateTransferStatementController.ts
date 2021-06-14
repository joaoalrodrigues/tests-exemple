import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { OperationType } from '../../entities/Statement';

import { CreateTransferStatementUseCase } from './CreateTransferStatementUseCase';

export class CreateTransferStatementController {
    async execute(request: Request, response: Response) {
        const { user_id } = request.params;
        const { id: sender_id } = request.user;
        const { amount, description } = request.body;

        const createTransferStatement = container.resolve(CreateTransferStatementUseCase);

        const statement = await createTransferStatement.execute({
            user_id,
            amount,
            description,
            type: OperationType.TRANSFER,
            sender_id
        });

        return response.status(201).json(statement);
    }
}
