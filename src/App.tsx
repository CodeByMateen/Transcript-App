import { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import './App.css'

interface Course {
  code: string
  title: string
  credits: number
  grade: string
  points: number
}

interface Semester {
  name: string
  courses: Course[]
  creditHoursEarned: number
  sgpa: string
  cgpa: string
}

interface TranscriptData {
  studentId: string
  studentName: string
  fathersName: string
  school: string
  degree: string
  semesters: Semester[]
  totalCreditHours: number
  totalGradePoints: number
  finalCgpa: string
}

function App() {
  const transcriptRef = useRef<HTMLDivElement>(null)

  const [transcriptData] = useState<TranscriptData>({
    studentId: 'F2024065302',
    studentName: 'Faiz Shahzad',
    fathersName: 'Muhammad Shahzad',
    school: 'School of Systems and Technology',
    degree: 'Bachelor of Science in Software Engineering',
    semesters: [
      {
        name: 'Fall 2024',
        courses: [
          { code: 'CC111', title: 'Programming Fundamentals', credits: 3, grade: 'B+', points: 9.0 },
          { code: 'CC111L', title: 'Programming Fundamentals Lab', credits: 1, grade: 'A-', points: 3.7 },
          { code: 'CC120', title: 'Application of Information & Communication Technologies', credits: 2, grade: 'B-', points: 5.4 },
          { code: 'CC120L', title: 'Application of Information & Communication Technologies (Lab)', credits: 1, grade: 'B', points: 3.0 },
          { code: 'EN110', title: 'English-I', credits: 3, grade: 'C+', points: 6.9 },
          { code: 'ISL112', title: 'Islamic Thought and Perspectives', credits: 2, grade: 'C-', points: 5.1 },
          { code: 'MATH107', title: 'Calculus and Analytical Geometry', credits: 3, grade: 'C+', points: 6.9 },
          { code: 'POL121', title: 'Pakistan Ideology, Constitution and Society', credits: 4, grade: 'B', points: 8.0 },
        ],
        creditHoursEarned: 19,
        sgpa: '2.74',
        cgpa: '2.74'
      },
      {
        name: 'Spring 2025',
        courses: [
          { code: 'CC112', title: 'Object Oriented Programming', credits: 3, grade: 'C', points: 6.0 },
          { code: 'CC112L', title: 'Object Oriented Programming (Lab)', credits: 1, grade: 'B', points: 3.0 },
          { code: 'CC141', title: 'Discrete Structures', credits: 3, grade: 'C', points: 6.0 },
          { code: 'EN123', title: 'English-II', credits: 3, grade: 'B+', points: 8.1 },
          { code: 'MATH102', title: 'Multivariable Calculus', credits: 3, grade: 'C+', points: 6.9 },
          { code: 'MATH150', title: 'Probability and Statistics', credits: 3, grade: 'B', points: 9.0 },
          { code: 'NS125', title: 'Applied Physics', credits: 3, grade: 'C', points: 6.0 },
          { code: 'NS125L', title: 'Applied Physics (Lab)', credits: 1, grade: 'B-', points: 2.7 },
        ],
        creditHoursEarned: 19,
        sgpa: '2.36',
        cgpa: '2.55'
      }
    ],
    totalCreditHours: 38,
    totalGradePoints: 96.80,
    finalCgpa: '2.55 / 4.00'
  })

  const [isEditing, setIsEditing] = useState(false)



  const downloadAsPDF = async () => {
    if (!transcriptRef.current) return

    const canvas = await html2canvas(transcriptRef.current, {
      useCORS: true,
      background: '#ffffff',
      width: transcriptRef.current.offsetWidth * 2,
      height: transcriptRef.current.offsetHeight * 2
    })

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = 210
    const pdfHeight = 297

    // Convert canvas to image and fit to A4
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)

    pdf.save(`${transcriptData.studentName}_transcript.pdf`)
  }

  const downloadAsImage = async () => {
    if (!transcriptRef.current) return

    const canvas = await html2canvas(transcriptRef.current, {
      useCORS: true,
      background: '#ffffff',
      width: transcriptRef.current.offsetWidth * 3,
      height: transcriptRef.current.offsetHeight * 3
    })

    const link = document.createElement('a')
    link.download = `${transcriptData.studentName}_transcript.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="app">
      <div className="controls">
        <h1>Transcript Generator</h1>
        <div className="control-buttons">
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Preview' : 'Edit'}
          </button>
          <button onClick={downloadAsPDF}>Download PDF</button>
          <button onClick={downloadAsImage}>Download Image</button>
        </div>
      </div>


      <div ref={transcriptRef} className="transcript">
        <div className="transcript-header">
          <div className="header-top">
            <div className="serial-number">Sr. No. SE 376F2024-302</div>
            <div className="header-logo">
              <img src="/umt_logo.png" alt="UMT Logo" className="logo" />
              <div className="logo-separator"></div>
              <div className="umt-text">UMT</div>
            </div>
            <div className="header-date">Date: April 14, 2025</div>
          </div>
          <div className="header-title">
            <h1>Student Report</h1>
          </div>
        </div>

        <div className="student-info">
          <div className="info-row">
            <span><strong>ID No:</strong> {transcriptData.studentId}</span>
            <span><strong>Name:</strong> {transcriptData.studentName}</span>
          </div>
          <div className="info-row">
            <span><strong>Father's Name:</strong> {transcriptData.fathersName}</span>
            <span><strong>School:</strong> {transcriptData.school}</span>
          </div>
          <div className="info-row">
            <span><strong>Degree:</strong> {transcriptData.degree}</span>
          </div>
        </div>

        <div className="semesters-container">
          {transcriptData.semesters.map((semester, semesterIndex) => (
            <div key={semesterIndex} className="semester-section">
              <h3 className="semester-title">{semester.name}</h3>
              <div className="courses-table">
                <table>
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Course Title</th>
                      <th>Cr. Hrs</th>
                      <th>Grade</th>
                      <th>G.P.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course, index) => (
                      <tr key={index}>
                        <td className="course-code">{course.code}</td>
                        <td className="course-title">{course.title}</td>
                        <td className="credits">{course.credits}</td>
                        <td className="grade">{course.grade}</td>
                        <td className="points">{course.points.toFixed(1)}</td>
                      </tr>
                    ))}
                    <tr className="summary-row">
                      <td colSpan={5} className="summary-cell">
                        <div className="summary-content">
                          <span className="credit-hours"><strong>Credit Hours Earned: {semester.creditHoursEarned}</strong></span>
                          <span className="cgpa"><strong>CGPA: {semester.cgpa}</strong></span>
                          <span className="sgpa"><strong>SGPA: {semester.sgpa}</strong></span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="total-summary">
          <div className="total-summary-content">
            <span><strong>Total Credit Hours Earned:</strong> {transcriptData.totalCreditHours}</span>
            <span><strong>Total Grade Points:</strong> {transcriptData.totalGradePoints.toFixed(2)}</span>
            <span><strong>CGPA:</strong> {transcriptData.finalCgpa}</span>
          </div>
        </div>

        <div className="transcript-footer">
          <div className="signature-section">
            <div className="signature">
              <div className="signature-line"></div>
              <p>Controller of Examinations</p>
            </div>
            <div className="signature">
              <div className="signature-line verified-signature"></div>
              <p>Registrar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
