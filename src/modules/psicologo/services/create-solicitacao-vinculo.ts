import { db } from "@/src/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function solicitarAlteracaoPsicologo(
  idNovoPsicologo: string,
  dados: { idPaciente: string; idFicha: string },
) {
  try {
    console.log("Criando solicitação de vínculo para paciente:", dados.idFicha);
    const alteracaoRef = collection(
      db,
      "fichaAtendimento",
      dados.idFicha, // ID da ficha que você já possui
      "alteracaoPsicologo",
    );

    // Cria o documento da solicitação direto lá dentro
    await addDoc(alteracaoRef, {
      idNovoPsicologo: idNovoPsicologo,
      dataCriacao: serverTimestamp(), // Boa prática para ordenar depois
    });

    console.log("Solicitação de vínculo criada com sucesso!");
  } catch (error) {
    console.error("Erro ao criar solicitação de alteração:", error);
    throw error;
  }
}
