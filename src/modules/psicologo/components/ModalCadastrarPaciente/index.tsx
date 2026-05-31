import { FieldError } from "@/src/components/FieldError";
import { useAuth } from "@/src/contexts/AuthContext";
import { createPaciente } from "@/src/modules/psicologo/services/create-paciente";
import { formatCPF, formatDate } from "@/src/utils/formatters";
import {
  EMAIL_PATTERN,
  validarCPF,
  validarData,
} from "@/src/utils/validations";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  nascimento: string;
  senha: string;
};

export function ModalCadastrarPaciente({ visible, onClose }: Props) {
  const { userProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: { nome: "", email: "", cpf: "", nascimento: "", senha: "" },
  });

  function handleClose() {
    reset();
    setShowPassword(false);
    onClose();
  }

  async function onSubmit(data: FormData) {
    if (!userProfile) return;

    try {
      await createPaciente({
        nome: data.nome,
        email: data.email,
        password: data.senha,
        cpf: data.cpf,
        psicologoId: userProfile.id,
        dataNasc: data.nascimento || undefined,
      });
      handleClose();
    } catch (err: any) {
      setError("root", { message: err.message });
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
          className="w-full justify-center"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <View className="bg-white rounded-3xl min-w-full max-h-full">
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

              <Text className="text-4xl font-bold text-primary text-center mb-8">
                Cadastro
              </Text>

              {/* Nome */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  Nome <Text className="text-primary">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="nome"
                  rules={{ required: "Nome é obrigatório" }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="João da Silva"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
                <FieldError message={errors.nome?.message} />
              </View>

              {/* E-mail */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  E-mail <Text className="text-primary">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    required: "E-mail é obrigatório",
                    pattern: EMAIL_PATTERN,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="exemplo@mail.com"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                <FieldError message={errors.email?.message} />
              </View>

              {/* CPF */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  CPF <Text className="text-primary">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="cpf"
                  rules={{
                    required: "CPF é obrigatório",
                    validate: validarCPF,
                  }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="XXX.XXX.XXX-XX"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={(v) => onChange(formatCPF(v))}
                      keyboardType="numeric"
                    />
                  )}
                />
                <FieldError message={errors.cpf?.message} />
              </View>

              {/* Data de Nascimento */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  Data de Nascimento
                </Text>
                <Controller
                  control={control}
                  name="nascimento"
                  rules={{ validate: (v) => !v || validarData(v) }}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={(v) => onChange(formatDate(v))}
                      keyboardType="numeric"
                    />
                  )}
                />
                <FieldError message={errors.nascimento?.message} />
              </View>

              {/* Senha */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  Senha <Text className="text-primary">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="senha"
                  rules={{
                    required: "Senha é obrigatória",
                    minLength: { value: 6, message: "Mínimo 6 caracteres" },
                  }}
                  render={({ field: { onChange, value } }) => (
                    <View className="bg-gray-100 rounded-xl flex-row items-center px-4">
                      <TextInput
                        className="flex-1 py-4 text-sm text-grey-800"
                        placeholder="••••••••"
                        placeholderTextColor="#aaa"
                        value={value}
                        onChangeText={onChange}
                        secureTextEntry={!showPassword}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <MaterialIcons
                          name={showPassword ? "visibility" : "visibility-off"}
                          size={22}
                          color="#aaa"
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                />
                <FieldError message={errors.senha?.message} />
              </View>

              <FieldError message={errors.root?.message} />
              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center mt-2"
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-base">
                    Cadastrar
                  </Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
