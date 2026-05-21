import { Sidebar } from "@/src/components/Sidebar";
import { ModalCadastrarPaciente } from "@/src/modules/psicologo/components";

import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

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
        visivel={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        itens={[
          { icone: "home", rotulo: "Home", rota: "/(psicologo)" },
          {
            icone: "people",
            rotulo: "Pacientes",
            rota: "/(psicologo)/pacientes",
            subItens: [
              { rotulo: "Meus Pacientes", rota: "/(psicologo)/pacientes" },
              {
                rotulo: "Cadastrar Pacientes",
                onPress: () => {
                  setSidebarVisible(false);
                  setCadastroVisible(true);
                },
              },
            ],
          },
          {
            icone: "group-add",
            rotulo: "Vínculos",
            rota: "/(psicologo)/vinculos/solicitar",
            subItens: [
              {
                rotulo: "Solicitar Vínculo",
                rota: "/(psicologo)/vinculos/solicitar",
              },
              {
                rotulo: "Vínculos Pendentes",
                rota: "/(psicologo)/vinculos/pendentes",
              },
            ],
          },
          {
            icone: "person",
            rotulo: "Meus Dados",
            rota: "/(psicologo)/meus-dados",
          },
        ]}
      />

      <ModalCadastrarPaciente
        visible={cadastroVisible}
        onClose={() => setCadastroVisible(false)}
      />
    </View>
  );
}
