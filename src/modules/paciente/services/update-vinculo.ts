import { db } from "@/src/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { deleteAllRegistros } from "./delete-all-registros";

export async function updateVinculo(
  fichaId: string,
  idNovoPsicologo: string,
  newFicha: boolean = false,
): Promise<void> {
  try {
    const fichaRef = doc(db, "fichaAtendimento", fichaId);

    await updateDoc(fichaRef, {
      idPsicologo: idNovoPsicologo,
    });

    if (newFicha) {
      deleteAllRegistros(fichaId);
    }
  } catch (error) {
    console.error("Erro ao atualizar vínculo:", error);
    throw error;
  }
}
