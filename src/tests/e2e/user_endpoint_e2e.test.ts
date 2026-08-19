import request from "supertest"
import app from "../../../app.js"

describe("POST /api/user/register", () => {
    it("should create a new user successfully", async () => {

        const response = await request(app)
            .post("/api/user/register")
            .send({
                email: "ash@gmail.com",
                password: "h11111"
            })

        expect(response.status).toBe(201)
        expect(response.body).toMatchObject({
            message: "User Created Successfully",
            data: {
                id: expect.any(Number),
                token_version: expect.any(Number),
                access_token: expect.any(String),
                role: "USER"
            }
        })
        expect(response.headers["set-cookie"]).toEqual(expect.arrayContaining([expect.stringContaining("refresh_token")]))

    })
    it("should create a new user successfully", async () => {

        const response = await request(app)
            .post("/api/user/register")
            .send({
                email: "ash2@gmail.com",
                password: "h11111"
            })

        const response2 = await request(app)
            .post("/api/user/login")
            .send({
                email: "ash2@gmail.com",
                password: "h11111"
            })

        const access_token = response2.body.data.access_token

        const response3 = await request(app)
            .get("/api/user/me")
            .auth(access_token, { type: "bearer" })

        expect(response.status).toBe(201)
        expect(response2.status).toBe(200)
        expect(response3.status).toBe(200)
        expect(response3.body).toEqual({
            message: "User Details Available",
            data: {
                id: expect.any(Number),
                email: "ash2@gmail.com",
                token_version: 1,
                role: "USER"
            }

        })



    })
})