// ======================
// 전역 상태
// ======================
let playerName = "";
const SAVE_KEY = "vn_save_v1";

let dialogueBox;

const state = {
  scene: "day1_morning",
  line: 0,
  affection: 0,
  points: { sto: 0, ise: 0, tar: 0 },

  // 코스튬/설정
  outfit: "uniform", // uniform / hoodie / cute
  settings: {
    autoSave: true
  }
};

// ======================
// 스토리 데이터 (보선녀 Day1 그대로)
// ======================
const scenes = {
  day1_morning: {
    text: `{name}: 스토마쉐!, 왜이렇게 빨리 나왔어?
(스토마쉐는 손을 흔들며 미소지었다)
스토마쉐: {name}! 그냥 ㅎㅎ 할 거 없어서..
{name}: 그래? 빨리 가자.
스토마쉐: ㅎㅎ 응.
(학교에 가던 도중, 마트를 지나치려는데 스토마쉐가 제안한다.)
스토마쉐: {name}, 음료수빵 할래?
{name}: 음? 그래 ! 너 나한테 지고 후회하지 마라?
스토마쉐: 하하 그래`,
    choices: [
      { label: "가위", next: "day1_scissors", effect: { sto: +1 } },
      { label: "바위", next: "day1_rock", effect: { sto: +1 } },
      { label: "보", next: "day1_paper", effect: { sto: +1 } }
    ]
  },

  day1_scissors: {
    text: `{name}: 으앗! 내가 졌잖아!
스토마쉐: 잘먹을게 ㅎㅎ`,
    next: "mart1"
  },

  mart1: {
    text: `(마트 안)
{name}: 스토마쉐, 다음에 하면 나 겁나 비싼거 먹을거니까 각오해. ㅎㅎ
스토마쉐: ㅎㅎ그래 나는.. 이거 오꾸마리주스.
{name}: 넌 옛날부터 그 이상한 주스만 먹더라.
스토마쉐: ㅎㅎ
{name}: 나는 이거 체독랑파 마셔야지~`,
    next: "school1"
  },

  day1_rock: {
    text: `{name}: 하하! 내가 이겼지! 스토마쉐 잘먹을게?`,
    next: "mart2"
  },

  mart2: {
    text: `스토마쉐: ㅎㅎㅎㅎ응 ~ 골라
{name}: 야~ 네가 졌는데 좋아하면 이긴 기분이 안들잖아 ㅎㅎ
스토마쉐: 그치만... 네가 좋..
{name}: 뭐?
스토마쉐:하하 좋..좋같다고 ㅎㅎ
{name}: 아하!
스토마쉐: 나는 오꾸마리주스 먹어야지~
{name}: 아니 넌 왜 맨날 그런것만 먹어.
스토마쉐: ...하하 빨리 안고르면 안사준다?
{name}: 아 나도 그거 먹을래 그럼~`,
    next: "school1"
  },

  day1_paper: {
    text: `{name}: 아 뭐야~ 비겼어 다시해`,
    choices: [
      { label: "가위", next: "day1_rock", effect: { sto: +1 } },
      { label: "바위", next: "day1_paper1", effect: { sto: +2 } },
      { label: "보", next: "day1_scissors", effect: { sto: +1 } }
    ]
  },

  day1_paper1: {
    text: `{name}: 으엑? 뭐야 다시해!
스토마쉐: ㅎㅎ`,
    choices: [
      { label: "가위", next: "day1_paper2", effect: { sto: +2 } },
      { label: "바위", next: "day1_rock", effect: { sto: +1 } },
      { label: "보", next: "day1_scissors", effect: { sto: +1 } }
    ]
  },

  day1_paper2: {
    text: `{name}: ? 뭐여
스토마쉐:......(볼이 빨갛다.)운명..
{name}: 뭐..머라는거야.. 에잇! 하지마 이거 학교나 가자.
스토마쉐: 잠깐.. 그냥 내가 사줄게..
{name}:그..그럼 나야 땡큐지..!`,
    next: "mart3"
  },

  mart3: {
    text: `스토마쉐: {name}, 뭐 살거야?
{name}: 나는.. 이거..!
스토마쉐: ..나도 그걸로 해야겠다 ㅎㅎ
{name}: 그래! 가위바위보 오지게 했더니 좀 재밌었다 ㅎㅎㅋㅋ
스토마쉐:ㅎㅎ 재밌었어.. 아주머니 계산이요.
아주머니: 이거 두개?
스토마쉐: ..아! 이거 초콜릿도 하나요
아주머니: 3500원이다.
스토마쉐: {name}, 이거 먹어
{name}: 헐! 이건 뭐야? 나 당 떨어지는 건 어떻게 알고~
스토마쉐: ㅎㅎ 나잖아 척이면 척이지.`,
    next: "school1"
  },

  school1: {
    text: `스토마쉐: {name}, 학교 끝나고 봐.
{name}: 응! 수업 잘 들어~`,
    next: "day1_school"
  },

  day1_school: {
    text: `평범하게 도착한 교실은 생각보다 소란스러웠다.
전학생이 왔다는 소문 때문이었다.
{name}: 우리반에 전학생이 올 줄이야.. 그것도 고2 때..
잘생겼고, 묘하게 거리감이 느껴지는 사람이었다.
선생님: 자 다들 조용히하고 앉아
(웅성했던 반이 조용해졌다.)
선생님: 전학생 소개는 딱히 할 필요 없을 것 같으니까, 이세치슈, 저기 뒤에 {name},
옆에 앉으면 된다.
이세치슈: 네.
{name}: (심지어 내 옆..)
우연히도, 그는 {name}의 옆자리에 앉았다.
{name}: (얘 냄샌가? 향이 좋다 헤헤...)`,
    choices: [
      { label: "한 번 인사한다", next: "hi1", effect: { ise: +1 } },
      { label: "향이 좋다고 한다.", next: "scent1", effect: { ise: +1 } }
    ]
  },

  hi1: {
    text: `{name}: 아.. 안녕? 이세치슈라고 했지? 나는.. {name}이라고 해.
(싱긋) 잘 부탁해~
이세치슈: ....응. 그래
{name}: (아니 뭐야? 이게..끝? 뻘쭘하네..)
{name}: ..하하..하.. 잘 지내자.
이세치슈: ....(말없이 앞을 본다.)
{name}: (.......망한듯.)`,
    next: "day1_class"
  },

  scent1: {
    text: `{name}: (조심스럽게)컹컹 킁킁
이세치슈: ??? 뭐해?
{name}: 그... 너 향수 써? 향 되게 좋다.
이세치슈: ...향?
(잠깐 멈칫하더니 시선을 피한다.)
이세치슈: 그냥... 비누냄새야.
{name}: (헉 귀여운데?)아..그래?
이세치슈:.. 좀 부담스럽다.
{name}: (흠칫)아.. 아..그 미..미안..하하
이세치슈:...응`,
    next: "day1_class"
  },

  day1_class: {
    text: `어색한 기류가 지속되고, {name}은 분위기를 풀려 애썼지만 좀처럼
풀리지가 않았다.
수업 도중, {name}는 이세치슈의 책상을 흘끔 보았다.
연필이 없어 보였다.

연필을 하나 건네려 하자,
그는 표정을 굳힌 채 {name}을/를 돌아보며 말했다.

"이미 있어."`,
    choices: [
      { label: "아무 일 아닌 척 넘긴다", next: "class3", effect: { ise: 0 } },
      { label: "괜히 민망해진다", next: "class4", effect: { ise: -1 } }
    ]
  },

  class3: {
    text: `{name}:순간 당황했지만 바로 그를 바라보았다.
뭐래? 그냥 나는 기지개 한 것 뿐인데, 착각도 유분수지..!!
이세치슈: ...! 아..그래? ..미안.
{name}: 미안할 것 까지야..
(분위기가 더 어색해졌다.)
{name}: (..나 뭐하냐)`,
    next: "day1_store"
  },

  class4: {
    text: `{name}: 아.. 그..그래? 아..
(고개를 돌린다. 얼굴과 엉덩이가 빨개진 느낌이다)
이세치슈: ..({name}을 보며) 마음만 받을게.
{name}: 어..어..
(분위기는 더 어색해졌다.)`,
    next: "day1_store"
  },

  day1_store: {
    text: `종이쳤다.
기분 전환을 위해 매점에 들렀지만,
카드가 없는 걸 눈치챘다. 이미 계산대 앞이라서
우물쭈물 하고있었는데..
매점이모: 학생 계산안할거야?
{name}: 아..그. ...네..
???: 잠깐 이모, 이 애 것도 같이 계산이요~
매점이모: 그려. 5400원.
어떤 선배가 아무 말 없이 음료수를 대신 계산해주었다.
{name}: 어..저기..!`,
    choices: [
      { label: "고맙다고 90도 인사를 3번 하며 인사한다", next: "ff", effect: { tar: +1 } },
      { label: "어색하게 고개만 숙인다", next: "ff1", effect: { tar: 0 } }
    ]
  },

  ff: {
    text: `???: 풉 ㅋ 그래
???: (생글거리며) 됐어.~ 나중에 갚어~ㅋ
사라진 선배.
{name}: 아니.. 이름도 안 알려주셨으면서
..헤헤.. 근데 좀 잘생겼따...

생글거리는 미소.
이름은 묻지 못했지만,
기억 속에 '착한 선배'로 남았다.`,
    next: "schoollife"
  },

  ff1: {
    text: `???: 그래~ 됐어 나중에 갚어 ㅎㅎ
{name}: ...저 선..! 사라졌다....
{name}: 아니 이름도.. 안 알려주셨으면서..
..잘생겼다..헤..`,
    next: "schoollife"
  },

  schoollife: {
    text: `남은 수업 시간동안 이세치슈의 잘생긴 외모때문에
그를 흘끔 보긴 했지만, 별 대화는 없었다. 
그렇게 학교가 끝나고, {name}은 곧장 반에서 뛰쳐나가 스토마쉐에게 향했다.
{name}: 스토마쉐~ 가자!! 떡볶이 먹어야해!
스토마쉐: 알았어.ㅎㅎ 가자!
스토마쉐와 복도를 걷는데 사물함 쪽에서 이세치슈를 보았다. 자연스레 눈길이 그쪽으로
향했는데 그 옆에는..`,
    next: "samul"
  },

  samul: {
    text: `아라랑궁: 이세치슈~ 학교 끝나고 어디가? 나랑 노래방이나 갈래? 아니면..
이세치슈: 아니. 오늘 바로 가봐야해서. 
아라랑궁: ...그래? ...그럼~ 연락처라도 줘! 연락하게.
이세치슈:..... 여기.
이세치슈와 아라랑궁의 대화를 본 {name},보면 안될 걸 본 기분에 바로 고개를 돌렸다.
아라랑궁: ? 뭐야 쟨.. ㅎㅎ 아무튼 이세치슈 낼 봐~
이세치슈:..응`,
    next: "schoollife1"
  },

  schoollife1: {
    text: `{name}: 스토마쉐~ 빨..빨리가자.
스토마쉐: 응? 어..어 왜? 아는애야?
{name}: 그런건 아니고.. 아 몰라 빨리가자~`,
    next: "day1_after"
  },

  day1_after: {
    text: `하교 후, 
스토마쉐: 아줌마 떡볶이3인분, 순대2인분, 오뎅 5개만요~
똥뽂이 아줌마: 사람이냐 니들이.
스토마쉐와 함께 떡볶이를 먹었다.
스토마쉐는 말없이 휴지를 꺼내
{name}의 입가를 닦아주었다.
{name}: 앙 부끄럽게 하하하 고마웡~
스토마쉐: 묻히고 먹냐 애야? 
{name}: 스토마쉐, 오늘 우리반에 전학생 온거 알아?
스토마쉐: 어 들었어. 남자애라며, 잘생겼다던데 넌 어때?
{name}: 인정, 잘생기긴 함. 겁나
스토마쉐:..그래?
{name}: 근데 좀 무서워. ㄷㄷ 약간 말을 못걸겠어.
스토마쉐: 말을..
{name}: 꺅! 그건 그렇고 스토마쉐 몇시야? 아 버스 놓치면 망하는데
스토마쉐: ..응? 헐! 2분남았는데? 
(짐을 싸며)
{name}: 스토마쉐...! 나 먼저 간다!!!
스토마쉐: 응? 어..어!`,
    next: "bus_station"
  },

  bus_station: {
    text: `달리는 {name}, 
{name}: 헉헉..! 꺅!!! 미친.. 안돼!! 잠시만요
!!!920번 버스를 눈앞에서 놓쳤다.

(버스 정류장에서 무릎을 꿇은채 좌절한다.)

지나가는 버스 안,
이세치슈의 모습이 스쳐 보였다.
(눈이 마주친 둘)

{name}: 뭐야.. 얘도 나랑 같은 버스를 타는 걸까?`,
    next: "day1_end"
  },

  day1_end: {
    text: `집으로 돌아오는 길,
{name}는 문득 생각했다.

이 사소한 하루가,
앞으로의 관계에 어떤 의미를 갖게 될지.

── Day 1 종료 ──`,
    choices: [{ label: "Day 2로", next: "day2_start" }]
  },

  day2_start: {
    text: `다음 날이 밝았다.

(임시)`,
    choices: [{ label: "Day 1로 돌아가기(테스트)", next: "day1_morning", reset: true }]
  }
};

