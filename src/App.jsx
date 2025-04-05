// src/App.jsx
import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";
import { Button, TextField, Grid, Typography, Paper } from "@mui/material";
import "./App.css";

const ReportCard = () => {
  const componentRef = useRef();
  const [studentData, setStudentData] = useState({
    name: "",
    admissionNo: "PRQ/2023/052",
    class: "SSS TWO",
    section: "Senior Secondary",
    gender: "male",
    examName: "Second Term Examination",
    scores: Array(13).fill({ subject: "", exam: 0, ca1: 0, ca2: 0 }),
  });

  const subjects = [
    "Government",
    "Christian Religious Studies",
    "English",
    "Mathematics",
    "Agricultural Science",
    "Economics",
    "Biology",
    "Chemistry",
    "Yoruba",
    "Literature in English",
    "Civic Education",
    "Further Mathematics",
    "Physics",
  ];

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newScores = [...studentData.scores];
      newScores[index] = { ...newScores[index], [name]: value };
      setStudentData({ ...studentData, scores: newScores });
    } else {
      setStudentData({ ...studentData, [name]: value });
    }
  };

  const calculateTotal = (score) =>
    parseInt(score.exam) + parseInt(score.ca1) + parseInt(score.ca2);

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

  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${studentData.name}_report_card`,
  });

  const ReportCardTemplate = React.forwardRef((props, ref) => {
    const grandTotal = studentData.scores.reduce(
      (sum, score) => sum + calculateTotal(score),
      0
    );
    const average = (
      (grandTotal / (studentData.scores.length * 100)) *
      100
    ).toFixed(2);
    const gpa = (
      studentData.scores.reduce(
        (sum, score) =>
          sum + calculatePoint(calculateGrade(calculateTotal(score))),
        0
      ) / studentData.scores.length
    ).toFixed(2);

    return (
      <div ref={ref} className="report-card">
        <div className="header">
          <img src="/school-logo.png" alt="School Logo" className="logo" />
          <div>
            <Typography variant="h5">PROTEGE SCHOOLS</Typography>
            <Typography>2, Kola Rewire Street, Ejigbo, Lagos</Typography>
            <Typography>protegeacademyconsult@gmail.com</Typography>
            <Typography variant="h6">
              TERM PROGRESS REPORT (2024/2025 ACADEMIC SESSION)
            </Typography>
          </div>
        </div>

        <Grid container spacing={2} className="student-info">
          <Grid item xs={6}>
            <Typography>Student Name: {studentData.name}</Typography>
            <Typography>Class: {studentData.class}</Typography>
            <Typography>Admission No: {studentData.admissionNo}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>Exam Name: {studentData.examName}</Typography>
            <Typography>Section: {studentData.section}</Typography>
            <Typography>Gender: {studentData.gender}</Typography>
          </Grid>
        </Grid>

        <table className="scores-table">
          <thead>
            <tr>
              <th>Subjects</th>
              <th>Exam 60</th>
              <th>1st CA</th>
              <th>2nd CA</th>
              <th>Total</th>
              <th>Grade</th>
              <th>Point</th>
              <th>Remark</th>
            </tr>
          </thead>
          <tbody>
            {studentData.scores.map((score, index) => {
              const total = calculateTotal(score);
              const grade = calculateGrade(total);
              return (
                <tr key={index}>
                  <td>{subjects[index]}</td>
                  <td>{score.exam}/60</td>
                  <td>{score.ca1}/20</td>
                  <td>{score.ca2}/20</td>
                  <td>{total}/100</td>
                  <td>{grade}</td>
                  <td>{calculatePoint(grade).toFixed(2)}</td>
                  <td>
                    {total >= 75
                      ? "Excellent"
                      : total >= 60
                      ? "Very Good"
                      : total >= 50
                      ? "Good"
                      : "Poor"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="summary">
          <Typography>GRAND TOTAL: {grandTotal}/1300</Typography>
          <Typography>Average: {average}%</Typography>
          <Typography>GPA: {gpa}</Typography>
        </div>

        <div className="general-note">
          <Typography>Next TERM begins on 28th of April, 2025</Typography>
          <Typography>School fees for next term: N50,000</Typography>
        </div>
      </div>
    );
  });

  return (
    <Paper className="container">
      <Typography variant="h4" gutterBottom>
        Report Card Generator
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Student Name"
            name="name"
            value={studentData.name}
            onChange={handleInputChange}
          />
        </Grid>
        {/* Add other student info fields similarly */}
      </Grid>

      {subjects.map((subject, index) => (
        <Grid container spacing={2} key={index} style={{ marginTop: "1rem" }}>
          <Grid item xs={3}>
            <Typography>{subject}</Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Exam (60)"
              name="exam"
              type="number"
              value={studentData.scores[index].exam}
              onChange={(e) => handleInputChange(e, index)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="1st CA (20)"
              name="ca1"
              type="number"
              value={studentData.scores[index].ca1}
              onChange={(e) => handleInputChange(e, index)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="2nd CA (20)"
              name="ca2"
              type="number"
              value={studentData.scores[index].ca2}
              onChange={(e) => handleInputChange(e, index)}
            />
          </Grid>
        </Grid>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        style={{ marginTop: "2rem" }}
      >
        Generate PDF
      </Button>

      <div style={{ display: "none" }}>
        <ReportCardTemplate ref={componentRef} />
      </div>
    </Paper>
  );
};

export default ReportCard;
