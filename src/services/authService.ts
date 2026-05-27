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

// export async function login(email: string, password: string): Promise<void> {
//   try {
//     await signInWithEmailAndPassword(auth, email, password);
//   } catch (err: any) {
//     throw new Error(traduzirErro(err.code));
//   }
// }

// export async function registerPsicologo(dados: {
//   nome: string;
//   email: string;
//   password: string;
//   crp: string;
// }): Promise<void> {
//   try {
//     const { user } = await createUserWithEmailAndPassword(
//       auth,
//       dados.email,
//       dados.password,
//     );
//     await addDoc(collection(db, "usuario"), {
//       idAuth: user.uid,
//       nome: dados.nome,
//       email: dados.email,
//       tipo: "PSICOLOGO",
//       crp: dados.crp,
//       data_criacao: serverTimestamp(),
//       data_atualizacao: serverTimestamp(),
//     });
//   } catch (err: any) {
//     throw new Error(traduzirErro(err.code));
//   }
// }

// export async function logout(): Promise<void> {
//   await signOut(auth);
// }

// export async function updateUserPassword(
//   oldPassword: string,
//   newPassword: string,
// ): Promise<void> {
//   if (!auth.currentUser?.email) throw new Error("Usuário não autenticado.");
//   try {
//     const credential = EmailAuthProvider.credential(
//       auth.currentUser.email,
//       oldPassword,
//     );
//     await reauthenticateWithCredential(auth.currentUser, credential);
//     await firebaseUpdatePassword(auth.currentUser, newPassword);
//   } catch (err: any) {
//     throw new Error(traduzirErro(err.code));
//   }
// }

export async function deleteAccountPsicologo(uid: string): Promise<void> {
  const psicologoSnap = await getDocs(
    query(collection(db, "usuario"), where("idAuth", "==", uid)),
  );
  if (psicologoSnap.empty) throw new Error("Usuário não encontrado.");
  const psicologoDocId = psicologoSnap.docs[0].id;

  const fichasSnap = await getDocs(
    query(
      collection(db, "fichaAtendimento"),
      where("idPsicologo", "==", psicologoDocId),
      where("status", "==", "ativo"),
    ),
  );
  const batch = writeBatch(db);
  fichasSnap.docs.forEach((d) =>
    batch.update(d.ref, {
      status: "inativo",
      data_atualizacao: serverTimestamp(),
    }),
  );
  batch.delete(doc(db, "usuario", psicologoDocId));
  await batch.commit();
  if (auth.currentUser) await deleteUser(auth.currentUser);
}

export async function deleteAccountPaciente(uid: string): Promise<void> {
  const pacienteSnap = await getDocs(
    query(collection(db, "usuario"), where("idAuth", "==", uid)),
  );
  if (pacienteSnap.empty) throw new Error("Usuário não encontrado.");
  const pacienteDocId = pacienteSnap.docs[0].id;

  const fichasSnap = await getDocs(
    query(
      collection(db, "fichaAtendimento"),
      where("idPaciente", "==", pacienteDocId),
      where("status", "==", "ativo"),
    ),
  );
  const batch = writeBatch(db);
  fichasSnap.docs.forEach((d) =>
    batch.update(d.ref, {
      status: "inativo",
      data_atualizacao: serverTimestamp(),
    }),
  );
  batch.delete(doc(db, "usuario", pacienteDocId));
  await batch.commit();
  if (auth.currentUser) await deleteUser(auth.currentUser);
}

// // Usa app secundário para não deslogar o psicólogo atual ao criar conta do paciente
// export async function registerPaciente(dados: {
//   nome: string;
//   email: string;
//   password: string;
//   cpf: string;
//   data_nasc?: string;
// }): Promise<string> {
//   const secondaryApp = initializeApp(firebaseConfig, `reg-pac-${Date.now()}`);
//   const secondaryAuth = getAuth(secondaryApp);
//   try {
//     const { user } = await createUserWithEmailAndPassword(
//       secondaryAuth,
//       dados.email,
//       dados.password,
//     );
//     const docRef = await addDoc(collection(db, "usuario"), {
//       idAuth: user.uid,
//       nome: dados.nome,
//       email: dados.email,
//       tipo: "PACIENTE",
//       cpf: dados.cpf,
//       data_nasc: dados.data_nasc ?? null,
//       data_criacao: serverTimestamp(),
//       data_atualizacao: serverTimestamp(),
//     });
//     return docRef.id;
//   } catch (err: any) {
//     throw new Error(traduzirErro(err.code));
//   } finally {
//     await deleteApp(secondaryApp);
//   }
// }
