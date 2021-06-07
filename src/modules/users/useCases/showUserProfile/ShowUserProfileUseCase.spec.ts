import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: IUsersRepository;

describe("Show User Profile", () => {

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);
    });

    it("should show an user's profile", async () => {
        const user = await createUserUseCase.execute({
            name: "User Test",
            email: "user@teste.com",
            password: "usertest1234"
        });

        const userProfile = await showUserProfileUseCase.execute(user.id!);

        expect(userProfile).toEqual(user);
    });

    it("should not show an unexistent user's profile", async () => {
        expect(async () => {
            await showUserProfileUseCase.execute("unexistent-user");
        }).rejects.toBeInstanceOf(ShowUserProfileError);
    });

});