import { useAuth } from "@/src/contexts/AuthContext";
import { Redirect } from "expo-router";

export default function Index() {
  const { user, userProfile, loading } = useAuth();

  if (loading) return null;

  if (!user) return <Redirect href="/login" />;

  if (userProfile?.tipo === "PSICOLOGO") return <Redirect href="/(psicologo)" />;

  return <Redirect href="/(paciente)" />;
}
