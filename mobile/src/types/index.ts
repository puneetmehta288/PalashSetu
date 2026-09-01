export type GradeLevel = 'Balvatika' | 'Class 1' | 'Class 2' | 'Class 3';

export interface Flashcard {
  id: string;
  front_hin: string;
  front_sat: string;
  phonetic: string;
  category: string;
  visual?: string;
  audioText?: string;
}

export interface Question {
  id: string;
  type: string;
  prompt_hin: string;
  prompt_sat: string;
  options_hin?: string[];
  options_sat?: string[];
  correctAnswer: string;
  explanation_hin?: string;
  explanation_sat?: string;
  visual?: string;
}

export interface Worksheet {
  id: string;
  title_hin: string;
  title_sat: string;
  grade: GradeLevel;
  subject: string;
  topic: string;
  questions: Question[];
}

export interface LessonSection {
  step: number;
  step_name: string;
  step_sat: string;
  icon: string;
  duration: string;
  hin: string;
  sat: string;
}

export interface AssessmentPrompt {
  question_hin: string;
  question_sat: string;
  answer_hin: string;
  answer_sat: string;
}

export interface Lesson {
  id: string;
  title_hin: string;
  title_sat: string;
  grade: string;
  subject: string;
  topic: string;
  nipun_target: string;
  sections: LessonSection[];
  assessment_prompts: AssessmentPrompt[];
  materials: string[];
}
