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
import { useState, type ReactNode } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View className="mb-5">
      <Text className="text-grey-800 text-sm font-bold mb-2">
        {label} <Text className="text-primary">*</Text>
      </Text>
      {children}
    </View>
  );
}

export function CadastrarPacienteModal({ visible, onClose }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleClose() {
    setName("");
    setEmail("");
    setCpf("");
    setBirthDate("");
    setPassword("");
    setShowPassword(false);
    onClose();
  }

  function handleCadastrar() {
    // TODO: integrar com API
    handleClose();
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
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

            <Field label="Nome">
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-4 text-base text-grey-800"
                placeholder="João da Silva"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
            </Field>

            <Field label="E-mail">
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-4 text-base text-grey-800"
                placeholder="exemplo@mail.com"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Field>

            <Field label="CPF">
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-4 text-base text-grey-800"
                placeholder="XXX.XXX.XXX-XX"
                placeholderTextColor="#aaa"
                value={cpf}
                onChangeText={(v) => setCpf(formatCPF(v))}
                keyboardType="numeric"
              />
            </Field>

            <Field label="Data de Nascimento">
              <TextInput
                className="bg-gray-100 rounded-xl px-4 py-4 text-base text-grey-800"
                placeholder="DD/MM/AAAA"
                placeholderTextColor="#aaa"
                value={birthDate}
                onChangeText={(v) => setBirthDate(formatDate(v))}
                keyboardType="numeric"
              />
            </Field>

            <Field label="Senha">
              <View className="bg-gray-100 rounded-xl flex-row items-center px-4">
                <TextInput
                  className="flex-1 py-4 text-base text-grey-800"
                  placeholder="••••••••"
                  placeholderTextColor="#aaa"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={22}
                    color="#aaa"
                  />
                </TouchableOpacity>
              </View>
            </Field>

            <TouchableOpacity
              className="bg-primary rounded-xl py-4 items-center mt-2"
              onPress={handleCadastrar}
            >
              <Text className="text-white font-bold text-base">Cadastrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
