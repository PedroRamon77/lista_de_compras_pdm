import { useEffect, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Header } from "./components/Header";
import { ListItem } from "./components/ListItem";
import { ItemCounter } from "./components/ItemCounter";
import { ShoppingItem } from "./types/shopping-item";

const STORAGE = "@lista";

export default function App() {
  const [itens, setItens] = useState<ShoppingItem[]>([]);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [unidade, setUnidade] = useState("un");
  const [adicionando, setAdicionando] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE).then(dados => {
      if (dados) setItens(JSON.parse(dados));
      setCarregando(false);
    });
  }, []);

  useEffect(() => {
    if (!carregando) AsyncStorage.setItem(STORAGE, JSON.stringify(itens));
  }, [itens, carregando]);

  const adicionar = () => {
    if (!nome.trim()) return Alert.alert("Atenção", "Digite o nome do item.");

    setItens([...itens, {
      id: Date.now().toString(),
      nome: nome.trim(),
      quantidade,
      unidade,
      comprado: false
    }]);

    setNome("");
    setQuantidade(1);
    setUnidade("un");
    setAdicionando(false);
  };

  const marcar = (id: string) => {
    setItens(itens.map(item =>
      item.id === id ? { ...item, comprado: !item.comprado } : item
    ));
  };

  const remover = (id: string) => {
    Alert.alert("Remover item", "Deseja remover este item?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Remover", style: "destructive", onPress: () => setItens(itens.filter(i => i.id !== id)) }
    ]);
  };

  const pendentes = itens.filter(i => !i.comprado);
  const carrinho = itens.filter(i => i.comprado);
  const progresso = itens.length ? carrinho.length / itens.length : 0;

  if (carregando) {
    return <View style={s.carregando}><Text style={s.acento}>Carregando...</Text></View>;
  }

  return (
    <KeyboardAvoidingView style={s.tela} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <View style={s.conteudo}>
        <Header
          pendentes={pendentes.length}
          carrinho={carrinho.length}
          total={itens.length}
          progresso={progresso}
        />

        {itens.length === 0 ? (
          <View style={s.vazio}>
            <View style={s.iconeVazio}><View style={s.circuloVazio} /></View>
            <Text style={s.tituloVazio}>Nada na lista ainda</Text>
            <Text style={s.auxiliar}>Escreva o primeiro item na barra abaixo.</Text>
            <Text style={s.auxiliar}>Fica salvo no aparelho, mesmo sem internet.</Text>
          </View>
        ) : (
          <FlatList
            data={[1]}
            keyExtractor={() => "lista"}
            showsVerticalScrollIndicator={false}
            renderItem={() => (
              <View>
                {pendentes.length > 0 && (
                  <>
                    <Text style={s.secao}>PENDENTES</Text>
                    {pendentes.map(item => (
                      <ListItem
                        key={item.id}
                        item={item}
                        onMarcar={marcar}
                        onRemover={remover}
                      />
                    ))}
                  </>
                )}

                {carrinho.length > 0 && (
                  <>
                    <Text style={s.secao}>NO CARRINHO • {carrinho.length}</Text>
                    {carrinho.map(item => (
                      <ListItem
                        key={item.id}
                        item={item}
                        onMarcar={marcar}
                        onRemover={remover}
                      />
                    ))}
                  </>
                )}
              </View>
            )}
          />
        )}

        {adicionando ? (
          <View style={s.formulario}>
            <View style={s.linha}>
              <TextInput
                value={nome}
                onChangeText={setNome}
                placeholder="Novo item..."
                placeholderTextColor="#666A72"
                style={s.input}
                autoFocus
              />
              <Pressable style={s.botaoAdd} onPress={adicionar}>
                <Text style={s.add}>+</Text>
              </Pressable>
            </View>

            <View style={s.controles}>
              <ItemCounter
                quantidade={quantidade}
                onDiminuir={() => setQuantidade(Math.max(1, quantidade - 1))}
                onAumentar={() => setQuantidade(quantidade + 1)}
              />

              {["un", "kg", "cx", "pct"].map(u => (
                <Pressable
                  key={u}
                  style={[s.unidade, unidade === u && s.unidadeAtiva]}
                  onPress={() => setUnidade(u)}
                >
                  <Text style={[s.unidadeTexto, unidade === u && s.unidadeTextoAtiva]}>{u}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Pressable style={s.adicionar} onPress={() => setAdicionando(true)}>
            <Text style={s.placeholder}>Novo item...</Text>
            <View style={s.botaoMais}><Text style={s.add}>+</Text></View>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  tela: { 
    flex: 1, 
    backgroundColor: "#101114"
   },
  conteudo: { 
    flex: 1, 
    padding: 18, 
    paddingTop: 58 
  },
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
  },
  secao: { 
    color: "#687280", 
    fontSize: 12, 
    letterSpacing: 1.5, 
    marginVertical: 8 
  },
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
  },
  adicionar: { 
    height: 50, 
    backgroundColor: "#16181D", 
    borderRadius: 14, 
    paddingLeft: 16, 
    paddingRight: 7, 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between" 
  },
  placeholder: { 
    color: "#666A72", 
    fontSize: 17 
  },
  botaoMais: { 
    width: 50, 
    height: 50, 
    borderRadius: 11, 
    backgroundColor: "#20242A", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  formulario: { 
    backgroundColor: "#16181D", 
    borderRadius: 14, 
    borderWidth: 2, 
    borderColor: "#A3E635", 
    padding: 8 
  },
  linha: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  input: { 
    flex: 1, 
    height: 50, 
    color: "#FAFAFA", 
    fontSize: 17, 
    paddingHorizontal: 10 
  },
  botaoAdd: { 
    width: 50, 
    height: 50, 
    borderRadius: 11, 
    backgroundColor: "#A3E635", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  add: { 
    color: "#101114", 
    fontSize: 28 },
  controles: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginTop: 6 
  },
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
  },
  unidade: { 
    width: 44, 
    height: 44, 
    borderRadius: 11, 
    backgroundColor: "#20242A", 
    alignItems: "center", 
    justifyContent: "center"
  },
  unidadeAtiva: { 
    backgroundColor: "#A3E635" 
  },
  unidadeTexto: { 
    color: "#A1A1AA", 
    fontSize: 12 
  },
  unidadeTextoAtiva: { 
    color: "#101114" 
  },
  vazio: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center" 
  },
  iconeVazio: { 
    width: 74, 
    height: 74, 
    borderRadius: 18, 
    borderWidth: 1, 
    borderStyle: "dashed", 
    borderColor: "#30353D", 
    alignItems: "center", 
    justifyContent: "center", 
    marginBottom: 24 
  },
  circuloVazio: { 
    width: 28, 
    height: 28, 
    borderRadius: 99, 
    borderWidth: 2, 
    borderColor: "#4B5058" 
  },
  tituloVazio: { 
    color: "#FAFAFA", 
    fontSize: 17, 
    fontWeight: "600", 
    marginBottom: 8 
  },
  carregando: { 
    flex: 1, 
    backgroundColor: "#101114", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  acento: { 
    color: "#A3E635" 
  }
});