import { Tabs } from "expo-router";
import { View, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { SidebarPaciente } from "@/src/components/SidebarPaciente";

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
          headerTitleAlign: "left",

          headerTitle: () => (
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

          headerLeftContainerStyle: { paddingLeft: 5 },
          headerRightContainerStyle: { paddingRight: 5 },

          headerRight: () => (
            <TouchableOpacity
              onPress={() => setSidebarVisible(true)}
              style={{ marginRight: 15 }}
            >
              <MaterialIcons name="menu" size={28} color="#5C868E" />
            </TouchableOpacity>
          ),
        }}
      />

      <SidebarPaciente
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
      />
    </View>
  );
}
