#!/usr/bin/env node
'use strict';

var commander = require('commander');
var path = require('path');
var fs = require('fs');
var googleTranslateApi = require('@vitalets/google-translate-api');
var bingTranslateApi = require('bing-translate-api');
var fetch = require('node-fetch');
var dset = require('dset');
var prompts = require('@inquirer/prompts');

const config = {
  defaultConfigPath: "i18n-populator.config.json"
};

const { defaultConfigPath } = config;
const configPath = defaultConfigPath;
const parsePath = (customPath) => {
  return path.join(process.cwd(), customPath);
};

const translate$2 = async (text, { from, to }) => {
  const { translation } = await bingTranslateApi.translate(text, from, to);
  return { text: translation };
};

const mirrors = [
  "https://translate.terraprint.co/translate",
  "https://trans.zillyhuhn.com/translate"
];
const libreTranslate = async (text, { from, to }) => {
  for await (const url of mirrors) {
    try {
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          q: text,
          source: from,
          target: to,
          format: "text"
        }),
        headers: { "Content-Type": "application/json" }
      }).then((res2) => res2.json());
      return { text: res.translatedText };
    } catch (err) {
      console.log(
        `Mirror failed: ${url} with the next error:

> ${err.message}

Trying with the next one...
`
      );
    }
  }
  throw new Error("All libreTranslate mirrors failed. Please try again later.");
};
const translate$1 = async (text, { from, to }) => {
  const result = await libreTranslate(text, { from, to });
  return result;
};

var Engines = /* @__PURE__ */ ((Engines2) => {
  Engines2["GOOGLE"] = "google";
  Engines2["BING"] = "bing";
  Engines2["LIBRE_TRANSLATE"] = "libreTranslate";
  return Engines2;
})(Engines || {});

const translateEngines = {
  [Engines.GOOGLE]: googleTranslateApi.translate,
  [Engines.BING]: translate$2,
  [Engines.LIBRE_TRANSLATE]: translate$1
};
const validEngines = Object.values(Engines);
const isEngineValid = (engine) => validEngines.includes(engine);

