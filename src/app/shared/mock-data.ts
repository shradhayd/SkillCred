import { Conversation, Report, Review, Session, SkillCategory, Teacher, Transaction, User } from './models';

export const SKILL_CATEGORIES: SkillCategory[] = [
  { id: 'coding', name: 'Coding', icon: '💻', colorClass: 'icon-box-teal' },
  { id: 'music', name: 'Music', icon: '🎵', colorClass: 'icon-box-purple' },
  { id: 'cooking', name: 'Cooking', icon: '🍳', colorClass: 'icon-box-coral' },
  { id: 'design', name: 'Design', icon: '🎨', colorClass: 'icon-box-pink' },
  { id: 'languages', name: 'Languages', icon: '🌍', colorClass: 'icon-box-blue' },
];

export const TEACHERS: Teacher[] = [
  {
    id: '1', name: 'Alex Chen', photo: 'https://i.pravatar.cc/150?u=alex',
    skill: 'Python Programming', category: 'coding', rating: 4.9, creditsRequired: 15,
    experienceLevel: 'Advanced', isOnline: true,
    bio: 'Full-stack developer with 8 years of experience teaching Python and web development.',
    skillsTeach: ['Python', 'Django', 'Data Structures'],
    skillsLearn: ['Music Production', 'Spanish'],
  },
  {
    id: '2', name: 'Maria Garcia', photo: 'https://i.pravatar.cc/150?u=maria',
    skill: 'Guitar Lessons', category: 'music', rating: 4.8, creditsRequired: 12,
    experienceLevel: 'Intermediate', isOnline: true,
    bio: 'Professional guitarist offering acoustic and electric guitar lessons for all levels.',
    skillsTeach: ['Guitar', 'Music Theory', 'Songwriting'],
    skillsLearn: ['Web Design', 'Photography'],
  },
  {
    id: '3', name: 'James Wilson', photo: 'https://i.pravatar.cc/150?u=james',
    skill: 'Italian Cooking', category: 'cooking', rating: 4.7, creditsRequired: 10,
    experienceLevel: 'Advanced', isOnline: false,
    bio: 'Chef specializing in authentic Italian cuisine and Mediterranean cooking techniques.',
    skillsTeach: ['Italian Cooking', 'Pastry', 'Meal Prep'],
    skillsLearn: ['JavaScript', 'French'],
  },
  {
    id: '4', name: 'Sophie Turner', photo: 'https://i.pravatar.cc/150?u=sophie',
    skill: 'UI/UX Design', category: 'design', rating: 4.9, creditsRequired: 18,
    experienceLevel: 'Advanced', isOnline: true,
    bio: 'Senior product designer with expertise in Figma, user research, and design systems.',
    skillsTeach: ['UI Design', 'UX Research', 'Figma'],
    skillsLearn: ['Piano', 'Japanese'],
  },
  {
    id: '5', name: 'Kenji Tanaka', photo: 'https://i.pravatar.cc/150?u=kenji',
    skill: 'Japanese Language', category: 'languages', rating: 4.8, creditsRequired: 14,
    experienceLevel: 'Advanced', isOnline: true,
    bio: 'Native Japanese speaker offering conversational and business Japanese lessons.',
    skillsTeach: ['Japanese', 'Kanji', 'Business Japanese'],
    skillsLearn: ['React', 'Photography'],
  },
  {
    id: '6', name: 'Emma Davis', photo: 'https://i.pravatar.cc/150?u=emma',
    skill: 'React Development', category: 'coding', rating: 4.6, creditsRequired: 16,
    experienceLevel: 'Intermediate', isOnline: true,
    bio: 'Frontend developer passionate about React, TypeScript, and modern web apps.',
    skillsTeach: ['React', 'TypeScript', 'CSS'],
    skillsLearn: ['Cooking', 'Yoga'],
  },
  {
    id: '7', name: 'Carlos Ruiz', photo: 'https://i.pravatar.cc/150?u=carlos',
    skill: 'Spanish Conversation', category: 'languages', rating: 4.7, creditsRequired: 11,
    experienceLevel: 'Beginner', isOnline: false,
    bio: 'Friendly Spanish tutor focused on conversational fluency and cultural immersion.',
    skillsTeach: ['Spanish', 'Latin Culture'],
    skillsLearn: ['Python', 'Guitar'],
  },
  {
    id: '8', name: 'Lily Park', photo: 'https://i.pravatar.cc/150?u=lily',
    skill: 'Watercolor Painting', category: 'design', rating: 4.5, creditsRequired: 9,
    experienceLevel: 'Beginner', isOnline: true,
    bio: 'Artist and illustrator teaching watercolor techniques and creative expression.',
    skillsTeach: ['Watercolor', 'Sketching', 'Color Theory'],
    skillsLearn: ['Web Development', 'French Cooking'],
  },
];

