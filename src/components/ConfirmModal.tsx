import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

interface Props {
  visible: boolean;
  message: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmModal({
  visible,
  message,
  confirmLabel = "Remover",
  onClose,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 bg-black/40 justify-center items-center px-8"
        onPress={onClose}
      >
        <Pressable onPress={() => {}}>
          <View
            className="bg-white rounded-3xl px-6 py-8"
            style={{
              elevation: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
            }}
          >
            <Text className="text-base font-semibold text-center text-grey-800 mb-6">
              {message}
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="flex-1 py-2 rounded-2xl items-center border-2 border-primary"
              >
                <Text className="font-semibold text-base text-primary">
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 py-3 rounded-2xl items-center bg-primary"
              >
                <Text className="text-white font-bold text-base">
                  {confirmLabel}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
