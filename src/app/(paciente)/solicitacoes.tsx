import { AceitarVinculoModal } from "@/src/components/AceitarVinculoModal";
import { ConfirmModal } from "@/src/components/ConfirmModal";
import { SolicitacaoCard } from "@/src/components/SolicitacaoCard";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";

type Solicitacao = {
  id: string;
  name: string;
  email: string;
  crp: string;
};

const MOCK_SOLICITACOES: Solicitacao[] = [
  {
    id: "1",
    name: "Dra. Ana Souza",
    email: "ana.souza@clinica.com",
    crp: "06/78901",
  },
  {
    id: "2",
    name: "Dr. Carlos Lima",
    email: "carlos.lima@psi.com",
    crp: "04/23456",
  },
];

export default function SolicitacoesScreen() {
  const [solicitacoes, setSolicitacoes] =
    useState<Solicitacao[]>(MOCK_SOLICITACOES);
  const [recusarId, setRecusarId] = useState<string | null>(null);
  const [aceitarId, setAceitarId] = useState<string | null>(null);

  function handleRecusar() {
    if (!recusarId) return;
    setSolicitacoes((prev) => prev.filter((s) => s.id !== recusarId));
    setRecusarId(null);
  }

  function handleIniciarNovaFicha() {
    // TODO: integrar com API — aceitar vínculo com nova ficha
    if (!aceitarId) return;
    setSolicitacoes((prev) => prev.filter((s) => s.id !== aceitarId));
    setAceitarId(null);
  }

  function handleCompartilharRegistros() {
    // TODO: integrar com API — aceitar vínculo compartilhando registros
    if (!aceitarId) return;
    setSolicitacoes((prev) => prev.filter((s) => s.id !== aceitarId));
    setAceitarId(null);
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
          <SolicitacaoCard
            name={item.name}
            email={item.email}
            crp={item.crp}
            onRecusar={() => setRecusarId(item.id)}
            onAceitar={() => setAceitarId(item.id)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-32 gap-2">
            <MaterialIcons
              name="search-off"
              size={40}
              color="#828282"
              className="mt-0.5 ml-1"
            />
            <Text className="text-grey-500 text-sm">
              Nenhuma solicitação pendente.
            </Text>
          </View>
        }
      />

      <ConfirmModal
        visible={!!recusarId}
        message={`Tem certeza de que deseja recusar o vínculo com ${recusarItem?.name ?? "este profissional"}?`}
        confirmLabel="Recusar"
        onClose={() => setRecusarId(null)}
        onConfirm={handleRecusar}
      />

      <AceitarVinculoModal
        visible={!!aceitarId}
        onClose={() => setAceitarId(null)}
        onIniciarNovaFicha={handleIniciarNovaFicha}
        onCompartilharRegistros={handleCompartilharRegistros}
      />
    </View>
  );
}
