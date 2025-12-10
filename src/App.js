import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminPage from './Admin';
import { 
  BookOpen, 
  PenTool,
  GraduationCap, 
  LayoutDashboard, 
  User, 
  Trophy, 
  Settings, 
  LogOut,
  ChevronRight,
  CheckCircle2,
  XCircle,
  BarChart3,
  Clock,
  Users,
  Brain,
  ArrowRight,
  Lightbulb,
  FileText,
  Search,
  Check,
  AlertCircle,
  PieChart,
  Activity,
  Target,
  Briefcase,
  Heart
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// --- Supabase Configuration & Initialization ---
const supabaseUrl = 'https://uwpjbjejfuocxkapqpti.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3cGpiamVqZnVvY3hrYXBxcHRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NTY5MDAsImV4cCI6MjA4MDQzMjkwMH0.DjatDOhBlDkgfcq7kWQ3wkm-k61TZ_Xqpo9JSCd9tFc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Constants & Mock Data ---
const ADMIN_PWD = "jesuslovesyou"; 

const VOCAB_SETS = {
  TOEFL: [
    { word: "ubiquitous", meaning: "어디에나 있는", options: ["어디에나 있는", "드문", "위험한", "아름다운"] },
    { word: "mitigate", meaning: "완화하다", options: ["악화시키다", "완화하다", "시작하다", "무시하다"] },
    { word: "pragmatic", meaning: "실용적인", options: ["이론적인", "감정적인", "실용적인", "비싼"] },
    { word: "scrutinize", meaning: "세밀히 조사하다", options: ["대충 보다", "칭찬하다", "세밀히 조사하다", "거절하다"] },
    { word: "altruistic", meaning: "이타적인", options: ["이기적인", "이타적인", "적대적인", "게으른"] }
  ],
  SAT: [
    { word: "ephemeral", meaning: "일시적인", options: ["영원한", "일시적인", "거대한", "지루한"] },
    { word: "superfluous", meaning: "불필요한", options: ["필수적인", "불필요한", "강력한", "신비로운"] },
    { word: "substantiate", meaning: "입증하다", options: ["거짓임을 밝히다", "입증하다", "숨기다", "상상하다"] },
    { word: "reconcile", meaning: "화해시키다", options: ["싸우다", "분리하다", "화해시키다", "포기하다"] },
    { word: "condescending", meaning: "거들먹거리는", options: ["겸손한", "거들먹거리는", "친절한", "수줍은"] }
  ]
};

const GRAMMAR_SETS = [
  {
    id: 1,
    title: "Subject-Verb Agreement (주어-동사 일치)",
    description: "Match the verb correctly with singular/plural subjects.",
    questions: [
      { q: "The list of items _____ on the desk.", options: ["is", "are", "were", "be"], answer: 0, exp: "The subject is 'list' (singular), not 'items'. Therefore, the singular verb 'is' is correct.", expKo: "주어는 'items'가 아니라 'list'(단수)입니다. 따라서 단수 동사 'is'가 맞습니다." },
      { q: "Neither the teacher nor the students _____ happy about the decision.", options: ["was", "were", "is", "has"], answer: 1, exp: "In 'neither A nor B', the verb agrees with B (the closer noun). 'Students' is plural.", expKo: "'neither A nor B' 구문에서 동사는 B(더 가까운 명사)에 일치시킵니다. 'Students'가 복수이므로 'were'가 맞습니다." },
      { q: "Each of the participants _____ a certificate of completion.", options: ["receive", "receives", "receiving", "have received"], answer: 1, exp: "'Each' is treated as singular, so it requires the singular verb 'receives'.", expKo: "'Each'는 단수 취급을 하므로 단수 동사 'receives'가 필요합니다." }
    ]
  },
  {
    id: 2,
    title: "Tenses & Conditionals (시제와 가정법)",
    description: "Master the timeline of actions and hypothetical situations.",
    questions: [
      { q: "By the time we arrive, the movie _____.", options: ["will start", "will have started", "started", "starts"], answer: 1, exp: "Future Perfect tense is used for an action that will be completed before a specific time in the future.", expKo: "미래완료 시제는 미래의 특정 시점 이전에 완료될 동작에 사용됩니다. (도착할 때쯤이면 이미 시작했을 것이다)" },
      { q: "If I _____ you, I would accept the offer.", options: ["was", "am", "were", "have been"], answer: 2, exp: "In the subjunctive mood (hypothetical situations), 'were' is used for all subjects.", expKo: "가정법 과거(현재의 반대 상황 가정)에서는 주어에 상관없이 be동사로 'were'를 사용합니다." },
      { q: "She has been working here _____ five years.", options: ["since", "for", "during", "while"], answer: 1, exp: "'For' is used with a duration of time, while 'since' is used with a starting point.", expKo: "'For'는 기간(5년 동안)과 함께 쓰이고, 'since'는 시작 시점과 함께 쓰입니다." }
    ]
  },
  {
    id: 3,
    title: "Prepositions & Articles (전치사와 관사)",
    description: "Tricky small words that change meaning.",
    questions: [
      { q: "He is accused _____ stealing the money.", options: ["for", "with", "of", "on"], answer: 2, exp: "The correct collocation is 'accused of'.", expKo: "'~로 고소당하다/비난받다'는 숙어적으로 'accused of'를 사용합니다." },
      { q: "I prefer coffee _____ tea.", options: ["than", "to", "from", "over"], answer: 1, exp: "With the verb 'prefer', we use 'to' for comparison, not 'than'.", expKo: "'prefer' 동사를 사용하여 비교할 때는 'than' 대신 'to'를 사용합니다 (prefer A to B)." },
      { q: "She is _____ honest person.", options: ["a", "an", "the", "X"], answer: 1, exp: "'Honest' starts with a vowel sound (silent 'h'), so 'an' is used.", expKo: "'Honest'는 자음 h로 시작하지만 발음이 모음(o)으로 시작하므로 관사 'an'을 씁니다." }
    ]
  },
  {
    id: 4,
    title: "Participles & Passive Voice (분사와 수동태)",
    description: "Active vs Passive and -ing/-ed adjectives.",
    questions: [
      { q: "The book was _____ by a famous author.", options: ["wrote", "written", "writing", "write"], answer: 1, exp: "Passive voice requires 'be verb + past participle (V3)'.", expKo: "수동태는 'be동사 + 과거분사(p.p)' 형태를 취합니다." },
      { q: "I was _____ by the news.", options: ["shocking", "shocked", "shock", "shocks"], answer: 1, exp: "Use -ed adjectives to describe feelings. -ing adjectives describe the cause.", expKo: "감정을 느낄 때는 -ed 형태(과거분사)를 사용합니다. (뉴스가 충격적인 것(shocking)이고, 나는 충격을 받은 것(shocked))" },
      { q: "_____ the room, he turned on the light.", options: ["Enter", "Entering", "Entered", "Enters"], answer: 1, exp: "Present participle (Entering) is used to show simultaneous actions by the same subject.", expKo: "동일한 주어가 수행하는 동시 동작을 나타낼 때 현재분사(Entering) 구문을 사용합니다." }
    ]
  },
  {
    id: 5,
    title: "Relative Clauses & Conjunctions (관계사와 접속사)",
    description: "Connecting ideas logically.",
    questions: [
      { q: "This is the house _____ I was born.", options: ["which", "that", "where", "when"], answer: 2, exp: "'Where' is a relative adverb used for places.", expKo: "장소를 수식하는 관계부사는 'where'입니다. (which를 쓰려면 in which가 되어야 함)" },
      { q: "_____ it rained, we played soccer.", options: ["Despite", "Although", "Because", "However"], answer: 1, exp: "'Although' is a conjunction followed by a clause (S+V). 'Despite' requires a noun phrase.", expKo: "'Although'는 접속사로 뒤에 절(주어+동사)이 옵니다. 'Despite'는 전치사로 뒤에 명사가 옵니다." },
      { q: "He studied hard; _____, he failed the test.", options: ["therefore", "however", "because", "so"], answer: 1, exp: "The transition indicates a contrast between studying hard and failing.", expKo: "열심히 공부한 것과 시험에 떨어진 것 사이의 대조를 나타내므로 역접의 'however'가 적절합니다." }
    ]
  }
];

// Reading Categories
const READING_CATEGORIES = [
  { id: 'Science', label: 'Science (과학)', icon: '🔬' },
  { id: 'Humanities', label: 'Humanities (인문학)', icon: '🏛️' },
  { id: 'History', label: 'History (역사)', icon: '📜' },
  { id: 'Social Science', label: 'Social Science (사회과학)', icon: '⚖️' },
  { id: 'Literature', label: 'Literature (문학)', icon: '📚' }
];

// Interest Tags
const INTEREST_TAGS = [
  "Humanities (인문학)", "Science (과학)", "Economics/Biz (경제/경영)", 
  "Diplomacy (외교)", "Politics (정치)", "Art (예술)", "Sports (스포츠)", 
  "Tech (기술)", "Literature (문학)"
];

// Mock Data Generator for Reading
const getReadingMockData = (level, category) => {
  if (level === 'Junior') {
    return {
      title: `${category}: Understanding Basic Concepts`,
      source: `Junior ${category} Weekly`,
      text: `(This is a generated practice text for ${category}.) \n\nUnderstanding ${category} is essential for young students. It helps us comprehend how the world works, from the smallest atoms to the largest societies. For example, in ${category}, we learn about cause and effect relationships that shape our daily lives. \n\nMoreover, studying this subject encourages critical thinking. When we ask questions about why things happen, we are engaging in the core practice of ${category}. It is not just about memorizing facts, but about understanding the underlying principles that govern our reality.`,
      fullTranslation: `(${category}를 위한 생성된 연습 지문입니다.) \n\n${category}를 이해하는 것은 어린 학생들에게 필수적입니다. 그것은 우리가 원자에서 거대 사회에 이르기까지 세상이 어떻게 작동하는지 이해하도록 돕습니다. 예를 들어, ${category}에서 우리는 일상 생활을 형성하는 인과 관계에 대해 배웁니다. \n\n게다가, 이 과목을 공부하는 것은 비판적 사고를 장려합니다. 왜 그런 일이 일어나는지에 대해 질문할 때, 우리는 ${category}의 핵심 실천에 참여하는 것입니다. 그것은 단순히 사실을 암기하는 것이 아니라, 우리의 현실을 지배하는 근본 원리를 이해하는 것입니다.`,
      questions: [
        {
          q: `According to the passage, why is studying ${category} important?`,
          options: ["It helps us memorize facts.", "It explains cause and effect relationships.", "It makes us famous.", "It is easy to learn."],
          answer: 1,
          explanation: "The text states it helps us comprehend how the world works and learn about cause and effect relationships.",
          explanationKo: "지문은 이 과목이 세상이 어떻게 작동하는지 이해하고 인과 관계에 대해 배우는 데 도움을 준다고 명시하고 있습니다."
        },
        {
          q: "What is mentioned as a core practice of this subject?",
          options: ["Sleeping early.", "Asking questions about why things happen.", "Eating healthy food.", "Playing video games."],
          answer: 1,
          explanation: "The text says 'When we ask questions about why things happen, we are engaging in the core practice'.",
          explanationKo: "지문에서 '왜 그런 일이 일어나는지에 대해 질문할 때'가 핵심 실천이라고 언급되어 있습니다."
        }
      ]
    };
  } else {
    return {
      title: `${category}: A Comprehensive Analysis`,
      source: `Standard ${category} Review`,
      text: `The study of ${category} provides a vital window into the complexities of human existence and the natural world. Unlike simple observation, which relies on surface-level perception, ${category} requires a rigorous methodology to separate fact from opinion. This discipline demands that scholars not only gather data but also synthesize it into coherent theories that can withstand critical scrutiny. By doing so, it allows us to construct a more accurate framework for understanding the mechanisms that drive our reality.\n\nHistorically, scholars have debated the best approaches to this field, often leading to paradigm shifts that redefine our understanding. In the early days, ${category} was often intertwined with philosophy and religion, lacking the empirical rigor we expect today. However, the Enlightenment and the Scientific Revolution brought about a fundamental change. Thinkers began to prioritize observation and experimentation, laying the groundwork for modern methodologies. This historical evolution is crucial because it reminds us that our current knowledge is not static but the result of centuries of refinement.\n\nIn the modern era, ${category} has evolved in tandem with rapid technological advancements. We now have tools to analyze data and trends that were previously invisible to the naked eye or beyond human calculation. For instance, digital archives and big data analytics allow researchers to spot patterns across vast timelines or datasets. Yet, technology is a double-edged sword; while it democratizes access to information, it also requires practitioners to be more vigilant about data verification and source credibility.\n\nDespite these advancements, the core challenges of ${category} remain. One of the most persistent issues is the problem of bias—both in the sources we study and in the researchers themselves. Objectivity is an ideal to strive for, but total neutrality is often impossible. Therefore, a key component of advanced study in this field is learning to identify and mitigate these biases. This critical self-awareness distinguishes a novice from an expert.\n\nUltimately, the fundamental goal remains the same: to uncover the truth about our universe or our society. Whether analyzing historical texts, scientific data, or social behaviors, the pursuit of knowledge in ${category} demands both intellectual discipline and creative insight. It is not merely an academic exercise but a necessary endeavor to navigate the complexities of the future.`,
      fullTranslation: `${category}에 대한 연구는 인간 존재와 자연 세계의 복잡성을 들여다볼 수 있는 중요한 창을 제공합니다. 표면적인 인식에 의존하는 단순한 관찰과 달리, ${category}는 사실과 의견을 분리하기 위해 엄격한 방법론을 요구합니다. 이 학문은 학자들이 단순히 데이터를 수집하는 것뿐만 아니라 비판적 검증을 견딜 수 있는 일관된 이론으로 통합할 것을 요구합니다. 그렇게 함으로써 우리는 현실을 구동하는 메커니즘을 이해하기 위한 더 정확한 틀을 구축할 수 있습니다.\n\n역사적으로 학자들은 이 분야에 대한 최선의 접근 방식에 대해 논쟁해 왔으며, 이는 종종 우리의 이해를 재정의하는 패러다임 전환으로 이어졌습니다. 초기에 ${category}는 종종 철학 및 종교와 얽혀 있었으며, 오늘날 우리가 기대하는 경험적 엄격함이 부족했습니다. 그러나 계몽주의와 과학 혁명은 근본적인 변화를 가져왔습니다. 사상가들은 관찰과 실험을 우선시하기 시작했고, 현대적 방법론의 기초를 닦았습니다. 이러한 역사적 진화는 현재의 지식이 고정된 것이 아니라 수세기 동안의 정제의 결과임을 상기시켜 주기 때문에 중요합니다.\n\n현대에 들어 ${category}는 급속한 기술 발전과 함께 진화했습니다. 우리는 이제 육안으로는 보이지 않거나 인간의 계산 능력을 넘어서는 데이터와 추세를 분석할 수 있는 도구를 갖게 되었습니다. 예를 들어, 디지털 아카이브와 빅 데이터 분석을 통해 연구자들은 방대한 시간대나 데이터 세트에서 패턴을 발견할 수 있습니다. 그러나 기술은 양날의 검입니다. 정보에 대한 접근을 민주화하지만, 동시에 실무자들이 데이터 검증과 출처의 신뢰성에 대해 더 경계할 것을 요구합니다.\n\n이러한 발전에도 불구하고 ${category}의 핵심 과제는 여전히 남아 있습니다. 가장 지속적인 문제 중 하나는 우리가 연구하는 소스와 연구자 자신 모두에게 존재하는 편향의 문제입니다. 객관성은 추구해야 할 이상이지만, 완전한 중립성은 종종 불가능합니다. 따라서 이 분야의 심화 학습에서 핵심적인 요소는 이러한 편향을 식별하고 완화하는 방법을 배우는 것입니다. 이러한 비판적 자기 인식이 초보자와 전문가를 구별합니다.\n\n궁극적으로 근본적인 목표는 동일합니다. 즉, 우리 우주나 사회에 대한 진실을 밝혀내는 것입니다. 역사 텍스트, 과학 데이터, 또는 사회적 행동을 분석하든, ${category}에서의 지식 추구는 지적 규율과 창의적 통찰력 모두를 요구합니다. 이것은 단순한 학문적 연습이 아니라 미래의 복잡성을 헤쳐나가기 위한 필수적인 노력입니다.`,
      questions: [
        {
          q: `What distinguishes ${category} from simple observation according to paragraph 1?`,
          options: ["It relies on surface-level perception.", "It requires a rigorous methodology.", "It gathers data without synthesis.", "It is based on opinions."],
          answer: 1,
          explanation: "Paragraph 1 states that unlike simple observation, this field 'requires a rigorous methodology to separate fact from opinion'.",
          explanationKo: "1문단에서 단순 관찰과 달리 이 분야는 '사실과 의견을 분리하기 위해 엄격한 방법론을 요구한다'고 명시하고 있습니다."
        },
        {
          q: "How did the Enlightenment affect this field?",
          options: ["It merged the field with religion.", "It discouraged experimentation.", "It prioritized observation and experimentation.", "It made knowledge static."],
          answer: 2,
          explanation: "Paragraph 2 mentions that thinkers began to 'prioritize observation and experimentation', laying the groundwork for modern methodologies.",
          explanationKo: "2문단은 사상가들이 '관찰과 실험을 우선시하기 시작'하여 현대적 방법론의 기초를 닦았다고 언급합니다."
        },
        {
          q: "What is described as a 'double-edged sword' in the modern era?",
          options: ["The rigorous methodology.", "Technological advancements.", "Historical debates.", "The peer review process."],
          answer: 1,
          explanation: "Paragraph 3 explicitly calls technology a 'double-edged sword' because it democratizes access but requires vigilance.",
          explanationKo: "3문단에서 기술을 '양날의 검'이라고 명시적으로 표현하며, 이는 접근성을 높이지만 경계심도 요구하기 때문입니다."
        },
        {
          q: "According to the text, what distinguishes a novice from an expert?",
          options: ["The ability to use big data.", "Total neutrality.", "Critical self-awareness regarding bias.", "Memorization of facts."],
          answer: 2,
          explanation: "Paragraph 4 states that 'learning to identify and mitigate these biases... distinguishes a novice from an expert'.",
          explanationKo: "4문단은 '편향을 식별하고 완화하는 것을 배우는 것... 즉 비판적 자기 인식'이 초보자와 전문가를 구별한다고 말합니다."
        },
        {
          q: "The pursuit of knowledge in this field demands:",
          options: ["Only creativity.", "Only discipline.", "Both intellectual discipline and creative insight.", "Neither."],
          answer: 2,
          explanation: "The conclusion states it demands 'both intellectual discipline and creative insight'.",
          explanationKo: "결론 부분에서 '지적 규율과 창의적 통찰력 모두'를 요구한다고 명시되어 있습니다."
        }
      ]
    };
  }
};

const ADVANCED_STYLES = [
  { id: 'nyt', name: "Analytical Opinion (Column Style)" },
  { id: 'scientific', name: "Scientific Inquiry (Journal Style)" },
  { id: 'economist', name: "Economic Briefing (Global Analysis)" }, 
  { id: 'atlantic', name: "Humanities Review (Essay Style)" }
];

// --- Helper Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg disabled:bg-indigo-300",
    secondary: "bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 disabled:bg-gray-100",
    outline: "border-2 border-gray-200 text-gray-600 hover:border-indigo-600 hover:text-indigo-600",
    ghost: "text-gray-600 hover:bg-gray-100",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm"
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
    gray: 'bg-gray-100 text-gray-800'
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

// --- Main Application Component ---

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [view, setView] = useState('landing');
  const [loading, setLoading] = useState(true);

  // 세션 저장
  useEffect(() => {
    if (userData && user) {
      localStorage.setItem('user_session', JSON.stringify({
        userData: user,
        userDataDetails: userData,
        timestamp: Date.now()
      }));
    }
  }, [userData, user]);
  // 1. Initial Auth Check
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        } else {
          setView('landing');
        }
        setLoading(false);
      } catch (error) {
        console.error("Auth init failed:", error);
        setLoading(false);
      }
    };
    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (!session?.user) setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 2. Fetch User Data when User updates
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
          
          if (error) {
            console.error("Profile fetch error:", error);
          }
          
          if (data) {
            setUserData(data);
            setView((currentView) => currentView === 'landing' ? 'learninghub' : currentView);
          } else {
            // user가 users 테이블에 없으면 자동 생성
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: user.id,
                email: user.email || 'anonymous@temp.com',
                nickname: 'Student',
                points: 0
              });
            
            if (insertError) {
              console.error("Auto user creation error:", insertError);
            } else {
              // 다시 fetch
              const { data: newData } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();
              
              if (newData) {
                setUserData(newData);
              }
            }
          }
        } catch (error) {
          console.error("Profile fetch failed:", error);
        }
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  // Global Logging Function
  const logActivity = async (type, details, durationSeconds = 0, score = 0) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('activity_logs')
        .insert({
          user_id: user.id,
          activity_type: type,
          module: type,
          details: { description: details },
          duration_seconds: Math.round(durationSeconds),
          score: score,
          created_at: new Date().toISOString()
        });
      
      if (error) {
        console.error("Activity log error:", error);
        return;
      }
      
      if (score > 0) {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('points')
          .eq('id', user.id)
          .maybeSingle();
        
        if (fetchError) {
          console.error("Points fetch error:", fetchError);
          return;
        }
        
        const newPoints = (data?.points || 0) + score;
        
        const { error: updateError } = await supabase
          .from('users')
          .update({ points: newPoints })
          .eq('id', user.id);
        
        if (updateError) {
          console.error("Points update error:", updateError);
          return;
        }
        
        setUserData(prev => ({ ...prev, points: newPoints }));
      }
    } catch (error) {
      console.error("Logging failed:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-indigo-600 animate-pulse">Loading Valosoreum...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/*" element={
          <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
            {view === 'landing' && <LandingPage setView={setView} user={user} setUserData={setUserData} />}
            {view === 'onboarding' && <Onboarding setView={setView} user={user} setUserData={setUserData} />}
            
            {!['landing', 'onboarding'].includes(view) && (
              <div className="flex flex-col md:flex-row min-h-screen">
                  <Sidebar view={view} setView={setView} userData={userData} setUser={setUser} setUserData={setUserData} />                <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen bg-slate-50">
                  {view === 'learninghub' && <LearningHub setView={setView} userData={userData} />}
                  {view === 'vocab' && <VocabModule logActivity={logActivity} user={user} />}
                  {view === 'writing' && <WritingModule logActivity={logActivity} user={user} />}
                  {view === 'reading' && <ReadingModule logActivity={logActivity} user={user} />}
                  {view === 'grammar' && <GrammarModule logActivity={logActivity} user={user} />}
                  {view === 'mypage' && <MyPage userData={userData} user={user} />}
                </main>
              </div>
            )}
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;

// --- Sub-Components ---

const LandingPage = ({ setView, user, setUserData }) => {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) return alert("Please enter a valid school email.");
    if (!password) return alert("Please enter a password.");
    if (!nickname && !isLogin) return alert("Please enter a nickname for signup.");
    if (!agreedToTerms && !isLogin) return alert("You must agree to the Terms of Service and AI Content Disclaimer to continue.");

    try {
      if (isLogin) {
        // 로그인
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) {
          alert("Login failed: " + authError.message);
          return;
        }
        
        // users 테이블에서 추가 정보 가져오기
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();
        
        if (userData) {
          setUserData(userData);
          setView('learninghub');
        } else {
          // Auth는 있는데 users 테이블에 없으면 onboarding
          setView('onboarding');
        }
        
      } else {
        // 회원가입
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (authError) {
          alert("Sign up failed: " + authError.message);
          return;
        }
        
        // users 테이블에 추가 정보 저장
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            nickname,
            points: 0
          });
        
        if (insertError) {
          console.error("Insert error:", insertError);
          alert("Failed to create profile: " + insertError.message);
          return;
        }
        
        setView('onboarding');
      }
    } catch (err) {
      console.error("Auth Error:", err);
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center bg-indigo-600 text-white">
          <div className="flex justify-center mb-4"><GraduationCap size={48} /></div>
          <h1 className="text-3xl font-bold mb-2">Truth Review</h1>
          <p className="text-indigo-200 font-light tracking-widest uppercase">Valosoreum</p>
        </div>
        <form onSubmit={handleLogin} className="p-8 space-y-6">
          <div className="flex justify-center gap-4 border-b border-gray-100 pb-4">
            <button type="button" onClick={() => setIsLogin(true)} className={`text-sm font-bold ${isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}>LOGIN</button>
            <button type="button" onClick={() => setIsLogin(false)} className={`text-sm font-bold ${!isLogin ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-400'}`}>SIGN UP</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">School Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="student@school.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="********" />
          </div>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nickname</label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Your name" />
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the{' '}
                    <button 
                      type="bFtutton"
                      onClick={(e) => { e.preventDefault(); setShowDisclaimer(true); }}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Terms of Service and AI Content Disclaimer
                    </button>
                    {' '}(Required)
                  </span>
                </label>
              </div>
            </>
          )}
          <Button className="w-full justify-center" disabled={!isLogin && !agreedToTerms}>
            {isLogin ? "Enter Class" : "Join Class"}
          </Button>
        </form>
      </div>
      
      <DisclaimerModal 
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAgree={() => {
          setAgreedToTerms(true);
          setShowDisclaimer(false);
        }}
      />
    </div>
  );
};


// --- Disclaimer Modal ---
const DisclaimerModal = ({ isOpen, onClose, onAgree }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-3xl max-h-[80vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Truth Review 서비스 AI 활용 및 저작권 고지</h2>
        
        <div className="space-y-4 text-sm text-gray-700">
          <section>
            <h3 className="font-bold text-lg mb-2">1) AI 생성 콘텐츠의 범위</h3>
            <p className="mb-2">본 Truth Review(Valosoreum) 웹사이트에서 제공되는 다음 학습 콘텐츠 및 피드백 기능은 인공지능(AI) 모델을 활용하여 생성 및 제공됩니다.</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Vocabulary/Grammar: 자동 문제 생성 및 해설</li>
              <li>Reading: 독해 지문, 문제 구성, 해설 및 전체 해석</li>
              <li>Writing: 글쓰기 주제 제시 및 제출된 글에 대한 채점, 개선점 및 피드백</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2">2) 저작권 및 면책 조항</h3>
            <ul className="list-disc list-inside ml-4 space-y-2">
              <li><strong>독창성 노력:</strong> 이 웹사이트는 AI 모델이 학습 데이터를 기반으로 새롭고 독창적인 학습 지문 및 문제를 생성하도록 프롬프트 엔지니어링을 적용하고 있습니다.</li>
              <li><strong>우발적 유사성:</strong> 그럼에도 불구하고, AI가 생성한 콘텐츠가 기존에 출판된 특정 저작물과 우발적으로 유사하거나 일부 저작권을 침해할 가능성을 완전히 배제할 수 없습니다. 이 웹사이트는 이에 대해 명시적인 보증을 제공하지 않습니다.</li>
              <li><strong>사용자의 책임:</strong> 사용자는 제공된 학습 콘텐츠를 개인 학습 목적으로만 사용해야 하며, 이를 복제, 배포 또는 상업적으로 이용할 수 없습니다.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2">3) 저작권 침해 신고 및 조치</h3>
            <p className="mb-2">본 서비스의 콘텐츠가 귀하 또는 제3자의 저작권을 침해한다고 판단될 경우, 당사(hj040701.lee@gmail.com)로 즉시 신고해 주시기 바랍니다.</p>
            <p>신고 접수 후 사실 관계 확인을 거쳐, 침해가 명백한 콘텐츠는 즉시 삭제 또는 수정하는 조치를 취하겠습니다.</p>
          </section>

          <section>
            <h3 className="font-bold text-lg mb-2">4) 데이터 활용 및 개인정보</h3>
            <p className="mb-2">학생이 제출한 글쓰기 및 학습 기록 데이터는 오직 서비스 개선, 맞춤형 학습 분석(My Page 분석 및 Action Plan 등), 그리고 AI 모델의 성능 향상 목적으로만 활용됩니다.</p>
          </section>
        </div>

        <div className="flex gap-4 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={onAgree} className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            I Agree
          </button>
        </div>
      </div>
    </div>
  );
};

const Onboarding = ({ setView, user, setUserData }) => {
  const [grade, setGrade] = useState('');
  const [gender, setGender] = useState('');
  const [level, setLevel] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [avgTime, setAvgTime] = useState('');
  const [targetMajor, setTargetMajor] = useState('');
  const [interests, setInterests] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const toggleInterest = (tag) => {
    if (interests.includes(tag)) {
      setInterests(interests.filter(i => i !== tag));
    } else {
      setInterests([...interests, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!grade || !gender || !level || !schoolName || !avgTime || !targetMajor || interests.length === 0) {
      return alert("Please fill in all fields.");
    }
    
    const updates = { 
      grade: parseInt(grade), 
      gender, 
      level,
      school_name: schoolName,
      avg_time: avgTime, 
      target_major: targetMajor, 
      interests
    };
    
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id);
    
    if (error) {
      console.error("Update error:", error);
      alert("Failed to update profile: " + error.message);
      return;
    }
    
    setUserData(prev => ({ ...prev, ...updates }));
    setView('learninghub');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="max-w-2xl w-full my-8">
        <h2 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Grade Level</label>
              <select className="w-full p-2 border rounded-lg" value={grade} onChange={e => setGrade(e.target.value)}>
                <option value="">Select Grade</option>
                <option value="6">Grade 6 (초6)</option>
                <option value="7">Grade 7 (중1)</option>
                <option value="8">Grade 8 (중2)</option>
                <option value="9">Grade 9 (중3)</option>
                <option value="10">Grade 10 (고1)</option>
                <option value="11">Grade 11 (고2)</option>
                <option value="12">Grade 12 (고3)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <div className="flex gap-4">
                {['Male', 'Female'].map(g => (
                  <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2 rounded-lg border ${gender === g ? 'bg-indigo-600 text-white' : 'border-gray-300 hover:bg-gray-50'}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">School Name (학교명)</label>
              <input 
                type="text" 
                value={schoolName}
                onChange={e => setSchoolName(e.target.value)}
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="e.g. Seoul International School"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">English Proficiency</label>
              <div className="grid grid-cols-1 gap-2">
                {['Beginner', 'Intermediate', 'Advanced'].map(l => (
                  <button key={l} onClick={() => setLevel(l)} className={`p-2 text-left rounded-lg border ${level === l ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'border-gray-200 hover:bg-gray-50'}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium mb-2">Avg. Daily Learning Time</label>
               <select className="w-full p-2 border rounded-lg" value={avgTime} onChange={e => setAvgTime(e.target.value)}>
                 <option value="">Select Time</option>
                 <option value="< 30 min">Less than 30 mins</option>
                 <option value="30-60 min">30 mins - 1 hour</option>
                 <option value="1-2 hours">1 - 2 hours</option>
                 <option value="2+ hours">More than 2 hours</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-2">Target Major (목표 전공)</label>
               <input 
                 type="text" 
                 value={targetMajor}
                 onChange={e => setTargetMajor(e.target.value)}
                 className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500" 
                 placeholder="e.g. Computer Science, Economics"
               />
            </div>
            <div>
               <label className="block text-sm font-medium mb-2">Preferred Reading Topics</label>
               <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                 {INTEREST_TAGS.map(tag => (
                   <button 
                     key={tag} 
                     onClick={() => toggleInterest(tag)}
                     className={`text-xs px-2 py-1 rounded-full border transition-colors ${interests.includes(tag) ? 'bg-purple-100 border-purple-500 text-purple-900' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                   >
                     {tag}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        </div>

        <Button 
          className="w-full justify-center mt-4" 
          onClick={handleSubmit}
        >
          Start Learning Journey
        </Button>
      </Card>
      
      <DisclaimerModal 
        isOpen={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        onAgree={() => {
          setAgreedToTerms(true);
          setShowDisclaimer(false);
        }}
      />
    </div>
  );
};

const Sidebar = ({ view, setView, userData, setUser, setUserData }) => {
  const handleSignOut = async () => {
    try {
      localStorage.clear();
      await supabase.auth.signOut();
      setUser(null);
      setUserData(null);
      window.location.reload();
    } catch (error) {
      console.error("Sign out error:", error);
      alert("Failed to sign out");
    }
  };

  const menuItems = [
    { id: 'learninghub', icon: LayoutDashboard, label: 'Learning Hub' },
    { id: 'vocab', icon: BookOpen, label: 'Vocabulary' },
    { id: 'grammar', icon: CheckCircle2, label: 'Grammar' },
    { id: 'writing', icon: PenTool, label: 'Writing' },
    { id: 'reading', icon: Search, label: 'Reading' },
    { id: 'mypage', icon: User, label: 'My Page' },
  ];

  return (
    <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
      <div className="p-6 border-b border-gray-100 cursor-pointer hover:bg-indigo-50 transition-colors" onClick={() => setView('learninghub')}>
        <h2 className="font-bold text-xl text-indigo-900">Truth Review</h2>
        <p className="text-xs text-indigo-500 tracking-wider">VALOSOREUM</p>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold uppercase">{userData?.nickname ? userData.nickname.charAt(0) : 'U'}</div>
          <div className="flex flex-col">
            <span className="font-medium truncate max-w-[120px]">{userData?.nickname || 'Student'}</span>
            <span className="text-xs text-yellow-600 flex items-center gap-1"><Trophy size={10} /> {userData?.points || 0} points</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === item.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}>
            <item.icon size={18} /> {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-100 mt-auto">
        <button onClick={handleSignOut} className="flex items-center gap-2 text-gray-500 hover:text-red-600 text-sm"><LogOut size={16} /> Sign Out</button>
      </div>
    </div>
  );
};

const LearningHub = ({ setView, userData }) => (
  <div className="space-y-8">
    {/* Hero Banner */}
    <div className="relative h-96 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl overflow-hidden bg-cover bg-center" style={{backgroundImage: 'url(/main.png)'}}>      <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded w-fit mb-4">FEATURED STORY</span>
        <h2 className="text-4xl font-bold mb-2">Prove Your Value Through Courage</h2>
      </div>
    </div>

    {/* Study Areas */}
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-bold text-gray-900">Study Areas</h3>
      <button className="text-sm text-gray-600 hover:text-indigo-600 font-medium">VIEW ALL</button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { title: "Vocabulary", desc: "Expand your lexicon with daily words and contextual usage examples.", icon: BookOpen, color: "text-blue-500", id: 'vocab' },
        { title: "Grammar", desc: "Master the structure of language with clear rules and practice.", icon: CheckCircle2, color: "text-green-500", id: 'grammar' },
        { title: "Writing", desc: "Express your thoughts clearly and persuasively through essays.", icon: PenTool, color: "text-purple-500", id: 'writing' },
        { title: "Reading", desc: "Deep dive into texts to enhance comprehension and critical thinking.", icon: Search, color: "text-orange-500", id: 'reading' }
      ].map((card) => (
        <button key={card.title} onClick={() => setView(card.id)} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left group">
          <card.icon size={32} className={`${card.color} mb-4`} />
          <h3 className="font-bold text-lg text-gray-900 mb-2">{card.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
        </button>
      ))}
    </div>

    {/* Robinson Review Banner */}
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <a 
        href="https://www.robinsonreview.org" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col md:flex-row items-center gap-4 md:gap-8 p-4 md:p-8 hover:bg-gray-50 transition-colors"
      >
        <div className="w-full md:flex-[4]">
          <img 
            src="/robins.png" 
            alt="The Robinson Review" 
            className="w-full h-auto object-contain"
          />
        </div>
        <div className="w-full md:flex-[6]">
          <p className="text-gray-700 text-sm md:text-5xl leading-relaxed">
            <span className="font-bold">"The Robinson Review</span>, founded by Yechan Kim in 2022, 
            connects aspiring student journalists to a global audience. 
            Visit our website to explore a wide range of articles and 
            gain diverse insights across various fields."
          </p>
        </div>
      </a>
    </div>
    </div>
);

