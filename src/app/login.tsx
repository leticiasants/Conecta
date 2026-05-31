import { FieldError } from "@/src/components/FieldError";
import { EMAIL_PATTERN } from "@/src/utils/validations";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { login } from "../modules/auth/services/login";

type FormData = { email: string; senha: string };

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { email: "", senha: "" } });

  async function onSubmit(data: FormData) {
    try {
      const res = await login({ email: data.email, senha: data.senha });

      const usuario = res.usuario;

      if (usuario?.tipo === "PACIENTE") {
        router.replace("/(paciente)");
      } else if (usuario?.tipo === "PSICOLOGO") {
        router.replace("/(psicologo)");
      } else {
        router.replace("/login");
      }
    } catch (err: any) {
      setError("root", { message: err.message });
    }
  }

  return (
    <View className="flex-1 justify-end bg-white">
      <View className="absolute bottom-0 left-0 right-0 h-24 bg-primary" />
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
        keyboardVerticalOffset={0}
      >
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
          <Text className="text-primary font-primary">Olá! Bem-vindo(a)!</Text>
        </View>

        <View className="bg-primary w-full py-12 px-6 h-[620px] rounded-t-3xl">
          <Text className="text-3xl text-center mb-8 text-white font-bold">
            Login
          </Text>

          <View className="mb-2">
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

          <View className="mb-2">
            <Text className="text-white font-primary-medium text-sm mb-1">
              Senha <Text className="text-secondary">*</Text>
            </Text>
            <Controller
              control={control}
              name="senha"
              rules={{ required: "Senha é obrigatória" }}
              render={({ field: { onChange, value } }) => (
                <View className="border bg-white border-secondary rounded-lg flex-row items-center px-4">
                  <TextInput
                    className="flex-1 py-3 text-base text-secondary"
                    placeholder="••••••••"
                    placeholderTextColor="#97BFAB"
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={24}
                      color="#97BFAB"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            <FieldError message={errors.senha?.message} />
          </View>

          <FieldError message={errors.root?.message} />

          <View className="gap-1 items-center mt-4">
            <TouchableOpacity
              className="bg-secondary w-full rounded-lg py-3 items-center"
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Entrar
                </Text>
              )}
            </TouchableOpacity>
            <Text className="text-xs text-white text-nowrap">
              É psicólogo(a) e não tem uma conta?{" "}
              <Link href="/cadastro" className="text-secondary">
                Cadastre-se
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
