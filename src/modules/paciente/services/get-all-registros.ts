import { db } from "@/src/lib/firebase";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { IRegistro } from "../ts/IRegistro";

export async function getAllRegistros(fichaId: string, search?: string): Promise<IRegistro[]> {
  try {
    const registrosRef = collection(
      db,
      "fichaAtendimento",
      fichaId,
      "registro",
    );

    const q = query(registrosRef, orderBy("dataCriacao", "desc"));
    const snap = await getDocs(q);
    const results = snap.docs.map((d) => {
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

    if (!search?.trim()) return results;
    const termo = search.toLowerCase();
    return results.filter(
      (r) =>
        r.situacao.toLowerCase().includes(termo) ||
        r.emocao.toLowerCase().includes(termo) ||
        String(r.intensidade).includes(search),
    );
  } catch (error) {
    console.error("Erro ao buscar registros:", error);
    return [];
  }
}
