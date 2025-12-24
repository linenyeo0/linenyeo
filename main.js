// ======================
// 보선녀 VN main.js (HTML 맞춤 풀버전 - 안정판 FIX)
// ======================

// ----------------------
// 전역 상태
// ----------------------
let playerName = "";
const SAVE_KEY = "vn_save_v2"; // 충돌 방지

let dialogueBox = null;
let leftSprite = null;
let rightSprite = null;

const state = {
  scene: "day1_morning",
  line: 0,
  affection: 0,
  points: { sto: 0, ise: 0, tar: 0 },

  outfit: "uniform", // uniform / hoodie / cute
  settings: {
    autoSave: true
  }
};

// ----------------------
// 스토리 데이터 (씬 구조 FIX)
// ----------------------
const scenes = {
  day1_morning: {
    text: `{name}: 햇살이 나의 body를 감싸는 아침 7시55분, 하하~ 오늘따라 기분이 너무 좋다. 헤헤
{name}은/는소꿉친구 스토마쉐와 함께 항상 등교했다. 오늘따라 일찍 학교에 가고싶던 {name}은/는 5분일찍 스토마쉐에게로 향했다.
{name}: 어! 스토마쉐!, 뭐야! 왜이렇게 빨리 나왔어?
스토마쉐는 손을 흔들며 미소지었다.
스토마쉐: {name}! 그냥 ㅎㅎ 할 거 없어서.
{name}: 그래? 빨리 가자.
스토마쉐: ㅎㅎ 응.
(학교에 가던 도중, 마트를 지나치려는데 스토마쉐가 {name}을/를 톡톡 건든다.)
스토마쉐: {name}, 목마른데, 음료수빵 할래?
{name}: 음? 그래 ! 너 나한테 지고 후회하지 마라?
스토마쉐: 그래ㅎㅎ.`,
    choices: [
      { label: "가위!", next: "day1_scissors", effect: { sto: +1 } },
      { label: "바위!", next: "day1_rock", effect: { sto: +1 } },
      { label: "보!", next: "day1_paper", effect: { sto: +3 } }
    ]
  },

  day1_scissors: {
    text: `{name}: 으앗! 내가 졌잖아!
스토마쉐: 잘먹을게, {name} ㅎㅎ`,
    next: "mart1"
  },

  mart1: {
    text: `토디보따 마트에 도착한 스토마쉐와 {name}.
{name}: 스토마쉐, 다음에 하면 나 겁나 비싼거 먹을거니까 각오해. ㅎㅎ
스토마쉐: ㅎㅎ그래 나는.. 이거 오꾸마리주스.
{name}: 넌 옛날부터 그 이상한 주스만 먹더라.
스토마쉐: ㅎㅎ
{name}: 나는 이거 체독랑파 마셔야지~`,
    next: "school1"
  },

  day1_rock: {
    text: `{name}: 하하! 내가 이겼지롱! 스토마쉐 잘먹을게?
스토마쉐: ㅎㅎㅎ응`,
    next: "mart2"
  },

  mart2: {
    text: `토디보따 마트에 도착한 {name} 그리고 스토마쉐.
{name}: 야~ 네가 졌는데 좋아하면 이긴 기분이 안들잖아 ㅎㅎ
스토마쉐: 그치만... 네가 좋..
{name}: 뭐?
스토마쉐: 하하 좋..좋같다고 ㅎㅎ
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
    text: `{name}: 으엑? 뭐야. 또 비겼잖아..! 다시해!
스토마쉐: ㅎㅎ`,
    choices: [
      { label: "가위", next: "day1_paper2", effect: { sto: +2 } },
      { label: "바위", next: "day1_rock", effect: { sto: +1 } },
      { label: "보", next: "day1_scissors", effect: { sto: +1 } }
    ]
  },

  day1_paper2: {
    text: `{name}: ? 어..! 뭐야!! 또 비겼...
스토마쉐: ....
볼이 빨간 고추잠자리 처럼 물든 스토마쉐, 얼굴을 가리며 중얼거렸다.
스토마쉐: ...운명..
{name}: 뭐..머라는거야.. 에잇! 하지마 이거. 학교나 가자.
스토마쉐: 잠깐.. 그냥 내가 사줄게..
{name}: 그..그럼 나야 땡큐지..!`,
    next: "mart3"
  },

  mart3: {
    text: `마트에 도착한 두 사람.
스토마쉐: {name}, 뭐 살거야?
{name}: 나는.. 이거..! 게복파쭈털
스토마쉐: ..나도 그걸로 해야겠다 ㅎㅎ
{name}: 그래! 와 근데 이렇게 겹칠수가 있냐? 좀 재밌었다 ㅎㅎㅋㅋ
스토마쉐: ㅎㅎ 재밌었어.. 아주머니 계산이요.
아주머니: 이거 두개?
스토마쉐: ..아! 이거 초콜릿도 하나요
아주머니: 3500원이다.
스토마쉐: {name}, 이거 먹어.
{name}: 헐! 이건 뭐야? 나 당 떨어지는 건 어떻게 알고~
스토마쉐: ㅎㅎ 나잖아 척이면 척이지.`,
    next: "school1"
  },

  school1: {
    text: `{name}: 캬~ 잘 마셨다. 역시 딱 타이밍이 맞다니까?
    학교 앞에 도착한 둘은 손을 흔들며 인사한다.
    스토마쉐: {name}, 학교 끝나고 봐.
{name}: 응! 너도 수업 잘 들어~
스토마쉐는 {name}이/가 사라질 때 까지 {name}을/를 쳐다보았다.
스토마쉐: ..잘가.`,
    next: "day1_school"
  },

  day1_school: {
    text: `평범하게 도착한 교실은 생각보다 소란스러웠다.
전학생이 왔다는 소문 때문이었다.
{name}: 우리반에 전학생이 올 줄이야.. 그것도 고2 때..
드르륵 하는 소리가 들리며 선생님과 한 남학생이 들어왔다. 
너무 멀어서 잘 보이진 않았지만 참 아리따운 얼굴을 가지고 있었던 것 같다. 옆 분단의 남미새 '멍나쭈'가 그를 보고 코피를 흘렸기 때문이다.
하지만 묘하게.. 거리감이 느껴지는 사람이었다.
선생님: 자 다들 조용히하고 앉아.
겨투독추: 다 조용한데요.
선생님: 깔루.
선생님: 고2 때 무슨 전학생이 오는지는 모르겠다. 전학생 소개는 딱히 필요 없을 것 같으니까, 흠 그래.
선생님: '이세치슈', 저기 뒤에 {name} 옆에 앉으면 된다.
이세치슈: 네.
{name}: (음? 어?! 내 옆..? 저렇게 잘생긴 애가 내 옆이라니.. 이게 무슨 드라마 같은.. 헤헤.. 조으다..)
{name}은/는 헤벌레한 표정으로 이세치슈를 바라보며 손을 흔들었다.
{name}: (근데 이름 왜저래.)
우연히도, 그는 {name}의 옆자리에 앉았다. 순간 그가 자리에 앉자마자, 그의 곁에서 매실향과, 옥동자 아이스크림 향이 나는 듯했다.
본능적으로 {name}은/는 조용히 냄새를 맡고 있는데 운명적으로 그 때, 이세치슈가 {name}쪽으로 고개를 돌렸다.
{name}: (얘 냄샌가? 향이 좋..)..!!!!
이세치슈: ...? 할 말 있어?`,
    choices: [
      { label: "한 번 인사한다", next: "hi1", effect: { ise: +0.3 } },
      { label: "향이 좋다고 한다.", next: "scent1", effect: { ise: +1 } }
    ]
  },

  hi1: {
    text: `{name}: ..! 이세치슈라고 했지? 나는 {name}라고/이라고 해. 앞으로 잘 부탁해..!
이세치슈: ....응. 그래
이세치슈는 한 번 {name}을/를 힐끔 보더니 고개를 다시 돌렸다.
{name}: (아니 뭐야? 이게..끝? 뻘쭘하네..)
{name}: ..하하..하.. 잘 지내자.
이세치슈: ...
이세치슈는 아무 말 없이 앞만 바라보았다.
{name}: (.......망한듯.)`,
    next: "day1_class"
  },

  scent1: {
    text: `{name}: (조심스럽게) 컹컹컹 킁킁
이세치슈: ??? 뭐해?
{name}: 그... 너 향수 써? 향 되게 좋다.
이세치슈: ...향?
이세치슈는 그 말에 멈칫하다가, 고개를 다시 돌렸다.
이세치슈: 그냥... 비누냄새야. 
{name}: (헉 귀여운데?)아..그래?
이세치슈:.. 또 할 말 있어? 부담스럽네.
{name}: (흠칫)아.. 아..그 미..미안..하하
이세치슈는 조용히 창문을 바라보았다.
이세치슈: ...(세릴라..)`,
    next: "day1_class"
  },

  day1_class: {
    text: `어색한 기류가 지속되고, {name}은/는 분위기를 풀려 애썼지만 좀처럼 풀리지가 않았다.
수업 도중, {name}은/는 이세치슈의 책상을 흘끔 보았다.
연필이 없어 보였다.

연필을 하나 건네려 하자,
그는 표정을 굳힌 채 {name}을/를 돌아보며 말했다.

"이미 있어."`,
    choices: [
      { label: "아무 일 아닌 척 넘긴다", next: "class3", effect: { ise: +1 } },
      { label: "괜히 민망해진다", next: "class4", effect: { ise: -1 } }
    ]
  },

  class3: {
    text: `{name}: 순간 당황했지만 바로 그를 바라보았다.
뭐래? 그냥 나는 기지개 한 것 뿐인데, 착각도 지리네?
이세치슈: ...! 아..그래? ..미안.
{name}: 미안할 것 까지야..
분위기가 더 어색해진 것 같다.
{name}: (..나 뭐하냐)`,
    next: "day1_store"
  },

  class4: {
    text: `{name}: 아.. 그..그래? 아..
{name}은/는 부끄러움에 고개를 돌렸다. 얼굴이 빨개진 느낌이다.
이세치슈는 {name}을/를 바라보았다.
이세치슈: ..마음만 받을게.
{name}: 어..어..
분위기는 더 어색해졌다.`,
    next: "day1_store"
  },

  // ✅ day1_store는 “매점 선택”만 담당 (여기서 dd1/dd2/dd3로 이동)
  day1_store: {
    text: `딩동댕동, 수업이 끝나는 종이쳤다.
{name}은 기분전환을 위해 매점에 들렀다.
{name}: 하... 뭐 사지. 우울해ㅠ..`,
    choices: [
      {
        label: "빅버키매치스를 산다. (버섯의 발톱 + 세리피앙씨 수염맛)",
        next: "dd1",
        effect: { tar: +2 }
      },
      {
        label: "이송라지때를 산다. (김장철 비단뱀의 비단 + 다람쥐 코털 향 34%)",
        next: "dd2",
        effect: { tar: +1 }
      },
      {
        label: "게랑도루민쭈크를 산다. (담임의 특제 발냄새 고급진 맛)",
        next: "dd3",
        effect: { tar: +1 }
      }
    ]
  },

  // ✅ dd1/dd2/dd3 씬을 “최상위”에 따로 정의 (이게 핵심 FIX)
  dd1: {
    text: `{name}: ㅠ 그래... 세리피앙씨 수염맛이나 맛봐야지. ㅠ 아주머니 계산이요.
매점이모: 그래. 5000원이다. 
{name}: 네ㅠ 여기..
주머니에 손을 넣어 지갑을 꺼내려는데, 손에 아무것도 집히지가 않았다.
{name}: 에? 응? 아??!?! 헉..!!
{name}는/은 지갑을 반에 놔두고 온 것이었다.
{name}: ㅎㅎ..ㅎㅎ
매점이모: ? 뭐하냐
{name}는/은 미인계를 쓰기로 결심했다.
{name}: 아.. 이모 외..외상 안될까...요..?
매점이모: 개가 짖는구나.
{name}: 안돼..!!!!!!!!!!
{name}는/은 머리를 쥐어잡으며 좌절한다. 하지만 그 때...`,
    next: "baekdor1"
  },

  dd2: {
    text: `{name}: 하... 그래... 이송라지때나 사볼까. 아주머니 계산이요.
매점이모: 4700원.
{name}: 네.. 여기...
주머니를 뒤적이는 {name}, 하지만 손에는 아무것도 집히지 않았다.
{name}: ...어?
{name}: 지갑이... 없어...!!!
매점이모: 뭐해.
{name}: 이모... 오늘만... 저 단골인데 아잉~ 앙~ 하루만 외상 안될까...요? ㅎㅎ
매점이모: 월월! 월월! 개소리 탐지 개소리 탐지!
{name}: 이..이모..ㅠㅠㅠㅠ
그 순간...`,
    next: "baekdor2"
  },

  dd3: {
    text: `{name}: 좋아... 고급진 발냄새 맛으로 기분전환... 아주머니 계산이요.
매점이모: 5300원이다.
{name}: 네 잠시만용..! 
주머니에 손을 넣는 {name}그런데... 주머니에..지갑이 없다..!
{name}: ...??? 뭐여 ㅅㅂ
{name}: 지갑이... 없는데...?
매점이모: 뭐하냐
{name}: 이모... 저 돈이 없는데 대신 내주시면..안되겠..
매점이모: 뒤에 줄 안보이니? ㅃㄹ 개소리 말고 끄지라.
생독찌라: 아 앞에 ㅃㄹ 비켜  겨토르뱅도 녹겠어.
포뱌디아: 아! 내 핫바. 백지민 그거 내꺼라고!!
{name}:...ㅠ 알겠어요..ㅠ 
그 때, {name}의 뒤에 있던 사람이 카드를 내밀며 다가왔다...`,
    next: "baekdor3"
  },

  baekdor1: {
    text: `???: 빅버키매치스.. 나도 이거 좋아하는데... 잠깐 이모, 이 sweet girl 것도 같이 계산이요~
매점이모: ? 뭐여? 여친이여? 그려. 5400원.
누군가 {name}의 음료수를 대신 계산해주었다.
염색을 한 것 같은 밝은 된장색 머리카락에, 명찰색을 보아하니 3학년 같았다.
{name}: 어..저기..! 선배..!`,
    choices: [
      { label: "고맙다고 90도 인사를 3번 하며 인사한다", next: "ff", effect: { tar: +3 } },
      { label: "어색하게 고개만 약간 까딱인다.", next: "ff1", effect: { tar: +1 } }
    ]
  },

  
  baekdor2: {
    text: `???: 이송라지때? 하하 취향 참 독특하네? 이모 얘 거 포함해서 살게요. 
매점이모: 뭐여? 남친이여? 5700원만 내. 200원은 뜨거운 사랑을 보고 꿔줌.
{name}의 어깨에 팔을 올리고 친한 척 대신 돈을 내주는 모습에 {name}은/는 놀랐지만 바로 고개를 돌려 얼굴을 보았다.
염색을 한 것 같은 밝은 된장색 머리카락에, 명찰 색을 보아하니 3학년 같았다.
{name}: 어..저기..! 선..선배!`,
    choices: [
      { label: "고맙다고 90도 인사를 3번 하며 인사한다", next: "ff", effect: { tar: +3 } },
      { label: "어색하게 고개만 약간 까딱인다.", next: "ff1", effect: { tar: +1 } }
    ]
  },

  
  baekdor3: {
    text: `???: 이모~ 얘 것 포함해서 결제 할게요~ 
매점이모: 이 시대의 sweet boy 구만. 그래 너의 열정을 봐서 5500원만 받겠다.
???: 감~사합니~다. 
갑자기 매점이모와 함께 희랑차깔우의 감사합니다~(19금 노래)를 부르는 수상한 남성, 한차례 공연이 끝나고 {name}에게로 오는 남성
{name}: 그..
염색을 한 것 같은 밝은 된장색 머리카락에, 명찰색을 보아하니 3학년 같았다.
{name}: 어..저기..! 선배이신 것 같은데..`,
    choices: [
      { label: "고맙다고 90도 인사를 3번 하며 인사한다", next: "ff", effect: { tar: +3 } },
      { label: "어색하게 고개만 약간 까딱인다.", next: "ff1", effect: { tar: +1 } }
    ]
  },
  ff: {
    text: `???: 풉 ㅋ 그래 제사짓냐. 
    선배는 조토피아 여우 같은 미소를 지으며 머리를 쓸었다.
???:  됐어.~ 나중에 갚어~ㅋ
그 한 마디를 남긴 후, 이름모를 선배는 담배연기처럼 사라졌다.
{name}: 아니.. 이름도 안 알려주셨으면서 ..헤헤.. 근데 좀 잘생겼따...

기억에 남는 거라곤 생글거렸던 그의 미소. 비록 이름은 묻지 못했지만, 언젠가 또..
다시 만날 것 같은 예감(과자 아님)이 들었다.`,
next: "schoollife"
  },

  ff1: {
    text: `???: 그래~ 됐어 나중에 갚어 ㅎㅎ
{name}: ...저 선..! 어머나..! 사라졌다....
{name}: 아니 이름도.. 안 알려주셨으면서.. 근데.. 되게 잘생겼다.. 헤헤 키가 230cm는 되는 것 같아..
그 짧은 한 마디를 남기고 떠난 그는 {name}에게 잊지 못할 아름다운 미소를 그녀의 눈동자, 목젖, 식도, 그리고 마음 깊은곳에 선사해주었다.
{name}: 잘 모르겠지만.. 또 다시 저 선배와 만날 것 같아..!`,
    next: "schoollife"
  },

  schoollife: {
    text: `남은 수업 시간동안 이세치슈의 잘생긴 외모때문에 그를 흘끔 보긴 했지만, 별 대화는 없었다.
그렇게 학교가 끝나고, {name}은 곧장 반에서 뛰쳐나가 스토마쉐에게로 향했다. 
왜냐하면 오늘은 바로 스토마쉐와 약속한 한달에 5번 있는 '스볶이데이'이기 때문이다.
{name}: 스토마쉐~ 가자!! 떡볶이 먹어야해!
스토마쉐: 알겠어! ㅎㅎ 가자.
스토마쉐와 복도를 걷는데 사물함 쪽에서 이세치슈의 귀여운 뒤통수를 보았다. 자연스레 눈길이 그쪽으로 향했는데 그 옆에는..`,
    next: "samul"
  },

  samul: {
    text: `아라랑궁: 이세치슈~ 학교 끝나고 어디가? 나랑 노래방이나 갈래? 아니면..
이세치슈: 아니. 오늘 바로 가봐야해서.
아라랑궁: ...그래? ...그럼~ 연락처라도 줘! 연락하게.
이세치슈:..... 여기.
이세치슈와 아라랑궁의 대화를 본 {name}, 보면 안될 걸 본 기분에 바로 고개를 돌렸다.
움찔거리는 소리에 고개를 돌린 아라랑궁과 이세치슈
아라랑궁: ? 뭐야 쟨.. ㅎㅎ 아무튼 이세치슈 낼 봐~
이세치슈: ..응.`,
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
스토마쉐: 아줌마 떡볶이3인분, 순대4인분, 오뎅 5개만요~
똥뽂이 아줌마: 사람이냐 니들이.
15분쯤 지났을까, 주문한 메뉴가 나오고 {name}와/과 스토마쉐는 맛있는 dinner time을 보냈다.
스토마쉐는 {name}의 두꺼운 턱살에 묻은 떡볶이 국물을 보았다. 그러고는 말없이 휴지를 꺼내 {name}의 입가를 닦아주었다.
{name}: 앙 부끄럽게.. 하하하 고마워..헤헤..
스토마쉐: chill chill 치 못하기는 ㅎㅎ.
{name}: 뭐래. 암튼 그렇고 스토마쉐, 오늘 우리반에 전학생 온거 알아?
스토마쉐: 어 들었어. 남자애라며, 잘생겼다던데 넌 어떤데?
순간 스토마쉐의 눈빛이 차갑게 변했다. 하지만 약간은 풀이 죽은 개처럼 보이기도 했다.
{name}: 솔직히 좀 개개개개개개 잘생기긴 했어. 약간 배우 드빠녹통 느낌?
스토마쉐: ..그래? ..
{name}: 근데 좀 무서워. 난 친해지려고 장난 좀 쳤는데... 말을 못걸겠어.
스토마쉐: ...그렇구나. 
그 때 {name}은/는 보았다. 스토마쉐의 표정이 약간 굳었다는 것을. 당황한 {name}은/는 고개를 더 돌려 창문을 바라보았다.
지나가는 사람들과 도로를 달리는 핑크버스. 그 때 {name}의 머리에 무언가 푸슝푸슝하고 지나갔다.
{name}: 꺅! 그건 그렇고 스토마쉐 몇시야? 아 버스 놓치면 망하는데
스토마쉐: ..응? 헐! 2분남았는데?
황급히 자신의 가방을 싸고 옷을 입는 {name}, 대충 옷을 걸치고 떡볶이집 문을 연다.
{name}: 스토마쉐...! 나 먼저 간다!!! 으아아악!!
스토마쉐: 응? 어..어! 내일..보자..!`,
    next: "bus_station"
  },

  bus_station: {
    text: `달리는 {name},
{name}: 헉헉..! 꺅!!! 미친.. 안돼!! 잠시만요!!!!!!!! 제발!! 
{name}은/는 920번 버스를 눈앞에서 놓쳤다.

자신의 바로 앞을 지나간 버스를 바라보며 버스 정류장에서 무릎을 꿇은채 좌절한다.

그 때, 온 세상이 멈춘듯 주변이 고요해졌다. 
지나가는 버스안에서..... 이세치슈의 모습이 스쳐 보였다.
둘은 눈을 마주쳤다.

{name}: 뭐야.. 얘도 나랑 같은 버스를 타는 걸까?`,
    next: "day1_end"
  },

  day1_end: {
    text: `집으로 터벅터벅 돌아오는 길, {name}은/는 문득 생각했다. 
    {name}: 오늘 참 많은 일이 있었던 것 같네....
{name}은/는 몰랐다.
이 사소한 하루가,
앞으로의 관계에 어떤 의미를 갖게 될지를...

── Day 1 종료 ──`,
    choices: [{ label: "Day 2로", next: "day2_start" }]
  },

  day2_start: {
    text: `다음 날이 밝았다.

(임시)`,
    choices: [{ label: "Day 2로 가기(테스트)", next: "day2_morning", reset: true }]
  }
};

