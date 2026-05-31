import { usePacientePermissao } from "@/src/app/(paciente)/_layout";
import { ActionsDropdownModal } from "@/src/components/ActionsDropdownModal";
import { ConfirmModal } from "@/src/components/ConfirmModal";
import { Pagination } from "@/src/components/Pagination";
import { SearchBar } from "@/src/components/SearchBar";
import { ModalAddRegistro } from "@/src/modules/paciente/components";
import { ModalEditarRegistro } from "@/src/modules/paciente/components/ModalEditarRegistro";
import { createRegistro } from "@/src/modules/paciente/services/create-registro";
import { deleteRegistro } from "@/src/modules/paciente/services/delete-registro";
import { getAllRegistros } from "@/src/modules/paciente/services/get-all-registros";
import { updateRegistro } from "@/src/modules/paciente/services/update-registro";
import { IRegistro } from "@/src/modules/paciente/ts/IRegistro";
import type { ActionPosition } from "@/src/types";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CardRegistro } from "./components";

const ITEMS_PER_PAGE = 3;
type ActionsState = { registroId: string; position: ActionPosition };

export default function RegistroScreen() {
  const { temPsicologo, fichaId } = usePacientePermissao();
  const [registros, setRegistros] = useState<IRegistro[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [addVisible, setAddVisible] = useState(false);
  const [editData, setEditData] = useState<IRegistro | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [actionsState, setActionsState] = useState<ActionsState | null>(null);

  const { openAdd } = useLocalSearchParams<{ openAdd?: string }>();

  type RegistroForm = Omit<IRegistro, "id">;

  useEffect(() => {
    if (openAdd === "1") {
      setAddVisible(true);
      router.setParams({ openAdd: undefined });
    }
  }, [openAdd]);

  const carregarRegistros = useCallback(async () => {
    if (!fichaId) {
      setRegistros([]);
      return;
    }
    const data = await getAllRegistros(fichaId, search);
    setRegistros(data);
  }, [fichaId, search]);

  useEffect(() => {
    carregarRegistros();
  }, [carregarRegistros]);

  const totalPages = Math.max(1, Math.ceil(registros.length / ITEMS_PER_PAGE));
  const pageData = registros.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  function handleSearch(text: string) {
    setSearch(text);
    setCurrentPage(1);
  }

  async function handleAdd(data: RegistroForm) {
    if (!fichaId || !temPsicologo) return;

    try {
      await createRegistro(fichaId, data);
      await carregarRegistros();

      Alert.alert("Sucesso", "Registro salvo.");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar o registro.");
    }
  }

  async function handleEdit(data: IRegistro) {
    if (!fichaId || !editData) return;
    try {
      await updateRegistro(fichaId, editData.id, data);
      setRegistros((prev) =>
        prev.map((r) =>
          r.id === editData.id ? { ...data, id: editData.id } : r,
        ),
      );
      Alert.alert("Sucesso", "Registro atualizado.");
      setEditData(null);
    } catch {
      Alert.alert("Erro", "Não foi possível editar o registro.");
    }
  }

  async function handleDelete() {
    if (!fichaId || !confirmId) return;
    try {
      await deleteRegistro(fichaId, confirmId);
      setRegistros((prev) => prev.filter((r) => r.id !== confirmId));
      Alert.alert("Sucesso", "Registro excluído.");
      setConfirmId(null);
    } catch {
      Alert.alert("Erro", "Não foi possível excluir o registro.");
    }
  }

  function openActions(registroId: string, position: ActionPosition) {
    setActionsState({ registroId, position });
  }

  const selectedRegistro = actionsState
    ? (registros.find((r) => r.id === actionsState.registroId) ?? null)
    : null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-6 pb-3">
        <View className="flex-row items-start justify-between mb-1">
          <View>
            <Text className="text-2xl font-bold text-primary">
              Meus Registros
            </Text>
            <Text className="text-sm text-grey-500 mt-1 mb-3">
              Registre e acompanhe suas emoções.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setAddVisible(true)}
            disabled={!fichaId || !temPsicologo}
            style={{ opacity: !fichaId || !temPsicologo ? 0.4 : 1 }}
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

        {fichaId && !temPsicologo && (
          <View className="flex-row items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2 mb-2">
            <MaterialIcons name="info-outline" size={16} color="#B45309" />
            <Text className="text-xs text-yellow-800 flex-1">
              Você não está vinculado a um psicólogo. Acesse Solicitações de
              Vínculo para aceitar um convite.
            </Text>
          </View>
        )}

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
          <CardRegistro
            id={item.id}
            situacao={item.situacao}
            emocao={item.emocao}
            intensidade={item.intensidade}
            descricao={item.descricao}
            dataOcorrido={item.dataOcorrido}
            acoes={(position) => openActions(item.id, position)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-32 gap-2">
            <MaterialIcons name="search-off" size={40} color="#828282" />
            <Text className="text-grey-500 text-sm">
              {fichaId === null
                ? "Você não possui vínculo ativo com um psicólogo."
                : "Infelizmente nenhum registro encontrado."}
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
              if (selectedRegistro) setEditData(selectedRegistro);
            },
          },
          {
            icon: "delete",
            label: "Excluir",
            iconColor: "#990000",
            labelClass: "text-sm font-semibold text-red",
            onPress: () => {
              if (actionsState) setConfirmId(actionsState.registroId);
            },
          },
        ]}
      />

      <ModalAddRegistro
        visible={addVisible}
        onClose={() => setAddVisible(false)}
        onSave={handleAdd}
      />

      <ModalEditarRegistro
        visible={!!editData}
        initialData={
          editData
            ? {
                id: editData.id,
                situacao: editData.situacao,
                emocao: editData.emocao,
                intensidade: editData.intensidade,
                descricao: editData.descricao,
                dataOcorrido: editData.dataOcorrido,
              }
            : undefined
        }
        onClose={() => setEditData(null)}
        onSave={handleEdit}
      />

      <ConfirmModal
        visible={!!confirmId}
        message="Tem certeza de que deseja excluir este registro? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </SafeAreaView>
  );
}
