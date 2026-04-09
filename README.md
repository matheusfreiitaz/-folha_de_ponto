# NetFlow — Editor de Fluxogramas de Redes Gamificado
### Projeto Grau Técnico · Documentação Completa 

---

## 📁 Estrutura de Pastas

```
grau-tecnico/
│
├── index.html              ← Ponto de entrada da aplicação
│
├── css/
│   ├── base.css            ← Tokens de design, reset, layout, dashboard
│   ├── hud.css             ← HUD, toolbar, barra de missão, timer
│   ├── nodes.css           ← Nós, portas de conexão, canvas, sidebar
│   ├── panels.css          ← Painéis laterais, console de log, modais
│   └── animations.css      ← Todas as animações e microinterações
│
├── js/
│   ├── dados.js            ← Dados estáticos: fases, componentes, conquistas
│   ├── estado.js           ← Estado global do jogo + persistência
│   ├── canvas.js           ← Controle do canvas: pan, zoom, drop, atalhos
│   ├── nos.js              ← Criação, arraste e propriedades dos nós
│   ├── conexoes.js         ← Sistema de conexões Bezier e validação
│   ├── simulacao.js        ← Motor de simulação com animação de pacotes
│   ├── validacao.js        ← Validação de fluxo em tempo real
│   ├── hud.js              ← Timer, log, notificações, modais
│   ├── gamificacao.js      ← XP, conquistas, dashboard, sidebar
│   └── app.js              ← Controlador principal e roteamento
│
└── README.md               ← Esta documentação
```

---

## 🎯 Visão Geral do Sistema

O **NetFlow** é um jogo educacional interativo para aprendizado de infraestrutura de redes.
O jogador constrói fluxogramas de rede arrastando componentes para o canvas,
conectando-os e simulando o fluxo de dados.

### Principais Funcionalidades

| Funcionalidade        | Descrição |
|----------------------|-----------|
| 🎮 **4 Fases**       | Fundamentos → Roteamento → Segurança → Corporativa |
| ⭐ **Sistema de XP** | Cada fase concede XP baseado em tempo e precisão |
| 🏆 **Conquistas**    | 8 badges desbloqueáveis por desempenho |
| ▶ **Simulação**     | Pacotes animados percorrem o fluxo em tempo real |
| ✅ **Validação**     | Detecção de nós órfãos, loops e componentes faltantes |
| ⚡ **Modo Livre**    | Canvas aberto com todos os componentes disponíveis |
| 💾 **Persistência**  | Progresso salvo automaticamente no `localStorage` |
| ↺ **Desfazer**      | Histórico de até 30 ações (Ctrl+Z) |

---

## 🗂️ Descrição dos Arquivos

### `index.html`
Estrutura HTML completa da aplicação. Contém:
- **Tela Inicial** (`#tela-inicio`): dashboard com mapa de fases e conquistas
- **Tela de Jogo** (`#tela-jogo`): editor de fluxo com HUD, canvas e painéis
- **Modais**: resultado da simulação e dicas
- Importação dos CSS e JS na ordem correta

---

### `css/base.css`
Tokens de design e estilos globais.

**Variáveis CSS principais:**
```css
--bg, --bg-2, --bg-3     /* Backgrounds escuros em camadas */
--verde, --vermelho       /* Cores de sucesso e erro */
--amarelo                 /* Alertas e XP */
--font-display            /* Fonte Syne (títulos) */
--font-mono               /* Fonte Space Mono (dados técnicos) */
--font-body               /* Fonte Inter (textos gerais) */
```

Contém também os estilos do **dashboard** (tela inicial), cards de fase,
estatísticas de progresso e grid de conquistas.

---

### `css/hud.css`
Estilos do HUD (Head-Up Display) da tela de jogo:
- Header superior com timer, botões e info da fase
- Barra de missão com status de validação em tempo real
- Toolbar inferior com botões de ferramentas
- Controle de velocidade de simulação (1×, 2×, 4×)

---

### `css/nodes.css`
Estilos dos componentes no canvas:
- `.no` → container do nó (posicionado absolutamente)
- `.no-inner` → visual do nó com ícone, label e tipo
- `.porta-*` → pontos de conexão (entrada, saída, direita, esquerda)
- Estados visuais: `.selecionado`, `.sim-ok`, `.sim-erro`, `.sim-ativo`
- Sidebar de componentes arrastáveis

