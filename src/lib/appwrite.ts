import { Client, Account, Databases } from 'appwrite'

export const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)

export const account = new Account(client)
export const databases = new Databases(client)

// Helper constants for Collections
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
export const JOBS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID!
export const SUBSCRIBERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_SUBSCRIBERS_COLLECTION_ID!
export const PAYMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID!
