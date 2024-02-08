/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { useAppState } from "@/lib/providers/state-provider";
import { workspace } from "@/lib/supabase/supabase.types";
import React, { ReactElement, useEffect, useState } from "react";
import SelectedWorkspace from "./selected-workspace";
// Modal Component
import CustomDialogTrigger from "../global/custom-dialog-trigger";
// Create Workspace Form inside the Modal Component
import WorkspaceCreator from "../global/workspace-creator";

interface WorkspaceDropdownProps {
  privateWorkspaces: workspace[] | [];
  sharedWorkspaces: workspace[] | [];
  collaboratingWorkspaces: workspace[] | [];
  defaultValue: workspace | undefined;
}

/**
 * designed to manage and display a dropdown selection of workspaces. It takes
 * arrays of private, shared, and collaborating workspaces as props, along with
 * a default workspace value. The component uses these to populate the dropdown
 * menu.
 */
export default function WorkspaceDropdown({
  privateWorkspaces,
  sharedWorkspaces,
  collaboratingWorkspaces,
  defaultValue,
}: WorkspaceDropdownProps): ReactElement {
  const { dispatch, state } = useAppState();
  const [selectedOption, setSeletedOption] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    // Check if our state has any workspaces
    if (!state.workspaces.length) {
      // If it doesn't have one, then setup a workspace from
      // one of those props and workspaces need to have empty folders
      dispatch({
        type: "SET_WORKSPACES",
        payload: {
          workspaces: [
            ...privateWorkspaces,
            ...sharedWorkspaces,
            ...collaboratingWorkspaces,
          ].map((workspace) => ({ ...workspace, folders: [] })),
        },
      });
    }
  }, [privateWorkspaces, sharedWorkspaces, collaboratingWorkspaces]);

  const handleSelect = (option: workspace) => {
    setSeletedOption(option);
    setIsOpen(false);
  };

  useEffect(() => {
    console.log(selectedOption);

    const findSelectedWorkspace = state.workspaces.find(
      (workspace) => workspace.id === defaultValue?.id
    );
    if (findSelectedWorkspace) setSeletedOption(findSelectedWorkspace);
  }, [state, defaultValue]);

  return (
    <div className="relative inline-block text-left">
      <div>
        <span onClick={() => setIsOpen(!isOpen)}>
          {selectedOption ? (
            <SelectedWorkspace workspace={selectedOption} />
          ) : (
            "Select a workspace"
          )}
        </span>
      </div>
      {isOpen && (
        <div
          className="origin-top-right absolute w-full rounded-md shadow-md z-50
          h-[190px] md:h-[490px] backdrop-blur-lg group overflow-y-scroll 
          border-[1px] border-muted"
        >
          <div className="rounded-md flex flex-col">
            <div className="!p-2">
              {!!privateWorkspaces.length && (
                <div className="flex flex-col justify-center">
                  <p>Private Workspace</p>
                  <hr />
                  {privateWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </div>
              )}
              {!!sharedWorkspaces.length && (
                <>
                  <p className="text-muted-foreground">Shared</p>
                  <hr />
                  {sharedWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
              {!!collaboratingWorkspaces.length && (
                <>
                  <p className="text-muted-foreground">Collaborating</p>
                  <hr />
                  {collaboratingWorkspaces.map((option) => (
                    <SelectedWorkspace
                      key={option.id}
                      workspace={option}
                      onClick={handleSelect}
                    />
                  ))}
                </>
              )}
            </div>
            <CustomDialogTrigger
              header="Create A Workspace"
              content={<WorkspaceCreator />}
              description="Workspaces give you the power to collaborate with others. You can change your workspace privacy settings after creating the workspace too"
            >
              <div
                className="flex gap-2 p-2 w-full items-center justify-center transition-all 
                  hover:bg-muted rounded-md "
              >
                <article
                  className=" text-slate-300 rounded-full bg-slate-600 w-6 h-6
                  flex items-center justify-center"
                >
                  +
                </article>
                Create workspace
              </div>
            </CustomDialogTrigger>
          </div>
        </div>
      )}
    </div>
  );
}
