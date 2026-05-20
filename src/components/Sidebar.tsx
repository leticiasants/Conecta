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

const SIDEBAR_WIDTH = Dimensions.get("window").width * 0.78;

interface SubItemConfig {
  label: string;
  route?: string;
  onPress?: () => void;
}

interface NavItemConfig {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  route?: string;
  onPress?: () => void;
  subItems?: SubItemConfig[];
}

interface Props {
  visible: boolean;
  onClose: () => void;
  items: NavItemConfig[];
}

function NavItem({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
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
      <MaterialIcons name={icon} size={22} color="#1a1a1a" />
      <Text style={{ fontSize: 16, color: "#1a1a1a" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function SubItem({ label, onPress }: { label: string; onPress: () => void }) {
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
      <Text style={{ fontSize: 15, color: "#1a1a1a" }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Sidebar({ visible, onClose, items }: Props) {
  const insets = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: visible ? 0 : -SIDEBAR_WIDTH,
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

  function nav(route: string) {
    onClose();
    router.push(route as any);
  }

  function handleLogout() {
    onClose();
    router.replace("/login");
  }

  function resolvePress(config: { route?: string; onPress?: () => void }) {
    if (config.route) return () => nav(config.route!);
    if (config.onPress) return config.onPress;
    return () => {};
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
        className="bg-white"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: SIDEBAR_WIDTH,
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
          {items.map((item, i) => (
            <View key={i}>
              <NavItem
                icon={item.icon}
                label={item.label}
                onPress={resolvePress(item)}
              />
              {item.subItems?.map((sub, j) => (
                <SubItem
                  key={j}
                  label={sub.label}
                  onPress={resolvePress(sub)}
                />
              ))}
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleLogout}
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
