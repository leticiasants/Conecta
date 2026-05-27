import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";

export interface FichaComPaciente {
  fichaId: string;
  pacienteId: string;
  nome: string;
  email: string;
  contato?: string;
  data_nasc?: string;
}

export async function criarFicha(
  pacienteId: string,
  psicologoId: string,
): Promise<string> {
  const ref = await addDoc(collection(db, "fichaAtendimento"), {
    idPaciente: pacienteId,
    idPsicologo: psicologoId,
    status: "ativo",
    data_criacao: serverTimestamp(),
    data_atualizacao: serverTimestamp(),
  });
  return ref.id;
}

export async function getFichasDoPsicologo(
  psicologoId: string,
): Promise<FichaComPaciente[]> {
  const q = query(
    collection(db, "fichaAtendimento"),
    where("idPsicologo", "==", psicologoId),
    where("status", "==", "ativo"),
  );
  const snap = await getDocs(q);

  const fichas = await Promise.all(
    snap.docs.map(async (d) => {
      const data = d.data();
      const pacienteDoc = await getDoc(doc(db, "usuario", data.idPaciente));
      if (!pacienteDoc.exists()) return null;
      const paciente = pacienteDoc.data();
      return {
        fichaId: d.id,
        pacienteId: data.idPaciente,
        nome: paciente.nome,
        email: paciente.email,
        contato: paciente.contato,
        data_nasc: paciente.data_nasc,
      };
    }),
  );

  return fichas.filter(Boolean) as FichaComPaciente[];
}

export async function getFichaDoPaciente(
  pacienteId: string,
): Promise<{ fichaId: string; psicologoId: string } | null> {
  const q = query(
    collection(db, "fichaAtendimento"),
    where("idPaciente", "==", pacienteId),
    where("status", "==", "ativo"),
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { fichaId: d.id, psicologoId: d.data().idPsicologo };
}

export async function desvincularPaciente(fichaId: string): Promise<void> {
  await updateDoc(doc(db, "fichaAtendimento", fichaId), {
    status: "inativo",
    data_atualizacao: serverTimestamp(),
  });
}