// ======================
// Day2 (보선녀 원문 톤 유지 / 실행 가능 + 연결 정리 버전)
// state.points = { sto:0, ise:0, tar:0 } 가정
// ======================

// ======================
// Day2 (보선녀 원문 톤 유지 / 실행 가능 + 연결 정리 버전)
// ======================

const day2Scenes = {
  day2_morning: {
    text: `다음날 {name}은 눈을 뜨고 옷을 갈아입고, 간단한 아침식사를 한 후 스토마쉐를 만난다.

스토마쉐: {name}, 잘 잤어?
{name}: 엉. 근데 너무 피곤하다. 빨리 학교나 가자..
스토마쉐: 기운내. 자 이거 먹어.
스토마쉐는 {name}에게 '아샤타르띠초'를 건넨다.
{name}: 헉.... 스토마쉐ㅠㅠ 내가 엄~청 좋아하는 거..!! 스토마쉐 고마워
{name}이 스토마쉐를 안으려고 하자, 스토마쉐는 초인간적인 반사신경으로 벡스텝을 밟는다.
스토마쉐: {name}..! 그, 그런 건... 아직..! 준비가...!
스토마쉐의 얼굴이 빨간 개코원숭이의 엉덩이처럼 물들었다.
정신을 차린 {name}이 당황하며 이 상황을 넘기려고 헛기침을 하였다.
{name}: 아하..아하! 핳! 학..학교나 가자. 스토마쉐!
스토마쉐: ......`,
    next: "day2_school"
  },

  day2_school: {
    text: `학교

스토마쉐: ..{name}, 나중에 봐.
{name}: 어..! 어 스토마쉐. 너도

반에 도착한 {name}, 자리에 앉으려 하는데 이세치슈가 아직 오지 않은 것을 확인한다.

{name}: 아직 안왔나..?
그 때, 열리는 뒷 문. 그 사이에서는 세상 만물을 오징어 외계인으로 만들어버리는 사내. 바로 이세치슈였다.
이세치슈는 손을 털며 저벅저벅 자리로 걸어오고 있었다.

{name}: (오줌싸고 손은 씻었겠지?)

이세치슈가 자리에 앉고, 둘은 또 어색하게 앞만 쳐다보고 있었다.
이세치슈는 아직 손이 덜 말렸는지, 손목을 툭톡툭톡 하고 털었다.

{name}: 아. 이세치슈 안녕. 하하 .. 하 좋은 아침?
이세치슈는 {name}을 쓱 쳐다보고 말했다.
이세치슈: 안녕.

{name}: (그래.. 친해지려면 용기를 내야해...!! 근데 뭐라고 자연스럽게 말걸어야 할까..)`,
    choices: [
      { label: "근데 이세치슈 무슨 냄새 나지 않아?", next: "day2_papa1", effect: { ise: +2 } },
      { label: "이세치슈 근데 너 세면대에서 태어났어?", next: "day2_papa2", effect: { ise: +3 } }
    ]
  },

  day2_papa1: {
    text: `이세치슈: ..나한테? 무슨 냄새?
{name}: 약간 옥동자 아이스크림같은,, 달콤한..~
이세치슈: 어?
{name}: 아니 향긋하고 좀 매실액기스 같은..

이세치슈는 차가운 얼굴로 {name}을 쳐다보았다.
{name}은 그 얼굴을 보고 약간 놀라며 다시 고개를 돌렸다.
{name}: (망했....)

그 때, 옆에서 무언가 약간 들썩이는 듯 했다.
곁눈질로 그것을 보던 {name}이 고개를 돌렸다.

이세치슈가 약간 입꼬리를 0.3cm정도 올리며 웃음을 참고 있었다.

{name}: 어? 웃었.
이세치슈: 아니.
{name}: 웃었잖아.
이세치슈: 아닌.. 풉..
{name}: 어?!
이세치슈: 아니 넌.. 왜 자꾸 이상한 말을 하는거야? 너 진짜 이상하다..
이세치슈: ..아무튼 칭찬은 고마워.

이세치슈가 처음으로 웃은 것을 본 {name}, {name}은(는) 약간 엉덩이가 빨개진 기분이 들었다.
이세치슈의 강철같던 차가운 얼굴이 녹아내리고 미소만이 남자, {name}은(는) 이세치슈에 대한 내적 친밀감이 상승하는 기분이 들었다.
{name}: (잘생기긴 많이 잘생겼다. 헤헤..)`,
    next: "day2_follow"
  },

  day2_papa2: {
    text: `이세치슈: ...뭐? 무슨 말이야?
{name}: 아니 아니...! 오해하지 말고..!
{name}: 그냥 너한테.. 향긋한 비누 냄새가.. 온 몸을 감싸고 있어서..!!
이세치슈: ?

이세치슈가 당황+'저 ㅅㄲ 뭐야'라는 표정을 짓고 있자 {name}은(는) 바로 손을 절레절레 지었다.
{name}: 아니..!! 그게 아니라..!! 그냥 항상 향이.. 좋..!

이세치슈가 갑자기 웃었다.
이세치슈가 치아를 다 드러내며 웃자, 그의 바른 치아열들이 쭈루루룩 {name}의 눈에 담겼다.
{name}: (이빨 지리누)

이세치슈가 정신을 차리고 최소한의 예의를 담으려 입을 가리고 웃자, 분위기가 조금 가라앉은 듯 했다.
이세치슈: 넌 어제부터 왜 그렇게 냄새에.. 집착하니?
{name}: 아니.. 사실인걸 그리고 냄새가 아니라..! 향.기..! smell!
이세치슈: 너 진짜.. 웃긴다.
{name}: ..근데 너는 웃을 때도 진짜 이쁘..
이세치슈: 거기까지.
{name}: 하하..~ 하.. 흠... 오케이..
이세치슈: 아무튼, 칭찬은 고마워.

이세치슈의 강철같던 차가운 얼굴이 녹아내리고 미소만이 남자 {name}은(는) 이세치슈에 대한 내적 친밀감이 상승하는 기분이 들었다.
그리고 이세치슈가 고맙다며 또 다시 희미한 미소를 보였을 때 {name}은(는) 눈치채지 못했지만, 마음속에서 약간 심장의 심박수가 조금 올라갔다.`,
    next: "day2_follow"
  },

  day2_follow: {
    text: `점심시간이 되고, {name}은(는) 혼자서도 당당하게 식당으로 향했다.

{name}: 으아ㅠ 나는 밥먹을 친구가 스토마쉐밖에 없는데...
하아.. 걔는 대체 어디로 간거야.. 진짜. 됐어.. 혼자 먹고 말지..
아! 그래 이세치슈는 전학온거면 아직 친구도 많이 없을텐데.. 같이 먹자고 해.....

그 때, {name}의 앞에는 여자애들과 남자애들에게 둘러 쌓인 이세치슈가 보였다.
{name}:....아오 잘생긴게 밥 먹여주.. 
네.. ㅅㅂ

{name}은 대충 앉아서 밥을 먹었다.
{name}: 오늘 점심 햄버거치즈탕수육 예~

30분 후
{name}: 움~ 맛있어. 근데 딴 애들은 입에 모터 달았나? 왜 이렇게 빨리 먹은거지...

주변을 둘러보니, 주변에는 아무도 없었다.
그런데 주위에서 이상한 소리가 들렸다.

{name}: 뭐야..? 누가 있나? 급식이모님들 밖에 없는..
{name}: ? 이세치슈잖아
{name}: 쟤 저기서 뭐하는거지? 뭐 찾는건가?

{name}은 먹던 식판을 들고 대충 버린 후 그에게 다가갔다.
{name}: 이세치슈 거기서 뭐해?
이세치슈: ...아 .. 반지 찾고있어.
{name}: 반지? 헐..! 설마 너 잃어버렸어?
이세치슈: ....응
{name}: 아니 급식실에서 잃어버린거야?
이세치슈: 모르겠어. 아까 체육시간 끝나고부터 기억이 없어..
{name}: 헐.... 곧 점심시간 끝나는데...

이세치슈는 머리를 매만지며 한숨을 내쉬었다.
이세치슈: 아.. 하아...
{name}: ...내가 도와줄까?
이세치슈: ...됐어. 다른 사람 불편하게 하고 싶지 않아. 내가 덜렁댄 탓이니까.. 빨리 수업 들어가. 난 조금만 더 둘러보고 갈게.
{name}: ...그치만..!

이세치슈가 더이상 {name}에게 시선을 주지않자, {name}은(는) 시무룩한 표정으로 자리를 나섰다.
{name}: ... 같이 찾으면 더 빨리 찾을텐데...

그렇게 급식실을 나서려는데 바닥에 무언가 밟혔다.
{name}: ..?
{name}: 여깄잖아 띠바

반지가 바닥에 있었다.`,
    choices: [
      { label: "이세치슈에게 반지가 여기있다고 알린다.", next: "day2_her", effect: { ise: +2 } },
      { label: "왠지, 지금은 말하면 안 될 것 같다.", next: "day2_no", effect: { ise: +5 } }
    ]
  },

  day2_her: {
    text: `{name}: 이세치슈..!!!
이세치슈: ...괜찮다니까..
{name}: 그게 아니라..! 여기..

반지를 이세치슈에게 건넨다.
{name}: 이거 네 거지.!
이세치슈: ...! 어.. 내 거야.

반지를 받아들며
이세치슈: .....고마워.
{name}: 뭐 별 말씀을..~ 하하 그럼 반에서 봐!

이세치슈: 잠깐만
이세치슈가 {name}의 손목을 잡.앗.따.!!!!!!

{name}: ...!엣
이세치슈: ..너 이름이 뭐라고.?
{name}: ..어.. 그 {name} ..이야..
이세치슈: {name}.. 진짜 고마워. 정말.
{name}: 뭐 이 정도 가지고.. ㅎㅎ`,
    next: "day2_classroom"
  },

  day2_no: {
    text: `{name}: 하하~ 뭐 나중에 주면 되는거지.`,
    next: "day2_classroom1"
  },

  day2_classroom: {
    text: `그렇게 반으로 간 {name}, {name}이(가) 반에 도착하고 10분 정도 뒤에 이세치슈가 들어왔다.

수업은 따분했고, {name}은(는) 감기는 눈을 뒤로 하며 계속해서 자신의 볼을 잡아 당겼다.
뱃살처럼 늘어나는 {name}의 볼을 이세치슈는 가끔 쳐다보며 피식 피식 웃는 듯 했다.
{name}: (저 ㅅㄲ 나 보고 웃는거지?)`,
    next: "day2_afterblack"
  },

  day2_classroom1: {
    text: `그렇게 반으로 간 {name}, {name}이(가) 반에 도착하고 10분 정도 뒤에 이세치슈가 들어왔다.

수업은 따분했고, {name}은(는) 감기는 눈을 뒤로 하며 계속해서 자신의 볼을 잡아 당겼다.
뱃살처럼 늘어나는 {name}의 볼을 이세치슈는 가끔 쳐다보며 피식 피식 웃는 듯 했다.
{name}: (저 ㅅㄲ 나 보고 웃는거지?)`,
    next: "noman"
  },

  // ✅ 공통 하교 파트(선택지만 담당)
  day2_afterblack: {
    text: `딩동댕동 종이쳤다. 스토마쉐를 만나러 가는 {name}, 스토마쉐는 {name}의 반 앞에서 {name}을(를) 기다리고 있었다.
{name}: 스토마쉐!
스토마쉐: {name}! 갈까?
{name}: 오늘 많이 바빴어? 도통 보이질 않던데~
스토마쉐: 응 곧 시합있으니까. 너도 별 일 없었지?
{name}:~~.. 딱..히?
스토마쉐: 다행이네. ㅎㅎ 가자!
스토마쉐: 응ㅎㅎ

스토마쉐와 함께 교문을 나서려는데, 순간 이세치슈가 {name}을(를) 불렀다.
이세치슈: {name}.
{name} : 어? 이세치슈?

이세치슈는 약간 쑥스러워 하는 것 같다가, 스토마쉐를 한 번 보았다.
스토마쉐는 wolf의 향을 맡은 탓인지 약간은 경계를 하는 듯 한 모습을 보였다.
둘은 사랑에 빠진 연인처럼 찐듯하게 서로를 차갑게 스캔하다가 이세치슈가 먼저 눈을 돌렸다.

{name} : 뭐야 둘이 사귀냐
이세치슈: .. 아 아니야. 잘 가라고 그냥.
{name} : 어? 어 너도 잘가 이세치슈~

이세치슈가 먼저 떠나고 스토마쉐는 {name}을/를 바라보며 말했다.
스토마쉐: 쟤가 그 전학생이야?
{name}: 엉. 이세치슈야. 진짜 잘생겼지?
스토마쉐: ..별로.
{name} : 하하. 우리도 빨리 가자.
스토마쉐: 그래..

약간 시무룩해보이는 스토마쉐를 본 {name}
{name}: 스토마쉐~ 표정이 왜 이래.
스토마쉐: 아냐.. 그냥 되게 네가 사교성이 좋다는 걸 이렇게 또 깨닫게 된 것 같아서.
{name}: 내가 좀 그렇지.
스토마쉐: {name}, 칭찬 아니거든?
{name} : 엉?

스토마쉐가 갑자기 발 걸음을 멈추며, {name}을(를) 돌아보았다.
스토마쉐: 넌 내가 너를....좋..
{name}: 어..? 좋..?
순간 봄바람이 불었다.
스토마쉐: ...좋..좋같다고..

스토마쉐의 얼굴이 홍고추처럼 붉어졌다.
{name}: 아하~ 내가 좀 좋같긴 하지.
스토마쉐: ..넌 진짜.. 바보야..

스토마쉐: 나 오늘 먼저 갈게.
{name}: 어..? 어? 스토마쉐..! 잠..잠깐..
스토마쉐: .. 내일 봐.

스토마쉐가 그렇게 반 도망치는 상태로 도주했다.
{name}: 뭐야..진짜.... 스토마쉐..
{name}: 또 나 혼자 가야하잖아..

버스정류장 앞 까지 도착한 {name}, 그 앞에는 또 익숙한 얼굴이 보였다.
{name}: .. 이세치슈?
이세치슈는 자신의 이름을 부르는 부름에 고개를 돌려 {name}을(를)보았다.
이세치슈: {name}.
{name}: 너도 920번 버스 타지?
이세치슈: 응. 너도?
{name}: 응!

{name}은(는) 이세치슈 옆에 약간의 틈을 사이에 둔 채로 앉았다.
이세치슈: ..{name}, 폰 좀 줄 수 있어?
{name}: 어..? 왜? 배달시키려고?
이세치슈: ? 아니.. 그게 아니라, 내 번호 주려고.
{name}: 아 그래? 여기.
{name}: 에 에에ㅔㄱ..?!! 진짜 ??
이세치슈는 끄덕이며, 폰을 받아들고, 전화번호를 입력했다.
이세치슈: ..보답은 해야하니까.
{name}: 아하.. 괜찮다니까.. ㅎㅎ 여기서 더 거절하는 것도 예의가 아니겠지.. 하하.. 알겠어

딱 그 타이밍에 920번 버스가 도착했다. 둘은 버스에 탔다.`,
    choices: [
      { label: "이세치슈와 떨어진 곳에 앉는다.", next: "busbus", effect: { ise: -2 } },
      { label: "이세치슈의 옆에 앉는다.", next: "busbus1", effect: { ise: +3 } }
    ]
  },

  // ✅ day2_afterblack에서 쓰는 다음 씬들은 “최상위”에 따로 빼야 함 (이게 오류 원인 FIX)
  busbus: {
    text: `그렇게 10분정도가 흘렀을 때, {name}의 집 앞에 도착한 버스, {name}은(는) 버스에서 내렸다.
{name}이(가) 버스에서 내리고, 눈 앞에 창문으로 이세치슈가 보였다. 어제와 같은 구도, 다른 장소였다.
이세치슈는 미소지으며 손을 흔들어주었다.
차가운 밤 공기, 그렇지만 마음만은 따뜻했다.
{name}: 하~ 오늘 참 많은 일이 있었던 것 같아.....`
  },

  busbus1: {
    text: `{name}: ㅎㅎ 좀 옆에 좀 앉을게.
이세치슈: .. 그래.
이세치슈의 귀가 새뻘건 원숭이 엉덩이처럼 변했다.
딱히 서로 간의 대화는 없었지만, 이세치슈는 점점 짧아지는 시간이 아까워지기만 했다.`,
    next: "busbus"
  },

  // ✅ no루트(반지 숨김) 후 하교 루트로 이어지는 씬들 (원문 그대로 유지)
  noman: {
    text: `딩동댕동 종이쳤다. 스토마쉐를 만나러 가는 {name}, 스토마쉐는 {name}의 반 앞에서 {name}을(를) 기다리고 있었다.
{name}: 스토마쉐!
스토마쉐: {name}! 갈까?
{name}: 오늘 많이 바빴어? 도통 보이질 않던데~
스토마쉐: 응 곧 시합있으니까. 너도 별 일 없었지?
{name}: 별 일.. (내가 전학온 남자애 냄새나 맡고, 반지도 쌥쳤지만) 없었지! ( 헤헤 모르겠다. )
스토마쉐: 다행이네.

그 때, 그 둘 사이로 이세치슈가 그 둘을 재쳐지나가려 했다. 이세치슈가 그 둘을 쓱 훑었다. 그 때, 이세치슈와 {name}의 눈이 마주쳤다.
이세치슈: ...내일 봐.
{name}: 어? 어 너도 잘가 이세치슈~

이세치슈와 스토마쉐가 짧은 시간 서로를 마주했다. 그러고 이세치슈가 빠져나가자 시선은 흩어졌다.
스토마쉐: .... 쟤는 뭐 저렇게 사람을..
{name}: 그니까, 왜케 널 쳐다본대? 사귀는 줄?
스토마쉐: 놀릴래?`,
    next: "no"
  },

  no: {
    text: `{name}: 헤헤 농담. ...아 맞다 스토마쉐!
{name}은(는) 이세치슈의 뒷통수를 한 번 쓱, 본 후 스토마쉐를 바라보았다.
{name}: 나 오늘 바로 가봐야 할 것 같애.
스토마쉐는 이세치슈를 바라보다가 다시 {name}을(를) 바라보며 말했다.
스토마쉐 : ...그래?
{name} : 엉! 오늘 바로 가려고 안 데려다 줘도 돼.
스토마쉐 : 좀 아쉽네.
{name} : 어..어?
스토마쉐: 알았어. 내일 아침에 봐.

{name}은 그렇게 학교에서 나와서 바로 버스 정류장으로 향했다. 약간은 설레는 기분을 느끼며 조금 달렸다.
{name}: ..이세치슈가 또 있을까?
{name}은(는) 주머니에 넣어둔 반지를 만지작 거리며 신호등을 건너고 달렸다. 그리고 {name}은 앉아있는 이세치슈를 보았다.
{name}: 이세치슈..!
이세치슈: ..어? {name} ?
{name} : 이거..! 헉.. 허억..
이세치슈: 응?

{name}은 주머니에서 반지를 꺼내며 그에게 보여주었다. 깜짝 놀란 이세치슈
{name}: 이거 네 거 잖아..! 하아..! 놓치는 줄 알고 엄청 놀랐네..
이세치슈: ...! 어떻게..

{name}은 손으로 브이를 하며 반지를 그의 손에 건네주었다.
{name}: 야! 이제 잃어버리지 마. 금반지를 누가 잃어버리니? ㅉㅉ
이세치슈:....고마워. 진짜로.

{name} 저 멀리서 920번 버스가 다가오고 있었다.
이세치슈: 너도 저 버스 타?
{name}: 으응 당연하지. 너도야?
이세치슈: 응. 같이 앉을래?
{name} : 어..어? 그..그래

버스 안
이세치슈: ...내가 보답은 꼭 할게.
{name}: 뭘 이런걸로..

이세치슈: 나 배터리가 나가서 그런데 폰 한 번만 빌려줄 수 있어?
{name}: 엥? 그래, 여기

이세치슈는 {name}의 폰으로 무언가를 톡톡 두드리는가 했다.
{name}: (아..폰에 비키니 짤들 짱 많은데 우쩌지..)

이세치슈: 여기. 고마워.
{name}: 어..! 받은 화면을 보니, 이상한 번호가 저장되어있었다.
{name}: ..! 어?

이세치슈는 미소지으며 {name}을 바라보았다.
이세치슈: 이거 내 번호야. 좀있다 문자 하나 보내.
{name}은 놀라며 그를 바라보았다.
{name} : 어..! 어..

그 말을 끝으로 이세치슈는 딱히 아무말이 없었다.
{name}또한 아무말도 하지 않았다.
하지만 이세치슈의 가슴에서 심장은 쿵쾅쿵쾅 메머드 급의 진동이 일어나고 있었다.`,
    next: "busbus" // ✅ 여기서 끝내고 싶으면 busbus로 연결 (원하면 다른 엔딩씬으로 바꿔도 됨)
  }
};

