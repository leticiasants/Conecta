import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { EditarDadosPacienteModal } from "@/src/components/EditarDadosPacienteModal";
import { AlterarSenhaModal } from "@/src/components/AlterarSenhaModal";
import { ConfirmModal } from "@/src/components/ConfirmModal";
import { router } from "expo-router";

const MOCK_DADOS = {
  name: "Maria Silva",
  email: "maria.silva@gmail.com",
  cpf: "123.456.789-00",
  phone: "(35) 99999-9999",
  emergencyPhone: "(35) 98888-8888",
  birthDate: "12/04/1995",
};

export default function MeusDadosPacienteScreen() {
  const [dados] = useState(MOCK_DADOS);
  const [editarVisible, setEditarVisible] = useState(false);
  const [senhaVisible, setSenhaVisible] = useState(false);
  const [excluirVisible, setExcluirVisible] = useState(false);

  function handleExcluirConta() {
    // TODO: integrar com API
    router.replace("/login");
  }

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
          <DataRow label="Nome" value={dados.name} />
          <DataRow label="E-mail" value={dados.email} underline />
          <DataRow label="CPF" value={dados.cpf} />
          <DataRow label="Data de Nascimento" value={dados.birthDate} />
          <DataRow label="Contato" value={dados.phone} />
          <DataRow
            label="Contato de emergência"
            value={dados.emergencyPhone}
            last
          />
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
          <View>
            <Text className="text-base font-bold text-red">Excluir Conta</Text>
            <Text className="text-xs text-grey-500">
              Encerrando sua jornada? A despedida é difícil, mas estamos aqui.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <EditarDadosPacienteModal
        visible={editarVisible}
        onClose={() => setEditarVisible(false)}
        initialData={dados}
      />

      <AlterarSenhaModal
        visible={senhaVisible}
        onClose={() => setSenhaVisible(false)}
      />

      <ConfirmModal
        visible={excluirVisible}
        message="Tem certeza de que deseja excluir sua conta? Esta ação é permanente e não poderá ser desfeita. Ao continuar, você perderá o acesso a todos os seus relatos e vínculos."
        onClose={() => setExcluirVisible(false)}
        onConfirm={handleExcluirConta}
      />
    </ScrollView>
  );
}

function DataRow({
  label,
  value,
  underline,
  last,
}: {
  label: string;
  value: string;
  underline?: boolean;
  last?: boolean;
}) {
  return (
    <View className={last ? "" : "mb-4"}>
      <Text className="text-xs text-grey-500 mb-0.5">{label}</Text>
      <Text
        className={`text-base font-bold ${underline ? "text-primary underline" : "text-grey-800"}`}
      >
        {value}
      </Text>
    </View>
  );
}
