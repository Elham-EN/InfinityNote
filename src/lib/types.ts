import { z } from "zod";

// Create Form Schema Object - Define the shape of your form using a Zod schema
export const FormSchema = z.object({
  email: z.string().describe("Email").email({ message: "Invalid Email" }),
  password: z.string().min(1, "Password is required"),
});
