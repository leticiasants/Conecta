import { db } from "@/src/lib/firebase";
import { IUsuario } from "@/src/types/IUsuario";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

export async function getUsuario(uid: string): Promise<IUsuario | null> {
  try {
    const usuariosRef = collection(db, "usuario");

    const q = query(usuariosRef, where("idAuth", "==", uid));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const usuarioDoc = querySnapshot.docs[0];

    return {
      id: usuarioDoc.id,
      ...usuarioDoc.data(),
    } as IUsuario;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);

    return null;
  }
}

// Busca por prefixo de email — mínimo 3 caracteres para evitar queries amplas
export async function buscarPacientesPorEmail(
  email: string,
): Promise<IUsuario[]> {
  if (email.length < 3) return [];
  const upperBound =
    email.slice(0, -1) +
    String.fromCharCode(email.charCodeAt(email.length - 1) + 1);
  const q = query(
    collection(db, "usuario"),
    where("tipo", "==", "PACIENTE"),
    where("email", ">=", email),
    where("email", "<", upperBound),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as IUsuario);
}
