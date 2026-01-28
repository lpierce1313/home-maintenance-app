export interface TaskTemplate {
  title: string;
  frequency: 'monthly' | 'quarterly' | 'annually';
  description: string;
}

export const TASK_TEMPLATES: TaskTemplate[] = [
  { title: "Change HVAC Filter", frequency: "quarterly", description: "Replace with high-quality pleated filter." },
  { title: "Test Smoke/CO Detectors", frequency: "monthly", description: "Press test button on all units." },
  { title: "Flush Water Heater", frequency: "annually", description: "Drain to remove sediment buildup." },
  { title: "Clean Gutters", frequency: "quarterly", description: "Remove debris and check downspouts." },
  { title: "Check Fire Extinguishers", frequency: "quarterly", description: "Ensure gauge is in the green zone." },
  { title: "Clean Refrigerator Coils", frequency: "annually", description: "Vacuum coils to improve efficiency." },
  { title: "Clean Dryer Vent", frequency: "annually", description: "Clear lint from exhaust pipe to prevent fire." },
  { title: "Inspect Roof", frequency: "annually", description: "Check for damaged shingles or flashing." },
  { title: "Pest Control Inspection", frequency: "quarterly", description: "Check for signs of termites or rodents." },
  { title: "Clean Dishwasher Filter", frequency: "monthly", description: "Remove and rinse the filter assembly." },
  { title: "Test Sump Pump", frequency: "quarterly", description: "Pour water in pit to ensure it triggers." },
  { title: "Recaulk Bath/Shower", frequency: "annually", description: "Prevent water damage to subfloors." },
  { title: "Check Window Seals", frequency: "annually", description: "Look for drafts or moisture between panes." },
  { title: "Oil Garage Door Tracks", frequency: "annually", description: "Use silicone spray for quiet operation." },
  { title: "Clean Faucet Aerators", frequency: "annually", description: "Remove mineral deposits for better flow." },
  { title: "Trim Tree Branches", frequency: "annually", description: "Ensure no branches touch the roof." },
  { title: "Clean Range Hood Filter", frequency: "quarterly", description: "Wash in hot soapy water." },
  { title: "Reseal Deck/Patio", frequency: "annually", description: "Check if wood needs staining or sealing." },
  { title: "Inspect Washing Machine Hoses", frequency: "quarterly", description: "Check for cracks or bulges." },
  { title: "Clean AC Condenser Coils", frequency: "annually", description: "Remove grass/debris from outside unit." },
  { title: "Check Weatherstripping", frequency: "annually", description: "Ensure doors seal tightly." },
  { title: "Deep Clean Carpets", frequency: "annually", description: "Remove deep-seated allergens and dirt." },
  { title: "Check Attic for Leaks", frequency: "quarterly", description: "Look for water stains on the ceiling." },
  { title: "Fertilize Lawn", frequency: "quarterly", description: "Apply seasonal nutrients for soil health." }
];