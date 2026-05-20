import { Sidebar } from "@/src/components/Sidebar";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
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
          headerRightContainerStyle: { paddingRight: 30 },

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              style={{ marginLeft: 15 }}
            >
              <MaterialIcons name="menu" size={28} color="#5C868E" />
            </TouchableOpacity>
          ),

          headerRight: () => (
            <View className="flex-row items-center gap-2">
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
            </View>
          ),
        }}
      />

      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        items={[
          { icon: "home", label: "Home", route: "/(paciente)" },
          {
            icon: "format-list-bulleted",
            label: "Relatos",
            route: "/(paciente)/relatos",
            subItems: [
              { label: "Meus Relatos", route: "/(paciente)/relatos" },
              { label: "Adicionar Relato", route: "/(paciente)/relatos" },
            ],
          },
          {
            icon: "group-add",
            label: "Solicitações de Vínculo",
            route: "/(paciente)/solicitacoes",
          },
          {
            icon: "person",
            label: "Meus Dados",
            route: "/(paciente)/meus-dados",
          },
        ]}
      />
    </View>
  );
}
