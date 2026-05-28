import { db } from "@/src/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { IRegistro } from "../ts/IRegistro";

type RegistroForm = Omit<IRegistro, "id">;

export async function createRegistro(
  fichaId: string,
  data: RegistroForm,
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
