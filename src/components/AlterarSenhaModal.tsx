import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
}

function PasswordField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <View className="mb-5">
      <Text className="text-grey-800 text-sm mb-1">
        {label} <Text className="text-primary">*</Text>
      </Text>
      <View className="bg-gray-100 rounded-xl flex-row items-center px-4">
        <TextInput
          className="flex-1 py-4 text-sm text-grey-800"
          placeholder="••••••••"
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChange}
          secureTextEntry={!show}
        />
        <TouchableOpacity onPress={() => setShow(!show)}>
          <MaterialIcons
            name={show ? "visibility" : "visibility-off"}
            size={22}
            color="#aaa"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function AlterarSenhaModal({ visible, onClose }: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  function handleSave() {
    // TODO: integrar com API
    setOldPassword("");
    setNewPassword("");
    setRepeatPassword("");
    onClose();
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-5">
        <KeyboardAvoidingView
          className="w-full"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="bg-white rounded-3xl w-full">
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity onPress={onClose} className="self-end pt-4 pb-2">
                <MaterialIcons name="close" size={24} color="#3D3D3D" />
              </TouchableOpacity>

              <Text className="text-4xl font-bold text-primary text-center mb-3">
                Alterando senha
              </Text>
              <Text className="text-sm text-grey-800 text-center mb-8 leading-5">
                Para manter sua conta segura, escolha uma nova senha forte e
                exclusiva. Certifique-se de que seja diferente das senhas usadas
                anteriormente.
              </Text>

              <PasswordField
                label="Senha antiga"
                value={oldPassword}
                onChange={setOldPassword}
              />
              <PasswordField
                label="Nova senha"
                value={newPassword}
                onChange={setNewPassword}
              />
              <PasswordField
                label="Repetir senha"
                value={repeatPassword}
                onChange={setRepeatPassword}
              />

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center mt-2"
                onPress={handleSave}
              >
                <Text className="text-white font-bold text-base">Salvar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
