import { db } from "@/src/lib/firebase";
import { IUsuario } from "@/src/modules/usuario/ts/IUsuario";
import { collection, getDocs, query, where } from "firebase/firestore";

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
