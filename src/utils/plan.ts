import { featureKinds } from '../data/featureKinds';
import type { Category, FeatureKind, PlanFeature } from '../types/plan';
import type { TranslationKey } from '../locales/translations';

export const fallbackCategory: Category = {
  id: 'uncategorized',
  name: 'Uncategorized',
  color: '#868E96',
  icon: 'pin'
};

export function pickCategory(categories: Category[], kind: FeatureKind): Category {
  return categories.find((c) => c.kindHint === kind) ?? categories[0] ?? fallbackCategory;
}

export function nextFeatureName(features: PlanFeature[], kind: FeatureKind, t?: (key: TranslationKey) => string): string {
  const count = features.filter((f) => f.kind === kind).length + 1;
  if (t) {
    const key: TranslationKey = kind === 'area' ? 'toolArea' : kind === 'line' ? 'toolLine' : 'toolPoint';
    return `${t(key)} ${count}`;
  }
  return `${featureKinds[kind].label} ${count}`;
}

export function countByKind(features: PlanFeature[]): Record<FeatureKind, number> {
  return features.reduce<Record<FeatureKind, number>>(
    (acc, f) => {
      acc[f.kind] += 1;
      return acc;
    },
    { area: 0, line: 0, point: 0 }
  );
}

export function summarizeKinds(features: PlanFeature[], t?: (key: TranslationKey) => string): string {
  const counts = countByKind(features);
  const kinds: FeatureKind[] = ['area', 'line', 'point'];

  if (t) {
    const parts = kinds
      .filter((k) => counts[k] > 0)
      .map((k) => {
        const count = counts[k];
        let label = '';
        if (k === 'area') {
          label = count === 1 ? t('kindAreaSingle') : t('kindAreaPlural');
        } else if (k === 'line') {
          label = count === 1 ? t('kindLineSingle') : t('kindLinePlural');
        } else {
          label = count === 1 ? t('kindPointSingle') : t('kindPointPlural');
        }
        return `${count} ${label}`;
      });
    return parts.length ? parts.join(' · ') : t('noElementsYet');
  }

  const parts = kinds
    .filter((k) => counts[k] > 0)
    .map((k) => `${counts[k]} ${counts[k] === 1 ? featureKinds[k].label.toLowerCase() : featureKinds[k].plural}`);
  return parts.length ? parts.join(' · ') : 'No elements yet';
}

export const UNLIMITED_TIER_EMAIL = 'dmarinobata@gmail.com';

export function isUnlimitedUser(user: { email?: string; role?: string; isAdmin?: boolean; tier?: string } | null | undefined): boolean {
  if (!user) return false;
  const email = (user.email || '').toLowerCase().trim();
  if (email === UNLIMITED_TIER_EMAIL) return true;
  if (user.isAdmin || user.role === 'admin') return true;
  return false;
}

export function getUserTier(user: { email?: string; role?: string; isAdmin?: boolean; tier?: 'free' | 'pro' | 'business' } | null | undefined): 'free' | 'pro' | 'business' {
  if (!user) return 'free';
  if (isUnlimitedUser(user)) return 'business';
  return user.tier || 'free';
}

export function getMaxCloudProjects(user: { email?: string; role?: string; isAdmin?: boolean; tier?: 'free' | 'pro' | 'business' } | null | undefined): number {
  if (!user) return 0;
  if (isUnlimitedUser(user)) return Infinity;
  const tier = getUserTier(user);
  if (tier === 'business') return 20;
  if (tier === 'pro') return 5;
  return 1;
}

export function canSharePlan(_user?: { email?: string; role?: string; isAdmin?: boolean; tier?: string } | null | undefined): boolean {
  // Public interactive link sharing is enabled for all users (Free, Pro, Business)
  return true;
}

export function canEmbedPlan(user: { email?: string; role?: string; isAdmin?: boolean; tier?: 'free' | 'pro' | 'business' } | null | undefined): boolean {
  if (!user) return false;
  if (isUnlimitedUser(user)) return true;
  const tier = getUserTier(user);
  return tier === 'pro' || tier === 'business';
}

export function canExportGeoJSON(user: { email?: string; role?: string; isAdmin?: boolean; tier?: 'free' | 'pro' | 'business' } | null | undefined): boolean {
  if (!user) return false;
  if (isUnlimitedUser(user)) return true;
  const tier = getUserTier(user);
  return tier === 'pro' || tier === 'business';
}

export function canManageCollaborators(user: { email?: string; role?: string; isAdmin?: boolean; tier?: 'free' | 'pro' | 'business' } | null | undefined): boolean {
  if (!user) return false;
  if (isUnlimitedUser(user)) return true;
  const tier = getUserTier(user);
  return tier === 'business';
}

export function canDeleteProject(
  project: { id: string; userId?: string; authorEmail?: string; isLocalOnly?: boolean; collaborators?: string[] },
  user: { id?: string; email?: string; role?: string; isAdmin?: boolean } | null
): boolean {
  // If this is a guest draft stored only on this browser, guest can discard it
  if (project.isLocalOnly) return true;

  // For any cloud or shared project, a user must be logged in
  if (!user) return false;

  // Admin can delete any project
  if (user.isAdmin || user.role === 'admin') return true;
  const email = (user.email || '').toLowerCase().trim();
  if (
    email === UNLIMITED_TIER_EMAIL ||
    email.startsWith('danilo') ||
    email.includes('danilo') ||
    email === 'admin@mapflex.app'
  ) {
    return true;
  }

  // Author of the project can delete their own project (collaborators cannot delete)
  if (project.userId && project.userId === user.id) return true;
  if (project.authorEmail && project.authorEmail.toLowerCase().trim() === email) return true;

  return false;
}

export function canEditProject(
  project: { id: string; userId?: string; authorEmail?: string; isLocalOnly?: boolean; collaborators?: string[] },
  user: { id?: string; email?: string; role?: string; isAdmin?: boolean } | null | undefined
): boolean {
  // If this is a draft newly created by a guest in this browser, they can work on it
  if (project.isLocalOnly) return true;

  // Unauthenticated users cannot edit existing cloud maps (only visitor mode)
  if (!user) return false;

  // Admin or unlimited tier user can edit
  if (user.isAdmin || user.role === 'admin' || isUnlimitedUser(user)) return true;

  const email = (user.email || '').toLowerCase().trim();
  // Author can edit
  if (project.userId && project.userId === user.id) return true;
  if (project.authorEmail && project.authorEmail.toLowerCase().trim() === email) return true;

  // Authorized team collaborator can edit
  if (project.collaborators && project.collaborators.some((c) => c.toLowerCase().trim() === email)) {
    return true;
  }

  // Legacy/demo project with no author: allow logged in user to work on it
  if (!project.userId && !project.authorEmail) return true;

  return false;
}