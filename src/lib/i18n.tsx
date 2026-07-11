"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// ---------------------------------------------------------------------------
//  Dicionario de traducoes — Portugues (pt) e Chines Simplificado (zh)
// ---------------------------------------------------------------------------
export const dictionary = {
  pt: {
    "lang.name": "PT",
    "app.name": "SHAN DIAN",
    "app.tagline": "闪电 · Cadastro Rapido de Produtos",

    "auth.title": "ACESSO RESTRITO",
    "auth.badge": "SUPABASE/AUTH",
    "auth.subtitle": "Entre com seu usuario e senha para gerenciar o estoque.",
    "auth.email": "USUARIO",
    "auth.password": "SENHA",
    "auth.username_placeholder": "ex.: maria",
    "auth.signin": "ENTRAR",
    "auth.signup": "CADASTRAR FUNCIONARIO",
    "auth.toggle_to_signup": "Cadastrar novo funcionario",
    "auth.toggle_to_signin": "Ja tem conta? Entrar",
    "auth.signup_ok": "Funcionario cadastrado! Agora e so entrar com usuario e senha.",
    "auth.loading": "PROCESSANDO...",

    "header.logout": "SAIR",
    "header.online": "ONLINE",

    "scanner.title": "LEITOR DE CODIGO",
    "scanner.badge": "CAMERA/SCAN",
    "scanner.hint": "Aponte a camera para o codigo de barras do produto.",
    "scanner.open": "ABRIR CAMERA",
    "scanner.close": "FECHAR CAMERA",
    "scanner.reading": "LENDO...",
    "scanner.detected": "CODIGO DETECTADO",
    "scanner.error": "Nao foi possivel acessar a camera. Verifique as permissoes.",

    "form.title": "CADASTRO DE PRODUTO",
    "form.badge": "SUPABASE/PRODUCTS",
    "form.barcode": "CODIGO DE BARRAS",
    "form.name": "NOME DO PRODUTO",
    "form.description": "DESCRICAO",
    "form.sale_price": "PRECO DE VENDA",
    "form.cost_price": "PRECO COM PUXADOR",
    "form.stock": "QUANTIDADE EM ESTOQUE",
    "form.save": "SALVAR PRODUTO",
    "form.saving": "SALVANDO...",
    "form.saved": "PRODUTO SALVO COM SUCESSO",
    "form.required": "Preencha o codigo de barras e o nome do produto.",
    "form.placeholder.barcode": "789xxxxxxxxxx",
    "form.placeholder.name": "Ex.: Fone Bluetooth XZ-90",
    "form.placeholder.description": "Detalhes, cor, modelo...",

    "dash.title": "ULTIMOS CADASTROS",
    "dash.badge": "LOG/PRODUCTS",
    "dash.empty": "Nenhum produto cadastrado ainda.",
    "dash.stock": "estoque",
    "dash.loading": "CARREGANDO REGISTROS...",

    "tab.register": "CADASTRAR",
    "tab.products": "PRODUTOS",
    "tab.lookup": "CONSULTAR",
    "tab.ranking": "RANKING",

    "mgr.title": "PRODUTOS CADASTRADOS",
    "mgr.badge": "DB/PRODUCTS",
    "mgr.search": "Buscar por nome ou codigo...",
    "mgr.empty": "Nenhum produto cadastrado ainda.",
    "mgr.no_results": "Nenhum produto encontrado para a busca.",
    "mgr.loading": "CARREGANDO PRODUTOS...",
    "mgr.items": "itens",
    "mgr.stock_value": "VALOR EM ESTOQUE",
    "mgr.total_products": "PRODUTOS",
    "mgr.total_units": "UNIDADES",
    "mgr.edit": "EDITAR",
    "mgr.delete": "EXCLUIR",
    "mgr.save": "SALVAR",
    "mgr.cancel": "CANCELAR",
    "mgr.confirm_delete": "Excluir este produto definitivamente?",
    "mgr.updated": "Produto atualizado.",
    "mgr.sale": "Venda",
    "mgr.puxador": "Puxador",
    "mgr.stock": "Estoque",

    "lookup.title": "CONSULTA DE PRECO",
    "lookup.badge": "SCAN/QUERY",
    "lookup.hint": "Escaneie ou digite o codigo para ver o preco do produto.",
    "lookup.search": "CONSULTAR",
    "lookup.searching": "CONSULTANDO...",
    "lookup.not_found": "Produto nao encontrado no estoque.",
    "lookup.sale_price": "PRECO DE VENDA",
    "lookup.puxador": "PRECO COM PUXADOR",
    "lookup.stock": "ESTOQUE",
    "lookup.scanned": "consultas registradas",

    "rank.title": "MAIS ESCANEADOS",
    "rank.badge": "STATS/SCANS",
    "rank.day": "DIA",
    "rank.week": "SEMANA",
    "rank.month": "MES",
    "rank.empty": "Nenhuma consulta registrada neste periodo.",
    "rank.loading": "CALCULANDO RANKING...",
    "rank.scans": "consultas",
    "rank.total_scans": "CONSULTAS",
    "rank.unique": "PRODUTOS",
    "rank.top_category": "CATEGORIA TOP",

    "form.category_detected": "CATEGORIA DETECTADA",

    "misc.currency": "R$",
    "config.missing_title": "CONFIGURACAO PENDENTE",
    "config.missing": "Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no arquivo .env.local.",
  },

  zh: {
    "lang.name": "中文",
    "app.name": "闪电",
    "app.tagline": "SHAN DIAN · 快速产品登记",

    "auth.title": "受限访问",
    "auth.badge": "SUPABASE/AUTH",
    "auth.subtitle": "请输入用户名和密码以管理库存。",
    "auth.email": "用户名",
    "auth.password": "密码",
    "auth.username_placeholder": "例如：maria",
    "auth.signin": "登录",
    "auth.signup": "添加员工",
    "auth.toggle_to_signup": "添加新员工",
    "auth.toggle_to_signin": "已有账户？登录",
    "auth.signup_ok": "员工已创建！现在用用户名和密码登录即可。",
    "auth.loading": "处理中...",

    "header.logout": "退出",
    "header.online": "在线",

    "scanner.title": "条码扫描器",
    "scanner.badge": "CAMERA/SCAN",
    "scanner.hint": "将摄像头对准产品条码。",
    "scanner.open": "打开摄像头",
    "scanner.close": "关闭摄像头",
    "scanner.reading": "读取中...",
    "scanner.detected": "已检测到条码",
    "scanner.error": "无法访问摄像头，请检查权限。",

    "form.title": "产品登记",
    "form.badge": "SUPABASE/PRODUCTS",
    "form.barcode": "条形码",
    "form.name": "产品名称",
    "form.description": "描述",
    "form.sale_price": "销售价格",
    "form.cost_price": "拉手价格",
    "form.stock": "库存数量",
    "form.save": "保存产品",
    "form.saving": "保存中...",
    "form.saved": "产品保存成功",
    "form.required": "请填写条形码和产品名称。",
    "form.placeholder.barcode": "789xxxxxxxxxx",
    "form.placeholder.name": "例如：蓝牙耳机 XZ-90",
    "form.placeholder.description": "细节、颜色、型号...",

    "dash.title": "最近登记",
    "dash.badge": "LOG/PRODUCTS",
    "dash.empty": "尚未登记任何产品。",
    "dash.stock": "库存",
    "dash.loading": "正在加载记录...",

    "tab.register": "登记",
    "tab.products": "产品",
    "tab.lookup": "查询",
    "tab.ranking": "排行",

    "mgr.title": "已登记产品",
    "mgr.badge": "DB/PRODUCTS",
    "mgr.search": "按名称或条码搜索...",
    "mgr.empty": "尚未登记任何产品。",
    "mgr.no_results": "未找到匹配的产品。",
    "mgr.loading": "正在加载产品...",
    "mgr.items": "件",
    "mgr.stock_value": "库存价值",
    "mgr.total_products": "产品数",
    "mgr.total_units": "件数",
    "mgr.edit": "编辑",
    "mgr.delete": "删除",
    "mgr.save": "保存",
    "mgr.cancel": "取消",
    "mgr.confirm_delete": "确定要永久删除该产品吗？",
    "mgr.updated": "产品已更新。",
    "mgr.sale": "售价",
    "mgr.puxador": "拉手价",
    "mgr.stock": "库存",

    "lookup.title": "价格查询",
    "lookup.badge": "SCAN/QUERY",
    "lookup.hint": "扫描或输入条码以查看产品价格。",
    "lookup.search": "查询",
    "lookup.searching": "查询中...",
    "lookup.not_found": "库存中未找到该产品。",
    "lookup.sale_price": "销售价格",
    "lookup.puxador": "拉手价格",
    "lookup.stock": "库存",
    "lookup.scanned": "次查询记录",

    "rank.title": "扫描最多",
    "rank.badge": "STATS/SCANS",
    "rank.day": "日",
    "rank.week": "周",
    "rank.month": "月",
    "rank.empty": "该时间段内没有查询记录。",
    "rank.loading": "正在计算排行...",
    "rank.scans": "次查询",
    "rank.total_scans": "查询数",
    "rank.unique": "产品数",
    "rank.top_category": "热门类别",

    "form.category_detected": "识别类别",

    "misc.currency": "¥",
    "config.missing_title": "配置待完成",
    "config.missing": "请在 .env.local 中设置 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY。",
  },
} as const;

export type Lang = keyof typeof dictionary;
export type TranslationKey = keyof (typeof dictionary)["pt"];

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: TranslationKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "shan-dian-lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  // Restaura o idioma salvo no navegador.
  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "pt" || saved === "zh") setLangState(saved);
  }, []);

  const setLang = (next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      toggle: () => setLang(lang === "pt" ? "zh" : "pt"),
      t: (key) => dictionary[lang][key] ?? key,
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n deve ser usado dentro de <I18nProvider>");
  return ctx;
}
