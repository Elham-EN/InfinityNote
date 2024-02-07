"use client";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { User, workspace } from "@/lib/supabase/supabase.types";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { Lock, Plus, Share } from "lucide-react";
import { Button } from "../ui/button";
import { v4 } from "uuid";
import { addCollborators, createWorkspace } from "@/lib/supabase/queries";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import CollaboratorSearch from "./collaborator-search";

export default function WorkspaceCreator(): React.ReactElement {
  const { user } = useSupabaseUser();
  const { toast } = useToast();
  const router = useRouter();
  const [permissions, setPermissions] = useState("private");
  const [title, setTitle] = useState("");
  // Collection of users
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addCollaborator = (user: User) => {
    setCollaborators([...collaborators, user]);
  };

  const removeCollaborator = (user: User) => {
    setCollaborators(collaborators.filter((c) => c.id !== user.id));
  };

  const createItem = async () => {
    setIsLoading(true);
    const uuid = v4();
    if (user?.id) {
      console.log("User does exist");
      console.log("You permission is ", permissions);

      const newWorkspace: workspace = {
        data: null,
        createdAt: new Date().toISOString(),
        iconId: "💼",
        id: uuid,
        inTrash: "",
        title,
        workspaceOwner: user.id,
        logo: null,
        bannerUrl: "",
      };
      if (permissions == "private") {
        toast({ title: "Success", description: "Created the workspace" });
        await createWorkspace(newWorkspace);
        router.refresh();
      }
      if (permissions === "shared") {
        console.log("Shared workspace created!");

        toast({ title: "Success", description: "Create the workspace" });
        await createWorkspace(newWorkspace);
        await addCollborators(collaborators, uuid);
        router.refresh();
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 mt-10">
      <div className="flex flex-col gap-4">
        <Label htmlFor="name" className="text-sm text-muted-foreground">
          Name
        </Label>
        <div className="flex justify-center items-center gap-4">
          <Input
            name="name"
            value={title}
            placeholder="Workspace Name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
      </div>
      <>
        <Label htmlFor="permissions" className="text-sm text-muted-foreground">
          Permission
        </Label>
        <Select
          onValueChange={(val) => {
            setPermissions(val);
          }}
          defaultValue={permissions}
        >
          <SelectTrigger className="w-full h-26 -mt-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="private">
                <div className="p-2 flex justify-center items-center gap-4">
                  <Lock />
                  <article className="text-left flex flex-col">
                    <span>Private</span>
                    <p>
                      Your workspace is private to you. You can choose to share it later.
                    </p>
                  </article>
                </div>
              </SelectItem>
              <SelectItem value="shared">
                <div className="p-2 flex gap-4 justify-center items-center">
                  <Share></Share>
                  <article className="text-left flex flex-col">
                    <span>Shared</span>
                    <span>You can invite collaborators.</span>
                  </article>
                </div>
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {permissions === "shared" && (
          <div>
            <CollaboratorSearch
              existingCollaborators={collaborators}
              getCollborators={(user) => {
                addCollaborator(user);
              }}
            >
              <Button type="button" className="text-sm mt-4">
                <Plus />
                Add Collaborators
              </Button>
            </CollaboratorSearch>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">
                Collaborators {collaborators.length || ""}
              </span>
              <ScrollArea
                className="h-[120px] w-full overflow-y-scroll rounded-md border 
                border-muted-foreground/20"
              >
                {collaborators.length ? (
                  collaborators.map((c) => (
                    <div key={c.id} className="p-4 flex justify-betweenitems-center">
                      <div className="flex gap-4 items-center w-[300px]">
                        <Avatar>
                          <AvatarImage src={c.avatarUrl!} className="object-cover" />
                          <AvatarFallback>{c.fullName}</AvatarFallback>
                        </Avatar>
                        <div
                          className="text-sm gap-2 text-muted-foreground overflow-hidden
                          overflow-ellipsis sm:w-[300px] w-[140px]"
                        >
                          {c.email}
                        </div>
                      </div>
                      <Button variant={"secondary"} onClick={() => removeCollaborator(c)}>
                        Remove
                      </Button>
                    </div>
                  ))
                ) : (
                  <div
                    className="absolute right-0 left-0 top-0 bottom-0 flex 
                    justify-center items-center"
                  >
                    <span className="text-muted-foreground text-sm">
                      You have no collaborators
                    </span>
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        )}
        <Button
          type="button"
          disabled={
            !title ||
            (permissions === "shared" && collaborators.length === 0) ||
            isLoading
          }
          onClick={createItem}
        >
          Create
        </Button>
      </>
    </div>
  );
}
