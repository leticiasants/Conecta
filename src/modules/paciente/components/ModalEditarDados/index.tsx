import { FieldError } from "@/src/components/FieldError";
import { useAuth } from "@/src/contexts/AuthContext";
import { updateUsuario } from "@/src/modules/usuario/services/update-usuario";
import { IUsuario } from "@/src/modules/usuario/ts/IUsuario";
import { formatContato, formatDate } from "@/src/utils/formatters";
import { validarData, validarTelefone } from "@/src/utils/validations";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect } from "react";
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
  initialData?: Omit<
    IUsuario,
    "idAuth" | "tipo" | "crp" | "dataCriacao" | "dataAtualizacao"
  >;
}

type FormData = {
  nome: string;
  email: string;
  cpf: string;
  contato: string;
  contatoEmerg: string;
  dataNasc: string;
};

export function ModalEditarDados({ visible, onClose, initialData }: Props) {
  const { userProfile, refreshUserProfile } = useAuth();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nome: initialData?.nome ?? "",
      email: initialData?.email ?? "",
      cpf: initialData?.cpf ?? "",
      contato: initialData?.contato ?? "",
      contatoEmerg: initialData?.contatoEmerg ?? "",
      dataNasc: initialData?.dataNasc ?? "",
    },
  });

  useEffect(() => {
    if (visible) {
      reset({
        nome: initialData?.nome ?? "",
        email: initialData?.email ?? "",
        cpf: initialData?.cpf ?? "",
        contato: initialData?.contato ?? "",
        contatoEmerg: initialData?.contatoEmerg ?? "",
        dataNasc: initialData?.dataNasc ?? "",
      });
    }
  }, []);

  async function onSubmit(data: FormData) {
    if (!userProfile) return;
    try {
      await updateUsuario(userProfile.id, {
        nome: data.nome,
        email: data.email,
        cpf: data.cpf,
        contato: data.contato,
        contatoEmerg: data.contatoEmerg,
        dataNasc: data.dataNasc,
      });
      await refreshUserProfile();
      onClose();
    } catch (err: any) {
      setError("root", {
        message: err.message ?? "Não foi possível salvar os dados.",
      });
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

              {/* Contato de emergência */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  Contato de emergência
                </Text>
                <Controller
                  control={control}
                  name="contatoEmerg"
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
                <FieldError message={errors.contatoEmerg?.message} />
              </View>

              {/* Data de Nascimento */}
              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  Data de Nascimento <Text className="text-primary">*</Text>
                </Text>
                <Controller
                  control={control}
                  name="dataNasc"
                  rules={{
                    required: "Data de nascimento é obrigatória",
                    validate: validarData,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor="#aaa"
                      value={value}
                      onChangeText={(v) => onChange(formatDate(v))}
                      onBlur={onBlur}
                      keyboardType="numeric"
                    />
                  )}
                />
                <FieldError message={errors.dataNasc?.message} />
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
