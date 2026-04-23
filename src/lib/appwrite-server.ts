import { Client, Databases, Users } from 'node-appwrite'

// Initialize the Appwrite server SDK with the admin secret key.
// This client should ONLY be used in server-side routes that require full admin privilege 
// (e.g. webhooks, approving jobs, creating user accounts from the server).
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://dummy.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy_project')
    .setKey(process.env.APPWRITE_API_KEY || 'dummy_key')

  return {
    get databases() {
      return new Databases(client)
    },
    get users() {
      return new Users(client)
    }
  }
}

// Session client logic wrapper - Node Appwrite supports creating clients initialized with user session limits
export function createSessionClient(sessionCookie: string) {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://dummy.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'dummy_project')

  if (sessionCookie) {
    // Forward the session cookie as the Auth Token boundary
    client.setSession(sessionCookie)
  }

  return {
    get databases() {
      return new Databases(client)
    }
  }
}
