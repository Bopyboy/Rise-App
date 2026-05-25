export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface AIResponse {
  text: string
  followUp?: string[]
}

const responses: Record<string, AIResponse> = {
  protein: {
    text: `**Protein** is the most important macro for building and maintaining muscle. Here's what you need to know:\n\n• **Goal**: Aim for **0.7–1g per lb of bodyweight** (1.6–2.2g/kg)\n• **Timing**: Spread protein across 3–5 meals for optimal muscle protein synthesis\n• **Best sources**: Chicken breast, eggs, Greek yogurt, cottage cheese, lean beef, tuna, tofu, whey protein\n• **Absorption**: Your body can effectively use ~40–50g per meal\n\nIf you're hitting your calorie goal but missing protein, swap some carbs for lean protein sources.`,
    followUp: ['What are the best protein sources?', 'How much protein for muscle gain?', 'What about protein timing?'],
  },
  calories: {
    text: `**Calories** are the foundation of any physique goal. Here's the breakdown:\n\n• **Maintenance**: Use the Mifflin-St Jeor formula — roughly bodyweight (lbs) × 15 for moderately active\n• **Fat loss**: Eat at a **300–500 calorie deficit** — aggressive cuts hurt muscle retention\n• **Muscle gain**: Eat at a **200–300 calorie surplus** — lean bulking minimizes fat gain\n• **Recomp**: At maintenance, prioritize high protein (1g/lb) and resistance training\n\nTrack consistently for at least 2 weeks before judging results — weight fluctuates daily by 2–5 lbs.`,
    followUp: ['How do I calculate my TDEE?', 'Should I bulk or cut?', 'How fast should I lose weight?'],
  },
  bulkcut: {
    text: `**Bulk vs Cut** — how to decide:\n\n**Bulk if:**\n• You're at or below ~15% body fat (men) / ~22% (women)\n• You want to maximize muscle gain\n• You've been in a deficit for a long time\n\n**Cut if:**\n• You're above ~20% body fat (men) / ~28% (women)\n• You want more muscle definition\n• You feel sluggish from excess body fat\n\n**Lean bulk** (recommended): +200–300 cal surplus, high protein, gain ~0.5 lbs/week. You'll add muscle with minimal fat.\n\n**Mini cuts**: 4–8 weeks at -400 cal deficit between bulks to stay lean year-round.`,
    followUp: ['How many calories to bulk?', 'How fast will I gain muscle?', 'What is body recomposition?'],
  },
  cardio: {
    text: `**Cardio** for different goals:\n\n🔥 **Fat loss**: LISS (low intensity steady state) — 30–45 min walks, cycling, swimming. Burns fat, preserves muscle. Do 3–5x/week.\n\n⚡ **HIIT**: 15–25 min sessions, 2–3x/week max. High calorie burn, boosts metabolism. Don't overdo it — it's taxing.\n\n💪 **Endurance**: Zone 2 training (60–70% max HR) improves cardiovascular health and is easy to recover from.\n\n**For muscle gainers**: Limit to 2–3x/week of moderate cardio to avoid interfering with recovery. Separate cardio and lifting by 6+ hours when possible.`,
    followUp: ['How much cardio for fat loss?', 'Does cardio kill gains?', 'What is Zone 2 cardio?'],
  },
  muscle: {
    text: `**Building muscle** requires three things:\n\n1. **Progressive overload** — consistently lift more weight or do more reps over time. This is the #1 driver of muscle growth.\n\n2. **Sufficient protein** — 0.7–1g per lb of bodyweight daily. Protein provides amino acids for muscle repair.\n\n3. **Recovery** — muscle is built at rest, not in the gym. Sleep 7–9 hours, manage stress, take rest days.\n\n**Best rep ranges**: 6–12 reps for hypertrophy, 1–5 for strength, 15–20 for endurance/pump.\n\n**Training frequency**: Hit each muscle 2x/week for optimal growth. Push/Pull/Legs 6x/week or Upper/Lower 4x/week work great.`,
    followUp: ['What is progressive overload?', 'How long to see muscle gains?', 'Best workout split for muscle?'],
  },
  sleep: {
    text: `**Sleep is your secret weapon** for fitness gains:\n\n• **7–9 hours** is optimal for most people — less than 6 significantly hurts performance and recovery\n• Growth hormone is released during deep sleep — critical for muscle repair\n• Poor sleep increases cortisol, which breaks down muscle and stores fat\n• Sleep deprivation increases hunger hormones (ghrelin) by 15–20%\n\n**Tips for better sleep:**\n• Keep a consistent sleep/wake schedule (even weekends)\n• Avoid caffeine after 2 PM\n• Keep your room dark and cool (65–68°F / 18–20°C)\n• No screens 30–60 min before bed\n• Magnesium glycinate (300mg) can improve sleep quality`,
    followUp: ['Does sleep affect muscle growth?', 'What supplements help sleep?', 'How to recover faster?'],
  },
  supplements: {
    text: `**Evidence-based supplements** (the only ones worth buying):\n\n✅ **Creatine monohydrate** — 3–5g/day, no loading needed. Improves strength and power output by 5–15%. Cheapest and most researched supplement.\n\n✅ **Whey protein** — Convenient way to hit protein goals. Not magic, just food in powder form.\n\n✅ **Caffeine** — 3–6mg/kg bodyweight pre-workout. Improves endurance, strength, and focus.\n\n✅ **Vitamin D3** — Most people are deficient. Affects mood, hormones, and immune function. 2000–4000 IU/day.\n\n✅ **Omega-3** — Reduces inflammation, supports joint health and heart health.\n\n❌ **Skip**: BCAAs (redundant with adequate protein), fat burners, testosterone boosters, most pre-workouts (just take caffeine).`,
    followUp: ['Should I take creatine?', 'Do I need protein powder?', 'What is the best pre-workout?'],
  },
  creatine: {
    text: `**Creatine** is the most researched supplement in existence:\n\n• **What it does**: Increases phosphocreatine stores in muscles, helping you produce more ATP (energy) during high-intensity exercise\n• **Benefits**: +5–15% increase in strength, improved sprint performance, faster recovery, slight increase in muscle fullness\n• **Dose**: 3–5g per day. No loading phase needed — it saturates in ~4 weeks\n• **Timing**: Doesn't matter — take it consistently. Post-workout with carbs slightly better\n• **Side effects**: None proven (the kidney damage myth is debunked). Some people retain 1–2 lbs of water initially\n• **Who benefits**: Everyone — especially vegetarians who get less dietary creatine\n\n**Best form**: Creatine monohydrate. Don't pay for "HCl" or "buffered" versions.`,
    followUp: ['How long to see creatine effects?', 'Does creatine cause water retention?', 'Best time to take creatine?'],
  },
  workout: {
    text: `**Effective workout programming** 101:\n\n🏋️ **Push/Pull/Legs (PPL)** — Most popular split. 6 days/week, each muscle hit 2x.\n- Push: Chest, shoulders, triceps\n- Pull: Back, biceps, rear delts\n- Legs: Quads, hamstrings, glutes, calves\n\n💪 **Upper/Lower** — 4 days/week. Great for intermediate lifters.\n\n🔄 **Full Body** — 3 days/week. Best for beginners — more frequency per muscle.\n\n**Key principles:**\n• Warm up with 2 light sets before working sets\n• 3–4 sets per exercise, 6–15 reps\n• Rest 1–3 min between sets (longer for heavy compound lifts)\n• Track your lifts — what gets measured gets improved`,
    followUp: ['What is the best beginner workout?', 'How many sets per muscle group?', 'Push pull legs explained'],
  },
  ppl: {
    text: `**Push/Pull/Legs (PPL) Split:**\n\n**Push Day (Chest, Shoulders, Triceps):**\n• Bench Press — 4×6–8\n• Incline Dumbbell Press — 3×10–12\n• Overhead Press — 3×8–10\n• Lateral Raises — 3×15–20\n• Tricep Pushdown — 3×12–15\n\n**Pull Day (Back, Biceps):**\n• Deadlift — 4×5\n• Barbell Row — 3×8–10\n• Lat Pulldown — 3×10–12\n• Face Pull — 3×15–20\n• Barbell Curl — 3×10–12\n\n**Leg Day (Quads, Hamstrings, Glutes, Calves):**\n• Squat — 4×6–8\n• Romanian Deadlift — 3×10–12\n• Leg Press — 3×12–15\n• Leg Curl — 3×12–15\n• Calf Raise — 4×15–20`,
    followUp: ['How many days per week PPL?', 'Can I do PPL as a beginner?', 'Best exercises for chest?'],
  },
  chest: {
    text: `**Best chest exercises** ranked:\n\n🏆 **Compound (do these first):**\n• Flat Bench Press — overall mass builder, best bang for buck\n• Incline Bench Press — upper chest emphasis\n• Dips — lower chest + triceps, great for size\n\n💪 **Isolation:**\n• Cable Flyes — constant tension throughout ROM, great for chest stretch\n• Dumbbell Flyes — good for feeling the chest stretch\n• Pec Deck — same as cable flyes, safer for shoulders\n\n**Training tips:**\n• Emphasize full stretch at bottom of movements\n• Touch your chest on bench press — half reps = half gains\n• 2–4 exercises per session, 3–4 sets each\n• Hit chest 2x/week for optimal growth`,
    followUp: ['How to build a bigger chest?', 'Why dont I feel my chest when benching?', 'Bench press tips'],
  },
  back: {
    text: `**Back training essentials:**\n\n🔑 **Key movements:**\n• **Deadlifts** — King of back exercises. Builds thickness and overall mass\n• **Barbell/Dumbbell Rows** — Middle back, lats, rhomboids\n• **Pull-ups/Lat Pulldowns** — Lat width. Pull-ups > machine versions\n• **Cable Rows** — Great for full ROM and constant tension\n• **Face Pulls** — Rear delts and rotator cuff health. Don't skip these!\n\n**Tip:** Think of your hands as hooks — lead with your elbows, not your hands. This better activates the back vs. biceps.\n\n**Common mistake:** Using too much weight with poor form. The back is complex — feel the muscles working, don't just move the weight.`,
    followUp: ['How to feel my back when rowing?', 'How to build a wider back?', 'Deadlift form tips'],
  },
  legs: {
    text: `**Leg training** — never skip them:\n\n🦵 **The big 4:**\n• **Squats** — King of leg exercises. Quads, glutes, hamstrings\n• **Romanian Deadlift (RDL)** — Best hamstring exercise. Hip hinge pattern\n• **Leg Press** — Great volume tool. Safe alternative to squats when tired\n• **Leg Curl** — Isolates hamstrings. Use lying or seated variation\n\n**For glutes:** Bulgarian split squats, hip thrusts, walking lunges\n**For calves:** Standing calf raises (weighted), 4×15–20\n\n**Frequency:** Legs 2x/week. Squats and hip hinges on separate days works well.\n\n**Why train legs?** They're 40% of your muscle mass. Compound leg exercises also spike testosterone and growth hormone significantly.`,
    followUp: ['How to squat properly?', 'Why are my legs not growing?', 'Best glute exercises'],
  },
  fat_loss: {
    text: `**Fat loss fundamentals:**\n\n1. **Calorie deficit** — The ONLY way to lose fat. Create a 300–500 cal/day deficit.\n\n2. **High protein** — 0.8–1g/lb bodyweight. Preserves muscle while cutting.\n\n3. **Resistance training** — Maintain/build muscle during a cut. More muscle = higher metabolism.\n\n4. **Steps** — Aim for 8,000–10,000 steps/day. NEAT (non-exercise activity thermogenesis) is underrated.\n\n5. **Patience** — Safe rate is 0.5–1 lb/week. Faster = more muscle loss.\n\n**Common mistakes:**\n• Too aggressive deficit → muscle loss + metabolic adaptation\n• Not tracking accurately → "I eat healthy but can't lose weight"\n• Cardio without diet changes → won't move the needle much`,
    followUp: ['How fast should I lose weight?', 'How do I track calories?', 'Why am I not losing weight?'],
  },
  beginner: {
    text: `**Best beginner program:**\n\nStart with **3 days/week full body training**. Your muscles are untrained — frequency matters more than volume.\n\n**Recommended: Starting Strength or StrongLifts 5×5**\n\nDay A:\n• Squat 3×5\n• Bench Press 3×5\n• Barbell Row 3×5\n\nDay B:\n• Squat 3×5\n• Overhead Press 3×5\n• Deadlift 1×5\n\nAlternate A/B/A, B/A/B each week. Add weight every session.\n\n**Beginner gains** (newbie gains) are real — you can gain significant muscle AND lose fat simultaneously in your first 6–12 months. Don't overthink it. Just be consistent and eat enough protein.`,
    followUp: ['How much weight should I start with?', 'When should I increase weight?', 'What about diet for beginners?'],
  },
  rise: {
    text: `**Maximizing your Rise Score** 🏆\n\n• **Daily quests** — Complete your quest every day for +100–250 XP. They reset at midnight.\n• **Consistency** — Your streak multiplies your motivation. Don't break the chain!\n• **Body PRs** — Log your personal records to unlock better muscle grades\n• **Track nutrition** — Log all your meals to stay accountable\n\n**Rank thresholds:**\n• Iron: 0 XP\n• Bronze: 500 XP\n• Silver: 1,500 XP\n• Gold: 3,000 XP\n• Platinum: 5,000 XP\n• Diamond: 8,000 XP\n• Master: 12,000 XP\n• Grandmaster: 18,000 XP\n• Elite: 25,000 XP\n\nFocus on consistency over intensity — showing up daily compounds into massive results.`,
    followUp: ['How to earn XP fast?', 'How do daily quests work?', 'What is the highest rank?'],
  },
  hydration: {
    text: `**Hydration for performance:**\n\n• **Daily target**: ~1oz per lb bodyweight (or 35ml/kg). ~2–3 liters for most people.\n• **During exercise**: 500–750ml per hour of training\n• **Signs of dehydration**: Dark urine, headaches, decreased performance, cramping\n\n**Why it matters:**\n• 2% dehydration = 10–20% drop in strength and endurance\n• Helps transport nutrients to muscles\n• Supports joint lubrication\n• Improves cognitive function\n\n**Tips:**\n• Drink 500ml first thing in the morning\n• Keep a water bottle visible\n• Add electrolytes if sweating heavily (sodium, potassium, magnesium)\n• Coffee counts toward hydration (mild diuretic effect is minimal)`,
    followUp: ['Should I drink electrolytes?', 'Is coffee dehydrating?', 'How much water during workouts?'],
  },
  recovery: {
    text: `**Recovery is where gains happen:**\n\n🛌 **Sleep**: 7–9 hours. Non-negotiable. Growth hormone is released during deep sleep.\n\n🍗 **Nutrition**: Eat enough protein and calories. Can't build a house without materials.\n\n📅 **Rest days**: Train hard, rest harder. Take 1–2 rest days/week. Active recovery (walking, stretching) is fine.\n\n🧊 **Soreness (DOMS)**: Normal for 24–72 hours after training. Ice baths and cold therapy help. Don't train the same muscle when very sore.\n\n🧘 **Stress management**: Cortisol breaks down muscle. Manage stress through meditation, breathing, hobbies.\n\n**Signs of overtraining**: Persistent fatigue, declining performance, poor sleep, irritability, frequent illness. Take a deload week.`,
    followUp: ['How to reduce muscle soreness?', 'What is a deload week?', 'Should I train when sore?'],
  },
  intermittent_fasting: {
    text: `**Intermittent Fasting (IF) — the real talk:**\n\n**What it is**: Restricting eating to a specific window (16:8 is most common — 16h fast, 8h eating window)\n\n**Does it work?** Yes — but only because it makes eating less easier, not magic fat burning.\n\n**Pros:**\n• Simplifies meal planning\n• Naturally reduces calorie intake for many people\n• Improves insulin sensitivity\n• Some people perform well fasted\n\n**Cons:**\n• Can compromise muscle if protein timing is poor\n• Harder to hit high protein targets in a short window\n• May cause overeating at meals\n\n**Verdict**: If it helps you maintain a deficit and hit protein goals, it's a great tool. But it's NOT superior to regular eating for muscle building.`,
    followUp: ['Can I build muscle while fasting?', 'What to eat during eating window?', 'Should I work out fasted?'],
  },
}

