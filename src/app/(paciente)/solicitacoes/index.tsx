import { ConfirmModal } from "@/src/components/ConfirmModal";
import { useAuth } from "@/src/contexts/AuthContext";
import { ModalAceitarVinculo } from "@/src/modules/paciente/components";
import {
  aceitar,
  ISolicitacao,
  listarParaPaciente,
  recusar,
} from "@/src/services/solicitacaoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { CardSolicitacao } from "./components/CardSolicitacao";

export default function SolicitacoesScreen() {
  const { user } = useAuth();
  const [solicitacoes, setSolicitacoes] = useState<ISolicitacao[]>([]);
  const [recusarId, setRecusarId] = useState<string | null>(null);
  const [aceitarItem, setAceitarItem] = useState<ISolicitacao | null>(null);

  const carregar = useCallback(async () => {
    if (!user) return;
    const data = await listarParaPaciente(user.uid);
    setSolicitacoes(data);
  }, [user]);

  useEffect(() => { carregar(); }, [carregar]);

  async function handleRecusar() {
    if (!recusarId) return;
    try {
      await recusar(recusarId);
      setSolicitacoes((prev) => prev.filter((s) => s.id !== recusarId));
      setRecusarId(null);
    } catch {
      Alert.alert("Erro", "Não foi possível recusar a solicitação.");
    }
  }

  async function handleAceitar() {
    if (!aceitarItem || !user) return;
    try {
      await aceitar(aceitarItem.id, user.uid, aceitarItem.id_psicologo);
      setSolicitacoes((prev) => prev.filter((s) => s.id !== aceitarItem.id));
      setAceitarItem(null);
    } catch {
      Alert.alert("Erro", "Não foi possível aceitar a solicitação.");
    }
  }

  const recusarItem = solicitacoes.find((s) => s.id === recusarId);

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
            nome={item.nome_psicologo}
            email={item.email_psicologo}
            crp={item.crp_psicologo}
            onRecusar={() => setRecusarId(item.id)}
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
        visible={!!recusarId}
        message={`Tem certeza de que deseja recusar o vínculo com ${recusarItem?.nome_psicologo ?? "este profissional"}?`}
        confirmLabel="Recusar"
        onClose={() => setRecusarId(null)}
        onConfirm={handleRecusar}
      />

      <ModalAceitarVinculo
        visible={!!aceitarItem}
        onClose={() => setAceitarItem(null)}
        onIniciarNovaFicha={handleAceitar}
        onCompartilharRegistros={handleAceitar}
      />
    </View>
  );
}
