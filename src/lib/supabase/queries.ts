"use server"; //* Component Server

import { files } from "../../../migrations/schema";
import db from "./db";
import { Subscription } from "./supabase.types";
import { validate } from "uuid";
import { and, eq, ilike, notExists } from "drizzle-orm";

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
  if (!isValid) return { data: null, error: "Error" };
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
