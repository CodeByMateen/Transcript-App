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

interface TranscriptData {
  studentName: string
  studentId: string
  program: string
  semester: string
  year: string
  cgpa: string
  courses: Course[]
}

function App() {
  const transcriptRef = useRef<HTMLDivElement>(null)
  
  const [transcriptData, setTranscriptData] = useState<TranscriptData>({
    studentName: 'John Doe',
    studentId: '2021-CS-001',
    program: 'Bachelor of Science in Computer Science',
    semester: 'Fall',
    year: '2024',
    cgpa: '3.75',
    courses: [
      { code: 'CS-101', title: 'Introduction to Programming', credits: 3, grade: 'A', points: 12.0 },
      { code: 'CS-201', title: 'Data Structures', credits: 3, grade: 'A-', points: 11.1 },
      { code: 'CS-301', title: 'Database Systems', credits: 3, grade: 'B+', points: 9.9 },
      { code: 'MTH-101', title: 'Calculus I', credits: 3, grade: 'B', points: 9.0 },
    ]
  })

  const [isEditing, setIsEditing] = useState(false)

  const updateTranscriptData = (field: keyof TranscriptData, value: any) => {
    setTranscriptData(prev => ({ ...prev, [field]: value }))
  }

  const updateCourse = (index: number, field: keyof Course, value: any) => {
    const updatedCourses = [...transcriptData.courses]
    updatedCourses[index] = { ...updatedCourses[index], [field]: value }
    setTranscriptData(prev => ({ ...prev, courses: updatedCourses }))
  }

  const addCourse = () => {
    const newCourse: Course = { code: '', title: '', credits: 3, grade: 'A', points: 12.0 }
    setTranscriptData(prev => ({ ...prev, courses: [...prev.courses, newCourse] }))
  }

  const removeCourse = (index: number) => {
    const updatedCourses = transcriptData.courses.filter((_, i) => i !== index)
    setTranscriptData(prev => ({ ...prev, courses: updatedCourses }))
  }

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

      {isEditing && (
        <div className="edit-form">
          <h2>Edit Transcript</h2>
          <div className="form-group">
            <label>Student Name:</label>
            <input
              type="text"
              value={transcriptData.studentName}
              onChange={(e) => updateTranscriptData('studentName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Student ID:</label>
            <input
              type="text"
              value={transcriptData.studentId}
              onChange={(e) => updateTranscriptData('studentId', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Program:</label>
            <input
              type="text"
              value={transcriptData.program}
              onChange={(e) => updateTranscriptData('program', e.target.value)}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Semester:</label>
              <input
                type="text"
                value={transcriptData.semester}
                onChange={(e) => updateTranscriptData('semester', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Year:</label>
              <input
                type="text"
                value={transcriptData.year}
                onChange={(e) => updateTranscriptData('year', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>CGPA:</label>
              <input
                type="text"
                value={transcriptData.cgpa}
                onChange={(e) => updateTranscriptData('cgpa', e.target.value)}
              />
            </div>
          </div>
          
          <h3>Courses</h3>
          {transcriptData.courses.map((course, index) => (
            <div key={index} className="course-row">
              <input
                type="text"
                placeholder="Course Code"
                value={course.code}
                onChange={(e) => updateCourse(index, 'code', e.target.value)}
              />
              <input
                type="text"
                placeholder="Course Title"
                value={course.title}
                onChange={(e) => updateCourse(index, 'title', e.target.value)}
              />
              <input
                type="number"
                placeholder="Credits"
                value={course.credits}
                onChange={(e) => updateCourse(index, 'credits', parseInt(e.target.value))}
              />
              <input
                type="text"
                placeholder="Grade"
                value={course.grade}
                onChange={(e) => updateCourse(index, 'grade', e.target.value)}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Points"
                value={course.points}
                onChange={(e) => updateCourse(index, 'points', parseFloat(e.target.value))}
              />
              <button onClick={() => removeCourse(index)}>Remove</button>
            </div>
          ))}
          <button onClick={addCourse}>Add Course</button>
        </div>
      )}

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
            <h1>University Transcript</h1>
          </div>
        </div>
        
        <div className="student-info">
          <div className="info-row">
            <span><strong>Student Name:</strong> {transcriptData.studentName}</span>
            <span><strong>Student ID:</strong> {transcriptData.studentId}</span>
          </div>
          <div className="info-row">
            <span><strong>Program:</strong> {transcriptData.program}</span>
          </div>
          <div className="info-row">
            <span><strong>Semester:</strong> {transcriptData.semester} {transcriptData.year}</span>
            <span><strong>CGPA:</strong> {transcriptData.cgpa}</span>
          </div>
        </div>

        <div className="courses-table">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th>Course Title</th>
                <th>Credits</th>
                <th>Grade</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {transcriptData.courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.code}</td>
                  <td>{course.title}</td>
                  <td>{course.credits}</td>
                  <td>{course.grade}</td>
                  <td>{course.points.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="transcript-footer">
          <div className="footer-info">
            <p><strong>Total Credits:</strong> {transcriptData.courses.reduce((sum, course) => sum + course.credits, 0)}</p>
            <p><strong>Total Points:</strong> {transcriptData.courses.reduce((sum, course) => sum + course.points, 0).toFixed(1)}</p>
          </div>
          <div className="signature-section">
            <div className="signature">
              <div className="signature-line"></div>
              <p>Registrar</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