export const CURRENT_USER: User = {
  id: 'current',
  name: 'Shradha',
  email: 'shradha@gmail.com',
  bio: 'Passionate learner and teacher. I love exchanging skills and meeting new people on SkillCred!',
  photo: 'https://i.pravatar.cc/150?u=shradha',
  rating: 4.8,
  credits: 120,
  isAdmin: true,
  skillsTeach: ['Angular', 'TypeScript', 'Web Development'],
  skillsLearn: ['Piano', 'Photography', 'French'],
};

export const TRANSACTIONS: Transaction[] = [
  { id: 't1', type: 'earned', skill: 'Angular Basics', date: '2026-08-01', timeSlot: '10:00 AM', withWhom: 'Rahul K.', credits: 15, status: 'completed' },
  { id: 't2', type: 'spent', skill: 'Guitar Lesson', date: '2026-07-28', timeSlot: '3:00 PM', withWhom: 'Maria Garcia', credits: 12, status: 'completed' },
  { id: 't3', type: 'earned', skill: 'TypeScript Advanced', date: '2026-07-25', timeSlot: '11:00 AM', withWhom: 'Priya S.', credits: 18, status: 'completed' },
  { id: 't4', type: 'spent', skill: 'UI Design Review', date: '2026-07-20', timeSlot: '2:00 PM', withWhom: 'Sophie Turner', credits: 18, status: 'completed' },
  { id: 't5', type: 'earned', skill: 'Web Development', date: '2026-07-15', timeSlot: '9:00 AM', withWhom: 'Amit P.', credits: 20, status: 'completed' },
  { id: 't6', type: 'spent', skill: 'Japanese Intro', date: '2026-07-10', timeSlot: '4:00 PM', withWhom: 'Kenji Tanaka', credits: 14, status: 'pending' },
];

export const SESSIONS: Session[] = [
  { id: 's1', skill: 'Angular Basics', date: '2026-08-12', timeSlot: '10:00 AM', withWhom: 'Rahul K.', withWhomId: 'u1', status: 'upcoming', credits: 15, role: 'teacher' },
  { id: 's2', skill: 'Guitar Lesson', date: '2026-08-15', timeSlot: '3:00 PM', withWhom: 'Maria Garcia', withWhomId: '2', status: 'upcoming', credits: 12, role: 'student' },
  { id: 's3', skill: 'TypeScript Advanced', date: '2026-07-25', timeSlot: '11:00 AM', withWhom: 'Priya S.', withWhomId: 'u2', status: 'completed', credits: 18, role: 'teacher' },
  { id: 's4', skill: 'UI Design Review', date: '2026-07-20', timeSlot: '2:00 PM', withWhom: 'Sophie Turner', withWhomId: '4', status: 'completed', credits: 18, role: 'student' },
  { id: 's5', skill: 'Python Intro', date: '2026-07-05', timeSlot: '9:00 AM', withWhom: 'Alex Chen', withWhomId: '1', status: 'cancelled', credits: 15, role: 'student' },
];

