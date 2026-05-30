import { EMAIL_PATTERN, validarCRP } from "@/src/utils/validations";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createPsicologo } from "../modules/usuario/services/create-psicologo";
import { formatCRP } from "../utils/formatters";

type FormData = {
  nome: string;
  crp: string;
  email: string;
  senha: string;
  repetirSenha: string;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="text-tertiary text-xs mt-1.5">{message}</Text>;
}

export default function CadastroScreen() {
  const [showSenha, setShowSenha] = useState(false);
  const [showRepetir, setShowRepetir] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      nome: "",
      crp: "",
      email: "",
      senha: "",
      repetirSenha: "",
    },
  });

  async function onSubmit(data: FormData) {
    await createPsicologo({
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      crp: data.crp,
    });
    router.replace("/");
  }

  return (
    <View className="flex-1 bg-white">
      <View className="absolute bottom-0 left-0 right-0 h-24 bg-primary" />
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <View className="justify-center px-6 gap-2 items-center py-20">
          <View className="flex-row items-center gap-1">
            <Image
              source={require("@/src/assets/logo/logo_img_conecta.png")}
              className="w-12 h-12"
              resizeMode="contain"
            />
            <Image
              source={require("@/src/assets/logo/logo_nome_conecta.png")}
              className="h-12 w-32"
              resizeMode="contain"
            />
          </View>
          <Text className="text-primary font-primary">
            Psicólogo(a), faça seu cadastro!
          </Text>
        </View>

        <ScrollView
          className="bg-primary w-full rounded-t-3xl"
          contentContainerStyle={{
            paddingTop: 40,
            paddingHorizontal: 24,
            paddingBottom: 100,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-3xl text-center mb-8 text-white font-bold">
            Cadastro
          </Text>

          {/* Nome */}
          <View className="mb-4">
            <Text className="text-white font-primary-medium text-sm mb-1">
              Nome <Text className="text-secondary">*</Text>
            </Text>
            <Controller
              control={control}
              name="nome"
              rules={{ required: "Nome é obrigatório" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="border bg-white border-secondary rounded-lg px-4 py-3 text-base text-secondary"
                  placeholder="João da Silva"
                  placeholderTextColor="#97BFAB"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            <FieldError message={errors.nome?.message} />
          </View>

          {/* CRP */}
          <View className="mb-4">
            <Text className="text-white font-primary-medium text-sm mb-1">
              CRP <Text className="text-secondary">*</Text>
            </Text>
            <Controller
              control={control}
              name="crp"
              rules={{ required: "CRP é obrigatório", validate: validarCRP }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="border border-secondary bg-white rounded-lg px-4 py-3 text-base text-secondary"
                  placeholder="06/123456"
                  placeholderTextColor="#97BFAB"
                  value={value}
                  onChangeText={(text) => onChange(formatCRP(text))}
                />
              )}
            />
            <FieldError message={errors.crp?.message} />
          </View>

          {/* E-mail */}
          <View className="mb-4">
            <Text className="text-white font-primary-medium text-sm mb-1">
              E-mail <Text className="text-secondary">*</Text>
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
                  className="border border-secondary bg-white rounded-lg px-4 py-3 text-base text-secondary"
                  placeholder="exemplo@mail.com"
                  placeholderTextColor="#97BFAB"
                  value={value}
                  onChangeText={onChange}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
            />
            <FieldError message={errors.email?.message} />
          </View>

          {/* Senha */}
          <View className="mb-4">
            <Text className="text-white font-primary-medium text-sm mb-1">
              Senha <Text className="text-secondary">*</Text>
            </Text>
            <Controller
              control={control}
              name="senha"
              rules={{
                required: "Senha é obrigatória",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              }}
              render={({ field: { onChange, value } }) => (
                <View className="border border-secondary bg-white rounded-lg flex-row items-center px-4">
                  <TextInput
                    className="flex-1 py-3 text-base text-secondary"
                    placeholder="••••••••"
                    placeholderTextColor="#97BFAB"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showSenha}
                  />
                  <TouchableOpacity onPress={() => setShowSenha((v) => !v)}>
                    <MaterialIcons
                      name={showSenha ? "visibility" : "visibility-off"}
                      size={24}
                      color="#97BFAB"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            <FieldError message={errors.senha?.message} />
          </View>

          {/* Repetir senha */}
          <View className="mb-6">
            <Text className="text-white font-primary-medium text-sm mb-1">
              Repetir senha <Text className="text-secondary">*</Text>
            </Text>
            <Controller
              control={control}
              name="repetirSenha"
              rules={{
                required: "Confirmação obrigatória",
                validate: (v) =>
                  v === watch("senha") || "As senhas não coincidem",
              }}
              render={({ field: { onChange, value } }) => (
                <View className="border border-secondary bg-white rounded-lg flex-row items-center px-4">
                  <TextInput
                    className="flex-1 py-3 text-base text-secondary"
                    placeholder="••••••••"
                    placeholderTextColor="#97BFAB"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showRepetir}
                  />
                  <TouchableOpacity onPress={() => setShowRepetir((v) => !v)}>
                    <MaterialIcons
                      name={showRepetir ? "visibility" : "visibility-off"}
                      size={24}
                      color="#97BFAB"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            <FieldError message={errors.repetirSenha?.message} />
          </View>

          <View className="gap-1 items-center">
            <TouchableOpacity
              className="bg-secondary w-full rounded-lg py-3 items-center"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Cadastrar
                </Text>
              )}
            </TouchableOpacity>
            <Text className="text-xs text-white text-nowrap">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-secondary">
                Login
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
