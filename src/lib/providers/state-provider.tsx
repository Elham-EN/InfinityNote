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
// a custom type that combines the properties of a workspace with an additional
// folders property. This folders property can either be an array of folder
// objects or an empty array, allowing it to represent workspaces that either
// contain folders or have none.
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
      // Contains the updated workspace data, workspaceId to specify which
      // workspace to update. Partial allows updating part of the workspace
      // without needing the entire object
      payload: { workspace: Partial<appWorkspacesType>; workspaceId: string };
    }
  | {
      type: "SET_WORKSPACES";
      // payload: Contains an array of workspaces or an empty array
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

// Intital Workspaces array is empty
const initialState: AppState = { workspaces: [] };

// A pure function that takes current state and action and return the
// next state. Contain all the logic to update the state
function appReducer(state: AppState = initialState, action: Action) {
  switch (action.type) {
    // Update State: Add Workspace to current workspaces array
    case "ADD_WORKSPACE":
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload],
      };
    case "DELETE_WORKSPACE":
      // Update State: Remove Workspace from current workspaces array
      return {
        ...state,
        workspaces: state.workspaces.filter(
          (workspace) => workspace.id !== action.payload
        ),
      };
    case "UPDATE_WORKSPACE":
      // Update State: Update Workspace that match the action's payload
      // workspace id. Can also update part of workspace (property)
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              ...action.payload.workspace,
            };
          }
          return workspace;
        }),
      };
    case "SET_WORKSPACES":
      // Update State: sets the state's workspaces to the new array of
      // workspaces (or an empty array)
      return {
        ...state,
        workspaces: action.payload.workspaces,
      };
    case "SET_FOLDERS":
      // updates the workspaces array in the state:
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          // If there's a match, it updates that workspace's folders, sorting
          // them by createdAt date.
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: action.payload.folders.sort((a, b) => {
                // checks if both a.createdAt and b.createdAt are not null before
                // converting them to Date objects and subtracting their timestamps
                if (a.createdAt && b.createdAt) {
                  return (
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
                  );
                }
                return 0;
              }),
            };
          }
          return workspace;
        }),
      };
    case "ADD_FOLDER":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          return {
            ...workspace,
            folders: [...workspace.folders, action.payload.folder].sort((a, b) => {
              if (a.createdAt && b.createdAt) {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              }
              return 0;
            }),
          };
        }),
      };
    case "UPDATE_FOLDER":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return { ...folder, ...action.payload.folder };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    case "DELETE_FOLDER":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.filter(
                (folder) => folder.id !== action.payload.folderId
              ),
            };
          }
          return workspace;
        }),
      };
    case "SET_FILES":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: action.payload.files,
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    case "ADD_FILE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: [...folder.files, action.payload.file].sort((a, b) => {
                      if (a.createdAt && b.createdAt) {
                        return (
                          new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime()
                        );
                      }
                      return 0;
                    }),
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    case "UPDATE_FILE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: folder.files.map((file) => {
                      if (file.id === action.payload.fileId) {
                        return {
                          ...file,
                          ...action.payload.file,
                        };
                      }
                      return file;
                    }),
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    case "DELETE_FILE":
      return {
        ...state,
        workspaces: state.workspaces.map((workspace) => {
          if (workspace.id === action.payload.workspaceId) {
            return {
              ...workspace,
              folders: workspace.folders.map((folder) => {
                if (folder.id === action.payload.folderId) {
                  return {
                    ...folder,
                    files: folder.files.filter(
                      (file) => file.id !== action.payload.fileId
                    ),
                  };
                }
                return folder;
              }),
            };
          }
          return workspace;
        }),
      };
    default:
      return initialState;
  } // END OF SWITCH STATEMENT
}

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
function AppStateProvider({ children }: AppStateProviderProps): React.ReactElement {
  const [state, dispatch] = useReducer(appReducer, initialState);
  // Example: localhost:3000/dashboard/workspaceId/folderId/fileId
  const pathname = usePathname(); // gets the current URL path

  const workspaceId = useMemo(() => {
    // ["dashboard", "workspaceId", "folderId", "fileId"]
    // Pathname: "/dashboard/workspaceId/folderId/fileId"
    const urlSegments = pathname.split("/").filter(Boolean);
    if (urlSegments) {
      if (urlSegments.length > 1) {
        return urlSegments[1]; // return workspaceId
      }
    }
  }, [pathname]);

  const folderId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 2) {
        return urlSegments[2];
      }
  }, [pathname]);

  const fileId = useMemo(() => {
    const urlSegments = pathname?.split("/").filter(Boolean);
    if (urlSegments)
      if (urlSegments?.length > 3) {
        return urlSegments[3];
      }
  }, [pathname]);

  useEffect(() => {
    if (!folderId || !workspaceId) return;
    const fetchFiles = async () => {
      const { error: filesError, data } = await getFiles(folderId!);
      if (filesError) {
        console.log(filesError);
      }
      if (!data) return;
      dispatch({
        type: "SET_FILES",
        payload: {
          workspaceId,
          files: data as File[],
          folderId,
        },
      });
    };
    fetchFiles();
  }, [folderId, workspaceId]);

  useEffect(() => {
    console.log("App State Changed", state);
  }, [state]);

  return (
    <AppStateContext.Provider value={{ state, dispatch, workspaceId, folderId, fileId }}>
      {children}
    </AppStateContext.Provider>
  );
}

export default AppStateProvider;

/**
 * a custom hook that provides access to the application's state and dispatch
 * function from the AppStateContext. It ensures that the state and dispatch
 * are only used within components wrapped by AppStateProvider. If useAppState
 * is used outside AppStateProvider, it throws an error.
 * @returns AppStateContextType | undefined
 */
export function useAppState(): AppStateContextType {
  // Use the context
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("UseAppState must be used within an AppStateProvider");
  }
  return context;
}
