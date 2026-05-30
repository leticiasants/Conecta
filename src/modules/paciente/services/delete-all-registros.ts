import { db } from "@/src/lib/firebase";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";

export async function deleteAllRegistros(fichaId: string): Promise<void> {
  try {
    const registrosRef = collection(
      db,
      "fichaAtendimento",
      fichaId,
      "registro",
    );

    const registrosSnap = await getDocs(registrosRef);

    await Promise.all(
      registrosSnap.docs.map((registro) =>
        deleteDoc(
          doc(db, "fichaAtendimento", fichaId, "registro", registro.id),
        ),
      ),
    );
  } catch (error) {
    console.error("Erro ao excluir registros:", error);
    throw error;
  }
}
