/**
 * Datos semilla iniciales para el funcionamiento sin backend de Digital Cow.
 * Mantiene catálogos globales zootécnicos y agronómicos (razas, vacunas, enfermedades,
 * medicamentos, plagas, cultivos y categorías contables).
 *
 * Todas las entidades operativas del usuario (animales, pesajes, ordeños, cosechas,
 * siembras, maquinaria, ventas y gastos) inician VACÍAS para garantizar que el usuario
 * solo visualice sus propios registros.
 */
import type { ServerlessDatabase } from './types';

export const INITIAL_SEED_DATA: ServerlessDatabase = {
  version: 3,
  accounts: [
    {
      id: 1,
      name: 'Mi Finca / Rancho',
      slug: 'mi-finca',
      status: 'ACTIVE',
      plan: 'PRO',
      defaultLocale: 'es',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  users: [
    {
      id: 1,
      accountId: 1,
      email: 'admin@digitalcow.local',
      fullName: 'Administrador Ganadero',
      role: 'OWNER',
      locale: 'es',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      email: 'veterinario@digitalcow.local',
      fullName: 'Médico Veterinario (MVZ)',
      role: 'MANAGER',
      locale: 'es',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 3,
      accountId: 1,
      email: 'operador@digitalcow.local',
      fullName: 'Operador de Campo',
      role: 'WORKER',
      locale: 'es',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  invitations: [],
  ranches: [
    {
      id: 1,
      accountId: 1,
      name: 'Rancho Principal',
      location: 'Ubicación local',
      latitude: null,
      longitude: null,
      areaHectares: 0,
      notes: '',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  lots: [
    {
      id: 1,
      ranchId: 1,
      name: 'Potrero 1',
      areaHectares: 0,
      notes: '',
      polygon: null,
      centerLat: null,
      centerLng: null,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  lotConditions: [],
  breeds: [
    { id: 1, code: 'HOLSTEIN', nameEs: 'Holstein', nameEn: 'Holstein', species: 'BOVINE', category: 'DAIRY', bos: 'TAURUS' },
    { id: 2, code: 'JERSEY', nameEs: 'Jersey', nameEn: 'Jersey', species: 'BOVINE', category: 'DAIRY', bos: 'TAURUS' },
    { id: 3, code: 'PARDO_SUIZO', nameEs: 'Pardo Suizo', nameEn: 'Brown Swiss', species: 'BOVINE', category: 'DAIRY', bos: 'TAURUS' },
    { id: 4, code: 'GYR', nameEs: 'Gyr', nameEn: 'Gyr', species: 'BOVINE', category: 'DAIRY', bos: 'INDICUS' },
    { id: 5, code: 'GIROLANDO', nameEs: 'Girolando', nameEn: 'Girolando', species: 'BOVINE', category: 'DAIRY', bos: 'CROSS' },
    { id: 6, code: 'ANGUS', nameEs: 'Angus', nameEn: 'Angus', species: 'BOVINE', category: 'BEEF', bos: 'TAURUS' },
    { id: 7, code: 'HEREFORD', nameEs: 'Hereford', nameEn: 'Hereford', species: 'BOVINE', category: 'BEEF', bos: 'TAURUS' },
    { id: 8, code: 'CHAROLAIS', nameEs: 'Charolais', nameEn: 'Charolais', species: 'BOVINE', category: 'BEEF', bos: 'TAURUS' },
    { id: 9, code: 'BRAHMAN', nameEs: 'Brahman', nameEn: 'Brahman', species: 'BOVINE', category: 'BEEF', bos: 'INDICUS' },
    { id: 10, code: 'BRANGUS', nameEs: 'Brangus', nameEn: 'Brangus', species: 'BOVINE', category: 'BEEF', bos: 'CROSS' },
    { id: 11, code: 'BEEFMASTER', nameEs: 'Beefmaster', nameEn: 'Beefmaster', species: 'BOVINE', category: 'BEEF', bos: 'CROSS' },
    { id: 12, code: 'SIMMENTAL', nameEs: 'Simmental', nameEn: 'Simmental', species: 'BOVINE', category: 'DUAL', bos: 'TAURUS' },
    { id: 13, code: 'LIMOUSIN', nameEs: 'Limousin', nameEn: 'Limousin', species: 'BOVINE', category: 'BEEF', bos: 'TAURUS' },
    { id: 14, code: 'NELORE', nameEs: 'Nelore', nameEn: 'Nelore', species: 'BOVINE', category: 'BEEF', bos: 'INDICUS' },
    { id: 15, code: 'SENEPOL', nameEs: 'Senepol', nameEn: 'Senepol', species: 'BOVINE', category: 'BEEF', bos: 'TAURUS' },
    { id: 16, code: 'SANTA_GERTRUDIS', nameEs: 'Santa Gertrudis', nameEn: 'Santa Gertrudis', species: 'BOVINE', category: 'BEEF', bos: 'CROSS' },
    { id: 17, code: 'SIMBRAH', nameEs: 'Simbrah', nameEn: 'Simbrah', species: 'BOVINE', category: 'DUAL', bos: 'CROSS' }
  ],
  vaccines: [
    { id: 1, code: 'BRUCELLA_RB51', nameEs: 'Brucella RB51', nameEn: 'Brucella RB51', route: 'SC', recommendedFrequencyMonths: null, species: 'BOVINE', targetDiseases: 'Brucelosis' },
    { id: 2, code: 'IBR_BVD_PI3_BRSV', nameEs: 'IBR/BVD/PI3/BRSV (Bovi-Shield)', nameEn: 'IBR/BVD/PI3/BRSV (Bovi-Shield)', route: 'IM', recommendedFrequencyMonths: 12, species: 'BOVINE', targetDiseases: 'Complejo Respiratorio' },
    { id: 3, code: 'LEPTOSPIRA_PENTAVALENTE', nameEs: 'Leptospira Pentavalente', nameEn: 'Leptospira Pentavalent', route: 'IM', recommendedFrequencyMonths: 6, species: 'BOVINE', targetDiseases: 'Leptospirosis' },
    { id: 4, code: 'CARBON_SINTOMATICO', nameEs: 'Carbón sintomático (Clostridiosis)', nameEn: 'Blackleg (Clostridiosis)', route: 'SC', recommendedFrequencyMonths: 12, species: 'BOVINE', targetDiseases: 'Carbón sintomático' },
    { id: 5, code: 'RABIA_BOVINA', nameEs: 'Rabia bovina', nameEn: 'Bovine rabies', route: 'IM', recommendedFrequencyMonths: 12, species: 'BOVINE', targetDiseases: 'Rabia paralítica' },
    { id: 6, code: 'PASTEURELLA', nameEs: 'Pasteurella multocida', nameEn: 'Pasteurella multocida', route: 'SC', recommendedFrequencyMonths: 12, species: 'BOVINE', targetDiseases: 'Pasteurelosis' },
    { id: 7, code: 'FIEBRE_AFTOSA', nameEs: 'Fiebre aftosa', nameEn: 'Foot-and-mouth disease', route: 'IM', recommendedFrequencyMonths: 6, species: 'BOVINE', targetDiseases: 'Fiebre aftosa' },
    { id: 8, code: 'ANTHRAX', nameEs: 'Ántrax', nameEn: 'Anthrax', route: 'SC', recommendedFrequencyMonths: 12, species: 'BOVINE', targetDiseases: 'Ántrax' },
    { id: 9, code: 'MASTITIS_J5', nameEs: 'Mastitis Coliforme J5', nameEn: 'Coliform Mastitis J5', route: 'IM', recommendedFrequencyMonths: 6, species: 'BOVINE', targetDiseases: 'Mastitis coliforme' }
  ],
  diseases: [
    { id: 1, code: 'MASTITIS', nameEs: 'Mastitis', nameEn: 'Mastitis', category: 'BACTERIAL', zoonotic: false, severity: 'MEDIUM', defaultSymptoms: 'Inflamación de ubre, grumos en leche' },
    { id: 2, code: 'BRD', nameEs: 'Complejo respiratorio bovino', nameEn: 'Bovine Respiratory Disease', category: 'BACTERIAL', zoonotic: false, severity: 'HIGH', defaultSymptoms: 'Fiebre, secreción nasal, dificultad respiratoria' },
    { id: 3, code: 'DIARREA_NEONATAL', nameEs: 'Diarrea neonatal', nameEn: 'Neonatal diarrhea', category: 'BACTERIAL', zoonotic: false, severity: 'HIGH', defaultSymptoms: 'Heces líquidas, deshidratación en becerros' },
    { id: 4, code: 'COJERA', nameEs: 'Cojera / Gabarro', nameEn: 'Lameness', category: 'MECHANICAL', zoonotic: false, severity: 'MEDIUM', defaultSymptoms: 'Dificultad para apoyar extremidad, inflamación interdigital' },
    { id: 5, code: 'BRUCELOSIS', nameEs: 'Brucelosis', nameEn: 'Brucellosis', category: 'BACTERIAL', zoonotic: true, severity: 'HIGH', defaultSymptoms: 'Aborto en último tercio, retención placentaria' },
    { id: 6, code: 'ACETOSIS', nameEs: 'Acetonemia (Cetosis)', nameEn: 'Ketosis', category: 'METABOLIC', zoonotic: false, severity: 'MEDIUM', defaultSymptoms: 'Pérdida de apetito, olor a acetona en aliento' },
    { id: 7, code: 'HIPOCALCEMIA', nameEs: 'Hipocalcemia (Fiebre de leche)', nameEn: 'Milk fever', category: 'METABOLIC', zoonotic: false, severity: 'HIGH', defaultSymptoms: 'Postración postparto, debilidad muscular' },
    { id: 8, code: 'METRITIS', nameEs: 'Metritis', nameEn: 'Metritis', category: 'BACTERIAL', zoonotic: false, severity: 'MEDIUM', defaultSymptoms: 'Descarga uterina fétida tras el parto' }
  ],
  medications: [
    { id: 1, code: 'OXITETRACICLINA_LA', nameEs: 'Oxitetraciclina L.A. 200mg', nameEn: 'Long-acting Oxytetracycline', activeIngredient: 'Oxitetraciclina', withdrawalMilkDays: 7, withdrawalMeatDays: 28, barcode: '7501002233441', notes: 'Antibiótico de amplio espectro' },
    { id: 2, code: 'PENICILINA', nameEs: 'Penicilina G procaínica', nameEn: 'Penicillin G procaine', activeIngredient: 'Penicilina G', withdrawalMilkDays: 3, withdrawalMeatDays: 14, barcode: '7501002233442', notes: 'Tratamiento de infecciones bacterianas agudas' },
    { id: 3, code: 'ENROFLOXACINA', nameEs: 'Enrofloxacina 10%', nameEn: 'Enrofloxacin', activeIngredient: 'Enrofloxacina', withdrawalMilkDays: 4, withdrawalMeatDays: 14, barcode: '7501002233443', notes: 'Infecciones respiratorias y digestivas' },
    { id: 4, code: 'IVERMECTINA', nameEs: 'Ivermectina 1%', nameEn: 'Ivermectin 1%', activeIngredient: 'Ivermectina', withdrawalMilkDays: 28, withdrawalMeatDays: 35, barcode: '7501002233444', notes: 'Antiparasitario interno y externo' },
    { id: 5, code: 'FLUNIXIN', nameEs: 'Flunixin meglumine', nameEn: 'Flunixin meglumine', activeIngredient: 'Flunixin meglumine', withdrawalMilkDays: 2, withdrawalMeatDays: 4, barcode: '7501002233445', notes: 'Antiinflamatorio no esteroideo y antipirético' },
    { id: 6, code: 'CEFTIOFUR', nameEs: 'Ceftiofur sódico', nameEn: 'Ceftiofur', activeIngredient: 'Ceftiofur', withdrawalMilkDays: 0, withdrawalMeatDays: 4, barcode: '7501002233446', notes: 'Sin retiro en leche, ideal para vacas en ordeño' }
  ],
  pests: [
    { id: 1, code: 'GARRAPATA_COMUN', nameEs: 'Garrapata común', nameEn: 'Common cattle tick', scientificName: 'Rhipicephalus microplus', type: 'TICK', region: 'TROPICAL' },
    { id: 2, code: 'MOSCA_CUERNO', nameEs: 'Mosca del cuerno', nameEn: 'Horn fly', scientificName: 'Haematobia irritans', type: 'FLY', region: 'ANY' },
    { id: 3, code: 'GASTERINTESTINALES', nameEs: 'Parásitos gastrointestinales', nameEn: 'Gastrointestinal parasites', scientificName: 'Ostertagia spp.', type: 'WORM', region: 'ANY' }
  ],
  photos: [],
  animals: [],
  vaccinations: [],
  diagnoses: [],
  treatments: [],
  pestControls: [],
  vetVisits: [],
  healthPlans: [
    {
      id: 1,
      accountId: 1,
      name: 'Plan Sanitario Anual - Vacas Lecheras',
      description: 'Calendario de vacunación y desparasitación para hato lechero',
      appliesToPurpose: 'DAIRY',
      appliesToSex: 'FEMALE',
      isGlobal: false
    }
  ],
  healthPlanSteps: [
    {
      id: 1,
      healthPlanId: 1,
      stepOrder: 1,
      name: 'Refuerzo IBR / BVD',
      vaccineId: 2,
      recurrenceMonths: 12,
      notes: 'Aplicar 30 días antes del servicio'
    },
    {
      id: 2,
      healthPlanId: 1,
      stepOrder: 2,
      name: 'Carbón sintomático',
      vaccineId: 4,
      recurrenceMonths: 12,
      notes: 'Prevención anual de clostridiasis'
    }
  ],
  animalHealthPlans: [],
  weighings: [],
  milkings: [],
  milkSamples: [],
  bulkTankDeliveries: [],
  slaughters: [],
  bulls: [],
  semenStraws: [],
  heats: [],
  services: [],
  pregnancyChecks: [],
  calvings: [],
  abortions: [],
  weanings: [],
  dryOffs: [],
  feedItems: [
    {
      id: 1,
      accountId: 1,
      name: 'Ensilado de Maíz de Primera',
      type: 'FORAGE',
      costPerKg: 1.80,
      dryMatterPercentage: 33.5,
      crudeProteinPercentage: 8.2,
      notes: 'Silo propio de trinchera bien compactado',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      name: 'Concentrado Lechero 18% PB',
      type: 'CONCENTRATE',
      costPerKg: 7.50,
      dryMatterPercentage: 89.0,
      crudeProteinPercentage: 18.0,
      notes: 'Pellet balanceado con minerales y vitaminas',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 3,
      accountId: 1,
      name: 'Heno de Alfalfa en Paca',
      type: 'FORAGE',
      costPerKg: 4.20,
      dryMatterPercentage: 88.0,
      crudeProteinPercentage: 20.0,
      notes: 'Alfalfa de corte tierno',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 4,
      accountId: 1,
      name: 'Sales Minerales Ganaderas',
      type: 'MINERAL',
      costPerKg: 18.00,
      dryMatterPercentage: 98.0,
      crudeProteinPercentage: 0.0,
      notes: 'Fórmula con fósforo al 8%',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  feedingPlans: [
    {
      id: 1,
      accountId: 1,
      name: 'Ración Vacas Altas Productores (>25L)',
      category: 'DAIRY_LACTATION',
      description: 'Dieta alta en energía y proteína sobrepasante',
      createdAt: '2026-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      name: 'Ración de Mantenimiento y Pastoreo',
      category: 'BEEF_GROWING',
      description: 'Suplemento complementario al pastoreo',
      createdAt: '2026-01-01T00:00:00.000Z'
    }
  ],
  feedingPlanItems: [
    { id: 1, feedingPlanId: 1, feedItemId: 1, kgPerHeadDay: 22.0, notes: 'Silo base' },
    { id: 2, feedingPlanId: 1, feedItemId: 2, kgPerHeadDay: 8.5, notes: 'Concentrado en sala' },
    { id: 3, feedingPlanId: 1, feedItemId: 3, kgPerHeadDay: 4.0, notes: 'Alfalfa fibra efectiva' },
    { id: 4, feedingPlanId: 1, feedItemId: 4, kgPerHeadDay: 0.15, notes: 'Minerales en comedero' }
  ],
  lotFeedingPlans: [],
  feedingRecords: [],
  expenseCategories: [
    { id: 1, accountId: 1, code: 'ALIMENTO', nameEs: 'Alimento y Forrajes', nameEn: 'Feed & Forage', kind: 'FEED', notes: 'Silos, granos, henos y concentrados', isGlobal: true },
    { id: 2, accountId: 1, code: 'SALUD', nameEs: 'Salud y Medicamentos', nameEn: 'Health & Medicines', kind: 'HEALTH', notes: 'Vacunas, antibióticos e instrumental', isGlobal: true },
    { id: 3, accountId: 1, code: 'VETERINARIO', nameEs: 'Honorarios Veterinarios', nameEn: 'Veterinary Fees', kind: 'HEALTH', notes: 'Visitas, cirugías y asesorías técnicas', isGlobal: true },
    { id: 4, accountId: 1, code: 'MANO_OBRA', nameEs: 'Mano de Obra y Nómina', nameEn: 'Labor & Wages', kind: 'LABOR', notes: 'Sueldos de vaqueros y ordeñadores', isGlobal: true },
    { id: 5, accountId: 1, code: 'REPRODUCCION', nameEs: 'Genética y Reproducción', nameEn: 'Genetics & Reproduction', kind: 'REPRODUCTION', notes: 'Pajuelas de semen, nitrógeno y materiales', isGlobal: true },
    { id: 6, accountId: 1, code: 'MANTENIMIENTO', nameEs: 'Mantenimiento e Instalaciones', nameEn: 'Maintenance', kind: 'INFRASTRUCTURE', notes: 'Cercos, comederos, sala de ordeño', isGlobal: true },
    { id: 7, accountId: 1, code: 'COMBUSTIBLE', nameEs: 'Combustible y Transporte', nameEn: 'Fuel & Transport', kind: 'TRANSPORT', notes: 'Diesel tractores y traslados', isGlobal: true }
  ],
  incomeCategories: [
    { id: 1, accountId: 1, code: 'VENTA_LECHE', nameEs: 'Venta de Leche Fluida', nameEn: 'Milk Sales', kind: 'MILK_SALE', notes: 'Entregas a planta pasteurizadora', isGlobal: true },
    { id: 2, accountId: 1, code: 'VENTA_ANIMALES', nameEs: 'Venta de Ganado en Pie', nameEn: 'Livestock Sales', kind: 'ANIMAL_SALE', notes: 'Venta de becerros, novillas o desecho', isGlobal: true },
    { id: 3, accountId: 1, code: 'VENTA_GENETICA', nameEs: 'Venta de Genética y Semen', nameEn: 'Genetics Sales', kind: 'BYPRODUCT', notes: 'Venta de pajuelas o embriones', isGlobal: true },
    { id: 4, accountId: 1, code: 'OTROS_INGRESOS', nameEs: 'Otros Ingresos Agrícolas', nameEn: 'Other Farm Income', kind: 'OTHER', notes: 'Venta de estiércol o forraje sobrante', isGlobal: true }
  ],
  expenses: [],
  incomes: [],
  animalSales: [],
  milkSales: [],
  lands: [],
  crops: [
    {
      id: 1,
      name: 'Maíz Blanco Grano',
      scientificName: 'Zea mays L.',
      category: 'GRAIN',
      standardCycleDays: 140,
      expectedYieldTonsPerHa: 9.5,
      recommendedSeedingRateKgHa: 22.0,
      notes: 'Grano para venta a harineras y autoconsumo en raciones concentradas.'
    },
    {
      id: 2,
      name: 'Maíz Forrajero (Ensilaje)',
      scientificName: 'Zea mays var. indentata',
      category: 'FORAGE',
      standardCycleDays: 95,
      expectedYieldTonsPerHa: 45.0,
      recommendedSeedingRateKgHa: 26.0,
      notes: 'Corte en grano lechoso-masoso (32-35% materia seca) para silo bunker.'
    },
    {
      id: 3,
      name: 'Sorgo Forrajero',
      scientificName: 'Sorghum bicolor',
      category: 'FORAGE',
      standardCycleDays: 85,
      expectedYieldTonsPerHa: 38.0,
      recommendedSeedingRateKgHa: 15.0,
      notes: 'Excelente tolerancia al estrés hídrico y rebrote vigoroso.'
    },
    {
      id: 4,
      name: 'Alfalfa de Corte',
      scientificName: 'Medicago sativa',
      category: 'LEGUME',
      standardCycleDays: 32,
      expectedYieldTonsPerHa: 4.8,
      recommendedSeedingRateKgHa: 28.0,
      notes: 'Cortes cada 28-35 días. Alto valor proteico (18-22% PC).'
    },
    {
      id: 5,
      name: 'Avena Forrajera',
      scientificName: 'Avena sativa',
      category: 'FORAGE',
      standardCycleDays: 100,
      expectedYieldTonsPerHa: 28.0,
      recommendedSeedingRateKgHa: 90.0,
      notes: 'Cultivo de invierno-primavera ideal para heno de alta digestibilidad.'
    }
  ],
  plantings: [],
  harvests: [],
  machinery: [],
  machineryMaintenances: [],
  fuelLogs: [],
  supplies: [],
  supplyMovements: [],
  trades: []
};
