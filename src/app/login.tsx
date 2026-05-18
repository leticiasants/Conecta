import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleLogin() {
    router.replace("/(psicologo)");
  }

  return (
    <View className="flex-1 font-primary-medium justify-end bg-white">
      <View className="justify-center px-6 gap-2 items-center py-20">
        <View className="flex-row items-center gap-1">
          <Image
            source={require("../assets/logo/logo_img_conecta.png")}
            className="w-12 h-12"
            resizeMode="contain"
          />
          <Image
            source={require("../assets/logo/logo_nome_conecta.png")}
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

        <View>
          <Text className="text-white font-primary-medium text-sm mb-1">
            E-mail
          </Text>
          <TextInput
            className="border border-secondary bg-white rounded-lg px-4 py-3 mb-4 text-base text-secondary"
            placeholder="exemplo@mail.com"
            placeholderTextColor="#97BFAB"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-white font-primary-medium text-sm mb-1">
            Senha
          </Text>
          <View className="border bg-white border-secondary  rounded-lg flex-row items-center px-4 mb-6">
            <TextInput
              className="flex-1 py-3 text-base text-secondary"
              placeholder="••••••••"
              placeholderTextColor="#97BFAB"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#97BFAB"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-1 items-center">
          <TouchableOpacity
            className="bg-secondary w-full rounded-lg py-3 items-center"
            onPress={handleLogin}
          >
            <Text className="text-white font-semibold text-base">Entrar</Text>
          </TouchableOpacity>
          <Text className="text-xs text-white text-nowrap">
            É psicólogo(a) e não tem uma conta?{" "}
            <Link href="/cadastro" className="text-secondary">
              Cadastre-se
            </Link>
          </Text>
        </View>
      </View>
    </View>
  );
}
