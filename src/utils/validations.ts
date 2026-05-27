export function validarCPF(cpf: string): true | string {
  const d = cpf.replace(/\D/g, "");
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return "CPF inválido";

  const calc = (len: number) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += +d[i] * (len + 1 - i);
    const r = (sum * 10) % 11;
    return (r >= 10 ? 0 : r) === +d[len];
  };

  return (calc(9) && calc(10)) || "CPF inválido";
}

export function validarCRP(crp: string): true | string {
  return /^\d{2}\/\d{4,6}$/.test(crp) || "Formato inválido. Use XX/XXXXXX";
}

export function validarData(data: string): true | string {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return "Use DD/MM/AAAA";
  const [d, m, y] = data.split("/").map(Number);
  const date = new Date(y, m - 1, d);
  if (
    date.getFullYear() !== y ||
    date.getMonth() !== m - 1 ||
    date.getDate() !== d
  )
    return "Data inválida";
  return true;
}

export function validarTelefone(tel: string): true | string {
  const d = tel.replace(/\D/g, "");
  return (d.length === 10 || d.length === 11) || "Telefone inválido";
}

export const EMAIL_PATTERN = {
  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: "E-mail inválido",
};
