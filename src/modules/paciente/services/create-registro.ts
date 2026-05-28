import { db } from "@/src/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { IRegistro } from "../ts/IRegistro";

export async function createRegistro(
  fichaId: string,
  data: IRegistro,
): Promise<void> {
  await addDoc(collection(db, "fichaAtendimento", fichaId, "registro"), {
    situacao: data.situacao,
    emocao: data.emocao,
    intensidade: data.intensidade,
    descricao: data.descricao,
    dataOcorrido: data.dataOcorrido,
    dataCriacao: serverTimestamp(),
  });
}