var ab = {
	name: "Abkhazian"
};
var aa = {
	name: "Afar"
};
var af = {
	name: "Afrikaans",
	google: "af",
	bing: "af"
};
var ak = {
	name: "Akan"
};
var sq = {
	name: "Albanian",
	google: "sq",
	bing: "sq",
	libreTranslate: "sq"
};
var am = {
	name: "Amharic",
	google: "am",
	bing: "am"
};
var ar = {
	name: "Arabic",
	google: "ar",
	bing: "ar",
	libreTranslate: "ar"
};
var an = {
	name: "Aragonese"
};
var hy = {
	name: "Armenian",
	google: "hy",
	bing: "hy"
};
var as = {
	name: "Assamese",
	bing: "as"
};
var av = {
	name: "Avaric"
};
var ae = {
	name: "Avestan"
};
var ay = {
	name: "Aymara"
};
var az = {
	name: "Azerbaijani",
	google: "az",
	bing: "az",
	libreTranslate: "az"
};
var bm = {
	name: "Bambara"
};
var ba = {
	name: "Bashkir",
	bing: "ba"
};
var eu = {
	name: "Basque",
	google: "eu",
	bing: "eu"
};
var be = {
	name: "Belarusian",
	google: "be"
};
var bn = {
	name: "Bengali",
	google: "bn",
	libreTranslate: "bn"
};
var bi = {
	name: "Bislama"
};
var bs = {
	name: "Bosnian",
	google: "bs",
	bing: "bs"
};
var br = {
	name: "Breton"
};
var bg = {
	name: "Bulgarian",
	google: "bg",
	bing: "bg",
	libreTranslate: "bg"
};
var my = {
	name: "Burmese",
	google: "my",
	bing: "my"
};
var ca = {
	name: "Catalan, Valencian",
	google: "ca",
	bing: "ca",
	libreTranslate: "ca"
};
var ch = {
	name: "Chamorro"
};
var ce = {
	name: "Chechen"
};
var ny = {
	name: "Chichewa, Chewa, Nyanja",
	google: "ny",
	bing: "nya"
};
var zh = {
	name: "Chinese",
	google: "zh-CN",
	bing: "lzh",
	libreTranslate: "zh"
};
var cu = {
	name: "Church Slavonic, Old Slavonic, Old Church Slavonic"
};
var cv = {
	name: "Chuvash"
};
var kw = {
	name: "Cornish"
};
var co = {
	name: "Corsican",
	google: "co"
};
var cr = {
	name: "Cree"
};
var hr = {
	name: "Croatian",
	google: "hr",
	bing: "hr"
};
var cs = {
	name: "Czech",
	google: "cs",
	bing: "cs",
	libreTranslate: "cs"
};
var da = {
	name: "Danish",
	google: "da",
	bing: "da",
	libreTranslate: "da"
};
var dv = {
	name: "Divehi, Dhivehi, Maldivian",
	bing: "dv"
};
var nl = {
	name: "Dutch, Flemish",
	google: "nl",
	bing: "nl",
	libreTranslate: "nl"
};
var dz = {
	name: "Dzongkha"
};
var en = {
	name: "English",
	google: "en",
	bing: "en",
	libreTranslate: "en"
};
var eo = {
	name: "Esperanto",
	google: "eo",
	libreTranslate: "eo"
};
var et = {
	name: "Estonian",
	google: "et",
	bing: "et",
	libreTranslate: "et"
};
var ee = {
	name: "Ewe"
};
var fo = {
	name: "Faroese",
	bing: "fo"
};
var fj = {
	name: "Fijian",
	bing: "fj"
};
var fi = {
	name: "Finnish",
	google: "fi",
	bing: "fi",
	libreTranslate: "fi"
};
var fr = {
	name: "French",
	google: "fr",
	bing: "fr",
	libreTranslate: "fr"
};
var fy = {
	name: "Western Frisian",
	google: "fy"
};
var ff = {
	name: "Fulah"
};
var gd = {
	name: "Gaelic, Scottish Gaelic",
	google: "gd"
};
var gl = {
	name: "Galician",
	google: "gl",
	bing: "gl"
};
var lg = {
	name: "Ganda",
	bing: "lug"
};
var ka = {
	name: "Georgian",
	google: "ka",
	bing: "ka"
};
var de = {
	name: "German",
	google: "de",
	bing: "de",
	libreTranslate: "de"
};
var el = {
	name: "Greek, Modern (1453–)",
	google: "el",
	bing: "el",
	libreTranslate: "el"
};
var kl = {
	name: "Kalaallisut, Greenlandic"
};
var gn = {
	name: "Guarani"
};
var gu = {
	name: "Gujarati",
	google: "gu",
	bing: "gu"
};
var ht = {
	name: "Haitian, Haitian Creole",
	google: "ht",
	bing: "ht"
};
var ha = {
	name: "Hausa",
	google: "ha",
	bing: "ha"
};
var he = {
	name: "Hebrew",
	google: "iw",
	bing: "he",
	libreTranslate: "he"
};
var hz = {
	name: "Herero"
};
var hi = {
	name: "Hindi",
	google: "hi",
	bing: "hi",
	libreTranslate: "hi"
};
var ho = {
	name: "Hiri Motu"
};
var hu = {
	name: "Hungarian",
	google: "hu",
	bing: "hu",
	libreTranslate: "hu"
};
var is = {
	name: "Icelandic",
	google: "is",
	bing: "is"
};
var io = {
	name: "Ido"
};
var ig = {
	name: "Igbo",
	google: "ig",
	bing: "ig"
};
var id = {
	name: "Indonesian",
	google: "id",
	bing: "id",
	libreTranslate: "id"
};
var ia = {
	name: "Interlingua (International Auxiliary Language Association)"
};
var ie = {
	name: "Interlingue, Occidental"
};
var iu = {
	name: "Inuktitut",
	bing: "iu"
};
var ik = {
	name: "Inupiaq"
};
var ga = {
	name: "Irish",
	google: "ga",
	bing: "ga",
	libreTranslate: "ga"
};
var it = {
	name: "Italian",
	google: "it",
	bing: "it",
	libreTranslate: "it"
};
var ja = {
	name: "Japanese",
	google: "ja",
	bing: "ja",
	libreTranslate: "ja"
};
var jv = {
	name: "Javanese",
	google: "jw"
};
var kn = {
	name: "Kannada",
	google: "kn",
	bing: "kn"
};
var kr = {
	name: "Kanuri"
};
var ks = {
	name: "Kashmiri",
	bing: "ks"
};
var kk = {
	name: "Kazakh",
	google: "kk",
	bing: "kk"
};
var km = {
	name: "Central Khmer",
	google: "km",
	bing: "km"
};
var ki = {
	name: "Kikuyu, Gikuyu"
};
var rw = {
	name: "Kinyarwanda",
	bing: "rw"
};
var ky = {
	name: "Kirghiz, Kyrgyz",
	google: "ky",
	bing: "ky"
};
var kv = {
	name: "Komi"
};
var kg = {
	name: "Kongo"
};
var ko = {
	name: "Korean",
	google: "ko",
	bing: "ko",
	libreTranslate: "ko"
};
var kj = {
	name: "Kuanyama, Kwanyama"
};
var ku = {
	name: "Kurdish",
	google: "ku",
	bing: "ku"
};
var lo = {
	name: "Lao",
	google: "lo",
	bing: "lo"
};
var la = {
	name: "Latin",
	google: "la",
	bing: "iu-Latn"
};
var lv = {
	name: "Latvian",
	google: "lv",
	bing: "lv",
	libreTranslate: "lv"
};
var li = {
	name: "Limburgan, Limburger, Limburgish"
};
var ln = {
	name: "Lingala",
	bing: "ln"
};
var lt = {
	name: "Lithuanian",
	google: "lt",
	bing: "lt",
	libreTranslate: "lt"
};
var lu = {
	name: "Luba-Katanga"
};
var lb = {
	name: "Luxembourgish, Letzeburgesch",
	google: "lb"
};
var mk = {
	name: "Macedonian",
	google: "mk",
	bing: "mk"
};
var mg = {
	name: "Malagasy",
	google: "mg",
	bing: "mg"
};
var ms = {
	name: "Malay",
	google: "ms",
	bing: "ms",
	libreTranslate: "ms"
};
var ml = {
	name: "Malayalam",
	google: "ml",
	bing: "ms",
	libreTranslate: "ms"
};
var mt = {
	name: "Maltese",
	google: "mt",
	bing: "mt"
};
var gv = {
	name: "Manx"
};
var mi = {
	name: "Maori",
	google: "mi"
};
var mr = {
	name: "Marathi",
	google: "mr",
	bing: "mr"
};
var mh = {
	name: "Marshallese"
};
var mn = {
	name: "Mongolian",
	google: "mn",
	bing: "mn-Cyrl"
};
var na = {
	name: "Nauru"
};
var nv = {
	name: "Navajo, Navaho"
};
var nd = {
	name: "North Ndebele"
};
var nr = {
	name: "South Ndebele"
};
var ng = {
	name: "Ndonga"
};
var ne = {
	name: "Nepali",
	google: "ne",
	bing: "ne"
};
var no = {
	name: "Norwegian",
	google: "no",
	bing: "nb",
	libreTranslate: "nb"
};
var nb = {
	name: "Norwegian Bokmål",
	bing: "nb",
	libreTranslate: "nb"
};
var nn = {
	name: "Norwegian Nynorsk",
	bing: "nb",
	libreTranslate: "nb"
};
var ii = {
	name: "Sichuan Yi, Nuosu"
};
var oc = {
	name: "Occitan"
};
var oj = {
	name: "Ojibwa"
};
var or = {
	name: "Oriya"
};
var om = {
	name: "Oromo"
};
var os = {
	name: "Ossetian, Ossetic"
};
var pi = {
	name: "Pali"
};
var ps = {
	name: "Pashto, Pushto",
	google: "ps",
	bing: "ps"
};
var fa = {
	name: "Persian",
	google: "fa",
	bing: "fa",
	libreTranslate: "fa"
};
var pl = {
	name: "Polish",
	google: "pl",
	bing: "pl",
	libreTranslate: "pl"
};
var pt = {
	name: "Portuguese",
	google: "pt",
	bing: "pt",
	libreTranslate: "pt"
};
var pa = {
	name: "Punjabi, Panjabi",
	google: "pa",
	bing: "pa"
};
var qu = {
	name: "Quechua"
};
var ro = {
	name: "Romanian, Moldavian, Moldovan",
	google: "ro",
	bing: "ro",
	libreTranslate: "ro"
};
var rm = {
	name: "Romansh"
};
var rn = {
	name: "Rundi",
	bing: "run"
};
var ru = {
	name: "Russian",
	google: "ru",
	bing: "ru",
	libreTranslate: "ru"
};
var se = {
	name: "Northern Sami"
};
var sm = {
	name: "Samoan",
	google: "sm",
	bing: "sm"
};
var sg = {
	name: "Sango"
};
var sa = {
	name: "Sanskrit"
};
var sc = {
	name: "Sardinian"
};
var sr = {
	name: "Serbian",
	google: "sr",
	bing: "sr-Cyrl",
	libreTranslate: "sr"
};
var sn = {
	name: "Shona",
	google: "sn",
	bing: "sn"
};
var sd = {
	name: "Sindhi",
	google: "sd",
	bing: "sd"
};
var si = {
	name: "Sinhala, Sinhalese",
	google: "si",
	bing: "si"
};
var sk = {
	name: "Slovak",
	google: "sk",
	bing: "sk",
	libreTranslate: "sk"
};
var sl = {
	name: "Slovenian",
	google: "sl",
	bing: "sl",
	libreTranslate: "sl"
};
var so = {
	name: "Somali",
	google: "so",
	bing: "so"
};
var st = {
	name: "Southern Sotho"
};
var es = {
	name: "Spanish, Castilian",
	google: "es",
	bing: "es",
	libreTranslate: "es"
};
var su = {
	name: "Sundanese",
	google: "su"
};
var sw = {
	name: "Swahili",
	google: "sw",
	bing: "sw"
};
var ss = {
	name: "Swati"
};
var sv = {
	name: "Swedish",
	google: "sv",
	bing: "sv",
	libreTranslate: "sv"
};
var tl = {
	name: "Tagalog",
	google: "tl",
	libreTranslate: "tl"
};
var ty = {
	name: "Tahitian",
	bing: "ty"
};
var tg = {
	name: "Tajik",
	google: "tg"
};
var ta = {
	name: "Tamil",
	google: "ta",
	bing: "ta"
};
var tt = {
	name: "Tatar",
	bing: "tt"
};
var te = {
	name: "Telugu",
	google: "te",
	bing: "te"
};
var th = {
	name: "Thai",
	google: "th",
	bing: "th",
	libreTranslate: "th"
};
var bo = {
	name: "Tibetan",
	bing: "bo"
};
var ti = {
	name: "Tigrinya",
	bing: "ti"
};
var to = {
	name: "Tonga (Tonga Islands)"
};
var ts = {
	name: "Tsonga"
};
var tn = {
	name: "Tswana"
};
var tr = {
	name: "Turkish",
	google: "tr",
	bing: "tr",
	libreTranslate: "tr"
};
var tk = {
	name: "Turkmen",
	bing: "tk"
};
var tw = {
	name: "Twi"
};
var ug = {
	name: "Uighur, Uyghur",
	bing: "ug"
};
var uk = {
	name: "Ukrainian",
	google: "uk",
	bing: "uk",
	libreTranslate: "uk"
};
var ur = {
	name: "Urdu",
	google: "ur",
	bing: "ur",
	libreTranslate: "ur"
};
var uz = {
	name: "Uzbek",
	google: "uz",
	bing: "uz"
};
var ve = {
	name: "Venda"
};
var vi = {
	name: "Vietnamese",
	google: "vi",
	bing: "vi",
	libreTranslate: "vi"
};
var vo = {
	name: "Volapük"
};
var wa = {
	name: "Walloon"
};
var cy = {
	name: "Welsh",
	google: "cy",
	bing: "cy"
};
var wo = {
	name: "Wolof"
};
var xh = {
	name: "Xhosa",
	google: "xh",
	bing: "xh"
};
var yi = {
	name: "Yiddish",
	google: "yi"
};
var yo = {
	name: "Yoruba",
	google: "yo",
	bing: "yo"
};
var za = {
	name: "Zhuang, Chuang"
};
var zu = {
	name: "Zulu",
	google: "zu",
	bing: "zu"
};
var allLanguagesCodes = {
	ab: ab,
	aa: aa,
	af: af,
	ak: ak,
	sq: sq,
	am: am,
	ar: ar,
	an: an,
	hy: hy,
	as: as,
	av: av,
	ae: ae,
	ay: ay,
	az: az,
	bm: bm,
	ba: ba,
	eu: eu,
	be: be,
	bn: bn,
	bi: bi,
	bs: bs,
	br: br,
	bg: bg,
	my: my,
	ca: ca,
	ch: ch,
	ce: ce,
	ny: ny,
	zh: zh,
	cu: cu,
	cv: cv,
	kw: kw,
	co: co,
	cr: cr,
	hr: hr,
	cs: cs,
	da: da,
	dv: dv,
	nl: nl,
	dz: dz,
	en: en,
	eo: eo,
	et: et,
	ee: ee,
	fo: fo,
	fj: fj,
	fi: fi,
	fr: fr,
	fy: fy,
	ff: ff,
	gd: gd,
	gl: gl,
	lg: lg,
	ka: ka,
	de: de,
	el: el,
	kl: kl,
	gn: gn,
	gu: gu,
	ht: ht,
	ha: ha,
	he: he,
	hz: hz,
	hi: hi,
	ho: ho,
	hu: hu,
	is: is,
	io: io,
	ig: ig,
	id: id,
	ia: ia,
	ie: ie,
	iu: iu,
	ik: ik,
	ga: ga,
	it: it,
	ja: ja,
	jv: jv,
	kn: kn,
	kr: kr,
	ks: ks,
	kk: kk,
	km: km,
	ki: ki,
	rw: rw,
	ky: ky,
	kv: kv,
	kg: kg,
	ko: ko,
	kj: kj,
	ku: ku,
	lo: lo,
	la: la,
	lv: lv,
	li: li,
	ln: ln,
	lt: lt,
	lu: lu,
	lb: lb,
	mk: mk,
	mg: mg,
	ms: ms,
	ml: ml,
	mt: mt,
	gv: gv,
	mi: mi,
	mr: mr,
	mh: mh,
	mn: mn,
	na: na,
	nv: nv,
	nd: nd,
	nr: nr,
	ng: ng,
	ne: ne,
	no: no,
	nb: nb,
	nn: nn,
	ii: ii,
	oc: oc,
	oj: oj,
	or: or,
	om: om,
	os: os,
	pi: pi,
	ps: ps,
	fa: fa,
	pl: pl,
	pt: pt,
	pa: pa,
	qu: qu,
	ro: ro,
	rm: rm,
	rn: rn,
	ru: ru,
	se: se,
	sm: sm,
	sg: sg,
	sa: sa,
	sc: sc,
	sr: sr,
	sn: sn,
	sd: sd,
	si: si,
	sk: sk,
	sl: sl,
	so: so,
	st: st,
	es: es,
	su: su,
	sw: sw,
	ss: ss,
	sv: sv,
	tl: tl,
	ty: ty,
	tg: tg,
	ta: ta,
	tt: tt,
	te: te,
	th: th,
	bo: bo,
	ti: ti,
	to: to,
	ts: ts,
	tn: tn,
	tr: tr,
	tk: tk,
	tw: tw,
	ug: ug,
	uk: uk,
	ur: ur,
	uz: uz,
	ve: ve,
	vi: vi,
	vo: vo,
	wa: wa,
	cy: cy,
	wo: wo,
	xh: xh,
	yi: yi,
	yo: yo,
	za: za,
	zu: zu
};

