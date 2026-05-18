import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmRemoveModal({ visible, onClose, onConfirm }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center", padding: 32 }}
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <View
            className="bg-white rounded-3xl p-8"
            style={{
              elevation: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            }}
          >
            <Text className="text-grey-800 text-xl font-bold text-center mb-8">
              Tem certeza de que deseja remover esse paciente?
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-3 rounded-xl border border-primary items-center"
              >
                <Text className="text-primary font-semibold text-base">Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirm}
                className="flex-1 py-3 rounded-xl bg-primary items-center"
              >
                <Text className="text-white font-semibold text-base">Remover</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
