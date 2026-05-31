import { db } from "@/src/lib/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { IPacienteComSolicitacao } from "../../paciente/ts/IPaciente";

export async function getAllSolicitacaoVinculo(
  psicologoId: string,
  search?: string,
): Promise<IPacienteComSolicitacao[]> {
  try {
    const fichasRef = collection(db, "fichaAtendimento");

    const fichasSnap = await getDocs(fichasRef);

    const pacientes = await Promise.all(
      fichasSnap.docs.map(async (fichaDoc) => {
        const ficha = fichaDoc.data();

        // ignora fichas do psicólogo atual
        if (ficha.idPsicologo === psicologoId) {
          return null;
        }

        // busca solicitações da ficha
        const alteracaoRef = collection(
          db,
          "fichaAtendimento",
          fichaDoc.id,
          "alteracaoPsicologo",
        );

        const alteracaoSnap = await getDocs(alteracaoRef);

        // procura solicitação
        const solicitacao = alteracaoSnap.docs.find(
          (doc) => doc.data().idNovoPsicologo === psicologoId,
        );

        if (!solicitacao) return null;

        // busca paciente
        const pacienteSnap = await getDoc(doc(db, "usuario", ficha.idPaciente));

        if (!pacienteSnap.exists()) return null;

        const pacienteData = pacienteSnap.data();

        return {
          ...pacienteData,
          id: pacienteSnap.id,
          idFicha: fichaDoc.id,
          idSolicitacao: solicitacao.id,
          dataSolicitacao: solicitacao.data().dataCriacao,
        } as IPacienteComSolicitacao;
      }),
    );

    const resultado = pacientes.filter(
      (paciente): paciente is IPacienteComSolicitacao => paciente !== null,
    );

    if (!search?.trim()) return resultado;
    const termo = search.toLowerCase();
    return resultado.filter(
      (s) =>
        s.nome.toLowerCase().includes(termo) ||
        s.email.toLowerCase().includes(termo) ||
        s.contato?.includes(search),
    );
  } catch (error) {
    console.error("Erro ao listar pacientes com solicitação:", error);

    throw error;
  }
}
