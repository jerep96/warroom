import { NextRequest, NextResponse } from "next/server";

const WIKI_TITLES: Record<string, string> = {
  "russia-ukraine": "Russo-Ukrainian_War",
  "israel-gaza": "2023_Israel%E2%80%93Hamas_war",
  "myanmar-civil-war": "Myanmar_civil_war_(2021%E2%80%93present)",
  "sudan-civil-war": "Sudanese_civil_war_(2023%E2%80%93present)",
  "sahel-insurgency": "War_in_the_Sahel",
  "taiwan-strait": "Cross-strait_relations",
  "kashmir-conflict": "Kashmir_conflict",
  "yemen-civil-war": "Yemeni_civil_war_(2014–present)",
  "us-iran-operation-epic-fury-2026": "Iran–United_States_relations",
  "us-caribbean-drug-war-operation-hawkeye":
    "Joint_Interagency_Task_Force_South",
  "us-somalia-counterterrorism-2025":
    "American_intervention_in_Somalia_(2007–present)",
  "drc-m23-war": "M23_crisis_(2021–present)",
  "syrian-civil-war-2025": "Syrian_civil_war",
  "haiti-gang-crisis": "Gang_warfare_in_Haiti_(2021–present)",
  "mexican-drug-war": "Mexican_drug_war",
  "tigray-war-ethiopia": "Tigray_War",
  "india-pakistan-2025": "2025_India–Pakistan_border_standoff",
};

interface CacheEntry {
  data: WikiData;
  timestamp: number;
}

export interface WikiData {
  extract: string;
  thumbnail: string | null;
  lastEdited: string;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const wikiTitle = WIKI_TITLES[slug];

  if (!wikiTitle) {
    return NextResponse.json(
      { error: "Unknown conflict slug" },
      { status: 404 },
    );
  }

  const cached = cache.get(slug);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiTitle}`,
      { headers: { "User-Agent": "WARROOM/1.0 (conflict monitor)" } },
    );

    if (!res.ok) throw new Error(`Wikipedia API error: ${res.status}`);

    const json = await res.json();

    const data: WikiData = {
      extract: json.extract || "",
      thumbnail: json.thumbnail?.source ?? null,
      lastEdited: json.timestamp || new Date().toISOString(),
    };

    cache.set(slug, { data, timestamp: Date.now() });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch Wikipedia data" },
      { status: 502 },
    );
  }
}
