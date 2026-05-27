import { db } from "@/src/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { IRegistro } from "../ts/IRegistro";

export async function getAllRegistros(fichaId: string): Promise<IRegistro[]> {
  try {
    const registrosRef = collection(
      db,
      "fichaAtendimento",
      fichaId,
      "registro",
    );

    const q = query(registrosRef, orderBy("dataCriacao", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        situacao: data.situacao,
        emocao: data.emocao,
        intensidade: data.intensidade,
        descricao: data.descricao,
        dataOcorrido:
          data.dataOcorrido instanceof Timestamp
            ? data.dataOcorrido.toDate().toLocaleDateString("pt-BR")
            : data.dataOcorrido,
        dataCriacao:
          data.dataCriacao instanceof Timestamp
            ? data.dataCriacao.toDate().toLocaleDateString("pt-BR")
            : undefined,
      };
    });
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    return [];
  }
}
