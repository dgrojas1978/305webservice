"use server";

import { MongoClient, type Db } from "mongodb";
import type { Lead } from "~/types";

let client: MongoClient | null = null;

export async function getDb(): Promise<Db> {
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
  // El default es la base REAL del proyecto. Antes decía "305-web-service" y la
  // base se llama "305-web-service-db": sin MONGODB_DB definida, los leads iban
  // a una base que no existía en el cluster.
  // MONGODB_DB sigue disponible para apuntar staging a una base separada y que
  // las pruebas nunca contaminen los leads reales.
  return client.db(process.env.MONGODB_DB || "305-web-service-db");
}

export async function saveLead(lead: Lead): Promise<void> {
  const db = await getDb();
  await db.collection("leads").insertOne(lead);
}
