/**
 * Curated word banks, quotes, code samples, and text generators.
 * Supports English, Uzbek, and Russian.
 */

export const ENGLISH_WORDS = [
  'other', 'city', 'develop', 'they', 'do', 'since', 'set', 'also', 'part', 'right', 'you', 'ask',
  'under', 'mean', 'new', 'around', 'form', 'run', 'follow', 'tell', 'each', 'those', 'write', 'become', 'find',
  'where', 'program', 'here', 'can', 'lead', 'long', 'again', 'own', 'possible', 'without', 'give', 'course', 'last',
  'no', 'if', 'might', 'fact', 'before', 'by', 'about', 'above', 'across', 'action', 'activity', 'actually', 'addition',
  'address', 'administration', 'admit', 'adult', 'affect', 'after', 'against', 'agency', 'agent', 'agree', 'agreement',
  'air', 'all', 'allow', 'almost', 'alone', 'along', 'already', 'also', 'although', 'always', 'American',
  'among', 'amount', 'analysis', 'and', 'animal', 'another', 'answer', 'any', 'anyone', 'anything', 'appear',
  'apply', 'approach', 'area', 'argue', 'arm', 'around', 'arrive', 'art', 'article', 'artist', 'as', 'ask',
  'assume', 'attack', 'attention', 'attorney', 'audience', 'author', 'authority', 'available', 'avoid', 'away',
  'baby', 'back', 'bad', 'bag', 'ball', 'bank', 'bar', 'base', 'be', 'beat', 'beautiful', 'because', 'become',
  'bed', 'before', 'begin', 'behavior', 'behind', 'believe', 'benefit', 'best', 'better', 'between', 'beyond',
  'big', 'bill', 'billion', 'bit', 'black', 'blood', 'blue', 'board', 'body', 'book', 'born', 'both', 'box',
  'boy', 'break', 'bring', 'brother', 'budget', 'build', 'building', 'business', 'but', 'buy', 'by', 'call',
  'camera', 'campaign', 'can', 'cancer', 'candidate', 'capital', 'car', 'card', 'care', 'career', 'carry',
  'case', 'catch', 'cause', 'cell', 'center', 'central', 'century', 'certain', 'certainly', 'chair', 'challenge',
  'chance', 'change', 'character', 'charge', 'check', 'child', 'choice', 'choose', 'church', 'citizen', 'city',
  'civil', 'claim', 'class', 'clear', 'clearly', 'close', 'coach', 'cold', 'collection', 'college', 'color',
  'come', 'commercial', 'common', 'community', 'company', 'compare', 'computer', 'concern', 'condition',
  'conference', 'congress', 'consider', 'consumer', 'contain', 'continue', 'control', 'cost', 'could', 'country',
  'couple', 'course', 'court', 'cover', 'create', 'crime', 'cultural', 'culture', 'cup', 'current', 'customer',
  'cut', 'dark', 'data', 'daughter', 'day', 'dead', 'deal', 'death', 'debate', 'decade', 'decide', 'decision',
  'deep', 'defense', 'degree', 'democrat', 'democratic', 'describe', 'design', 'despite', 'detail', 'determine',
  'develop', 'development', 'die', 'difference', 'different', 'difficult', 'dinner', 'direction', 'director',
  'discover', 'discuss', 'discussion', 'disease', 'do', 'doctor', 'dog', 'door', 'down', 'draw', 'dream',
  'drive', 'drop', 'drug', 'during', 'each', 'early', 'east', 'easy', 'eat', 'economic', 'economy', 'edge',
  'education', 'effect', 'effort', 'eight', 'either', 'election', 'else', 'employee', 'end', 'energy', 'enjoy',
  'enough', 'enter', 'entire', 'environment', 'environmental', 'especially', 'establish', 'even', 'evening',
  'event', 'ever', 'every', 'everybody', 'everyone', 'everything', 'evidence', 'exactly', 'example', 'executive',
  'exist', 'expect', 'experience', 'expert', 'explain', 'eye', 'face', 'fact', 'factor', 'fail', 'fall',
  'family', 'far', 'fast', 'father', 'fear', 'federal', 'feel', 'feeling', 'few', 'field', 'fight', 'figure',
  'fill', 'film', 'final', 'finally', 'financial', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first',
  'fish', 'five', 'floor', 'fly', 'focus', 'follow', 'food', 'foot', 'for', 'force', 'foreign', 'forget', 'form',
  'former', 'forward', 'four', 'free', 'friend', 'from', 'front', 'full', 'fund', 'future', 'game', 'garden',
  'gas', 'general', 'generation', 'get', 'girl', 'give', 'glass', 'go', 'goal', 'good', 'government', 'great',
  'green', 'ground', 'group', 'grow', 'growth', 'guess', 'gun', 'guy', 'hair', 'half', 'hand', 'hang', 'happen',
  'happy', 'hard', 'have', 'he', 'head', 'health', 'hear', 'heart', 'heat', 'heavy', 'help', 'her', 'here',
  'herself', 'high', 'him', 'himself', 'his', 'history', 'hit', 'hold', 'home', 'hope', 'hospital', 'hot',
  'hotel', 'hour', 'house', 'how', 'however', 'huge', 'human', 'hundred', 'husband', 'idea', 'identify', 'if',
  'image', 'imagine', 'impact', 'important', 'improve', 'in', 'include', 'including', 'increase', 'indeed',
  'indicate', 'individual', 'industry', 'information', 'inside', 'instead', 'institution', 'interest', 'interesting',
  'international', 'interview', 'into', 'investment', 'involve', 'issue', 'it', 'item', 'its', 'itself',
  'job', 'join', 'just', 'keep', 'key', 'kid', 'kill', 'kind', 'kitchen', 'know', 'knowledge', 'land', 'language',
  'large', 'last', 'late', 'later', 'laugh', 'law', 'lawyer', 'lay', 'lead', 'leader', 'learn', 'least', 'leave',
  'left', 'leg', 'legal', 'less', 'let', 'letter', 'level', 'lie', 'life', 'light', 'like', 'likely', 'line',
  'list', 'listen', 'little', 'live', 'local', 'long', 'look', 'lose', 'loss', 'lot', 'love', 'low', 'machine',
  'magazine', 'main', 'maintain', 'major', 'majority', 'make', 'man', 'manage', 'management', 'manager', 'many',
  'market', 'marriage', 'material', 'matter', 'may', 'maybe', 'me', 'mean', 'measure', 'media', 'medical', 'meet',
  'meeting', 'member', 'memory', 'mention', 'message', 'method', 'middle', 'might', 'military', 'million', 'mind',
  'minute', 'miss', 'mission', 'model', 'modern', 'moment', 'money', 'month', 'more', 'morning', 'most', 'mother',
  'mouth', 'move', 'movement', 'movie', 'Mr', 'Mrs', 'much', 'music', 'must', 'my', 'myself', 'name', 'nation',
  'national', 'natural', 'nature', 'near', 'nearly', 'necessary', 'need', 'network', 'never', 'new', 'news',
  'newspaper', 'next', 'nice', 'night', 'no', 'none', 'nor', 'north', 'not', 'note', 'nothing', 'notice', 'now',
  'number', 'occur', 'of', 'off', 'offer', 'office', 'officer', 'official', 'often', 'oh', 'oil', 'ok', 'old',
  'on', 'once', 'one', 'only', 'onto', 'open', 'operation', 'opportunity', 'option', 'or', 'order', 'organization',
  'other', 'others', 'our', 'out', 'outside', 'over', 'own', 'owner', 'page', 'pain', 'painting', 'paper', 'parent',
  'part', 'participant', 'particular', 'particularly', 'partner', 'party', 'pass', 'past', 'patient', 'pattern',
  'pay', 'peace', 'people', 'per', 'perform', 'performance', 'perhaps', 'period', 'person', 'personal', 'phone',
  'physical', 'pick', 'picture', 'piece', 'place', 'plan', 'plant', 'play', 'player', 'PM', 'point', 'police',
  'policy', 'political', 'politics', 'poor', 'popular', 'population', 'position', 'positive', 'possible', 'power',
  'practice', 'prepare', 'present', 'president', 'pressure', 'pretty', 'prevent', 'price', 'private', 'probably',
  'problem', 'process', 'produce', 'product', 'production', 'professional', 'professor', 'program', 'project',
  'property', 'protect', 'prove', 'provide', 'public', 'pull', 'purpose', 'push', 'put', 'quality', 'question',
  'quickly', 'quite', 'race', 'radio', 'raise', 'range', 'rate', 'rather', 'reach', 'read', 'ready', 'real',
  'reality', 'realize', 'really', 'reason', 'receive', 'recent', 'recently', 'recognize', 'record', 'red', 'reduce',
  'reflect', 'region', 'relate', 'relationship', 'religious', 'remain', 'remember', 'remove', 'report', 'represent',
  'republican', 'require', 'research', 'resource', 'respond', 'response', 'responsibility', 'rest', 'result',
  'return', 'reveal', 'rich', 'right', 'rise', 'risk', 'road', 'rock', 'role', 'room', 'rule', 'run', 'safe',
  'same', 'save', 'say', 'scene', 'school', 'science', 'scientist', 'score', 'sea', 'season', 'seat', 'second',
  'section', 'security', 'see', 'seek', 'seem', 'sell', 'send', 'senior', 'sense', 'series', 'serious', 'serve',
  'service', 'set', 'seven', 'several', 'sex', 'sexual', 'shake', 'share', 'she', 'shoot', 'short', 'shot',
  'should', 'shoulder', 'show', 'side', 'sign', 'significant', 'similar', 'simple', 'simply', 'since', 'sing',
  'single', 'sister', 'sit', 'site', 'situation', 'six', 'size', 'skill', 'skin', 'small', 'smile', 'so',
  'social', 'society', 'soldier', 'some', 'somebody', 'someone', 'something', 'sometimes', 'son', 'song', 'soon',
  'sort', 'sound', 'source', 'south', 'southern', 'space', 'speak', 'special', 'specific', 'speech', 'spend',
  'sport', 'spring', 'staff', 'stage', 'stand', 'standard', 'star', 'start', 'state', 'statement', 'station',
  'stay', 'step', 'still', 'stock', 'stop', 'store', 'story', 'strategy', 'street', 'strong', 'structure', 'student',
  'study', 'stuff', 'style', 'subject', 'success', 'successful', 'such', 'suddenly', 'suffer', 'suggest', 'summer',
  'support', 'sure', 'surface', 'system', 'table', 'take', 'talk', 'task', 'tax', 'teach', 'teacher', 'team',
  'technology', 'television', 'tell', 'ten', 'tend', 'term', 'test', 'than', 'thank', 'that', 'the', 'their',
  'them', 'themselves', 'then', 'theory', 'there', 'these', 'they', 'thing', 'think', 'third', 'this', 'those',
  'though', 'thought', 'thousand', 'threat', 'three', 'through', 'throughout', 'throw', 'thus', 'time', 'to',
  'today', 'together', 'tonight', 'too', 'top', 'total', 'tough', 'toward', 'town', 'trade', 'traditional',
  'training', 'travel', 'treat', 'treatment', 'tree', 'trial', 'trip', 'trouble', 'true', 'truth', 'try', 'turn',
  'TV', 'two', 'type', 'under', 'understand', 'unit', 'until', 'up', 'upon', 'us', 'use', 'usually', 'value',
  'various', 'very', 'victim', 'view', 'violence', 'visit', 'voice', 'vote', 'wait', 'walk', 'wall', 'want',
  'war', 'watch', 'water', 'way', 'we', 'weapon', 'wear', 'week', 'weight', 'well', 'west', 'western', 'what',
  'whatever', 'when', 'where', 'whether', 'which', 'while', 'white', 'who', 'whole', 'whom', 'whose', 'why',
  'wide', 'wife', 'will', 'win', 'wind', 'window', 'wish', 'with', 'within', 'without', 'woman', 'wonder', 'word',
  'work', 'worker', 'world', 'worry', 'would', 'write', 'writer', 'wrong', 'yard', 'yeah', 'year', 'yes', 'yet',
  'you', 'young', 'your', 'yourself'
];

