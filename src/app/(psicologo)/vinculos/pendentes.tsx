import { ConfirmModal } from "@/src/components/ConfirmModal";
import { Pagination } from "@/src/components/Pagination";
import { SearchBar } from "@/src/components/SearchBar";
import { useAuth } from "@/src/contexts/AuthContext";
import { IPacienteComSolicitacao } from "@/src/modules/paciente/ts/IPaciente";
import { getAllSolicitacaoVinculo } from "@/src/modules/psicologo/services/get-all-solicitacao-vinculo";
import { cancelarSolicitacao } from "@/src/services/solicitacaoService";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { CardVinculo } from "./components/CardVinculo";

const ITEMS_PER_PAGE = 4;

export default function VinculosPendentesScreen() {
  const { userProfile } = useAuth();

  const [solicitacoes, setSolicitacoes] = useState<IPacienteComSolicitacao[]>(
    [],
  );

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [confirmId, setConfirmId] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!userProfile) return;

    try {
      const data = await getAllSolicitacaoVinculo(userProfile.id);

      setSolicitacoes(data);
    } catch (error) {
      console.error(error);

      Alert.alert("Erro", "Não foi possível carregar solicitações.");
    }
  }, [userProfile]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtered = solicitacoes.filter(
    (s) =>
      s.nome.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.contato?.includes(search),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const pageData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function handleSearch(text: string) {
    setSearch(text);
    setCurrentPage(1);
  }

  async function handleCancelar() {
    if (!confirmId) return;

    try {
      await cancelarSolicitacao(confirmId);

      setSolicitacoes((prev) =>
        prev.filter((s) => s.idSolicitacao !== confirmId),
      );

      setConfirmId(null);
    } catch {
      Alert.alert("Erro", "Não foi possível cancelar a solicitação.");
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <Text className="mb-1 text-2xl font-bold text-primary">
          Vínculos Pendentes
        </Text>

        <Text className="mb-4 text-sm text-grey-500">
          Acompanhe as suas solicitações de vínculo.
        </Text>

        <SearchBar
          value={search}
          onChangeText={handleSearch}
          placeholder="Buscar por nome, e-mail ou contato"
        />
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.idSolicitacao}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 8,
        }}
        renderItem={({ item }) => (
          <CardVinculo
            nome={item.nome}
            email={item.email}
            contato={item.contato ?? ""}
            action={{
              label: "Remover solicitação",
              icon: "person-remove",
              variant: "outlined",
              onPress: () => setConfirmId(item.idSolicitacao),
            }}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center gap-2 py-32">
            <MaterialIcons name="search-off" size={40} color="#828282" />

            <Text className="text-sm text-grey-500">
              Nenhuma solicitação pendente.
            </Text>
          </View>
        }
      />

      <Pagination
        total={totalPages}
        current={currentPage}
        onPage={setCurrentPage}
      />

      <ConfirmModal
        visible={confirmId !== null}
        message="Tem certeza de que deseja remover a solicitação de vínculo?"
        onClose={() => setConfirmId(null)}
        onConfirm={handleCancelar}
      />
    </View>
  );
}