// scenes에 합치기
Object.assign(scenes, day2Scenes);

// ----------------------
// 공통 util
// ----------------------
function getScene(id) { return scenes[id]; }

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

function getSceneScript(sceneId) {
  const scene = getScene(sceneId);
  if (!scene) return [{ type: "narration", text: `씬을 찾을 수 없어: ${sceneId}` }];
  if (!scene.__scriptCache) scene.__scriptCache = parseScript(scene.text);
  return scene.__scriptCache;
}

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

function applyEffect(effect) {
  if (!effect) return;
  if (typeof effect === "number") { state.affection += effect; return; }

  if (typeof effect === "object") {
    for (const [key, val] of Object.entries(effect)) {
      if (typeof val !== "number") continue;
      if (!(key in state.points)) state.points[key] = 0;
      state.points[key] += val;
    }
  }
}

// ----------------------
// 스프라이트 시스템 (경로 통일 FIX)
// 준비 파일: img/sto.png, img/ise.png
// ----------------------
function setSprite(side, src) {
  const el = side === "left" ? leftSprite : rightSprite;
  if (!el) return;
  if (!src) {
    el.classList.add("hidden");
    el.removeAttribute("src");
    return;
  }
  el.src = src;
  el.classList.remove("hidden");
}

function setSpeaking(side) {
  if (!leftSprite || !rightSprite) return;

  const leftHidden = leftSprite.classList.contains("hidden");
  const rightHidden = rightSprite.classList.contains("hidden");
  if (leftHidden && rightHidden) return;

  if (side === "left") {
    leftSprite.classList.remove("dim");
    rightSprite.classList.add("dim");
  } else if (side === "right") {
    rightSprite.classList.remove("dim");
    leftSprite.classList.add("dim");
  } else {
    leftSprite.classList.remove("dim");
    rightSprite.classList.remove("dim");
  }
}

