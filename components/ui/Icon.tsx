import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  Compass,
  GraduationCap,
  Handshake,
  Heart,
  Lightbulb,
  MessageCircle,
  Rocket,
  Sparkles,
  Sprout,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import {cn} from '@/lib/utils/cn';
import type {IconName} from '@/types/common';

const ICONS: Record<IconName, LucideIcon> = {
  award: Award,
  bookOpen: BookOpen,
  briefcase: Briefcase,
  calendar: Calendar,
  compass: Compass,
  graduationCap: GraduationCap,
  handshake: Handshake,
  heart: Heart,
  lightbulb: Lightbulb,
  messageCircle: MessageCircle,
  rocket: Rocket,
  sparkles: Sparkles,
  sprout: Sprout,
  target: Target,
  trendingUp: TrendingUp,
  users: Users,
};

export function Icon({name, className}: {name: IconName; className?: string}) {
  const Component = ICONS[name];
  return <Component aria-hidden="true" focusable="false" className={cn('size-6', className)} />;
}
