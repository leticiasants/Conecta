export interface IPaciente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  contato?: string;
  contatoEmergencia?: string;
  nascimento?: string;
  idFicha: string;
}

export interface IPacienteComSolicitacao extends IPaciente {
  idSolicitacao: string;
  dataSolicitacao: string;
}
