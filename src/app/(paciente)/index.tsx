import { View, Text, Image } from "react-native";

export default function HomePacienteScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white gap-12">
      <View className="justify-center items-center gap-5 px-7">
        <Text className="text-primary text-2xl font-bold">
          Bem-vindo(a), Maria Silva!
        </Text>
        <Text className="text-center text-grey-800 font-primary">
          Aqui você pode registrar suas emoções e acompanhar sua jornada de
          autoconhecimento. Use os relatos para expressar o que sente e
          compartilhar com seu profissional de confiança.
        </Text>
        <Text className="text-grey-500 text-center font-secondary-bold">
          "Nomear o que sentimos é o primeiro passo para compreender quem somos"
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
