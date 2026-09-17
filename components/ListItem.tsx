import { Pressable, StyleSheet, Text, View } from "react-native";
import { ShoppingItem } from "../types/shopping-item";

interface ListItemProps {
  item: ShoppingItem;
  onMarcar: (id: string) => void;
  onRemover: (id: string) => void;
}

export function ListItem({ item, onMarcar, onRemover }: ListItemProps) {
  return (
    <View style={[s.item, item.comprado && s.comprado]}>
      <Pressable style={s.itemInfo} onPress={() => onMarcar(item.id)}>
        <View style={[s.circulo, item.comprado && s.circuloAtivo]}>
          {item.comprado && <Text style={s.check}>✓</Text>}
        </View>
        <Text style={[s.nome, item.comprado && s.nomeComprado]}>
          {item.nome}
        </Text>
      </Pressable>
      <View style={s.acoes}>
        <Text style={s.quantidade}>
          {item.quantidade} {item.unidade}
        </Text>
        <Pressable style={s.remover} onPress={() => onRemover(item.id)}>
          <Text style={s.x}>×</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  item: {
    height: 74,
    backgroundColor: "#16181D",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  comprado: {
    backgroundColor: "#141712"
  },
  itemInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  circulo: {
    width: 26,
    height: 26,
    borderRadius: 99,
    borderWidth: 2,
    borderColor: "#4B5058",
    alignItems: "center",
    justifyContent: "center"
  },
  circuloAtivo: {
    backgroundColor: "#A3E635",
    borderColor: "#A3E635"
  },
  check: {
    color: "#101114",
    fontWeight: "700"
  },
  nome: {
    flex: 1,
    color: "#FAFAFA",
    fontSize: 18
  },
  nomeComprado: {
    color: "#687280",
    textDecorationLine: "line-through"
  },
  acoes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  quantidade: {
    color: "#A1A1AA",
    backgroundColor: "#20242A",
    padding: 7,
    borderRadius: 8,
    fontSize: 14
  },
  remover: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: "#241417",
    alignItems: "center",
    justifyContent: "center"
  },
  x: {
    color: "#F87171",
    fontSize: 21
  }
});