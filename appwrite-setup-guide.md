# Appwrite Setup Guide

Since we migrated from Supabase to Appwrite, you need to configure your backend structure (Databases & Collections) directly in the Appwrite Console.

## 1. Create a Database
1. Go to your Appwrite Console.
2. Under "Databases", click **Create Database**.
3. Name it **GreenHire**.
4. Copy the **Database ID** and add it to your `.env.local` under `NEXT_PUBLIC_APPWRITE_DATABASE_ID`.

## 2. Create Collections
Within your new GreenHire database, create three Collections. After creating each one, copy its **Collection ID** into your `.env.local` corresponding variable.

### **Collection A: Jobs** (`NEXT_PUBLIC_APPWRITE_JOBS_COLLECTION_ID`)
**Document Security:** Enable Document Security.

**Attributes:**
- `title` (String, size: 100, Required)
- `company_name` (String, size: 80, Required)
- `company_logo_url` (URL, Required: false)
- `description` (String, size: 65535, Required)
- `job_type` (Enum: [full-time, part-time, contract, internship], Required, default: full-time)
- `location` (String, size: 255, Required)
- `is_remote` (Boolean, Required, default: false)
- `salary_min` (Integer, Required: false)
- `salary_max` (Integer, Required: false)
- `apply_url` (URL, Required)
- `contact_email` (Email, Required: false)
- `status` (Enum: [pending, live, expired, rejected], Required, default: pending)
- `is_featured` (Boolean, Required, default: false)
- `posted_at` (Datetime, Required: false)
- `expires_at` (Datetime, Required: false)

**Indexes:**
- `status_index` (Key: status)
- `posted_at_index` (Key: posted_at, Order: DESC)
- `is_featured_index` (Key: is_featured, Order: DESC)

*Note: Appwrite natively handles full-text search. You can create a Fulltext index combining `title`, `company_name`, and `description` to enable robust search.*

---

### **Collection B: Subscribers** (`NEXT_PUBLIC_APPWRITE_SUBSCRIBERS_COLLECTION_ID`)
**Attributes:**
- `email` (Email, Required)
- `confirmed` (Boolean, Required, default: false)
- `confirmation_token` (String, size: 255, Required: false)

**Indexes:**
- `email_index` (Key: email, Type: Unique)

---

### **Collection C: Payments** (`NEXT_PUBLIC_APPWRITE_PAYMENTS_COLLECTION_ID`)
**Attributes:**
- `stripe_session_id` (String, size: 255, Required)
- `stripe_payment_intent` (String, size: 255, Required: false)
- `amount` (Integer, Required)
- `plan` (Enum: [single, bundle, featured], Required)
- `job_id` (String, size: 100, Required)
- `status` (Enum: [pending, paid, failed], Required, default: pending)

**Indexes:**
- `session_id_idx` (Key: stripe_session_id)

## 3. Permissions & API Key

**API Key Generation:**
- Navigate to **Overview** -> **API Keys**.
- Click **Create API Key**. Name it "GreenHire Admin".
- Grant it the following scopes:
  - `databases.read`, `databases.write`
  - `sessions.read`, `sessions.write`
- Copy the Secret and assign it to `APPWRITE_API_KEY` in `.env.local`.

**Collection Level Permissions:**
- Because the GreenHire platform performs sensitive actions from the server via API keys (Server-Side rendering, Checkout Webhooks), your Appwrite API Key will implicitly have full Admin access to read/write against everything.
- For `jobs` specifically, you'll need to give `Any` role `read` permissions so that client-side components can potentially access it.