// ======================
// VN 스크립트 파서
// ======================
function parseScript(rawText) {
  const lines = (rawText || "")
    .split("\n")
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const script = [];
  for (const line of lines) {
    if (line.startsWith("(") && line.endsWith(")")) {
      script.push({ type: "narration", text: line });
      continue;
    }
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0 && colonIdx < 15) {
      const speaker = line.slice(0, colonIdx).trim();
      const text = line.slice(colonIdx + 1).trim();
      if (speaker && text) {
        script.push({ type: "dialogue", speaker, text });
        continue;
      }
    }
    script.push({ type: "narration", text: line });
  }
  return script;
}

function getScene(id) {
  return scenes[id];
}

function getSceneScript(sceneId) {
  const scene = getScene(sceneId);
  if (!scene) return [{ type: "narration", text: `씬을 찾을 수 없어: ${sceneId}` }];
  if (!scene.__scriptCache) scene.__scriptCache = parseScript(scene.text);
  return scene.__scriptCache;
}

// ======================
// 토스트 + 스냅샷
// ======================
function getPointsSnapshot() {
  return {
    sto: state.points.sto ?? 0,
    ise: state.points.ise ?? 0,
    tar: state.points.tar ?? 0
  };
}

function showToast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;

  el.textContent = msg;
  el.classList.remove("show");
  void el.offsetWidth;
  el.classList.add("show");

  clearTimeout(showToast.__t);
  showToast.__t = setTimeout(() => el.classList.remove("show"), 1300);
}

