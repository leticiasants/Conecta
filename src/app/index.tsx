import { Redirect } from "expo-router";

export default function Index() {
  // TODO: verificar sessão ativa — se autenticado, redirecionar para /(tabs)
  return <Redirect href="/login" />;
}
