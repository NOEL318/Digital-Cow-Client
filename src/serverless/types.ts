/**
 * Modelos de datos para el motor serverless en frontend (almacenamiento local).
 */

export interface ServerlessAccount {
  id: number;
  name: string;
  slug: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  plan: 'FREE' | 'PRO';
  defaultLocale: 'es' | 'en';
  createdAt: string;
  updatedAt: string;
}

export interface ServerlessUser {
  id: number;
  accountId: number | null;
  email: string;
  passwordHash?: string;
  fullName: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'WORKER' | 'VIEWER' | 'SUPERADMIN';
  locale: 'es' | 'en' | null;
  emailVerified: boolean;
  status: 'ACTIVE' | 'INVITED' | 'DISABLED';
  createdAt: string;
  updatedAt: string;
}

export interface ServerlessInvitation {
  id: number;
  accountId: number;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'WORKER' | 'VIEWER';
  token: string;
  expiresAt: string;
  acceptedAt?: string | null;
  createdByUserId: number;
  createdAt: string;
}

export interface ServerlessRanch {
  id: number;
  accountId: number;
  name: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  areaHectares?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServerlessLot {
  id: number;
  ranchId: number;
  name: string;
  areaHectares?: number | null;
  notes?: string | null;
  polygon?: string | null;
  centerLat?: number | null;
  centerLng?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServerlessLotCondition {
  id: number;
  lotId: number;
  observedAt: string;
  kind: string;
  severity?: number | null;
  customLabel?: string | null;
  notes?: string | null;
}

export interface ServerlessBreed {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  species: 'BOVINE';
  category: 'DAIRY' | 'BEEF' | 'DUAL';
  bos: 'TAURUS' | 'INDICUS' | 'CROSS';
}

export interface ServerlessVaccine {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  targetDiseases?: string | null;
  defaultDoseMl?: number | null;
  route?: 'IM' | 'SC' | 'ORAL' | 'INTRANASAL' | 'TOPICAL' | null;
  recommendedAgeMonths?: number | null;
  recommendedFrequencyMonths?: number | null;
  species: string;
}

export interface ServerlessDisease {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  category: string;
  zoonotic: boolean;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  defaultSymptoms?: string | null;
}

export interface ServerlessMedication {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  activeIngredient?: string | null;
  defaultDose?: string | null;
  defaultRoute?: 'IM' | 'SC' | 'IV' | 'ORAL' | 'TOPICAL' | 'INTRAMAMMARY' | null;
  withdrawalMilkDays: number;
  withdrawalMeatDays: number;
  barcode?: string | null;
  expirationDate?: string | null;
  notes?: string | null;
}

export interface ServerlessPest {
  id: number;
  code: string;
  nameEs: string;
  nameEn: string;
  scientificName?: string | null;
  type: string;
  region: string;
  notes?: string | null;
}

export interface ServerlessAnimalPhoto {
  id: number;
  animalId: number;
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  bytes?: number;
  createdAt: string;
}

export interface ServerlessAnimal {
  id: number;
  accountId: number;
  ranchId: number;
  lotId?: number | null;
  internalTag: string;
  officialTag?: string | null;
  rfid?: string | null;
  name?: string | null;
  sex: 'FEMALE' | 'MALE';
  birthDate?: string | null;
  birthDateEstimated: boolean;
  breedId: number;
  purpose: 'BEEF' | 'DAIRY' | 'DUAL';
  status: 'ACTIVE' | 'SOLD' | 'DEAD' | 'MISSING' | 'TRANSFERRED';
  notes?: string | null;
  coverPhotoId?: number | null;
  coverPhotoUrl?: string | null;
  shareToken?: string | null;
  createdByUserId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServerlessVaccination {
  id: number;
  accountId: number;
  animalId: number;
  vaccineId: number;
  appliedAt: string;
  doseMl?: number | null;
  batchNumber?: string | null;
  expirationDate?: string | null;
  cost?: number | null;
  notes?: string | null;
  performedByUserId?: number | null;
  createdAt: string;
}

export interface ServerlessDiagnosis {
  id: number;
  accountId: number;
  animalId: number;
  diseaseId: number;
  diagnosedAt: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE';
  status: 'ACTIVE' | 'RESOLVED' | 'CHRONIC';
  symptoms?: string | null;
  notes?: string | null;
  resolvedAt?: string | null;
  diagnosedByUserId?: number | null;
  createdAt: string;
}

export interface ServerlessTreatment {
  id: number;
  accountId: number;
  animalId: number;
  diagnosisId?: number | null;
  medicationId: number;
  startedAt: string;
  endedAt?: string | null;
  dose?: string | null;
  frequency?: string | null;
  route?: string | null;
  cost?: number | null;
  notes?: string | null;
  withdrawalMilkUntil?: string | null;
  withdrawalMeatUntil?: string | null;
  createdAt: string;
}

export interface ServerlessPestControl {
  id: number;
  accountId: number;
  ranchId?: number | null;
  lotId?: number | null;
  pestId?: number | null;
  appliedAt: string;
  method?: string | null;
  productName?: string | null;
  cost?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessVetVisit {
  id: number;
  accountId: number;
  ranchId?: number | null;
  visitedAt: string;
  vetName?: string | null;
  vetClinic?: string | null;
  reason?: string | null;
  diagnosisNotes?: string | null;
  cost?: number | null;
  createdAt: string;
}

export interface ServerlessHealthPlan {
  id: number;
  accountId: number | null;
  name: string;
  description?: string | null;
  appliesToPurpose: 'BEEF' | 'DAIRY' | 'DUAL' | 'ANY';
  appliesToSex: 'FEMALE' | 'MALE' | 'ANY';
  isGlobal?: boolean;
}

export interface ServerlessHealthPlanStep {
  id: number;
  healthPlanId: number;
  stepOrder: number;
  name: string;
  vaccineId?: number | null;
  ageMonthsMin?: number | null;
  recurrenceMonths?: number | null;
  notes?: string | null;
}

export interface ServerlessAnimalHealthPlan {
  id: number;
  healthPlanId: number;
  animalId?: number | null;
  lotId?: number | null;
  assignedAt: string;
}

export interface ServerlessWeighing {
  id: number;
  accountId: number;
  animalId: number;
  weighedAt: string;
  weightKg: number;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessMilking {
  id: number;
  accountId: number;
  animalId: number;
  milkedAt: string;
  liters: number;
  shift?: 'MORNING' | 'AFTERNOON' | 'EVENING' | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessMilkSample {
  id: number;
  accountId: number;
  animalId: number;
  sampledAt: string;
  fatPercentage?: number | null;
  proteinPercentage?: number | null;
  somaticCellCount?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessBulkTankDelivery {
  id: number;
  accountId: number;
  ranchId: number;
  deliveredAt: string;
  liters: number;
  buyerName?: string | null;
  temperatureCelsius?: number | null;
  pricePerLiter?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessSlaughter {
  id: number;
  accountId: number;
  animalId: number;
  slaughteredAt: string;
  liveWeightKg?: number | null;
  carcassWeightKg?: number | null;
  dressingPercentage?: number | null;
  facility?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessBull {
  id: number;
  accountId: number;
  internalTag?: string | null;
  officialTag?: string | null;
  name: string;
  breedId?: number | null;
  status: 'ACTIVE' | 'RETIRED' | 'SOLD' | 'DEAD';
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessSemenStraw {
  id: number;
  accountId: number;
  bullId?: number | null;
  bullCode: string;
  bullName?: string | null;
  breedId?: number | null;
  tankCanister?: string | null;
  availableQuantity: number;
  costPerStraw?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessHeat {
  id: number;
  accountId: number;
  animalId: number;
  detectedAt: string;
  intensity?: 'LOW' | 'MEDIUM' | 'HIGH' | null;
  notes?: string | null;
  detectedByUserId?: number | null;
  createdAt: string;
}

export interface ServerlessServiceEvent {
  id: number;
  accountId: number;
  animalId: number;
  serviceType: 'AI' | 'NATURAL' | 'EMBRYO_TRANSFER';
  serviceDate: string;
  bullId?: number | null;
  semenStrawId?: number | null;
  technicianName?: string | null;
  heatId?: number | null;
  cost?: number | null;
  notes?: string | null;
  createdByUserId?: number | null;
  createdAt: string;
}

export interface ServerlessPregnancyCheck {
  id: number;
  accountId: number;
  animalId: number;
  serviceId?: number | null;
  checkedAt: string;
  method?: 'PALPATION' | 'ULTRASOUND' | 'BLOOD_TEST' | 'MILK_TEST' | null;
  result: 'POSITIVE' | 'NEGATIVE' | 'DOUBTFUL';
  estimatedGestationDays?: number | null;
  estimatedCalvingDate?: string | null;
  vetVisitId?: number | null;
  checkedByUserId?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessCalving {
  id: number;
  accountId: number;
  motherId: number;
  calvingDate: string;
  ease?: 'NORMAL' | 'ASSISTED' | 'CESAREAN' | 'DIFFICULT' | null;
  calvesCount: number;
  calfSex?: 'FEMALE' | 'MALE' | 'MIXED' | null;
  calfStatus?: 'ALIVE' | 'DEAD' | 'WEAK' | null;
  calfInternalTag?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessAbortion {
  id: number;
  accountId: number;
  animalId: number;
  abortedAt: string;
  gestationDays?: number | null;
  suspectedCause?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessWeaning {
  id: number;
  accountId: number;
  animalId: number;
  weanedAt: string;
  weightKg?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessDryOff {
  id: number;
  accountId: number;
  animalId: number;
  dryOffDate: string;
  dryOffTreatment?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessFeedItem {
  id: number;
  accountId: number;
  name: string;
  type: 'FORAGE' | 'CONCENTRATE' | 'MINERAL' | 'SUPPLEMENT' | 'OTHER';
  costPerKg: number;
  dryMatterPercentage?: number | null;
  crudeProteinPercentage?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessFeedingPlan {
  id: number;
  accountId: number;
  name: string;
  category: 'DAIRY_LACTATION' | 'DAIRY_DRY' | 'BEEF_GROWING' | 'BEEF_FINISHING' | 'CALF' | 'OTHER';
  description?: string | null;
  createdAt: string;
}

export interface ServerlessFeedingPlanItem {
  id: number;
  feedingPlanId: number;
  feedItemId: number;
  kgPerHeadDay: number;
  notes?: string | null;
}

export interface ServerlessLotFeedingPlan {
  id: number;
  lotId: number;
  feedingPlanId: number;
  assignedAt: string;
  unassignedAt?: string | null;
}

export interface ServerlessFeedingRecord {
  id: number;
  accountId: number;
  fedAt: string;
  lotId?: number | null;
  animalId?: number | null;
  feedItemId: number;
  totalKgFed: number;
  headCount?: number | null;
  totalCost?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessExpenseCategory {
  id: number;
  accountId: number | null;
  code: string;
  nameEs: string;
  nameEn: string;
  kind: 'FEED' | 'HEALTH' | 'LABOR' | 'INFRASTRUCTURE' | 'TRANSPORT' | 'REPRODUCTION' | 'OTHER';
  notes?: string | null;
  isGlobal?: boolean;
}

export interface ServerlessIncomeCategory {
  id: number;
  accountId: number | null;
  code: string;
  nameEs: string;
  nameEn: string;
  kind: 'ANIMAL_SALE' | 'MILK_SALE' | 'BYPRODUCT' | 'SERVICE' | 'OTHER';
  notes?: string | null;
  isGlobal?: boolean;
}

export interface ServerlessExpense {
  id: number;
  accountId: number;
  expenseCategoryId: number;
  incurredAt: string;
  amount: number;
  currency: string;
  ranchId?: number | null;
  lotId?: number | null;
  animalId?: number | null;
  description?: string | null;
  vendor?: string | null;
  invoiceNumber?: string | null;
  createdByUserId?: number | null;
  createdAt: string;
}

export interface ServerlessIncome {
  id: number;
  accountId: number;
  incomeCategoryId: number;
  receivedAt: string;
  amount: number;
  currency: string;
  ranchId?: number | null;
  lotId?: number | null;
  animalId?: number | null;
  description?: string | null;
  payer?: string | null;
  invoiceNumber?: string | null;
  createdByUserId?: number | null;
  createdAt: string;
}

export interface ServerlessAnimalSale {
  id: number;
  accountId: number;
  animalId: number;
  soldAt: string;
  totalPrice: number;
  currency: string;
  weightKg?: number | null;
  pricePerKg?: number | null;
  buyer?: string | null;
  destination?: 'SLAUGHTERHOUSE' | 'FEEDLOT' | 'BREEDING_FARM' | 'AUCTION' | 'OTHER' | null;
  incomeCategoryId?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessMilkSale {
  id: number;
  accountId: number;
  ranchId: number;
  soldAt: string;
  liters: number;
  pricePerLiter: number;
  totalAmount: number;
  currency: string;
  buyer?: string | null;
  incomeCategoryId?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessLand {
  id: number;
  accountId: number;
  ranchId: number;
  name: string;
  type: 'PASTURE' | 'AGRICULTURAL' | 'FEEDLOT' | 'INFRASTRUCTURE';
  areaHectares: number;
  soilType?: 'CLAY' | 'LOAM' | 'SANDY' | 'SILT' | 'ORGANIC' | null;
  irrigationType?: 'RAIN_FED' | 'DRIP' | 'SPRINKLER' | 'FLOOD' | 'PIVOT' | 'NONE' | null;
  status: 'ACTIVE' | 'RESTING' | 'PREPARATION' | 'OCCUPIED' | 'MAINTENANCE';
  pastureGrassType?: string | null;
  carryingCapacityUGM?: number | null;
  currentAnimalCount?: number | null;
  daysInRest?: number | null;
  daysInUse?: number | null;
  currentCrop?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServerlessCrop {
  id: number;
  name: string;
  scientificName?: string | null;
  category: 'GRAIN' | 'FORAGE' | 'LEGUME' | 'PASTURE' | 'TUBER' | 'OTHER';
  standardCycleDays: number;
  expectedYieldTonsPerHa: number;
  recommendedSeedingRateKgHa: number;
  notes?: string | null;
}

export interface ServerlessPlanting {
  id: number;
  accountId: number;
  ranchId: number;
  landId: number;
  cropId: number;
  cropName: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  actualHarvestDate?: string | null;
  areaHectares: number;
  seedingRateKgHa: number;
  status: 'PLANNED' | 'GERMINATION' | 'VEGETATIVE' | 'FLOWERING' | 'MATURATION' | 'HARVESTED' | 'LOST';
  progressPercentage: number;
  seedCost: number;
  fertilizerCost: number;
  agrochemicalCost: number;
  laborCost: number;
  machineryCost: number;
  totalInvestment: number;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessHarvest {
  id: number;
  accountId: number;
  ranchId: number;
  plantingId: number;
  landId: number;
  cropName: string;
  harvestDate: string;
  areaHectares: number;
  totalYieldTons: number;
  yieldPerHa: number;
  moisturePercentage?: number | null;
  grainQuality: 'PREMIUM' | 'STANDARD' | 'FEED_GRADE' | 'DAMAGED';
  destination: 'SILO' | 'DIRECT_SALE' | 'FEEDLOT' | 'BALES';
  salePricePerTon?: number | null;
  totalRevenue?: number | null;
  netProfit?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessMachinery {
  id: number;
  accountId: number;
  ranchId: number;
  name: string;
  type: 'TRACTOR' | 'HARVESTER' | 'PLANTER' | 'SPRAYER' | 'TRAILER' | 'IRRIGATION' | 'FEED_MIXER' | 'SCALE' | 'TOOL' | 'OTHER';
  brand: string;
  model: string;
  year: number;
  serialNumber?: string | null;
  status: 'OPERATIONAL' | 'IN_MAINTENANCE' | 'OUT_OF_SERVICE';
  currentHoursMeter: number;
  nextServiceHours: number;
  fuelType: 'DIESEL' | 'GASOLINE' | 'ELECTRIC' | 'NONE';
  fuelEfficiencyLitersPerHour?: number | null;
  assignedOperator?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessMachineryMaintenance {
  id: number;
  accountId: number;
  machineryId: number;
  maintenanceDate: string;
  type: 'PREVENTIVE' | 'CORRECTIVE' | 'OVERHAUL';
  hoursMeter: number;
  description: string;
  cost: number;
  performedBy: string;
  partsReplaced?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessFuelLog {
  id: number;
  accountId: number;
  machineryId: number;
  loggedAt: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  hoursMeter: number;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessSupplyItem {
  id: number;
  accountId: number;
  name: string;
  category: 'SEED' | 'FERTILIZER' | 'AGROCHEMICAL' | 'FUEL' | 'FEED' | 'MEDICATION' | 'TOOL' | 'OTHER';
  unit: 'KG' | 'TON' | 'LITER' | 'BAG' | 'BALE' | 'DOSE' | 'PIECE';
  currentStock: number;
  minStockAlert: number;
  costPerUnit: number;
  warehouseLocation?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessSupplyMovement {
  id: number;
  accountId: number;
  supplyItemId: number;
  movementDate: string;
  type: 'PURCHASE' | 'USAGE_CROP' | 'USAGE_LIVESTOCK' | 'USAGE_MACHINERY' | 'ADJUSTMENT';
  quantity: number;
  unitCost: number;
  totalCost: number;
  referenceType?: 'PLANTING' | 'FEEDING' | 'MAINTENANCE' | 'SALE' | null;
  referenceId?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessTrade {
  id: number;
  accountId: number;
  ranchId: number;
  type: 'SALE_LIVESTOCK' | 'SALE_CROP' | 'SALE_MILK' | 'PURCHASE_INPUTS' | 'PURCHASE_LIVESTOCK' | 'PURCHASE_EQUIPMENT';
  tradeDate: string;
  entityName: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  paymentStatus: 'PAID' | 'PENDING' | 'PARTIAL';
  invoiceNumber?: string | null;
  weightScaleKg?: number | null;
  shrinkagePercentage?: number | null;
  notes?: string | null;
  createdAt: string;
}

export interface ServerlessDatabase {
  version: number;
  accounts: ServerlessAccount[];
  users: ServerlessUser[];
  invitations: ServerlessInvitation[];
  ranches: ServerlessRanch[];
  lots: ServerlessLot[];
  lotConditions: ServerlessLotCondition[];
  breeds: ServerlessBreed[];
  vaccines: ServerlessVaccine[];
  diseases: ServerlessDisease[];
  medications: ServerlessMedication[];
  pests: ServerlessPest[];
  animals: ServerlessAnimal[];
  photos: ServerlessAnimalPhoto[];
  vaccinations: ServerlessVaccination[];
  diagnoses: ServerlessDiagnosis[];
  treatments: ServerlessTreatment[];
  pestControls: ServerlessPestControl[];
  vetVisits: ServerlessVetVisit[];
  healthPlans: ServerlessHealthPlan[];
  healthPlanSteps: ServerlessHealthPlanStep[];
  animalHealthPlans: ServerlessAnimalHealthPlan[];
  weighings: ServerlessWeighing[];
  milkings: ServerlessMilking[];
  milkSamples: ServerlessMilkSample[];
  bulkTankDeliveries: ServerlessBulkTankDelivery[];
  slaughters: ServerlessSlaughter[];
  bulls: ServerlessBull[];
  semenStraws: ServerlessSemenStraw[];
  heats: ServerlessHeat[];
  services: ServerlessServiceEvent[];
  pregnancyChecks: ServerlessPregnancyCheck[];
  calvings: ServerlessCalving[];
  abortions: ServerlessAbortion[];
  weanings: ServerlessWeaning[];
  dryOffs: ServerlessDryOff[];
  feedItems: ServerlessFeedItem[];
  feedingPlans: ServerlessFeedingPlan[];
  feedingPlanItems: ServerlessFeedingPlanItem[];
  lotFeedingPlans: ServerlessLotFeedingPlan[];
  feedingRecords: ServerlessFeedingRecord[];
  expenseCategories: ServerlessExpenseCategory[];
  incomeCategories: ServerlessIncomeCategory[];
  expenses: ServerlessExpense[];
  incomes: ServerlessIncome[];
  animalSales: ServerlessAnimalSale[];
  milkSales: ServerlessMilkSale[];
  lands: ServerlessLand[];
  crops: ServerlessCrop[];
  plantings: ServerlessPlanting[];
  harvests: ServerlessHarvest[];
  machinery: ServerlessMachinery[];
  machineryMaintenances: ServerlessMachineryMaintenance[];
  fuelLogs: ServerlessFuelLog[];
  supplies: ServerlessSupplyItem[];
  supplyMovements: ServerlessSupplyMovement[];
  trades: ServerlessTrade[];
}
