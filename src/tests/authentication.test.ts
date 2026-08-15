import prisma from "../prisma_init.js";
import { token_auth } from "../utils/authentication.js";
import { verify_access_token } from "../utils/jwt.js";
import { Role } from "@prisma/client";

vi.mock("../prisma_init.js", () => ({
    default: {
        user: {
            findUnique: vi.fn()
        }
    }
}))

vi.mock("../utils/jwt.js", () => ({
    verify_access_token: vi.fn()
}))


describe("tests the authentication module", () => {

    beforeEach(() => {
        vi.resetAllMocks()
    })

    it("should fail because request won't contain authorization in header", async () => {

        const req = {
            headers: {},
        } as any

        const res = {
        } as any

        const next = vi.fn()

        await expect(token_auth(req, res, next)).rejects.toThrow("Authorization Required")

        expect(prisma.user.findUnique).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()

    })
    it("should fail because authorization will be in the wrong format", async () => {

        const req = {
            headers: {
                authorization: "hello"
            }
        } as any

        const res = {
        } as any

        const next = vi.fn()

        await expect(token_auth(req, res, next)).rejects.toThrow("Invalid Authorization Format")

        expect(prisma.user.findUnique).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()

    })
    it("should fail because user will be not be found in db", async () => {

        const req = {
            headers: {
                authorization: "Bearer somestuff123"
            },
        } as any

        const res = {
        } as any

        const next = vi.fn()

        const payload = {
            user_id: 1,
            token_version: 1,
            role: "USER"
        }

        vi.mocked(verify_access_token).mockReturnValue(payload)
        vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

        await expect(token_auth(req, res, next)).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Unauthorized]`)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: {
                id: payload.user_id
            },
            select: {
                token_version: true,
                email: true,
                role: true,
                id: true
            }
        })

        expect(next).not.toHaveBeenCalled()

    })
    it("should fail because token version will be not match the one found in db", async () => {

        const req = {
            headers: {
                authorization: "Bearer somestuff123"
            },
        } as any

        const res = {
        } as any

        const next = vi.fn()

        const payload = {
            user_id: 1,
            token_version: 1,
            role: "USER"
        }

        const user = {
            token_version: 2,
            email: "rnadom@gmail.com",
            role: Role.USER,
            id: 1
        }
        vi.mocked(verify_access_token).mockReturnValue(payload)
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any)

        await expect(token_auth(req, res, next)).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Token Invalid]`)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: {
                id: payload.user_id
            },
            select: {
                token_version: true,
                email: true,
                role: true,
                id: true
            }
        })

        expect(next).not.toHaveBeenCalled()
        expect(req.user).toBeUndefined()

    })
    it("authentication should succeed successfully", async () => {

        const req = {
            headers: {
                authorization: "Bearer somestuff123"
            },
        } as any

        const res = {
        } as any

        const next = vi.fn()

        const payload = {
            user_id: 1,
            token_version: 1,
            role: "USER"
        }

        const user = {
            token_version: 1,
            email: "rnadom@gmail.com",
            role: Role.USER,
            id: 1
        }
        vi.mocked(verify_access_token).mockReturnValue(payload)
        vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any)

        await token_auth(req, res, next)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: {
                id: payload.user_id
            },
            select: {
                token_version: true,
                email: true,
                role: true,
                id: true
            }
        })

        expect(next).toHaveBeenCalledOnce()
        expect(req.user).toMatchObject({
            id: user.id,
            role: user.role,
            token_version: user.token_version
        })

    })


})