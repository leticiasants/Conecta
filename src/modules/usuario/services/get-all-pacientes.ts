import { db } from "@/src/lib/firebase";
import {
  collection,
  documentId,
  getDocs,
  or,
  query,
  where,
} from "firebase/firestore";
import { IPaciente } from "../../paciente/ts/IPaciente";

export async function getAllPacientes(
  psicologoId: string,
  search?: string,
): Promise<IPaciente[]> {
  try {
    const fichasSnap = await getDocs(
      query(
        collection(db, "fichaAtendimento"),
        or(
          where("idPsicologo", "!=", psicologoId),
          where("idPsicologo", "==", null),
        ),
      ),
    );

    if (fichasSnap.empty) return [];

    const fichasComVerificacao = await Promise.all(
      fichasSnap.docs.map(async (fichaDoc) => {
        const alteracaoSnap = await getDocs(
          query(
            collection(
              db,
              "fichaAtendimento",
              fichaDoc.id,
              "alteracaoPsicologo",
            ),
            where("idNovoPsicologo", "==", psicologoId),
          ),
        );
        return { fichaDoc, jaSolicitado: !alteracaoSnap.empty };
      }),
    );

    const fichasPorPaciente = new Map<string, string>();

    fichasComVerificacao
      .filter(({ jaSolicitado }) => !jaSolicitado)
      .forEach(({ fichaDoc }) => {
        const { idPaciente } = fichaDoc.data();
        if (!fichasPorPaciente.has(idPaciente)) {
          fichasPorPaciente.set(idPaciente, fichaDoc.id);
        }
      });

    const pacientesIds = [...fichasPorPaciente.keys()];
    const pacientes: IPaciente[] = [];

    for (let i = 0; i < pacientesIds.length; i += 10) {
      const chunk = pacientesIds.slice(i, i + 10);

      const snap = await getDocs(
        query(collection(db, "usuario"), where(documentId(), "in", chunk)),
      );

      snap.forEach((doc) => {
        pacientes.push({
          ...(doc.data() as IPaciente),
          id: doc.id,
          idFicha: fichasPorPaciente.get(doc.id)!,
        });
      });
    }

    if (!search?.trim()) return pacientes;
    const termo = search.toLowerCase();
    return pacientes.filter(
      (p) =>
        p.nome?.toLowerCase().includes(termo) ||
        p.email?.toLowerCase().includes(termo),
    );
  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    return [];
  }
}
