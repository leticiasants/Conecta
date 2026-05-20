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
  initialData?: {
    name: string;
    email: string;
    crp: string;
    phone: string;
  };
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-5">
      <Text className="text-grey-800 text-sm mb-1">
        {label}
        {required && <Text className="text-primary"> *</Text>}
      </Text>
      {children}
    </View>
  );
}

export function EditarDadosModal({ visible, onClose, initialData }: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [crp, setCrp] = useState(initialData?.crp ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");

  function handleSave() {
    // TODO: integrar com API
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

              <Text className="text-4xl font-bold text-primary text-center mb-8">
                Editar Dados
              </Text>

              <Field label="Nome" required>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="João da Silva"
                  placeholderTextColor="#aaa"
                  value={name}
                  onChangeText={setName}
                />
              </Field>

              <Field label="E-mail" required>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="exemplo@mail.com"
                  placeholderTextColor="#aaa"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </Field>

              <Field label="CRP" required>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="01/12345"
                  placeholderTextColor="#aaa"
                  value={crp}
                  onChangeText={setCrp}
                />
              </Field>

              <Field label="Contato">
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="(35)99999-9999"
                  placeholderTextColor="#aaa"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </Field>

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
