import { useAuth } from "@/src/contexts/AuthContext";
import { Image, Text, View } from "react-native";

export default function HomePacienteScreen() {
  const { userProfile } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white gap-12">
      <View className="justify-center items-center gap-5 px-7">
        <Text className="text-primary text-2xl font-bold">
          Bem-vindo(a), {userProfile?.nome}!
        </Text>
        <Text className="text-center text-grey-800 font-primary">
          Registrar o que você sente ao longo da semana é um passo importante
          para o seu autoconhecimento. Compartilhar seus relatos com o(a)
          psicólogo(a) também ajuda na construção de um processo terapêutico
          mais eficaz.
        </Text>
        <Text className="text-grey-500 text-center font-secondary-bold">
          “Escrever é uma forma de organizar sentimentos e perceber padrões com
          mais clareza.”
        </Text>
      </View>
      <Image
        source={require("@/src/assets/terapia.png")}
        className="w-92"
        resizeMode="contain"
      />
    </View>
  );
}