const supportedLanguages = Object.keys(
  allLanguagesCodes
).reduce((acc, language) => {
  const isLanguageSupportedByAlmostOneEngine = Object.keys(
    allLanguagesCodes[language]
  ).some((value) => validEngines.includes(value));
  if (isLanguageSupportedByAlmostOneEngine)
    acc[language] = allLanguagesCodes[language];
  return acc;
}, {});
const supportedLanguagesCodes = Object.keys(supportedLanguages);
const supportedLanguagesGroupedByEngine = Object.keys(supportedLanguages).reduce((acc, language) => {
  Object.keys(supportedLanguages[language]).forEach((engine) => {
    const languageObject = supportedLanguages[language];
    if (!acc[engine]) acc[engine] = {};
    acc[engine] = {
      ...acc[engine],
      [language]: { name: languageObject.name }
    };
  });
  return acc;
}, {});
supportedLanguagesGroupedByEngine.google;
supportedLanguagesGroupedByEngine.bing;
supportedLanguagesGroupedByEngine.libreTranslate;
const validateLanguageIsSupportedByEngine = (requestedLanguage, engine) => {
  const isLanguageSupportedByEngine = supportedLanguagesGroupedByEngine[engine][requestedLanguage] !== undefined;
  if (!isLanguageSupportedByEngine)
    throw new Error(
      `Language ${requestedLanguage} is not supported by ${engine}.`
    );
  return true;
};
const getLanguageCodeByEngine = (requestedLanguage, engine) => {
  validateLanguageIsSupportedByEngine(requestedLanguage, engine);
  return allLanguagesCodes[requestedLanguage][engine];
};
const getLanguagesCodesWithNames = (languages) => {
  return Object.entries(languages).map(([language, data]) => {
    return `${language} -> ${data?.name || "Unknown"}`;
  });
};
const validateLanguageRequested = (requestedLanguage) => {
  try {
    if (!requestedLanguage) throw new Error("No language provided");
    const isLanguageSupported = supportedLanguages[requestedLanguage] !== void 0;
    if (!isLanguageSupported)
      throw new Error(`Language ${requestedLanguage} is not supported`);
    return true;
  } catch (error) {
    throw new Error(
      `${error.message}.

Please use one of these:

${getLanguagesCodesWithNames(supportedLanguages).join("\n")}`
    );
  }
};

