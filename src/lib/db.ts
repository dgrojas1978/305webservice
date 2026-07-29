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
  // MONGODB_DB permite apuntar staging a una base separada para que las
  // pruebas nunca contaminen los leads reales de producción.
  return client.db(process.env.MONGODB_DB || "305-web-service");
}

export async function saveLead(lead: Lead): Promise<void> {
  const db = await getDb();
  await db.collection("leads").insertOne(lead);
}
