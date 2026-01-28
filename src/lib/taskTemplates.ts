export const CATEGORIES = [
  "General",
  "HVAC",
  "Plumbing",
  "Electrical",
  "Interior",
  "Exterior",
  "Appliances",
  "Roofing",
  "Safety",
  "Landscaping",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export interface TaskTemplate {
  title: string;
  frequency: "monthly" | "quarterly" | "annually";
  description: string;
  category: CategoryType;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  {
    title: "Change HVAC Filter",
    frequency: "quarterly",
    description: "Replace with high-quality pleated filter.",
    category: "HVAC",
  },
  {
    title: "Test Smoke/CO Detectors",
    frequency: "monthly",
    description: "Press test button on all units.",
    category: "Safety",
  },
  {
    title: "Flush Water Heater",
    frequency: "annually",
    description: "Drain to remove sediment buildup.",
    category: "Plumbing",
  },
  {
    title: "Clean Gutters",
    frequency: "quarterly",
    description: "Remove debris and check downspouts.",
    category: "Exterior",
  },
  {
    title: "Check Fire Extinguishers",
    frequency: "quarterly",
    description: "Ensure gauge is in the green zone.",
    category: "Safety",
  },
  {
    title: "Clean Refrigerator Coils",
    frequency: "annually",
    description: "Vacuum coils to improve efficiency.",
    category: "Appliances",
  },
  {
    title: "Clean Dryer Vent",
    frequency: "annually",
    description: "Clear lint from exhaust pipe to prevent fire.",
    category: "Appliances",
  },
  {
    title: "Inspect Roof",
    frequency: "annually",
    description: "Check for damaged shingles or flashing.",
    category: "Exterior",
  },
  {
    title: "Pest Control Inspection",
    frequency: "quarterly",
    description: "Check for signs of termites or rodents.",
    category: "Safety",
  },
  {
    title: "Clean Dishwasher Filter",
    frequency: "monthly",
    description: "Remove and rinse the filter assembly.",
    category: "Appliances",
  },
  {
    title: "Test Sump Pump",
    frequency: "quarterly",
    description: "Pour water in pit to ensure it triggers.",
    category: "Plumbing",
  },
  {
    title: "Recaulk Bath/Shower",
    frequency: "annually",
    description: "Prevent water damage to subfloors.",
    category: "Interior",
  },
  {
    title: "Check Window Seals",
    frequency: "annually",
    description: "Look for drafts or moisture between panes.",
    category: "Interior",
  },
  {
    title: "Oil Garage Door Tracks",
    frequency: "annually",
    description: "Use silicone spray for quiet operation.",
    category: "Exterior",
  },
  {
    title: "Clean Faucet Aerators",
    frequency: "annually",
    description: "Remove mineral deposits for better flow.",
    category: "Plumbing",
  },
  {
    title: "Trim Tree Branches",
    frequency: "annually",
    description: "Ensure no branches touch the roof.",
    category: "Landscaping",
  },
  {
    title: "Clean Range Hood Filter",
    frequency: "quarterly",
    description: "Wash in hot soapy water.",
    category: "Appliances",
  },
  {
    title: "Reseal Deck/Patio",
    frequency: "annually",
    description: "Check if wood needs staining or sealing.",
    category: "Exterior",
  },
  {
    title: "Inspect Washing Machine Hoses",
    frequency: "quarterly",
    description: "Check for cracks or bulges.",
    category: "Appliances",
  },
  {
    title: "Clean AC Condenser Coils",
    frequency: "annually",
    description: "Remove grass/debris from outside unit.",
    category: "HVAC",
  },
  {
    title: "Check Weatherstripping",
    frequency: "annually",
    description: "Ensure doors seal tightly.",
    category: "Interior",
  },
  {
    title: "Deep Clean Carpets",
    frequency: "annually",
    description: "Remove deep-seated allergens and dirt.",
    category: "Interior",
  },
  {
    title: "Check Attic for Leaks",
    frequency: "quarterly",
    description: "Look for water stains on the ceiling.",
    category: "Exterior",
  },
  {
    title: "Fertilize Lawn",
    frequency: "quarterly",
    description: "Apply seasonal nutrients for soil health.",
    category: "Landscaping",
  },
];
