import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  pendentes: number;
  carrinho: number;
  total: number;
  progresso: number;
}

export function Header({ pendentes, carrinho, total, progresso }: HeaderProps) {
  return (
    <>
      <Text style={s.rotulo}>MINHA LISTA</Text>
      <Text style={s.titulo}>Compras da semana</Text>
      {total > 0 && (
        <>
          <View style={s.resumo}>
            <Text style={s.auxiliar}>{pendentes} pendentes</Text>
            <Text style={s.auxiliar}>{carrinho} de {total} no carrinho</Text>
          </View>
          <View style={s.barra}>
            <View style={[s.progresso, { width: `${progresso * 100}%` }]} />
          </View>
        </>
      )}
    </>
  );
}

const s = StyleSheet.create({
  rotulo: {
    color: "#A3E635",
    fontSize: 14,
    letterSpacing: 2
  },
  titulo: {
    color: "#FAFAFA",
    fontSize: 31,
    fontWeight: "700",
    marginBottom: 12
  },
  resumo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8
  },
  auxiliar: {
    color: "#A1A1AA",
    fontSize: 13
  },
  barra: {
    height: 6,
    backgroundColor: "#20242A",
    borderRadius: 999,
    marginBottom: 14
  },
  progresso: {
    height: 6,
    backgroundColor: "#A3E635",
    borderRadius: 999
  }
});