export const UZBEK_WORDS = [
  'kitob', 'maktab', 'ilm', 'kelajak', 'taraqqiyot', 'muvaffaqiyat', 'dasturlash', 'shahar', 'daryo', 'quyosh',
  'yulduz', 'osmon', 'bahor', 'yoz', 'kuz', 'qish', 'daraxt', 'gul', 'bog', 'dala', 'paxta', 'bugdoy',
  'mehnat', 'sabrlik', 'harakat', 'natija', 'yutuq', 'ustoz', 'shogird', 'ota', 'ona', 'aka', 'uka',
  'opa', 'singil', 'farzand', 'xalq', 'vatan', 'tinchlik', 'mustaqillik', 'ezgulik', 'saodat', 'orzu', 'maqsad',
  'iqtidor', 'zakovat', 'tarix', 'adabiyot', 'sanat', 'musiqa', 'sheʼr', 'doston', 'hikoya', 'madaniyat',
  'qalam', 'daftar', 'kompyuter', 'aloqa', 'tezlik', 'aniqlik', 'odob', 'tarbiya', 'gʻurur', 'sharaf',
  'doʻst', 'birodar', 'hamkorlik', 'birlik', 'kuch', 'qudrat', 'tafakkur', 'fikr', 'mulohaza', 'ziyo',
  'nur', 'chiroq', 'tong', 'quyoshli', 'tonggi', 'kechki', 'yoshlar', 'yuksak', 'parvoz', 'umid', 'ishonch',
  'himmat', 'jasorat', 'mardonavor', 'olijanob', 'saxiy', 'saxovat', 'ehson', 'shukrona', 'baxt', 'quvonch'
];

