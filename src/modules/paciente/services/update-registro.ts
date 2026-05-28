import { db } from "@/src/lib/firebase";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { IRegistro } from "../ts/IRegistro";

export async function updateRegistro(
  fichaId: string,
  registroId: string,
  data: IRegistro,
): Promise<void> {
  await updateDoc(
    doc(db, "fichaAtendimento", fichaId, "registro", registroId),
    {
      situacao: data.situacao,
      emocao: data.emocao,
      intensidade: data.intensidade,
      descricao: data.descricao,
      dataOcorrido: data.dataOcorrido,
      dataAtualizacao: serverTimestamp(),
    },
  );
}
