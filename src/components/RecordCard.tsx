import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

interface Props {
  title: string;
  emotion: string;
  intensity: number;
  description: string;
  date: string;
}

export function RecordCard({ title, emotion, intensity, description, date }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      className="mx-4 mb-4 bg-white border-l-4 border-l-primary"
      style={{
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      }}
    >
      <View className="px-4 pt-4 pb-3">
        <Text className="font-bold text-base text-primary mb-3">{title}</Text>

        <View className="flex-row gap-2 mb-3 flex-wrap">
          <View className="px-3 py-1 rounded-full bg-secondary/20">
            <Text className="text-xs text-primary">
              Emoção Principal: {emotion}
            </Text>
          </View>
          <View className="px-3 py-1 rounded-full bg-secondary/20">
            <Text className="text-xs text-primary">
              Intensidade: {intensity}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3">
          <MaterialIcons
            name="chat-bubble-outline"
            size={18}
            color="#828282"
            style={{ marginTop: 1 }}
          />
          <View className="flex-1">
            <Text
              className="text-sm text-grey-800 leading-5"
              numberOfLines={expanded ? undefined : 3}
            >
              {description}
            </Text>
            <TouchableOpacity
              onPress={() => setExpanded(!expanded)}
              className="flex-row items-center mt-1 gap-1"
            >
              <Text className="text-xs text-primary">
                {expanded ? "Ler menos" : "Ler mais"}
              </Text>
              <MaterialIcons
                name={expanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                size={14}
                color="#5C868E"
              />
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-xs text-grey-500 mt-3">Ocorrido em {date}</Text>
      </View>
    </View>
  );
}
