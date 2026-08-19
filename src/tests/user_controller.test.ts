import request from "supertest"
import app from "../../app.js"

import { get_current_user, login_user, register_user } from "../services/user_services.js";
import { sign_token } from "../utils/jwt.js";
import AppError from "../app_error.js";
import { token_auth } from "../utils/authentication.js";

vi.mock("../services/user_services.js", () => ({
    register_user: vi.fn(),
    login_user: vi.fn(),
    get_current_user: vi.fn()
}))

vi.mock("../utils/authentication.js", () => ({
    token_auth: vi.fn()
}))

vi.mock("../utils/jwt.js", () => ({
    sign_token: vi.fn()
}))

const access_token = "2222222"
const refresh_token = "2wcedddddd"


describe("POST /api/user/register", () => {

    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("should register a user", async () => {

        vi.mocked(register_user).mockResolvedValue({
            id: 1,
            role: "USER",
            token_version: 1,
        })


        vi.mocked(sign_token).mockReturnValue({
            access_token, refresh_token
        })

        const response = await request(app)
            .post("/api/user/register")
            .send({
                email: "hello@gmail.com",
                password: "hamza1010",
            })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            message: "User Created Successfully",
            data: {
                id: 1,
                role: "USER",
                token_version: 1,
                access_token: "2222222",
            },
        })
        expect(register_user).toHaveBeenCalledWith({
            email: "hello@gmail.com", password: "hamza1010"
        })
        expect(sign_token).toHaveBeenCalledWith({
            id: 1,
            role: "USER",
            token_version: 1
        })
        expect(response.headers["set-cookie"]).toEqual(expect.arrayContaining([expect.stringContaining("refresh_token")]))
    })

    it("should throw a user already exists error", async () => {

        vi.mocked(register_user).mockRejectedValue(new AppError("User Already Exists", 409))

        const response = await request(app)
            .post("/api/user/register")
            .send({
                email: "hello@gmail.com",
                password: "hamza1010",
            })

        expect(response.status).toBe(409)
        expect(response.body).toEqual({
            message: "User Already Exists"
        })

        expect(sign_token).not.toHaveBeenCalled()

    })

    it("should fail because of a validation error", async () => {

        const response = await request(app)
            .post("/api/user/register")
            .send({
                email: "hello@gmail.com",
                password: "ha",
            })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
            message: expect.stringContaining("Password Must Be Between 5 & 10 Characters")
        })

        expect(register_user).not.toHaveBeenCalled()

    })
})

describe("POST /api/user/login", () => {

    beforeEach(() => {
        vi.resetAllMocks()
    })

    it("should login user successfully", async () => {

        vi.mocked(login_user).mockResolvedValue({
            id: 1,
            role: "USER",
            token_version: 1
        })

        vi.mocked(sign_token).mockReturnValue({
            access_token, refresh_token
        })

        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: "hmail@gmail.com",
                password: "hamza"
            })

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            message: "User Logged In Successfully",
            data: {
                id: 1,
                role: "USER",
                token_version: 1,
                access_token: access_token
            }
        })
        expect(login_user).toHaveBeenCalledWith({
            email: "hmail@gmail.com",
            password: "hamza"
        })
        expect(sign_token).toHaveBeenCalledWith({
            id: 1,
            role: "USER",
            token_version: 1,
        })
        expect(response.headers["set-cookie"]).toEqual(expect.arrayContaining([expect.stringContaining("refresh_token")]))


    })
    it("should fail when credentials don't match", async () => {

        vi.mocked(login_user).mockRejectedValue(new AppError("Invalid Credentials", 401))

        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: "hmail@gmail.com",
                password: "hamza"
            })

        expect(response.status).toBe(401)
        expect(response.body).toEqual({
            message: "Invalid Credentials",
        })
        expect(login_user).toHaveBeenCalledWith({
            email: "hmail@gmail.com",
            password: "hamza"
        })
        expect(sign_token).not.toHaveBeenCalled()
        expect(response.headers["set-cookie"]).toBeUndefined()

    })
    it("should fail when credentials are in the wrong format", async () => {

        const response = await request(app)
            .post("/api/user/login")
            .send({
                email: "hmailgmail.com",
                password: "hamza"
            })

        expect(response.status).toBe(400)
        expect(response.body).toMatchObject({
            message: expect.stringContaining("Enter A Valid Email"),
        })

        expect(login_user).not.toHaveBeenCalled()
        expect(response.headers["set-cookie"]).toBeUndefined()

    })


})

describe("GET /api/user/me", () => {

    it("should return the details of the current user", async () => {


        vi.mocked(token_auth).mockImplementation(async (req, res, next) => {
            req.user = {
                id: 1,
                role: "USER",
                token_version: 1,
            }

            next()
        })

        vi.mocked(get_current_user).mockResolvedValue({
            email: "hamz@gmail.com",
            role: "USER",
            token_version: 1,
            id: 1
        })

        const response = await request(app)
            .get("/api/user/me")
        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            message: "User Details Available",
            data: {
                email: "hamz@gmail.com",
                role: "USER",
                token_version: 1,
                id: 1
            }
        })

        expect(get_current_user).toHaveBeenCalledWith(1)



    })

})