// ======================
// 효과
// ======================
function applyEffect(effect) {
  if (!effect) return;

  if (typeof effect === "number") {
    state.affection += effect;
    return;
  }

  if (typeof effect === "object") {
    for (const [key, val] of Object.entries(effect)) {
      if (typeof val !== "number") continue;
      if (!(key in state.points)) state.points[key] = 0;
      state.points[key] += val;
    }
  }
}

// ======================
// 렌더/진행
// ======================
function render(textEl, namePlateEl, choicesEl) {
  const scene = getScene(state.scene);
  const script = getSceneScript(state.scene);

  if (state.line < 0) state.line = 0;
  if (state.line >= script.length) state.line = script.length - 1;

  const cur = script[state.line] || { type: "narration", text: "" };
  const rep = (s) => (s || "").replaceAll("{name}", playerName);

  // 스타일 토글
  if (dialogueBox) {
    dialogueBox.classList.toggle("isDialogue", cur.type === "dialogue");
    dialogueBox.classList.toggle("isNarration", cur.type !== "dialogue");
  }

  choicesEl.innerHTML = "";

  if (cur.type === "dialogue") {
    namePlateEl.style.display = "inline-block";
    namePlateEl.textContent = rep(cur.speaker);
    textEl.textContent = rep(cur.text);
  } else {
    namePlateEl.style.display = "none";
    textEl.textContent = rep(cur.text);
  }

  const isLastLine = state.line >= script.length - 1;
  if (!isLastLine) {
    if (state.settings.autoSave) saveGame();
    return;
  }

  // 마지막 줄이면 선택지 표시
  if (Array.isArray(scene?.choices) && scene.choices.length > 0) {
    for (const choice of scene.choices) {
      const btn = document.createElement("button");
      btn.className = "choiceBtn";
      btn.textContent = choice.label;

      btn.addEventListener("click", () => {
        const before = getPointsSnapshot();
        applyEffect(choice.effect);
        const after = getPointsSnapshot();

        const dSto = after.sto - before.sto;
        const dIse = after.ise - before.ise;
        const dTar = after.tar - before.tar;

        const msgs = [];
        if (dSto) msgs.push(`스토마쉐 ${dSto > 0 ? `+${dSto}` : `${dSto}`}`);
        if (dIse) msgs.push(`이세치슈 ${dIse > 0 ? `+${dIse}` : `${dIse}`}`);
        if (dTar) msgs.push(`선배 ${dTar > 0 ? `+${dTar}` : `${dTar}`}`);
        if (msgs.length) showToast(`호감도 변동: ${msgs.join(" / ")}`);

        if (choice.reset) {
          state.affection = 0;
          state.points = { sto: 0, ise: 0, tar: 0 };
          showToast("호감도 초기화!");
        }

        if (!choice.next || !getScene(choice.next)) {
          alert(`다음 씬이 없거나 오타야: "${choice.next}"`);
          return;
        }

        state.scene = choice.next;
        state.line = 0;

        if (state.settings.autoSave) saveGame();
        render(textEl, namePlateEl, choicesEl);
      });

      choicesEl.appendChild(btn);
    }

    if (state.settings.autoSave) saveGame();
    return;
  }

  if (state.settings.autoSave) saveGame();
}

