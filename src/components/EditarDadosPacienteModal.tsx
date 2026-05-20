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
    cpf: string;
    phone: string;
    emergencyPhone: string;
    birthDate: string;
  };
}

function formatCPF(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatDate(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
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

export function EditarDadosPacienteModal({
  visible,
  onClose,
  initialData,
}: Props) {
  const [name, setName] = useState(initialData?.name ?? "");
  const [email, setEmail] = useState(initialData?.email ?? "");
  const [cpf, setCpf] = useState(initialData?.cpf ?? "");
  const [phone, setPhone] = useState(initialData?.phone ?? "");
  const [emergencyPhone, setEmergencyPhone] = useState(
    initialData?.emergencyPhone ?? ""
  );
  const [birthDate, setBirthDate] = useState(initialData?.birthDate ?? "");

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

              <Field label="CPF" required>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="XXX.XXX.XXX-XX"
                  placeholderTextColor="#aaa"
                  value={cpf}
                  onChangeText={(v) => setCpf(formatCPF(v))}
                  keyboardType="numeric"
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

              <Field label="Contato de emergência">
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="(35)99999-9999"
                  placeholderTextColor="#aaa"
                  value={emergencyPhone}
                  onChangeText={setEmergencyPhone}
                  keyboardType="phone-pad"
                />
              </Field>

              <Field label="Data de Nascimento" required>
                <TextInput
                  className="bg-gray-100 rounded-xl px-4 py-4 text-sm text-grey-800"
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#aaa"
                  value={birthDate}
                  onChangeText={(v) => setBirthDate(formatDate(v))}
                  keyboardType="numeric"
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