// --- Module: Vocabulary ---
const VocabModule = ({ logActivity, user }) => {
  const [mode, setMode] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [wrongWords, setWrongWords] = useState([]);
  const [showReview, setShowReview] = useState(false);
  const [vocabSet, setVocabSet] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userGrade, setUserGrade] = useState(null);
  const startTime = useRef(Date.now());

  // 사용자 Grade 가져오기
  useEffect(() => {
    const fetchUserGrade = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('grade')
        .eq('id', user.id)
        .maybeSingle();
      setUserGrade(data?.grade || 9);
    };
    fetchUserGrade();
  }, [user]);

  // GPT API로 단어 생성
  const generateVocab = async (type) => {
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const grade = userGrade || 9;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Generate 5 COMPLETELY NEW and DIFFERENT ${type} vocabulary words appropriate for Grade ${grade} international school students. 

IMPORTANT: Create words that are UNIQUE and NOT commonly used in typical ${type} lists. Avoid repetitive or similar words from previous generations. Use diverse and uncommon vocabulary.

For each word, provide:
1. The word (must be diverse and uncommon)
2. Korean meaning
3. 3 incorrect Korean meanings (plausible distractors)

Return ONLY a JSON array with this exact format:
[
  {
    "word": "example",
    "meaning": "예시",
    "options": ["예시", "오답1", "오답2", "오답3"]
  }
]

Make sure the correct meaning is always included in the options array.`
          }],
          temperature: 1.0
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const vocabData = JSON.parse(jsonMatch[0]);
      
      setVocabSet(vocabData);
      setLoading(false);
    } catch (error) {
      console.error("GPT API Error:", error);
      alert("Failed to generate vocabulary. Using default set.");
      setVocabSet(VOCAB_SETS[type]);
      setLoading(false);
    }
  };

  const handleAnswer = async (option) => {
    if (feedback) return;

    const currentQ = vocabSet[currentQuestion % vocabSet.length];
    const isRight = option === currentQ.meaning;
    
    if (isRight) {
      setScore(s => s + 10);
      setFeedback({ type: 'correct', answer: currentQ.meaning });
    } else {
      setHearts(h => h - 1);
      setFeedback({ type: 'wrong', answer: currentQ.meaning, selected: option });
      
      setWrongWords(prev => [...prev, { word: currentQ.word, meaning: currentQ.meaning }]);
      
      try {
        const { data: existing } = await supabase
          .from('wrong_words')
          .select('*')
          .eq('user_id', user.id)
          .eq('word', currentQ.word)
          .maybeSingle();
        
        if (existing) {
          await supabase
            .from('wrong_words')
            .update({ 
              wrong_count: existing.wrong_count + 1,
              last_wrong_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('wrong_words')
            .insert({
              user_id: user.id,
              word: currentQ.word,
              meaning: currentQ.meaning,
              vocab_type: mode,
              wrong_count: 1
            });
        }
      } catch (error) {
        console.error("Wrong word save error:", error);
      }
    }

    setTotalAnswered(t => t + 1);

    setTimeout(() => {
      setFeedback(null);
      
      if (!isRight && hearts <= 1) {
        finishGame();
      } else {
        const nextQ = currentQuestion + 1;
        if (nextQ % vocabSet.length === 0) {
          // 5개 문제 끝났으면 새로운 세트 생성
          setCurrentQuestion(0); // 인덱스 리셋
          generateVocab(mode);
        } else {
          setCurrentQuestion(nextQ);
        }
      }
    }, 2000);
  };

  const finishGame = () => {
    const duration = (Date.now() - startTime.current) / 1000;
    setShowResult(true);
    logActivity('Vocabulary', `${mode} - ${totalAnswered} words (Grade ${userGrade})`, duration, score);
  };

  const resetGame = () => {
    setShowResult(false);
    setMode(null);
    setScore(0);
    setHearts(5);
    setCurrentQuestion(0);
    setTotalAnswered(0);
    setWrongWords([]);
    setShowReview(false);
    setVocabSet([]);
  };

  const startBattle = async (type) => {
    setMode(type);
    startTime.current = Date.now();
    await generateVocab(type);
  };

  const displayOptions = useMemo(() => {
    if (vocabSet.length === 0) return [];
    const q = vocabSet[currentQuestion % vocabSet.length];
    return q?.options.sort(() => Math.random() - 0.5) || [];
  }, [vocabSet, currentQuestion]);

  if (!mode) return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Vocabulary Battle</h2>
      {userGrade && <p className="text-gray-600">Grade {userGrade} Level</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {['TOEFL', 'SAT'].map(type => (
          <button 
            key={type} 
            onClick={() => startBattle(type)} 
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-gray-200 hover:border-indigo-500 transition-all text-center"
          >
            <h3 className="text-3xl font-black text-gray-800 mb-2">{type}</h3>
            <p className="text-gray-500">Grade {userGrade || 9} Vocabulary Battle</p>
            <div className="mt-4 inline-flex items-center text-indigo-600 font-medium">Start <ArrowRight size={16} className="ml-2"/></div>
          </button>
        ))}
      </div>
    </div>
  );

  if (loading || vocabSet.length === 0) return (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Generating Grade {userGrade} vocabulary...</p>
    </div>
  );

  if (showReview) return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <button onClick={() => setShowReview(false)} className="text-sm text-gray-500 hover:text-indigo-600">← Back to Results</button>
      </div>
      <Card>
        <h3 className="text-2xl font-bold mb-4">오답 노트 (Wrong Words Review)</h3>
        {wrongWords.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Perfect! No wrong answers.</p>
        ) : (
          <div className="space-y-3">
            {wrongWords.map((item, idx) => (
              <div key={idx} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="font-bold text-lg text-gray-900">{item.word}</div>
                <div className="text-red-600">→ {item.meaning}</div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );

  if (showResult) return (
    <Card className="text-center max-w-md mx-auto mt-10">
      <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
      <h3 className="text-2xl font-bold mb-2">Battle Complete!</h3>
      <p className="text-gray-600 mb-2">Grade {userGrade} - {mode}</p>
      <p className="text-gray-600 mb-2">You answered <span className="font-bold text-indigo-600">{totalAnswered} words</span></p>
      <p className="text-gray-600 mb-6">Final Score: <span className="font-bold text-indigo-600">{score} points</span></p>
      <div className="flex gap-4 justify-center">
        <Button onClick={() => {
          setShowResult(false);
          setScore(0);
          setHearts(5);
          setCurrentQuestion(0);
          setTotalAnswered(0);
          setWrongWords([]);
          startTime.current = Date.now();
          generateVocab(mode);
        }}>Different Problems</Button>
        {wrongWords.length > 0 && (
          <Button variant="secondary" onClick={() => setShowReview(true)}>Review Wrong Words ({wrongWords.length})</Button>
        )}
      </div>
    </Card>
  );

  const qData = vocabSet[currentQuestion % vocabSet.length];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Badge>{mode} Battle - Grade {userGrade}</Badge>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, idx) => (
            <Heart 
              key={idx} 
              size={24} 
              className={idx < hearts ? "fill-red-500 text-red-500" : "text-gray-300"}
            />
          ))}
        </div>
      </div>
      
      <div className="mb-4 text-center">
        <span className="text-sm text-gray-500">Question #{totalAnswered + 1}</span>
        <span className="ml-4 text-indigo-600 font-bold">{score} Points</span>
      </div>

      <Card className="mb-6 py-12 text-center relative">
        <h2 className="text-4xl font-bold text-indigo-900 mb-2">{qData?.word}</h2>
        <p className="text-gray-400 text-sm">Select the correct meaning</p>
        
        {feedback && (
          <div className={`absolute top-4 right-4 ${feedback.type === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
            {feedback.type === 'correct' ? (
              <div className="flex items-center gap-2 text-xl font-bold">
                <CheckCircle2 size={32} /> Correct!
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xl font-bold">
                <XCircle size={32} /> Wrong!
              </div>
            )}
          </div>
        )}
      </Card>

      {feedback && feedback.type === 'wrong' && (
        <Card className="mb-4 bg-red-50 border-red-200">
          <p className="text-sm text-gray-600 mb-1">Correct Answer:</p>
          <p className="text-lg font-bold text-red-600">{feedback.answer}</p>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayOptions.map((opt, idx) => {
          let btnClass = "p-4 bg-white border border-gray-200 rounded-lg font-medium text-gray-700 transition-all ";
          
          if (feedback) {
            if (opt === qData?.meaning) {
              btnClass += "bg-green-100 border-green-500 text-green-700";
            } else if (feedback.selected === opt) {
              btnClass += "bg-red-100 border-red-500 text-red-700";
            } else {
              btnClass += "opacity-50";
            }
          } else {
            btnClass += "hover:bg-indigo-50 hover:border-indigo-500 cursor-pointer";
          }

          return (
            <button 
              key={idx} 
              onClick={() => handleAnswer(opt)} 
              className={btnClass}
              disabled={!!feedback}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- Module: Writing ---
const WritingModule = ({ logActivity, user }) => {
  const [level, setLevel] = useState(null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userGrade, setUserGrade] = useState(null);
  const [currentTopic, setCurrentTopic] = useState(null);
  const startTime = useRef(Date.now());

  // 사용자 Grade 가져오기
  useEffect(() => {
    const fetchUserGrade = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('grade')
        .eq('id', user.id)
        .maybeSingle();
      setUserGrade(data?.grade || 9);
    };
    fetchUserGrade();
  }, [user]);

  // GPT로 주제 생성
  // GPT로 주제 생성
  const generateTopic = async (selectedLevel) => {
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const grade = userGrade || 9;
      
      let instruction = "";
      if (selectedLevel === 'Beginner') {
        instruction = "Create a simple sentence expansion task. Provide 1 basic sentence and 3-4 helper words (with Korean translations in parentheses).";
      } else if (selectedLevel === 'Intermediate') {
        instruction = "Create a paragraph writing task with a clear opinion prompt. Provide 4-6 helper words (with Korean translations in parentheses) for Claim-Reason-Conclusion structure.";
      } else {
        instruction = "Create an essay prompt with context. Provide 6-8 advanced helper words (with Korean translations in parentheses) for critical analysis.";
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `You are creating a COMPLETELY NEW and UNIQUE writing task for Grade ${grade} international school students at ${selectedLevel} level.

IMPORTANT: Generate a FRESH topic that is DIFFERENT from typical or previous prompts. Use creative angles, current issues, or uncommon perspectives.

${instruction}

Return ONLY a JSON object with this format:
{
  "prompt": "main question or sentence",
  "keywords": ["word1", "word2", "word3"],
  "instruction": "English instruction",
  "instructionKo": "한글 설명",
  "context": "background context (only for Advanced level, otherwise null)"
}

CRITICAL: "keywords" array must contain ONLY English words, NO Korean translations, NO parentheses. Example: ["beautiful", "dreams", "magic"] NOT ["beautiful (아름다운)", "dreams (꿈)"]

Make sure the difficulty matches Grade ${grade} ${selectedLevel} level with varied topics.`
          }],
          temperature: 1.0
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const topicData = JSON.parse(jsonMatch[0]);
      
      setCurrentTopic(topicData);
      setLoading(false);
    } catch (error) {
      console.error("GPT API Error:", error);
      alert("Failed to generate topic. Please try again.");
      setLoading(false);
    }
  };

  const topics = {
    Beginner: {
      7: { prompt: "The cat sat on the mat.", keywords: ["fluffy", "happily", "warm"], instruction: "Use the helper words to expand the sentence.", instructionKo: "도움말 단어를 사용하여 문장을 확장해보세요." },
      8: { prompt: "My favorite season is summer.", keywords: ["beautiful", "enjoy", "outdoor", "activities"], instruction: "Use the helper words to expand the sentence.", instructionKo: "도움말 단어를 사용하여 문장을 확장해보세요." },
      9: { prompt: "Technology has changed our lives.", keywords: ["significantly", "communication", "efficiency", "innovative"], instruction: "Use the helper words to expand the sentence.", instructionKo: "도움말 단어를 사용하여 문장을 확장해보세요." },
      10: { prompt: "Education is important for success.", keywords: ["fundamental", "knowledge", "opportunity", "achievement"], instruction: "Use the helper words to expand the sentence.", instructionKo: "도움말 단어를 사용하여 문장을 확장해보세요." },
      11: { prompt: "Climate change affects our planet.", keywords: ["irreversible", "ecosystem", "sustainable", "mitigation"], instruction: "Use the helper words to expand the sentence.", instructionKo: "도움말 단어를 사용하여 문장을 확장해보세요." },
      12: { prompt: "Artificial intelligence raises ethical questions.", keywords: ["autonomous", "implications", "accountability", "paradigm"], instruction: "Use the helper words to expand the sentence.", instructionKo: "도움말 단어를 사용하여 문장을 확장해보세요." }
    },
    Intermediate: {
      7: { prompt: "Should students have homework?", keywords: ["learning", "practice", "balance", "stress"], instruction: "Write a short paragraph using Claim-Reason-Conclusion.", instructionKo: "주장-근거-마무리 구조로 짧은 문단을 작성하세요." },
      8: { prompt: "Is social media good or bad for students?", keywords: ["communication", "distraction", "relationship", "impact"], instruction: "Write a short paragraph using Claim-Reason-Conclusion.", instructionKo: "주장-근거-마무리 구조로 짧은 문단을 작성하세요." },
      9: { prompt: "Should students wear school uniforms?", keywords: ["mandatory", "equality", "individuality", "distraction", "academic performance", "financial burden"], instruction: "Write a paragraph using Claim-Reason-Conclusion.", instructionKo: "주장-근거-마무리 구조로 문단을 작성하세요." },
      10: { prompt: "Should schools ban smartphones?", keywords: ["productivity", "accessibility", "discipline", "educational tools"], instruction: "Write a paragraph using Claim-Reason-Conclusion.", instructionKo: "주장-근거-마무리 구조로 문단을 작성하세요." },
      11: { prompt: "Is online learning as effective as traditional learning?", keywords: ["flexibility", "engagement", "self-discipline", "interaction"], instruction: "Write a paragraph using Claim-Reason-Conclusion.", instructionKo: "주장-근거-마무리 구조로 문단을 작성하세요." },
      12: { prompt: "Should college education be free?", keywords: ["accessibility", "economic burden", "meritocracy", "investment"], instruction: "Write a paragraph using Claim-Reason-Conclusion.", instructionKo: "주장-근거-마무리 구조로 문단을 작성하세요." }
    },
    Advanced: {
      7: { prompt: "Why is reading important?", keywords: ["imagination", "knowledge", "vocabulary", "critical thinking"], context: "Many students prefer watching videos to reading books.", instruction: "Write a short essay explaining your view.", instructionKo: "당신의 관점을 설명하는 짧은 에세이를 작성하세요." },
      8: { prompt: "How does technology affect friendships?", keywords: ["connection", "face-to-face", "virtual", "authentic"], context: "Students today make friends online and offline.", instruction: "Write a short essay analyzing both sides.", instructionKo: "양면을 분석하는 짧은 에세이를 작성하세요." },
      9: { prompt: "Is competition good for students?", keywords: ["motivation", "pressure", "collaboration", "excellence"], context: "Schools emphasize both competition and teamwork.", instruction: "Write an essay analyzing pros and cons.", instructionKo: "장단점을 분석하는 에세이를 작성하세요." },
      10: { prompt: "Should genetic engineering be allowed?", keywords: ["ethical", "medical advancement", "consequences", "manipulation"], context: "Scientists can now edit human genes.", instruction: "Write an essay with a balanced view.", instructionKo: "균형 잡힌 시각의 에세이를 작성하세요." },
      11: { prompt: "Is Artificial Intelligence a threat to human creativity?", keywords: ["paradigm shift", "intrinsic value", "augmentation", "automation", "ethical implications", "nuance"], context: "With the rise of Generative AI, many artists fear for their jobs.", instruction: "Write a pros/cons essay with critical analysis.", instructionKo: "비판적 분석이 포함된 찬반 에세이를 작성하세요." },
      12: { prompt: "Can technological progress solve climate change?", keywords: ["innovation", "systemic", "sustainability", "anthropocentric", "mitigation", "adaptation"], context: "Some believe technology is the solution, others advocate lifestyle changes.", instruction: "Write a comprehensive essay examining multiple perspectives.", instructionKo: "다양한 관점을 검토하는 포괄적 에세이를 작성하세요." }
    }
  };

  const handleSubmit = async () => {
    if (input.length < 10) return alert("Please write at least 10 characters.");
    
    setLoading(true);
    const topic = currentTopic;
    
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `You are an English writing tutor for Grade ${userGrade} international school students at ${level} level.

TASK: "${topic.prompt}"
REQUIRED HELPER WORDS: ${topic.keywords.join(', ')}

STUDENT'S WRITING:
"${input}"

CRITICAL INSTRUCTIONS:
1. KEYWORD MATCHING RULES (ABSOLUTELY CRITICAL - READ CAREFULLY):
   Step-by-step keyword matching process:
   a) Take the student's ENTIRE text: "${input}"
   b) Convert it to lowercase: "${input.toLowerCase()}"
   c) For each required keyword, convert keyword to lowercase
   d) Check if lowercase_student_text.includes(lowercase_keyword)
   e) If YES → mark as "used", if NO → mark as "missing"
   
   EXAMPLES:
   - Required: "coffee" | Student wrote: "coffeE" → MATCH (coffee = coffee) ✓
   - Required: "coffee" | Student wrote: "COFFEE" → MATCH (coffee = coffee) ✓
   - Required: "friends" | Student wrote: "Friends" → MATCH (friends = friends) ✓
   - Required: "cozy" | Student wrote: "Cozy" → MATCH (cozy = cozy) ✓
   
   DO NOT consider spelling errors in this check - only check if the word appears (case-insensitive).
   Punctuation should be ignored: "cozy," "cozy." "cozy!" all contain "cozy".
2. Evaluate grammar, vocabulary, and structure appropriate for Grade ${userGrade} ${level} level
3. Analyze the logical structure: Claim-Reason-Conclusion (주장-근거-마무리)
4. Assess whether the argument is well-supported with strong evidence
5. Provide ONE total score out of 100
6. If helper words are missing, deduct points significantly
7. **IMPORTANT: For "correctedText", ONLY fix grammar, vocabulary, and sentence structure. DO NOT change the student's main idea or content. Keep the student's original meaning intact.**
8. Provide specific examples of how to strengthen the argument and address counterarguments

RESPOND IN THIS JSON FORMAT ONLY:
{
  "score": 85,
  "usedKeywords": ["fluffy", "warm"],
  "missingKeywords": ["happily"],
  
NOTE: When checking keywords, ignore case differences. "Beautiful", "beautiful", "BEAUTIFUL" are all the same word.
  "originalText": "student's original text",
  "correctedText": "student's text with ONLY grammar/vocabulary fixes, keeping original meaning",
  "structureAnalysis": "Analysis of Claim-Reason-Conclusion structure in English",
  "structureAnalysisKo": "주장-근거-마무리 구조 분석 (한글)",
  "feedback": "English feedback explaining what was good and what needs improvement",
  "feedbackKo": "한글로 피드백 (문법 오류, 개선점 설명)",
  "improvements": ["Fixed grammar error", "Better word choice"],
  "counterargumentExample": "Example of how to address counterarguments (English)",
  "counterargumentExampleKo": "반론 대응 예시 (한글)"
}`
          }],
          temperature: 0.7
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const result = JSON.parse(jsonMatch[0]);
      
      setFeedback(result);
      
      const duration = (Date.now() - startTime.current) / 1000;
      const earnedPoints = Math.round(result.score / 2);
      logActivity('Writing', `${level} - Grade ${userGrade}`, duration, earnedPoints);
      
      setLoading(false);
    } catch (error) {
      console.error("GPT API Error:", error);
      alert("Failed to get feedback. Please try again.");
      setLoading(false);
    }
  };

  if (!level) return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Writing Lab</h2>
      {userGrade && <p className="text-gray-600">Grade {userGrade} Level</p>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Beginner', 'Intermediate', 'Advanced'].map(l => (
          <button key={l} onClick={() => { setLevel(l); startTime.current = Date.now(); generateTopic(l); }} className="p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all">
            <div className="text-lg font-bold text-gray-900 mb-2">{l}</div>
            <div className="text-sm text-gray-500">{l === 'Beginner' ? "Sentence Expansion" : l === 'Intermediate' ? "Logical Structure" : "Essay & Critical Thinking"}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (loading || !currentTopic) return (
    <div className="text-center py-20">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Generating Grade {userGrade} {level} writing task...</p>
    </div>
  );

  const topic = currentTopic;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4">
        <button onClick={() => { setLevel(null); setFeedback(null); setInput(''); setCurrentTopic(null); }} className="text-sm text-gray-500 hover:text-indigo-600 mb-2">← Back to Levels</button>
        <Badge color="purple">{level} Writing - Grade {userGrade}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold text-lg mb-2">Topic</h3>
            <p className="text-gray-800 font-medium mb-4">{topic.prompt}</p>
            {topic.context && <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mb-4">{topic.context}</p>}
            <div className="border-t pt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">Instruction</h4>
              <p className="text-sm font-medium text-gray-900">{topic.instruction}</p>
              {topic.instructionKo && <p className="text-sm text-indigo-600 mt-1 mb-4">{topic.instructionKo}</p>}
              <h4 className="text-xs font-bold text-red-500 uppercase mb-2">⚠️ Required Helper Words (필수 사용)</h4>
              <div className="flex flex-wrap gap-2">
                {topic.keywords?.map((k, i) => <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-bold">{k}</span>)}
              </div>
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <textarea 
            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none resize-none" 
            placeholder="Write your response here..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          ></textarea>
          <Button onClick={handleSubmit} className="w-full" disabled={input.length < 10 || loading}>
            {loading ? "Analyzing..." : "Submit for Review"}
          </Button>
        </div>
      </div>
      {loading && (
        <div className="mt-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">GPT is analyzing your writing...</p>
        </div>
      )}
      {feedback && !loading && (
        <div className="mt-8 animate-fade-in space-y-4">
          <Card className="border-l-4 border-l-purple-500">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-xl">Feedback Report</h3>
              <span className={`text-3xl font-bold ${feedback.score < 50 ? 'text-red-500' : feedback.score < 80 ? 'text-yellow-500' : 'text-green-600'}`}>{feedback.score}/100</span>
            </div>
            
            {/* Helper Words 체크 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-bold text-gray-700 mb-2">Required Words Check:</p>
              <div className="flex flex-wrap gap-2">
                {topic.keywords.map((word, idx) => (
                  <span key={idx} className={`text-xs px-2 py-1 rounded ${feedback.usedKeywords?.includes(word) ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {feedback.usedKeywords?.includes(word) ? '✓' : '✗'} {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Before & After */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs font-bold text-red-600 mb-2">ORIGINAL (원문)</p>
                <p className="text-sm text-gray-800">{feedback.originalText}</p>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs font-bold text-green-600 mb-2">CORRECTED (수정문)</p>
                <p className="text-sm text-gray-800">{feedback.correctedText}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                <p className="text-sm font-bold text-indigo-900 mb-1">💡 Feedback:</p>
                <p className="text-indigo-700 font-medium mb-2">{feedback.feedback}</p>
                <p className="text-sm text-indigo-600 border-t border-indigo-200 pt-2">{feedback.feedbackKo}</p>
              </div>
              
              {feedback.improvements && feedback.improvements.length > 0 && (
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-sm font-bold text-purple-900 mb-2">✨ Key Improvements:</p>
                  <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                    {feedback.improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
                  </ul>
                </div>
              )}
            </div>
          </Card>
          <Button onClick={() => { setFeedback(null); setInput(''); generateTopic(level); }} className="w-full" variant="secondary">Different Problems</Button>
        </div>
      )}
    </div>
  );
};

// --- Module: Reading ---
const ReadingModule = ({ logActivity, user }) => {
  const [level, setLevel] = useState(null);
  const [topicSelection, setTopicSelection] = useState(false);
  const [category, setCategory] = useState(null);
  const [readingState, setReadingState] = useState('selection'); 
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentContent, setCurrentContent] = useState(null);
  const [userGrade, setUserGrade] = useState(null);

  const startTime = useRef(Date.now());

  // 사용자 Grade 가져오기
  useEffect(() => {
    const fetchUserGrade = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('grade')
        .eq('id', user.id)
        .maybeSingle();
      setUserGrade(data?.grade || 9);
    };
    fetchUserGrade();
  }, [user]);

// GPT로 지문 생성
  // GPT로 지문 생성
  const generateReading = async () => {
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const grade = userGrade || 9;
      
      let questionCount = 3;
      let paragraphCount = level === 'Junior' ? "2-3 paragraphs" : "3 paragraphs";
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Create a COMPLETELY NEW and UNIQUE ${level} level reading comprehension passage for Grade ${grade} international school students in the category: ${category}.

IMPORTANT: Generate a passage on a FRESH topic that has NOT been covered before. Use creative angles, recent developments, or uncommon perspectives within the ${category} field. Avoid repetitive themes or standard textbook topics.

Write ${paragraphCount} of academic text appropriate for ${level} level with diverse vocabulary and sentence structures.
Create ${questionCount} multiple-choice questions that test deep comprehension, not just surface details.

Return ONLY a JSON object:
{
  "title": "passage title",
  "source": "source name",
  "text": "full passage text with paragraph breaks",
  "fullTranslation": "전체 지문의 한글 번역",
  "questions": [
    {
      "q": "question text in English",
      "qKo": "질문의 한글 번역",
      "options": ["option1", "option2", "option3", "option4"],
      "optionsKo": ["선지1 한글", "선지2 한글", "선지3 한글", "선지4 한글"],
      "answer": 0,
      "explanation": "English explanation",
      "explanationKo": "한글 해설"
    }
  ]
}

Make the content engaging, educational, and DIFFERENT from typical passages for Grade ${grade} ${level} level.`
          }],
          temperature: 1.0
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      // JSON 내부의 제어 문자 제거
      const cleanedJson = jsonMatch[0].replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      const readingData = JSON.parse(cleanedJson);
      
      setCurrentContent(readingData);
      setLoading(false);
      setReadingState('reading');
      startTime.current = Date.now();
      setUserAnswers({});
      setSubmitted(false);
    } catch (error) {
      console.error("GPT API Error:", error);
      alert("Failed to generate reading. Please try again.");
      setLoading(false);
    }
  };

  const getContent = () => {
    return currentContent;
  };

  const handleLevelSelect = (lvl) => {
    setLevel(lvl);
    setTopicSelection(true);
  };

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    generateReading();
  };

  const finishReading = () => {
    const content = getContent();
    let correctCount = 0;
    content.questions.forEach((q, idx) => { if (userAnswers[idx] === q.answer) correctCount++; });
    const basePoints = level === 'Advanced' ? 50 : level === 'Standard' ? 30 : 20;
    const finalPoints = Math.round(basePoints * (correctCount / content.questions.length));
    setScore(finalPoints);
    setSubmitted(true);
    logActivity('Reading', `${level} - ${category}`, (Date.now() - startTime.current)/1000, finalPoints);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quitReading = () => {
    setReadingState('selection');
    setTopicSelection(false);
    setLevel(null);
    setCategory(null);
    setSubmitted(false);
    setCurrentContent(null);
    setUserAnswers({});
  };

  if (readingState === 'selection') {
    if (!level) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Reading Comprehension</h2>
          {userGrade && <p className="text-gray-600">Grade {userGrade} Level</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['Junior', 'Standard'].map(l => (
              <button key={l} onClick={() => handleLevelSelect(l)} className="p-8 bg-white border border-gray-200 rounded-xl hover:border-orange-500 shadow-sm hover:shadow-lg transition-all text-left">
                <h3 className="text-xl font-bold mb-2">{l} Reading</h3>
                <p className="text-sm text-gray-500">{l === 'Junior' ? "2-3 paragraphs, 3 questions. Basic concepts." : "3 paragraphs, 3 questions. Academic analysis."}</p>              </button>
            ))}
          </div>
        </div>
      );
    }
    
    const CATEGORIES = [
      { id: 'Science', label: 'Science (자연과학)', icon: '🔬' },
      { id: 'Humanities', label: 'Humanities (인문학)', icon: '🏛️' },
      { id: 'History', label: 'History (역사)', icon: '📜' },
      { id: 'Social Science', label: 'Social Science (사회과학)', icon: '⚖️' }
    ];

    return (
      <div className="space-y-6">
        <button onClick={() => setLevel(null)} className="text-sm text-gray-500 hover:text-indigo-600">← Back to Levels</button>
        <h2 className="text-2xl font-bold">Select Category - {level}</h2>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating Grade {userGrade} {level} reading passage...</p>
            <p className="text-sm text-gray-400 mt-2">This may take 10-20 seconds</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => handleCategorySelect(cat.id)} className="p-6 bg-white border border-gray-200 rounded-xl hover:bg-orange-50 text-left transition-all group">
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <div className="font-bold text-gray-900">{cat.label}</div>
            </button>
          ))}
          </div>
        )}
      </div>
    );
  }

  if (loading || !currentContent) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Generating Grade {userGrade} {level} reading passage...</p>
      </div>
    );
  }

  const content = getContent();

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <Badge color="orange">{level} - {category}</Badge>
        <button onClick={quitReading} className="text-sm text-gray-500">Exit</button>
      </div>

      <div className="space-y-8 pb-12">
        <Card>
          <h2 className="text-3xl font-serif font-bold mb-2 text-gray-900">{content.title}</h2>
          <div className="text-xs text-gray-500 mb-6 uppercase tracking-wider">{content.source}</div>
          <p className="text-lg leading-relaxed text-gray-800 font-serif whitespace-pre-wrap mb-8">
            {content.text}
          </p>
          {submitted && (
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 mt-8">
              <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Lightbulb size={18}/> Full Translation (전체 해석)</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{content.fullTranslation}</p>
            </div>
          )}
        </Card>

        <div className="space-y-6">
           <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="text-orange-500" />
              <h3 className="text-xl font-bold text-gray-900">Comprehension Check</h3>
           </div>
           
           {content.questions.map((q, idx) => {
             const isCorrect = userAnswers[idx] === q.answer;
             return (
               <Card key={idx} className={`transition-all ${submitted ? (isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'hover:shadow-md'}`}>
                 <p className="font-bold text-lg mb-2 text-gray-900">{idx+1}. {q.q}</p>
                 {submitted && q.qKo && <p className="text-sm text-indigo-600 mb-4">{q.qKo}</p>}
                 <div className="space-y-2">
                   {q.options.map((opt, optIdx) => {
                     let btnClass = "w-full text-left p-4 rounded-lg border transition-all flex justify-between items-center ";
                     if (submitted) {
                        if (optIdx === q.answer) btnClass += "bg-green-600 text-white border-green-600 shadow-md ";
                        else if (userAnswers[idx] === optIdx && optIdx !== q.answer) btnClass += "bg-white text-red-600 border-red-300 ";
                        else btnClass += "bg-white text-gray-400 border-gray-100 ";
                     } else {
                        if (userAnswers[idx] === optIdx) btnClass += "bg-orange-100 border-orange-500 text-orange-900 font-medium ";
                        else btnClass += "bg-white border-gray-200 hover:bg-gray-50 ";
                     }

                     return (
                       <button key={optIdx} onClick={() => !submitted && setUserAnswers(prev => ({...prev, [idx]: optIdx}))} className={btnClass}>
                         <span>{opt}</span>
                         {submitted && optIdx === q.answer && <Check size={18} />}
                         {submitted && userAnswers[idx] === optIdx && optIdx !== q.answer && <XCircle size={18} />}
                       </button>
                     );
                   })}
                 </div>
                 {submitted && (
                    <div className="mt-4 pt-4 border-t border-gray-200/50">
                      <div className="flex gap-2 items-start">
                        <Lightbulb size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-bold text-gray-700 mb-1">Explanation (해설):</div>
                          <p className="text-sm text-gray-600 mb-2">{q.explanation}</p>
                          <p className="text-sm text-indigo-600">{q.explanationKo}</p>
                        </div>
                      </div>
                    </div>
                 )}
               </Card>
             );
           })}
        </div>
        
        {!submitted ? (
          <div className="sticky bottom-4">
            <Button className="w-full py-4 text-lg shadow-xl" onClick={finishReading} disabled={Object.keys(userAnswers).length < content.questions.length}>
              Submit Answers
            </Button>
          </div>
        ) : (
          <div className="text-center py-8">
             <div className="text-3xl font-bold text-indigo-700 mb-4">Total Score: {score} Points</div>
             <Button className="mx-auto" onClick={() => {
               setSubmitted(false);
               setUserAnswers({});
               generateReading();
             }}>Different Problems</Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Module: Grammar ---
const GrammarModule = ({ logActivity, user }) => {
  const [selectedSet, setSelectedSet] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [userGrade, setUserGrade] = useState(null);
  const [loading, setLoading] = useState(true);
  const startTime = useRef(Date.now());

  // 사용자 Grade 가져오기
  useEffect(() => {
    const fetchUserGrade = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('grade')
        .eq('id', user.id)
        .maybeSingle();
      setUserGrade(data?.grade || 9);
      setLoading(false);
    };
    fetchUserGrade();
  }, [user]);

  // 모든 Grammar Sets 반환
  const getAvailableSets = () => {
    return GRAMMAR_SETS;
  };

  const generateGrammarQuestions = async (set) => {
    setLoading(true);
    try {
      const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
      const grade = userGrade || 9;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Create 3 COMPLETELY NEW and UNIQUE grammar questions for Grade ${grade} international school students on the topic: "${set.title}".

CRITICAL: Adjust difficulty based on grade level:
- Grades 6-7: Use simple, everyday contexts with clear patterns
- Grades 8-9: Use moderate complexity with academic contexts
- Grades 10-12: Use complex sentences with nuanced grammar rules and advanced vocabulary

IMPORTANT: Generate questions that are DIFFERENT from typical textbook examples. Use diverse sentence structures, various contexts, and creative scenarios appropriate for Grade ${grade}.

Topic Description: ${set.description}

Return ONLY a JSON array with this format:
[
  {
    "q": "question text with blank _____ ",
    "options": ["option1", "option2", "option3", "option4"],
    "answer": 0,
    "exp": "English explanation why this is correct",
    "expKo": "한글 해설"
  }
]

Make sure the vocabulary, sentence complexity, and grammar nuances match Grade ${grade} level.`
          }],
          temperature: 1.0
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const questions = JSON.parse(jsonMatch[0]);
      
      setSelectedSet({ ...set, questions });
      setUserAnswers({});
      setSubmitted(false);
      setScore(0);
      startTime.current = Date.now();
      setLoading(false);
    } catch (error) {
      console.error("GPT API Error:", error);
      alert("Failed to generate questions. Using default set.");
      setSelectedSet(set);
      setUserAnswers({});
      setSubmitted(false);
      setScore(0);
      startTime.current = Date.now();
      setLoading(false);
    }
  };

  const startQuiz = (set) => {
    generateGrammarQuestions(set);
  };

  const handleSelect = (qIdx, optionIdx) => {
    if (!submitted) {
      setUserAnswers(prev => ({ ...prev, [qIdx]: optionIdx }));
    }
  };

  const submitQuiz = () => {
    let correct = 0;
    selectedSet.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) correct++;
    });
    const totalQ = selectedSet.questions.length;
    const finalScore = Math.round((correct / totalQ) * 100);
    
    setScore(finalScore);
    setSubmitted(true);
    
    const duration = (Date.now() - startTime.current) / 1000;
    logActivity('Grammar', `${selectedSet.title}`, duration, finalScore);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    setSelectedSet(null);
    setSubmitted(false);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const availableSets = getAvailableSets();

  if (!selectedSet) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Grammar Laboratory</h2>
        {userGrade && <p className="text-gray-600">Grade {userGrade} Level - Select a topic to strengthen your structural foundation.</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableSets.map(set => (
            <button 
              key={set.id} 
              onClick={() => startQuiz(set)}
              disabled={loading}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-500 transition-all text-left group"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Set {set.id}</span>
                <ChevronRight className="text-gray-300 group-hover:text-indigo-500 transition-colors" size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{set.title}</h3>
              <p className="text-sm text-gray-500">{set.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <button onClick={goBack} className="text-sm text-gray-500 hover:text-indigo-600 flex items-center gap-1">
          <ArrowRight className="rotate-180" size={16} /> Back to Sets
        </button>
        <Badge color="green">{selectedSet.title}</Badge>
      </div>

      {submitted && (
        <div className="mb-8 bg-white p-6 rounded-xl border border-green-200 shadow-sm text-center animate-fade-in">
          <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Results</div>
          <div className="text-4xl font-bold text-green-600 mb-2">{score} <span className="text-lg text-gray-400">/ 100</span></div>
          <p className="text-gray-600">
            {score === 100 ? "Perfect Score! Excellent work." : score >= 70 ? "Good job! Review the explanations below." : "Keep practicing. Check the explanations to improve."}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {selectedSet.questions.map((q, qIdx) => {
          const isCorrect = userAnswers[qIdx] === q.answer;
          const showFeedback = submitted;

          return (
            <Card key={qIdx} className={`transition-colors ${showFeedback ? (isCorrect ? 'border-green-200 bg-green-50/50' : 'border-red-200 bg-red-50/50') : ''}`}>
              <div className="flex gap-3">
                <div className="font-bold text-gray-400">{qIdx + 1}.</div>
                <div className="flex-1">
                  <p className="font-medium text-lg text-gray-800 mb-4">{q.q}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, optIdx) => {
                      let btnClass = "p-3 rounded-lg border text-sm font-medium transition-all text-left ";
                      if (showFeedback) {
                        if (optIdx === q.answer) btnClass += "bg-green-600 text-white border-green-600 shadow-md ";
                        else if (userAnswers[qIdx] === optIdx) btnClass += "bg-white text-red-600 border-red-300 ";
                        else btnClass += "bg-white text-gray-400 border-gray-100 opacity-60 ";
                      } else {
                        if (userAnswers[qIdx] === optIdx) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-700 ";
                        else btnClass += "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 ";
                      }

                      return (
                        <button 
                          key={optIdx} 
                          onClick={() => handleSelect(qIdx, optIdx)}
                          className={btnClass}
                          disabled={showFeedback}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showFeedback && (
                    <div className="mt-4 pt-4 border-t border-gray-200/50 text-sm">
                      <div className="flex gap-2 items-start">
                        <Lightbulb size={16} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-800 mb-1">{q.exp}</p>
                          <p className="text-indigo-600">{q.expKo}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {!submitted ? (
        <div className="mt-8 sticky bottom-4">
          <Button className="w-full py-4 text-lg shadow-xl" onClick={submitQuiz} disabled={Object.keys(userAnswers).length < selectedSet.questions.length}>
            Submit Answers
          </Button>
        </div>
      ) : (
        <div className="mt-8 text-center pb-8">
          <Button className="mx-auto" variant="outline" onClick={() => generateGrammarQuestions(selectedSet)}>Different Problems</Button>
        </div>
      )}
    </div>
  );
};

// --- Stats Detail View Component ---
const StatsDetailView = ({ logs, userData, onBack }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // 날짜별 점수 계산
  const getScoreByPeriod = (period) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const filtered = logs.filter(log => {
      const logDate = new Date(log.created_at);
      
      if (period === 'today') {
        return logDate >= today;
      } else if (period === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return logDate >= weekAgo;
      } else if (period === 'month') {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return logDate >= monthAgo;
      }
      return false;
    });
    
    return filtered.reduce((sum, log) => sum + (log.score || 0), 0);
  };

  // 달력 데이터 생성
  const getCalendarData = () => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const calendar = [];
    const attendanceDays = new Set();
    const dailyScores = {};
    
    logs.forEach(log => {
      const logDate = new Date(log.created_at);
      if (logDate.getMonth() === month && logDate.getFullYear() === year) {
        const day = logDate.getDate();
        attendanceDays.add(day);
        dailyScores[day] = (dailyScores[day] || 0) + (log.score || 0);
      }
    });
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendar.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push({
        day,
        attended: attendanceDays.has(day),
        score: dailyScores[day] || 0
      });
    }
    
    return calendar;
  };

  const todayScore = getScoreByPeriod('today');
  const weekScore = getScoreByPeriod('week');
  const monthScore = getScoreByPeriod('month');
  const calendarData = getCalendarData();

  const changeMonth = (direction) => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + direction);
    setCalendarMonth(newMonth);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="text-gray-500 hover:text-indigo-600">
          ← Back
        </button>
        <h2 className="text-2xl font-bold">Statistics Details</h2>
      </div>

      {/* 점수 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="text-center">
          <div className="text-sm text-gray-500 mb-1">Today</div>
          <div className="text-3xl font-bold text-indigo-600">{todayScore}</div>
          <div className="text-xs text-gray-400">points</div>
        </Card>
        <Card className="text-center">
          <div className="text-sm text-gray-500 mb-1">This Week</div>
          <div className="text-3xl font-bold text-green-600">{weekScore}</div>
          <div className="text-xs text-gray-400">points</div>
        </Card>
        <Card className="text-center">
          <div className="text-sm text-gray-500 mb-1">This Month</div>
          <div className="text-3xl font-bold text-purple-600">{monthScore}</div>
          <div className="text-xs text-gray-400">points</div>
        </Card>
      </div>

      {/* 출석 달력 */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Attendance Calendar</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-gray-100 rounded">←</button>
            <span className="font-medium">{calendarMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</span>
            <button onClick={() => changeMonth(1)} className="p-1 hover:bg-gray-100 rounded">→</button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-bold text-gray-400 py-2">{day}</div>
          ))}
          
          {calendarData.map((data, idx) => (
            <div key={idx} className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm ${
              data ? (data.attended ? 'bg-green-100 border-2 border-green-500 font-bold' : 'bg-gray-50') : ''
            }`}>
              {data && (
                <>
                  <div className={data.attended ? 'text-green-700' : 'text-gray-400'}>{data.day}</div>
                  {data.attended && <div className="text-xs text-green-600">{data.score}p</div>}
                </>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
            <span>Attended</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-gray-50 rounded"></div>
            <span>Not attended</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- My Page ---
const MyPage = ({ userData, user }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [detailView, setDetailView] = useState(false);
  const [analysisView, setAnalysisView] = useState(false);
  const [editData, setEditData] = useState({
    nickname: '',
    email: '',
    school_name: '',
    grade: 9,
    level: 'Intermediate'
  });

  useEffect(() => {
    if (userData) {
      setEditData({
        nickname: userData.nickname || '',
        email: userData.email || '',
        school_name: userData.school_name || '',
        grade: userData.grade || 9,
        level: userData.level || 'Intermediate'
      });
    }
  }, [userData]);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) return;
      try {
        const { data } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);
        
        setLogs(data || []);
      } catch (error) {
        console.error("Fetch logs failed:", error);
      }
      setLoading(false);
    };
    fetchLogs();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('users')
        .update({
          nickname: editData.nickname,
          email: editData.email,
          school_name: editData.school_name,
          grade: editData.grade,
          level: editData.level
        })
        .eq('id', user.id);
      
      if (error) {
        console.error("Update error:", error);
        alert("Failed to update profile");
        return;
      }
      
      alert("Profile updated successfully!");
      setEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save changes");
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  const totalActivities = logs.length;
  const totalScore = logs.reduce((sum, log) => sum + (log.score || 0), 0);
  const avgScore = totalActivities > 0 ? Math.round(totalScore / totalActivities) : 0;

  // 학습 분석 뷰
  if (analysisView) {
    const moduleStats = ['Vocabulary', 'Grammar', 'Writing', 'Reading'].map(module => {
      const moduleLogs = logs.filter(log => log.activity_type === module);
      const avgScore = moduleLogs.length > 0
        ? Math.round(moduleLogs.reduce((sum, log) => sum + (log.score || 0), 0) / moduleLogs.length)
        : 0;
      const totalTime = moduleLogs.reduce((sum, log) => sum + (log.duration_seconds || 0), 0);
      
      return { module, avgScore, attempts: moduleLogs.length, totalTime };
    });

    const strengths = moduleStats.filter(m => m.avgScore >= 70 && m.attempts > 0);
    const weaknesses = moduleStats.filter(m => (m.avgScore < 70 && m.attempts > 0) || m.attempts === 0);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setAnalysisView(false)} className="text-gray-500 hover:text-indigo-600">
            ← Back
          </button>
          <h2 className="text-2xl font-bold">My Learning Analysis</h2>
        </div>

        {/* 전체 성과 요약 */}
        <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">Overall Performance</h3>
              <p className="text-indigo-100">Grade {userData?.grade} - {userData?.level} Level</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{avgScore}</div>
              <div className="text-sm text-indigo-100">Average Score</div>
            </div>
          </div>
        </Card>

        {/* 모듈별 성과 */}
        <Card>
          <h3 className="font-bold text-lg mb-4">Module Performance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {moduleStats.map(({ module, avgScore, attempts, totalTime }) => {
              let bgColor = 'bg-red-50';
              let borderColor = 'border-red-200';
              let textColor = 'text-red-600';
              if (avgScore >= 80) {
                bgColor = 'bg-green-50';
                borderColor = 'border-green-200';
                textColor = 'text-green-600';
              } else if (avgScore >= 60) {
                bgColor = 'bg-blue-50';
                borderColor = 'border-blue-200';
                textColor = 'text-blue-600';
              }

              return (
                <div key={module} className={`p-4 ${bgColor} rounded-lg border ${borderColor}`}>
                  <div className="font-bold text-gray-800 mb-2">{module}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Score:</span>
                      <span className={`font-bold ${textColor}`}>{avgScore}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Attempts:</span>
                      <span className="font-medium">{attempts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Spent:</span>
                      <span className="font-medium">{Math.round(totalTime / 60)}m</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 강점 & 약점 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-green-50 border-green-200">
            <h3 className="font-bold text-lg text-green-800 mb-4">My Strengths</h3>
            {strengths.length > 0 ? (
              <ul className="space-y-2">
                {strengths.map(({ module, avgScore }) => (
                  <li key={module} className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 size={16} />
                    <span className="font-medium">{module}</span>
                    <span className="text-sm">({avgScore} avg)</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">Complete more activities to see your strengths!</p>
            )}
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <h3 className="font-bold text-lg text-orange-800 mb-4">Areas to Improve</h3>
            {weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {weaknesses.map(({ module, avgScore, attempts }) => (
                  <li key={module} className="flex items-center gap-2 text-orange-700">
                    <AlertCircle size={16} />
                    <span className="font-medium">{module}</span>
                    <span className="text-sm">
                      {attempts === 0 ? '(No data)' : `(${avgScore} avg)`}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600 text-sm">Great job! Keep up the good work!</p>
            )}
          </Card>
        </div>

        {/* 학습 권장사항 */}
        <Card className="bg-indigo-50 border-indigo-200">
          <h3 className="font-bold text-lg text-indigo-800 mb-4">Recommended Actions</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            {weaknesses.slice(0, 2).map(({ module, attempts }) => (
              <li key={module} className="flex items-start gap-2">
                <Lightbulb size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>
                  {attempts === 0 
                    ? `Start practicing ${module} to build a strong foundation.`
                    : `Focus more on ${module} - aim for at least 5 more practice sessions this week.`
                  }
                </span>
              </li>
            ))}
            {avgScore < 70 && (
              <li className="flex items-start gap-2">
                <Lightbulb size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>Try to maintain consistent daily practice for better results.</span>
              </li>
            )}
            {totalActivities < 10 && (
              <li className="flex items-start gap-2">
                <Lightbulb size={16} className="text-indigo-600 mt-0.5 flex-shrink-0" />
                <span>Complete at least 10 activities to get a comprehensive analysis.</span>
              </li>
            )}
          </ul>
        </Card>
      </div>
    );
  }

  if (detailView) {
    return <StatsDetailView logs={logs} userData={userData} onBack={() => setDetailView(false)} />;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Learning Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><User size={20} /> Personal Info</h3>
            <Button variant="outline" onClick={() => setEditMode(!editMode)} className="text-sm">
              {editMode ? 'Cancel' : 'Edit'}
            </Button>
          </div>
          {editMode ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Nickname</label>
                <input type="text" value={editData.nickname} onChange={(e) => setEditData({...editData, nickname: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Email</label>
                <input type="email" value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">School Name</label>
                <input type="text" value={editData.school_name} onChange={(e) => setEditData({...editData, school_name: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Grade</label>
                <select value={editData.grade} onChange={(e) => setEditData({...editData, grade: parseInt(e.target.value)})} className="w-full p-2 border rounded-lg text-sm">
                  <option value="6">Grade 6 (초6)</option>
                  <option value="7">Grade 7 (중1)</option>
                  <option value="8">Grade 8 (중2)</option>
                  <option value="9">Grade 9 (중3)</option>
                  <option value="10">Grade 10 (고1)</option>
                  <option value="11">Grade 11 (고2)</option>
                  <option value="12">Grade 12 (고3)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Level</label>
                <select value={editData.level} onChange={(e) => setEditData({...editData, level: e.target.value})} className="w-full p-2 border rounded-lg text-sm">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <Button onClick={handleSaveProfile} className="w-full">Save Changes</Button>
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Nickname:</span><span className="font-medium">{userData?.nickname || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email:</span><span className="font-medium">{userData?.email || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Grade:</span><span className="font-medium">{userData?.grade || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Level:</span><span className="font-medium">{userData?.level || 'N/A'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">School:</span><span className="font-medium">{userData?.school_name || 'N/A'}</span></div>
            </div>
          )}
        </Card>

        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center gap-2"><BarChart3 size={20} /> Statistics</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setAnalysisView(true)} className="text-sm">
                My Analysis
              </Button>
              <Button variant="outline" onClick={() => setDetailView(true)} className="text-sm">
                View Details
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">Total Points</span>
                <span className="font-bold text-indigo-600">{userData?.points || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-indigo-600 h-2 rounded-full" style={{width: `${Math.min(100, (userData?.points || 0) / 10)}%`}}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalActivities}</div>
                <div className="text-xs text-gray-600">Activities</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{avgScore}</div>
                <div className="text-xs text-gray-600">Avg Score</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No activities yet. Start learning!</p>
        ) : (
          <div className="space-y-2">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge color={log.activity_type === 'Vocabulary' ? 'blue' : log.activity_type === 'Grammar' ? 'green' : log.activity_type === 'Writing' ? 'purple' : 'orange'}>
                    {log.activity_type}
                  </Badge>
                  <span className="text-sm">{log.details?.description || 'Activity'}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-indigo-600">+{log.score} pts</span>
                  <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};