function advance(textEl, namePlateEl, choicesEl) {
  const scene = getScene(state.scene);
  const script = getSceneScript(state.scene);

  if (state.line < script.length - 1) {
    state.line += 1;
    if (state.settings.autoSave) saveGame();
    render(textEl, namePlateEl, choicesEl);
    return;
  }

  if (Array.isArray(scene?.choices) && scene.choices.length > 0) return;

  if (scene?.next) {
    if (!getScene(scene.next)) {
      alert(`다음 씬이 없거나 오타야: "${scene.next}"`);
      return;
    }
    state.scene = scene.next;
    state.line = 0;
    if (state.settings.autoSave) saveGame();
    render(textEl, namePlateEl, choicesEl);
    return;
  }

  alert("끝! (다음 씬/선택지를 추가해줘)");
}

// ======================
// 세이브/로드
// ======================
function saveGame() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({ playerName, state }));
  } catch (e) {
    console.warn("save failed", e);
  }
}

function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);

    const name = String(data.playerName || "").trim();
    if (!name) return false;
    playerName = name;

    const s = data.state || {};
    state.scene = s.scene || "day1_morning";
    state.line = Number.isFinite(s.line) ? s.line : 0;
    state.affection = Number.isFinite(s.affection) ? s.affection : 0;
    state.points = (s.points && typeof s.points === "object") ? s.points : { sto: 0, ise: 0, tar: 0 };
    state.outfit = s.outfit || "uniform";
    state.settings = s.settings || { autoSave: true };

    return true;
  } catch (e) {
    console.warn("load failed", e);
    return false;
  }
}

function hasValidSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    return !!String(data.playerName || "").trim();
  } catch {
    return false;
  }
}

// ======================
// 모달 시스템
// ======================
function openModal(title, bodyBuilder) {
  const overlay = document.getElementById("modalOverlay");
  const t = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");
  t.textContent = title;
  body.innerHTML = "";
  bodyBuilder(body);
  overlay.classList.remove("hidden");
}
function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}
function makeBtn(label, onClick, className = "btn") {
  const b = document.createElement("button");
  b.className = className;
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}

// ======================
// 상태창
// ======================
function refreshStatusPanel() {
  document.getElementById("stoStatus").textContent = String(state.points.sto ?? 0);
  document.getElementById("iseStatus").textContent = String(state.points.ise ?? 0);
  document.getElementById("tarStatus").textContent = String(state.points.tar ?? 0);
  document.getElementById("outfitLabel").textContent = String(state.outfit);
  document.getElementById("autosaveLabel").textContent = state.settings.autoSave ? "ON" : "OFF";
}
function openStatus() {
  refreshStatusPanel();
  document.getElementById("statusOverlay").classList.remove("hidden");
}
function closeStatus() {
  document.getElementById("statusOverlay").classList.add("hidden");
}

// ======================
// DOM 연결
// ======================
window.addEventListener("DOMContentLoaded", () => {
  const titleScreen = document.getElementById("titleScreen");
  const nameScreen  = document.getElementById("nameScreen");
  const gameScreen  = document.getElementById("gameScreen");

  const goStart = document.getElementById("goStart");
  const goContinue = document.getElementById("goContinue");
  const goIntro = document.getElementById("goIntro");
  const goChars = document.getElementById("goChars");
  const goWardrobe = document.getElementById("goWardrobe");
  const goSettings = document.getElementById("goSettings");

  const nameInput = document.getElementById("nameInput");
  const startBtn = document.getElementById("startBtn");
  const backToTitle1 = document.getElementById("backToTitle1");

  const textEl = document.getElementById("text");
  const choicesEl = document.getElementById("choices");
  dialogueBox = document.getElementById("dialogueBox");
  const namePlate = document.getElementById("namePlate");

  const menuBtn = document.getElementById("menuBtn");
  const statusBtn = document.getElementById("statusBtn");
  const saveBtn = document.getElementById("saveBtn");
  const loadBtn = document.getElementById("loadBtn");
  const resetBtn = document.getElementById("resetBtn");

  const closeStatusBtn = document.getElementById("closeStatusBtn");
  const closeStatusBtn2 = document.getElementById("closeStatusBtn2");

  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalOkBtn = document.getElementById("modalOkBtn");

  // 이어하기 버튼 활성/비활성
  goContinue.disabled = !hasValidSave();
  goContinue.style.opacity = goContinue.disabled ? ".55" : "1";

  function showTitle() {
    titleScreen.classList.remove("hidden");
    nameScreen.classList.add("hidden");
    gameScreen.classList.add("hidden");
  }
  function showName() {
    titleScreen.classList.add("hidden");
    nameScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
  }
  function showGame() {
    titleScreen.classList.add("hidden");
    nameScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
  }

  // 모달 닫기
  closeModalBtn.addEventListener("click", closeModal);
  modalOkBtn.addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });

  // 상태창 닫기
  closeStatusBtn.addEventListener("click", closeStatus);
  closeStatusBtn2.addEventListener("click", closeStatus);
  document.getElementById("statusOverlay").addEventListener("click", (e) => {
    if (e.target.id === "statusOverlay") closeStatus();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeModal(); closeStatus(); }
  });

  // 타이틀: 새로 시작 → 이름 화면
  goStart.addEventListener("click", () => showName());

  // 타이틀: 이어하기 → 바로 게임
  goContinue.addEventListener("click", () => {
    const ok = loadGame();
    if (!ok) return alert("저장 데이터가 없어!");
    showGame();
    render(textEl, namePlate, choicesEl);
  });

  // 타이틀: 게임 소개
  goIntro.addEventListener("click", () => {
    openModal("게임 소개", (body) => {
      const p = document.createElement("div");
      p.className = "modalText";
      p.textContent =
        "목표: 보선녀 VN을 ‘진짜 게임’처럼 완성해서 플레이스토어에 올리기!\n\n" +
        "Day 1에서 시작해 스토마쉐/이세치슈/선배와의 관계를 선택으로 바꾸며 엔딩을 만든다.\n" +
        "옷장/설정/상태창 같은 ‘메뉴 시스템’을 갖춘 미연시로 개발 중!";
      body.appendChild(p);
    });
  });

  // 타이틀: 캐릭터
  goChars.addEventListener("click", () => {
    openModal("캐릭터 소개", (body) => {
      const p = document.createElement("div");
      p.className = "modalText";
      p.textContent =
        "스토마쉐: 어릴 때부터 같이 다닌 친구. 다정한데 가끔 폭주.\n\n" +
        "이세치슈: 전학생. 거리감 있고 차가운데 은근 반응이 귀여움.\n\n" +
        "선배: 매점에서 결제해준 미스터리 선배. 기억 속 ‘착한 선배’로 남음.";
      body.appendChild(p);
    });
  });

  // 타이틀: 옷장 (호감도 변화)
  goWardrobe.addEventListener("click", () => {
    openModal("옷장", (body) => {
      const info = document.createElement("div");
      info.className = "modalText";
      info.textContent =
        `옷을 고르면 누군가는 좋아하고 누군가는 싫어함 ㅎㅎ\n현재 착장: ${state.outfit}\n\n` +
        "※ 시작 전에 골라도 저장됨!";
      body.appendChild(info);

      const row = document.createElement("div");
      row.className = "row";

      row.appendChild(makeBtn("교복", () => {
        state.outfit = "uniform";
        applyEffect({ ise: +1 });
        showToast("교복 선택! 이세치슈 +1");
        if (state.settings.autoSave) saveGame();
        closeModal();
      }, "btn small"));

      row.appendChild(makeBtn("후드티", () => {
        state.outfit = "hoodie";
        applyEffect({ sto: +1, ise: -1 });
        showToast("후드티 선택! 스토마쉐 +1 / 이세치슈 -1");
        if (state.settings.autoSave) saveGame();
        closeModal();
      }, "btn small"));

      row.appendChild(makeBtn("큐티룩", () => {
        state.outfit = "cute";
        applyEffect({ sto: +1, tar: +1 });
        showToast("큐티룩 선택! 스토마쉐 +1 / 선배 +1");
        if (state.settings.autoSave) saveGame();
        closeModal();
      }, "btn small primary"));

      body.appendChild(row);
    });
  });

  // 타이틀: 설정
  goSettings.addEventListener("click", () => {
    openModal("설정", (body) => {
      const p = document.createElement("div");
      p.className = "modalText";
      p.textContent = `자동저장: ${state.settings.autoSave ? "ON" : "OFF"}`;
      body.appendChild(p);

      const row = document.createElement("div");
      row.className = "row";

      row.appendChild(makeBtn("자동저장 토글", () => {
        state.settings.autoSave = !state.settings.autoSave;
        showToast(`자동저장 ${state.settings.autoSave ? "ON" : "OFF"}`);
        if (state.settings.autoSave) saveGame();
        closeModal();
      }, "btn small primary"));

      body.appendChild(row);
    });
  });

  // 이름 화면: 뒤로
  backToTitle1.addEventListener("click", () => showTitle());

  // 이름 화면: 시작
  startBtn.addEventListener("click", () => {
    const input = nameInput.value.trim();
    if (!input) return alert("이름을 입력해줘!");
    playerName = input;

    // 새로 시작 = 점수/진행만 초기화 (옷/설정은 유지 가능)
    state.scene = "day1_morning";
    state.line = 0;
    state.affection = 0;
    state.points = { sto: 0, ise: 0, tar: 0 };

    saveGame();
    showGame();
    render(textEl, namePlate, choicesEl);

    // 이어하기 버튼 갱신
    goContinue.disabled = !hasValidSave();
    goContinue.style.opacity = goContinue.disabled ? ".55" : "1";
  });

  // 게임 진행(대사창 클릭)
  dialogueBox.addEventListener("click", () => {
    if (choicesEl.childElementCount > 0) return;
    advance(textEl, namePlate, choicesEl);
  });

  // 게임 메뉴 버튼
  menuBtn.addEventListener("click", () => {
    openModal("메뉴", (body) => {
      const row = document.createElement("div");
      row.className = "row";

      row.appendChild(makeBtn("게임 소개", () => { closeModal(); goIntro.click(); }, "btn small"));
      row.appendChild(makeBtn("캐릭터", () => { closeModal(); goChars.click(); }, "btn small"));
      row.appendChild(makeBtn("옷장", () => { closeModal(); goWardrobe.click(); }, "btn small"));
      row.appendChild(makeBtn("설정", () => { closeModal(); goSettings.click(); }, "btn small"));
      row.appendChild(makeBtn("타이틀로", () => {
        closeModal();
        showTitle();
      }, "btn small danger"));

      body.appendChild(row);
    });
  });

  // 상태창
  statusBtn.addEventListener("click", openStatus);

  // 저장/불러오기/리셋
  saveBtn.addEventListener("click", () => {
    saveGame();
    alert("저장 완료!");
    goContinue.disabled = !hasValidSave();
    goContinue.style.opacity = goContinue.disabled ? ".55" : "1";
  });

  loadBtn.addEventListener("click", () => {
    const ok = loadGame();
    if (!ok) return alert("저장 데이터가 없어!");
    render(textEl, namePlate, choicesEl);
    alert("불러오기 완료!");
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("진짜 처음부터 할래? 저장도 삭제돼!")) return;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  });

  // 처음 화면 표시
  showTitle();
});