---

### `css/panels.css`
Painel direito com propriedades e log:
- `#painel-props` → edição de nome, cor, tipo do nó selecionado
- `#painel-log` → console de logs da simulação em tempo real
- Modais: resultado, dica, overlay de fundo

---

### `css/animations.css`
Todas as animações do sistema:
- `@keyframes pulsar` → nó em processamento durante simulação
- `@keyframes shake` → nó com erro de validação
- Pacotes de dados animados (`.pacote-dados`)
- Notificações flutuantes deslizando da direita
- XP flutuante subindo ao ganhar pontos
- Partículas de celebração ao completar fase

---

### `js/dados.js`
**Dados estáticos do jogo** — não contém lógica, apenas configuração.

#### `COMPONENTES`
Dicionário com todos os 10 tipos de componentes de rede:
```javascript
COMPONENTES.cliente   // PC/usuário
COMPONENTES.servidor  // Servidor web
COMPONENTES.switch    // Switch de rede
COMPONENTES.roteador  // Roteador
COMPONENTES.firewall  // Firewall
COMPONENTES.dns       // Servidor DNS
COMPONENTES.load_balancer // Balanceador de carga
COMPONENTES.banco_dados   // Banco de dados
COMPONENTES.cloud         // Nuvem/serviço externo
COMPONENTES.decisao       // Ponto de decisão lógica
```

#### `FASES`
Array com as 4 fases do jogo. Cada fase define:
- `missao` → texto exibido na barra de missão
- `componentes` → quais tipos estão disponíveis na sidebar
- `nosIniciais` → nós pré-colocados no canvas
- `solucaoEsperada` → critérios de validação
- `dicas` → array de dicas progressivas
- `tempoLimite` e `xpBase`

#### `CONQUISTAS`
Array de badges com função `condicao(estado)` que retorna `boolean`.

---

### `js/estado.js`
**Gerenciamento de estado** — dois objetos globais:

#### `EstadoJogo`
Persiste no `localStorage` com chave `netflow_progresso`:
```javascript
EstadoJogo.carregar()         // Carrega do localStorage
EstadoJogo.salvar()           // Persiste no localStorage
EstadoJogo.ganharXP(qtd)      // Adiciona XP e recalcula nível
EstadoJogo.completarFase(id, estrelas, tempo)
EstadoJogo.resetarSessao()    // Limpa dados da sessão atual
```

#### `EstadoCanvas`
Estado em memória (não persiste) do canvas:
```javascript
EstadoCanvas.nos[]             // Array de nós ativos
EstadoCanvas.conexoes[]        // Array de conexões ativas
EstadoCanvas.snapshot()        // Salva para undo
EstadoCanvas.desfazer()        // Recupera último snapshot
EstadoCanvas.limpar()          // Remove tudo do canvas
```

---

### `js/canvas.js`
**Controle do canvas** — pan, zoom e eventos globais.

| Função | Descrição |
|--------|-----------|
| `aplicarPan()` | Atualiza transform CSS do canvas |
| `telaParaCanvas(x, y)` | Converte coordenadas viewport → canvas |
| `setFerramenta(nome)` | Muda ferramenta ativa e cursor |
| `deselecionarTudo()` | Remove seleção visual |
| `deletarSelecionado()` | Deleta nó ou conexão selecionada |
| `duplicarSelecionado()` | Duplica o nó atual |
| `desfazer()` | Restaura último snapshot |
| `limparCanvas(silencioso)` | Remove tudo do canvas |
| `recriarDefs()` | Recria marcadores SVG após limpeza |

**Atalhos de teclado:**
- `S` → ferramenta Selecionar
- `H` → ferramenta Mão (pan)
- `E` → ferramenta Borracha
- `C` → ferramenta Conectar
- `Del/Backspace` → deletar selecionado
- `Ctrl+Z` → desfazer
- `Escape` → cancelar ação e voltar ao selecionar

---

### `js/nos.js`
**Criação e gerenciamento de nós.**

| Função | Descrição |
|--------|-----------|
| `criarNo(tipo, x, y, opcoes)` | Cria e renderiza um nó no canvas |
| `restaurarNo(snap)` | Restaura nó a partir de snapshot |
| `moverNo(e)` | Move o nó arrastado (chamado pelo mousemove global) |
| `selecionarNo(id)` | Seleciona nó e abre painel de propriedades |
| `deletarNo(id)` | Remove nó e conexões associadas |
| `atualizarPainelProps(id)` | Atualiza painel lateral de propriedades |
| `atualizarLabelNo(id, valor)` | Muda o nome do nó |
| `atualizarFillNo(id, cor)` | Muda cor de fundo |
| `atualizarStrokeNo(id, cor)` | Muda cor de borda |

