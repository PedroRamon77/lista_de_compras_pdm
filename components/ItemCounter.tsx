import { Pressable, StyleSheet, Text, View } from "react-native";

interface ItemCounterProps {
  quantidade: number;
  onDiminuir: () => void;
  onAumentar: () => void;
}

export function ItemCounter({ quantidade, onDiminuir, onAumentar }: ItemCounterProps) {
  return (
    <View style={s.contador}>
      <Pressable onPress={onDiminuir}>
        <Text style={s.contadorTexto}>−</Text>
      </Pressable>
      <Text style={s.numero}>{quantidade}</Text>
      <Pressable onPress={onAumentar}>
        <Text style={s.contadorTexto}>+</Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  contador: {
    height: 44,
    backgroundColor: "#20242A",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 14
  },
  contadorTexto: {
    color: "#A1A1AA",
    fontSize: 20
  },
  numero: {
    color: "#FAFAFA"
  }
});