export type TipoUsuario = "PSICOLOGO" | "PACIENTE";

export interface IUsuario {
  id: string;
  idAuth: string;
  nome: string;
  email: string;
  tipo?: TipoUsuario;
  crp?: string;
  cpf?: string;
  contato?: string;
  contatoEmerg?: string;
  dataNasc?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}
