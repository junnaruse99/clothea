import { NextFunction, Request, Response } from "express";
import { config } from "../config";

/**
 * Autenticación mínima para el MVP: el panel admin envía la clave en el
 * header `x-admin-key`. Al crecer, migrar a Supabase Auth con roles.
 */
export function adminAuth(req: Request, res: Response, next: NextFunction) {
  const key = req.header("x-admin-key");
  if (key !== config.adminKey) {
    res.status(401).json({ error: "Clave de administrador inválida" });
    return;
  }
  next();
}
