// src/data/children_data.jsx

// טוען נתונים מה-localStorage
export function loadChildrenData() {
  const raw = localStorage.getItem("childrenData")
  return raw ? JSON.parse(raw) : {}
}

// שומר את כל האובייקט (במקום נקודתי)
export function saveChildrenData(data) {
  localStorage.setItem("childrenData", JSON.stringify(data))
}

// מוסיף או מעדכן תשובה לילד מסוים
export function addAnswerForChild(childId, childName, age, answerObj) {
  const data = loadChildrenData()

  // אם אין עדיין את הילד – יוצרים אותו
  if (!data[childId]) {
    data[childId] = {
      name: childName,
      age,
      sessionHistory: []
    }
  }

  // בודקים אם יש כבר סשן פתוח מהיום – אם לא, יוצרים חדש
  const today = new Date().toISOString().split("T")[0]
  let currentSession = data[childId].sessionHistory.find(s =>
    s.date.startsWith(today)
  )

  if (!currentSession) {
    currentSession = {
      date: new Date().toISOString(),
      answers: []
    }
    data[childId].sessionHistory.push(currentSession)
  }

  // מוסיפים תשובה
  currentSession.answers.push(answerObj)

  // שומרים את הנתונים
  saveChildrenData(data)
}
