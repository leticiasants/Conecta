import { auth, db } from "@/src/lib/firebase";
import { IUsuario } from "@/src/modules/usuario/ts/IUsuario";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";

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

interface IPayload {
  email: string;
  senha: string;
}

interface IResponse {
  token: string;
  usuario: IUsuario;
}

export async function login({ email, senha }: IPayload): Promise<IResponse> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);

    const firebaseUser = userCredential.user;

    const token = await firebaseUser.getIdToken();

    // Busca usuário pelo campo idAuth
    const usuariosRef = collection(db, "usuario");

    const q = query(usuariosRef, where("idAuth", "==", firebaseUser.uid));

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("USER_NOT_FOUND_DB");
    }

    const usuarioDoc = querySnapshot.docs[0];

    const usuario = {
      id: usuarioDoc.id,
      ...usuarioDoc.data(),
    } as IUsuario;

    return {
      token,
      usuario,
    };
  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND_DB") {
      throw new Error("Usuário não encontrado na base de dados.");
    }

    throw new Error(traduzirErro(err.code));
  }
}
