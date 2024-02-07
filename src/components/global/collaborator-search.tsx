"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import { useSupabaseUser } from "@/lib/providers/supabase-user-provider";
import { User } from "@/lib/supabase/supabase.types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { getUsersFromSearch } from "@/lib/supabase/queries";

interface CollaboratorSearchProps {
  existingCollaborators: User[] | [];
  getCollborators: (collaborator: User) => void;
  children: React.ReactNode;
}

export default function CollaboratorSearch({
  existingCollaborators,
  getCollborators,
  children,
}: CollaboratorSearchProps): ReactElement {
  const { user } = useSupabaseUser();
  const [searchResults, setSearchResults] = useState<User[] | []>([]);

  // timeRef is used to store a reference to a setTimeout call. This allows
  // for the timeout to be accessed and cleared from anywhere within the
  // component, ensuring that any side effects can be cleaned up (e.g., to
  // prevent memory leaks or actions after the component has unmounted).
  // to debounce the result, we dont want immedietly, on every single onChange
  // fire request, because it's support expensive
  const timeRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // When the component unmounts, it clears the timeout referenced by
    // timeRef.current if it exists.
    return () => {
      if (timeRef.current) clearTimeout(timeRef.current);
    };
  }, []);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (timeRef) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(async () => {
      const res = await getUsersFromSearch(event.target.value);
      setSearchResults(res);
    }, 450);
  };

  const addCollaborator = (user: User) => {
    getCollborators(user);
  };
  return (
    <Sheet>
      <SheetTrigger className="w-full">{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Search collaborator</SheetTitle>
          <SheetDescription>
            <p className="text-sm text-muted-foreground">
              You can also remove collaborators after adding them from the settings tab.
            </p>
          </SheetDescription>
        </SheetHeader>
        <div className="flex justify-center items-center gap-2 mt-2">
          <Search />
          <Input
            name="name"
            className="dark:bg-background"
            placeholder="Email"
            onChange={onChangeHandler}
          />
        </div>
        <ScrollArea
          className="mt-6 overflow-y-scroll w-full rounded-md
        "
        >
          {
            // Together, these conditions ensure the list only includes users who are
            // not already collaborators and are not the current user.
            searchResults
              .filter(
                (result) =>
                  // Essentially, it filters out any result that already exists
                  // existingCollaborators. If some returns true for any item, it means there's
                  // a match, and the result is already an existing collaborator. The use of !
                  // in front of some inverts this logic to exclude these matched items,
                  // ensuring the list only includes users who are not already collaborators
                  !existingCollaborators.some((existing) => existing.id === result.id)
              )
              // to further filter the result items, excluding the one that matches the current
              // user's id, ensuring the user does not appear in their own search result
              .filter((result) => result.id !== user?.id)
              .map((user) => (
                <div key={user.id} className=" p-4 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatarUrl!} />
                      <AvatarFallback>CP</AvatarFallback>
                    </Avatar>
                    <div
                      className="text-sm gap-2 overflow-hidden overflow-ellipsis w-[180px] 
                      text-muted-foreground"
                    >
                      {user.email}
                    </div>
                  </div>
                  <Button variant="secondary" onClick={() => addCollaborator(user)}>
                    Add
                  </Button>
                </div>
              ))
          }
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
