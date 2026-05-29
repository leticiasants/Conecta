import { db } from "@/src/lib/firebase";
import { ISolicitacao } from "@/src/types/ISolicitacao";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

export async function getAllSolicitacaoVinculo(
  idPaciente: string,
): Promise<ISolicitacao[]> {
  try {
    const fichaQuery = query(
      collection(db, "fichaAtendimento"),
      where("idPaciente", "==", idPaciente),
    );

    const fichaSnap = await getDocs(fichaQuery);

    if (fichaSnap.empty) {
      return [];
    }

    const fichaId = fichaSnap.docs[0].id;

    const alteracaoRef = collection(
      db,
      "fichaAtendimento",
      fichaId,
      "alteracaoPsicologo",
    );

    const alteracaoQuery = query(alteracaoRef, orderBy("dataCriacao", "desc"));

    const alteracaoSnap = await getDocs(alteracaoQuery);

    return await Promise.all(
      alteracaoSnap.docs.map(async (alteracaoDoc) => {
        const alteracao = alteracaoDoc.data();

        const psicologoSnap = await getDoc(
          doc(db, "usuario", alteracao.idNovoPsicologo),
        );

        const psicologo = psicologoSnap.exists() ? psicologoSnap.data() : null;

        return {
          id: alteracaoDoc.id,
          idFichaAtendimento: fichaId,
          idNovoPsicologo: alteracao.idNovoPsicologo,
          nomePsicologo: psicologo?.nome ?? "",
          crpPsicologo: psicologo?.crp ?? "",
          dataCriacao:
            alteracao.dataCriacao instanceof Timestamp
              ? alteracao.dataCriacao.toDate().toLocaleDateString("pt-BR")
              : alteracao.dataCriacao,
        };
      }),
    );
  } catch (error) {
    console.error("Erro ao listar solicitações:", error);
    throw error;
  }
}
