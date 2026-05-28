import { db } from "@/src/lib/firebase";
import { IRegistro } from "@/src/modules/paciente/ts/IRegistro";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

type Relato = IRegistro & { id: string };

// export async function criarRegistro(
//   fichaId: string,
//   data: IRegistro,
// ): Promise<void> {
//   await addDoc(collection(db, "fichaAtendimento", fichaId, "registro"), {
//     situacao: data.situacao,
//     emocao: data.emocao,
//     intensidade: data.intensidade,
//     descricao: data.descricao,
//     dataOcorrido: data.dataOcorrido,
//     data_criacao: serverTimestamp(),
//   });
// }

// export async function listarRegistros(fichaId: string): Promise<Relato[]> {
//   const q = query(
//     collection(db, "fichaAtendimento", fichaId, "registro"),
//     orderBy("data_criacao", "desc"),
//   );
//   const snap = await getDocs(q);
//   return snap.docs.map((d) => ({
//     id: d.id,
//     ...(d.data() as Omit<IRegistro, "id">),
//   }));
// }

// export async function atualizarRegistro(
//   fichaId: string,
//   registroId: string,
//   data: IRegistro,
// ): Promise<void> {
//   await updateDoc(
//     doc(db, "fichaAtendimento", fichaId, "registro", registroId),
//     {
//       situacao: data.situacao,
//       emocao: data.emocao,
//       intensidade: data.intensidade,
//       descricao: data.descricao,
//       dataOcorrido: data.dataOcorrido,
//     },
//   );
// }

export async function deletarRegistro(
  fichaId: string,
  registroId: string,
): Promise<void> {
  await deleteDoc(doc(db, "fichaAtendimento", fichaId, "registro", registroId));
}
