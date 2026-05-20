import { View, Text, FlatList } from "react-native";
import { useState } from "react";
import { Pagination } from "@/src/components/Pagination";
import { SearchBar } from "@/src/components/SearchBar";
import { VinculoCard } from "@/src/components/VinculoCard";

type Paciente = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

const MOCK_PACIENTES: Paciente[] = [
  {
    id: "1",
    name: "Thiago Terra Silva",
    email: "thiago.terra.silva@hotmail.com",
    phone: "(35) 99999-9999",
  },
  {
    id: "2",
    name: "Beatriz Ramos Costa",
    email: "beatriz.ramos@gmail.com",
    phone: "(11) 98888-8888",
  },
  {
    id: "3",
    name: "Lucas Fernandes Rocha",
    email: "lucas.fernandes@gmail.com",
    phone: "(21) 97777-7777",
  },
  {
    id: "4",
    name: "Camila Souza Almeida",
    email: "camila.souza@gmail.com",
    phone: "(31) 96666-6666",
  },
];

const ITEMS_PER_PAGE = 4;

export default function SolicitarVinculoScreen() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [solicitados, setSolicitados] = useState<Set<string>>(new Set());

  const filtered = MOCK_PACIENTES.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const pageData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function handleSearch(text: string) {
    setSearch(text);
    setCurrentPage(1);
  }

  function handleSolicitar(id: string) {
    setSolicitados((prev) => new Set(prev).add(id));
    // TODO: integrar com API
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <Text className="text-2xl font-bold text-primary mb-1">
          Solicitar Vínculo
        </Text>
        <Text className="text-sm text-grey-500 mb-4">
          Busque por pacientes cadastrados e faça solicitação de vínculo.
        </Text>

        <SearchBar
          value={search}
          onChangeText={handleSearch}
          placeholder="Buscar por nome, e-mail ou contato"
        />
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
        renderItem={({ item }) => {
          const jaSolicitado = solicitados.has(item.id);
          return (
            <VinculoCard
              name={item.name}
              email={item.email}
              phone={item.phone}
              action={{
                label: jaSolicitado ? "Solicitado" : "Solicitar vínculo",
                icon: "person-add",
                variant: "filled",
                disabled: jaSolicitado,
                onPress: () => handleSolicitar(item.id),
              }}
            />
          );
        }}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
            <Text className="text-grey-500 text-sm">
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
