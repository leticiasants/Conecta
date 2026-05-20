import { Modal, View, Text, TouchableOpacity, Pressable } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
  onIniciarNovaFicha: () => void;
  onCompartilharRegistros: () => void;
}

export function AceitarVinculoModal({
  visible,
  onClose,
  onIniciarNovaFicha,
  onCompartilharRegistros,
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
            <Text className="text-2xl font-bold text-center text-grey-800 mb-8 leading-9">
              Ao aceitar o vínculo com este profissional, seu vínculo atual será
              alterado. Você prefere começar um novo acompanhamento do zero ou
              compartilhar seus registros anteriores?
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  onClose();
                  onIniciarNovaFicha();
                }}
                className="flex-1 py-4 rounded-2xl items-center border-2 border-primary"
              >
                <Text className="font-semibold text-sm text-primary text-center">
                  Iniciar nova ficha
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  onClose();
                  onCompartilharRegistros();
                }}
                className="flex-1 py-4 rounded-2xl items-center bg-primary"
              >
                <Text className="text-white font-bold text-sm text-center">
                  Compartilhar registros
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