**Estrutura de um nó no estado:**
```javascript
{
  id: 1,
  tipo: 'cliente',    // chave em COMPONENTES
  label: 'Cliente',
  x: 200, y: 100,     // posição no canvas
  fill: '#1e293b',
  stroke: '#1e3a5f',
  el: HTMLElement,    // referência ao DOM
  w: 100, h: 80       // dimensões reais
}
```

---

### `js/conexoes.js`
**Sistema de conexões com curvas Bezier.**

| Função | Descrição |
|--------|-----------|
| `posicaoPorPorta(noId, lado)` | Calcula posição X,Y da porta no canvas |
| `onPortaMouseDown(e)` | Inicia conexão ao clicar na porta |
| `atualizarLinhaTemp(e)` | Atualiza preview da conexão em andamento |
| `finalizarConexao(noDestId, lado)` | Valida e cria a conexão |
| `cancelarConexao()` | Cancela drag de conexão |
| `adicionarConexao(de, ladoDe, para, ladoPara)` | Adiciona ao estado e renderiza |
| `deletarConexao(id)` | Remove conexão |
| `renderizarConexoes()` | Re-renderiza todos os paths SVG |
| `selecionarConexao(id)` | Seleciona e exibe propriedades |
| `gerarBezier(x1, y1, x2, y2)` | Gera atributo `d` da curva Bezier |

**Lados disponíveis nas portas:**
- `saida` → porta azul (baixo do nó)
- `entrada` → porta verde (cima do nó)
- `direita` → porta laranja (direita)
- `esquerda` → porta laranja (esquerda)

---

### `js/simulacao.js`
**Motor de simulação com animação de pacotes.**

| Função | Descrição |
|--------|-----------|
| `simular()` | Ponto de entrada — valida e inicia animação |
| `pararSimulacao()` | Cancela animação em andamento |
| `animarCaminho(caminho, callback)` | Anima nó a nó pela rota |
| `animarPacoteConexao(conn, dur, cb)` | Anima bolinha numa conexão |
| `obterCaminho()` | BFS para encontrar rota cliente→servidor |
| `setVelocidade(v)` | Define 1×, 2× ou 4× |
| `verificarConclusaoMissao(resultado)` | Calcula estrelas, XP e abre modal |

**Como funciona a simulação:**
1. `simular()` chama `validarFluxo()`
2. Se válido, `obterCaminho()` executa BFS do nó "cliente" ao "servidor"
3. `animarCaminho()` percorre a rota nó a nó
4. Para cada conexão, uma bolinha (`.pacote-dados`) anima com CSS transition
5. Ao terminar, `verificarConclusaoMissao()` exibe o modal de resultado

---

### `js/validacao.js`
**Validação em tempo real e antes da simulação.**

| Função | Descrição |
|--------|-----------|
| `validarFluxo()` | Validação completa antes de simular |
| `validarMissao()` | Verifica requisitos específicos da fase |
| `validarEmTempoReal()` | Validação leve com debounce (300ms) |
| `temLoopInfinito()` | DFS com coloração para detectar ciclos |

**Erros detectados:**
- Canvas vazio
- Nós órfãos (sem conexão)
- Sem conexões no grafo
- Loop infinito (ciclo no grafo dirigido)
- Componente obrigatório ausente
- Conexões insuficientes

---

### `js/hud.js`
**Interface de usuário dinâmica.**

| Função | Descrição |
|--------|-----------|
| `iniciarTimer()` | Inicia cronômetro da fase |
| `pararTimer()` | Para o cronômetro |
| `formatarTempo(seg)` | Converte segundos em "MM:SS" |
| `adicionarLog(tipo, msg)` | Adiciona linha ao console visual |
| `limparLog()` | Limpa o console |
| `mostrarNotificacao(msg, cor, dur)` | Notificação flutuante |
| `mostrarXPFlutuante(qtd, x, y)` | Animação "+XP" na tela |
| `emitirParticulas(x, y)` | Partículas coloridas de celebração |
| `abrirDica()` | Abre modal com dica da fase atual |
| `exibirModalResultado(dados)` | Modal de resultado da simulação |
| `fecharModal()` | Fecha modal e volta ao dashboard |

