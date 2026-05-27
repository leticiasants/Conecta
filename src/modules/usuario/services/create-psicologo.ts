import { auth, db } from "@/src/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

function traduzirErro(code: string): string {
  const mensagens: Record<string, string> = {
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/email-already-in-use": "Este e-mail já está em uso.",
    "auth/weak-password": "A senha deve ter no mínimo 6 caracteres.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
  };
  return mensagens[code] ?? "Erro inesperado. Tente novamente.";
}

export async function createPsicologo(dados: {
  nome: string;
  email: string;
  senha: string;
  crp: string;
}): Promise<void> {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      dados.email,
      dados.senha,
    );
    await addDoc(collection(db, "usuario"), {
      idAuth: user.uid,
      nome: dados.nome,
      email: dados.email,
      tipo: "PSICOLOGO",
      crp: dados.crp,
      data_criacao: serverTimestamp(),
      data_atualizacao: serverTimestamp(),
    });
  } catch (err: any) {
    throw new Error(traduzirErro(err.code));
  }
}
