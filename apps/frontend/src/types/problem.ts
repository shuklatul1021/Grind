export interface StarterCode {
  language: string;
  code: string;
} 

export interface Problem {
  id: string;
  title: string;
  slug?: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  examples: Example[];
  constraints?: string;
  starterCode: StarterCode[];
  testcase: TestCase[];
  acceptanceRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  problem_id: string;
  status: 'solved' | 'attempted' | 'not_started';
  last_attempted: string;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  problem_id: string;
  code: string;
  language: string;
  status: 'accepted' | 'wrong_answer' | 'runtime_error' | 'time_limit_exceeded' | 'memory_limit_exceeded';
  runtime: number;
  memory: number;
  created_at: string;
}
