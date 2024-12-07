"use server";

import { cookies } from "next/headers";

export default async function setChecks(checks: number) {
  const cookieStore = await cookies();
  cookieStore.set("checks", checks.toString());
}