// ----------------------
// 상태창/모달/오버레이
// ----------------------
function setText(id, v) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = String(v ?? "");
}

function updateStatusPanelLabels() {
  setText("stoStatus", state.points.sto ?? 0);
  setText("iseStatus", state.points.ise ?? 0);
  setText("tarStatus", state.points.tar ?? 0);
  setText("outfitLabel", state.outfit);
  setText("autosaveLabel", state.settings.autoSave ? "ON" : "OFF");
}

function openOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove("hidden");
}

function closeOverlay(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("hidden");
}

function openModal(title, builder) {
  const overlay = document.getElementById("modalOverlay");
  const t = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");
  if (!overlay || !t || !body) return;

  t.textContent = title;
  body.innerHTML = "";
  builder(body);

  overlay.classList.remove("hidden");
}

function closeModal() {
  closeOverlay("modalOverlay");
}

function makeBtn(label, onClick, className = "btn") {
  const b = document.createElement("button");
  b.className = className;
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}

// ----------------------
// 화면 전환
// ----------------------
function showScreen(idToShow) {
  const ids = ["titleScreen", "nameScreen", "gameScreen"];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    if (id === idToShow) el.classList.remove("hidden");
    else el.classList.add("hidden");
  }
}

// ----------------------
// 저장/불러오기
// ----------------------
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

    const pn = String(data.playerName || "").trim();
    if (!pn) return false;
    playerName = pn;

    const s = data.state || {};
    state.scene = s.scene || "day1_morning";
    state.line = Number.isFinite(s.line) ? s.line : 0;
    state.affection = Number.isFinite(s.affection) ? s.affection : 0;
    state.points = (s.points && typeof s.points === "object") ? s.points : { sto: 0, ise: 0, tar: 0 };
    state.outfit = s.outfit || "uniform";
    state.settings = (s.settings && typeof s.settings === "object") ? s.settings : { autoSave: true };
    if (typeof state.settings.autoSave !== "boolean") state.settings.autoSave = true;

    return true;
  } catch (e) {
    console.warn("load failed", e);
    return false;
  }
}