const DEFAULT_ENGINES = [Engines.GOOGLE, Engines.BING, Engines.LIBRE_TRANSLATE];
const getTranslationEnginesToUse = ({
  settingsTranslationEngines,
  cliArgEngine
}) => {
  const translationEnginesToUse = [];
  if (cliArgEngine) {
    translationEnginesToUse.push(cliArgEngine);
  }
  if (settingsTranslationEngines) {
    const settingsTranslationEnginesFiltered = settingsTranslationEngines.filter((engine) => engine !== cliArgEngine);
    translationEnginesToUse.push(...settingsTranslationEnginesFiltered);
  }
  if (translationEnginesToUse.length === 0) {
    translationEnginesToUse.push(...DEFAULT_ENGINES);
  }
  return translationEnginesToUse;
};

const translate = async (text, from, to, engine = Engines.GOOGLE) => {
  if (!isEngineValid(engine))
    throw new Error(
      `Invalid engine. Try with one of these: ${validEngines.join(", ")}`
    );
  if (from === to) return { text };
  return await translateEngines[engine](text, { from, to });
};
const setTranslateWithFallbackEngines = ({
  settingsTranslationEngines,
  cliArgEngine
}) => {
  const engines = getTranslationEnginesToUse({
    settingsTranslationEngines,
    cliArgEngine
  });
  const enginesFailed = [];
  const translateWithFallbackEngines = async (text, from, to) => {
    let result;
    const enginesFiltered = engines.filter(
      (engine) => !enginesFailed.includes(engine)
    );
    for await (const engine of enginesFiltered) {
      try {
        const fromLanguageCode = getLanguageCodeByEngine(from, engine);
        const toLanguageCode = getLanguageCodeByEngine(to, engine);
        await translate(text, fromLanguageCode, toLanguageCode, engine).then(({ text: text2 }) => {
          result = text2;
          console.log(
            `Translated successfully with ${engine} engine. Result: ${text2}`
          );
        }).catch(() => {
          enginesFailed.push(engine);
          throw new Error(
            `Error translating with ${engine} engine. Trying next engine...`
          );
        });
        if (result) break;
      } catch (error) {
        console.log(error.message);
      }
    }
    if (!result) {
      const enginesUsed = engines.join(", ");
      throw new Error(
        `Error translating ${text} from ${from} to ${to} using ${enginesUsed}.

Please check that requested languages is supported using the command "languages" or check your internet connection and try again.

For more info check CLI help or open an issue at https://github.com/victor-heliomar/i18n-populator/issues/new`
      );
    }
    return { text: result };
  };
  return { engines, translate: translateWithFallbackEngines };
};

