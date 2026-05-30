import { auth, db } from "@/src/lib/firebase";
import { deleteUser } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from "firebase/firestore";

export async function deletePsicologo(uid: string): Promise<void> {
  const psicologoSnap = await getDocs(
    query(collection(db, "usuario"), where("idAuth", "==", uid)),
  );

  if (psicologoSnap.empty) {
    throw new Error("Usuário não encontrado.");
  }

  const psicologoDocId = psicologoSnap.docs[0].id;

  const fichasSnap = await getDocs(
    query(
      collection(db, "fichaAtendimento"),
      where("idPsicologo", "==", psicologoDocId),
    ),
  );

  const batch = writeBatch(db);

  fichasSnap.docs.forEach((d) => {
    batch.update(d.ref, {
      idPsicologo: null,
      dataAtualizacao: serverTimestamp(),
    });
  });

  batch.delete(doc(db, "usuario", psicologoDocId));

  await batch.commit();

  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
}
