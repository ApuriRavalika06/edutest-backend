// XP and Badge logic — stored in localStorage

export const BADGES = [
  { id: "first_quiz",   label: "First Quiz! 🎯",       xpNeeded: 0,    desc: "Completed your first quiz"            },
  { id: "bronze",       label: "Bronze Scholar 🥉",     xpNeeded: 50,   desc: "Earned 50 XP"                         },
  { id: "silver",       label: "Silver Mind 🥈",        xpNeeded: 150,  desc: "Earned 150 XP"                        },
  { id: "gold",         label: "Gold Achiever 🥇",      xpNeeded: 300,  desc: "Earned 300 XP"                        },
  { id: "perfect",      label: "Perfect Score 💯",      xpNeeded: -1,   desc: "Scored 100% on a quiz"                },
  { id: "consistent",   label: "Consistent ⚡",          xpNeeded: -1,   desc: "Passed 3 quizzes in a row"            },
  { id: "speedster",    label: "Speedster 🚀",           xpNeeded: -1,   desc: "Finished a quiz with >30s remaining"  },
];

export function getXP() {
  return parseInt(localStorage.getItem("xp") || "0");
}

export function getQuizCount() {
  return parseInt(localStorage.getItem("quizCount") || "0");
}

export function getPassStreak() {
  return parseInt(localStorage.getItem("passStreak") || "0");
}

export function getUnlockedBadges() {
  try { return JSON.parse(localStorage.getItem("badges") || "[]"); }
  catch { return []; }
}

export function awardXP(percentage, timeLeft) {
  const base = Math.round(percentage * 0.5);   // 0–50 XP per quiz
  const timeBonus = timeLeft > 30 ? 10 : 0;    // Speed bonus
  const perfectBonus = percentage === 100 ? 20 : 0;
  const total = base + timeBonus + perfectBonus;

  const current = getXP();
  localStorage.setItem("xp", String(current + total));

  // Quiz count
  const count = getQuizCount() + 1;
  localStorage.setItem("quizCount", String(count));

  // Pass streak
  const streak = percentage >= 50 ? getPassStreak() + 1 : 0;
  localStorage.setItem("passStreak", String(streak));

  // Unlock badges
  const unlocked = getUnlockedBadges();
  const newBadges = [];

  const tryUnlock = (id) => {
    if (!unlocked.includes(id)) { unlocked.push(id); newBadges.push(id); }
  };

  if (count === 1)               tryUnlock("first_quiz");
  if (current + total >= 50)     tryUnlock("bronze");
  if (current + total >= 150)    tryUnlock("silver");
  if (current + total >= 300)    tryUnlock("gold");
  if (percentage === 100)        tryUnlock("perfect");
  if (streak >= 3)               tryUnlock("consistent");
  if (timeLeft > 30 && percentage >= 50) tryUnlock("speedster");

  localStorage.setItem("badges", JSON.stringify(unlocked));
  return { xpEarned: total, newBadges };
}
