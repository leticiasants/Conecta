import { IDadosPaciente } from "@/src/modules/paciente/ts/IDadosPaciente";
import type { ActionPosition } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export type { ActionPosition };

interface Props extends Pick<
  IDadosPaciente,
  "nome" | "email" | "contato" | "nascimento"
> {
  onActions: (position: ActionPosition) => void;
}

export function CardPaciente({
  nome,
  email,
  contato,
  nascimento,
  onActions,
}: Props) {
  const buttonRef = useRef<View>(null);

  function handleActions() {
    buttonRef.current?.measureInWindow((x, y, width, height) => {
      onActions({ x, y, width, height });
    });
  }

  return (
    <View
      className="bg-white border border-gray-100 rounded-2xl p-4 mb-3 mx-4"
      style={{
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
      }}
    >
      <View className="flex-row justify-between items-start mb-1">
        <Text className="text-base font-bold text-grey-800 flex-1">{nome}</Text>
        <TouchableOpacity
          onPress={handleActions}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <View ref={buttonRef}>
            <MaterialIcons name="more-vert" size={20} color="#828282" />
          </View>
        </TouchableOpacity>
      </View>

      <Text className="text-sm text-grey-800 mt-1">
        <Text className="font-bold">E-mail: </Text>
        {email}
      </Text>
      <Text className="text-sm text-grey-800">
        <Text className="font-bold">Contato: </Text>
        {contato}
      </Text>
      <Text className="text-sm text-grey-800">
        <Text className="font-bold">Data de Nascimento: </Text>
        {nascimento}
      </Text>
    </View>
  );
}
