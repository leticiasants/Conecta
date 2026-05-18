import {
  Animated,
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SIDEBAR_WIDTH = Dimensions.get("window").width * 0.78;

interface Props {
  visible: boolean;
  onClose: () => void;
  onCadastrarPaciente: () => void;
}

export function Sidebar({ visible, onClose, onCadastrarPaciente }: Props) {
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : SIDEBAR_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  function handleNavigate(route: Href) {
    onClose();
    router.push(route);
  }

  const navItems: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    onPress: () => void;
  }[] = [
    {
      icon: "home",
      label: "Home",
      onPress: () => handleNavigate("/(psicologo)"),
    },
    {
      icon: "format-list-bulleted",
      label: "Pacientes",
      onPress: () => handleNavigate("/(psicologo)/pacientes"),
    },
    {
      icon: "person-add",
      label: "Cadastrar Paciente",
      onPress: () => {
        onClose();
        onCadastrarPaciente();
      },
    },
  ];

  function handleLogout() {
    onClose();
    router.replace("/login");
  }

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents={visible ? "auto" : "none"}
    >
      <Pressable
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={onClose}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            opacity: backdropOpacity,
          }}
        />
      </Pressable>

      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
          backgroundColor: "white",
          transform: [{ translateX }],
        }}
      >
        <View
          style={{
            backgroundColor: "#2A6F68",
            paddingTop: insets.top + 16,
            paddingBottom: 20,
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="chevron-right" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, paddingVertical: 8 }}>
          {navItems.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 14,
                paddingVertical: 16,
                paddingHorizontal: 20,
              }}
            >
              <MaterialIcons name={item.icon} size={22} color="#1a1a1a" />
              <Text style={{ fontSize: 16, color: "#1a1a1a" }}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom,
            paddingTop: 16,
          }}
        >
          <MaterialIcons name="logout" size={22} color="#8B0000" />
          <Text style={{ color: "#8B0000", fontWeight: "600", fontSize: 16 }}>
            Sair
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
