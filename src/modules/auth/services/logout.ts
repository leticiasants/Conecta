import { auth } from "@/src/lib/firebase";
import { signOut } from "firebase/auth";

export async function logout(): Promise<void> {
  await signOut(auth);
}