const validateSettingsFile = async (settingsFilePath) => {
  const existsFile = fs.existsSync(settingsFilePath);
  if (!settingsFilePath || !existsFile)
    throw new Error(`No settings file found on file path ${settingsFilePath}`);
  const {
    languages,
    basePath,
    translationEngines: settingsTranslationEngines
  } = await import(settingsFilePath, { assert: { type: 'json' } });
  if (!languages?.length || !basePath?.length)
    throw new Error(
      "No languages or basePath found, please check your settings file"
    );
  const isValidLanguagesConfig = languages.every((language, index) => {
    if (!language.name) {
      throw new Error(`No name found for language on index ${index}`);
    }
    if (!language?.files?.length)
      throw new Error(
        `No files found for language ${language.name} on index ${index}`
      );
    return language.files.every((file) => {
      return file?.length;
    });
  });
  if (!isValidLanguagesConfig)
    throw new Error(
      "There is an invalid language config on your settings file, please check it"
    );
  if (settingsTranslationEngines?.length) {
    const isValidSettingsTranslationEngines = settingsTranslationEngines?.every(isEngineValid);
    if (!isValidSettingsTranslationEngines)
      throw new Error(
        `There is an invalid translation engine on your settings file, here are the valid ones: ${validEngines.join(", ")}`
      );
  }
  return true;
};