---

### `js/gamificacao.js`
**Sistema de gamificação e progressão.**

| Função | Descrição |
|--------|-----------|
| `verificarConquistas()` | Testa e desbloqueia badges novas |
| `renderizarDashboard()` | Atualiza toda a tela inicial |
| `renderizarConquistas()` | Renderiza grid de badges |
| `renderizarSidebarComponentes(tipos)` | Popula a sidebar da fase |

---

### `js/app.js`
**Controlador principal — ponto de entrada da lógica.**

| Função | Descrição |
|--------|-----------|
| `navegarPara(telaId)` | Troca de tela (dashboard ↔ jogo) |
| `voltarDashboard()` | Para tudo e volta ao menu |
| `iniciarFase(idFase)` | Configura e inicia uma fase |
| `reiniciarFase()` | Recomeça a fase atual |
| `iniciarModoLivre()` | Inicia o modo sem restrições |
| `atualizarXPHUD()` | Sincroniza XP exibido no HUD |

---

## 🚀 Como Executar

### Opção 1: Direto no Navegador
Abra o arquivo `index.html` no navegador.
> ⚠️ Alguns navegadores bloqueiam acesso a arquivos locais.
> Use a Opção 2 para garantir funcionamento.

### Opção 2: Servidor Local (recomendado)
```bash
# Com Python (já instalado na maioria dos sistemas)
cd grau-tecnico
python3 -m http.server 8080

# Acesse no navegador:
# http://localhost:8080
```

### Opção 3: VS Code Live Server
Instale a extensão "Live Server" no VS Code e clique em "Go Live".

---

## 🎮 Como Jogar

1. **Dashboard**: escolha uma fase ou o Modo Livre
2. **Arraste** componentes da sidebar esquerda para o canvas
3. **Conecte** clicando na porta azul (saída) de um nó e arrastando até a porta verde (entrada) de outro
4. **Valide** em tempo real pela barra de missão
5. **Simule** clicando em "▶ SIMULAR" para ver o fluxo animado
6. **Complete** a missão para ganhar XP, estrelas e badges!

---

## 🔧 Como Expandir o Sistema

### Adicionar novo componente de rede
Em `js/dados.js`, no objeto `COMPONENTES`:
```javascript
COMPONENTES.meu_componente = {
  id: 'meu_componente',
  nome: 'Meu Componente',
  icone: '📟',
  tipo: 'rede',
  dica: 'Descrição do que este componente faz.',
  cor: '#1e293b'
};
```

### Adicionar nova fase
Em `js/dados.js`, no array `FASES`:
```javascript
{
  id: 5,
  titulo: 'Minha Nova Fase',
  subtitulo: 'Fase 5',
  icone: '🚀',
  missao: 'Descrição da missão...',
  componentes: ['cliente', 'servidor', 'meu_componente'],
  tempoLimite: 180,
  xpBase: 300,
  solucaoEsperada: {
    nosObrigatorios: ['cliente', 'servidor', 'meu_componente'],
    conexoesMinimas: 2
  },
  nosIniciais: [
    { tipo: 'cliente', x: 150, y: 80, label: 'Cliente' }
  ],
  dicas: ['Dica 1', 'Dica 2']
}
```

### Adicionar nova conquista
Em `js/dados.js`, no array `CONQUISTAS`:
```javascript
{
  id: 'minha_conquista',
  nome: 'Minha Conquista',
  icone: '🎖️',
  descricao: 'Condição para desbloquear.',
  condicao: (estado) => estado.xpTotal >= 500
}
```

---

## 🧪 Tecnologias Utilizadas

| Tecnologia | Uso |
|-----------|-----|
| HTML5      | Estrutura da aplicação |
| CSS3       | Estilos, animações, variáveis |
| JavaScript | Lógica, estado, eventos |
| SVG        | Conexões Bezier no canvas |
| localStorage | Persistência do progresso |
| Google Fonts | Syne, Space Mono, Inter |

> **Sem dependências externas** — o projeto funciona 100% offline
> sem npm, webpack ou qualquer framework.

---

## 📝 Licença
Projeto educacional desenvolvido para o **Grau Técnico**.
Uso livre para fins de ensino e aprendizado.
