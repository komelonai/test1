import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | undefined;

export function db() {
  return (_client ??= createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!
  ));
}

export type RsvpData = {
  name: string;
  org: string;
  jobtitle: string;
  phone: string;
  email: string;
  attendance: string;
  companions: string;
  dietary: string;
  message: string;
};

export async function initDb() {
  // Table managed via Supabase SQL Editor
}