const getOrCreateJsonFile = async (basePath, fileName) => {
  const parsedPath = parsePath(`${basePath}/${fileName}`);
  if (fs.existsSync(parsedPath)) {
    try {
      const file2 = (await import(parsedPath, { assert: { type: 'json' } })).default;
      return { file: file2, parsedPath };
    } catch (error) {
      console.error(`Error reading file ${parsedPath}.`);
      if (error instanceof SyntaxError) {
        console.error("Syntax error in JSON file. It is probably malformed.");
        console.error(
          "It exists and is on your i18n-populator.config.js file but it is not a valid JSON file."
        );
      }
      process.exit(1);
    }
  }
  const file = {};
  const directory = basePath;
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
  fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2));
  return { file, parsedPath };
};

const confirmUserAction = async (message) => {
  const userAnswer = await prompts.confirm({ message, default: false });
  return userAnswer;
};
const promptUserInput = async (message) => {
  const userAnswer = await prompts.input({ message });
  return userAnswer;
};
const promptUserOptions = async (message, choices) => {
  const userAnswer = await prompts.select({
    message,
    choices
  });
  return userAnswer;
};

const hasProperty = (obj, path) => {
  const pathArray = Array.isArray(path) ? path : path.match(/([^[.\]])+/g);
  const objHasProperty = pathArray?.reduce((prevObj, key) => prevObj && prevObj[key], obj) !== undefined;
  return objHasProperty;
};

