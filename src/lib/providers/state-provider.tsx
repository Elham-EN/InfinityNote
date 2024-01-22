"use client";

import React, {
  useReducer,
  useContext,
  useEffect,
  useMemo,
  Dispatch,
  createContext,
  ReactElement,
} from "react";

import { File, Folder, workspace } from "../supabase/supabase.types";
import { usePathname } from "next/navigation";
import { getFiles } from "../supabase/queries";

// It includes everything in Folder and adds a files field, which can be
// either an array of File items or an empty array. This flexibility is
// useful for representing folders that might or might not contain files.
// appFolderType type is extended to include an additional property named
// files in addition to the properties already present in Folder.
export type appFoldersType = Folder & { files: File[] | [] };
export type appWorkspacesType = workspace & {
  folders: appFoldersType[] | [];
};

interface AppState {
  workspaces: appWorkspacesType[] | [];
}

type Action =
  | { type: "ADD_WORKSPACE"; payload: appWorkspacesType }
  | { type: "DELETE_WORKSPACE"; payload: string }
  | {
      type: "UPDATE_WORKSPACE";
      payload: { workspace: Partial<appWorkspacesType>; workspaceId: string };
    }
  | {
      type: "SET_WORKSPACES";
      payload: { workspaces: appWorkspacesType[] | [] };
    }
  | {
      type: "SET_FOLDERS";
      payload: { workspaceId: string; folders: [] | appFoldersType[] };
    }
  | {
      type: "ADD_FOLDER";
      payload: { workspaceId: string; folder: appFoldersType };
    }
  | {
      type: "ADD_FILE";
      payload: { workspaceId: string; file: File; folderId: string };
    }
  | {
      type: "DELETE_FILE";
      payload: { workspaceId: string; folderId: string; fileId: string };
    }
  | {
      type: "DELETE_FOLDER";
      payload: { workspaceId: string; folderId: string };
    }
  | {
      type: "SET_FILES";
      payload: { workspaceId: string; files: File[]; folderId: string };
    }
  | {
      type: "UPDATE_FOLDER";
      payload: {
        folder: Partial<appFoldersType>;
        workspaceId: string;
        folderId: string;
      };
    }
  | {
      type: "UPDATE_FILE";
      payload: {
        file: Partial<File>;
        folderId: string;
        workspaceId: string;
        fileId: string;
      };
    };

const initialState: AppState = { workspaces: [] };

// A pure function that takes current state and action and return the
// next state. Contain all the logic to update the state
function appReducer(state: AppState = initialState, action: Action) {}

interface AppStateContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
  workspaceId: string | undefined;
  folderId: string | undefined;
  fileId: string | undefined;
}

// Create the context
const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

interface AppStateProviderProps {
  children: React.ReactNode;
}

// To Provide the context
function AppStateProvider({ children }: AppStateProviderProps) {}

export default AppStateProvider;

/**
 * a custom hook that provides access to the application's state and dispatch
 * function from the AppStateContext. It ensures that the state and dispatch
 * are only used within components wrapped by AppStateProvider. If useAppState
 * is used outside AppStateProvider, it throws an error.
 * @returns AppStateContextType | undefined
 */
export function useAppState(): AppStateContextType | undefined {
  // Use the context
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("UseAppState must be used within an AppStateProvider");
  }
  return context;
}
