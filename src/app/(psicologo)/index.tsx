import { View, Text, Image } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white gap-12">
      <View className="justify-center items-center gap-5 px-7">
        <Text className="text-primary text-2xl font-bold">
          Bem-vindo(a), João da Silva!
        </Text>
        <Text className="text-center text-grey-800 font-primary">
          Aqui você pode acompanhar de perto o progresso dos seus pacientes. Use
          os relatos para acompanhar melhor seus sentimentos, identificar
          padrões e preparar sessões mais eficazes e acolhedoras.
        </Text>
        <Text className="text-grey-500 text-center font-secondary-bold">
          “Entender o que o paciente vive no dia a dia é o primeiro passo para
          ajudá-lo com empatia”
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
