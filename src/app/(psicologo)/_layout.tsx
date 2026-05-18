import { Tabs } from "expo-router";
import { View, Image, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const ICON_COLOR = "#2A6F68";

export default function PsicologoLayout() {
  return (
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

        headerLeftContainerStyle: {
          paddingLeft: 5,
        },

        headerRightContainerStyle: {
          paddingRight: 5,
        },

        headerRight: () => (
          <TouchableOpacity
            onPress={() => {}}
            style={{
              marginRight: 15,
            }}
          >
            <MaterialIcons name="menu" size={28} color={ICON_COLOR} />
          </TouchableOpacity>
        ),
      }}
    />
  );
}
