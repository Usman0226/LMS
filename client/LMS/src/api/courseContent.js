import axios from 'axios';

// Backend URL - change this to your production URL when deploying
const BACKEND_URL = 'http://localhost:3000';

const courseContentAPI = {
  // Course Content Management
  async getCourseContent(courseId) {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/courses/${courseId}/content`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching course content:', error);
      throw error;
    }
  },

  async createModule(courseId, moduleData) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/courses/${courseId}/modules`, moduleData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating module:', error);
      throw error;
    }
  },

  async updateModule(courseId, moduleId, moduleData) {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/courses/${courseId}/modules/${moduleId}`, moduleData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating module:', error);
      throw error;
    }
  },

  async deleteModule(courseId, moduleId) {
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/courses/${courseId}/modules/${moduleId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting module:', error);
      throw error;
    }
  },

  // Lesson Management
  async createLesson(courseId, moduleId, lessonData) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/courses/${courseId}/modules/${moduleId}/lessons`, lessonData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  },

  async updateLesson(courseId, moduleId, lessonId, lessonData) {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, lessonData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  },

  async deleteLesson(courseId, moduleId, lessonId) {
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting lesson:', error);
      throw error;
    }
  },

  // Quiz Management
  async createQuiz(courseId, quizData) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/courses/${courseId}/quizzes`, quizData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  async updateQuiz(courseId, quizId, quizData) {
    try {
      const response = await axios.put(`${BACKEND_URL}/api/courses/${courseId}/quizzes/${quizId}`, quizData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating quiz:', error);
      throw error;
    }
  },

  async deleteQuiz(courseId, quizId) {
    try {
      const response = await axios.delete(`${BACKEND_URL}/api/courses/${courseId}/quizzes/${quizId}`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting quiz:', error);
      throw error;
    }
  },

  // Progress Tracking
  async getUserProgress(courseId) {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/courses/${courseId}/progress`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  },

  async updateLessonProgress(courseId, lessonId, progressData) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/courses/${courseId}/lessons/${lessonId}/progress`, progressData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error updating lesson progress:', error);
      throw error;
    }
  },

  async submitQuiz(courseId, quizId, answers) {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/courses/${courseId}/quizzes/${quizId}/submit`, { answers }, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    }
  },

  async getQuizResult(courseId, quizId) {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/courses/${courseId}/quizzes/${quizId}/result`, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching quiz result:', error);
      throw error;
    }
  }
};

export default courseContentAPI;
