export interface IUsuario {
  id: string;
  nome: string;
  email: string;
  cpf?: string;
  crp?: string;
  tipo?: "PACIENTE" | "PSICOLOGO";
  contato?: string;
  contatoEmergencia?: string;
  nascimento?: string;
}
