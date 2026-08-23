export const CATEGORIES = [
  { id: "food",          label: "Food",           icon: "🍕", color: "#D85A30", bg: "#FAECE7" },
  { id: "travel",        label: "Travel",         icon: "🚌", color: "#185FA5", bg: "#E6F1FB" },
  { id: "rent",          label: "Rent & EMIs",    icon: "🏠", color: "#1D9E75", bg: "#E1F5EE" },
  { id: "shopping",      label: "Shopping",       icon: "🛍️", color: "#BA7517", bg: "#FAEEDA" },
  { id: "health",        label: "Health",         icon: "💊", color: "#534AB7", bg: "#EEEDFE" },
  { id: "entertainment", label: "Entertainment",  icon: "🎮", color: "#378ADD", bg: "#E6F1FB" },
  { id: "savings",       label: "Savings",        icon: "💰", color: "#0F6E56", bg: "#E1F5EE" },
];

export const mockUser = {
  name: "Muskan",
  monthlyIncome: 45000,
  savingsGoal: 9000,
  month: "June 2026",
};

export const mockMonthlyExpenses = {
  food: 4500, travel: 2800, rent: 8000,
  shopping: 1950, health: 1200, entertainment: 700, savings: 5000,
};

export const mockTodayEntries = [
  { id: 1, name: "Bus to office",    category: "travel",   amount: 30,  time: "08:15" },
  { id: 2, name: "Rickshaw",         category: "travel",   amount: 30,  time: "08:48" },
  { id: 3, name: "Chai + biscuits",  category: "food",     amount: 25,  time: "09:05" },
  { id: 4, name: "Pizza",            category: "food",     amount: 100, time: "13:30" },
  { id: 5, name: "Chips",            category: "food",     amount: 20,  time: "16:00" },
  { id: 6, name: "Amazon earphones", category: "shopping", amount: 200, time: "14:15" },
  { id: 7, name: "Bus home",         category: "travel",   amount: 30,  time: "19:10" },
  { id: 8, name: "Dinner — Zomato",  category: "food",     amount: 380, time: "20:30" },
];

export const mockWeeklySpend = [
  { day: "Mon", amount: 620 },
  { day: "Tue", amount: 890 },
  { day: "Wed", amount: 1240 },
  { day: "Thu", amount: 450 },
  { day: "Fri", amount: 980 },
  { day: "Sat", amount: 2100 },
  { day: "Sun", amount: 760 },
];

export const mockSavingTips = [
  { type: "warning", title: "Food spending is high",   body: "You've spent ₹4,500 on food — 24% of income. Try meal prepping 3 days a week to save ~₹1,200." },
  { type: "success", title: "Great savings habit!",    body: "You've already saved ₹5,000 this month. You're 55% toward your ₹9,000 goal." },
  { type: "info",    title: "Switch to monthly pass",  body: "You spend ~₹60/day on travel. A BEST monthly pass (~₹600) could save you ₹900 this month." },
  { type: "neutral", title: "50 / 30 / 20 rule",       body: "On ₹45k: ₹22,500 needs · ₹13,500 wants · ₹9,000 savings. You're ₹4,000 under on savings." },
];

export const QUICK_ADD = [
  { name: "Bus",      category: "travel",  amount: 30  },
  { name: "Rickshaw", category: "travel",  amount: 40  },
  { name: "Chai",     category: "food",    amount: 15  },
  { name: "Lunch",    category: "food",    amount: 120 },
  { name: "Auto",     category: "travel",  amount: 60  },
  { name: "Groceries",category: "food",    amount: 0   },
  { name: "Zomato",   category: "food",    amount: 0   },
  { name: "Petrol",   category: "travel",  amount: 0   },
];
export const mockMonthlyTrend = [
  { week: "Week 1", spent: 7200, saved: 2000, income: 45000 },
  { week: "Week 2", spent: 5800, saved: 1500, income: 45000 },
  { week: "Week 3", spent: 8100, saved: 1000, income: 45000 },
  { week: "Week 4", spent: 3800, saved: 500,  income: 45000 },
];

export const mockCategoryBudgets = {
  food:          6000,
  travel:        4000,
  rent:          10000,
  shopping:      3000,
  health:        2000,
  entertainment: 1500,
  savings:       9000,
};

export const mockPastMonths = [
  { month: "March 2026",  totalSpent: 32000, saved: 6000 },
  { month: "April 2026",  totalSpent: 28500, saved: 7500 },
  { month: "May 2026",    totalSpent: 35200, saved: 4800 },
  { month: "June 2026",   totalSpent: 24150, saved: 5000 },
];

// Helpers
export const getTotalSpent = (exp = mockMonthlyExpenses) =>
  Object.values(exp).reduce((a, b) => a + b, 0);

export const getTodayTotal = (entries = mockTodayEntries) =>
  entries.reduce((a, e) => a + e.amount, 0);


export const mockDetailedTips = [
  {
    id: 1,
    type: "warning",
    category: "food",
    title: "Food spending is high",
    body: "You've spent ₹4,500 on food this month — that's 24% of your income. The recommended limit is 15%. Try cooking at home 3 days a week to save around ₹1,200.",
    saving: 1200,
    effort: "Low",
    tag: "Quick win",
  },
  {
    id: 2,
    type: "info",
    category: "travel",
    title: "Switch to a monthly bus pass",
    body: "You're spending around ₹60/day on travel (bus + rickshaw). A BEST monthly pass costs ₹600 and covers unlimited rides — you'd save roughly ₹900 this month.",
    saving: 900,
    effort: "Low",
    tag: "Quick win",
  },
  {
    id: 3,
    type: "warning",
    category: "shopping",
    title: "Impulse shopping detected",
    body: "3 of your 5 shopping entries this month were unplanned purchases under ₹500. Try a 24-hour rule — wait a day before buying non-essentials.",
    saving: 600,
    effort: "Medium",
    tag: "Habit change",
  },
  {
    id: 4,
    type: "success",
    category: "savings",
    title: "You're ahead on savings",
    body: "You've already saved ₹5,000 — 55% of your ₹9,000 goal with 23 days left. At this rate you'll exceed your goal by ₹1,500.",
    saving: 0,
    effort: "None",
    tag: "Doing great",
  },
  {
    id: 5,
    type: "info",
    category: "food",
    title: "Zomato orders adding up",
    body: "You've ordered food delivery 8 times this month, averaging ₹320 per order — that's ₹2,560 total. Cooking even 3 of those meals at home saves ₹700+.",
    saving: 700,
    effort: "Medium",
    tag: "Habit change",
  },
  {
    id: 6,
    type: "neutral",
    category: null,
    title: "50 / 30 / 20 rule check",
    body: "Based on your ₹45,000 income: Needs should be ₹22,500 · Wants ₹13,500 · Savings ₹9,000. Your current split is 41% needs, 30% wants, 11% savings. Savings is the gap to close.",
    saving: 4000,
    effort: "High",
    tag: "Long term",
  },
  {
    id: 7,
    type: "info",
    category: "entertainment",
    title: "Check for unused subscriptions",
    body: "Entertainment spend of ₹700 might include subscriptions you've forgotten. Audit your UPI/bank auto-debits — most people find 1-2 unused subscriptions worth ₹200-400/month.",
    saving: 300,
    effort: "Low",
    tag: "Quick win",
  },
  {
    id: 8,
    type: "success",
    category: "health",
    title: "Health spending is balanced",
    body: "Your ₹1,200 health spend is within the recommended 5-8% range. Keep maintaining this — preventive health spending now saves expensive medical bills later.",
    saving: 0,
    effort: "None",
    tag: "Doing great",
  },
];