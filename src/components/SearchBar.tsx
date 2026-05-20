import { MaterialIcons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View className="flex-row items-center gap-2">
      <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-3 h-10">
        <MaterialIcons name="search" size={18} color="#828282" />
        <TextInput
          className="flex-1 ml-2 text-sm text-grey-800"
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      <TouchableOpacity>
        <MaterialIcons name="tune" size={24} color="#5C868E" />
      </TouchableOpacity>
    </View>
  );
}
