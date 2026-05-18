import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { RecordCard } from "@/src/components/RecordCard";
import { Pagination } from "@/src/components/Pagination";

type Record = {
  id: string;
  title: string;
  emotion: string;
  intensity: number;
  description: string;
  date: string;
};

const MOCK_RECORDS: Record[] = [
  {
    id: "1",
    title: "Fiquei triste",
    emotion: "Tristeza",
    intensity: 6,
    description:
      "Hoje foi um dia leve e feliz. Consegui realizar minhas tarefas com tranquilidade e ainda tive alguns momentos agradáveis ao longo do dia, como pequenas pausas para descansar e conversar. Tudo fluiu de forma natural, sem pressa ou estresse.",
    date: "16/02/2026",
  },
  {
    id: "2",
    title: "Dia Feliz",
    emotion: "Alegria",
    intensity: 8,
    description:
      "Hoje foi um dia leve e feliz. Consegui realizar minhas tarefas com tranquilidade e ainda tive alguns momentos agradáveis ao longo do dia, como pequenas pausas para descansar e conversar. Tudo fluiu de forma natural, sem pressa ou estresse.",
    date: "17/02/2026",
  },
  {
    id: "3",
    title: "Ansiedade no trabalho",
    emotion: "Ansiedade",
    intensity: 7,
    description:
      "Tive muitas demandas hoje e me senti sobrecarregada. As reuniões foram longas e não consegui finalizar as tarefas que havia planejado. Senti o coração acelerado em alguns momentos.",
    date: "18/02/2026",
  },
  {
    id: "4",
    title: "Conquista do dia",
    emotion: "Orgulho",
    intensity: 9,
    description:
      "Finalizei um projeto que estava pendente há semanas. Me senti muito bem ao ver o resultado. Recebi elogios da equipe e isso me motivou bastante para continuar.",
    date: "19/02/2026",
  },
];

const ITEMS_PER_PAGE = 2;

export default function RegistrosScreen() {
  const { name } = useLocalSearchParams<{ id: string; name: string }>();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const patientName = Array.isArray(name) ? name[0] : (name ?? "");

  const filtered = MOCK_RECORDS.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
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

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <Text className="text-2xl font-bold text-primary mb-1">Registros</Text>
        <Text className="text-sm text-grey-800 mb-4">
          <Text className="font-bold">Paciente: </Text>
          {patientName}
        </Text>

        <View className="flex-row items-center gap-2">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-3 h-10">
            <MaterialIcons name="search" size={18} color="#828282" />
            <TextInput
              className="flex-1 ml-2 text-sm text-grey-800"
              placeholder="Buscar"
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={handleSearch}
            />
          </View>

          <TouchableOpacity>
            <MaterialIcons name="tune" size={24} color="#828282" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <RecordCard
            title={item.title}
            emotion={item.emotion}
            intensity={item.intensity}
            description={item.description}
            date={item.date}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-16">
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
