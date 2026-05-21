import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LARGURA_SIDEBAR = Dimensions.get("window").width * 0.78;

interface ConfigSubItem {
  rotulo: string;
  rota?: string;
  onPress?: () => void;
}

interface ConfigItemNav {
  icone: keyof typeof MaterialIcons.glyphMap;
  rotulo: string;
  rota?: string;
  onPress?: () => void;
  subItens?: ConfigSubItem[];
}

interface Propriedades {
  visivel: boolean;
  onClose: () => void;
  itens: ConfigItemNav[];
}

function ItemNav({
  icone,
  rotulo,
  onPress,
}: {
  icone: keyof typeof MaterialIcons.glyphMap;
  rotulo: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
      }}
    >
      <MaterialIcons name={icone} size={22} color="#1a1a1a" />
      <Text style={{ fontSize: 16, color: "#1a1a1a" }}>{rotulo}</Text>
    </TouchableOpacity>
  );
}

function ItemSub({ rotulo, onPress }: { rotulo: string; onPress: () => void }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 10,
        paddingLeft: 36,
        paddingRight: 20,
        borderLeftWidth: 2,
        borderLeftColor: "#D0D0D0",
        marginLeft: 20,
      }}
    >
      <Text style={{ fontSize: 15, color: "#1a1a1a" }}>{rotulo}</Text>
    </TouchableOpacity>
  );
}

export function Sidebar({ visivel, onClose, itens }: Propriedades) {
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(-LARGURA_SIDEBAR)).current;
  const opacidadeFundo = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visivel ? 0 : -LARGURA_SIDEBAR,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacidadeFundo, {
        toValue: visivel ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visivel]);

  function navegar(rota: string) {
    onClose();
    router.push(rota as any);
  }

  function aoSair() {
    onClose();
    router.replace("/login");
  }

  function resolverAcao(config: { rota?: string; onPress?: () => void }) {
    if (config.rota) return () => navegar(config.rota!);
    if (config.onPress) return config.onPress;
    return () => {};
  }

  return (
    <View
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      pointerEvents={visivel ? "auto" : "none"}
    >
      <Pressable
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        onPress={onClose}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            opacity: opacidadeFundo,
          }}
        />
      </Pressable>

      <Animated.View
        className="bg-white"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: LARGURA_SIDEBAR,
          transform: [{ translateX }],
        }}
      >
        <View
          className="bg-primary justify-end flex-row"
          style={{
            paddingTop: insets.top + 16,
            paddingBottom: 20,
            paddingHorizontal: 16,
          }}
        >
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="chevron-left" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, paddingVertical: 8 }}>
          {itens.map((item, i) => (
            <View key={i}>
              <ItemNav
                icone={item.icone}
                rotulo={item.rotulo}
                onPress={resolverAcao(item)}
              />
              {item.subItens?.map((sub, j) => (
                <ItemSub
                  key={j}
                  rotulo={sub.rotulo}
                  onPress={resolverAcao(sub)}
                />
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={aoSair}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 16,
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: "#F0F0F0",
          }}
        >
          <MaterialIcons name="logout" size={22} color="#990000" />
          <Text className="text-red font-semibold text-base">Sair</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
