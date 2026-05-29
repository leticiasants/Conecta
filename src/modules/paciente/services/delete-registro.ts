import { db } from "@/src/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export async function deleteRegistro(
  fichaId: string,
  registroId: string,
): Promise<void> {
  await deleteDoc(doc(db, "fichaAtendimento", fichaId, "registro", registroId));
}
