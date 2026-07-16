"use server";

import { MongoClient, type Db } from "mongodb";
import type { Lead } from "~/types";

let client: MongoClient | null = null;

async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    // Fail loudly rather than pretending the lead was stored. The contact
    // form surfaces this as an error state with WhatsApp/email fallbacks.
    throw new Error("MONGODB_URI is not configured — lead cannot be stored.");
  }

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("305-web-service");
}

export async function saveLead(lead: Lead): Promise<void> {
  const db = await getDb();
  await db.collection("leads").insertOne(lead);
}
