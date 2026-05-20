import { Tabs } from "expo-router";
import { View, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Sidebar } from "@/src/components/Sidebar";
import { CadastrarPacienteModal } from "@/src/components/CadastrarPacienteModal";

const ICON_COLOR = "#2A6F68";

export default function PsicologoLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [cadastroVisible, setCadastroVisible] = useState(false);

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

          headerLeftContainerStyle: {
            paddingLeft: 5,
          },

          headerRightContainerStyle: {
            paddingRight: 5,
          },

          headerLeft: () => (
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              style={{
                marginLeft: 15,
              }}
            >
              <MaterialIcons name="menu" size={28} color={ICON_COLOR} />
            </TouchableOpacity>
          ),

          headerRight: () => (
            <View className="flex-row items-center gap-2">
              <Image
                source={require("@/src/assets/logo/logo_img_conecta.png")}
                style={{
                  width: 35,
                  height: 35,
                }}
                resizeMode="contain"
              />

              <Image
                source={require("@/src/assets/logo/logo_nome_conecta.png")}
                style={{
                  width: 85,
                  height: 30,
                }}
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
          { icon: "home", label: "Home", route: "/(psicologo)" },
          {
            icon: "people",
            label: "Pacientes",
            route: "/(psicologo)/pacientes",
            subItems: [
              { label: "Meus Pacientes", route: "/(psicologo)/pacientes" },
              { label: "Cadastrar Pacientes", onPress: () => { setSidebarVisible(false); setCadastroVisible(true); } },
            ],
          },
          {
            icon: "person-add",
            label: "Vínculos",
            route: "/(psicologo)/vinculos/solicitar",
            subItems: [
              { label: "Solicitar Vínculo", route: "/(psicologo)/vinculos/solicitar" },
              { label: "Vínculos Pendentes", route: "/(psicologo)/vinculos/pendentes" },
            ],
          },
          { icon: "person", label: "Meus Dados", route: "/(psicologo)/meus-dados" },
        ]}
      />

      <CadastrarPacienteModal
        visible={cadastroVisible}
        onClose={() => setCadastroVisible(false)}
      />
    </View>
  );
}