const greetings = [
  "Hey! 👋 I'm your AI fitness coach. Ask me anything about workouts, nutrition, supplements, or your Rise progress. What's on your mind?",
  "What's up! Ready to crush your fitness goals? Ask me anything — nutrition, training, recovery, or how to rank up faster. I'm here to help! 💪",
  "Hey there! I'm here to help you optimize your training and nutrition. What fitness question can I answer for you today?",
]

const keywords: Record<string, string> = {
  protein: 'protein',
  whey: 'protein',
  'amino acid': 'protein',
  'protein powder': 'protein',
  'how much protein': 'protein',
  calorie: 'calories',
  calories: 'calories',
  'how much to eat': 'calories',
  tdee: 'calories',
  deficit: 'calories',
  surplus: 'calories',
  'bulk or cut': 'bulkcut',
  bulk: 'bulkcut',
  'cutting phase': 'bulkcut',
  recomp: 'bulkcut',
  cardio: 'cardio',
  running: 'cardio',
  hiit: 'cardio',
  treadmill: 'cardio',
  'lose fat': 'fat_loss',
  'fat loss': 'fat_loss',
  'lose weight': 'fat_loss',
  'weight loss': 'fat_loss',
  shred: 'fat_loss',
  muscle: 'muscle',
  'build muscle': 'muscle',
  'gain muscle': 'muscle',
  hypertrophy: 'muscle',
  sleep: 'sleep',
  'rest day': 'sleep',
  'not sleeping': 'sleep',
  supplement: 'supplements',
  supplements: 'supplements',
  'what to take': 'supplements',
  preworkout: 'supplements',
  'pre-workout': 'supplements',
  creatine: 'creatine',
  'creatine monohydrate': 'creatine',
  workout: 'workout',
  'work out': 'workout',
  'training split': 'workout',
  split: 'workout',
  program: 'workout',
  programme: 'workout',
  routine: 'workout',
  'push pull legs': 'ppl',
  ppl: 'ppl',
  'push day': 'ppl',
  'pull day': 'ppl',
  chest: 'chest',
  bench: 'chest',
  'bench press': 'chest',
  pecs: 'chest',
  back: 'back',
  lat: 'back',
  lats: 'back',
  deadlift: 'back',
  row: 'back',
  pullup: 'back',
  'pull up': 'back',
  leg: 'legs',
  legs: 'legs',
  squat: 'legs',
  'leg day': 'legs',
  hamstring: 'legs',
  quad: 'legs',
  glute: 'legs',
  beginner: 'beginner',
  'just started': 'beginner',
  'new to gym': 'beginner',
  newbie: 'beginner',
  'rise score': 'rise',
  'rise rank': 'rise',
  xp: 'rise',
  rank: 'rise',
  quest: 'rise',
  water: 'hydration',
  hydration: 'hydration',
  hydrate: 'hydration',
  dehydrat: 'hydration',
  recovery: 'recovery',
  'sore muscle': 'recovery',
  doms: 'recovery',
  overtraining: 'recovery',
  deload: 'recovery',
  'intermittent fast': 'intermittent_fasting',
  'intermittent fasting': 'intermittent_fasting',
  fasting: 'intermittent_fasting',
  'eating window': 'intermittent_fasting',
  '16:8': 'intermittent_fasting',
}

