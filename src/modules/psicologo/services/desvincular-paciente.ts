import { db } from "@/src/lib/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

export async function desvincularPaciente(fichaId: string): Promise<void> {
  await updateDoc(doc(db, "fichaAtendimento", fichaId), {
    idPsicologo: null,
    data_atualizacao: serverTimestamp(),
  });
}
