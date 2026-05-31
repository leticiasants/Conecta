import { db } from "@/src/lib/firebase";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { IPaciente } from "../../paciente/ts/IPaciente";

export async function getAllPacientesDoPsicologo(
  psicologoId: string,
  search?: string,
): Promise<IPaciente[]> {
  const fichasQuery = query(
    collection(db, "fichaAtendimento"),
    where("idPsicologo", "==", psicologoId),
  );

  const fichasSnapshot = await getDocs(fichasQuery);

  const fichas = fichasSnapshot.docs
    .map((doc) => ({ fichaId: doc.id, ...doc.data() }) as any)
    .sort((a, b) => {
      const tsA = (a.dataCriacao ?? a.data_criacao)?.toMillis?.() ?? 0;
      const tsB = (b.dataCriacao ?? b.data_criacao)?.toMillis?.() ?? 0;
      return tsB - tsA;
    });

  if (!fichas.length) return [];

  const pacientesMap = new Map();

  fichas.forEach((ficha: any) => {
    if (!pacientesMap.has(ficha.idPaciente)) {
      pacientesMap.set(ficha.idPaciente, ficha.fichaId);
    }
  });

  const pacientesIds = [...pacientesMap.keys()];

  const chunks = [];

  for (let i = 0; i < pacientesIds.length; i += 10) {
    chunks.push(pacientesIds.slice(i, i + 10));
  }

  const pacientes: IPaciente[] = [];

  for (const chunk of chunks) {
    const pacientesQuery = query(
      collection(db, "usuario"),
      where(documentId(), "in", chunk),
    );

    const pacientesSnapshot = await getDocs(pacientesQuery);

    pacientesSnapshot.forEach((doc) => {
      pacientes.push({
        ...(doc.data() as IPaciente),
        id: doc.id,
        idFicha: pacientesMap.get(doc.id),
      });
    });
  }

  pacientes.sort(
    (a, b) => pacientesIds.indexOf(a.id!) - pacientesIds.indexOf(b.id!),
  );

  if (!search?.trim()) return pacientes;
  const termo = search.toLowerCase();
  return pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(termo) ||
      p.email.toLowerCase().includes(termo) ||
      p.contato?.includes(search),
  );
}
