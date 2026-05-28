import { db } from "@/src/lib/firebase";
import { collection, getDocs, or, query, where } from "firebase/firestore";

export async function getFichaAtendimento(
  idUsuario: string,
): Promise<{ fichaId: string; psicologoId: string | null } | null> {
  const q = query(
    collection(db, "fichaAtendimento"),
    or(
      where("idPaciente", "==", idUsuario),
      where("idPsicologo", "==", idUsuario),
    ),
  );

  const snap = await getDocs(q);

  if (snap.empty) return null;

  const d = snap.docs[0];

  return {
    fichaId: d.id,
    psicologoId: d.data().idPsicologo,
  };
}
