import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { PatientCard, type ActionPosition } from "@/src/components/PatientCard";
import { Pagination } from "@/src/components/Pagination";
import { CadastrarPacienteModal } from "@/src/components/CadastrarPacienteModal";
import { PatientActionsModal } from "@/src/components/PatientActionsModal";
import { ConfirmModal } from "@/src/components/ConfirmModal";
import { SearchBar } from "@/src/components/SearchBar";

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
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [actionsState, setActionsState] = useState<{
    patientId: string;
    position: ActionPosition;
  } | null>(null);

  const filtered = MOCK_PATIENTS.filter(
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

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <View className="flex-row items-start justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-primary">
              Meus Pacientes
            </Text>
            <Text className="text-sm text-grey-500 mt-0.5">
              Acompanhe seus pacientes.
            </Text>
          </View>
          <TouchableOpacity
            className="w-11 h-11 rounded-full bg-primary items-center justify-center"
            onPress={() => setCadastroVisible(true)}
          >
            <MaterialIcons name="person-add" size={22} color="white" />
          </TouchableOpacity>
        </View>

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
        renderItem={({ item }) => (
          <PatientCard
            name={item.name}
            email={item.email}
            phone={item.phone}
            birthDate={item.birthDate}
            onActions={(pos) =>
              setActionsState({ patientId: item.id, position: pos })
            }
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
        patientName={
          MOCK_PATIENTS.find((p) => p.id === actionsState?.patientId)?.name ??
          null
        }
        position={actionsState?.position ?? null}
        onClose={() => setActionsState(null)}
        onExcluir={() => setConfirmVisible(true)}
      />

      <ConfirmModal
        visible={confirmVisible}
        message="Tem certeza de que deseja remover esse paciente?"
        onClose={() => setConfirmVisible(false)}
        onConfirm={() => {}}
      />
    </View>
  );
}
