"use server"; //* Component Server

import { files, workspaces, folders, users } from "../../../migrations/schema";
import { collaborators } from "./schema";
import db from "./db";
import { Folder, Subscription, workspace } from "./supabase.types";
import { validate } from "uuid";
import { and, eq, ilike, notExists } from "drizzle-orm";

/**
 * Fetch data and queries from the database
 */

export async function getUserSubscriptionStatus(userId: string) {
  try {
    const data = await db.query.subscriptions.findFirst({
      where: (s, { eq }) => eq(s.userId, userId),
    });
    if (data) return { data: data as Subscription, error: null };
    else return { data: null, error: null };
  } catch (error) {
    return { data: null, error: `Error ${error}` };
  }
}

interface GetFilesType {
  data: string | null | [] | File[];
  error: string | null;
}

export async function getFiles(folderId: string): Promise<GetFilesType> {
  // Test a string to see if it is a valid UUID
  const isValid: boolean = validate(folderId);
  if (!isValid) return { data: null, error: "your foldierId is not valid" };
  try {
    const result = (await db
      .select()
      .from(files)
      .orderBy(files.createdAt)
      .where(eq(files.folderId, folderId))) as File[] | [];
    return { data: result, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
}

interface GetFoldersType {
  data: string | null | [] | Folder[];
  error: string | null;
}

export async function getFolders(workspaceId: string): Promise<GetFoldersType> {
  const isValid = validate(workspaceId);
  if (!isValid) {
    return {
      data: null,
      error: "your workspaceId is not valid",
    };
  }
  try {
    const results: Folder[] | [] = await db
      .select()
      .from(folders)
      .orderBy(folders.createdAt)
      .where(eq(folders.workspaceId, workspaceId));
    return { data: results, error: null };
  } catch (error) {
    return {
      data: null,
      error: "Failed to fetch your folders from database",
    };
  }
}

/**
 * Collaborators is a table that has information about collaborating
 * users along with their workspaces, that way we can tell when a user
 * is a collborator of another workspace
 */

/**
 * This function retrieves all workspaces from the database that are owned by the 
 * specified user and are not shared with any collaborators. The use of notExists 
 * for the collaborators check suggests that the function aims to identify truly 
 * private workspaces for the user.
 * 
 * In PostgreSQL:
 *  # It selects the desired fields from the workspaces table (aliased as w).
 *  SELECT 
        w.id, w."createdAt", w."workspaceOwner", w.title, w."iconId", w.data, 
        w."inTrash", w.logo, w."bannerUrl"
    FROM 
        workspaces w
    WHERE 
        # It filters for workspaces where the workspaceOwner is the specified 
        # userId.
        w."workspaceOwner" = userId
        # The NOT EXISTS clause checks for the absence of any corresponding 
        # entries in the collaborators table, ensuring the selected workspaces 
        # are private (i.e., not shared with collaborators).
        AND NOT EXISTS (
            # The SELECT 1 is a common pattern used in NOT EXISTS subqueries, 
            # where the actual data selected is irrelevant; the presence or 
            # absence of rows is what matters
            SELECT 1
            FROM collaborators c
            WHERE c."workspaceId" = w.id
        );
 *  
 */
export async function getPrivateWorkspaces(userId: string) {
  if (!userId) return [];
  const privateWorkspaces = (await db
    // Select specific fields from the workspaces table
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(workspaces)
    // The query filters the records based on two conditions combined with an AND
    // operation:
    .where(
      and(
        // The workspace is not listed in the collaborators table (indicating
        // it's not shared). This subquery uses notExists to filter out any
        // workspaces that are shared with other users
        notExists(
          db
            .select()
            .from(collaborators)
            .where(eq(collaborators.workspaceId, workspaces.id))
        ),
        // The workspaceOwner matches the given userId (the user owns the
        // workspace). Owner Check: It checks if the workspaceOwner field in
        // the workspaces table matches the given userId. This ensures that
        // the query returns only those workspaces where the current user is
        // the owner.
        eq(workspaces.workspaceOwner, userId)
      )
    )) as workspace[];
  // It returns an array of private workspace objects for the specified user.
  return privateWorkspaces;
}

/**
 * The purpose of the getCollaboratingWorkspaces function is to fetch a list
 * of workspaces from a database where the specified user is a collaborator.
 */
export async function getCollaboratingWorkspaces(userId: string) {
  if (!userId) return [];
  const collaboratedWorkspaces = (await db
    // Select these fields from the workspaces table
    .select({
      id: workspaces.id,
      createdAt: workspaces.createdAt,
      workspaceOwner: workspaces.workspaceOwner,
      title: workspaces.title,
      iconId: workspaces.iconId,
      data: workspaces.data,
      inTrash: workspaces.inTrash,
      logo: workspaces.logo,
      bannerUrl: workspaces.bannerUrl,
    })
    .from(users)
    // Joins the collaborators table with the users table where users.id
    // matches collaborators.id.
    .innerJoin(collaborators, eq(users.id, collaborators.id))
    // Further Joins the workspaces table with the collaborators table
    // where collaborators.workspaceId matches workspaces.id.
    .innerJoin(workspaces, eq(collaborators.workspaceId, workspaces.id))
    // Filters the results where the users.id matches the provided userId.
    .where(eq(users.id, userId))) as workspace[];
  // It returns an array of workspace objects representing the workspaces
  // where the user is a collaborator
  return collaboratedWorkspaces;
}

/**
 * Create Resources and Save it to the Database
 */

interface CWSType {
  data: null;
  error: string | null;
}

export async function createWorkspace(workspace: workspace): Promise<CWSType> {
  try {
    await db.insert(workspaces).values(workspace);
    return { data: null, error: null };
  } catch (error) {
    console.log(error);
    return { data: null, error: "Error" };
  }
}
