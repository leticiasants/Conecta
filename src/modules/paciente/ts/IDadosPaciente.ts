export interface IDadosPaciente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  contato?: string;
  contatoEmergencia?: string;
  nascimento: string;
}
