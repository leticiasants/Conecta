import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

export default function CadastroScreen() {
  const [name, setName] = useState("");
  const [crp, setCrp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  function handleCadastro() {
    // TODO: implementar cadastro
  }

  return (
    <View className="flex-1 justify-end bg-white">
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

        <Text className="text-primary font-primary">
          Psicólogo(a), faça seu cadastro!
        </Text>
      </View>

      {/* <View className="bg-primary w-full h-[620px] rounded-t-3xl py-10 px-6"> */}
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

        <View>
          <Text className="text-white font-primary-medium text-sm mb-1">
            Nome <Text className="text-secondary">*</Text>
          </Text>

          <TextInput
            className="border bg-white border-secondary rounded-lg px-4 py-3 mb-4 text-base text-secondary"
            placeholder="João da Silva"
            placeholderTextColor="#97BFAB"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View>
          <Text className="text-white font-primary-medium text-sm mb-1">
            CRP <Text className="text-secondary">*</Text>
          </Text>

          <TextInput
            className="border border-secondary bg-white rounded-lg px-4 py-3 mb-4 text-base text-secondary"
            placeholder="06/123456"
            placeholderTextColor="#97BFAB"
            value={crp}
            onChangeText={setCrp}
          />
        </View>

        <View>
          <Text className="text-white font-primary-medium text-sm mb-1">
            E-mail <Text className="text-secondary">*</Text>
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
            Senha <Text className="text-secondary">*</Text>
          </Text>

          <View className="border border-secondary bg-white rounded-lg flex-row items-center px-4 mb-4">
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

        <View>
          <Text className="text-white font-primary-medium text-sm mb-1">
            Repetir senha <Text className="text-secondary">*</Text>
          </Text>

          <View className="border border-secondary bg-white rounded-lg flex-row items-center px-4 mb-8">
            <TextInput
              className="flex-1 py-3 text-base text-secondary"
              placeholder="••••••••"
              placeholderTextColor="#97BFAB"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry={!showRepeatPassword}
            />

            <TouchableOpacity
              onPress={() => setShowRepeatPassword(!showRepeatPassword)}
            >
              <MaterialIcons
                name={showRepeatPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#97BFAB"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="gap-1 items-center">
          <TouchableOpacity
            className="bg-secondary w-full rounded-lg py-3 items-center"
            onPress={handleCadastro}
          >
            <Text className="text-white font-semibold text-base">
              Cadastrar
            </Text>
          </TouchableOpacity>
          <Text className="text-xs text-white text-nowrap">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-secondary">
              Login
            </Link>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
