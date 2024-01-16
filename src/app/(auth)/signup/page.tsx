"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { FormSchema, SignUpFormSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../../public/brandLogo.png";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ReactElement, useMemo, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/global/Loader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MailCheck } from "lucide-react";
import { actionSignUp } from "@/lib/server-action/auth.actions";

export default function SignUpPage(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitError, setSubmitError] = useState<string>("");
  const [confirmation, setConfirmation] = useState<boolean>(false);

  /**
   * Skipping expensive recalculations - Supabase will re-route
   * to this page and use params to determine if there is any
   * sort of errorss [cache the result of a calculation between
   * re-renders]. Return the same value again if the dependencies
   * have not changed since the last render
   */
  const codeExchangeError = useMemo(() => {
    if (!searchParams) return "";
    return searchParams.get("error_description");
  }, [searchParams]);

  const confirmationAndError = useMemo(
    () =>
      clsx("bg-primary", {
        "bg-red-500/10": codeExchangeError,
        "border-red-500/50": codeExchangeError,
        "text-red-700": codeExchangeError,
      }),
    []
  );

  type SignUpFormSchemaType = z.infer<typeof SignUpFormSchema>;

  // Create & Define form
  const form = useForm<SignUpFormSchemaType>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const isLoading = form.formState.isSubmitting;

  type SubmitHandlerType = SubmitHandler<SignUpFormSchemaType>;

  type FormSchemaType = z.infer<typeof FormSchema>;

  const onSubmit: SubmitHandlerType = async (
    { email, password }: FormSchemaType,
    event
  ) => {
    event?.preventDefault();
    const { error } = await actionSignUp({ email, password });
    if (error) {
      setSubmitError(error.message);
      form.reset();
      return;
    }
    setConfirmation(true);
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
        <FormField
          disabled={isLoading}
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  {...field}
                  className="py-6 text-md md:text-lg"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitError && <FormMessage>{submitError}</FormMessage>}
        {!confirmation && !codeExchangeError && (
          <Button
            type="submit"
            disabled={isLoading}
            size={"lg"}
            className="text-md"
          >
            {!isLoading ? "Create Account" : <Loader />}
          </Button>
        )}
        <span className="self-center">
          Already have an account?{" "}
          <Link href={"/login"} className=" text-purple-400 font-semibold">
            Sign In
          </Link>
        </span>
        {(confirmation || codeExchangeError) && (
          <>
            <Alert className={confirmationAndError}>
              {!codeExchangeError && <MailCheck className="h-4 w-4" />}
              <AlertTitle>
                {codeExchangeError ? "Invalid Link" : "Check your email"}
              </AlertTitle>
              <AlertDescription>
                {codeExchangeError || "An email confirmation has been sent."}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  );
}
