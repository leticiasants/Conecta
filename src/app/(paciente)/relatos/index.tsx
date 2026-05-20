import { CardRelato } from "@/src/app/(paciente)/relatos/components/CardRelato";
import { ActionsDropdownModal } from "@/src/components/ActionsDropdownModal";
import { ConfirmModal } from "@/src/components/ConfirmModal";
import { Pagination } from "@/src/components/Pagination";
import { RelatoData, RelatoFormModal } from "@/src/components/RelatoFormModal";
import { SearchBar } from "@/src/components/SearchBar";
import type { ActionPosition } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

type Relato = RelatoData & { id: string };

// const MOCK_RELATOS: Relato[] = [
//   {
//     id: "1",
//     situacao: "Fiquei triste",
//     emocao: "Tristeza",
//     intensidade: 6,
//     descricao:
//       "Hoje foi um dia difícil. Senti que as coisas não estavam fluindo e me fechei um pouco. Precisei de um tempo sozinha para processar os sentimentos.",
//     data: "16/02/2026",
//   },
//   {
//     id: "2",
//     situacao: "Dia feliz",
//     emocao: "Alegria",
//     intensidade: 8,
//     descricao:
//       "Hoje foi um dia leve e feliz. Consegui realizar minhas tarefas com tranquilidade e ainda tive alguns momentos agradáveis ao longo do dia.",
//     data: "17/02/2026",
//   },
//   {
//     id: "3",
//     situacao: "Ansiedade no trabalho",
//     emocao: "Ansiedade",
//     intensidade: 7,
//     descricao:
//       "Tive muitas demandas hoje e me senti sobrecarregada. As reuniões foram longas e não consegui finalizar as tarefas planejadas.",
//     data: "18/02/2026",
//   },
// ];

const MOCK_RELATOS: Relato[] = [];

const ITEMS_PER_PAGE = 3;

type ActionsState = { relatoId: string; position: ActionPosition };

export default function RelatosScreen() {
  const [relatos, setRelatos] = useState<Relato[]>(MOCK_RELATOS);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addVisible, setAddVisible] = useState(false);
  const [editData, setEditData] = useState<Relato | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [actionsState, setActionsState] = useState<ActionsState | null>(null);

  const nextId = useRef(MOCK_RELATOS.length + 1);

  const filtered = relatos.filter(
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

  function handleAdd(data: RelatoData) {
    const newRelato: Relato = { ...data, id: String(nextId.current++) };
    setRelatos((prev) => [newRelato, ...prev]);
  }

  function handleEdit(data: RelatoData) {
    if (!editData) return;
    setRelatos((prev) =>
      prev.map((r) =>
        r.id === editData.id ? { ...data, id: editData.id } : r,
      ),
    );
    setEditData(null);
  }

  function handleDelete() {
    if (!confirmId) return;
    setRelatos((prev) => prev.filter((r) => r.id !== confirmId));
    setConfirmId(null);
  }

  function openActions(relatoId: string, position: ActionPosition) {
    setActionsState({ relatoId, position });
  }

  const selectedRelato = actionsState
    ? (relatos.find((r) => r.id === actionsState.relatoId) ?? null)
    : null;

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <View className="flex-row items-start justify-between mb-1">
          <View>
            <Text className="text-2xl font-bold text-primary">
              Meus Relatos
            </Text>
            <Text className="text-sm text-grey-500 mt-1 mb-3">
              Registre e acompanhe suas emoções.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setAddVisible(true)}
            className="w-11 h-11 rounded-full bg-primary items-center justify-center"
          >
            <MaterialIcons
              name="edit-note"
              size={24}
              color="white"
              className="mt-0.5 ml-1"
            />
          </TouchableOpacity>
        </View>

        <SearchBar
          value={search}
          onChangeText={handleSearch}
          placeholder="Buscar por situação, emoção ou intensidade"
        />
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.id}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 8 }}
        renderItem={({ item }) => (
          <CardRelato
            titulo={item.situacao}
            emocao={item.emocao}
            intensidade={item.intensidade}
            descricao={item.descricao}
            dataOcorrido={item.data}
            acoes={(position) => openActions(item.id, position)}
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
              Infelizmente nenhum relato encontrado.
            </Text>
          </View>
        }
      />

      <Pagination
        total={totalPages}
        current={currentPage}
        onPage={setCurrentPage}
      />

      <ActionsDropdownModal
        visible={!!actionsState}
        position={actionsState?.position ?? null}
        onClose={() => setActionsState(null)}
        items={[
          {
            icon: "edit",
            label: "Editar",
            onPress: () => {
              if (selectedRelato) setEditData(selectedRelato);
            },
          },
          {
            icon: "delete",
            label: "Excluir",
            iconColor: "#990000",
            labelClass: "text-sm font-semibold text-red",
            onPress: () => {
              if (actionsState) setConfirmId(actionsState.relatoId);
            },
          },
        ]}
      />

      <RelatoFormModal
        visible={addVisible}
        mode="add"
        onClose={() => setAddVisible(false)}
        onSave={handleAdd}
      />

      <RelatoFormModal
        visible={!!editData}
        mode="edit"
        initialData={
          editData
            ? {
                situacao: editData.situacao,
                emocao: editData.emocao,
                intensidade: editData.intensidade,
                descricao: editData.descricao,
                data: editData.data,
              }
            : undefined
        }
        onClose={() => setEditData(null)}
        onSave={handleEdit}
      />

      <ConfirmModal
        visible={!!confirmId}
        message="Tem certeza de que deseja excluir este relato? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </View>
  );
}