const fallbackResponses = [
  "That's a great fitness question! While I'm optimized for topics like **workouts, nutrition, supplements, and recovery**, I'd recommend:\n\n• For very specific questions, consult a certified personal trainer or registered dietitian\n• For medical concerns, always consult a doctor\n\nCould you rephrase or ask about a specific aspect of **training, diet, or recovery**? I'd love to help! 💪",
  "I want to give you the best answer possible! Try asking me about:\n\n• 💪 **Training**: workout splits, exercises, progressive overload\n• 🥗 **Nutrition**: protein, calories, bulking, cutting\n• 💊 **Supplements**: creatine, protein powder, what actually works\n• 😴 **Recovery**: sleep, rest days, deloads\n• 🏆 **Rise Score**: how to rank up faster\n\nWhat would you like to know?",
  "Great question! I specialize in fitness and nutrition guidance. Try asking me something like:\n\n• 'How much protein do I need?'\n• 'What's the best workout split?'\n• 'Should I bulk or cut?'\n• 'Does creatine work?'\n• 'How do I lose fat without losing muscle?'",
]

export function getAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase().trim()

  if (
    msg.match(/^(hi|hello|hey|sup|what's up|whats up|yo|hiya|howdy|good morning|good evening)[\s!?.]*$/)
  ) {
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  if (msg.match(/thank|thanks|thx|ty|appreciate|helpful/)) {
    return "You're welcome! 🙌 Feel free to ask me anything else about your fitness journey. Keep pushing — every rep counts!"
  }

  if (msg.match(/who are you|what are you|what can you do|help/)) {
    return "I'm your **AI Fitness Coach** built into Rise! 🏋️\n\nI can help you with:\n\n• 💪 **Training** — workout splits, exercise technique, progressive overload\n• 🥗 **Nutrition** — calories, macros, meal timing, bulking & cutting\n• 💊 **Supplements** — what actually works (spoiler: mostly just creatine + protein)\n• 😴 **Recovery** — sleep, rest days, reducing soreness\n• 🏆 **Rise App** — how to earn XP, rank up, and crush your quests\n\nJust ask me anything fitness-related!"
  }

  for (const [keyword, topicKey] of Object.entries(keywords)) {
    if (msg.includes(keyword)) {
      const response = responses[topicKey]
      if (response) return response.text
    }
  }

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
}

export function getSuggestedQuestions(): string[] {
  return [
    'How much protein do I need?',
    'Should I bulk or cut?',
    'Does creatine actually work?',
    'What is the best workout split?',
    'How do I lose fat and keep muscle?',
    'How do I earn XP faster?',
    'How many calories should I eat?',
    'What supplements actually work?',
  ]
}
