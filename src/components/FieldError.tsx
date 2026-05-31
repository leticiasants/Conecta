import { Text } from "react-native";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <Text className="text-tertiary text-xs mt-1.5 mb-2">{message}</Text>;
}
