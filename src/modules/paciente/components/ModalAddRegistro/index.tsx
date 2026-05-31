import { formatDate } from "@/src/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { IRegistro } from "../../ts/IRegistro";

type RegistroForm = Omit<IRegistro, "id">;

interface Props {
  visible: boolean;
  onClose: () => void;
  initialData?: RegistroForm;
  onSave: (data: RegistroForm) => void;
}

const inputStyle = "bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800";

function createEmptyForm(): RegistroForm {
  return {
    situacao: "",
    emocao: "",
    intensidade: 5,
    descricao: "",
    dataOcorrido: "",
    dataCriacao: "",
  };
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-5">
      <Text className="text-grey-800 text-sm mb-1">
        {label} <Text className="text-primary">*</Text>
      </Text>

      {children}
    </View>
  );
}

function Input(props: TextInputProps) {
  return (
    <TextInput className={inputStyle} placeholderTextColor="#aaa" {...props} />
  );
}

export function ModalAddRegistro({
  visible,
  onClose,
  initialData,
  onSave,
}: Props) {
  const [form, setForm] = useState<RegistroForm>(createEmptyForm());

  const isEditing = useMemo(() => !!initialData, [initialData]);

  useEffect(() => {
    if (visible) {
      setForm(initialData ?? createEmptyForm());
    }
  }, [initialData, visible]);

  function updateField<K extends keyof RegistroForm>(
    key: K,
    value: RegistroForm[K],
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(createEmptyForm());
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit() {
    if (
      !form.situacao.trim() ||
      !form.emocao.trim() ||
      !form.descricao.trim() ||
      !form.dataOcorrido.trim()
    ) {
      Alert.alert(
        "Campos obrigatórios",
        "Preencha todos os campos obrigatórios.",
      );

      return;
    }

    onSave(form);

    resetForm();
    onClose();
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
          <View className="bg-white rounded-3xl w-full max-h-[90%]">
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 24,
                paddingBottom: 40,
              }}
            >
              <TouchableOpacity
                onPress={handleClose}
                className="self-end pt-4 pb-2"
              >
                <MaterialIcons name="close" size={24} color="#3D3D3D" />
              </TouchableOpacity>

              <Text className="text-4xl font-bold text-primary text-center mb-8">
                {isEditing ? "Editar Registro" : "Adicionar Registro"}
              </Text>

              <Field label="Situação">
                <Input
                  placeholder="Ex.: Dia feliz"
                  value={form.situacao}
                  onChangeText={(v) => updateField("situacao", v)}
                />
              </Field>

              <Field label="Emoção Principal">
                <Input
                  placeholder="Ex.: Alegria, Tristeza..."
                  value={form.emocao}
                  onChangeText={(v) => updateField("emocao", v)}
                />
              </Field>

              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  Intensidade da emoção <Text className="text-primary">*</Text>
                </Text>

                <Text className="text-center text-primary font-bold">
                  {form.intensidade}
                </Text>

                <View className="flex-row justify-between mb-1">
                  <Text className="text-xs text-primary font-bold">1</Text>
                  <Text className="text-xs text-primary font-bold">10</Text>
                </View>

                <Slider
                  minimumValue={1}
                  maximumValue={10}
                  step={1}
                  value={form.intensidade}
                  onValueChange={(v) => updateField("intensidade", v)}
                  minimumTrackTintColor="#5C868E"
                  maximumTrackTintColor="#D0D0D0"
                  thumbTintColor="#5C868E"
                />
              </View>

              <Field label="Descrição">
                <Input
                  placeholder="Escreva o que ocorreu e como se sentiu."
                  value={form.descricao}
                  onChangeText={(v) => updateField("descricao", v)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{
                    minHeight: 100,
                  }}
                />
              </Field>

              <Field label="Data do ocorrido">
                <Input
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  value={form.dataOcorrido}
                  onChangeText={(v) =>
                    updateField("dataOcorrido", formatDate(v))
                  }
                />
              </Field>

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center mt-2"
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <Text className="text-white font-bold text-base">
                  {isEditing ? "Salvar alterações" : "Adicionar"}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
