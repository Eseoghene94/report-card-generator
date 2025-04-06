// src/App.jsx
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import "./App.css";

// Predefined list of common Nigerian school subjects
const nigerianSubjects = [
  "English Language",
  "Mathematics",
  "Civic Education",
  "Basic Science",
  "Basic Technology",
  "Social Studies",
  "Christian Religious Studies",
  "Islamic Religious Studies",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Literature in English",
  "Government",
  "Economics",
  "Biology",
  "Chemistry",
  "Physics",
  "Agricultural Science",
  "Further Mathematics",
  "Geography",
  "History",
  "Computer Studies",
  "Physical Education",
  "Health Education",
  "Fine Arts",
  "Music",
  "Home Economics",
  "Food and Nutrition",
  "Business Studies",
  "Accounting",
  "Commerce",
  "French",
];

// Class options with their corresponding fees structure
const classOptions = [
  { name: "JSS 1", fees: 50000, note: "N50,000" },
  { name: "JSS 2", fees: 50000, note: "N50,000" },
  { name: "JSS 3", fees: 55000, note: "N50,000 + Junior WAEC extension N5,000 (Total: N55,000)" },
  { name: "SS 1 Science", fees: 55000, note: "N50,000 + Practicals N5,000 (Total: N55,000)" },
  { name: "SS 1 Art/Commercial", fees: 50000, note: "N50,000" },
  { name: "SS 2 Science", fees: 55000, note: "N50,000 + Practicals N5,000 (Total: N55,000)" },
  { name: "SS 2 Art/Commercial", fees: 50000, note: "N50,000" },
  { name: "SS 3", fees: 30000, note: "Extension class (WAEC/JAMB prep + practicals) - N30,000" },
];

// Psychomotor domains
const psychomotorDomains = [
  "Athletics",
  "Tennis",
  "Board Games",
  "Handling Tools",
  "Soccer",
  "Punctuality",
  "Neatness",
  "Politeness",
  "Co-operation",
  "Attentiveness",
  "Relating with others",
  "Leadership Skill",
  
];

// Rating options (1-5 scale)
const ratingOptions = [1, 2, 3, 4, 5];

// Convert number to words (basic implementation)
const numberToWords = (num) => {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  const thousands = ["", "Thousand", "Million"];

  if (num === 0) return "Zero";
  let words = "";
  let i = 0;

  while (num > 0) {
    let chunk = num % 1000;
    if (chunk) {
      let chunkWords = "";
      if (chunk >= 100) {
        chunkWords += units[Math.floor(chunk / 100)] + " Hundred ";
        chunk %= 100;
      }
      if (chunk >= 20) {
        chunkWords += tens[Math.floor(chunk / 10)] + " ";
        chunk %= 10;
      }
      if (chunk >= 10) {
        chunkWords += teens[chunk - 10] + " ";
        chunk = 0;
      }
      if (chunk > 0) {
        chunkWords += units[chunk] + " ";
      }
      words = chunkWords + thousands[i] + " " + words;
    }
    num = Math.floor(num / 1000);
    i++;
  }
  return words.trim();
};

