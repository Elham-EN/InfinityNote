import { z } from "zod";

// Create Form Schema Object - Define the shape of your form using a Zod schema
export const FormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z.string().min(1, "Password is required"),
});

export const SignUpFormSchema = z
  .object({
    email: z.string().describe("Email").email({ message: "Invlid Email" }),
    password: z
      .string()
      .describe("Passward")
      .min(6, "Password must be minimum 6 characters"),
    confirmPassword: z
      .string()
      .describe("Confirm Passward")
      .min(6, "Password must be minimum 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
