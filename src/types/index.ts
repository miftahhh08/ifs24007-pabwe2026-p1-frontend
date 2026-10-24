export type TrafficLight = "hijau" | "kuning" | "merah";

export interface Food {
  id: string;
  name: string;
  portion: string;
  sugar_g: number;
  carbs_g: number;
  category: string;
  aliases: string;
  light: TrafficLight;
}

export interface LogItem {
  id: number;
  name: string;
  servings: number;
  sugar_g: number;
  eaten_at: string;
}

export interface TodayData {
  total_sugar_g: number;
  limit_g: number;
  percent: number;
  logs: LogItem[];
}

export interface AddedLog {
  id: number;
  food: string;
  servings: number;
  sugar_g: number;
}

export interface LabelResult {
  total_sugar_g: number;
  pack_sugar_g: number;
  spoons: number;
  percent_of_limit: number;
  light: TrafficLight;
}

export interface RiskInput {
  age: number;
  sex: "pria" | "wanita";
  heightCm: number;
  weightKg: number;
  waistCm: number;
  active: boolean;
  dailyVegetables: boolean;
  bpMedication: boolean;
  highGlucoseHistory: boolean;
  familyHistory: "tidak" | "kerabat" | "orangtua";
}

export interface RiskResult {
  score: number;
  level: string;
  bmi: number;
  advice: string;
  disclaimer: string;
}

export type GlucoseContext = "puasa" | "sesudah_makan" | "sewaktu";

export interface GlucoseLog {
  id: number;
  value: number;
  context: GlucoseContext;
  category: string;
  measured_at: string;
}

export interface GlucoseAdded extends Omit<GlucoseLog, "measured_at"> {
  note: string;
}

export interface ChatReply {
  reply: string;
  mode: "rules" | "ai" | "safety";
  suggestions?: string[];
}

export interface ChatStatus {
  mode: "rules" | "ai";
  provider: string | null;
  suggestions: string[];
}

export interface IdentifiedFood extends Food {
  servings: number;
  sugar_total_g: number;
}

export interface IdentifyResult {
  foods: IdentifiedFood[];
  unknown: string[];
}

export interface StatsData {
  days: { day: string; sugar_g: number }[];
  streak: number;
  limit_g: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}
