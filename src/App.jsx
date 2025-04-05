// // src/App.jsx
// import React, { useState, useRef } from "react";
// import { useReactToPrint } from "react-to-print"; // Keep this
// import {
//   Button,
//   TextField,
//   Grid,
//   Typography,
//   Paper,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   IconButton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import "./App.css";

// // Predefined list of common Nigerian school subjects
// const nigerianSubjects = [
//   "English Language",
//   "Mathematics",
//   "Civic Education",
//   "Basic Science",
//   "Basic Technology",
//   "Social Studies",
//   "Christian Religious Studies",
//   "Islamic Religious Studies",
//   "Yoruba",
//   "Igbo",
//   "Hausa",
//   "Literature in English",
//   "Government",
//   "Economics",
//   "Biology",
//   "Chemistry",
//   "Physics",
//   "Agricultural Science",
//   "Further Mathematics",
//   "Geography",
//   "History",
//   "Computer Studies",
//   "Physical Education",
//   "Health Education",
//   "Fine Arts",
//   "Music",
//   "Home Economics",
//   "Food and Nutrition",
//   "Business Studies",
//   "Accounting",
//   "Commerce",
//   "French",
// ];

// // Class options from Creche to SS3
// const classOptions = [
//   "Creche",
//   "Nursery 1",
//   "Nursery 2",
//   "Primary 1",
//   "Primary 2",
//   "Primary 3",
//   "Primary 4",
//   "Primary 5",
//   "Primary 6",
//   "JSS 1",
//   "JSS 2",
//   "JSS 3",
//   "SS 1",
//   "SS 2",
//   "SS 3",
// ];

// const ReportCard = () => {
//   const componentRef = useRef();
//   const [studentData, setStudentData] = useState({
//     name: "",
//     admissionNo: "",
//     class: "",
//     section: "",
//     gender: "",
//     examName: "",
//     subjects: [{ subject: "", exam: 0, ca1: 0, ca2: 0 }],
//   });

//   const handleInputChange = (e, index = null) => {
//     const { name, value } = e.target;
//     if (index !== null) {
//       const newSubjects = [...studentData.subjects];
//       newSubjects[index] = { ...newSubjects[index], [name]: value };
//       setStudentData({ ...studentData, subjects: newSubjects });
//     } else {
//       setStudentData({ ...studentData, [name]: value });
//     }
//   };

//   const addSubject = () => {
//     setStudentData({
//       ...studentData,
//       subjects: [
//         ...studentData.subjects,
//         { subject: "", exam: 0, ca1: 0, ca2: 0 },
//       ],
//     });
//   };

//   const removeSubject = (index) => {
//     const newSubjects = studentData.subjects.filter((_, i) => i !== index);
//     setStudentData({ ...studentData, subjects: newSubjects });
//   };

//   const calculateTotal = (subject) =>
//     parseInt(subject.exam) + parseInt(subject.ca1) + parseInt(subject.ca2);

//   const calculateGrade = (total) => {
//     if (total >= 75) return "A";
//     if (total >= 60) return "B";
//     if (total >= 50) return "C";
//     if (total >= 40) return "D";
//     return "E";
//   };

//   const calculatePoint = (grade) => {
//     const points = { A: 5, B: 4, C: 3, D: 2, E: 1 };
//     return points[grade] || 0;
//   };

//   const generatePDF = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: `${studentData.name}_report_card`,
//   });

//   const ReportCardTemplate = React.forwardRef((props, ref) => {
//     const maxScore = studentData.subjects.length * 100;
//     const grandTotal = studentData.subjects.reduce(
//       (sum, subject) => sum + calculateTotal(subject),
//       0
//     );
//     const average = ((grandTotal / maxScore) * 100).toFixed(2);
//     const gpa = (
//       studentData.subjects.reduce(
//         (sum, subject) =>
//           sum + calculatePoint(calculateGrade(calculateTotal(subject))),
//         0
//       ) / studentData.subjects.length
//     ).toFixed(2);

//     return (
//       <div ref={ref} className="report-card">
//         <div className="header">
//           <img src="/school-logo.png" alt="School Logo" className="logo" />
//           <div>
//             <Typography variant="h5">PROTEGE SCHOOLS</Typography>
//             <Typography>2, Kola Rewire Street, Ejigbo, Lagos</Typography>
//             <Typography>protegeacademyconsult@gmail.com</Typography>
//             <Typography variant="h6">
//               TERM PROGRESS REPORT (2024/2025 ACADEMIC SESSION)
//             </Typography>
//           </div>
//         </div>

