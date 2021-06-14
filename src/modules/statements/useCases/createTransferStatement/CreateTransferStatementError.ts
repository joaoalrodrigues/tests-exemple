import { AppError } from "../../../../shared/errors/AppError";

export namespace CreateTransferStatementError {
    export class UserNotFound extends AppError {
        constructor() {
            super('User not found', 404);
        }
    }

    export class InsufficientFunds extends AppError {
        constructor() {
            super('Insufficient funds', 400);
        }
    }

    export class SameUser extends AppError {
        constructor() {
            super('Destination account should be different from Origin account', 400);
        }
    }
}