export const REVIEWS: Review[] = [
  { id: 'r1', reviewerName: 'Rahul K.', rating: 5, comment: 'Excellent teacher! Very patient and explains concepts clearly.', date: '2026-07-26' },
  { id: 'r2', reviewerName: 'Priya S.', rating: 5, comment: 'Great session on TypeScript. Learned a lot about advanced types.', date: '2026-07-20' },
  { id: 'r3', reviewerName: 'Amit P.', rating: 4, comment: 'Good web dev session. Would recommend for beginners.', date: '2026-07-10' },
];

export const REPORTS: Report[] = [
  { id: 'rp1', reporter: 'User123', reportedUser: 'BadActor1', reason: 'No-show for scheduled session', status: 'open', date: '2026-08-05' },
  { id: 'rp2', reporter: 'Learner99', reportedUser: 'SpamUser', reason: 'Inappropriate messages in chat', status: 'open', date: '2026-08-03' },
  { id: 'rp3', reporter: 'TeacherPro', reportedUser: 'FakeProfile', reason: 'Suspected fake profile', status: 'resolved', date: '2026-07-28' },
  { id: 'rp4', reporter: 'NewUser', reportedUser: 'RudeUser', reason: 'Harassment during session', status: 'dismissed', date: '2026-07-20' },
];

export const CONVERSATIONS: Conversation[] = [
  { id: 'c1', name: 'Maria Garcia', photo: 'https://i.pravatar.cc/150?u=maria', lastMessage: 'See you at 3 PM for guitar!', lastMessageTime: '2:30 PM', unread: 2 },
  { id: 'c2', name: 'Alex Chen', photo: 'https://i.pravatar.cc/150?u=alex', lastMessage: 'Thanks for the Python tips!', lastMessageTime: 'Yesterday', unread: 0 },
  { id: 'c3', name: 'Sophie Turner', photo: 'https://i.pravatar.cc/150?u=sophie', lastMessage: 'I sent the design files.', lastMessageTime: 'Mon', unread: 1 },
  { id: 'c4', name: 'Rahul K.', photo: 'https://i.pravatar.cc/150?u=rahul', lastMessage: 'Can we reschedule to Friday?', lastMessageTime: 'Sun', unread: 0 },
];

export const CHAT_MESSAGES: Record<string, { id: string; text: string; timestamp: string; isMine: boolean }[]> = {
  c1: [
    { id: 'm1', text: 'Hi Maria! Looking forward to our guitar session.', timestamp: '2:00 PM', isMine: true },
    { id: 'm2', text: 'Me too! Make sure to bring your guitar picks.', timestamp: '2:15 PM', isMine: false },
    { id: 'm3', text: 'See you at 3 PM for guitar!', timestamp: '2:30 PM', isMine: false },
  ],
  c2: [
    { id: 'm4', text: 'Hey Alex, quick question about list comprehensions.', timestamp: '10:00 AM', isMine: true },
    { id: 'm5', text: 'Sure! Here is a quick example...', timestamp: '10:05 AM', isMine: false },
    { id: 'm6', text: 'Thanks for the Python tips!', timestamp: '10:30 AM', isMine: true },
  ],
};

export const WALLET_CHART_DATA = [
  { month: 'Mar', earned: 45, spent: 30 },
  { month: 'Apr', earned: 60, spent: 25 },
  { month: 'May', earned: 35, spent: 40 },
  { month: 'Jun', earned: 55, spent: 35 },
  { month: 'Jul', earned: 70, spent: 50 },
  { month: 'Aug', earned: 40, spent: 20 },
];

export const ADMIN_STATS = {
  totalUsers: 1247,
  activeSessions: 89,
  totalCredits: 45680,
  reportedIssues: 12,
};

export const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export const NOTIFICATIONS = [
  { id: 'n1', title: 'Session Reminder', message: 'Guitar lesson with Maria at 3 PM today', time: '1 hour ago', read: false },
  { id: 'n2', title: 'New Review', message: 'Rahul left you a 5-star review!', time: '3 hours ago', read: false },
  { id: 'n3', title: 'Credits Received', message: 'You earned 15 credits from Angular session', time: '1 day ago', read: true },
];