//         <Grid container spacing={2} className="student-info">
//           <Grid item xs={6}>
//             <Typography>Student Name: {studentData.name}</Typography>
//             <Typography>Class: {studentData.class}</Typography>
//             <Typography>Admission No: {studentData.admissionNo}</Typography>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography>Exam Name: {studentData.examName}</Typography>
//             <Typography>Section: {studentData.section}</Typography>
//             <Typography>Gender: {studentData.gender}</Typography>
//           </Grid>
//         </Grid>

//         <table className="scores-table">
//           <thead>
//             <tr>
//               <th>Subjects</th>
//               <th>Exam 60</th>
//               <th>1st CA</th>
//               <th>2nd CA</th>
//               <th>Total</th>
//               <th>Grade</th>
//               <th>Point</th>
//               <th>Remark</th>
//             </tr>
//           </thead>
//           <tbody>
//             {studentData.subjects.map((subject, index) => {
//               const total = calculateTotal(subject);
//               const grade = calculateGrade(total);
//               return (
//                 <tr key={index}>
//                   <td>{subject.subject}</td>
//                   <td>{subject.exam}/60</td>
//                   <td>{subject.ca1}/20</td>
//                   <td>{subject.ca2}/20</td>
//                   <td>{total}/100</td>
//                   <td>{grade}</td>
//                   <td>{calculatePoint(grade).toFixed(2)}</td>
//                   <td>
//                     {total >= 75
//                       ? "Excellent"
//                       : total >= 60
//                       ? "Very Good"
//                       : total >= 50
//                       ? "Good"
//                       : "Poor"}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <div className="summary">
//           <Typography>
//             GRAND TOTAL: {grandTotal}/{maxScore}
//           </Typography>
//           <Typography>Average: {average}%</Typography>
//           <Typography>GPA: {gpa}</Typography>
//         </div>

//         <div className="general-note">
//           <Typography>Next TERM begins on 28th of April, 2025</Typography>
//           <Typography>School fees for next term: N50,000</Typography>
//         </div>
//       </div>
//     );
//   });

//   return (
//     <Paper className="container">
//       <Typography variant="h4" gutterBottom>
//         Report Card Generator
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Student Name"
//             name="name"
//             value={studentData.name}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Admission No"
//             name="admissionNo"
//             value={studentData.admissionNo}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <FormControl fullWidth>
//             <InputLabel>Class</InputLabel>
//             <Select
//               name="class"
//               value={studentData.class}
//               onChange={handleInputChange}
//             >
//               {classOptions.map((cls) => (
//                 <MenuItem key={cls} value={cls}>
//                   {cls}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Section"
//             name="section"
//             value={studentData.section}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Gender"
//             name="gender"
//             value={studentData.gender}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Exam Name"
//             name="examName"
//             value={studentData.examName}
//             onChange={handleInputChange}
//           />
//         </Grid>
//       </Grid>

//       <Typography variant="h6" style={{ marginTop: "2rem" }}>
//         Subjects and Scores
//       </Typography>

//       {studentData.subjects.map((subject, index) => (
//         <Grid container spacing={2} key={index} style={{ marginTop: "1rem" }}>
//           <Grid item xs={3}>
//             <FormControl fullWidth>
//               <InputLabel>Subject</InputLabel>
//               <Select
//                 name="subject"
//                 value={subject.subject}
//                 onChange={(e) => handleInputChange(e, index)}
//               >
//                 {nigerianSubjects.map((subj) => (
//                   <MenuItem key={subj} value={subj}>
//                     {subj}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={2}>
//             <TextField
//               label="Exam (60)"
//               name="exam"
//               type="number"
//               value={subject.exam}
//               onChange={(e) => handleInputChange(e, index)}
//             />
//           </Grid>
//           <Grid item xs={2}>
//             <TextField
//               label="1st CA (20)"
//               name="ca1"
//               type="number"
//               value={subject.ca1}
//               onChange={(e) => handleInputChange(e, index)}
//             />
//           </Grid>
//           <Grid item xs={2}>
//             <TextField
//               label="2nd CA (20)"
//               name="ca2"
//               type="number"
//               value={subject.ca2}
//               onChange={(e) => handleInputChange(e, index)}
//             />
//           </Grid>
//           <Grid item xs={1}>
//             <IconButton onClick={() => removeSubject(index)} color="error">
//               <DeleteIcon />
//             </IconButton>
//           </Grid>
//         </Grid>
//       ))}

