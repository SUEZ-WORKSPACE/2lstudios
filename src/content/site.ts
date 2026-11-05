/**
 * Tudo o que se troca sem mexer no código está aqui:
 * contactos, textos e os três vídeos do site.
 */

export const contact = {
  // TROCAR: dados reais da 2L Studio
  whatsapp: "244932431920", // só dígitos, com indicativo do país. O botão "Acção" envia para aqui.
  whatsappLabel: "932 431 920",
  instagram: "#",
  facebook: "#",
  linkedin: "#",
};

/**
 * Os 3 lugares para vídeo. Basta colocar o ficheiro em /public/videos
 * com o nome indicado em `src`; não é preciso mexer em mais nada.
 * Se o ficheiro não existir, aparece o ecrã "sem sinal".
 */
export const videos = {
  showreel: { n: "01", src: "/videos/showreel.mp4", poster: "", hint: "16:9 · public/videos/showreel.mp4" },
  destaque: { n: "02", src: "/videos/institucional.mp4", poster: "", hint: "2.39:1 · public/videos/institucional.mp4" },
  social: { n: "03", src: "/videos/reels.mp4", poster: "", hint: "9:16 · public/videos/reels.mp4" },
};
export type VideoKey = keyof typeof videos;

export const about = {
  // Texto institucional da agência
  lead: "Agência de comunicação, marketing e produção audiovisual para empresas, marcas e instituições.",
  body: "Actuamos de forma integrada: a mesma equipa pensa a estratégia, constrói a identidade, produz os conteúdos e põe tudo no ar. Criatividade, estratégia e competência técnica, alinhadas com os objectivos de cada cliente.",
};

export const services = [
  {
    take: "T01",
    name: "Produção audiovisual",
    text: "O nosso ponto forte. Vídeos corporativos e institucionais, spots e documentários de marca, do guião à entrega final.",
    items: ["Vídeos corporativos", "Filmes institucionais", "Spots publicitários", "Cobertura de conferências"],
  },
  {
    take: "T02",
    name: "Comunicação estratégica",
    text: "Antes de filmar ou desenhar, definimos o que a marca tem de dizer, a quem, e porque é que a devem ouvir.",
    items: ["Diagnóstico de comunicação", "Plano estratégico", "Mensagens-chave", "Comunicação institucional"],
  },
  {
    take: "T03",
    name: "Marketing digital",
    text: "Presença digital que se mede. Conteúdo, anúncios e números lidos todos os meses, com decisões tomadas a partir deles.",
    items: ["Plano de marketing", "Anúncios pagos", "Conteúdos para web", "Relatórios de resultados"],
  },
  {
    take: "T04",
    name: "Branding",
    text: "Identidades fortes, que se reconhecem antes de se ler o nome. Do conceito ao manual de marca.",
    items: ["Naming e conceito", "Identidade visual", "Manual de marca", "Reposicionamento"],
  },
  {
    take: "T05",
    name: "Design gráfico",
    text: "A mesma exigência do plano aplicada ao papel e ao pixel. Tudo o que a marca põe na rua.",
    items: ["Cartazes e outdoors", "Editorial e catálogos", "Peças para eventos", "Motion design"],
  },
  {
    take: "T06",
    name: "Fotografia",
    text: "Pessoas, espaços e produtos com a luz certa. Imagens próprias, para deixares de usar as de banco.",
    items: ["Corporativa e retrato", "Produto", "Institucional", "Eventos empresariais"],
  },
  {
    take: "T07",
    name: "Gestão de redes sociais",
    text: "Planeamos, produzimos, publicamos e lemos os números. Tu voltas a pensar no teu negócio.",
    items: ["Calendário editorial", "Reels e conteúdo semanal", "Publicação e comunidade", "Relatório mensal"],
  },
  {
    take: "T08",
    name: "Publicidade",
    text: "Uma ideia, cortada para cada ecrã onde o teu cliente está: televisão, outdoor, YouTube, Instagram.",
    items: ["Conceito criativo", "Campanhas 360°", "Lançamento de produto", "Cortes de 6, 15 e 30 segundos"],
  },
];

export const process = [
  { n: "01", title: "Briefing", text: "Ouvimos primeiro. O que vendes, a quem, e o que está a falhar na forma como és visto." },
  { n: "02", title: "Estratégia", text: "Objectivos, mensagem e formato no papel. Só avançamos depois de aprovares." },
  { n: "03", title: "Produção", text: "Câmara, luz, som e design a sério. A equipa entra, trabalha e não pára a tua empresa." },
  { n: "04", title: "Edição", text: "Montagem, cor, som e grafismo. É aqui que a peça ganha ritmo." },
  { n: "05", title: "Estreia", text: "Entregamos em todos os formatos e pomos o trabalho onde tem de ser visto." },
];

export const crew = [
  "Guião", "Realização", "Direcção de fotografia", "Som directo",
  "Montagem", "Correcção de cor", "Motion design", "Locução",
];

/** Peças de exemplo. Para usar uma arte real: guarda em /public/posters e preenche `image`. */
export const posters: { id: string; variant: "tri" | "two" | "grid" | "ell"; line: string; sub: string; image?: string }[] = [
  { id: "a", variant: "tri", line: "Campanha", sub: "Cartaz A1" },
  { id: "b", variant: "two", line: "Abertura", sub: "Outdoor 8×3" },
  { id: "c", variant: "grid", line: "Em breve", sub: "Post 1:1" },
  { id: "d", variant: "ell", line: "Estreia", sub: "Story 9:16" },
];
