import prisma from "../prisma_init.js";
import bcrypt from "bcrypt"
import { register_user, login_user } from "../services/user_services.js";
import { delete_supplier } from "../services/supplier_services.js";
import { Role } from "@prisma/client";
import { Type } from "@prisma/client";
import { create_transaction } from "../services/transaction_services.js";

const tx = {
    product: {
        updateMany: vi.fn(),
        update: vi.fn()
    },
    transaction: {
        create: vi.fn()
    }
};

vi.mock(("../prisma_init.js"), () => ({
    default: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn()
        },
        supplier: {
            findUnique: vi.fn(),
            delete: vi.fn()
        },
        product: {
            count: vi.fn().mockResolvedValue(0),
            findUnique: vi.fn()
        },
        $transaction: vi.fn().mockImplementation(async callback => {
            const res = await callback(tx)
            return res
        })
    }
}))

vi.mock(("bcrypt"), () => ({
    default: {
        hash: vi.fn().mockResolvedValue("hashed"),
        compare: vi.fn()
    }
}))

// describe("tests the register_user service", () => {
//     beforeEach(() => {
//         vi.clearAllMocks()
//     })

//     it("throws an error if user exists", async () => {

//         const data = {
//             email: "hamza@gmail.com",
//             password: "password123",
//         };


//         const existingUser = {
//             id: 1,
//             email: "hamza@gmail.com",
//             password: "hashed-password",
//             role: Role.USER,
//             date_created: new Date(),
//             token_version: 1,
//         };


//         vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser)

//         await expect(register_user(data)).rejects.toMatchObject({
//             "message": "User Already Exists",
//             "status": 409
//         })

//         expect(prisma.user.findUnique).toHaveBeenCalledWith({
//             where: {
//                 email: data.email
//             }
//         })

//         expect(bcrypt.hash).not.toHaveBeenCalled()
//         expect(prisma.user.create).not.toHaveBeenCalled()
//     })

//     it("returns a new created user", async () => {

//         const data = {
//             email: "hamza@gmail.com",
//             password: "password123",
//         };

//         const new_user = {
//             id: 1,
//             email: "hamza@gmail.com",
//             password: "hashed-password",
//             role: Role.USER,
//             date_created: new Date(),
//             token_version: 1,

//         }

//         const user = {
//             id: 1,
//             role: "USER",
//             token_version: 1
//         }


//         vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
//         vi.mocked(bcrypt.hash).mockResolvedValue()
//         vi.mocked(prisma.user.create).mockResolvedValue(new_user)

//         await expect(register_user(data)).resolves.toEqual(user)

//         expect(prisma.user.findUnique).toHaveBeenCalledWith({
//             where: {
//                 email: data.email
//             }
//         })

//         expect(bcrypt.hash).toHaveBeenCalled()
//         expect(prisma.user.create).toHaveBeenCalled()

//     })

//     it("throws an error because user was not created in the database", async () => {
//         const data = {
//             email: "hamza@gmail.com",
//             password: "password123",
//         };

//         vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
//         vi.mocked(bcrypt.hash).mockResolvedValue()
//         vi.mocked(prisma.user.create).mockRejectedValue(new Error)

//         await expect(register_user(data)).rejects.toThrow()
//     })

// })


// describe("tests the login_user service", () => {

//     beforeEach(() => {
//         vi.clearAllMocks()
//     })

//     it("throws an error if usser does not exist", async () => {

//         const data = {
//             email: "asukuhamza1@gmail.com"
//             , password: "hello"
//         }

//         vi.mocked(prisma.user.findUnique).mockResolvedValue(null)
//         await expect(login_user(data)).rejects.toMatchObject({
//             message: "Invalid Credentials",
//             status: 401
//         })

//         expect(prisma.user.findUnique).toHaveBeenCalledWith({
//             where: {
//                 email: data.email
//             }
//         })

//         expect(bcrypt.compare).not.toHaveBeenCalled()


//     })

//     it("throws an error if a wrong password is entered", async () => {

//         const data = {
//             email: "asukuhamza1@gmail.com"
//             , password: "hello"
//         }

//         const existing_user = {
//             id: 1,
//             email: "asukuhamza1@gmail.com",
//             date_created: new Date,
//             password: "hashed",
//             role: Role.USER,
//             token_version: 1
//         }


//         vi.mocked(prisma.user.findUnique).mockResolvedValue(existing_user)
//         vi.mocked(bcrypt.compare).mockResolvedValue(false)

//         await expect(login_user(data)).rejects.toMatchObject({
//             message: "Invalid Credentials",
//             status: 401
//         })

//         expect(prisma.user.findUnique).toHaveBeenCalledWith({
//             where: {
//                 email: data.email
//             }
//         })

//     })

// })

// describe("tests the delete supplier service", () => {
//     it("throws an error if supplier does not exist", async() => {

//         const supplier_id = 1

//         vi.mocked(prisma.supplier.findUnique).mockResolvedValue(null)

