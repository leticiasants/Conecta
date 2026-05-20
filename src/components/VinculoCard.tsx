import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Action {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  variant: "filled" | "outlined";
  onPress: () => void;
  disabled?: boolean;
}

interface Props {
  name: string;
  email: string;
  phone: string;
  action: Action;
}

export function VinculoCard({ name, email, phone, action }: Props) {
  const isFilled = action.variant === "filled";

  return (
    <View
      className="mx-4 mb-4 bg-white px-4 py-4"
      style={{
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      }}
    >
      <Text className="font-bold text-base text-grey-800 mb-1">{name}</Text>
      <Text className="text-sm text-grey-800 mb-0.5">
        <Text className="font-bold">E-mail: </Text>
        {email}
      </Text>
      <Text className="text-sm text-grey-800 mb-3">
        <Text className="font-bold">Contato: </Text>
        {phone}
      </Text>

      <TouchableOpacity
        onPress={action.onPress}
        disabled={action.disabled}
        className={`flex-row items-center justify-center gap-2 py-3 rounded-xl ${
          isFilled
            ? action.disabled
              ? "bg-secondary"
              : "bg-primary"
            : "border-2 border-primary"
        }`}
      >
        <MaterialIcons
          name={action.icon}
          size={18}
          color={isFilled ? "white" : "#5C868E"}
        />
        <Text
          className={`font-bold text-sm ${isFilled ? "text-white" : "text-primary"}`}
        >
          {action.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
