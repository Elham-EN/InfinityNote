"use client"; //* Component Client
import { AuthUser } from "@supabase/supabase-js";
import React, { ReactElement, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Subscription, workspace } from "@/lib/supabase/supabase.types";
import EmojiPicker from "../global/emoji-picker";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { CreateWorkspaceFormSchema } from "@/lib/types";
import { v4 } from "uuid";
import { Button } from "../ui/button";
import Loader from "../global/Loader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createWorkspace } from "@/lib/supabase/queries";
import { useAppState } from "@/lib/providers/state-provider";

interface DashboardSetupProps {
  user: AuthUser;
  subscription: Subscription | null;
}

function DashboardSetup({ user, subscription }: DashboardSetupProps): ReactElement {
  const [selectedEmoji, setSelectedEmoji] = useState("💼");
  const { dispatch } = useAppState();
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const {
    register, // Register field input into the hook
    handleSubmit, // Receive the form data if form validation is successful
    reset, // Reset the entire form state, fields reference, and subscriptions
    // This object contains information about the entire form state. It helps to
    // keep on track with the user's interaction with your form application.
    formState: { isSubmitting, isLoading, errors },
  } = useForm<z.infer<typeof CreateWorkspaceFormSchema>>({
    mode: "onChange",
    defaultValues: {
      logo: "",
      workspaceName: "",
    },
  });

  type CreateWorkspaceFormSchemaType = z.infer<typeof CreateWorkspaceFormSchema>;

  const onSubmit: SubmitHandler<CreateWorkspaceFormSchemaType> = async (value) => {
    const file = value.logo?.[0];
    let filePath = null;
    const workspaceUUID = v4();
    if (file) {
      try {
        // Upload logo file to Supabase Storage
        const { data, error } = await supabase.storage
          .from("workspace-logos")
          .upload(`workspaceLogo.${workspaceUUID}`, file, {
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error("Failed to upload");
        filePath = data.path;
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error! Could not upload your workspace logo",
        });
      }
    }
    try {
      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: selectedEmoji,
        id: workspaceUUID,
        inTrash: "",
        title: value.workspaceName,
        workspaceOwner: user.id,
        logo: filePath || null,
        bannerUrl: "",
      };
      // Add new Workspace to the PostgreSQL Database
      const { data, error: createError } = await createWorkspace(newWorkspace);
      if (createError) {
        throw new Error("Failed to create new workspace");
      }
      dispatch({
        type: "ADD_WORKSPACE",
        payload: { ...newWorkspace, folders: [] },
      });
      console.log("Toast Here!");
      toast({
        title: "Workspace Created",
        description: `${newWorkspace.title} has been created successfully`,
      });
      router.replace(`/dashboard/${newWorkspace.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Could not create your workspace",
        description:
          "Oops! Something went wrong, and we couldn't create your workspace. Try again or come back later.",
      });
    } finally {
      reset();
    }
  };

  return (
    <Card className="w-[700px] h-screen sm:h-auto">
      <CardHeader>Create a Workspace</CardHeader>
      <CardDescription className="pl-6 pr-6">
        Lets create a private workspace to get you started. You can add collaborators
        later from the workspace settings tab.
      </CardDescription>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 mt-5">
            <div className="flex items-center gap-4">
              <div className="text-5xl">
                <EmojiPicker getValue={(emoji) => setSelectedEmoji(emoji)}>
                  {selectedEmoji}
                </EmojiPicker>
              </div>
              <div className="w-full ">
                <Label htmlFor="workspaceName" className="text-sm text-muted-foreground">
                  Name
                </Label>
                <Input
                  id="workspaceName"
                  type="text"
                  placeholder="Workspace Name"
                  disabled={isLoading}
                  {...register("workspaceName", {
                    required: "Workspace name is required",
                  })}
                />
                <small className="text-red-600">
                  {errors?.workspaceName?.message?.toString()}
                </small>
              </div>
            </div>
            <div>
              <Label
                htmlFor="logo"
                className="text-sm
                  text-muted-foreground"
              >
                Workspace Logo
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                {...register("logo", {
                  required: false,
                })}
              />
              <small className="text-red-600">{errors.logo?.message?.toString()}</small>
              {subscription?.status !== "active" && (
                <small className="text-muted-foreground block">
                  To customize your workspace, you need to be on a Pro Plan
                </small>
              )}
            </div>
            <div className="self-end">
              <Button disabled={isLoading} type="submit">
                {!isLoading ? "Create Workspace" : <Loader />}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default DashboardSetup;
