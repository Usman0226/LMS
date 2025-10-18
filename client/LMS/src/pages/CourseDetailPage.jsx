import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { coursesAPI, assignmentsAPI } from '../services/api';
import AssignmentForm from '../components/AssignmentForm';
import AssignmentSubmissionForm from '../components/AssignmentSubmissionForm';

const mockCourseDetails = {
  '1': {
    id: '1',
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science and programming with Python.',
    overview:
      'Build a strong foundation in computational thinking, problem solving, and programming constructs while exploring real-world applications.',
    duration: '12 weeks',
    level: 'Beginner',
    instructor: 'Dr. Sarah Johnson',
    credits: 4,
    students: 125,
    prerequisites: 'No prior programming experience required. Comfortable using a computer.',
    learningObjectives: [
      'Understand core concepts such as algorithms, abstraction, and data structures.',
      'Write readable Python code using functions, loops, and conditionals.',
      'Develop problem-solving strategies for tackling computational challenges.'
    ],
    syllabus: [
      {
        week: 'Week 1',
        topic: 'Computational Thinking and Python Basics',
        details: 'Set up the development environment, learn variables, data types, and simple I/O.'
      },
      {
        week: 'Week 3',
        topic: 'Control Flow and Functions',
        details: 'Use conditionals, loops, and modularize code with functions.'
      },
      {
        week: 'Week 6',
        topic: 'Data Structures',
        details: 'Work with lists, dictionaries, tuples, and sets to organize data.'
      },
      {
        week: 'Week 10',
        topic: 'Capstone Project',
        details: 'Design and implement a small software project using best practices.'
      }
    ],
    resources: [
      'Python Crash Course by Eric Matthes',
      'Harvard CS50 lecture series on YouTube',
      'Real Python tutorials'
    ],
    assignments: [
      {
        _id: 'cs101-a1',
        title: 'Problem Solving with Loops',
        description: 'Implement a set of classic problems using iterative approaches.',
        dueDate: '2025-01-28T00:00:00Z',
        points: 50,
        status: 'Active'
      },
      {
        _id: 'cs101-a2',
        title: 'Python Mini Project',
        description: 'Build a command-line application that solves a real-world problem.',
        dueDate: '2025-02-18T00:00:00Z',
        points: 100,
        status: 'Upcoming'
      }
    ],
    enrolledStudents: [
      {
        _id: 's1',
        name: 'Alice Brown',
        email: 'alice.brown@example.com',
        enrolledAt: '2024-09-01T00:00:00Z'
      },
      {
        _id: 's2',
        name: 'Javier Martínez',
        email: 'javier.martinez@example.com',
        enrolledAt: '2024-09-03T00:00:00Z'
      },
      {
        _id: 's3',
        name: 'Maya Patel',
        email: 'maya.patel@example.com',
        enrolledAt: '2024-09-04T00:00:00Z'
      }
    ]
  },
  '2': {
    id: '2',
    code: 'MATH201',
    title: 'Linear Algebra',
    description: 'Study vectors, matrices, and linear transformations with real-world applications.',
    overview:
      'Deepen mathematical maturity by learning the theory and computational techniques behind vector spaces and matrices.',
    duration: '10 weeks',
    level: 'Intermediate',
    instructor: 'Prof. Michael Chen',
    credits: 3,
    students: 89,
    prerequisites: 'Calculus I or equivalent understanding of limits, derivatives, and integrals.',
    learningObjectives: [
      'Manipulate matrices for solving linear systems and transformations.',
      'Compute eigenvalues and eigenvectors for applications in data science and physics.',
      'Interpret geometric meaning of vector spaces and projections.'
    ],
    syllabus: [
      {
        week: 'Week 1',
        topic: 'Systems of Linear Equations',
        details: 'Gaussian elimination, row-reduced echelon form, and solution spaces.'
      },
      {
        week: 'Week 4',
        topic: 'Vector Spaces and Subspaces',
        details: 'Basis, dimension, and the rank-nullity theorem.'
      },
      {
        week: 'Week 7',
        topic: 'Eigenvalues and Eigenvectors',
        details: 'Characteristic polynomials and diagonalization.'
      },
      {
        week: 'Week 9',
        topic: 'Applications',
        details: 'Principal component analysis and Markov chains.'
      }
    ],
    resources: [
      'Linear Algebra and Its Applications by Gilbert Strang',
      'MIT OpenCourseWare 18.06 lecture videos',
      '3Blue1Brown Essence of Linear Algebra series'
    ],
    assignments: [
      {
        _id: 'math201-a1',
        title: 'Matrix Computation Problem Set',
        description: 'Solve systems, compute inverses, and analyze matrix properties.',
        dueDate: '2025-01-25T00:00:00Z',
        points: 40,
        status: 'Active'
      },
      {
        _id: 'math201-a2',
        title: 'Eigenvalue Analysis Report',
        description: 'Apply eigenvalue techniques to a dataset of your choice.',
        dueDate: '2025-02-15T00:00:00Z',
        points: 60,
        status: 'Upcoming'
      }
    ],
    enrolledStudents: [
      {
        _id: 's4',
        name: 'Noah Kim',
        email: 'noah.kim@example.com',
        enrolledAt: '2024-08-22T00:00:00Z'
      },
      {
        _id: 's5',
        name: 'Priya Singh',
        email: 'priya.singh@example.com',
        enrolledAt: '2024-08-24T00:00:00Z'
      }
    ]
  },
  '3': {
    id: '3',
    code: 'ENG150',
    title: 'Academic Writing',
    description: 'Develop your academic writing skills for university-level coursework.',
    overview:
      'Practice evidence-based writing, argument structure, and revision techniques tailored to academic contexts.',
    duration: '8 weeks',
    level: 'Beginner',
    instructor: 'Dr. Emily Wilson',
    credits: 3,
    students: 67,
    prerequisites: 'Proficiency in English grammar and composition.',
    learningObjectives: [
      'Compose structured analytical essays with clear thesis statements.',
      'Integrate scholarly sources using proper citation styles.',
      'Revise drafts based on peer and instructor feedback.'
    ],
    syllabus: [
      {
        week: 'Week 1',
        topic: 'Understanding Academic Genres',
        details: 'Analyze sample essays and identify conventions in different disciplines.'
      },
      {
        week: 'Week 3',
        topic: 'Research and Citation Strategies',
        details: 'Locate credible sources and cite using APA and MLA formats.'
      },
      {
        week: 'Week 5',
        topic: 'Argumentation and Logical Flow',
        details: 'Develop coherent arguments with strong transitions and paragraph structure.'
      },
      {
        week: 'Week 7',
        topic: 'Revision Workshop',
        details: 'Peer review sessions and techniques for refining drafts.'
      }
    ],
    resources: [
      'They Say / I Say by Graff and Birkenstein',
      'Purdue OWL writing resources',
      'Zotero reference management guide'
    ],
    assignments: [
      {
        _id: 'eng150-a1',
        title: 'Rhetorical Analysis Essay',
        description: 'Evaluate the persuasive strategies of a scholarly article.',
        dueDate: '2025-01-29T00:00:00Z',
        points: 40,
        status: 'Active'
      },
      {
        _id: 'eng150-a2',
        title: 'Research-Based Argument',
        description: 'Write a 2000-word paper incorporating at least five scholarly sources.',
        dueDate: '2025-02-21T00:00:00Z',
        points: 80,
        status: 'Upcoming'
      }
    ],
    enrolledStudents: [
      {
        _id: 's6',
        name: 'Henry Davis',
        email: 'henry.davis@example.com',
        enrolledAt: '2024-09-05T00:00:00Z'
      },
      {
        _id: 's7',
        name: 'Fatima Al-Sayeed',
        email: 'fatima.alsayeed@example.com',
        enrolledAt: '2024-09-06T00:00:00Z'
      }
    ]
  },
  '4': {
    id: '4',
    code: 'PHYS202',
    title: 'Classical Mechanics',
    description: 'Explore the fundamental principles of classical mechanics and their applications.',
    overview:
      'Study Newtonian mechanics, conservation laws, and oscillatory motion with a focus on problem-solving skills.',
    duration: '14 weeks',
    level: 'Advanced',
    instructor: 'Dr. Robert Taylor',
    credits: 4,
    students: 42,
    prerequisites: 'Calculus II and introductory physics covering kinematics and forces.',
    learningObjectives: [
      'Model physical systems using Newton’s laws and conservation principles.',
      'Apply Lagrangian mechanics to analyze constrained motion.',
      'Interpret real-world phenomena such as planetary motion and rigid-body dynamics.'
    ],
    syllabus: [
      {
        week: 'Week 1',
        topic: 'Kinematics and Dynamics',
        details: 'Vector calculus review, equations of motion, and reference frames.'
      },
      {
        week: 'Week 5',
        topic: 'Energy and Momentum Methods',
        details: 'Work-energy theorem, impulse, and collisions.'
      },
      {
        week: 'Week 9',
        topic: 'Oscillations and Resonance',
        details: 'Simple harmonic motion, damped and driven oscillations.'
      },
      {
        week: 'Week 12',
        topic: 'Lagrangian Mechanics',
        details: 'Generalized coordinates and Euler-Lagrange equations.'
      }
    ],
    resources: [
      'Classical Mechanics by Taylor',
      'Feynman Lectures on Physics, Volume I',
      'MIT OpenCourseWare 8.01 problem sets'
    ],
    assignments: [
      {
        _id: 'phys202-a1',
        title: 'Dynamics Problem Set',
        description: 'Analyze multi-body systems using free-body diagrams and equations of motion.',
        dueDate: '2025-02-02T00:00:00Z',
        points: 60,
        status: 'Active'
      },
      {
        _id: 'phys202-a2',
        title: 'Oscillations Lab Report',
        description: 'Model a driven oscillator and compare theoretical predictions with data.',
        dueDate: '2025-02-24T00:00:00Z',
        points: 70,
        status: 'Upcoming'
      }
    ],
    enrolledStudents: [
      {
        _id: 's8',
        name: 'Chun Li',
        email: 'chun.li@example.com',
        enrolledAt: '2024-08-18T00:00:00Z'
      },
      {
        _id: 's9',
        name: 'Ethan Walker',
        email: 'ethan.walker@example.com',
        enrolledAt: '2024-08-19T00:00:00Z'
      }
    ]
  },
  '5': {
    id: '5',
    code: 'BIO101',
    title: 'Introduction to Biology',
    description: 'An overview of biological concepts including cell biology, genetics, and evolution.',
    overview:
      'Survey the structure and function of living organisms, from molecular processes to ecosystems.',
    duration: '12 weeks',
    level: 'Beginner',
    instructor: 'Dr. Lisa Wong',
    credits: 3,
    students: 113,
    prerequisites: 'High school biology recommended but not required.',
    learningObjectives: [
      'Describe cellular structures and their roles in metabolism and reproduction.',
      'Explain the principles of Mendelian genetics and molecular inheritance.',
      'Discuss evolutionary mechanisms and ecological relationships.'
    ],
    syllabus: [
      {
        week: 'Week 1',
        topic: 'Cell Structure and Function',
        details: 'Eukaryotic and prokaryotic cells, organelles, and membranes.'
      },
      {
        week: 'Week 4',
        topic: 'Genetics and DNA',
        details: 'DNA replication, transcription, translation, and gene expression.'
      },
      {
        week: 'Week 7',
        topic: 'Evolutionary Biology',
        details: 'Natural selection, speciation, and phylogenetics.'
      },
      {
        week: 'Week 10',
        topic: 'Ecology and Ecosystems',
        details: 'Population dynamics, food webs, and conservation biology.'
      }
    ],
    resources: [
      'Campbell Biology, 12th Edition',
      'HHMI BioInteractive animations',
      'Crash Course Biology video series'
    ],
    assignments: [
      {
        _id: 'bio101-a1',
        title: 'Cellular Processes Worksheet',
        description: 'Analyze cell respiration and photosynthesis pathways.',
        dueDate: '2025-01-27T00:00:00Z',
        points: 45,
        status: 'Active'
      },
      {
        _id: 'bio101-a2',
        title: 'Ecology Field Report',
        description: 'Document biodiversity observations from a local habitat.',
        dueDate: '2025-02-20T00:00:00Z',
        points: 75,
        status: 'Upcoming'
      }
    ],
    enrolledStudents: [
      {
        _id: 's10',
        name: 'Sofia Rossi',
        email: 'sofia.rossi@example.com',
        enrolledAt: '2024-09-02T00:00:00Z'
      },
      {
        _id: 's11',
        name: 'Liam O’Connor',
        email: 'liam.oconnor@example.com',
        enrolledAt: '2024-09-03T00:00:00Z'
      }
    ]
  },
  '6': {
    id: '6',
    code: 'CHEM201',
    title: 'Organic Chemistry',
    description: 'Study the structure, properties, and reactions of organic compounds.',
    overview:
      'Investigate molecular structure, stereochemistry, and reaction mechanisms that underpin organic synthesis.',
    duration: '16 weeks',
    level: 'Intermediate',
    instructor: 'Dr. James Wilson',
    credits: 4,
    students: 78,
    prerequisites: 'General Chemistry I with laboratory experience.',
    learningObjectives: [
      'Predict reactivity based on molecular structure and functional groups.',
      'Draw detailed reaction mechanisms with proper electron-pushing notation.',
      'Apply spectroscopic techniques to identify organic molecules.'
    ],
    syllabus: [
      {
        week: 'Week 1',
        topic: 'Structure and Bonding',
        details: 'Hybridization, resonance, and molecular geometry.'
      },
      {
        week: 'Week 5',
        topic: 'Stereochemistry',
        details: 'Chirality, optical activity, and conformational analysis.'
      },
      {
        week: 'Week 9',
        topic: 'Reaction Mechanisms',
        details: 'SN1/SN2, E1/E2 pathways, and carbocation stability.'
      },
      {
        week: 'Week 13',
        topic: 'Spectroscopic Identification',
        details: 'IR, NMR, and mass spectrometry interpretation.'
      }
    ],
    resources: [
      'Organic Chemistry by Clayden, Greeves, and Warren',
      'Khan Academy Organic Chemistry playlist',
      'Master Organic Chemistry reaction guides'
    ],
    assignments: [
      {
        _id: 'chem201-a1',
        title: 'Reaction Mechanism Exercises',
        description: 'Illustrate multi-step reaction pathways with curved arrows.',
        dueDate: '2025-02-05T00:00:00Z',
        points: 55,
        status: 'Active'
      },
      {
        _id: 'chem201-a2',
        title: 'Spectroscopy Problem Set',
        description: 'Determine structures from NMR and IR spectra.',
        dueDate: '2025-02-26T00:00:00Z',
        points: 65,
        status: 'Upcoming'
      }
    ],
    enrolledStudents: [
      {
        _id: 's12',
        name: 'Amelia Becker',
        email: 'amelia.becker@example.com',
        enrolledAt: '2024-08-27T00:00:00Z'
      },
      {
        _id: 's13',
        name: 'Marcus Green',
        email: 'marcus.green@example.com',
        enrolledAt: '2024-08-28T00:00:00Z'
      }
    ]
  }
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const { currentUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      const fallback = mockCourseDetails[courseId];
      try {
        setLoading(true);

        if (fallback?.enrolledStudents) {
          setEnrolledStudents(fallback.enrolledStudents);
        }

        const courseResponse = await coursesAPI.getCourseById(courseId);
        const apiCourse = courseResponse.data?.data;

        if (apiCourse && fallback) {
          setCourse({ ...fallback, ...apiCourse });
        } else if (apiCourse) {
          setCourse(apiCourse);
        } else if (fallback) {
          setCourse(fallback);
        }

        const assignmentsResponse = await assignmentsAPI.getAssignments(courseId);
        const apiAssignments = assignmentsResponse.data?.data || [];
        if (apiAssignments.length > 0) {
          setAssignments(apiAssignments);
        } else {
          setAssignments(fallback?.assignments || []);
        }

        if (currentUser?.role === 'teacher') {
          try {
            const studentsResponse = await coursesAPI.getEnrolledStudents(courseId);
            const apiStudents = studentsResponse.data?.data || [];
            if (apiStudents.length > 0) {
              setEnrolledStudents(apiStudents);
            } else if (fallback?.enrolledStudents) {
              setEnrolledStudents(fallback.enrolledStudents);
            }
          } catch (error) {
            console.log('Error fetching enrolled students:', error);
            if (fallback?.enrolledStudents) {
              setEnrolledStudents(fallback.enrolledStudents);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        if (fallback) {
          setCourse(fallback);
          setAssignments(fallback.assignments || []);
          setEnrolledStudents(fallback.enrolledStudents || []);
        }
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId, currentUser]);

  const handleAssignmentCreated = (newAssignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    setShowAssignmentForm(false);
  };

  const handleSubmissionComplete = (submission) => {
    // Update assignment status or refresh data
    console.log('Assignment submitted:', submission);
    setSelectedAssignment(null);
  };

  const isTeacher = currentUser?.role === 'teacher';

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Course not found</h2>
        <p className="mt-2 text-gray-600">The course you're looking for doesn't exist.</p>
        <Link to="/courses" className="mt-4 inline-flex items-center text-primary-600 hover:text-primary-700">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-2 text-gray-600">{course.description}</p>
          {course.duration && (
            <p className="mt-1 text-sm text-gray-500">Duration: {course.duration}</p>
          )}
        </div>
        <Link to="/courses" className="text-primary-600 hover:text-primary-700">
          ← Back to Courses
        </Link>
      </div>

      {/* Tabs for different views */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assignments'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Assignments ({assignments.length})
          </button>
          {isTeacher && (
            <>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students ({enrolledStudents.length})
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                View Submissions
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Assignment Creation Modal */}
      {showAssignmentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <AssignmentForm
              courseId={courseId}
              onAssignmentCreated={handleAssignmentCreated}
              onClose={() => setShowAssignmentForm(false)}
            />
          </div>
        </div>
      )}

      {/* Assignment Submission Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <AssignmentSubmissionForm
              assignment={selectedAssignment}
              onSubmissionComplete={handleSubmissionComplete}
              onClose={() => setSelectedAssignment(null)}
            />
          </div>
        </div>
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Course Summary</h4>
              <p className="text-gray-600">{course.overview || course.description}</p>
              {course.prerequisites && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Prerequisites</span>
                  <p className="mt-1 text-gray-600 text-sm">{course.prerequisites}</p>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Quick Facts</h4>
              <div className="text-gray-600 text-sm space-y-1">
                {course.code && <p>Course Code: {course.code}</p>}
                {course.instructor && <p>Instructor: {course.instructor}</p>}
                {course.duration && <p>Duration: {course.duration}</p>}
                {course.level && <p>Level: {course.level}</p>}
                {course.credits && <p>Credits: {course.credits}</p>}
                <p>{enrolledStudents.length || course.students || 0} students enrolled</p>
                <p>{assignments.length} assignments available</p>
              </div>
            </div>
          </div>
          {course.learningObjectives?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Learning Outcomes</h4>
              <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
                {course.learningObjectives.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {course.syllabus?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Syllabus Outline</h4>
              <div className="mt-3 space-y-3">
                {course.syllabus.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-sm font-medium text-primary-600">{item.week}</span>
                    <div>
                      <p className="text-gray-900 font-medium">{item.topic}</p>
                      {item.details && <p className="text-gray-600 text-sm mt-1">{item.details}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {course.resources?.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Recommended Resources</h4>
              <ul className="mt-2 list-disc list-inside text-gray-600 space-y-1">
                {course.resources.map((resource, index) => (
                  <li key={index}>{resource}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
            {isTeacher && (
              <button
                onClick={() => setShowAssignmentForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Create Assignment
              </button>
            )}
          </div>

          {assignments.length > 0 ? (
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <div key={assignment._id} className="bg-white shadow rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                      <p className="mt-1 text-gray-600">{assignment.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                        <span>Points: {assignment.points}</span>
                        <span>Status: {assignment.status || 'Active'}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        View Details
                      </button>
                      {!isTeacher && (
                        <button
                          onClick={() => setSelectedAssignment(assignment)}
                          className="px-3 py-1 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments</h3>
              <p className="mt-1 text-sm text-gray-500">
                {isTeacher ? 'Create your first assignment for this course.' : 'No assignments have been posted yet.'}
              </p>
              {isTeacher && (
                <div className="mt-6">
                  <button
                    onClick={() => setShowAssignmentForm(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Create Assignment
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'students' && isTeacher && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Enrolled Students ({enrolledStudents.length})
            </h3>
            {enrolledStudents.length > 0 ? (
              <div className="space-y-3">
                {enrolledStudents.map((student) => (
                  <div key={student._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No students have enrolled in this course yet.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'submissions' && isTeacher && (
        <div className="text-center py-8">
          <Link
            to={`/courses/${courseId}/submissions`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View All Submissions
          </Link>
        </div>
      )}
    </div>
  );
}