const validateAndPromptUserJSONFiles = async (basePath, fileNames, nameOfTranslation) => {
  const jsonFiles = await Promise.all(
    fileNames.map(async (fileName) => {
      const fileData = await getOrCreateJsonFile(basePath, fileName);
      return {
        ...fileData,
        fileName
      };
    })
  );
  const filesToEdit = [];
  for await (const { file, parsedPath, fileName } of jsonFiles) {
    let shouldOverwrite = true;
    const hasPropertyInFile = hasProperty(file, nameOfTranslation);
    if (hasPropertyInFile)
      shouldOverwrite = await confirmUserAction(
        `The property ${nameOfTranslation} already exists in ${fileName}. Do you want to overwrite it? `
      );
    if (!hasPropertyInFile || shouldOverwrite)
      filesToEdit.push({ file, parsedPath });
  }
  return filesToEdit;
};

const translateController = async ({
  text,
  from: sourceLanguage,
  name: nameOfTranslation,
  ...options
}) => {
  const settingsFilePath = parsePath(options.settingsFile);
  await validateSettingsFile(settingsFilePath);
  validateLanguageRequested(sourceLanguage);
  if (typeof text !== "string" || !text?.length)
    throw new Error("No text to translate provided");
  if (!nameOfTranslation) throw new Error("No name of translation provided");
  const {
    languages,
    basePath,
    translationEngines: settingsTranslationEngines
  } = await import(settingsFilePath, { assert: { type: 'json' } });
  if (options.engine && !isEngineValid(options.engine))
    throw new Error(
      `You've provided an invalid engine as arg on your CLI Command. Try with one of these: ${validEngines.join(", ")}`
    );
  const { translate } = setTranslateWithFallbackEngines({
    settingsTranslationEngines,
    cliArgEngine: options.engine
  });
  for await (const language of languages) {
    const filesToEdit = await validateAndPromptUserJSONFiles(
      basePath,
      language.files,
      nameOfTranslation
    );
    if (filesToEdit.length === 0) continue;
    const { text: result } = await translate(
      text,
      sourceLanguage,
      language.name
    );
    filesToEdit.forEach(({ file, parsedPath }) => {
      dset.dset(file, nameOfTranslation, result);
      fs.writeFileSync(parsedPath, JSON.stringify(file, null, 2) + "\n");
    });
  }
};

const listFilesOnDirectory = (directory) => {
  return new Promise((resolve, reject) => {
    fs.readdir(directory, (err, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(files);
    });
  });
};

