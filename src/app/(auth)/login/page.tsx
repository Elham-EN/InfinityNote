"use client"; // React Client Component (Traditional)

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { FormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/brandLogo.png";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/Loader";
import { actionLoginUser } from "@/lib/server-action/auth.actions";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string>("");

  // Define a form
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: "onSubmit", // Validation is triggered on the submit event
    resolver: zodResolver(FormSchema), // Integrates with your preferred schema validation library
    defaultValues: { email: "", password: "" },
  });

  const isLoading = form.formState.isSubmitting;

  type SubmitHandlerType = SubmitHandler<z.infer<typeof FormSchema>>;

  // Define a submit handler.
  const onSubmit: SubmitHandlerType = async (formdata, event) => {
    event?.preventDefault();
    // Do something with the form values.
    const { error } = await actionLoginUser(formdata);
    if (error) {
      form.reset();
      setSubmitError(error.message);
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError("");
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full flex flex-col space-y-6 sm:justify-center sm:w-[500px]"
      >
        <Link
          href={"/"}
          className="w-full flex justify-start md:justify-center items-center "
        >
          <Image
            src={Logo}
            alt="infinitynote-logo"
            height={50}
            width={250}
            className=""
          />
        </Link>
        <FormDescription className="dark:text-brand-washedPurple text-lg sm:text-x">
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>
        <FormField
          disabled={isLoading}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                  className="py-6 text-md sm:text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="py-6 text-md md:text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <FormMessage>{submitError}</FormMessage>}
        <Button
          type="submit"
          disabled={isLoading}
          size={"lg"}
          className="text-md"
        >
          {!isLoading ? "Login" : <Loader />}
        </Button>
        <span className="self-center">
          Dont have an account?{" "}
          <Link href={"/signup"} className=" text-purple-400 font-semibold">
            Sign Up
          </Link>
        </span>
      </form>
    </Form>
  );
}
