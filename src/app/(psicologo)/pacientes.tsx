import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { PatientCard, type ActionPosition } from "@/src/components/PatientCard";
import { Pagination } from "@/src/components/Pagination";
import { CadastrarPacienteModal } from "@/src/components/CadastrarPacienteModal";
import { PatientActionsModal } from "@/src/components/PatientActionsModal";

type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
};

const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Ana Clara Mendes",
    email: "ana@gmail.com",
    phone: "(35) 99999-9999",
    birthDate: "02/02/2002",
  },
  {
    id: "2",
    name: "Carlos Eduardo Santos",
    email: "carlos@gmail.com",
    phone: "(11) 98888-8888",
    birthDate: "15/06/1990",
  },
  {
    id: "3",
    name: "Mariana Costa Lima",
    email: "mariana@gmail.com",
    phone: "(21) 97777-7777",
    birthDate: "23/11/1995",
  },
  {
    id: "4",
    name: "Pedro Henrique Alves",
    email: "pedro@gmail.com",
    phone: "(31) 96666-6666",
    birthDate: "08/03/1988",
  },
];

const ITEMS_PER_PAGE = 4;

export default function PacientesScreen() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [cadastroVisible, setCadastroVisible] = useState(false);
  const [actionsState, setActionsState] = useState<{
    patientId: string;
    position: ActionPosition;
  } | null>(null);

  const filtered = MOCK_PATIENTS.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
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
        <Text className="text-2xl font-bold text-primary mb-4">Pacientes</Text>

        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            className="w-10 h-10 rounded-full bg-primary items-center justify-center"
            onPress={() => setCadastroVisible(true)}
          >
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>

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
          <PatientCard
            name={item.name}
            email={item.email}
            phone={item.phone}
            birthDate={item.birthDate}
            onActions={(pos) => setActionsState({ patientId: item.id, position: pos })}
          />
        )}
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

      <CadastrarPacienteModal
        visible={cadastroVisible}
        onClose={() => setCadastroVisible(false)}
      />

      <PatientActionsModal
        visible={actionsState !== null}
        patientId={actionsState?.patientId ?? null}
        position={actionsState?.position ?? null}
        onClose={() => setActionsState(null)}
        onExcluir={() => {}}
      />
    </View>
  );
}