const _promptTranslationEngines = async () => {
  const translationEnginesToUse = [];
  console.clear();
  console.log(
    "Will ask you for the translation engines you want to use. You will be able to change them later in the configuration file."
  );
  for await (const translationEngine of validEngines) {
    const shouldUseEngine = await confirmUserAction(
      `Do you want to use ${translationEngine} as translation engine? (y/n): `
    );
    if (shouldUseEngine) {
      translationEnginesToUse.push(translationEngine);
    }
  }
  return translationEnginesToUse;
};
const _promptBasePath = async () => {
  let confirmedAction = false;
  let pathFiles = [];
  let basePath = "";
  do {
    let hasError = false;
    basePath = await promptUserInput(
      'Base path for the translations files: e.g. "src/localizations": '
    );
    if (!basePath) {
      console.log("The base path is required.\n");
      continue;
    }
    const filesInPath = await listFilesOnDirectory(parsePath(basePath)).catch(async (err) => {
      console.error(err.message);
      console.log("\n-------------\n");
      console.log(
        "Please check that the path provided is correct and that you have the necessary permissions and try again.\n\n"
      );
      await promptUserInput("Press enter to continue...\n\n");
      console.clear();
      hasError = true;
    }) || [];
    if (hasError) continue;
    if (!filesInPath.length) {
      console.log("The path provided does not contain any files.\n\n");
      const continueWithEmptyPath = confirmUserAction(
        "Are you sure you want to use this path? (y/n): "
      );
      console.clear();
      if (!continueWithEmptyPath) continue;
    }
    pathFiles = filesInPath || [];
    console.clear();
    confirmedAction = await confirmUserAction(
      `Please confirm that the path that you want to use is: ${parsePath(
        basePath
      )} and ${filesInPath.length > 0 ? `contains the following files:
- ${pathFiles.join("\n- ")}` : "doesn't contains files"} (y/n): `
    );
  } while (!confirmedAction);
  await promptUserInput("\nPress enter to continue...");
  console.clear();
  return { basePath, pathFiles };
};
const _promptLanguages = async (filesNames) => {
  const languages = [];
  console.clear();
  console.log(
    "We'll iterate over the files in the base path and you will be able to select the language name for each file.\n"
  );
  console.log(
    "The language should be indicated in ISO 639-1 format. For example: 'English' -> 'en'. You can consult the file https://github.com/victor-heliomar/i18n-populator/blob/master/ALL-LANGUAGES-CODES.json to get all the codes or check here: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes\n"
  );
  console.log("Leave it empty if you don't want to include that file.\n");
  console.log(
    "Remember that you can change this later in the configuration file.\n\n"
  );
  await promptUserInput("Press enter to continue...\n");
  for (const fileName of filesNames) {
    if (fileName.includes(".json")) {
      let languageName;
      let isSupportedLanguage;
      do {
        languageName = await promptUserOptions(
          `
Please type the language name for the file ${fileName}: `,
          supportedLanguagesCodes
        );
        isSupportedLanguage = supportedLanguagesCodes.includes(languageName);
        if (languageName === "") break;
        if (!isSupportedLanguage) {
          console.log(
            `The language ${languageName} is not supported. Please use one of these: ${supportedLanguagesCodes.join(
              ", "
            )}. Detailed information on https://github.com/victor-heliomar/i18n-populator/blob/master/ALL-LANGUAGES-CODES.json

`
          );
          await promptUserInput("Press enter to continue...\n");
        }
      } while (!isSupportedLanguage);
      if (languageName === "") continue;
      const languageIndex = languages.findIndex(
        (language) => language.name === languageName
      );
      if (languageIndex !== -1) {
        languages[languageIndex].files.push(fileName);
        continue;
      }
      languages.push({
        name: languageName,
        files: [fileName]
      });
    }
  }
  console.log(
    "\n\nThe languages that you've selected are saved in the configuration file. You can change them later.\n\n"
  );
  await promptUserInput("Press enter to continue...\n");
  return languages;
};
const generateConfigController = async () => {
  const configPath = parsePath("/i18n-populator.config.json");
  const configExists = fs.existsSync(configPath);
  if (configExists) {
    const shouldOverwrite = confirmUserAction(
      `The configuration file already exists. Do you want to overwrite it? (y/n): `
    );
    if (!shouldOverwrite) {
      console.log("The wizard has been canceled.");
      process.exit(0);
    }
  }
  const config = {
    basePath: "",
    translationEngines: [],
    languages: []
  };
  const { basePath: userSelectedBasePath, pathFiles: filesNames } = await _promptBasePath();
  config.basePath = userSelectedBasePath;
  config.languages = await _promptLanguages(filesNames);
  config.translationEngines = await _promptTranslationEngines();
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

var version = "1.1.1";

const program = new commander.Command();
program.name("i18n-populator").description("CLI to translate JavaScript strings").version(version);
program.command("translate").description(
  "Translate a text and put the result on the files in the output directory"
).option(
  "-t, --text <string>",
  "The word or sentence that you want to translate."
).option(
  "-f, --from <string>",
  "The language of the text that you wrote on the --text option."
).option(
  "-n, --name <string>",
  "The name of the property that you want your text has on the output files."
).option(
  "-e, --engine <string>",
  `[OPTIONAL]. The engine that you want to use to translate the text. Available options: ${validEngines.join(", ")}
If you specify a engine on the command, it will put it on the first position of the array of engines.
If for any reason the engine you selected is not available at that moment, then it will use the engines that you have defined on the configuration file in the priority order that you selected.
If you don't specify any engine, the script will try to get your preferences from your configuration file, and if you don't have any configuration file, it will use by default all the translation engine that are free and doesn't need API Key.`
).option(
  "-s, --settings-file <string>",
  `[OPTIONAL]. Use this flag if you want to specify a different path for the configuration file that the default path.
    
    If you don't specify this flag, it'll search for a file called \`i18n-populator.config.json\` on the root of your project.`,
  configPath
).action(translateController);
program.command("languages").description("Show the languages supported in ISO-639-1 standard").option(
  "-e, --by-engine <string>",
  "Filter the language supported list by engine"
).action(() => {
});
program.command("init").description("Start the configuration wizard to create the settings file").action(generateConfigController);
program.parse();
