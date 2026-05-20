import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import type { ActionPosition } from "@/src/types";

const DROPDOWN_WIDTH = 172;
const SCREEN_WIDTH = Dimensions.get("window").width;

export interface ActionItem {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  iconColor?: string;
  labelClass?: string;
  onPress: () => void;
}

interface Props {
  visible: boolean;
  position: ActionPosition | null;
  items: ActionItem[];
  onClose: () => void;
}

export function ActionsDropdownModal({
  visible,
  position,
  items,
  onClose,
}: Props) {
  const dropdownX = position
    ? Math.min(
        SCREEN_WIDTH - DROPDOWN_WIDTH - 8,
        position.x + position.width - DROPDOWN_WIDTH
      )
    : 0;
  const dropdownY = position ? position.y + position.height + 6 : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={{ flex: 1 }} onPress={onClose}>
        <View
          style={{
            position: "absolute",
            top: dropdownY,
            left: dropdownX,
            width: DROPDOWN_WIDTH,
            backgroundColor: "white",
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: "#5C868E",
            elevation: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}
        >
          {items.map((item, index) => (
            <View key={item.label}>
              {index > 0 && <View className="h-px bg-gray-100" />}
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  item.onPress();
                }}
                className="flex-row items-center gap-3 px-4 py-4"
              >
                <MaterialIcons
                  name={item.icon}
                  size={22}
                  color={item.iconColor ?? "#1a1a1a"}
                />
                <Text className={item.labelClass ?? "text-sm text-grey-800"}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}
