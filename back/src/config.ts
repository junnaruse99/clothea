import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  adminKey: process.env.ADMIN_KEY ?? "clothea-admin",
  supabaseUrl: process.env.SUPABASE_URL ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  get supabaseEnabled(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseServiceRoleKey);
  },
};