const ReportCard = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    admissionNo: "",
    class: "",
    section: "",
    gender: "",
    examName: "",
    subjects: [{ subject: "", exam: 0, ca1: 0, ca2: 0 }],
    attendance: { present: 0, total: 0 },
    psychomotor: psychomotorDomains.map((domain) => ({ domain, rating: 0 })),
    teacherRemark: "",
    principalRemark: "",
    sportingActivities: "",
    schoolFees: 0,
  });
  const [errors, setErrors] = useState({});
  const [stampImage, setStampImage] = useState(null);

  // ... [keep all your existing functions like validateInput, handleInputChange, etc.] ...

 const generatePDF = () => {
  try {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = 210;
    const pageHeight = 297;
    let y = 10;
    let isFirstPage = true;

    const addNewPageIfNeeded = (requiredHeight) => {
      if (y + requiredHeight > pageHeight - 20) {
        doc.addPage();
        y = 10;
        isFirstPage = false;
      }
    };

    // Logo (only on first page)
    if (isFirstPage) {
      doc.addImage("/logo2.png", "PNG", 10, 10, 30, 30);
    }

    // Header
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0);
    doc.text("PROTEGE SCHOOLS", pageWidth / 2, y + 10, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("2, Kola Rewire Street, Ejigbo, Lagos", pageWidth / 2, y + 18, {
      align: "center",
    });
    doc.text("protegeacademyconsult@gmail.com", pageWidth / 2, y + 24, {
      align: "center",
    });
    doc.setFontSize(14);
    doc.text(
      "SECOND TERM PROGRESS REPORT (2024/2025 ACADEMIC SESSION)",
      pageWidth / 2,
      y + 32,
      { align: "center" }
    );
    y += 40;

    // Student Info
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Student Name: ${studentData.name}`, 15, y);
    doc.text(`Class: ${studentData.class}`, 15, y + 6);
    doc.text(`Admission No: ${studentData.admissionNo}`, 15, y + 12);
    doc.text(`Exam Name: ${studentData.examName}`, 110, y);
    doc.text(`Section: ${studentData.section}`, 110, y + 6);
    doc.text(`Gender: ${studentData.gender}`, 110, y + 12);
    doc.text(
      `Attendance: ${studentData.attendance.present}/${studentData.attendance.total}`,
      15,
      y + 18
    );
    y += 24;

    // Academic Performance Table
    const headers = [
      "Subject",
      "Exam",
      "1st CA",
      "2nd CA",
      "Total",
      "Grade",
      "Remark",
    ];
    const columnWidths = [65, 20, 20, 20, 20, 15, 25];
    const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
    addNewPageIfNeeded(10 + studentData.subjects.length * 8);

    // Draw table header
    doc.setFontSize(10);
    doc.setFillColor(200, 220, 255);
    doc.rect(15, y, tableWidth, 8, "F");
    doc.setDrawColor(0);
    let x = 15;
    headers.forEach((header, i) => {
      doc.rect(x, y, columnWidths[i], 8);
      doc.text(header, x + 2, y + 6);
      x += columnWidths[i];
    });
    y += 8;

    // Table rows
    studentData.subjects.forEach((subject) => {
      addNewPageIfNeeded(8);
      const total = calculateTotal(subject);
      const grade = calculateGrade(total);
      const remark =
        total >= 75
          ? "Excellent"
          : total >= 60
          ? "Very Good"
          : total >= 50
          ? "Good"
          : "Poor";

      x = 15;
      doc.rect(x, y, columnWidths[0], 8);
      doc.text(subject.subject || "N/A", x + 2, y + 6, {
        maxWidth: columnWidths[0] - 4,
      });
      x += columnWidths[0];
      doc.rect(x, y, columnWidths[1], 8);
      doc.text(`${subject.exam || 0}`, x + 2, y + 6);
      x += columnWidths[1];
      doc.rect(x, y, columnWidths[2], 8);
      doc.text(`${subject.ca1 || 0}`, x + 2, y + 6);
      x += columnWidths[2];
      doc.rect(x, y, columnWidths[3], 8);
      doc.text(`${subject.ca2 || 0}`, x + 2, y + 6);
      x += columnWidths[3];
      doc.rect(x, y, columnWidths[4], 8);
      doc.text(`${total}`, x + 2, y + 6);
      x += columnWidths[4];
      doc.rect(x, y, columnWidths[5], 8);
      doc.text(grade, x + 2, y + 6);
      x += columnWidths[5];
      doc.rect(x, y, columnWidths[6], 8);
      doc.text(remark, x + 2, y + 6);
      y += 8;
    });

    // Summary
    const maxScore = studentData.subjects.length * 100;
    const grandTotal = studentData.subjects.reduce(
      (sum, subject) => sum + calculateTotal(subject),
      0
    );
    const average = ((grandTotal / maxScore) * 100).toFixed(2);

    addNewPageIfNeeded(20);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("SUMMARY", 15, y);
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 6;
    doc.text(
      `Total Score: ${grandTotal}/${maxScore} (Average: ${average}%)`,
      15,
      y
    );
    y += 12;

    // Ability/Activities Table (left side)
    const selectedPsychomotor = studentData.psychomotor.filter(
      (item) => item.rating > 0
    );
    if (selectedPsychomotor.length > 0) {
      const psychoStartY = y;

      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("Ability/Activities", 15, y);
      y += 6;

      const psychoHeaders = ["Skill", "Rating"];
      const psychoWidths = [50, 20];
      const psychoTableWidth = psychoWidths.reduce((a, b) => a + b, 0);

      doc.setFontSize(10);
      doc.setFillColor(200, 220, 255);
      doc.rect(15, y, psychoTableWidth, 8, "F");
      x = 15;
      psychoHeaders.forEach((header, i) => {
        doc.rect(x, y, psychoWidths[i], 8);
        doc.text(header, x + 2, y + 6);
        x += psychoWidths[i];
      });
      y += 8;

      selectedPsychomotor.slice(0, 8).forEach((item) => {
        x = 15;
        doc.rect(x, y, psychoWidths[0], 8);
        doc.text(item.domain, x + 2, y + 6, {
          maxWidth: psychoWidths[0] - 4,
        });
        x += psychoWidths[0];
        doc.rect(x, y, psychoWidths[1], 8);
        doc.text(`${item.rating}`, x + 2, y + 6);
        y += 8;
      });

      // Right side content (Remarks and General Note)
      const rightX = 100;
      let rightY = psychoStartY;

      // Teacher's Remark
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("Teacher's Remark:", rightX, rightY);
      doc.setFontSize(10);
      doc.setTextColor(0);
      rightY += 6;

      const teacherRemarkLines = doc.splitTextToSize(
        studentData.teacherRemark || "N/A",
        90
      );
      teacherRemarkLines.slice(0, 4).forEach((line) => {
        doc.text(line, rightX, rightY);
        rightY += 6;
      });

      // Principal's Remark
      rightY += 6;
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("Principal's Remark:", rightX, rightY);
      doc.setFontSize(10);
      doc.setTextColor(0);
      rightY += 6;

      const principalRemarkLines = doc.splitTextToSize(
        studentData.principalRemark || "N/A",
        90
      );
      principalRemarkLines.slice(0, 4).forEach((line) => {
        doc.text(line, rightX, rightY);
        rightY += 6;
      });

      // School Fees Information
      rightY += 6;
      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text("School Fees Information:", rightX, rightY);
      doc.setFontSize(10);
      doc.setTextColor(0);
      rightY += 6;

      // Get the current class's fee note
      const currentClass = classOptions.find(cls => cls.name === studentData.class);
      const classFeeNote = currentClass ? currentClass.note : "N/A";

      // General fee information
      const generalNoteLines = [
        `Current Class (${studentData.class || 'N/A'}): ${classFeeNote}`,
        "",
        "All School Fees Include:",
        "- Tuition",
        "- Examination fees",
        "- Development levy",
        "- Sports and extracurricular activities",
        "",
        "Payment Options:",
        "- Full payment (5% discount if paid before resumption)",
        "- Two installments (first installment must be at least 60%)",
        "- Three installments (by special arrangement only)"
      ];

      // Split into two columns if space is limited
      const leftColX = rightX;
      const rightColX = rightX + 50;
      let useTwoColumns = false;

      // Check if we have enough vertical space for single column
      if (rightY + (generalNoteLines.length * 6) < pageHeight - 30) {
        // Single column layout
        generalNoteLines.forEach((line) => {
          if (line === "") {
            rightY += 3;
          } else {
            doc.text(line, leftColX, rightY);
            rightY += 6;
          }
        });
      } else {
        // Two column layout
        useTwoColumns = true;
        const half = Math.ceil(generalNoteLines.length / 2);
        
        // Left column
        generalNoteLines.slice(0, half).forEach((line) => {
          if (line === "") {
            rightY += 3;
          } else {
            doc.text(line, leftColX, rightY);
            rightY += 6;
          }
        });
        
        // Right column
        let tempY = rightY - (half * 6);
        generalNoteLines.slice(half).forEach((line) => {
          if (line === "") {
            tempY += 3;
          } else {
            doc.text(line, rightColX, tempY);
            tempY += 6;
          }
        });
        
        rightY = tempY;
      }

      // Move y down to whichever is lower (psychomotor or right content)
      y = Math.max(y, rightY);
    }

    // Add stamp at bottom-right if space allows
    if (stampImage && y < pageHeight - 50) {
      const stampWidth = 30;
      const stampHeight = 30;
      const stampX = pageWidth - stampWidth - 15;
      const stampY = pageHeight - stampHeight - 15;
      doc.addImage(
        stampImage,
        "PNG",
        stampX,
        stampY,
        stampWidth,
        stampHeight
      );
    }

    doc.save(`${studentData.name}_report_card.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(
      "An error occurred while generating the PDF. Check the console for details."
    );
  }
};
  const validateForm = () => {
    const requiredFields = ["name", "admissionNo", "class", "examName"];
    let isValid = true;
    requiredFields.forEach((field) => {
      if (!studentData[field]) {
        validateInput(field, studentData[field]);
        isValid = false;
      }
    });
    studentData.subjects.forEach((subject, index) => {
      if (!subject.subject) {
        validateInput("subject", subject.subject, index, "subject");
        isValid = false;
      }
    });
    return isValid;
  };

  const handleGeneratePDF = () => {
    if (validateForm()) {
      generatePDF();
    } else {
      alert("Please correct the errors before generating the PDF.");
    }
  };

  return (
    <Paper className="container" elevation={3}>
      <Typography variant="h4" gutterBottom color="primary">
        Protege Report Card Generator
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Student Name"
            name="name"
            value={studentData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Admission No"
            name="admissionNo"
            value={studentData.admissionNo}
            onChange={handleInputChange}
            error={!!errors.admissionNo}
            helperText={errors.admissionNo}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth error={!!errors.class}>
            <InputLabel>Class</InputLabel>
            <Select
              name="class"
              value={studentData.class}
              onChange={handleInputChange}
            >
              {classOptions.map((cls) => (
                <MenuItem key={cls.name} value={cls.name}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
            {errors.class && (
              <Typography color="error">{errors.class}</Typography>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Section"
            name="section"
            value={studentData.section}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Gender"
            name="gender"
            value={studentData.gender}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Exam Name"
            name="examName"
            value={studentData.examName}
            onChange={handleInputChange}
            error={!!errors.examName}
            helperText={errors.examName}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Attendance (Days Present)"
            name="attendance.present"
            type="number"
            value={studentData.attendance.present}
            onChange={handleInputChange}
            error={!!errors["attendance.present"]}
            helperText={errors["attendance.present"]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total School Days"
            name="attendance.total"
            type="number"
            value={studentData.attendance.total}
            onChange={handleInputChange}
            error={!!errors["attendance.total"]}
            helperText={errors["attendance.total"]}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" style={{ marginTop: "2rem" }} color="primary">
        Subjects and Scores
      </Typography>
      {studentData.subjects.map((subject, index) => (
        <Grid container spacing={2} key={index} style={{ marginTop: "1rem" }}>
          <Grid item xs={3}>
            <FormControl fullWidth error={!!errors[`subject${index}`]}>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subject"
                value={subject.subject}
                onChange={(e) => handleInputChange(e, index, "subject")}
              >
                {nigerianSubjects.map((subj) => (
                  <MenuItem key={subj} value={subj}>
                    {subj}
                  </MenuItem>
                ))}
              </Select>
              {errors[`subject${index}`] && (
                <Typography color="error">
                  {errors[`subject${index}`]}
                </Typography>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Exam (60)"
              name="exam"
              type="number"
              value={subject.exam}
              onChange={(e) => handleInputChange(e, index, "subject")}
              error={!!errors[`exam${index}`]}
              helperText={errors[`exam${index}`]}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="1st CA (20)"
              name="ca1"
              type="number"
              value={subject.ca1}
              onChange={(e) => handleInputChange(e, index, "subject")}
              error={!!errors[`ca1${index}`]}
              helperText={errors[`ca1${index}`]}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="2nd CA (20)"
              name="ca2"
              type="number"
              value={subject.ca2}
              onChange={(e) => handleInputChange(e, index, "subject")}
              error={!!errors[`ca2${index}`]}
              helperText={errors[`ca2${index}`]}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton onClick={() => removeSubject(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        variant="outlined"
        startIcon={<AddIcon />}
        onClick={addSubject}
        style={{ marginTop: "1rem" }}
      >
        Add Subject
      </Button>

      <Typography variant="h6" style={{ marginTop: "2rem" }} color="primary">
        Psychomotor Analysis (Rate 1-5)
      </Typography>
      <Grid container spacing={2}>
        {studentData.psychomotor.map((item, index) => (
          <Grid item xs={12} md={4} key={index}>
            <FormControl fullWidth>
              <InputLabel>{item.domain}</InputLabel>
              <Select
                name="rating"
                value={item.rating}
                onChange={(e) => handleInputChange(e, index, "psychomotor")}
              >
                <MenuItem value={0}>Not Rated</MenuItem>
                {ratingOptions.map((rate) => (
                  <MenuItem key={rate} value={rate}>
                    {rate}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" style={{ marginTop: "2rem" }} color="primary">
        Sporting Abilities/Activities
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={2}
        name="sportingActivities"
        value={studentData.sportingActivities}
        onChange={handleInputChange}
        placeholder="Enter sporting activities or abilities"
      />

      <Typography variant="h6" style={{ marginTop: "2rem" }} color="primary">
        Remarks
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={2}
        label="Class Teacher's Remark"
        name="teacherRemark"
        value={studentData.teacherRemark}
        onChange={handleInputChange}
        style={{ marginTop: "1rem" }}
      />
      <TextField
        fullWidth
        multiline
        rows={2}
        label="Head of School's Remark"
        name="principalRemark"
        value={studentData.principalRemark}
        onChange={handleInputChange}
        style={{ marginTop: "1rem" }}
      />

      {/* Stamp Upload Field */}
      <Typography variant="h6" style={{ marginTop: "2rem" }} color="primary">
        Upload School Stamp
      </Typography>
      <input
        type="file"
        accept="image/*"
        onChange={handleStampUpload}
        style={{ marginTop: "1rem" }}
      />
      {stampImage && (
        <Typography variant="body2" style={{ marginTop: "0.5rem" }}>
          Stamp uploaded successfully
        </Typography>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleGeneratePDF}
        style={{ marginTop: "2rem" }}
      >
        Generate PDF
      </Button>
    </Paper>
  );
};

export default ReportCard;