//         await expect(delete_supplier(supplier_id)).rejects.toMatchObject({
//             "message": "Supplier Does Not Exist",
//             "status": 404
//         })

//         expect(prisma.product.count).not.toHaveBeenCalled()
//         expect(prisma.supplier.delete).not.toHaveBeenCalled()

//     })

//     it("throws an error if supplier is associated with at least one product", async  () => {

//         const supplier_id = 1

//         const supplier = {
//             id: 1,
//             date_created: new Date,
//             name: "ABC Tech"
//         }

//         vi.mocked(prisma.supplier.findUnique).mockResolvedValue(supplier)
//         vi.mocked(prisma.product.count).mockResolvedValue(10)

//         await expect(delete_supplier(supplier_id)).rejects.toMatchObject({
//             "message": "Cannot Delete Supplier: Associated Products Present",
//             "status": 409
//         })

//         expect(prisma.product.count).toHaveBeenCalled()
//         expect(prisma.supplier.delete).not.toHaveBeenCalled()

//     })

//     it("should delete the supplier successfully", async  () => {

//         const supplier_id = 1

//         const supplier = {
//             id: 1,
//             date_created: new Date,
//             name: "ABC Tech"
//         }

//         vi.mocked(prisma.supplier.findUnique).mockResolvedValue(supplier)
//         vi.mocked(prisma.product.count).mockResolvedValue(0)

//         await expect(delete_supplier(supplier_id)).resolves.toMatchObject({
//              message: "Supplier Successfully Deleted"
//         })

//         expect(prisma.product.count).toHaveBeenCalled()
//         expect(prisma.supplier.delete).toHaveBeenCalled()

//     })
// })

// describe("tests the transaction_service", () => {

//     beforeEach(() => {
//         vi.clearAllMocks()
//     })

//     it("carries out a successfull out transaction", async () => {

//         const data = {
//             product_id: 1,
//             quantity: 1,
//             type: Type.OUT,
//         }

//         const product = {
//             id: 1,
//             date_created: new Date(),
//             quantity: 5,
//             supplier_id: 1,
//             name: "PC"
//         }

//         const new_transaction = {
//             product_id: data.product_id,
//             quantity: data.quantity,
//             type: data.type,
//             user_id: 1,
//         }

//         vi.mocked(prisma.product.findUnique).mockResolvedValue(product)

//         vi.mocked(tx.product.updateMany).mockResolvedValue({
//             count: 1
//         })

//         vi.mocked(tx.transaction.create).mockResolvedValue(new_transaction)

//         await expect(create_transaction(data, 1)).resolves.toEqual(new_transaction)

//         expect(prisma.product.findUnique).toHaveBeenCalledWith(
//             {
//                 where: {
//                     id: data.product_id
//                 }
//             }
//         )

//         expect(tx.product.update).not.toHaveBeenCalled()

//     })

//     it("carries out a successfull IN transaction", async () => {

//         const data = {
//             product_id: 1,
//             quantity: 1,
//             type: Type.IN,
//             supplier_id: 1
//         }

//         const product = {
//             id: 1,
//             date_created: new Date(),
//             quantity: 5,
//             supplier_id: 1,
//             name: "PC"
//         }

//         const supplier = {
//             id: 1,
//             name: "ABC",
//             date_created: new Date()
//         }

//         const new_transaction = {
//             product_id: data.product_id,
//             quantity: data.quantity,
//             type: data.type,
//             user_id: 1,
//             supplier_id: data.supplier_id
//         }

//         vi.mocked(prisma.product.findUnique).mockResolvedValue(product)
//         vi.mocked(prisma.supplier.findUnique).mockResolvedValue(supplier)
//         vi.mocked(tx.transaction.create).mockResolvedValue(new_transaction)

//         await expect(create_transaction(data, 1)).resolves.toEqual(new_transaction)

//         expect(prisma.product.findUnique).toHaveBeenCalledWith({
//             where: {
//                 id: product.id
//             }
//         })

//         expect(tx.product.updateMany).not.toHaveBeenCalled()

//     })

//     it("tests a failed transaction creation", async () => {

//        const data = {
//             product_id: 1,
//             quantity: 1,
//             type: Type.OUT,
//         }

//         const product = {
//             id: 1,
//             date_created: new Date(),
//             quantity: 5,
//             supplier_id: 1,
//             name: "PC"
//         }

//         const new_transaction = {
//             product_id: data.product_id,
//             quantity: data.quantity,
//             type: data.type,
//             user_id: 1,
//         }

//         vi.mocked(prisma.product.findUnique).mockResolvedValue(product)

//         vi.mocked(tx.product.updateMany).mockResolvedValue({
//             count: 1
//         })

//         vi.mocked(tx.transaction.create).mockRejectedValue(new Error("Database Error: Transaction Failed"))

//         await expect(create_transaction(data, 1)).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: Database Error: Transaction Failed]`)// testing this could have just said toThrow("Database Error: Transaction Failed")

//     })


// })