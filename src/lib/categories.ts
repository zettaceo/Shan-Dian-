import type { Lang } from "./i18n";

// ---------------------------------------------------------------------------
//  Classificacao automatica de produtos por categoria/tipo (loja de eletronicos)
//  O sistema identifica pela descricao/nome; o que nao reconhecer vai para
//  "Variados". Nenhuma coluna extra no banco — a categoria e derivada do nome.
// ---------------------------------------------------------------------------

export type CategoryKey =
  | "audio"
  | "chargers"
  | "power"
  | "phone"
  | "computing"
  | "wearables"
  | "lighting"
  | "games"
  | "misc";

type Meta = { emoji: string; pt: string; zh: string; keywords: string[] };

export const CATEGORY_META: Record<CategoryKey, Meta> = {
  audio: {
    emoji: "🎧",
    pt: "Fones & Áudio",
    zh: "耳机与音响",
    keywords: [
      "fone", "headphone", "headset", "earbud", "earphone", "caixa de som",
      "caixinha", "speaker", "soundbar", "microfone", " mic", "audio", "som ",
    ],
  },
  chargers: {
    emoji: "🔌",
    pt: "Carregadores & Cabos",
    zh: "充电器与线缆",
    keywords: [
      "carregad", "charger", "cabo", "cable", "usb", "type-c", "tipo-c",
      "typec", "lightning", "adaptador", "adapter", "fonte", "tomada",
    ],
  },
  power: {
    emoji: "🔋",
    pt: "Baterias & Energia",
    zh: "电池与电源",
    keywords: [
      "bateria", "battery", "powerbank", "power bank", "pilha", "no-break",
      "nobreak", "energia",
    ],
  },
  phone: {
    emoji: "📱",
    pt: "Celular & Acessórios",
    zh: "手机及配件",
    keywords: [
      "capa", "capinha", "case", "pelicula", "glass", "vidro", "suporte",
      "holder", "popsocket", "pop socket", "celular", "smartphone", "iphone",
      "android",
    ],
  },
  computing: {
    emoji: "💻",
    pt: "Informática",
    zh: "电脑与配件",
    keywords: [
      "mouse", "teclado", "keyboard", "notebook", "laptop", "pendrive",
      "pen drive", "ssd", " hd", "hdd", "cartao", "memoria", "microsd",
      "sd card", "webcam", "roteador", "router", "monitor", " hub",
    ],
  },
  wearables: {
    emoji: "⌚",
    pt: "Smart & Wearables",
    zh: "智能穿戴",
    keywords: [
      "relogio", "smartwatch", "watch", "smart band", "mi band", "fitness",
      "pulseira", "wearable",
    ],
  },
  lighting: {
    emoji: "💡",
    pt: "Iluminação & Casa",
    zh: "照明与家居",
    keywords: ["lampada", "led", "fita led", "luminaria", "ring light", "abajur"],
  },
  games: {
    emoji: "🎮",
    pt: "Games",
    zh: "游戏",
    keywords: [
      "controle", "joystick", "gamepad", "console", "ps4", "ps5", "xbox",
      "nintendo", "gamer", "game",
    ],
  },
  misc: {
    emoji: "📦",
    pt: "Variados",
    zh: "其他",
    keywords: [],
  },
};

/** Ordem em que as categorias sao verificadas (mais especifica primeiro). */
const DETECT_ORDER: CategoryKey[] = [
  "audio", "wearables", "games", "computing", "phone", "power", "lighting", "chargers",
];

/** Ordem de exibicao das secoes no gerenciador de produtos. */
export const CATEGORY_ORDER: CategoryKey[] = [
  "audio", "chargers", "power", "phone", "computing", "wearables", "lighting", "games", "misc",
];

function normalize(s: string) {
  return ` ${s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")} `;
}

/** Identifica a categoria de um produto a partir do nome (e descricao). */
export function categorize(name: string, description?: string | null): CategoryKey {
  const text = normalize(`${name} ${description ?? ""}`);
  for (const key of DETECT_ORDER) {
    if (CATEGORY_META[key].keywords.some((k) => text.includes(k))) return key;
  }
  return "misc";
}

export function categoryLabel(key: CategoryKey, lang: Lang) {
  return lang === "zh" ? CATEGORY_META[key].zh : CATEGORY_META[key].pt;
}
