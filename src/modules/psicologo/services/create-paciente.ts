import { db, firebaseConfig } from "@/src/lib/firebase";
import { deleteApp, initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function createPaciente(dados: {
  nome: string;
  email: string;
  password: string;
  cpf: string;
  psicologoId: string;
  dataNasc?: string;
}): Promise<string> {
  const secondaryApp = initializeApp(firebaseConfig, `reg-pac-${Date.now()}`);
  const secondaryAuth = getAuth(secondaryApp);

  try {
    const { user } = await createUserWithEmailAndPassword(
      secondaryAuth,
      dados.email,
      dados.password,
    );

    const pacienteRef = await addDoc(collection(db, "usuario"), {
      idAuth: user.uid,
      nome: dados.nome,
      email: dados.email,
      tipo: "PACIENTE",
      cpf: dados.cpf,
      dataNasc: dados.dataNasc ?? null,
      dataCriacao: serverTimestamp(),
      dataAtualizacao: serverTimestamp(),
    });
    await addDoc(collection(db, "fichaAtendimento"), {
      idPaciente: pacienteRef.id,
      idPsicologo: dados.psicologoId,
      status: "ATIVO",
      dataCriacao: serverTimestamp(),
      dataAtualizacao: serverTimestamp(),
    });
    return pacienteRef.id;
  } catch (err: any) {
    throw new Error(err.message ?? err.code);
  } finally {
    await deleteApp(secondaryApp);
  }
}
