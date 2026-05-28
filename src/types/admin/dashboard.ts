export interface IMonthlyRevenue {
  amount: number;
  currency: string;
  month: string;
}

export interface ITodaySessions {
  conducted: number;
  date: string;
  notConducted: number;
  postponed: number;
  postponedDetails: string | null;
  total: number;
}

export interface ITopTutor {
  rank: number;
  id: string;
  name: string;
  role: string;
  growthPoints: number;
  performanceScore: number;
  profileImage: string;
}

export interface IDashboardPayload {
  activeStudents: number;
  monthlyRevenue: IMonthlyRevenue;
  pendingTutors: number;
  todaySessions: ITodaySessions;
  top5Tutors: ITopTutor[];
  totalStudents: number;
  totalTutors: number;
}
