export interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  photo: string;
  rating: number;
  credits: number;
  isAdmin?: boolean;
  skillsTeach: string[];
  skillsLearn: string[];
  // Fields stored by the backend in users/{uid}
  ratingCount?: number;
  isTeacher?: boolean;
  skill?: string;
  category?: string;
  creditsRequired?: number;
  experienceLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  isOnline?: boolean;
  settings?: {
    emailNotifications: boolean;
    sessionReminders: boolean;
    marketingEmails: boolean;
  };
}

export interface Teacher {
  id: string;
  name: string;
  photo: string;
  skill: string;
  category: string;
  rating: number;
  creditsRequired: number;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  isOnline: boolean;
  bio: string;
  skillsTeach: string[];
  skillsLearn: string[];
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  colorClass: string;
}

export interface Transaction {
  id: string;
  type: 'earned' | 'spent';
  skill: string;
  date: string;
  timeSlot: string;
  withWhom: string;
  credits: number;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface Session {
  id: string;
  skill: string;
  date: string;
  timeSlot: string;
  withWhom: string;
  withWhomId: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  credits: number;
  role: 'teacher' | 'student';
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Report {
  id: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  status: 'open' | 'resolved' | 'dismissed';
  date: string;
}

export interface Conversation {
  id: string;
  name: string;
  photo: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
