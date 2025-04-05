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

// Class options from Creche to SS3 with school fees
const classOptions = [
  { name: "Creche", fees: 30000 },
  { name: "Nursery 1", fees: 35000 },
 

  { name: "Nursery 2", fees: 35000 },
  { name: "Primary 1", fees: 40000 },
  { name: "Primary 2", fees: 40000 },
  { name: "Primary 3", fees: 40000 },
  { name: "Primary 4", fees: 45000 },
  { name: "Primary 5", fees: 45000 },
  { name: "Primary 6", fees: 45000 },
  { name: "JSS 1", fees: 50000 },
  { name: "JSS 2", fees: 50000 },
  { name: "JSS 3", fees: 50000 },
  { name: "SS 1", fees: 55000 },
  { name: "SS 2", fees: 55000 },
  { name: "SS 3", fees: 55000 },
];

// Psychomotor domains
const psychomotorDomains = [
  "Handwriting",
  "Verbal Fluency",
  "Game/Sports",
  "Handling Tools",
  "Affective Domain",
  "Punctuality",
  "Neatness",
  "Politeness",
  "Co-operation",
  "Attentiveness",
  "Carrying Out Assignment",
  "Leadership Skill",
  "Elocution",
];

// Rating options (1-5 scale)
const ratingOptions = [1, 2, 3, 4, 5];

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
    schoolFees: 0, // Will be set based on class
  });
  const [errors, setErrors] = useState({});

  const validateInput = (name, value, index = null, type = null) => {
    let error = "";
    if (type === "subject" && index !== null) {
      if (name === "exam" && (value < 0 || value > 60)) error = "Exam score must be 0-60";
      if (name === "ca1" && (value < 0 || value > 20)) error = "CA1 must be 0-20";
      if (name === "ca2" && (value < 0 || value > 20)) error = "CA2 must be 0-20";
      if (name === "subject" && !value) error = "Subject is required";
    } else if (name === "name" && !value) error = "Name is required";
    else if (name === "admissionNo" && !value) error = "Admission No is required";
    else if (name === "class" && !value) error = "Class is required";
    else if (name === "examName" && !value) error = "Exam Name is required";
    else if (name === "attendance.present" && (value < 0 || value > studentData.attendance.total))
      error = "Present days cannot exceed total days";
    else if (name === "attendance.total" && value < 0) error = "Total days cannot be negative";

    setErrors((prev) => ({ ...prev, [name + (index || "")]: error }));
    return !error;
  };

  const handleInputChange = (e, index = null, type = null) => {
    const { name, value } = e.target;
    if (validateInput(name, value, index, type)) {
      if (index !== null && type === "subject") {
        const newSubjects = [...studentData.subjects];
        newSubjects[index] = { ...newSubjects[index], [name]: value };
        setStudentData({ ...studentData, subjects: newSubjects });
      } else if (index !== null && type === "psychomotor") {
        const newPsychomotor = [...studentData.psychomotor];
        newPsychomotor[index] = { ...newPsychomotor[index], rating: value };
        setStudentData({ ...studentData, psychomotor: newPsychomotor });
      } else if (name.startsWith("attendance")) {
        const field = name.split(".")[1];
        setStudentData({
          ...studentData,
          attendance: { ...studentData.attendance, [field]: value },
        });
      } else if (name === "class") {
        const selectedClass = classOptions.find((cls) => cls.name === value);
        setStudentData({
          ...studentData,
          class: value,
          schoolFees: selectedClass ? selectedClass.fees : 0,
        });
      } else {
        setStudentData({ ...studentData, [name]: value });
      }
    }
  };

  const addSubject = () => {
    setStudentData({
      ...studentData,
      subjects: [...studentData.subjects, { subject: "", exam: 0, ca1: 0, ca2: 0 }],
    });
  };

  const removeSubject = (index) => {
    const newSubjects = studentData.subjects.filter((_, i) => i !== index);
    setStudentData({ ...studentData, subjects: newSubjects });
  };

  const calculateTotal = (subject) =>
    parseInt(subject.exam || 0) + parseInt(subject.ca1 || 0) + parseInt(subject.ca2 || 0);

  const calculateGrade = (total) => {
    if (total >= 75) return "A";
    if (total >= 60) return "B";
    if (total >= 50) return "C";
    if (total >= 40) return "D";
    return "E";
  };

  const calculatePoint = (grade) => {
    const points = { A: 5, B: 4, C: 3, D: 2, E: 1 };
    return points[grade] || 0;
  };

  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageHeight = 297; // A4 height in mm
    let y = 10;

    const addNewPageIfNeeded = (requiredHeight) => {
      if (y + requiredHeight > pageHeight - 20) {
        doc.addPage();
        y = 10;
        doc.addImage("/logo.jpeg", "JPEG", 0, 0, 210, 297, undefined, "NONE", 0.1);
        doc.addImage("/logo2.png", "PNG", 10, 10, 30, 30);
      }
    };

    // Background Image and Logo (on every page)
    doc.addImage("/logo.jpeg", "JPEG", 0, 0, 210, 297, undefined, "NONE", 0.1);
    doc.addImage("/logo2.png", "PNG", 10, 10, 30, 30);

    // Header
    doc.setFontSize(16);
    doc.setTextColor(255, 0, 0); // Red for school name
    doc.text("PROTEGE SCHOOLS", 105, y + 10, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102); // Dark blue for other text
    doc.text("2, Kola Rewire Street, Ejigbo, Lagos", 105, y + 18, { align: "center" });
    doc.text("protegeacademyconsult@gmail.com", 105, y + 24, { align: "center" });
    doc.setFontSize(14);
    doc.text("TERM PROGRESS REPORT (2024/2025 ACADEMIC SESSION)", 105, y + 32, {
      align: "center",
    });
    y += 40;

    // Student Info
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Student Name: ${studentData.name}`, 10, y);
    doc.text(`Class: ${studentData.class}`, 10, y + 6);
    doc.text(`Admission No: ${studentData.admissionNo}`, 10, y + 12);
    doc.text(`Exam Name: ${studentData.examName}`, 110, y);
    doc.text(`Section: ${studentData.section}`, 110, y + 6);
    doc.text(`Gender: ${studentData.gender}`, 110, y + 12);
    doc.text(
      `Attendance: ${studentData.attendance.present}/${studentData.attendance.total}`,
      10,
      y + 18
    );
    y += 24;

    // Academic Performance Table
    const headers = [
      "Subjects",
      "Exam 60",
      "1st CA",
      "2nd CA",
      "Total",
      "Grade",
      "Point",
      "Remark",
      "Psychomotor",
    ];
    const columnWidths = [50, 20, 15, 15, 20, 15, 15, 20, 20];
    addNewPageIfNeeded(8 + studentData.subjects.length * 8);
    let x = 10;
    doc.setFontSize(10);
    doc.setFillColor(200, 220, 255);
    doc.rect(10, y, 190, 8, "F");
    headers.forEach((header, i) => {
      doc.text(header, x + 2, y + 6);
      x += columnWidths[i];
    });
    y += 8;

    studentData.subjects.forEach((subject, index) => {
      addNewPageIfNeeded(8);
      const total = calculateTotal(subject);
      const grade = calculateGrade(total);
      const point = calculatePoint(grade).toFixed(2);
      const remark =
        total >= 75 ? "Excellent" : total >= 60 ? "Very Good" : total >= 50 ? "Good" : "Poor";
      const psychomotor = studentData.psychomotor[index]?.domain || "";

      x = 10;
      doc.text(subject.subject || "N/A", x + 2, y, { maxWidth: columnWidths[0] - 4 });
      x += columnWidths[0];
      doc.text(`${subject.exam || 0}/60`, x + 2, y);
      x += columnWidths[1];
      doc.text(`${subject.ca1 || 0}/20`, x + 2, y);
      x += columnWidths[2];
      doc.text(`${subject.ca2 || 0}/20`, x + 2, y);
      x += columnWidths[3];
      doc.text(`${total}/100`, x + 2, y);
      x += columnWidths[4];
      doc.text(grade, x + 2, y);
      x += columnWidths[5];
      doc.text(point, x + 2, y);
      x += columnWidths[6];
      doc.text(remark, x + 2, y);
      x += columnWidths[7];
      doc.text(psychomotor, x + 2, y);
      y += 8;
    });

    // Summary
    const maxScore = studentData.subjects.length * 100;
    const grandTotal = studentData.subjects.reduce(
      (sum, subject) => sum + calculateTotal(subject),
      0
    );
    const average = ((grandTotal / maxScore) * 100).toFixed(2);
    const gpa = (
      studentData.subjects.reduce(
        (sum, subject) => sum + calculatePoint(calculateGrade(calculateTotal(subject))),
        0
      ) / studentData.subjects.length
    ).toFixed(2);

    addNewPageIfNeeded(28);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("SUMMARY", 10, y);
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 6;
    doc.text(`GRAND TOTAL: ${grandTotal}/${maxScore}`, 10, y);
    doc.text(`Average: ${average}%`, 10, y + 6);
    doc.text(`GPA: ${gpa}`, 10, y + 12);
    y += 18;

    // Psychomotor Ratings
    addNewPageIfNeeded(6 + studentData.psychomotor.length * 6);
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("PSYCHOMOTOR ANALYSIS", 10, y);
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 6;
    studentData.psychomotor.forEach((item) => {
      addNewPageIfNeeded(6);
      doc.text(`${item.domain}: ${item.rating || 0}`, 10, y);
      y += 6;
    });

    // Sporting Activities
    addNewPageIfNeeded(26);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("SPORTING ABILITIES/ACTIVITIES", 10, y);
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 6;
    const sportingLines = doc.splitTextToSize(studentData.sportingActivities || "N/A", 190);
    sportingLines.forEach((line) => {
      addNewPageIfNeeded(6);
      doc.text(line, 10, y);
      y += 6;
    });

    // Remarks
    addNewPageIfNeeded(46);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("TEACHER'S REMARK", 10, y);
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 6;
    const teacherRemarkLines = doc.splitTextToSize(studentData.teacherRemark || "N/A", 190);
    teacherRemarkLines.forEach((line) => {
      addNewPageIfNeeded(6);
      doc.text(line, 10, y);
      y += 6;
    });

    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("HEAD OF SCHOOL'S REMARK", 10, y);
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 6;
    const principalRemarkLines = doc.splitTextToSize(studentData.principalRemark || "N/A", 190);
    principalRemarkLines.forEach((line) => {
      addNewPageIfNeeded(6);
      doc.text(line, 10, y);
      y += 6;
    });

    // General Note with Dynamic School Fees
    addNewPageIfNeeded(26);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(0, 51, 102);
    doc.text("GENERAL NOTE", 10, y);
    doc.setFontSize(10);
    doc.setTextColor(0);
    y += 6;
    doc.text("Next TERM begins on 28th of April, 2025", 10, y);
    doc.text(
      `School fees for next term: N${studentData.schoolFees.toLocaleString()}`,
      10,
      y + 6
    );

    // Download the PDF
    doc.save(`${studentData.name}_report_card.pdf`);
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
            {errors.class && <Typography color="error">{errors.class}</Typography>}
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
                <Typography color="error">{errors[`subject${index}`]}</Typography>
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
        label="Teacher's Remark"
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
