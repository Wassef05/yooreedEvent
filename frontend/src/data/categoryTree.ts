// Hierarchical category tree for Header mega-menu and sidebar filters

export interface SubCategory {
  slug: string;
  label: string;
}

export interface CategoryNode {
  slug: string;
  label: string;
  icon: string;
  description: string;
  color: string; // Tailwind gradient string for card accent
  subCategories: SubCategory[];
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    slug: 'audiovisuel-scenographie',
    label: 'Audiovisuel & Scénographie',
    icon: '🎬',
    description: 'Écrans géants, captation, régie vidéo et éclairage scénique',
    color: 'from-violet-500/20 to-cyber-400/10',
    subCategories: [
      { slug: 'ecrans-geants', label: 'Écrans géants' },
      { slug: 'captation-multi-cam', label: 'Captation multi-cam' },
      { slug: 'regie-video', label: 'Régie vidéo' },
      { slug: 'eclairage-scenique', label: 'Éclairage scénique' },
    ],
  },
  {
    slug: 'impression-branding',
    label: 'Impression & Branding',
    icon: '🖨️',
    description: 'Grand format, signalétique, roll-up et stands modulaires',
    color: 'from-gold-500/20 to-violet-500/10',
    subCategories: [
      { slug: 'grand-format', label: 'Grand format' },
      { slug: 'signaletique', label: 'Signalétique' },
      { slug: 'roll-up-banderoles', label: 'Roll-up & Banderoles' },
      { slug: 'covering-stands', label: 'Covering & Stands' },
    ],
  },
  {
    slug: 'supports-premium',
    label: 'Supports Premium',
    icon: '🏆',
    description: 'Pupitres, trophées et objets sur-mesure',
    color: 'from-gold-400/20 to-cyber-400/10',
    subCategories: [
      { slug: 'pupitres', label: 'Pupitres' },
      { slug: 'trophees', label: 'Trophées' },
      { slug: 'objets-sur-mesure', label: 'Objets sur-mesure' },
    ],
  },
  {
    slug: 'equipes-services',
    label: 'Équipes & Services',
    icon: '👥',
    description: 'Accompagnement événementiel et équipe de production',
    color: 'from-cyber-400/20 to-violet-500/10',
    subCategories: [
      { slug: 'accompagnement-evenementiel', label: 'Accompagnement événementiel' },
      { slug: 'equipe-production', label: 'Équipe de production' },
    ],
  },
];

// Lookup helper
export function getCategoryBySlug(slug: string): CategoryNode | undefined {
  return CATEGORY_TREE.find(c => c.slug === slug);
}

// Get parent category slug from subcategory slug
export function getParentCategoryBySubSlug(subSlug: string): CategoryNode | undefined {
  return CATEGORY_TREE.find(c => c.subCategories.some(s => s.slug === subSlug));
}

// All slugs flat list (for URL matching)
export const ALL_CATEGORY_SLUGS = CATEGORY_TREE.flatMap(c => [
  c.slug,
  ...c.subCategories.map(s => s.slug),
]);
