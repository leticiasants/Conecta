import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IRelato } from "../../ts/IRegistro";
import { formatDate } from "@/src/utils/formatters";

interface Props {
  visible: boolean;
  onClose: () => void;
  initialData?: IRelato;
  onSave: (data: IRelato) => void;
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

const EMPTY: IRelato = {
  situacao: "",
  emocao: "",
  intensidade: 5,
  descricao: "",
  dataOcorrido: "",
};

export function ModalAddRelato({
  visible,
  onClose,
  initialData,
  onSave,
}: Props) {
  const [form, setForm] = useState<IRelato>(initialData ?? EMPTY);

  function set<K extends keyof IRelato>(key: K, value: IRelato[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    // TODO: integrar com API
    onSave(form);
    setForm(EMPTY);
    onClose();
  }

  function handleClose() {
    setForm(EMPTY);
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

              <Text className="text-4xl font-bold text-primary text-center mb-8">
                Adicionar Relato
              </Text>

              <Field label="Situação">
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="Ex.: Dia feliz"
                  placeholderTextColor="#aaa"
                  value={form.situacao}
                  onChangeText={(v) => set("situacao", v)}
                />
              </Field>

              <Field label="Emoção Principal">
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="Ex.: Alegria, Tristeza."
                  placeholderTextColor="#aaa"
                  value={form.emocao}
                  onChangeText={(v) => set("emocao", v)}
                />
              </Field>

              <View className="mb-5">
                <Text className="text-grey-800 text-sm mb-1">
                  Intensidade da emoção <Text className="text-primary">*</Text>
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
                  onValueChange={(v) => set("intensidade", v)}
                  minimumTrackTintColor="#5C868E"
                  maximumTrackTintColor="#D0D0D0"
                  thumbTintColor="#5C868E"
                />
              </View>

              <Field label="Descrição">
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-grey-800"
                  placeholder="Escreva o que ocorreu e como se sentiu."
                  placeholderTextColor="#aaa"
                  value={form.descricao}
                  onChangeText={(v) => set("descricao", v)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={{ minHeight: 100 }}
                />
              </Field>

              <Field label="Data do Ocorrido">
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#aaa"
                  value={form.dataOcorrido}
                  onChangeText={(v) => set("dataOcorrido", formatDate(v))}
                  keyboardType="numeric"
                />
              </Field>

              <TouchableOpacity
                className="bg-primary rounded-xl py-4 items-center mt-2"
                onPress={handleSubmit}
              >
                <Text className="text-white font-bold text-base">
                  Adicionar
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
