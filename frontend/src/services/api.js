import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (username, email, password) => {
    const response = await api.post('/auth/signup', { username, email, password });
    return response.data;
  },
  login: async (username_or_email, password) => {
    const response = await api.post('/auth/login', { username_or_email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const parseService = {
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  uploadJd: async (fileOrText) => {
    if (fileOrText instanceof File) {
      const formData = new FormData();
      formData.append('file', fileOrText);
      const response = await api.post('/upload-jd', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } else {
      const response = await api.post('/upload-jd', { text: fileOrText });
      return response.data;
    }
  }
};

export const analysisService = {
  analyze: async (resume_id, jd_text, target_company = 'Target Company') => {
    const response = await api.post('/analyze', { resume_id, jd_text, target_company });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },
  deleteReport: async (report_id) => {
    const response = await api.delete(`/report/${report_id}`);
    return response.data;
  },
  downloadReportPdf: async (report_id) => {
    const response = await api.post('/report', { report_id }, { responseType: 'blob' });
    return response.data;
  }
};

export const rewriteService = {
  rewrite: async (section_name, section_content, missing_skills, jd_text) => {
    const response = await api.post('/resume/optimize', {
      section_name,
      section_content,
      missing_skills,
      jd_text
    });
    return response.data;
  }
};

export const coverLetterService = {
  generateCoverLetter: async (resume_id, jd_text) => {
    const response = await api.post('/cover-letter', { resume_id, jd_text });
    return response.data;
  }
};

export const interviewService = {
  getInterviewQuestions: async (matched_skills, missing_skills, jd_text) => {
    const response = await api.post('/interview/questions', {
      matched_skills,
      missing_skills,
      jd_text
    });
    return response.data;
  },
  evaluateAnswer: async (question, answer, jd_text) => {
    const response = await api.post('/interview/evaluate', {
      question,
      answer,
      jd_text
    });
    return response.data;
  },
  askCoach: async (query, resume_text, jd_text, chat_history = []) => {
    const response = await api.post('/chat', {
      query,
      resume_text,
      jd_text,
      chat_history
    });
    return response.data;
  }
};

export default api;
