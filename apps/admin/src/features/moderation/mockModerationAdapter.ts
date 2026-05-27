export type CandidateType = 'place' | 'review' | 'user';

export type CandidateSort = 'newest' | 'score';

export type CandidateFilter = 'all' | CandidateType;

export type CandidateStatus = 'pending' | 'approved' | 'rejected';

export interface PlacePayload {
  name: string;
  address: string;
  phone?: string;
  description?: string;
  amenities: {
    wifi?: boolean;
    cash?: boolean;
    delivery?: boolean;
    restroom?: boolean;
    outdoor?: boolean;
  };
  images: {
    menu: string[];
    space: string[];
    dishes: string[];
  };
  posterReview?: {
    rating: number;
    text: string;
  };
}

export interface ReviewPayload {
  images: string[];
  rating: number;
  feedback: string;
}

export interface ModerationCandidate {
  id: string;
  title: string;
  summary: string;
  type: CandidateType;
  source: string;
  score: number;
  createdAt: string;
  reason: string;
  submittedBy: { username: string };
  status: CandidateStatus;
  payload?: PlacePayload | ReviewPayload;
}

const MOCK_PENDING_CANDIDATES: ModerationCandidate[] = [
  {
    id: 'cand-1001',
    title: 'Rooftop Bar Saigon',
    summary: 'New place submission awaiting review.',
    type: 'place',
    source: 'Community submission',
    score: 97,
    createdAt: '2026-05-27T08:15:00.000Z',
    reason: 'High visibility listing needs manual approval.',
    submittedBy: { username: 'nguyenminh' },
    status: 'pending',
    payload: {
      name: 'Rooftop Bar Saigon',
      address: '123 Nguyen Hue, District 1, HCMC',
      phone: '+84 28 1234 5678',
      description: 'A popular rooftop bar with panoramic city views and live music.',
      amenities: { wifi: true, cash: true, delivery: false, restroom: true, outdoor: true },
      images: {
        menu: ['https://placehold.co/400x300?text=menu1'],
        space: ['https://placehold.co/800x600?text=space1'],
        dishes: ['https://placehold.co/600x400?text=dish1'],
      },
      posterReview: { rating: 5, text: 'Amazing view and great cocktails!' },
    },
  },
  {
    id: 'cand-1002',
    title: 'Spam review on Banh Mi Huynh Hoa',
    summary: 'Review contains promotional language and suspicious links.',
    type: 'review',
    source: 'Auto-flagged',
    score: 84,
    createdAt: '2026-05-27T07:40:00.000Z',
    reason: 'Detected suspicious outbound URLs.',
    submittedBy: { username: 'spammer123' },
    status: 'pending',
    payload: {
      images: ['https://placehold.co/400x300?text=review1'],
      rating: 1,
      feedback: 'Best deals at http://spam.link - visit now!',
    },
  },
  {
    id: 'cand-1003',
    title: 'Foodie_SG profile badge request',
    summary: 'User submitted a badge appeal for gold status.',
    type: 'user',
    source: 'User request',
    score: 71,
    createdAt: '2026-05-26T18:20:00.000Z',
    reason: 'Badge review requires moderator approval.',
    submittedBy: { username: 'foodie_sg' },
    status: 'approved',
  },
  {
    id: 'cand-1004',
    title: 'Hidden cafe in District 3',
    summary: 'Place edit request includes new photos and opening hours.',
    type: 'place',
    source: 'Contributor edit',
    score: 88,
    createdAt: '2026-05-26T16:05:00.000Z',
    reason: 'Critical place metadata was changed.',
    submittedBy: { username: 'jane.doe' },
    status: 'pending',
    payload: {
      name: 'Hidden cafe in District 3',
      address: '45 Vo Van Tan, District 3, HCMC',
      phone: '+84 28 8765 4321',
      description: 'Cozy neighbourhood cafe focusing on specialty coffee and brunch.',
      amenities: { wifi: true, cash: true, delivery: true, restroom: true, outdoor: false },
      images: {
        menu: ['https://placehold.co/400x300?text=menu2'],
        space: ['https://placehold.co/800x600?text=space2'],
        dishes: ['https://placehold.co/600x400?text=dish2'],
      },
      posterReview: { rating: 4, text: 'Great coffee and quiet atmosphere.' },
    },
  },
  {
    id: 'cand-1005',
    title: 'Off-topic review for train station',
    summary: 'Review is unrelated to the place and seems low quality.',
    type: 'review',
    source: 'Trust & safety queue',
    score: 64,
    createdAt: '2026-05-25T22:45:00.000Z',
    reason: 'Likely irrelevant content.',
    submittedBy: { username: 'anon_user' },
    status: 'rejected',
    payload: {
      images: [],
      rating: 2,
      feedback: 'This is about trains, not the cafe.',
    },
  },
  {
    id: 'cand-1006',
    title: 'Traveler account verification',
    summary: 'New user needs manual verification before publishing content.',
    type: 'user',
    source: 'Verification flow',
    score: 92,
    createdAt: '2026-05-25T12:10:00.000Z',
    reason: 'Pending identity confirmation.',
    submittedBy: { username: 'traveler_lee' },
    status: 'pending',
  },
];

const delay = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function loadPendingCandidates(simulateError = false) {
  await delay(250);

  if (simulateError) {
    throw new Error('Unable to load moderation queue.');
  }

  return MOCK_PENDING_CANDIDATES;
}