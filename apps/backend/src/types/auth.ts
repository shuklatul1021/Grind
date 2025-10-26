import z from "zod";

export const SignUpSchema = z.object({
    email : z.email()
})

export const AdminAuthSchema = z.object({
    email : z.email(),
    password : z.string().min(6).max(16)
})