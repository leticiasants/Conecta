import { Pagination } from "@/src/components/Pagination";
import { SearchBar } from "@/src/components/SearchBar";
import { getAllRegistros } from "@/src/modules/paciente/services/get-all-registros";
import { IRegistro } from "@/src/modules/paciente/ts/IRegistro";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { CardRegistro } from "../../(paciente)/registro/components";

const ITEMS_PER_PAGE = 3;

export default function RegistrosScreen() {
  const { fichaId, name } = useLocalSearchParams<{
    id: string;
    fichaId: string;
    name: string;
  }>();
  const [registros, setRegistros] = useState<IRegistro[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const patientName = Array.isArray(name) ? name[0] : (name ?? "");
  const fichaIdStr = Array.isArray(fichaId) ? fichaId[0] : (fichaId ?? "");

  async function carregarRegistros() {
    try {
      if (!fichaIdStr) return;

      const data = await getAllRegistros(fichaIdStr, search);

      setRegistros(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar registros");
    }
  }

  useEffect(() => {
    carregarRegistros();
  }, [fichaIdStr, search]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(registros.length / ITEMS_PER_PAGE));

  const pageData = registros.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

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
          onChangeText={setSearch}
          placeholder="Buscar por situação, emoção ou intensidade"
        />
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.id ?? ""}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <CardRegistro
            id={item.id}
            situacao={item.situacao}
            emocao={item.emocao}
            intensidade={item.intensidade}
            descricao={item.descricao}
            dataOcorrido={item.dataOcorrido}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-32 gap-2">
            <MaterialIcons name="search-off" size={40} color="#828282" />
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
