import { Sidebar } from "@/src/components/Sidebar";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

export default function PacienteLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={() => null}
        screenOptions={{
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerShadowVisible: false,

          headerTitle: () => null,

          headerLeftContainerStyle: { paddingLeft: 5 },

          headerRightContainerStyle: { paddingRight: 5 },

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="menu" size={28} color="#5C868E" />
            </TouchableOpacity>
          ),

          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push("/(paciente)")}
              className="flex-row items-center gap-2 pr-5"
            >
              <Image
                source={require("@/src/assets/logo/logo_img_conecta.png")}
                style={{ width: 35, height: 35 }}
                resizeMode="contain"
              />
              <Image
                source={require("@/src/assets/logo/logo_nome_conecta.png")}
                style={{ width: 85, height: 30 }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}
      />

      <Sidebar
        visivel={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        itens={[
          { icone: "home", rotulo: "Home", rota: "/(paciente)" },
          {
            icone: "format-list-bulleted",
            rotulo: "Relatos",
            rota: "/(paciente)/relatos",
            subItens: [
              { rotulo: "Meus Relatos", rota: "/(paciente)/relatos" },
              {
                rotulo: "Adicionar Relato",
                rota: "/(paciente)/relatos?openAdd=1",
              },
            ],
          },
          {
            icone: "group-add",
            rotulo: "Solicitações de Vínculo",
            rota: "/(paciente)/solicitacoes",
          },
          {
            icone: "person",
            rotulo: "Meus Dados",
            rota: "/(paciente)/meus-dados",
          },
        ]}
      />
    </View>
  );
}