// ----------------------
// 렌더/진행 (빈 스크립트 보호 FIX + 스프라이트 경로 FIX)
// ----------------------
function render(textEl, namePlateEl, choicesEl) {
  const scene = getScene(state.scene);
  const script = getSceneScript(state.scene);

  // ✅ 빈 스크립트 보호
  if (!script || script.length === 0) {
    namePlateEl.style.display = "none";
    textEl.textContent = "대사가 비어있음! scene.text 확인해줘.";
    choicesEl.innerHTML = "";
    return;
  }

  if (state.line < 0) state.line = 0;
  if (state.line >= script.length) state.line = script.length - 1;

  const cur = script[state.line] || { type: "narration", text: "" };
  const rep = (s) => (s || "").replaceAll("{name}", playerName);

  // 대사/나레이션 스타일 + outfit dataset
  if (dialogueBox) {
    dialogueBox.classList.toggle("isDialogue", cur.type === "dialogue");
    dialogueBox.classList.toggle("isNarration", cur.type !== "dialogue");
    dialogueBox.dataset.outfit = state.outfit;
  }

  // ✅ 스프라이트 자동 배치
  if (cur.type === "dialogue") {
    const sp = rep(cur.speaker);
    if (sp.includes("스토마쉐")) {
      setSprite("left", "img/sto.png");  // ✅ 경로 통일
      setSpeaking("left");
    } else if (sp.includes("이세치슈")) {
      setSprite("right", "img/ise.png"); // ✅ 경로 통일
      setSpeaking("right");
    } else {
      setSpeaking(null);
    }
  } else {
    setSpeaking(null);
  }

  // 선택지 초기화
  choicesEl.innerHTML = "";

  // 텍스트 출력
  if (cur.type === "dialogue") {
    namePlateEl.style.display = "inline-block";
    namePlateEl.textContent = rep(cur.speaker);
    textEl.textContent = rep(cur.text);
  } else {
    namePlateEl.style.display = "none";
    textEl.textContent = rep(cur.text);
  }

  // 자동저장
  if (state.settings.autoSave) saveGame();

  // 마지막 줄이 아니면 끝
  const isLastLine = state.line >= script.length - 1;
  if (!isLastLine) return;

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
        if (dSto) msgs.push(`스토마쉐 ${dSto > 0 ? `+${dSto}` : dSto}`);
        if (dIse) msgs.push(`이세치슈 ${dIse > 0 ? `+${dIse}` : dIse}`);
        if (dTar) msgs.push(`선배 ${dTar > 0 ? `+${dTar}` : dTar}`);
        if (msgs.length) showToast(msgs.join(" / "));

        if (choice.reset) {
          state.affection = 0;
          state.points = { sto: 0, ise: 0, tar: 0 };
          showToast("호감도가 초기화되었습니다.");
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
  }
}

