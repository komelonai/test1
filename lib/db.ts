import postgres from "postgres";

let _db: ReturnType<typeof postgres> | undefined;

export function db() {
  return (_db ??= postgres(process.env.DATABASE_URL!, {
    ssl: "require",
    max: 10,
    prepare: false, // Supabase transaction mode pooler does not support prepared statements
  }));
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
  await db()`
    CREATE TABLE IF NOT EXISTS rsvps (
      id              SERIAL PRIMARY KEY,
      order_id        VARCHAR(100) UNIQUE NOT NULL,
      name            VARCHAR(100) NOT NULL,
      org             VARCHAR(200) NOT NULL,
      jobtitle        VARCHAR(100) NOT NULL,
      phone           VARCHAR(50)  NOT NULL,
      email           VARCHAR(200) NOT NULL,
      attendance      VARCHAR(20)  NOT NULL,
      companions      INTEGER      DEFAULT 0,
      dietary         VARCHAR(500),
      message         TEXT,
      payment_key     VARCHAR(200),
      payment_status  VARCHAR(50)  DEFAULT 'PENDING',
      payment_amount  INTEGER,
      paid_at         TIMESTAMPTZ,
      created_at      TIMESTAMPTZ  DEFAULT NOW()
    )
  `;
}
