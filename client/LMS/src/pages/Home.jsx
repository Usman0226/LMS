import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import CourseCard from '../components/CourseCard';
import { coursesAPI } from '../services/api';

// Mock data for featured courses (will be replaced with API call)
const featuredCourses = [
  {
    id: 1,
    code: 'CS101',
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science and programming with Python.',
    instructor: 'Dr. Sarah Johnson',
    credits: 4,
    status: 'Enroll Now'
  },
  {
    id: 2,
    code: 'MATH201',
    title: 'Linear Algebra',
    description: 'Study vectors, matrices, and linear transformations with real-world applications.',
    instructor: 'Prof. Michael Chen',
    credits: 3,
    status: 'Enroll Now'
  },
  {
    id: 3,
    code: 'ENG150',
    title: 'Academic Writing',
    description: 'Develop your academic writing skills for university-level coursework.',
    instructor: 'Dr. Emily Wilson',
    credits: 3,
    status: 'Enroll Now'
  },
];

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we would fetch this from the API
    // For now, we'll use the mock data
    const fetchCourses = async () => {
      try {
        // Uncomment when API is ready
        // const response = await coursesAPI.getAllCourses();
        // setCourses(response.data);
        setCourses(featuredCourses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to EduLMS</h1>
            <p className="text-xl mb-8">Your gateway to online learning. Access courses anytime, anywhere, and advance your career.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-8 transition duration-150 ease-in-out"
              >
                Get Started
              </Link>
              <Link
                to="/courses"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-700 bg-opacity-60 hover:bg-opacity-80 md:py-4 md:text-lg md:px-8 transition duration-150 ease-in-out"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Learn without limits
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Start, switch, or advance your career with more than 5,000 courses, Professional Certificates, and degrees from world-class universities and companies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '📚',
                title: '100+ Online Courses',
                description: 'Choose from a variety of courses across different fields and levels.'
              },
              {
                icon: '🎓',
                title: 'Expert Instructors',
                description: 'Learn from industry experts with real-world experience.'
              },
              {
                icon: '📱',
                title: 'Learn Anywhere',
                description: 'Access your courses on any device, anytime, anywhere.'
              }
            ].map((feature, index) => (
              <div key={index} className="p-6 bg-gray-50 rounded-lg">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Courses</h2>
            <Link to="/courses" className="text-primary-600 hover:text-primary-800 font-medium">
              View all courses →
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already learning with us. Start your learning journey today.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-100 md:py-4 md:text-lg md:px-8 transition duration-150 ease-in-out"
          >
            Sign Up for Free
          </Link>
        </div>
      </div>
    </div>
  );
}