//       <Button
//         variant="outlined"
//         startIcon={<AddIcon />}
//         onClick={addSubject}
//         style={{ marginTop: "1rem" }}
//       >
//         Add Subject
//       </Button>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={generatePDF}
//         style={{ marginTop: "2rem", marginLeft: "1rem" }}
//       >
//         Generate PDF
//       </Button>

//       <div style={{ display: "none" }}>
//         <ReportCardTemplate ref={componentRef} />
//       </div>
//     </Paper>
//   );
// };

// export default ReportCard;

// src/App.jsx
import React, { useState } from "react";
import { jsPDF } from "jspdf"; // Use this for direct PDF generation
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

// Class options from Creche to SS3
const classOptions = [
  "Creche",
  "Nursery 1",
  "Nursery 2",
  "Primary 1",
  "Primary 2",
  "Primary 3",
  "Primary 4",
  "Primary 5",
  "Primary 6",
  "JSS 1",
  "JSS 2",
  "JSS 3",
  "SS 1",
  "SS 2",
  "SS 3",
];

const ReportCard = () => {
  const [studentData, setStudentData] = useState({
    name: "",
    admissionNo: "",
    class: "",
    section: "",
    gender: "",
    examName: "",
    subjects: [{ subject: "", exam: 0, ca1: 0, ca2: 0 }],
  });

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const newSubjects = [...studentData.subjects];
      newSubjects[index] = { ...newSubjects[index], [name]: value };
      setStudentData({ ...studentData, subjects: newSubjects });
    } else {
      setStudentData({ ...studentData, [name]: value });
    }
  };

  const addSubject = () => {
    setStudentData({
      ...studentData,
      subjects: [
        ...studentData.subjects,
        { subject: "", exam: 0, ca1: 0, ca2: 0 },
      ],
    });
  };

  const removeSubject = (index) => {
    const newSubjects = studentData.subjects.filter((_, i) => i !== index);
    setStudentData({ ...studentData, subjects: newSubjects });
  };

  const calculateTotal = (subject) =>
    parseInt(subject.exam) + parseInt(subject.ca1) + parseInt(subject.ca2);

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

    // Header
    doc.setFontSize(16);
    doc.text("PROTEGE SCHOOLS", 105, 10, { align: "center" });
    doc.setFontSize(12);
    doc.text("2, Kola Rewire Street, Ejigbo, Lagos", 105, 18, {
      align: "center",
    });
    doc.text("protegeacademyconsult@gmail.com", 105, 24, { align: "center" });
    doc.text("SECOND TERM PROGRESS REPORT (2024/2025 ACADEMIC SESSION)", 105, 32, {
      align: "center",
    });

    // Student Info
    doc.setFontSize(10);
    doc.text(`Student Name: ${studentData.name}`, 10, 40);
    doc.text(`Class: ${studentData.class}`, 10, 46);
    doc.text(`Admission No: ${studentData.admissionNo}`, 10, 52);
    doc.text(`Exam Name: ${studentData.examName}`, 110, 40);
    doc.text(`Section: ${studentData.section}`, 110, 46);
    doc.text(`Gender: ${studentData.gender}`, 110, 52);

    // Table Headers
    const headers = [
      "Subjects",
      "Exam 60",
      "1st CA",
      "2nd CA",
      "Total",
      "Grade",
      "Point",
      "Remark",
    ];
    const columnWidths = [60, 20, 20, 20, 20, 15, 15, 20];
    let x = 10;
    doc.setFontSize(10);
    doc.setFillColor(240, 240, 240);
    doc.rect(10, 60, 190, 8, "F");
    headers.forEach((header, i) => {
      doc.text(header, x + 2, 66);
      x += columnWidths[i];
    });

    // Table Data
    let y = 74;
    studentData.subjects.forEach((subject) => {
      const total = calculateTotal(subject);
      const grade = calculateGrade(total);
      const point = calculatePoint(grade).toFixed(2);
      const remark =
        total >= 75
          ? "Excellent"
          : total >= 60
          ? "Very Good"
          : total >= 50
          ? "Good"
          : "Poor";

      x = 10;
      doc.text(subject.subject, x + 2, y);
      x += columnWidths[0];
      doc.text(`${subject.exam}/60`, x + 2, y);
      x += columnWidths[1];
      doc.text(`${subject.ca1}/20`, x + 2, y);
      x += columnWidths[2];
      doc.text(`${subject.ca2}/20`, x + 2, y);
      x += columnWidths[3];
      doc.text(`${total}/100`, x + 2, y);
      x += columnWidths[4];
      doc.text(grade, x + 2, y);
      x += columnWidths[5];
      doc.text(point, x + 2, y);
      x += columnWidths[6];
      doc.text(remark, x + 2, y);
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
        (sum, subject) =>
          sum + calculatePoint(calculateGrade(calculateTotal(subject))),
        0
      ) / studentData.subjects.length
    ).toFixed(2);

    y += 10;
    doc.text(`GRAND TOTAL: ${grandTotal}/${maxScore}`, 10, y);
    doc.text(`Average: ${average}%`, 10, y + 6);
    doc.text(`GPA: ${gpa}`, 10, y + 12);

    // General Note
    y += 20;
    doc.text("Next TERM begins on 28th of April, 2025", 10, y);
    doc.text("School fees for next term: N50,000", 10, y + 6);

    // Download the PDF
    doc.save(`${studentData.name}_report_card.pdf`);
  };

  return (
    <Paper className="container">
      <Typography variant="h4" gutterBottom>
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
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Admission No"
            name="admissionNo"
            value={studentData.admissionNo}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel>Class</InputLabel>
            <Select
              name="class"
              value={studentData.class}
              onChange={handleInputChange}
            >
              {classOptions.map((cls) => (
                <MenuItem key={cls} value={cls}>
                  {cls}
                </MenuItem>
              ))}
            </Select>
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
          />
        </Grid>
      </Grid>

      <Typography variant="h6" style={{ marginTop: "2rem" }}>
        Subjects and Scores
      </Typography>

      {studentData.subjects.map((subject, index) => (
        <Grid container spacing={2} key={index} style={{ marginTop: "1rem" }}>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Subject</InputLabel>
              <Select
                name="subject"
                value={subject.subject}
                onChange={(e) => handleInputChange(e, index)}
              >
                {nigerianSubjects.map((subj) => (
                  <MenuItem key={subj} value={subj}>
                    {subj}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="Exam (60)"
              name="exam"
              type="number"
              value={subject.exam}
              onChange={(e) => handleInputChange(e, index)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="1st CA (20)"
              name="ca1"
              type="number"
              value={subject.ca1}
              onChange={(e) => handleInputChange(e, index)}
            />
          </Grid>
          <Grid item xs={2}>
            <TextField
              label="2nd CA (20)"
              name="ca2"
              type="number"
              value={subject.ca2}
              onChange={(e) => handleInputChange(e, index)}
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

      <Button
        variant="contained"
        color="primary"
        onClick={generatePDF}
        style={{ marginTop: "2rem", marginLeft: "1rem" }}
      >
        Generate PDF
      </Button>
    </Paper>
  );
};

export default ReportCard;

// // src/App.jsx
// import React, { useState, useRef } from "react";
// import { jsPDF } from "jspdf";
// import { useReactToPrint } from "react-to-print";
// import {
//   Button,
//   TextField,
//   Grid,
//   Typography,
//   Paper,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   IconButton,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import DeleteIcon from "@mui/icons-material/Delete";
// import "./App.css";

// // Predefined list of common Nigerian school subjects
// const nigerianSubjects = [
//   "English Language",
//   "Mathematics",
//   "Civic Education",
//   "Basic Science",
//   "Basic Technology",
//   "Social Studies",
//   "Christian Religious Studies",
//   "Islamic Religious Studies",
//   "Yoruba",
//   "Igbo",
//   "Hausa",
//   "Literature in English",
//   "Government",
//   "Economics",
//   "Biology",
//   "Chemistry",
//   "Physics",
//   "Agricultural Science",
//   "Further Mathematics",
//   "Geography",
//   "History",
//   "Computer Studies",
//   "Physical Education",
//   "Health Education",
//   "Fine Arts",
//   "Music",
//   "Home Economics",
//   "Food and Nutrition",
//   "Business Studies",
//   "Accounting",
//   "Commerce",
//   "French",
// ];

// // Class options from Creche to SS3
// const classOptions = [
//   "Creche",
//   "Nursery 1",
//   "Nursery 2",
//   "Primary 1",
//   "Primary 2",
//   "Primary 3",
//   "Primary 4",
//   "Primary 5",
//   "Primary 6",
//   "JSS 1",
//   "JSS 2",
//   "JSS 3",
//   "SS 1",
//   "SS 2",
//   "SS 3",
// ];

// const ReportCard = () => {
//   const componentRef = useRef();
//   const [studentData, setStudentData] = useState({
//     name: "",
//     admissionNo: "",
//     class: "",
//     section: "",
//     gender: "",
//     examName: "",
//     subjects: [{ subject: "", exam: 0, ca1: 0, ca2: 0 }],
//   });

//   const handleInputChange = (e, index = null) => {
//     const { name, value } = e.target;
//     if (index !== null) {
//       const newSubjects = [...studentData.subjects];
//       newSubjects[index] = { ...newSubjects[index], [name]: value };
//       setStudentData({ ...studentData, subjects: newSubjects });
//     } else {
//       setStudentData({ ...studentData, [name]: value });
//     }
//   };

//   const addSubject = () => {
//     setStudentData({
//       ...studentData,
//       subjects: [
//         ...studentData.subjects,
//         { subject: "", exam: 0, ca1: 0, ca2: 0 },
//       ],
//     });
//   };

//   const removeSubject = (index) => {
//     const newSubjects = studentData.subjects.filter((_, i) => i !== index);
//     setStudentData({ ...studentData, subjects: newSubjects });
//   };

//   const calculateTotal = (subject) =>
//     parseInt(subject.exam) + parseInt(subject.ca1) + parseInt(subject.ca2);

//   const calculateGrade = (total) => {
//     if (total >= 75) return "A";
//     if (total >= 60) return "B";
//     if (total >= 50) return "C";
//     if (total >= 40) return "D";
//     return "E";
//   };

//   const calculatePoint = (grade) => {
//     const points = { A: 5, B: 4, C: 3, D: 2, E: 1 };
//     return points[grade] || 0;
//   };

//   const generatePDF = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: `${studentData.name}_report_card`,
//   });

//   const ReportCardTemplate = React.forwardRef((props, ref) => {
//     const maxScore = studentData.subjects.length * 100;
//     const grandTotal = studentData.subjects.reduce(
//       (sum, subject) => sum + calculateTotal(subject),
//       0
//     );
//     const average = ((grandTotal / maxScore) * 100).toFixed(2);
//     const gpa = (
//       studentData.subjects.reduce(
//         (sum, subject) =>
//           sum + calculatePoint(calculateGrade(calculateTotal(subject))),
//         0
//       ) / studentData.subjects.length
//     ).toFixed(2);

//     return (
//       <div ref={ref} className="report-card">
//         <div className="header">
//           <img src="/school-logo.png" alt="School Logo" className="logo" />
//           <div>
//             <Typography variant="h5">PROTEGE SCHOOLS</Typography>
//             <Typography>2, Kola Rewire Street, Ejigbo, Lagos</Typography>
//             <Typography>protegeacademyconsult@gmail.com</Typography>
//             <Typography variant="h6">
//               TERM PROGRESS REPORT (2024/2025 ACADEMIC SESSION)
//             </Typography>
//           </div>
//         </div>

//         <Grid container spacing={2} className="student-info">
//           <Grid item xs={6}>
//             <Typography>Student Name: {studentData.name}</Typography>
//             <Typography>Class: {studentData.class}</Typography>
//             <Typography>Admission No: {studentData.admissionNo}</Typography>
//           </Grid>
//           <Grid item xs={6}>
//             <Typography>Exam Name: {studentData.examName}</Typography>
//             <Typography>Section: {studentData.section}</Typography>
//             <Typography>Gender: {studentData.gender}</Typography>
//           </Grid>
//         </Grid>

//         <table className="scores-table">
//           <thead>
//             <tr>
//               <th>Subjects</th>
//               <th>Exam 60</th>
//               <th>1st CA</th>
//               <th>2nd CA</th>
//               <th>Total</th>
//               <th>Grade</th>
//               <th>Point</th>
//               <th>Remark</th>
//             </tr>
//           </thead>
//           <tbody>
//             {studentData.subjects.map((subject, index) => {
//               const total = calculateTotal(subject);
//               const grade = calculateGrade(total);
//               return (
//                 <tr key={index}>
//                   <td>{subject.subject}</td>
//                   <td>{subject.exam}/60</td>
//                   <td>{subject.ca1}/20</td>
//                   <td>{subject.ca2}/20</td>
//                   <td>{total}/100</td>
//                   <td>{grade}</td>
//                   <td>{calculatePoint(grade).toFixed(2)}</td>
//                   <td>
//                     {total >= 75
//                       ? "Excellent"
//                       : total >= 60
//                       ? "Very Good"
//                       : total >= 50
//                       ? "Good"
//                       : "Poor"}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         <div className="summary">
//           <Typography>
//             GRAND TOTAL: {grandTotal}/{maxScore}
//           </Typography>
//           <Typography>Average: {average}%</Typography>
//           <Typography>GPA: {gpa}</Typography>
//         </div>

//         <div className="general-note">
//           <Typography>Next TERM begins on 28th of April, 2025</Typography>
//           <Typography>School fees for next term: N50,000</Typography>
//         </div>
//       </div>
//     );
//   });

//   return (
//     <Paper className="container">
//       <Typography variant="h4" gutterBottom>
//         Report Card Generator
//       </Typography>

//       <Grid container spacing={2}>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Student Name"
//             name="name"
//             value={studentData.name}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Admission No"
//             name="admissionNo"
//             value={studentData.admissionNo}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <FormControl fullWidth>
//             <InputLabel>Class</InputLabel>
//             <Select
//               name="class"
//               value={studentData.class}
//               onChange={handleInputChange}
//             >
//               {classOptions.map((cls) => (
//                 <MenuItem key={cls} value={cls}>
//                   {cls}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Section"
//             name="section"
//             value={studentData.section}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Gender"
//             name="gender"
//             value={studentData.gender}
//             onChange={handleInputChange}
//           />
//         </Grid>
//         <Grid item xs={12} md={4}>
//           <TextField
//             fullWidth
//             label="Exam Name"
//             name="examName"
//             value={studentData.examName}
//             onChange={handleInputChange}
//           />
//         </Grid>
//       </Grid>

//       <Typography variant="h6" style={{ marginTop: "2rem" }}>
//         Subjects and Scores
//       </Typography>

//       {studentData.subjects.map((subject, index) => (
//         <Grid container spacing={2} key={index} style={{ marginTop: "1rem" }}>
//           <Grid item xs={3}>
//             <FormControl fullWidth>
//               <InputLabel>Subject</InputLabel>
//               <Select
//                 name="subject"
//                 value={subject.subject}
//                 onChange={(e) => handleInputChange(e, index)}
//               >
//                 {nigerianSubjects.map((subj) => (
//                   <MenuItem key={subj} value={subj}>
//                     {subj}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={2}>
//             <TextField
//               label="Exam (60)"
//               name="exam"
//               type="number"
//               value={subject.exam}
//               onChange={(e) => handleInputChange(e, index)}
//             />
//           </Grid>
//           <Grid item xs={2}>
//             <TextField
//               label="1st CA (20)"
//               name="ca1"
//               type="number"
//               value={subject.ca1}
//               onChange={(e) => handleInputChange(e, index)}
//             />
//           </Grid>
//           <Grid item xs={2}>
//             <TextField
//               label="2nd CA (20)"
//               name="ca2"
//               type="number"
//               value={subject.ca2}
//               onChange={(e) => handleInputChange(e, index)}
//             />
//           </Grid>
//           <Grid item xs={1}>
//             <IconButton onClick={() => removeSubject(index)} color="error">
//               <DeleteIcon />
//             </IconButton>
//           </Grid>
//         </Grid>
//       ))}

//       <Button
//         variant="outlined"
//         startIcon={<AddIcon />}
//         onClick={addSubject}
//         style={{ marginTop: "1rem" }}
//       >
//         Add Subject
//       </Button>

//       <Button
//         variant="contained"
//         color="primary"
//         onClick={generatePDF}
//         style={{ marginTop: "2rem", marginLeft: "1rem" }}
//       >
//         Generate PDF
//       </Button>

//       <div style={{ display: "none" }}>
//         <ReportCardTemplate ref={componentRef} />
//       </div>
//     </Paper>
//   );
// };

// export default ReportCard;
