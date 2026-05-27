import { db } from "@/src/lib/firebase";
import { deleteDoc, doc } from "firebase/firestore";

export async function deleteSolicitacaoVinculo(
  fichaId: string,
  solicitacaoId: string,
): Promise<void> {
  try {
    if (!fichaId || !solicitacaoId) {
      throw new Error("Dados inválidos para exclusão.");
    }

    await deleteDoc(
      doc(db, "fichaAtendimento", fichaId, "alteracaoPsicologo", solicitacaoId),
    );
  } catch (error) {
    console.error("Erro ao excluir solicitação:", error);

    throw new Error("Não foi possível remover a solicitação.");
  }
}
