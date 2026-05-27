import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updateSenha } from "../modules/auth/services/update-senha";

interface Props {
  visible: boolean;
  onClose: () => void;
}

type FormData = {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
};

function PasswordField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
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
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
}

export function AlterarSenhaModal({ visible, onClose }: Props) {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { oldPassword: "", newPassword: "", repeatPassword: "" },
  });

  function handleClose() {
    reset();
    onClose();
  }

  async function onSubmit(data: FormData) {
    try {
      await updateSenha(data.oldPassword, data.newPassword);
      Alert.alert("Sucesso", "Senha alterada com sucesso.");
      handleClose();
    } catch (err: any) {
      Alert.alert("Erro", err.message);
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-5">
        <KeyboardAvoidingView
          className="w-full"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="bg-white rounded-3xl w-full">
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 40,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity
                onPress={handleClose}
                className="self-end pt-4 pb-2"
              >
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

              <Controller
                control={control}
                name="oldPassword"
                rules={{ required: "Senha antiga é obrigatória" }}
                render={({ field: { onChange, value } }) => (
                  <PasswordField
                    label="Senha antiga"
                    value={value}
                    onChange={onChange}
                    error={errors.oldPassword?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="newPassword"
                rules={{
                  required: "Nova senha é obrigatória",
                  minLength: { value: 6, message: "Mínimo 6 caracteres" },
                }}
                render={({ field: { onChange, value } }) => (
                  <PasswordField
                    label="Nova senha"
                    value={value}
                    onChange={onChange}
                    error={errors.newPassword?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="repeatPassword"
                rules={{
                  required: "Confirmação obrigatória",
                  validate: (v) =>
                    v === watch("newPassword") || "As senhas não coincidem",
                }}
                render={({ field: { onChange, value } }) => (
                  <PasswordField
                    label="Repetir senha"
                    value={value}
                    onChange={onChange}
                    error={errors.repeatPassword?.message}
                  />
                )}
              />

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center mt-2"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">Salvar</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
