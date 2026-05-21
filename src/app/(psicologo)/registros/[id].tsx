import { Pagination } from "@/src/components/Pagination";
import { SearchBar } from "@/src/components/SearchBar";
import { IRelato } from "@/src/modules/paciente/ts/IRelato";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";
import { CardRelato } from "../../(paciente)/relatos/components";

const MOCK_RECORDS: IRelato[] = [
  {
    id: "1",
    situacao: "Fiquei triste",
    emocao: "Tristeza",
    intensidade: 6,
    descricao:
      "Hoje foi um dia leve e feliz. Consegui realizar minhas tarefas com tranquilidade e ainda tive alguns momentos agradáveis ao longo do dia, como pequenas pausas para descansar e conversar. Tudo fluiu de forma natural, sem pressa ou estresse.",
    dataOcorrido: "16/02/2026",
  },
  {
    id: "2",
    situacao: "Dia feliz",
    emocao: "Alegria",
    intensidade: 8,
    descricao:
      "Hoje foi um dia leve e feliz. Consegui realizar minhas tarefas com tranquilidade e ainda tive alguns momentos agradáveis ao longo do dia, como pequenas pausas para descansar e conversar. Tudo fluiu de forma natural, sem pressa ou estresse.",
    dataOcorrido: "17/02/2026",
  },
  {
    id: "3",
    situacao: "Ansiedade no trabalho",
    emocao: "Ansiedade",
    intensidade: 7,
    descricao:
      "Tive muitas demandas hoje e me senti sobrecarregada. As reuniões foram longas e não consegui finalizar as tarefas que havia planejado. Senti o coração acelerado em alguns momentos.",
    dataOcorrido: "18/02/2026",
  },
  {
    id: "4",
    situacao: "Conquista do dia",
    emocao: "Orgulho",
    intensidade: 9,
    descricao:
      "Finalizei um projeto que estava pendente há semanas. Me senti muito bem ao ver o resultado. Recebi elogios da equipe e isso me motivou bastante para continuar.",
    dataOcorrido: "19/02/2026",
  },
];

const ITEMS_PER_PAGE = 3;

export default function RegistrosScreen() {
  const { name } = useLocalSearchParams<{ id: string; name: string }>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const patientName = Array.isArray(name) ? name[0] : (name ?? "");

  const filtered = MOCK_RECORDS.filter(
    (r) =>
      r.situacao.toLowerCase().includes(search.toLowerCase()) ||
      r.emocao.toLowerCase().includes(search.toLowerCase()) ||
      String(r.intensidade).includes(search),
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

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <Text className="text-2xl font-bold text-primary mb-1">Registros</Text>
        <Text className="text-sm text-grey-500 mb-3">
          Acompanhe os registros emocionais dos pacientes.
        </Text>

        <View className="flex-row items-center gap-1 mb-4">
          <MaterialIcons name="person" size={16} color="#5C868E" />
          <Text className="text-sm text-primary">
            <Text className="font-bold">Paciente: </Text>
            <Text>{patientName}</Text>
          </Text>
        </View>

        <SearchBar
          value={search}
          onChangeText={handleSearch}
          placeholder="Buscar por situação, emoção ou intensidade"
        />
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.id ?? ""}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <CardRelato
            situacao={item.situacao}
            emocao={item.emocao}
            intensidade={item.intensidade}
            descricao={item.descricao}
            dataOcorrido={item.dataOcorrido}
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
              Nenhum registro encontrado.
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
