/**
 * Datos semilla realistas para el funcionamiento sin backend de Digital Cow.
 * Todos los catalogos globales, ranchos, animales, registros de salud,
 * reproduccion, produccion, alimentacion y finanzas precargados.
 */
import type { ServerlessDatabase } from './types';

export const INITIAL_SEED_DATA: ServerlessDatabase = {
  version: 1,
  accounts: [
    {
      id: 1,
      name: 'Rancho El Paraíso',
      slug: 'rancho-el-paraiso',
      status: 'ACTIVE',
      plan: 'PRO',
      defaultLocale: 'es',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z'
    }
  ],
  users: [
    {
      id: 1,
      accountId: 1,
      email: 'admin@digitalcow.local',
      fullName: 'Carlos Ganadero',
      role: 'OWNER',
      locale: 'es',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      email: 'veterinario@digitalcow.local',
      fullName: 'Dr. Luis Martínez (MVZ)',
      role: 'MANAGER',
      locale: 'es',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: '2025-01-10T00:00:00.000Z',
      updatedAt: '2025-01-10T00:00:00.000Z'
    },
    {
      id: 3,
      accountId: 1,
      email: 'operador@digitalcow.local',
      fullName: 'Pedro Morales',
      role: 'WORKER',
      locale: 'es',
      emailVerified: true,
      status: 'ACTIVE',
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z'
    }
  ],
  invitations: [],
  ranches: [
    {
      id: 1,
      accountId: 1,
      name: 'Rancho Santa Elena',
      location: 'Valle de Santiago, Guanajuato',
      latitude: 20.421,
      longitude: -101.192,
      areaHectares: 120,
      notes: 'Rancho principal con sala de ordeño y potreros de rotación',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      name: 'Hacienda San José',
      location: 'San Miguel de Allende, Gto.',
      latitude: 20.914,
      longitude: -100.743,
      areaHectares: 85,
      notes: 'Instalaciones de desarrollo de vaquillas y pastoreo',
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z'
    }
  ],
  lots: [
    {
      id: 1,
      ranchId: 1,
      name: 'Potrero Norte - Lecheras Altas',
      areaHectares: 30,
      notes: 'Pasto bermuda y rye grass con cerco eléctrico',
      polygon: null,
      centerLat: 20.422,
      centerLng: -101.191,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 2,
      ranchId: 1,
      name: 'Potrero Sur - Bajas y Secas',
      areaHectares: 35,
      notes: 'Descanso y suplementación de vacas próximas al secado',
      polygon: null,
      centerLat: 20.419,
      centerLng: -101.193,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 3,
      ranchId: 1,
      name: 'Maternidad y Cunas',
      areaHectares: 8,
      notes: 'Corrales techados para partos y crianza de becerros',
      polygon: null,
      centerLat: 20.420,
      centerLng: -101.190,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 4,
      ranchId: 2,
      name: 'Lote de Engorda y Pastoreo',
      areaHectares: 50,
      notes: 'Potrero abierto para ganado de carne',
      polygon: null,
      centerLat: 20.915,
      centerLng: -100.742,
      createdAt: '2025-01-16T00:00:00.000Z',
      updatedAt: '2025-01-16T00:00:00.000Z'
    }
  ],
  lotConditions: [
    {
      id: 1,
      lotId: 1,
      observedAt: '2026-09-18T08:00:00.000Z',
      kind: 'PASTURE_GOOD',
      severity: 1,
      notes: 'Aforo de forraje abundante tras lluvias de la semana pasada'
    },
    {
      id: 2,
      lotId: 1,
      observedAt: '2026-09-19T09:30:00.000Z',
      kind: 'WATER_OK',
      severity: 1,
      notes: 'Bebederos automáticos limpios y funcionando'
    },
    {
      id: 3,
      lotId: 2,
      observedAt: '2026-09-15T14:00:00.000Z',
      kind: 'MUD_LOW',
      severity: 2,
      notes: 'Lodo leve en el área de sombreadero'
    }
  ],
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
  photos: [
    {
      id: 1,
      animalId: 1,
      publicId: 'seed-cow-1',
      url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
      width: 800,
      height: 600,
      createdAt: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 2,
      animalId: 2,
      publicId: 'seed-cow-2',
      url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
      width: 800,
      height: 600,
      createdAt: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 3,
      animalId: 3,
      publicId: 'seed-cow-3',
      url: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
      width: 800,
      height: 600,
      createdAt: '2025-01-02T00:00:00.000Z'
    },
    {
      id: 4,
      animalId: 5,
      publicId: 'seed-bull-1',
      url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      width: 800,
      height: 600,
      createdAt: '2025-01-02T00:00:00.000Z'
    }
  ],
  animals: [
    {
      id: 1,
      accountId: 1,
      ranchId: 1,
      lotId: 1,
      internalTag: 'COW-001',
      officialTag: 'MX-0112-9901',
      rfid: '982000182746191',
      name: 'Mariposa',
      sex: 'FEMALE',
      birthDate: '2022-03-15',
      birthDateEstimated: false,
      breedId: 1, // Holstein
      purpose: 'DAIRY',
      status: 'ACTIVE',
      notes: 'Alta productora, 32L diarios promedio en su segunda lactancia',
      coverPhotoId: 1,
      coverPhotoUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
      shareToken: 'share-mariposa-demo-token-12345',
      createdByUserId: 1,
      createdAt: '2025-01-02T10:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      ranchId: 1,
      lotId: 1,
      internalTag: 'COW-002',
      officialTag: 'MX-0112-9902',
      rfid: '982000182746192',
      name: 'Esperanza',
      sex: 'FEMALE',
      birthDate: '2021-08-10',
      birthDateEstimated: false,
      breedId: 2, // Jersey
      purpose: 'DAIRY',
      status: 'ACTIVE',
      notes: 'Confirmada preñada con 180 días de gestación. Calidad de sólidos alta.',
      coverPhotoId: 2,
      coverPhotoUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80',
      shareToken: 'share-esperanza-demo-token-67890',
      createdByUserId: 1,
      createdAt: '2025-01-02T10:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z'
    },
    {
      id: 3,
      accountId: 1,
      ranchId: 1,
      lotId: 1,
      internalTag: 'COW-003',
      officialTag: 'MX-0112-9903',
      rfid: '982000182746193',
      name: 'Paloma',
      sex: 'FEMALE',
      birthDate: '2023-01-20',
      birthDateEstimated: false,
      breedId: 5, // Girolando
      purpose: 'DUAL',
      status: 'ACTIVE',
      notes: 'Excelente rusticidad y adaptación al calor',
      coverPhotoId: 3,
      coverPhotoUrl: 'https://images.unsplash.com/photo-1527153857715-3908f2ae5e81?auto=format&fit=crop&w=800&q=80',
      shareToken: 'share-paloma-demo-token-11223',
      createdByUserId: 1,
      createdAt: '2025-01-02T10:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z'
    },
    {
      id: 4,
      accountId: 1,
      ranchId: 1,
      lotId: 2,
      internalTag: 'COW-004',
      officialTag: 'MX-0112-9904',
      rfid: '982000182746194',
      name: 'Negrita',
      sex: 'FEMALE',
      birthDate: '2022-11-05',
      birthDateEstimated: false,
      breedId: 6, // Angus
      purpose: 'BEEF',
      status: 'ACTIVE',
      notes: 'Buena ganancia de peso diaria',
      coverPhotoId: null,
      coverPhotoUrl: null,
      shareToken: 'share-negrita-demo-token-44556',
      createdByUserId: 1,
      createdAt: '2025-01-02T10:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z'
    },
    {
      id: 5,
      accountId: 1,
      ranchId: 2,
      lotId: 4,
      internalTag: 'BULL-001',
      officialTag: 'MX-0112-9905',
      rfid: '982000182746195',
      name: 'El Sultán',
      sex: 'MALE',
      birthDate: '2020-05-12',
      birthDateEstimated: false,
      breedId: 9, // Brahman
      purpose: 'BEEF',
      status: 'ACTIVE',
      notes: 'Semental reproductor con registro genealógico',
      coverPhotoId: 4,
      coverPhotoUrl: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
      shareToken: 'share-sultan-demo-token-99887',
      createdByUserId: 1,
      createdAt: '2025-01-02T10:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z'
    },
    {
      id: 6,
      accountId: 1,
      ranchId: 1,
      lotId: 3,
      internalTag: 'CALF-001',
      officialTag: 'MX-0112-9906',
      rfid: '982000182746196',
      name: 'Lucero',
      sex: 'FEMALE',
      birthDate: '2026-01-14',
      birthDateEstimated: false,
      breedId: 1, // Holstein
      purpose: 'DAIRY',
      status: 'ACTIVE',
      notes: 'Hija de Mariposa, en desarrollo con lacto-reemplazador',
      coverPhotoId: null,
      coverPhotoUrl: null,
      shareToken: 'share-lucero-demo-token-33221',
      createdByUserId: 1,
      createdAt: '2026-01-14T10:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z'
    },
    {
      id: 7,
      accountId: 1,
      ranchId: 1,
      lotId: 2,
      internalTag: 'COW-005',
      officialTag: 'MX-0112-9907',
      rfid: '982000182746197',
      name: 'Canela',
      sex: 'FEMALE',
      birthDate: '2022-06-14',
      birthDateEstimated: false,
      breedId: 3, // Pardo Suizo
      purpose: 'DAIRY',
      status: 'ACTIVE',
      notes: 'Vaca de segundo parto, próxima a período seco',
      coverPhotoId: null,
      coverPhotoUrl: null,
      shareToken: 'share-canela-demo-token-77889',
      createdByUserId: 1,
      createdAt: '2025-01-02T10:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z'
    },
    {
      id: 8,
      accountId: 1,
      ranchId: 2,
      lotId: 4,
      internalTag: 'COW-006',
      officialTag: 'MX-0112-9908',
      rfid: '982000182746198',
      name: 'Estrella',
      sex: 'FEMALE',
      birthDate: '2021-09-30',
      birthDateEstimated: false,
      breedId: 12, // Simmental
      purpose: 'DUAL',
      status: 'ACTIVE',
      notes: 'Doble propósito con excelente cría al pie',
      coverPhotoId: null,
      coverPhotoUrl: null,
      shareToken: 'share-estrella-demo-token-55443',
      createdByUserId: 1,
      createdAt: '2025-01-02T10:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z'
    },
    {
      id: 9,
      accountId: 1,
      ranchId: 2,
      lotId: 4,
      internalTag: 'COW-007',
      officialTag: 'MX-0112-9909',
      rfid: '982000182746199',
      name: 'Princesa',
      sex: 'FEMALE',
      birthDate: '2020-01-15',
      birthDateEstimated: false,
      breedId: 10, // Brangus
      purpose: 'BEEF',
      status: 'SOLD',
      notes: 'Vendida a ganadería vecina en junio',
      coverPhotoId: null,
      coverPhotoUrl: null,
      shareToken: 'share-princesa-demo-token-00112',
      createdByUserId: 1,
      createdAt: '2025-01-02T10:00:00.000Z',
      updatedAt: '2026-06-20T10:00:00.000Z'
    }
  ],
  vaccinations: [
    {
      id: 1,
      accountId: 1,
      animalId: 1,
      vaccineId: 1, // Brucella RB51
      appliedAt: '2025-04-10',
      doseMl: 2.0,
      batchNumber: 'BRU-2025-A',
      cost: 45.0,
      notes: 'Vacunación reglamentaria de becerra',
      performedByUserId: 2,
      createdAt: '2025-04-10T12:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      animalId: 1,
      vaccineId: 2, // IBR/BVD
      appliedAt: '2026-03-12',
      doseMl: 5.0,
      batchNumber: 'BSH-901',
      cost: 65.0,
      notes: 'Refuerzo anual reproductivo',
      performedByUserId: 2,
      createdAt: '2026-03-12T12:00:00.000Z'
    },
    {
      id: 3,
      accountId: 1,
      animalId: 2,
      vaccineId: 4, // Carbón sintomático
      appliedAt: '2026-02-05',
      doseMl: 5.0,
      batchNumber: 'CLOST-44',
      cost: 38.0,
      notes: 'Prevención clostridiosis pre-parto',
      performedByUserId: 2,
      createdAt: '2026-02-05T12:00:00.000Z'
    },
    {
      id: 4,
      accountId: 1,
      animalId: 3,
      vaccineId: 2, // IBR
      appliedAt: '2026-05-18',
      doseMl: 5.0,
      batchNumber: 'BSH-902',
      cost: 65.0,
      notes: 'Vacuna anual en lote',
      performedByUserId: 2,
      createdAt: '2026-05-18T12:00:00.000Z'
    }
  ],
  diagnoses: [
    {
      id: 1,
      accountId: 1,
      animalId: 1,
      diseaseId: 1, // Mastitis
      diagnosedAt: '2026-08-01',
      severity: 'MILD',
      status: 'RESOLVED',
      symptoms: 'Prueba California CMT (+) en cuarto posterior derecho',
      notes: 'Tratado oportunamente con Ceftiofur intramamario',
      resolvedAt: '2026-08-06',
      diagnosedByUserId: 2,
      createdAt: '2026-08-01T08:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      animalId: 4,
      diseaseId: 4, // Cojera
      diagnosedAt: '2026-09-10',
      severity: 'MODERATE',
      status: 'ACTIVE',
      symptoms: 'Claudicación en pata trasera izquierda, inflamación interdigital',
      notes: 'Se aplicó vendaje y antibiótico local',
      resolvedAt: null,
      diagnosedByUserId: 2,
      createdAt: '2026-09-10T09:00:00.000Z'
    }
  ],
  treatments: [
    {
      id: 1,
      accountId: 1,
      animalId: 1,
      diagnosisId: 1,
      medicationId: 6, // Ceftiofur
      startedAt: '2026-08-01',
      endedAt: '2026-08-05',
      dose: '10 ml',
      frequency: 'Cada 24 horas',
      route: 'SC',
      cost: 120.0,
      notes: 'Completó los 5 días de antibiótico satisfactoriamente',
      withdrawalMilkUntil: '2026-08-05',
      withdrawalMeatUntil: '2026-08-09',
      createdAt: '2026-08-01T08:30:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      animalId: 4,
      diagnosisId: 2,
      medicationId: 1, // Oxitetraciclina
      startedAt: '2026-09-10',
      endedAt: null,
      dose: '20 ml',
      frequency: 'Dosis única LA',
      route: 'IM',
      cost: 95.0,
      notes: 'Tratamiento de gabarro en curso',
      withdrawalMilkUntil: '2026-09-17',
      withdrawalMeatUntil: '2026-10-08',
      createdAt: '2026-09-10T09:30:00.000Z'
    }
  ],
  pestControls: [
    {
      id: 1,
      accountId: 1,
      ranchId: 1,
      lotId: 1,
      pestId: 1, // Garrapata
      appliedAt: '2026-08-15',
      method: 'Baño de aspersión con amitraz',
      productName: 'Taktic 12.5%',
      cost: 450.0,
      notes: 'Control general en lote lechero',
      createdAt: '2026-08-15T10:00:00.000Z'
    }
  ],
  vetVisits: [
    {
      id: 1,
      accountId: 1,
      ranchId: 1,
      visitedAt: '2026-09-05',
      vetName: 'Dr. Luis Martínez',
      vetClinic: 'Servicios Veterinarios del Bajío',
      reason: 'Diagnóstico de gestación mensual por ultrasonido y revisión de cuartos',
      diagnosisNotes: '3 vacas confirmadas preñadas, 1 sospechosa para rechequeo en 21 días',
      cost: 1500.0,
      createdAt: '2026-09-05T16:00:00.000Z'
    }
  ],
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
  animalHealthPlans: [
    { id: 1, healthPlanId: 1, animalId: 1, lotId: null, assignedAt: '2025-01-10T00:00:00.000Z' },
    { id: 2, healthPlanId: 1, animalId: 2, lotId: null, assignedAt: '2025-01-10T00:00:00.000Z' }
  ],
  weighings: [
    { id: 1, accountId: 1, animalId: 1, weighedAt: '2026-04-10', weightKg: 580, notes: 'Pesaje inicio lactancia', createdAt: '2026-04-10T08:00:00.000Z' },
    { id: 2, accountId: 1, animalId: 1, weighedAt: '2026-06-15', weightKg: 595, notes: 'Pesaje control', createdAt: '2026-06-15T08:00:00.000Z' },
    { id: 3, accountId: 1, animalId: 1, weighedAt: '2026-08-20', weightKg: 610, notes: 'Excelente condición corporal', createdAt: '2026-08-20T08:00:00.000Z' },
    { id: 4, accountId: 1, animalId: 2, weighedAt: '2026-05-12', weightKg: 430, notes: 'Jersey en buena condición', createdAt: '2026-05-12T08:00:00.000Z' },
    { id: 5, accountId: 1, animalId: 2, weighedAt: '2026-08-12', weightKg: 450, notes: 'Ganancia por gestación', createdAt: '2026-08-12T08:00:00.000Z' },
    { id: 6, accountId: 1, animalId: 4, weighedAt: '2026-07-01', weightKg: 490, notes: 'Angus engorda', createdAt: '2026-07-01T08:00:00.000Z' },
    { id: 7, accountId: 1, animalId: 4, weighedAt: '2026-09-01', weightKg: 535, notes: 'GDP 0.73 kg/día', createdAt: '2026-09-01T08:00:00.000Z' },
    { id: 8, accountId: 1, animalId: 6, weighedAt: '2026-01-14', weightKg: 38, notes: 'Peso al nacimiento', createdAt: '2026-01-14T08:00:00.000Z' },
    { id: 9, accountId: 1, animalId: 6, weighedAt: '2026-05-14', weightKg: 135, notes: 'Destete de leche', createdAt: '2026-05-14T08:00:00.000Z' },
    { id: 10, accountId: 1, animalId: 6, weighedAt: '2026-09-14', weightKg: 215, notes: 'Desarrollo en potrero', createdAt: '2026-09-14T08:00:00.000Z' }
  ],
  milkings: [
    { id: 1, accountId: 1, animalId: 1, milkedAt: '2026-09-18T06:30:00.000Z', liters: 18.5, shift: 'MORNING', notes: 'Ordeño matutino', createdAt: '2026-09-18T07:00:00.000Z' },
    { id: 2, accountId: 1, animalId: 1, milkedAt: '2026-09-18T17:00:00.000Z', liters: 14.0, shift: 'AFTERNOON', notes: 'Ordeño vespertino', createdAt: '2026-09-18T17:30:00.000Z' },
    { id: 3, accountId: 1, animalId: 1, milkedAt: '2026-09-19T06:30:00.000Z', liters: 19.0, shift: 'MORNING', notes: null, createdAt: '2026-09-19T07:00:00.000Z' },
    { id: 4, accountId: 1, animalId: 1, milkedAt: '2026-09-19T17:00:00.000Z', liters: 14.5, shift: 'AFTERNOON', notes: null, createdAt: '2026-09-19T17:30:00.000Z' },
    { id: 5, accountId: 1, animalId: 1, milkedAt: '2026-09-20T06:30:00.000Z', liters: 18.0, shift: 'MORNING', notes: 'Hoy', createdAt: '2026-09-20T07:00:00.000Z' },
    { id: 6, accountId: 1, animalId: 2, milkedAt: '2026-09-18T06:45:00.000Z', liters: 12.0, shift: 'MORNING', notes: null, createdAt: '2026-09-18T07:00:00.000Z' },
    { id: 7, accountId: 1, animalId: 2, milkedAt: '2026-09-18T17:15:00.000Z', liters: 9.5, shift: 'AFTERNOON', notes: null, createdAt: '2026-09-18T17:30:00.000Z' },
    { id: 8, accountId: 1, animalId: 2, milkedAt: '2026-09-19T06:45:00.000Z', liters: 12.5, shift: 'MORNING', notes: null, createdAt: '2026-09-19T07:00:00.000Z' },
    { id: 9, accountId: 1, animalId: 2, milkedAt: '2026-09-19T17:15:00.000Z', liters: 9.0, shift: 'AFTERNOON', notes: null, createdAt: '2026-09-19T17:30:00.000Z' },
    { id: 10, accountId: 1, animalId: 2, milkedAt: '2026-09-20T06:45:00.000Z', liters: 11.5, shift: 'MORNING', notes: null, createdAt: '2026-09-20T07:00:00.000Z' },
    { id: 11, accountId: 1, animalId: 3, milkedAt: '2026-09-20T07:00:00.000Z', liters: 14.0, shift: 'MORNING', notes: null, createdAt: '2026-09-20T07:15:00.000Z' }
  ],
  milkSamples: [
    {
      id: 1,
      accountId: 1,
      animalId: 1,
      sampledAt: '2026-09-10',
      fatPercentage: 3.75,
      proteinPercentage: 3.25,
      somaticCellCount: 140000,
      notes: 'Excelente calidad higiénica y sólidos',
      createdAt: '2026-09-10T12:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      animalId: 2,
      sampledAt: '2026-09-10',
      fatPercentage: 4.85,
      proteinPercentage: 3.80,
      somaticCellCount: 95000,
      notes: 'Típico Jersey de alta grasa',
      createdAt: '2026-09-10T12:00:00.000Z'
    }
  ],
  bulkTankDeliveries: [
    {
      id: 1,
      accountId: 1,
      ranchId: 1,
      deliveredAt: '2026-09-18T10:00:00.000Z',
      liters: 1250,
      buyerName: 'Lácteos del Bajío S.A.',
      temperatureCelsius: 3.5,
      pricePerLiter: 10.50,
      notes: 'Pipa recolectora número 4',
      createdAt: '2026-09-18T10:30:00.000Z'
    }
  ],
  slaughters: [],
  bulls: [
    {
      id: 1,
      accountId: 1,
      internalTag: 'BULL-001',
      officialTag: 'MX-0112-9905',
      name: 'El Sultán',
      breedId: 9, // Brahman
      status: 'ACTIVE',
      notes: 'Semental activo para monta natural en potrero de carne',
      createdAt: '2025-01-02T10:00:00.000Z'
    }
  ],
  semenStraws: [
    {
      id: 1,
      accountId: 1,
      bullId: null,
      bullCode: 'HO-ALTA-SPRING',
      bullName: 'AltaSpring 11HO11437',
      breedId: 1, // Holstein
      tankCanister: 'Termo 1 / Canastilla B',
      availableQuantity: 18,
      costPerStraw: 450.0,
      notes: 'Semen sexado hembra, alta leche y ubres',
      createdAt: '2025-01-10T10:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      bullId: null,
      bullCode: 'JE-SELECT-CHROME',
      bullName: 'River Valley Cece Chrome',
      breedId: 2, // Jersey
      tankCanister: 'Termo 1 / Canastilla C',
      availableQuantity: 12,
      costPerStraw: 380.0,
      notes: 'Excelente índice de sólidos y fertilidad',
      createdAt: '2025-01-10T10:00:00.000Z'
    }
  ],
  heats: [
    {
      id: 1,
      accountId: 1,
      animalId: 1,
      detectedAt: '2026-03-25T07:00:00.000Z',
      intensity: 'HIGH',
      notes: 'Aceptó monta franca en la mañana',
      detectedByUserId: 3,
      createdAt: '2026-03-25T07:30:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      animalId: 2,
      detectedAt: '2026-03-10T08:00:00.000Z',
      intensity: 'HIGH',
      notes: 'Celo manifiesto',
      detectedByUserId: 3,
      createdAt: '2026-03-10T08:30:00.000Z'
    }
  ],
  services: [
    {
      id: 1,
      accountId: 1,
      animalId: 1,
      serviceType: 'AI',
      serviceDate: '2026-03-25',
      semenStrawId: 1,
      technicianName: 'MVZ Luis Martínez',
      heatId: 1,
      cost: 550.0,
      notes: 'Inseminación a las 18 hrs post-detección',
      createdByUserId: 2,
      createdAt: '2026-03-25T18:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      animalId: 2,
      serviceType: 'AI',
      serviceDate: '2026-03-10',
      semenStrawId: 2,
      technicianName: 'MVZ Luis Martínez',
      heatId: 2,
      cost: 480.0,
      notes: 'Inseminación con pajuela Jersey',
      createdByUserId: 2,
      createdAt: '2026-03-10T17:00:00.000Z'
    }
  ],
  pregnancyChecks: [
    {
      id: 1,
      accountId: 1,
      animalId: 1,
      serviceId: 1,
      checkedAt: '2026-05-10',
      method: 'ULTRASOUND',
      result: 'POSITIVE',
      estimatedGestationDays: 46,
      estimatedCalvingDate: '2027-01-01',
      vetVisitId: null,
      checkedByUserId: 2,
      notes: 'Vesícula embrionaria normal con latido cardíaco visible',
      createdAt: '2026-05-10T10:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      animalId: 2,
      serviceId: 2,
      checkedAt: '2026-04-28',
      method: 'ULTRASOUND',
      result: 'POSITIVE',
      estimatedGestationDays: 49,
      estimatedCalvingDate: '2026-12-15',
      vetVisitId: null,
      checkedByUserId: 2,
      notes: 'Preñez confirmada',
      createdAt: '2026-04-28T11:00:00.000Z'
    }
  ],
  calvings: [
    {
      id: 1,
      accountId: 1,
      motherId: 1,
      calvingDate: '2026-01-14',
      ease: 'NORMAL',
      calvesCount: 1,
      calfSex: 'FEMALE',
      calfStatus: 'ALIVE',
      calfInternalTag: 'CALF-001',
      notes: 'Parto distócico ligero pero expulsión espontánea. Nació becerra sana Lucero.',
      createdAt: '2026-01-14T09:00:00.000Z'
    }
  ],
  abortions: [],
  weanings: [
    {
      id: 1,
      accountId: 1,
      animalId: 6,
      weanedAt: '2026-05-14',
      weightKg: 135,
      notes: 'Destete con alimento de iniciación a los 4 meses',
      createdAt: '2026-05-14T10:00:00.000Z'
    }
  ],
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
      createdAt: '2025-01-05T00:00:00.000Z'
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
      createdAt: '2025-01-05T00:00:00.000Z'
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
      createdAt: '2025-01-05T00:00:00.000Z'
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
      createdAt: '2025-01-05T00:00:00.000Z'
    }
  ],
  feedingPlans: [
    {
      id: 1,
      accountId: 1,
      name: 'Ración Vacas Altas Productores (>25L)',
      category: 'DAIRY_LACTATION',
      description: 'Dieta alta en energía y proteína sobrepasante',
      createdAt: '2025-01-10T00:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      name: 'Ración de Mantenimiento y Pastoreo',
      category: 'BEEF_GROWING',
      description: 'Suplemento complementario al pastoreo',
      createdAt: '2025-01-10T00:00:00.000Z'
    }
  ],
  feedingPlanItems: [
    { id: 1, feedingPlanId: 1, feedItemId: 1, kgPerHeadDay: 22.0, notes: 'Silo base' },
    { id: 2, feedingPlanId: 1, feedItemId: 2, kgPerHeadDay: 8.5, notes: 'Concentrado en sala' },
    { id: 3, feedingPlanId: 1, feedItemId: 3, kgPerHeadDay: 4.0, notes: 'Alfalfa fibra efectiva' },
    { id: 4, feedingPlanId: 1, feedItemId: 4, kgPerHeadDay: 0.15, notes: 'Minerales en comedero' }
  ],
  lotFeedingPlans: [
    { id: 1, lotId: 1, feedingPlanId: 1, assignedAt: '2025-01-10T00:00:00.000Z', unassignedAt: null }
  ],
  feedingRecords: [
    {
      id: 1,
      accountId: 1,
      fedAt: '2026-09-18',
      lotId: 1,
      animalId: null,
      feedItemId: 1,
      totalKgFed: 550,
      headCount: 25,
      totalCost: 990.0,
      notes: 'Silo matutino mezclado en carro unifeed',
      createdAt: '2026-09-18T08:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      fedAt: '2026-09-18',
      lotId: 1,
      animalId: null,
      feedItemId: 2,
      totalKgFed: 210,
      headCount: 25,
      totalCost: 1575.0,
      notes: 'Concentrado diario del lote',
      createdAt: '2026-09-18T08:00:00.000Z'
    },
    {
      id: 3,
      accountId: 1,
      fedAt: '2026-09-19',
      lotId: 1,
      animalId: null,
      feedItemId: 1,
      totalKgFed: 550,
      headCount: 25,
      totalCost: 990.0,
      notes: 'Ración servida a tiempo',
      createdAt: '2026-09-19T08:00:00.000Z'
    }
  ],
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
  expenses: [
    {
      id: 1,
      accountId: 1,
      expenseCategoryId: 1,
      incurredAt: '2026-09-02',
      amount: 15400.0,
      currency: 'MXN',
      ranchId: 1,
      lotId: 1,
      animalId: null,
      description: 'Compra de 2 toneladas de concentrado lechero 18%',
      vendor: 'Nutrición Animal del Centro',
      invoiceNumber: 'FAC-8891',
      createdByUserId: 1,
      createdAt: '2026-09-02T10:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      expenseCategoryId: 2,
      incurredAt: '2026-09-05',
      amount: 1850.0,
      currency: 'MXN',
      ranchId: 1,
      lotId: null,
      animalId: 4,
      description: 'Medicamento para tratamiento de gabarro y analgésico',
      vendor: 'Farmacia Veterinaria San Antonio',
      invoiceNumber: 'TC-552',
      createdByUserId: 2,
      createdAt: '2026-09-05T12:00:00.000Z'
    },
    {
      id: 3,
      accountId: 1,
      expenseCategoryId: 4,
      incurredAt: '2026-09-15',
      amount: 12000.0,
      currency: 'MXN',
      ranchId: 1,
      lotId: null,
      animalId: null,
      description: 'Pago de nómina quincenal personal de campo',
      vendor: 'Nómina interna',
      invoiceNumber: 'NOM-2026-17',
      createdByUserId: 1,
      createdAt: '2026-09-15T18:00:00.000Z'
    },
    {
      id: 4,
      accountId: 1,
      expenseCategoryId: 3,
      incurredAt: '2026-09-05',
      amount: 1500.0,
      currency: 'MXN',
      ranchId: 1,
      lotId: null,
      animalId: null,
      description: 'Visita mensual del MVZ y ultrasonidos',
      vendor: 'Servicios Veterinarios del Bajío',
      invoiceNumber: 'HON-114',
      createdByUserId: 1,
      createdAt: '2026-09-05T16:00:00.000Z'
    },
    {
      id: 5,
      accountId: 1,
      expenseCategoryId: 7,
      incurredAt: '2026-09-10',
      amount: 4200.0,
      currency: 'MXN',
      ranchId: 1,
      lotId: null,
      animalId: null,
      description: 'Diesel para tractor y picadora de forraje',
      vendor: 'Gasolinera El Crucero',
      invoiceNumber: 'DSL-9921',
      createdByUserId: 1,
      createdAt: '2026-09-10T14:00:00.000Z'
    }
  ],
  incomes: [
    {
      id: 1,
      accountId: 1,
      incomeCategoryId: 1,
      receivedAt: '2026-09-08',
      amount: 28500.0,
      currency: 'MXN',
      ranchId: 1,
      lotId: null,
      animalId: null,
      description: 'Liquidación semanal de leche (2,714 litros)',
      payer: 'Lácteos del Bajío S.A.',
      invoiceNumber: 'LIQ-4482',
      createdByUserId: 1,
      createdAt: '2026-09-08T11:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      incomeCategoryId: 1,
      receivedAt: '2026-09-15',
      amount: 29800.0,
      currency: 'MXN',
      ranchId: 1,
      lotId: null,
      animalId: null,
      description: 'Liquidación semanal de leche (2,838 litros)',
      payer: 'Lácteos del Bajío S.A.',
      invoiceNumber: 'LIQ-4495',
      createdByUserId: 1,
      createdAt: '2026-09-15T11:00:00.000Z'
    },
    {
      id: 3,
      accountId: 1,
      incomeCategoryId: 2,
      receivedAt: '2026-06-20',
      amount: 24000.0,
      currency: 'MXN',
      ranchId: 2,
      lotId: null,
      animalId: 9, // Vaca Princesa
      description: 'Venta de vaca Brangus COW-007',
      payer: 'Don Alberto Fuentes',
      invoiceNumber: 'VTA-0019',
      createdByUserId: 1,
      createdAt: '2026-06-20T12:00:00.000Z'
    }
  ],
  animalSales: [
    {
      id: 1,
      accountId: 1,
      animalId: 9,
      soldAt: '2026-06-20',
      totalPrice: 24000.0,
      currency: 'MXN',
      weightKg: 480,
      pricePerKg: 50.0,
      buyer: 'Don Alberto Fuentes',
      destination: 'BREEDING_FARM',
      incomeCategoryId: 2,
      notes: 'Venta para pie de cría en rancho vecino',
      createdAt: '2026-06-20T12:00:00.000Z'
    }
  ],
  milkSales: [
    {
      id: 1,
      accountId: 1,
      ranchId: 1,
      soldAt: '2026-09-08',
      liters: 2714,
      pricePerLiter: 10.50,
      totalAmount: 28497.0,
      currency: 'MXN',
      buyer: 'Lácteos del Bajío S.A.',
      incomeCategoryId: 1,
      notes: 'Calidad Grado A con bonificación por grasa',
      createdAt: '2026-09-08T11:00:00.000Z'
    },
    {
      id: 2,
      accountId: 1,
      ranchId: 1,
      soldAt: '2026-09-15',
      liters: 2838,
      pricePerLiter: 10.50,
      totalAmount: 29799.0,
      currency: 'MXN',
      buyer: 'Lácteos del Bajío S.A.',
      incomeCategoryId: 1,
      notes: 'Semana 37',
      createdAt: '2026-09-15T11:00:00.000Z'
    }
  ]
};
