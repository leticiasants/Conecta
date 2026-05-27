import { db } from "@/src/lib/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export async function updateUsuario(
  docId: string,
  data: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(db, "usuario", docId), {
    ...data,
    data_atualizacao: serverTimestamp(),
  });
}
