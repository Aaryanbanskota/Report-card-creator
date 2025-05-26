// Elements
const form = document.getElementById("reportForm");
const addSubjectBtn = document.getElementById("addSubject");
const previewBtn = document.getElementById("previewBtn");
const saveBtn = document.getElementById("saveBtn");
const themeBtns = document.querySelectorAll(".theme-btn");
const reportPreview = document.getElementById("reportPreview");
const downloadPdfBtn = document.getElementById("downloadPdf");

// Theme switcher
themeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    document.body.className = `${theme}-theme`;
  });
});

// Add subject
addSubjectBtn.addEventListener("click", () => {
  const subjectContainer = document.getElementById("subjectContainer");
  const div = document.createElement("div");
  div.classList.add("subject-row");
  div.innerHTML = `
    <input type="text" placeholder="Subject Name *" required />
    <input type="number" placeholder="Marks (0-100) *" min="0" max="100" required />
  `;
  subjectContainer.appendChild(div);
});

// Grade calculation
function getGrade(p) {
  if (p >= 90) return "A+";
  if (p >= 80) return "A";
  if (p >= 70) return "B+";
  if (p >= 60) return "B";
  if (p >= 50) return "C";
  if (p >= 40) return "D";
  return "F";
}
function getRemark(grade) {
  return grade === "F" ? "Fail ❌" : "Pass ✅";
}

// Validate inputs
function validateForm() {
  const name = document.getElementById("studentName").value.trim();
  const roll = document.getElementById("rollNumber").value.trim();
  const className = document.getElementById("class").value.trim();

  if (!name) {
    alert("Please enter Student Name.");
    return false;
  }
  if (!roll) {
    alert("Please enter Roll Number.");
    return false;
  }
  if (!className) {
    alert("Please enter Class.");
    return false;
  }

  const subjects = document.querySelectorAll(".subject-row");
  if (subjects.length === 0) {
    alert("Add at least one subject.");
    return false;
  }

  for (const row of subjects) {
    const subject = row.children[0].value.trim();
    const marks = row.children[1].value.trim();
    if (!subject) {
      alert("Please enter all subject names.");
      return false;
    }
    if (marks === "" || isNaN(marks) || marks < 0 || marks > 100) {
      alert("Please enter valid marks between 0 and 100.");
      return false;
    }
  }

  return true;
}

// Preview report
previewBtn.addEventListener("click", () => {
  if (!validateForm()) return;

  const name = document.getElementById("studentName").value.trim();
  const roll = document.getElementById("rollNumber").value.trim();
  const className = document.getElementById("class").value.trim();

  const subjects = document.querySelectorAll(".subject-row");
  let total = 0;
  let maxMarks = subjects.length * 100;

  let html = `
    <h2>🎓 Student Report Card</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Roll No:</strong> ${roll}</p>
    <p><strong>Class:</strong> ${className}</p>
    <table>
      <thead>
        <tr><th>Subject</th><th>Marks</th></tr>
      </thead>
      <tbody>
  `;

  subjects.forEach(row => {
    const subject = row.children[0].value.trim();
    const marks = Number(row.children[1].value.trim());
    total += marks;
    html += `<tr><td>${subject}</td><td>${marks}</td></tr>`;
  });

  const percentage = (total / maxMarks) * 100;
  const grade = getGrade(percentage);
  const remark = getRemark(grade);

  html += `</tbody></table>
    <p><strong>Total Marks:</strong> ${total} / ${maxMarks}</p>
    <p><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
    <p><strong>Grade:</strong> ${grade}</p>
    <p><strong>Remark:</strong> ${remark}</p>`;

  reportPreview.innerHTML = html;
  reportPreview.classList.remove("hidden");
  reportPreview.scrollIntoView({behavior: "smooth"});
});

// Save TXT file
saveBtn.addEventListener("click", () => {
  if (!validateForm()) return;

  const name = document.getElementById("studentName").value.trim();
  const roll = document.getElementById("rollNumber").value.trim();
  const className = document.getElementById("class").value.trim();
  const subjects = document.querySelectorAll(".subject-row");

  let total = 0;
  let maxMarks = subjects.length * 100;

  let content = `Student Report Card\nName: ${name}\nRoll No: ${roll}\nClass: ${className}\n\nSubjects:\n`;

  subjects.forEach(row => {
    const subject = row.children[0].value.trim();
    const marks = Number(row.children[1].value.trim());
    total += marks;
    content += `${subject}: ${marks}\n`;
  });

  const percentage = (total / maxMarks) * 100;
  const grade = getGrade(percentage);
  const remark = getRemark(grade);

  content += `\nTotal Marks: ${total} / ${maxMarks}\nPercentage: ${percentage.toFixed(2)}%\nGrade: ${grade}\nRemark: ${remark}\n`;

  const blob = new Blob([content], {type: "text/plain"});
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}_ReportCard.txt`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// Download PDF
downloadPdfBtn.addEventListener("click", () => {
  if (reportPreview.classList.contains("hidden")) {
    alert("Please preview report card first!");
    return;
  }
  // Dynamically import html2pdf.js CDN and create PDF
  if (!window.html2pdf) {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => {
      createPdf();
    };
    script.onerror = () => alert("Failed to load PDF library.");
    document.body.appendChild(script);
  } else {
    createPdf();
  }
});

function createPdf() {
  const element = reportPreview;
  const opt = {
    margin: 0.5,
    filename: 'Student_ReportCard.pdf',
    image: {type: 'jpeg', quality: 0.98},
    html2canvas: {scale: 2},
    jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
  };
  html2pdf().set(opt).from(element).save();
}
