import { AlterarSenhaModal } from "@/src/components/AlterarSenhaModal";
import { ConfirmModal } from "@/src/components/ConfirmModal";
import { useAuth } from "@/src/contexts/AuthContext";
import { deletePsicologo } from "@/src/modules/auth/services/delete-psicologo";
import { ModalEditarDados } from "@/src/modules/psicologo/components";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function MeusDadosScreen() {
  const { user, userProfile, signOut } = useAuth();
  const [editarVisible, setEditarVisible] = useState(false);
  const [senhaVisible, setSenhaVisible] = useState(false);
  const [excluirVisible, setExcluirVisible] = useState(false);

  const psicologo = userProfile;

  async function handleExcluirConta() {
    if (!user) return;
    try {
      await deletePsicologo(user.uid);
      router.replace("/login");
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        Alert.alert(
          "Atenção",
          "Por segurança, faça login novamente antes de excluir a conta.",
        );
        await signOut();
        router.replace("/login");
      } else {
        Alert.alert("Erro", "Não foi possível excluir a conta.");
      }
    }
  }

  if (!psicologo) return null;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-8">
        <View className="flex-row items-start justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-primary mb-1">
              Meus Dados
            </Text>
            <Text className="text-sm text-grey-500">
              Veja e edite seus dados sempre que necessário.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setEditarVisible(true)}
            className="w-11 h-11 rounded-full bg-primary items-center justify-center"
          >
            <MaterialIcons name="edit" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View
          className="bg-white px-5 py-5 mb-4"
          style={{
            borderRadius: 12,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
          }}
        >
          <DataRow label="Nome" value={psicologo.nome} />
          <DataRow label="E-mail" value={psicologo.email} />
          <DataRow label="CRP" value={psicologo.crp ?? "—"} />
          <DataRow label="Contato" value={psicologo.contato ?? "—"} last />
        </View>

        <TouchableOpacity
          onPress={() => setSenhaVisible(true)}
          className="flex-row items-center gap-4 bg-white px-5 py-4 mb-3"
          style={{
            borderRadius: 12,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
          }}
        >
          <MaterialIcons name="vpn-key" size={22} color="#1a1a1a" />
          <View>
            <Text className="text-base font-bold text-grey-800">
              Alterar Senha
            </Text>
            <Text className="text-xs text-grey-500">
              Renove sua senha e mantenha-se seguro.
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setExcluirVisible(true)}
          className="flex-row items-center gap-4 bg-white px-5 py-4"
          style={{
            borderRadius: 12,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.08,
            shadowRadius: 3,
          }}
        >
          <MaterialIcons name="delete" size={22} color="#990000" />
          <View className="flex pr-2">
            <Text className="text-base font-bold text-red">Excluir Conta</Text>
            <Text className="text-xs text-grey-500">
              Encerrando sua jornada? A despedida é difícil, mas estamos aqui.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <ModalEditarDados
        visible={editarVisible}
        onClose={() => setEditarVisible(false)}
        initialData={{
          id: psicologo.id,
          nome: psicologo.nome,
          email: psicologo.email,
          crp: psicologo.crp ?? "",
          contato: psicologo.contato,
        }}
      />

      <AlterarSenhaModal
        visible={senhaVisible}
        onClose={() => setSenhaVisible(false)}
      />

      <ConfirmModal
        visible={excluirVisible}
        message="Tem certeza de que deseja excluir sua conta? Esta ação é permanente e não poderá ser desfeita. Ao continuar, você perderá o vínculo com todos os seus pacientes atuais."
        onClose={() => setExcluirVisible(false)}
        onConfirm={handleExcluirConta}
      />
    </ScrollView>
  );
}

function DataRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View className={last ? "" : "mb-4"}>
      <Text className="text-xs text-grey-500 mb-0.5">{label}</Text>
      <Text className="text-base font-semibold text-grey-800">{value}</Text>
    </View>
  );
}
