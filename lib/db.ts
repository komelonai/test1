import { createClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _client: any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function db(): any {
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
