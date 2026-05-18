import { Modal, View, Text, TouchableOpacity, Pressable, Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { type ActionPosition } from "./PatientCard";

const DROPDOWN_WIDTH = 172;
const SCREEN_WIDTH = Dimensions.get("window").width;

interface Props {
  visible: boolean;
  patientId: string | null;
  position: ActionPosition | null;
  onClose: () => void;
  onExcluir: () => void;
}

export function PatientActionsModal({
  visible,
  patientId,
  position,
  onClose,
  onExcluir,
}: Props) {
  const dropdownX = position
    ? Math.min(
        SCREEN_WIDTH - DROPDOWN_WIDTH - 8,
        position.x + position.width - DROPDOWN_WIDTH
      )
    : 0;

  const dropdownY = position ? position.y + position.height + 6 : 0;

  function handleRegistros() {
    onClose();
    router.push({
      pathname: "/(psicologo)/registros/[id]",
      params: { id: patientId ?? "" },
    });
  }

  function handleExcluir() {
    onClose();
    onExcluir();
  }

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
          <TouchableOpacity
            onPress={handleRegistros}
            className="flex-row items-center gap-3 px-4 py-4"
          >
            <MaterialIcons name="article" size={22} color="#1a1a1a" />
            <Text className="text-sm text-grey-800">Registros</Text>
          </TouchableOpacity>

          <View className="h-px bg-gray-100" />

          <TouchableOpacity
            onPress={handleExcluir}
            className="flex-row items-center gap-3 px-4 py-4"
          >
            <MaterialIcons name="delete" size={22} color="#990000" />
            <Text className="text-sm font-semibold text-red">Excluir</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}
