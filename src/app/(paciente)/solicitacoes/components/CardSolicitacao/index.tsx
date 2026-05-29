import { IDadosPsicologo } from "@/src/modules/psicologo/ts/IDadosPsicologo";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface Props extends Pick<IDadosPsicologo, "nome" | "crp"> {
  onRecusar: () => void;
  onAceitar: () => void;
}

export function CardSolicitacao({ nome, crp, onRecusar, onAceitar }: Props) {
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
      <Text className="font-bold text-base text-grey-800 mb-1">{nome}</Text>
      <Text className="text-sm text-grey-800 mb-3">
        <Text className="font-bold">CRP: </Text>
        {crp}
      </Text>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={onRecusar}
          className="flex-1 flex-row items-center justify-center gap-1.5 py-3 rounded-xl border-2 border-primary"
        >
          <MaterialIcons name="person-remove" size={16} color="#5C868E" />
          <Text className="text-xs font-bold text-primary">
            Recusar vínculo
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onAceitar}
          className="flex-1 flex-row items-center justify-center gap-1.5 py-3 rounded-xl bg-primary"
        >
          <MaterialIcons name="person-add" size={16} color="white" />
          <Text className="text-xs font-bold text-white">Aceitar vínculo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
