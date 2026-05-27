import { auth } from "@/src/lib/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

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

export async function updateSenha(
  oldPassword: string,
  newPassword: string,
): Promise<void> {
  if (!auth.currentUser?.email) throw new Error("Usuário não autenticado.");
  try {
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      oldPassword,
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  } catch (err: any) {
    throw new Error(traduzirErro(err.code));
  }
}
