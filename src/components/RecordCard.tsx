import { View, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  title: string;
  emotion: string;
  intensity: number;
  description: string;
  date: string;
}

export function RecordCard({ title, emotion, intensity, description, date }: Props) {
  return (
    <View
      className="mx-4 mb-4"
      style={{
        borderRadius: 12,
        backgroundColor: "white",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      }}
    >
      <View style={{ borderRadius: 12, overflow: "hidden" }}>
        <View className="bg-primary px-4 py-3">
          <Text className="text-white font-bold text-base mb-1">{title}</Text>
          <Text className="text-white text-sm">
            <Text className="font-bold italic">Emoção principal: </Text>
            {emotion}
          </Text>
          <Text className="text-white text-sm">
            <Text className="font-bold italic">Intensidade da emoção: </Text>
            {intensity}
          </Text>
        </View>

        <View className="bg-white px-4 pt-3 pb-4">
          <View className="flex-row gap-3">
            <MaterialIcons
              name="chat-bubble-outline"
              size={18}
              color="#828282"
              style={{ marginTop: 1 }}
            />
            <Text className="flex-1 text-sm text-grey-800 leading-5">
              {description}
            </Text>
          </View>
          <Text className="text-xs text-grey-500 mt-3">Ocorrido em {date}</Text>
        </View>
      </View>
    </View>
  );
}