export const RUSSIAN_WORDS = [
  'время', 'человек', 'жизнь', 'день', 'рука', 'работа', 'слово', 'место', 'лицо', 'друг',
  'глаз', 'дом', 'сторона', 'голова', 'ребенок', 'сила', 'конец', 'вид', 'дело', 'город',
  'ночь', 'вода', 'мир', 'плечо', 'земля', 'машина', 'минута', 'дорога', 'окно', 'мысль',
  'голос', 'письмо', 'книга', 'правда', 'страна', 'сердце', 'вечер', 'ответ', 'дверь', 'школа',
  'вопрос', 'образ', 'ветер', 'утро', 'смерть', 'закон', 'деньги', 'тело', 'история', 'свет',
  'парень', 'месяц', 'брат', 'девушка', 'комната', 'улица', 'солнце', 'мать', 'отец', 'поезд',
  'успех', 'знание', 'скорость', 'точность', 'программа', 'память', 'урок', 'смысл', 'цель', 'радость'
];

export const FAMOUS_QUOTES = [
  {
    quote: "Simplicity is prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
  },
  {
    quote: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler",
  },
  {
    quote: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
    author: "Steve Jobs",
  },
  {
    quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
  },
  {
    quote: "Knowledge has to be improved, challenged, and increased constantly, or it vanishes.",
    author: "Peter Drucker",
  },
  {
    quote: "First, solve the problem. Then, write the code.",
    author: "John Johnson",
  },
  {
    quote: "It always seems impossible until it is done.",
    author: "Nelson Mandela",
  },
  {
    quote: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein",
  },
];

