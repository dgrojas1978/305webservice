"use server";

import { MongoClient, type Db } from "mongodb";
import type { Lead } from "~/types";

let client: MongoClient | null = null;

async function getDb(): Promise<Db | null> {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;

  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db("305-web-service");
}

export async function saveLead(lead: Lead): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.log("[305WS] Lead recibido (sin MongoDB configurado):", lead);
    return;
  }
  await db.collection("leads").insertOne(lead);
}
