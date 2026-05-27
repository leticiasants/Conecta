import { useAuth } from "@/src/contexts/AuthContext";
import { updateUsuario } from "@/src/modules/usuario/services/update-usuario";
import { formatContato, formatCRP } from "@/src/utils/formatters";
import {
  EMAIL_PATTERN,
  validarCRP,
  validarTelefone,
} from "@/src/utils/validations";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
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
import { IDadosPsicologo } from "../../ts/IDadosPsicologo";

interface Props {
  visible: boolean;
  onClose: () => void;
  initialData?: IDadosPsicologo;
}

type FormData = { nome: string; email: string; crp: string; contato: string };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="text-red-500 text-xs mt-1">{message}</Text>;
}

export function ModalEditarDados({ visible, onClose, initialData }: Props) {
  const { userProfile, refreshUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nome: initialData?.nome ?? "",
      email: initialData?.email ?? "",
      crp: initialData?.crp ?? "",
      contato: initialData?.contato ?? "",
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        nome: initialData?.nome ?? "",
        email: initialData?.email ?? "",
        crp: initialData?.crp ?? "",
        contato: initialData?.contato ?? "",
      });
    }
  }, []);

  async function onSubmit(data: FormData) {
    if (!userProfile) return;
    try {
      await updateUsuario(userProfile.id, {
        nome: data.nome,
        email: data.email,
        crp: data.crp,
        contato: data.contato,
      });
      await refreshUserProfile();
      onClose();
    } catch {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
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
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 40,
              }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity
                onPress={onClose}
                className="self-end pt-4 pb-2"
              >
                <MaterialIcons name="close" size={24} color="#3D3D3D" />
              </TouchableOpacity>

              <Text className="text-4xl font-bold text-primary text-center mb-8">
                Editar Dados
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
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="João da Silva"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
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
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="joao@email.com"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  )}
                />
                <FieldError message={errors.email?.message} />
              </View>

              {/* CRP */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  CRP <Text className="text-primary">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="crp"
                  rules={{
                    required: "CRP é obrigatório",
                    validate: validarCRP,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="01/12345"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={(text) => onChange(formatCRP(text))}
                      onBlur={onBlur}
                    />
                  )}
                />
                <FieldError message={errors.crp?.message} />
              </View>

              {/* Contato */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">Contato</Text>
                <Controller
                  control={control}
                  name="contato"
                  rules={{
                    validate: (v) => {
                      if (!v) return true;
                      return validarTelefone(v) || "Telefone inválido";
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="(35) 99999-9999"
                      placeholderTextColor="#aaa"
                      value={String(value || "")}
                      onChangeText={(text) => onChange(formatContato(text))}
                      onBlur={onBlur}
                      keyboardType="phone-pad"
                    />
                  )}
                />
                <FieldError message={errors.contato?.message} />
              </View>

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