function advance(textEl, namePlateEl, choicesEl) {
  const scene = getScene(state.scene);
  const script = getSceneScript(state.scene);

  if (!script || script.length === 0) return;

  if (state.line < script.length - 1) {
    state.line += 1;
    if (state.settings.autoSave) saveGame();
    render(textEl, namePlateEl, choicesEl);
    return;
  }

  // 마지막 줄인데 선택지 있으면 진행 막기
  if (Array.isArray(scene?.choices) && scene.choices.length > 0) return;

  // next 있으면 이동
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

// ----------------------
// 옷장/설정 모달
// ----------------------
function toastDelta(before, after, label) {
  const dSto = after.sto - before.sto;
  const dIse = after.ise - before.ise;
  const dTar = after.tar - before.tar;

  const msgs = [`${label} 선택!`];
  if (dSto) msgs.push(`스토마쉐 ${dSto > 0 ? `+${dSto}` : dSto}`);
  if (dIse) msgs.push(`이세치슈 ${dIse > 0 ? `+${dIse}` : dIse}`);
  if (dTar) msgs.push(`선배 ${dTar > 0 ? `+${dTar}` : dTar}`);
  showToast(msgs.join(" / "));
}

function openWardrobeModal(renderArgs) {
  const { textEl, namePlate, choicesEl } = renderArgs;

  openModal("옷장", (body) => {
    const info = document.createElement("div");
    info.className = "modalText";
    info.textContent = `옷을 고르면 누군가는 좋아하고 누군가는 싫어함 ㅎㅎ\n현재 착장: ${state.outfit}`;
    body.appendChild(info);

    const row = document.createElement("div");
    row.className = "row";

    row.appendChild(makeBtn("교복", () => {
      state.outfit = "uniform";
      const before = getPointsSnapshot();
      applyEffect({ ise: +1 });
      const after = getPointsSnapshot();
      toastDelta(before, after, "교복");
      if (state.settings.autoSave) saveGame();
      closeModal();
      updateStatusPanelLabels();
      render(textEl, namePlate, choicesEl);
    }, "btn small"));

    row.appendChild(makeBtn("후드티", () => {
      state.outfit = "hoodie";
      const before = getPointsSnapshot();
      applyEffect({ sto: +1, ise: -1 });
      const after = getPointsSnapshot();
      toastDelta(before, after, "후드티");
      if (state.settings.autoSave) saveGame();
      closeModal();
      updateStatusPanelLabels();
      render(textEl, namePlate, choicesEl);
    }, "btn small"));

    row.appendChild(makeBtn("큐티룩", () => {
      state.outfit = "cute";
      const before = getPointsSnapshot();
      applyEffect({ sto: +1, tar: +1 });
      const after = getPointsSnapshot();
      toastDelta(before, after, "큐티룩");
      if (state.settings.autoSave) saveGame();
      closeModal();
      updateStatusPanelLabels();
      render(textEl, namePlate, choicesEl);
    }, "btn small primary"));

    body.appendChild(row);
  });
}

function openSettingsModal() {
  openModal("설정", (body) => {
    const wrap = document.createElement("div");
    wrap.className = "modalText";

    const line = document.createElement("div");
    line.textContent = `자동저장: ${state.settings.autoSave ? "ON" : "OFF"}`;
    wrap.appendChild(line);

    const row = document.createElement("div");
    row.className = "row";
    row.appendChild(makeBtn("자동저장 토글", () => {
      state.settings.autoSave = !state.settings.autoSave;
      saveGame();
      showToast(`자동저장 ${state.settings.autoSave ? "ON" : "OFF"}`);
      closeModal();
      updateStatusPanelLabels();
    }, "btn small"));
    wrap.appendChild(row);

    body.appendChild(wrap);
  });
}

// ----------------------
// DOM 연결
// ----------------------
window.addEventListener("DOMContentLoaded", () => {
  // screens
  const titleScreen = document.getElementById("titleScreen");
  const nameScreen = document.getElementById("nameScreen");
  const gameScreen = document.getElementById("gameScreen");

  // sprites
  leftSprite = document.getElementById("leftSprite");
  rightSprite = document.getElementById("rightSprite");

  // title buttons
  const goStart = document.getElementById("goStart");
  const goContinue = document.getElementById("goContinue");
  const goIntro = document.getElementById("goIntro");
  const goChars = document.getElementById("goChars");
  const goWardrobe = document.getElementById("goWardrobe");
  const goSettings = document.getElementById("goSettings");

  // name screen
  const nameInput = document.getElementById("nameInput");
  const startBtn = document.getElementById("startBtn");
  const backToTitle1 = document.getElementById("backToTitle1");

  // game ui
  const textEl = document.getElementById("text");
  const choicesEl = document.getElementById("choices");
  dialogueBox = document.getElementById("dialogueBox");
  const namePlate = document.getElementById("namePlate");

  const menuBtn = document.getElementById("menuBtn");
  const statusBtn = document.getElementById("statusBtn");
  const saveBtn = document.getElementById("saveBtn");
  const loadBtn = document.getElementById("loadBtn");
  const resetBtn = document.getElementById("resetBtn");

  // status overlay
  const statusOverlay = document.getElementById("statusOverlay");
  const closeStatusBtn = document.getElementById("closeStatusBtn");
  const closeStatusBtn2 = document.getElementById("closeStatusBtn2");

  // modal
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalOkBtn = document.getElementById("modalOkBtn");
  const modalOverlay = document.getElementById("modalOverlay");

  // 필수 체크
  const must = [
    titleScreen, nameScreen, gameScreen,
    goStart, goContinue, goIntro, goChars, goWardrobe, goSettings,
    nameInput, startBtn, backToTitle1,
    textEl, choicesEl, dialogueBox, namePlate,
    menuBtn, statusBtn, saveBtn, loadBtn, resetBtn,
    statusOverlay, closeStatusBtn, closeStatusBtn2,
    closeModalBtn, modalOkBtn, modalOverlay
  ];
  if (must.some(v => !v)) {
    alert("index.html id 누락 있음! (버튼/오버레이/모달/스프라이트 id 확인)");
    return;
  }

  // 초기 화면
  showScreen("titleScreen");
  goContinue.disabled = !localStorage.getItem(SAVE_KEY);

  // 타이틀 버튼
  goStart.addEventListener("click", () => {
    nameInput.value = "";
    showScreen("nameScreen");
  });

  goContinue.addEventListener("click", () => {
    const ok = loadGame();
    if (!ok) return alert("저장 데이터가 없어!");
    showScreen("gameScreen");
    render(textEl, namePlate, choicesEl);
  });

  goIntro.addEventListener("click", () => {
    openModal("게임 소개", (body) => {
      const p = document.createElement("div");
      p.className = "modalText";
      p.textContent =
        "목표: 보선녀 VN을 ‘진짜 게임’처럼 완성해서 플레이스토어에 올리기!\n\n" +
        "Day 1에서 시작해 스토마쉐/이세치슈/선배와의 관계를 선택으로 바꾸며 엔딩을 만든다.\n" +
        "옷장/설정/상태창/메뉴 같은 ‘게임 기능’을 계속 추가하는 중.";
      body.appendChild(p);
    });
  });

  goChars.addEventListener("click", () => {
    openModal("캐릭터", (body) => {
      const p = document.createElement("div");
      p.className = "modalText";
      p.textContent =
        "스토마쉐: 어릴 때부터 같이 다닌 친구. 다정한데 가끔 폭주.\n\n" +
        "이세치슈: 전학생. 거리감 있고 차가운데 은근 반응이 귀여움.\n\n" +
        "선배: 매점에서 결제해준 미스터리 선배. 기억 속 ‘착한 선배’로 남음.";
      body.appendChild(p);
    });
  });

  goWardrobe.addEventListener("click", () => openWardrobeModal({ textEl, namePlate, choicesEl }));
  goSettings.addEventListener("click", () => openSettingsModal());

  // 이름 입력 화면
  backToTitle1.addEventListener("click", () => showScreen("titleScreen"));

  startBtn.addEventListener("click", () => {
    const input = nameInput.value.trim();
    if (!input) return alert("이름을 입력해줘!");
    playerName = input;

    // 새게임 초기화
    state.scene = "day1_morning";
    state.line = 0;
    state.affection = 0;
    state.points = { sto: 0, ise: 0, tar: 0 };
    state.outfit = "uniform";
    if (!state.settings) state.settings = { autoSave: true };

    saveGame();
    goContinue.disabled = false;

    showScreen("gameScreen");
    render(textEl, namePlate, choicesEl);
  });

  // 게임 화면 버튼들
  menuBtn.addEventListener("click", () => {
    openModal("메뉴", (body) => {
      const row = document.createElement("div");
      row.className = "row";
      row.appendChild(makeBtn("게임 소개", () => { closeModal(); goIntro.click(); }, "btn small"));
      row.appendChild(makeBtn("캐릭터", () => { closeModal(); goChars.click(); }, "btn small"));
      row.appendChild(makeBtn("옷장", () => { closeModal(); openWardrobeModal({ textEl, namePlate, choicesEl }); }, "btn small"));
      row.appendChild(makeBtn("설정", () => { closeModal(); openSettingsModal(); }, "btn small"));
      body.appendChild(row);

      const row2 = document.createElement("div");
      row2.className = "row";
      row2.appendChild(makeBtn("타이틀로", () => {
        closeModal();
        showScreen("titleScreen");
      }, "btn danger"));
      body.appendChild(row2);
    });
  });

  statusBtn.addEventListener("click", () => {
    updateStatusPanelLabels();
    openOverlay("statusOverlay");
  });

  closeStatusBtn.addEventListener("click", () => closeOverlay("statusOverlay"));
  closeStatusBtn2.addEventListener("click", () => closeOverlay("statusOverlay"));
  statusOverlay.addEventListener("click", (e) => {
    if (e.target === statusOverlay) closeOverlay("statusOverlay");
  });

  // 대사창 클릭 = 진행
  dialogueBox.addEventListener("click", () => {
    if (choicesEl.childElementCount > 0) return;
    advance(textEl, namePlate, choicesEl);
  });

  // 저장/불러오기/리셋
  saveBtn.addEventListener("click", () => {
    saveGame();
    goContinue.disabled = false;
    showToast("저장 완료!");
  });

  loadBtn.addEventListener("click", () => {
    const ok = loadGame();
    if (!ok) return alert("저장 데이터가 없어!");
    render(textEl, namePlate, choicesEl);
    showToast("불러오기 완료!");
  });

  resetBtn.addEventListener("click", () => {
    if (!confirm("진짜 처음부터 할래? 저장도 삭제돼!")) return;
    localStorage.removeItem(SAVE_KEY);
    location.reload();
  });

  // 모달 닫기
  closeModalBtn.addEventListener("click", closeModal);
  modalOkBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // ESC로 닫기
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    closeOverlay("statusOverlay");
    closeModal();
  });
});
