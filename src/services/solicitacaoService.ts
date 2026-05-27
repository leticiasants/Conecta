import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import { IUsuario } from "@/src/types/IUsuario";
import { getFichaDoPaciente } from "./fichaAtendimentoService";

export interface ISolicitacao {
  id: string;
  id_psicologo: string;
  id_paciente: string;
  nome_psicologo: string;
  email_psicologo: string;
  crp_psicologo: string;
  nome_paciente: string;
  email_paciente: string;
  contato_paciente?: string;
  status: "pendente" | "aceito" | "recusado" | "cancelado";
}

export async function solicitar(
  psicologo: IUsuario,
  paciente: { id: string; nome: string; email: string; contato?: string }
): Promise<void> {
  const q = query(
    collection(db, "solicitacoes_vinculo"),
    where("id_psicologo", "==", psicologo.id),
    where("id_paciente", "==", paciente.id),
    where("status", "==", "pendente")
  );
  const existing = await getDocs(q);
  if (!existing.empty) return;

  await addDoc(collection(db, "solicitacoes_vinculo"), {
    id_psicologo: psicologo.id,
    id_paciente: paciente.id,
    nome_psicologo: psicologo.nome,
    email_psicologo: psicologo.email,
    crp_psicologo: psicologo.crp,
    nome_paciente: paciente.nome,
    email_paciente: paciente.email,
    contato_paciente: paciente.contato ?? null,
    status: "pendente",
    data_criacao: serverTimestamp(),
    data_atualizacao: serverTimestamp(),
  });
}

export async function listarPendentesDoPsicologo(
  psicologoId: string
): Promise<ISolicitacao[]> {
  const q = query(
    collection(db, "solicitacoes_vinculo"),
    where("id_psicologo", "==", psicologoId),
    where("status", "==", "pendente")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ISolicitacao));
}

export async function listarParaPaciente(
  pacienteId: string
): Promise<ISolicitacao[]> {
  const q = query(
    collection(db, "solicitacoes_vinculo"),
    where("id_paciente", "==", pacienteId),
    where("status", "==", "pendente")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ISolicitacao));
}

export async function cancelarSolicitacao(solicitacaoId: string): Promise<void> {
  await updateDoc(doc(db, "solicitacoes_vinculo", solicitacaoId), {
    status: "cancelado",
    data_atualizacao: serverTimestamp(),
  });
}

export async function recusar(solicitacaoId: string): Promise<void> {
  await updateDoc(doc(db, "solicitacoes_vinculo", solicitacaoId), {
    status: "recusado",
    data_atualizacao: serverTimestamp(),
  });
}

export async function aceitar(
  solicitacaoId: string,
  pacienteId: string,
  psicologoId: string
): Promise<void> {
  const batch = writeBatch(db);

  const fichaAtual = await getFichaDoPaciente(pacienteId);
  if (fichaAtual) {
    batch.update(doc(db, "fichaAtendimento", fichaAtual.fichaId), {
      status: "inativo",
      data_atualizacao: serverTimestamp(),
    });
  }

  const novaFichaRef = doc(collection(db, "fichaAtendimento"));
  batch.set(novaFichaRef, {
    idPaciente: pacienteId,
    idPsicologo: psicologoId,
    status: "ativo",
    data_criacao: serverTimestamp(),
    data_atualizacao: serverTimestamp(),
  });

  batch.update(doc(db, "solicitacoes_vinculo", solicitacaoId), {
    status: "aceito",
    data_atualizacao: serverTimestamp(),
  });

  await batch.commit();
}
