import { Pagination } from "@/src/components/Pagination";
import { SearchBar } from "@/src/components/SearchBar";
import { useAuth } from "@/src/contexts/AuthContext";
import { IPaciente } from "@/src/modules/paciente/ts/IPaciente";

import { solicitarAlteracaoPsicologo } from "@/src/modules/psicologo/services/create-solicitacao-vinculo";
import { getAllPacientes } from "@/src/modules/usuario/services/get-all-pacientes";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { CardVinculo } from "./components/CardVinculo";

const ITEMS_PER_PAGE = 4;

export default function SolicitarVinculoScreen() {
  const { userProfile } = useAuth();

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [pacientes, setPacientes] = useState<IPaciente[]>([]);

  useEffect(() => {
    if (!userProfile) return;
    getAllPacientes(userProfile.id).then(setPacientes);
  }, [userProfile]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  async function handleSolicitar(paciente: IPaciente) {
    if (!userProfile || userProfile.tipo !== "PSICOLOGO") {
      return;
    }

    try {
      await solicitarAlteracaoPsicologo(userProfile.id, {
        idPaciente: paciente.id,
        idFicha: paciente.idFicha,
      });

      Alert.alert("Sucesso", "Solicitação enviada.");

      // rodar getAllPacientes
    } catch (error) {
      console.log(error);

      Alert.alert("Erro", "Não foi possível enviar a solicitação.");
    }
  }

  const filteredPacientes = useMemo(() => {
    const termo = search.toLowerCase();

    return pacientes.filter(
      (p) =>
        p.nome?.toLowerCase().includes(termo) ||
        p.email?.toLowerCase().includes(termo),
    );
  }, [pacientes, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPacientes.length / ITEMS_PER_PAGE),
  );

  const pageData = filteredPacientes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <Text className="mb-1 text-2xl font-bold text-primary">
          Solicitar Vínculo
        </Text>

        <Text className="mb-4 text-sm text-grey-500">
          Busque por pacientes cadastrados e faça solicitação de vínculo.
        </Text>

        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar por nome ou e-mail"
        />
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 8,
        }}
        renderItem={({ item }) => {
          return (
            <CardVinculo
              nome={item.nome}
              email={item.email}
              contato={item.contato ?? ""}
              action={{
                label: "Solicitar vínculo",
                icon: "person-add",
                variant: "filled",
                onPress: () => handleSolicitar(item),
              }}
            />
          );
        }}
        ListEmptyComponent={
          <View className="items-center justify-center gap-2 py-32">
            <MaterialIcons name="search-off" size={40} color="#828282" />

            <Text className="text-sm text-grey-500">
              Nenhum paciente encontrado.
            </Text>
          </View>
        }
      />

      <Pagination
        total={totalPages}
        current={currentPage}
        onPage={setCurrentPage}
      />
    </View>
  );
}
