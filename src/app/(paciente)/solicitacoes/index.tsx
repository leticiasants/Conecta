import { ConfirmModal } from "@/src/components/ConfirmModal";
import { useAuth } from "@/src/contexts/AuthContext";
import { ModalAceitarVinculo } from "@/src/modules/paciente/components";
import { getAllSolicitacaoVinculo } from "@/src/modules/paciente/services/get-all-solicitacao-vinculo";
import { updateVinculo } from "@/src/modules/paciente/services/update-vinculo";
import { deleteSolicitacaoVinculo } from "@/src/modules/psicologo/services/delete-solicitacao-vinculo";
import { ISolicitacao } from "@/src/types/ISolicitacao";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { CardSolicitacao } from "./components/CardSolicitacao";

export default function SolicitacoesScreen() {
  const { userProfile } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<ISolicitacao[]>([]);
  const [recusarItem, setRecusarItem] = useState<ISolicitacao | null>(null);
  const [aceitarItem, setAceitarItem] = useState<ISolicitacao | null>(null);

  const carregar = useCallback(async () => {
    if (!userProfile) return;
    const data = await getAllSolicitacaoVinculo(userProfile.id);
    setSolicitacoes(data);
  }, [userProfile]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleRecusar() {
    if (!recusarItem) return;

    try {
      await deleteSolicitacaoVinculo(
        recusarItem.idFichaAtendimento,
        recusarItem.id,
      );

      setSolicitacoes((prev) => prev.filter((s) => s.id !== recusarItem.id));

      setRecusarItem(null);
    } catch {
      Alert.alert("Erro", "Não foi possível recusar a solicitação.");
    }
  }

  async function handleAceitar(newFicha: boolean = false) {
    if (!aceitarItem) return;

    try {
      await updateVinculo(
        aceitarItem.idFichaAtendimento,
        aceitarItem.idNovoPsicologo,
        newFicha,
      );

      await deleteSolicitacaoVinculo(
        aceitarItem.idFichaAtendimento,
        aceitarItem.id,
      );

      setSolicitacoes((prev) => prev.filter((s) => s.id !== aceitarItem.id));

      setAceitarItem(null);
    } catch {
      Alert.alert("Erro", "Não foi possível aceitar a solicitação.");
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <Text className="text-2xl font-bold text-primary mb-1">
          Solicitações de Acesso
        </Text>
        <Text className="text-sm text-grey-500 mb-4">
          Gerencie os vínculos com seus profissionais.
        </Text>
      </View>

      <FlatList
        data={solicitacoes}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <CardSolicitacao
            nome={item.nomePsicologo ?? "Profissional Desconecido"}
            crp={item.crpPsicologo ? item.crpPsicologo : "CRP não disponível"}
            onRecusar={() => setRecusarItem(item)}
            onAceitar={() => setAceitarItem(item)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-32 gap-2">
            <MaterialIcons name="search-off" size={40} color="#828282" />
            <Text className="text-grey-500 text-sm">
              Nenhuma solicitação pendente.
            </Text>
          </View>
        }
      />

      <ConfirmModal
        visible={!!recusarItem}
        message={`Tem certeza de que deseja recusar o vínculo com ${recusarItem?.nomePsicologo ?? "este profissional"}?`}
        confirmLabel="Recusar"
        onClose={() => setRecusarItem(null)}
        onConfirm={handleRecusar}
      />

      <ModalAceitarVinculo
        visible={!!aceitarItem}
        onClose={() => setAceitarItem(null)}
        onIniciarNovaFicha={() => handleAceitar(true)}
        onCompartilharRegistros={handleAceitar}
      />
    </View>
  );
}