export const CODE_SNIPPETS = {
  javascript: [
    "const debounce = (fn, ms = 300) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); }; };",
    "const calculateWpm = (chars, seconds) => Math.round((chars / 5) / (seconds / 60));",
    "const filterUnique = (array) => Array.from(new Set(array));",
    "export async function fetchUsers() { const res = await fetch('/api/users'); return res.json(); }",
  ],
  python: [
    "def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr",
    "def fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b",
  ],
  rust: [
    "fn main() {\n    let numbers = vec![1, 2, 3, 4, 5];\n    let sum: i32 = numbers.iter().sum();\n    println!(\"Sum: {}\", sum);\n}",
  ],
};

/**
 * Generate randomized text based on options
 */
export function generateTestText(options: {
  mode: 'time' | 'words' | 'quote' | 'custom' | 'zen';
  wordCount?: number;
  language?: string;
  punctuation?: boolean;
  numbers?: boolean;
  customText?: string;
}): string {
  const { mode, wordCount = 30, language = 'en', punctuation = false, numbers = false, customText = '' } = options;

  if (mode === 'custom' && customText.trim().length > 0) {
    return customText.trim();
  }

  if (mode === 'quote') {
    const randomQuote = FAMOUS_QUOTES[Math.floor(Math.random() * FAMOUS_QUOTES.length)];
    return `${randomQuote.quote} — ${randomQuote.author}`;
  }

  let bank = ENGLISH_WORDS;
  if (language === 'uz') bank = UZBEK_WORDS;
  if (language === 'ru') bank = RUSSIAN_WORDS;

  const count = mode === 'time' ? 80 : wordCount;
  const words: string[] = [];

  for (let i = 0; i < count; i++) {
    let word = bank[Math.floor(Math.random() * bank.length)];

    if (numbers && Math.random() < 0.15) {
      word = String(Math.floor(Math.random() * 900) + 10);
    } else if (punctuation) {
      const rand = Math.random();
      if (rand < 0.1) word = `"${word}"`;
      else if (rand < 0.2) word = `${word},`;
      else if (rand < 0.3) word = `${word}.`;
      else if (rand < 0.35) word = `${word}!`;
      else if (rand < 0.4) word = `${word}?`;
      else if (rand < 0.45) word = `${word};`;
    }

    words.push(word);
  }

  return words.join(' ');
}

/**
 * Generates weak-key focused training text
 */
export function generateWeakKeyText(weakKeys: string[]): string {
  if (weakKeys.length === 0) weakKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l'];
  const words: string[] = [];

  // Filter english words that contain any of the weak keys
  const matchingWords = ENGLISH_WORDS.filter((w) =>
    weakKeys.some((k) => w.toLowerCase().includes(k.toLowerCase()))
  );

  const pool = matchingWords.length > 20 ? matchingWords : ENGLISH_WORDS;

  for (let i = 0; i < 40; i++) {
    words.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  return words.join(' ');
}
