import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ActionsDropdownModal } from "@/src/components/ActionsDropdownModal";
import { ConfirmModal } from "@/src/components/ConfirmModal";
import { Pagination } from "@/src/components/Pagination";
import { SearchBar } from "@/src/components/SearchBar";
import { useAuth } from "@/src/contexts/AuthContext";
import { ModalCadastrarPaciente } from "@/src/modules/psicologo/components";

import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

import { IPaciente } from "@/src/modules/paciente/ts/IPaciente";
import { desvincularPaciente } from "@/src/modules/psicologo/services/desvincular-paciente";
import { getAllPacientesDoPsicologo } from "@/src/modules/psicologo/services/get-all-pacientes-psicologo";
import { ActionPosition, CardPaciente } from "./components";

const ITEMS_PER_PAGE = 4;

type FormData = {
  search: string;
};

export default function PacientesScreen() {
  const { user, userProfile } = useAuth();

  const [pacientes, setPacientes] = useState<IPaciente[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [cadastroVisible, setCadastroVisible] = useState(false);

  const [confirmFichaId, setConfirmFichaId] = useState<string | null>(null);

  const [actionsState, setActionsState] = useState<{
    fichaId: string;
    idPaciente: string;
    nome: string;
    position: ActionPosition;
  } | null>(null);

  const { watch, setValue } = useForm<FormData>({
    defaultValues: {
      search: "",
    },
  });

  const search = watch("search");

  const carregar = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getAllPacientesDoPsicologo(userProfile?.id || "");

      setPacientes(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar pacientes.");
    }
  }, [user, userProfile]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // resetar paginação ao pesquisar
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = useMemo(() => {
    const termo = search?.toLowerCase() ?? "";

    return pacientes.filter(
      (p) =>
        p.nome.toLowerCase().includes(termo) ||
        p.email.toLowerCase().includes(termo) ||
        p.contato?.includes(search),
    );
  }, [pacientes, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const pageData = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE,
    );
  }, [filtered, currentPage]);

  async function handleDesvincular() {
    if (!confirmFichaId) return;
    try {
      await desvincularPaciente(confirmFichaId);
      setPacientes((prev) => prev.filter((p) => p.idFicha !== confirmFichaId));
      setConfirmFichaId(null);
    } catch {
      Alert.alert("Erro", "Não foi possível desvincular o paciente.");
    }
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
          onChangeText={(text) => setValue("search", text)}
          placeholder="Buscar por nome, e-mail ou contato"
        />
      </View>

      <FlatList
        data={pageData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingTop: 8,
          paddingBottom: 8,
        }}
        renderItem={({ item }) => (
          <CardPaciente
            nome={item.nome}
            email={item.email}
            contato={item.contato}
            nascimento={item.nascimento}
            onActions={(position) =>
              setActionsState({
                fichaId: item.idFicha,
                idPaciente: item.id,
                nome: item.nome,
                position,
              })
            }
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-32 gap-2">
            <MaterialIcons name="search-off" size={40} color="#828282" />

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

      <ModalCadastrarPaciente
        visible={cadastroVisible}
        onClose={() => {
          setCadastroVisible(false);
          carregar();
        }}
      />

      <ActionsDropdownModal
        visible={!!actionsState}
        position={actionsState?.position ?? null}
        onClose={() => setActionsState(null)}
        items={[
          {
            icon: "article",
            label: "Registros",

            onPress: () => {
              if (!actionsState) return;

              router.push({
                pathname: "/(psicologo)/registros/[id]",

                params: {
                  id: actionsState.idPaciente,
                  fichaId: actionsState.fichaId,
                  name: actionsState.nome,
                },
              });
            },
          },
          {
            icon: "link-off",
            label: "Desvincular",
            iconColor: "#990000",
            labelClass: "text-sm font-semibold text-red",

            onPress: () => {
              if (actionsState) {
                setConfirmFichaId(actionsState.fichaId);
              }
            },
          },
        ]}
      />

      <ConfirmModal
        visible={!!confirmFichaId}
        message="Tem certeza de que deseja desvincular esse paciente? Ele perderá o acesso às funcionalidades enquanto não tiver um novo psicólogo."
        confirmLabel="Desvincular"
        onClose={() => setConfirmFichaId(null)}
        onConfirm={handleDesvincular}
      />
    </View>
  );
}
