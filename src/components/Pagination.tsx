import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  total: number;
  current: number;
  onPage: (page: number) => void;
}

export function Pagination({ total, current, onPage }: Props) {
  return (
    <View className="flex-row items-center justify-center gap-2 py-5">
      <TouchableOpacity
        onPress={() => onPage(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        <MaterialIcons
          name="chevron-left"
          size={26}
          color={current === 1 ? "#ccc" : "#5C868E"}
        />
      </TouchableOpacity>

      {Array.from({ length: total }, (_, i) => i + 1).map((page) => (
        <TouchableOpacity
          key={page}
          onPress={() => onPage(page)}
          className={`w-8 h-8 rounded-full items-center justify-center ${
            page === current ? "bg-primary" : "bg-gray-200"
          }`}
        >
          <Text
            className={`text-sm font-bold ${
              page === current ? "text-white" : "text-grey-500"
            }`}
          >
            {page}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        onPress={() => onPage(Math.min(total, current + 1))}
        disabled={current === total}
      >
        <MaterialIcons
          name="chevron-right"
          size={26}
          color={current === total ? "#ccc" : "#5C868E"}
        />
      </TouchableOpacity>
    </View>
  );
}
