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

type Meta = { emoji: string; pt: string; zh: string; color: string; keywords: string[] };

// Cores categoricas validadas (tema escuro, superficie #0d0d0d) — paleta de
// referencia da skill de dataviz, ordem fixa = mecanismo de seguranca CVD.
export const CATEGORY_META: Record<CategoryKey, Meta> = {
  audio: {
    emoji: "🎧",
    pt: "Fones & Áudio",
    zh: "耳机与音响",
    color: "#3987e5",
    keywords: [
      "fone", "headphone", "headset", "earbud", "earphone", "caixa de som",
      "caixinha", "speaker", "soundbar", "microfone", " mic", "audio", "som ",
    ],
  },
  chargers: {
    emoji: "🔌",
    pt: "Carregadores & Cabos",
    zh: "充电器与线缆",
    color: "#199e70",
    keywords: [
      "carregad", "charger", "cabo", "cable", "usb", "type-c", "tipo-c",
      "typec", "lightning", "adaptador", "adapter", "fonte", "tomada",
    ],
  },
  power: {
    emoji: "🔋",
    pt: "Baterias & Energia",
    zh: "电池与电源",
    color: "#c98500",
    keywords: [
      "bateria", "battery", "powerbank", "power bank", "pilha", "no-break",
      "nobreak", "energia",
    ],
  },
  phone: {
    emoji: "📱",
    pt: "Celular & Acessórios",
    zh: "手机及配件",
    color: "#008300",
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
    color: "#9085e9",
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
    color: "#e66767",
    keywords: [
      "relogio", "smartwatch", "watch", "smart band", "mi band", "fitness",
      "pulseira", "wearable",
    ],
  },
  lighting: {
    emoji: "💡",
    pt: "Iluminação & Casa",
    zh: "照明与家居",
    color: "#d55181",
    keywords: ["lampada", "led", "fita led", "luminaria", "ring light", "abajur"],
  },
  games: {
    emoji: "🎮",
    pt: "Games",
    zh: "游戏",
    color: "#d95926",
    keywords: [
      "controle", "joystick", "gamepad", "console", "ps4", "ps5", "xbox",
      "nintendo", "gamer", "game",
    ],
  },
  misc: {
    emoji: "📦",
    pt: "Variados",
    zh: "其他",
    color: "#94a3b8",
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
