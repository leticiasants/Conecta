import { auth, db } from "@/src/lib/firebase";
import { deleteUser } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteAllRegistros } from "../../paciente/services/delete-all-registros";

export async function deletePaciente(uid: string): Promise<void> {
  const usuarioSnap = await getDocs(
    query(collection(db, "usuario"), where("idAuth", "==", uid)),
  );

  if (usuarioSnap.empty) {
    throw new Error("Usuário não encontrado.");
  }

  const usuarioDoc = usuarioSnap.docs[0];
  const usuarioId = usuarioDoc.id;

  const fichaSnap = await getDocs(
    query(
      collection(db, "fichaAtendimento"),
      where("idPaciente", "==", usuarioId),
    ),
  );

  const batch = writeBatch(db);

  for (const fichaDoc of fichaSnap.docs) {
    const fichaId = fichaDoc.id;

    deleteAllRegistros(fichaId);

    const solicitacoesRef = collection(
      db,
      "fichaAtendimento",
      fichaId,
      "alteracaoPsicologo",
    );

    const solicitacoesSnap = await getDocs(solicitacoesRef);

    await Promise.all(
      solicitacoesSnap.docs.map((solicitacao) =>
        deleteDoc(
          doc(
            db,
            "fichaAtendimento",
            fichaId,
            "alteracaoPsicologo",
            solicitacao.id,
          ),
        ),
      ),
    );

    batch.delete(fichaDoc.ref);
  }

  batch.delete(doc(db, "usuario", usuarioId));

  await batch.commit();

  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
}
