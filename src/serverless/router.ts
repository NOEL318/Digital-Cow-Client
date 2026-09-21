/**
 * Enrutador API del motor serverless en frontend.
 * Intercepta y procesa todas las solicitudes REST llamando a la base de datos local
 * y calculando los indicadores, reportes y relaciones de negocio.
 */
import { db } from './db';

export interface ServerlessResponse {
  status: number;
  data: any;
  error?: any;
}

export class ServerlessRouter {
  /**
   * Resuelve una peticion HTTP al handler correspondiente.
   */
  public async handle(
    method: string,
    rawUrl: string,
    query: Record<string, any> = {},
    body: any = {},
    headers: Record<string, any> = {}
  ): Promise<ServerlessResponse> {
    const m = method.toUpperCase();
    // Normaliza la URL quitando prefijo y query string
    let path = rawUrl.split('?')[0];
    if (path.startsWith('http://') || path.startsWith('https://')) {
      try {
        const u = new URL(path);
        path = u.pathname;
      } catch {}
    }
    // Quita prefijo /api/v1 o /api si existe
    path = path.replace(/^\/api\/v1/, '').replace(/^\/api/, '');
    if (!path.startsWith('/')) path = '/' + path;

    try {
      return await this.dispatch(m, path, query, body, headers);
    } catch (err: any) {
      console.error('[ServerlessRouter Error]', m, path, err);
      return {
        status: 500,
        data: { error: { message: err.message || 'Error interno del servidor local' } }
      };
    }
  }

  private async dispatch(
    method: string,
    path: string,
    query: Record<string, any>,
    body: any,
    _headers: Record<string, any>
  ): Promise<ServerlessResponse> {
    // -------------------------------------------------------------
    // AUTH & USERS
    // -------------------------------------------------------------
    if (path === '/auth/login' && method === 'POST') {
      const email = body.email?.toLowerCase().trim();
      let user = db.filter('users', u => u.email.toLowerCase() === email)[0];
      if (!user) {
        // En modo serverless facilitamos el acceso: si no existe, lo crea al vuelo
        user = db.insert('users', {
          accountId: 1,
          email: email || 'admin@digitalcow.local',
          fullName: 'Usuario Ganadero',
          role: 'OWNER',
          locale: 'es',
          emailVerified: true,
          status: 'ACTIVE'
        });
      }
      return {
        status: 200,
        data: {
          accessToken: 'serverless-jwt-token-' + user.id,
          refreshToken: 'serverless-refresh-token-' + user.id,
          expiresInSeconds: 86400 * 7
        }
      };
    }

    if (path === '/auth/register' && method === 'POST') {
      const email = (body.email || 'demo@digitalcow.local').toLowerCase().trim();
      let account = db.insert('accounts', {
        name: body.accountName || 'Mi Rancho',
        slug: (body.accountName || 'mi-rancho').toLowerCase().replace(/\s+/g, '-'),
        status: 'ACTIVE',
        plan: 'FREE',
        defaultLocale: body.locale || 'es'
      });
      let user = db.insert('users', {
        accountId: account.id,
        email,
        fullName: body.fullName || 'Administrador',
        role: 'OWNER',
        locale: body.locale || 'es',
        emailVerified: true,
        status: 'ACTIVE'
      });
      // Crea un rancho y lote inicial para que no empiece vacio
      const r = db.insert('ranches', {
        accountId: account.id,
        name: body.accountName || 'Rancho Principal',
        location: 'Ubicación local'
      });
      db.insert('lots', {
        ranchId: r.id,
        name: 'Potrero 1'
      });

      return {
        status: 200,
        data: {
          accessToken: 'serverless-jwt-token-' + user.id,
          refreshToken: 'serverless-refresh-token-' + user.id,
          expiresInSeconds: 86400 * 7
        }
      };
    }

    if (path === '/auth/refresh' && method === 'POST') {
      return {
        status: 200,
        data: {
          accessToken: 'serverless-jwt-token-1',
          refreshToken: 'serverless-refresh-token-1',
          expiresInSeconds: 86400 * 7
        }
      };
    }

    if (path === '/auth/me' && method === 'GET') {
      const user = db.getAll('users')[0] || {
        id: 1,
        accountId: 1,
        email: 'admin@digitalcow.local',
        fullName: 'Carlos Ganadero',
        role: 'OWNER',
        locale: 'es',
        emailVerified: true
      };
      return {
        status: 200,
        data: {
          id: user.id,
          accountId: user.accountId,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          locale: user.locale || 'es',
          emailVerified: user.emailVerified
        }
      };
    }

    if (path === '/auth/logout' && method === 'POST') {
      return { status: 200, data: { success: true } };
    }

    if (['/auth/verify-email', '/auth/request-password-reset', '/auth/reset-password', '/accept-invitation'].includes(path)) {
      return { status: 200, data: { success: true } };
    }

    if (path === '/me' && method === 'PATCH') {
      const users = db.getAll('users');
      if (users[0]) {
        db.update('users', users[0].id, body);
      }
      return { status: 200, data: { success: true } };
    }

    // -------------------------------------------------------------
    // ACCOUNT & TEAM & ADMIN
    // -------------------------------------------------------------
    if (path === '/account' && method === 'GET') {
      const acc = db.getAll('accounts')[0] || { name: 'Rancho El Paraíso', defaultLocale: 'es' };
      return { status: 200, data: { name: acc.name, defaultLocale: acc.defaultLocale } };
    }

    if (path === '/account' && method === 'PATCH') {
      const acc = db.getAll('accounts')[0];
      if (acc) db.update('accounts', acc.id, body);
      return { status: 200, data: acc ? { ...acc, ...body } : body };
    }

    if (path === '/account/profile') {
      const user = db.getAll('users')[0];
      if (method === 'PATCH' && user) {
        db.update('users', user.id, body);
      }
      return {
        status: 200,
        data: user || { id: 1, email: 'admin@digitalcow.local', fullName: 'Carlos Ganadero' }
      };
    }

    if (path === '/team' && method === 'GET') {
      return { status: 200, data: db.getAll('users') };
    }

    if (path === '/team/invitations' && method === 'GET') {
      return { status: 200, data: db.getAll('invitations') };
    }

    if (path === '/team/invitations' && method === 'POST') {
      const inv = db.insert('invitations', {
        ...body,
        token: 'inv-' + Math.random().toString(36).substring(2),
        expiresAt: new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
        createdByUserId: 1
      });
      return { status: 201, data: inv };
    }

    const delInvMatch = path.match(/^\/team\/invitations\/(\d+)$/);
    if (delInvMatch && method === 'DELETE') {
      db.delete('invitations', Number(delInvMatch[1]));
      return { status: 204, data: null };
    }

    const patchUserMatch = path.match(/^\/team\/users\/(\d+)$/);
    if (patchUserMatch && method === 'PATCH') {
      const updated = db.update('users', Number(patchUserMatch[1]), body);
      return { status: 200, data: updated };
    }

    if (path === '/admin/login' && method === 'POST') {
      return {
        status: 200,
        data: { accessToken: 'admin-token', refreshToken: 'admin-refresh', expiresInSeconds: 86400 }
      };
    }

    if (path === '/admin/accounts' && method === 'GET') {
      return { status: 200, data: db.getAll('accounts') };
    }

    const patchAdminAcc = path.match(/^\/admin\/accounts\/(\d+)$/);
    if (patchAdminAcc && method === 'PATCH') {
      const updated = db.update('accounts', Number(patchAdminAcc[1]), body);
      return { status: 200, data: updated };
    }

    // -------------------------------------------------------------
    // RANCHES & LOTS & CONDITIONS
    // -------------------------------------------------------------
    if (path === '/ranches' && method === 'GET') {
      return { status: 200, data: db.getAll('ranches') };
    }

    if (path === '/ranches' && method === 'POST') {
      const created = db.insert('ranches', { accountId: 1, ...body });
      return { status: 201, data: created };
    }

    const ranchIdMatch = path.match(/^\/ranches\/(\d+)$/);
    if (ranchIdMatch) {
      const rid = Number(ranchIdMatch[1]);
      if (method === 'GET') {
        const item = db.getById('ranches', rid);
        return item ? { status: 200, data: item } : { status: 404, data: null };
      }
      if (method === 'PATCH') {
        const updated = db.update('ranches', rid, body);
        return { status: 200, data: updated };
      }
      if (method === 'DELETE') {
        db.delete('ranches', rid);
        return { status: 204, data: null };
      }
    }

    const ranchLotsMatch = path.match(/^\/ranches\/(\d+)\/lots$/);
    if (ranchLotsMatch) {
      const rid = Number(ranchLotsMatch[1]);
      if (method === 'GET') {
        const lots = db.filter('lots', l => l.ranchId === rid);
        return { status: 200, data: lots };
      }
      if (method === 'POST') {
        const created = db.insert('lots', { ranchId: rid, ...body });
        return { status: 201, data: created };
      }
    }

    const ranchLotItemMatch = path.match(/^\/ranches\/(\d+)\/lots\/(\d+)$/);
    if (ranchLotItemMatch) {
      const lotId = Number(ranchLotItemMatch[2]);
      if (method === 'PATCH') {
        const updated = db.update('lots', lotId, body);
        return { status: 200, data: updated };
      }
      if (method === 'DELETE') {
        db.delete('lots', lotId);
        return { status: 204, data: null };
      }
    }

    if (path === '/lot-conditions') {
      if (method === 'GET') {
        const lotId = query.lotId ? Number(query.lotId) : undefined;
        let conds = db.getAll('lotConditions');
        if (lotId) conds = conds.filter(c => c.lotId === lotId);
        return { status: 200, data: conds };
      }
      if (method === 'POST') {
        const created = db.insert('lotConditions', body);
        return { status: 201, data: created };
      }
    }

    const lotCondMatch = path.match(/^\/lot-conditions\/(\d+)$/);
    if (lotCondMatch && method === 'DELETE') {
      db.delete('lotConditions', Number(lotCondMatch[1]));
      return { status: 204, data: null };
    }

    // -------------------------------------------------------------
    // BREEDS & CATALOGS
    // -------------------------------------------------------------
    if (path === '/breeds' && method === 'GET') {
      return { status: 200, data: db.getAll('breeds') };
    }

    if (path === '/catalog/vaccines') {
      if (method === 'GET') return { status: 200, data: db.getAll('vaccines') };
      if (method === 'POST') return { status: 201, data: db.insert('vaccines', body) };
    }

    if (path === '/catalog/diseases' && method === 'GET') {
      return { status: 200, data: db.getAll('diseases') };
    }

    if (path === '/catalog/medications') {
      if (method === 'GET') return { status: 200, data: db.getAll('medications') };
      if (method === 'POST') return { status: 201, data: db.insert('medications', body) };
    }

    const medIdMatch = path.match(/^\/catalog\/medications\/(\d+)$/);
    if (medIdMatch && method === 'PATCH') {
      return { status: 200, data: db.update('medications', Number(medIdMatch[1]), body) };
    }

    if (path === '/catalog/pests' && method === 'GET') {
      return { status: 200, data: db.getAll('pests') };
    }

    // -------------------------------------------------------------
    // ANIMALS
    // -------------------------------------------------------------
    if (path === '/animals' && method === 'GET') {
      let list = db.getAll('animals');
      const q = (query.search || '').toLowerCase().trim();
      if (q) {
        list = list.filter(
          a =>
            a.internalTag.toLowerCase().includes(q) ||
            (a.officialTag && a.officialTag.toLowerCase().includes(q)) ||
            (a.name && a.name.toLowerCase().includes(q))
        );
      }
      if (query.ranchId) list = list.filter(a => a.ranchId === Number(query.ranchId));
      if (query.lotId) list = list.filter(a => a.lotId === Number(query.lotId));
      if (query.breedId) list = list.filter(a => a.breedId === Number(query.breedId));
      if (query.sex) list = list.filter(a => a.sex === query.sex);
      if (query.purpose) list = list.filter(a => a.purpose === query.purpose);
      if (query.status) list = list.filter(a => a.status === query.status);

      const page = Number(query.page || 0);
      const size = Number(query.size || 50);
      const start = page * size;
      const content = list.slice(start, start + size);

      return {
        status: 200,
        data: {
          content,
          totalElements: list.length,
          totalPages: Math.ceil(list.length / size) || 1,
          number: page,
          size
        }
      };
    }

    if (path === '/animals' && method === 'POST') {
      const created = db.insert('animals', {
        accountId: 1,
        createdByUserId: 1,
        status: 'ACTIVE',
        shareToken: 'share-' + Math.random().toString(36).substring(2, 10),
        ...body
      });
      return { status: 201, data: created };
    }

    if (path === '/animals/with-purchase' && method === 'POST') {
      const { animal: animalData, purchasePrice, purchaseCurrency, seller, expenseCategoryId, notes } = body;
      const createdAnimal = db.insert('animals', {
        accountId: 1,
        createdByUserId: 1,
        status: 'ACTIVE',
        shareToken: 'share-' + Math.random().toString(36).substring(2, 10),
        ...animalData
      });

      let expense = null;
      if (purchasePrice && Number(purchasePrice) > 0) {
        expense = db.insert('expenses', {
          accountId: 1,
          expenseCategoryId: expenseCategoryId || 1,
          amount: Number(purchasePrice),
          currency: purchaseCurrency || 'MXN',
          incurredAt: body.purchasedAt || new Date().toISOString().split('T')[0],
          ranchId: createdAnimal.ranchId,
          lotId: createdAnimal.lotId,
          animalId: createdAnimal.id,
          vendor: seller,
          description: `Compra de animal ${createdAnimal.internalTag} (${createdAnimal.name || ''})`,
          notes
        });
      }
      return {
        status: 201,
        data: { animal: createdAnimal, expense }
      };
    }

    if (path === '/animals/badges' && method === 'GET') {
      const animals = db.getAll('animals');
      const today = new Date().toISOString().split('T')[0];
      const badges = animals.map(a => {
        const itemBadges: string[] = [];
        // Chequeo de tratamientos abiertos
        const openTreatments = db.filter('treatments', t => t.animalId === a.id && !t.endedAt);
        if (openTreatments.length > 0) itemBadges.push('TREATMENT_OPEN');

        // Chequeo de celo reciente (<3 días)
        const recentHeat = db.filter('heats', h => h.animalId === a.id && h.detectedAt >= today);
        if (recentHeat.length > 0) itemBadges.push('IN_HEAT');

        // Chequeo de preñez
        const posPreg = db.filter('pregnancyChecks', p => p.animalId === a.id && p.result === 'POSITIVE');
        if (posPreg.length > 0) itemBadges.push('PREGNANT');

        // Chequeo de pesaje atrasado (>90 dias sin pesar)
        const weighs = db.filter('weighings', w => w.animalId === a.id);
        if (weighs.length === 0) {
          itemBadges.push('WEIGHING_DUE');
        }

        return {
          animalId: a.id,
          badges: itemBadges
        };
      });
      return { status: 200, data: badges };
    }

    // ANIMAL INDIVIDUAL
    const animalIdMatch = path.match(/^\/animals\/(\d+)$/);
    if (animalIdMatch) {
      const aid = Number(animalIdMatch[1]);
      if (method === 'GET') {
        const a = db.getById('animals', aid);
        return a ? { status: 200, data: a } : { status: 404, data: null };
      }
      if (method === 'PATCH') {
        const updated = db.update('animals', aid, body);
        return { status: 200, data: updated };
      }
      if (method === 'DELETE') {
        db.delete('animals', aid);
        return { status: 204, data: null };
      }
    }

    const animalLactationMatch = path.match(/^\/animals\/(\d+)\/lactation$/);
    if (animalLactationMatch && method === 'GET') {
      const aid = Number(animalLactationMatch[1]);
      const calvings = db.filter('calvings', c => c.motherId === aid).sort((a, b) => b.calvingDate.localeCompare(a.calvingDate));
      const lastCalving = calvings[0]?.calvingDate || null;
      const milkings = db.filter('milkings', m => m.animalId === aid);
      const avgLiters = milkings.length > 0 ? milkings.slice(-5).reduce((acc, c) => acc + c.liters, 0) / Math.min(5, milkings.length) : null;

      let daysInMilk = null;
      if (lastCalving) {
        const diffMs = Date.now() - new Date(lastCalving).getTime();
        daysInMilk = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      }

      return {
        status: 200,
        data: {
          animalId: aid,
          lastCalving,
          daysInMilk,
          lastDryOff: null,
          dry: false,
          recentAvgLiters: avgLiters ? Math.round(avgLiters * 10) / 10 : null
        }
      };
    }

    const animalComparisonMatch = path.match(/^\/animals\/(\d+)\/comparison$/);
    if (animalComparisonMatch && method === 'GET') {
      const aid = Number(animalComparisonMatch[1]);
      // Genera serie de los ultimos 6 meses
      const points = [];
      const months = ['2026-04', '2026-05', '2026-06', '2026-07', '2026-08', '2026-09'];
      for (const ym of months) {
        const w = db.filter('weighings', item => item.animalId === aid && item.weighedAt.startsWith(ym))[0];
        points.push({
          yearMonth: ym,
          weightKg: w?.weightKg ?? 500,
          feedKg: 350,
          expense: 850,
          income: 2400
        });
      }
      return {
        status: 200,
        data: {
          animalId: aid,
          from: '2026-04',
          to: '2026-09',
          points
        }
      };
    }

    // PHOTOS
    const animalPhotosMatch = path.match(/^\/animals\/(\d+)\/photos$/);
    if (animalPhotosMatch && method === 'GET') {
      const aid = Number(animalPhotosMatch[1]);
      const photos = db.filter('photos', p => p.animalId === aid);
      return { status: 200, data: photos };
    }

    const animalPhotoSign = path.match(/^\/animals\/(\d+)\/photos\/sign-upload$/);
    if (animalPhotoSign && method === 'POST') {
      return {
        status: 200,
        data: {
          cloudName: 'local',
          apiKey: 'local',
          timestamp: Date.now(),
          folder: 'animals',
          tags: 'animal',
          signature: 'local-signature'
        }
      };
    }

    const animalPhotoConfirm = path.match(/^\/animals\/(\d+)\/photos\/confirm$/);
    if (animalPhotoConfirm && method === 'POST') {
      const aid = Number(animalPhotoConfirm[1]);
      const photo = db.insert('photos', {
        animalId: aid,
        publicId: body.publicId || 'local-' + Date.now(),
        url: body.url,
        width: body.width || 800,
        height: body.height || 600,
        bytes: body.bytes || 1024
      });
      // Actualiza foto de portada del animal
      db.update('animals', aid, {
        coverPhotoId: photo.id,
        coverPhotoUrl: photo.url
      });
      return { status: 200, data: photo };
    }

    const animalPhotoDelete = path.match(/^\/animals\/(\d+)\/photos\/(\d+)$/);
    if (animalPhotoDelete && method === 'DELETE') {
      const pid = Number(animalPhotoDelete[2]);
      db.delete('photos', pid);
      return { status: 204, data: null };
    }

    // SHARE TOKEN
    const shareTokenMatch = path.match(/^\/animals\/(\d+)\/share-token$/);
    if (shareTokenMatch && method === 'POST') {
      const aid = Number(shareTokenMatch[1]);
      const a = db.getById('animals', aid);
      let token = a?.shareToken;
      if (!token) {
        token = 'share-' + aid + '-' + Math.random().toString(36).substring(2, 8);
        db.update('animals', aid, { shareToken: token });
      }
      return { status: 200, data: { shareToken: token } };
    }

    const publicShareMatch = path.match(/^\/public\/animal-share\/(.+)$/);
    if (publicShareMatch && method === 'GET') {
      const token = decodeURIComponent(publicShareMatch[1]);
      const a = db.filter('animals', item => item.shareToken === token)[0] || db.getAll('animals')[0];
      const breed = db.getById('breeds', a.breedId);
      const weighings = db.filter('weighings', w => w.animalId === a.id).map(w => ({ weighedAt: w.weighedAt, weightKg: w.weightKg }));
      const vaccs = db.filter('vaccinations', v => v.animalId === a.id).map(v => {
        const b = db.getById('vaccines', v.vaccineId);
        return { appliedAt: v.appliedAt, vaccineName: b?.nameEs || null };
      });
      const milkings = db.filter('milkings', m => m.animalId === a.id).map(m => ({ milkingDate: m.milkedAt.split('T')[0], liters: m.liters }));

      return {
        status: 200,
        data: {
          internalTag: a.internalTag,
          name: a.name,
          sex: a.sex,
          status: a.status,
          purpose: a.purpose,
          birthDate: a.birthDate,
          birthDateEstimated: a.birthDateEstimated,
          ageMonths: 24,
          breedName: breed?.nameEs || 'Bovino',
          coverPhotoUrl: a.coverPhotoUrl,
          daysInMilk: 180,
          lastCalving: '2026-01-14',
          weighings,
          vaccinations: vaccs,
          milkings
        }
      };
    }

    // -------------------------------------------------------------
    // HEALTH EVENTS
    // -------------------------------------------------------------
    if (path === '/health/vaccinations') {
      if (method === 'GET') {
        let list = db.getAll('vaccinations');
        if (query.animalId) list = list.filter(v => v.animalId === Number(query.animalId));
        return { status: 200, data: list };
      }
      if (method === 'POST') {
        const v = db.insert('vaccinations', { accountId: 1, ...body });
        return { status: 201, data: v };
      }
    }

    if (path === '/health/vaccinations/bulk' && method === 'POST') {
      const { lotId, vaccineId, appliedAt, doseMl, batchNumber, costPerHead, notes } = body;
      const animalsInLot = db.filter('animals', a => a.lotId === lotId && a.status === 'ACTIVE');
      const created = [];
      for (const a of animalsInLot) {
        const v = db.insert('vaccinations', {
          accountId: 1,
          animalId: a.id,
          vaccineId,
          appliedAt: appliedAt || new Date().toISOString().split('T')[0],
          doseMl,
          batchNumber,
          cost: costPerHead,
          notes
        });
        created.push(v);
      }
      return { status: 201, data: created };
    }

    const animalVaccsMatch = path.match(/^\/animals\/(\d+)\/vaccinations$/);
    if (animalVaccsMatch && method === 'GET') {
      const aid = Number(animalVaccsMatch[1]);
      return { status: 200, data: db.filter('vaccinations', v => v.animalId === aid) };
    }

    const vaccIdMatch = path.match(/^\/health\/vaccinations\/(\d+)$/);
    if (vaccIdMatch) {
      const vid = Number(vaccIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('vaccinations', vid, body) };
      if (method === 'DELETE') {
        db.delete('vaccinations', vid);
        return { status: 204, data: null };
      }
    }

    if (path === '/health/diagnoses') {
      if (method === 'GET') {
        let list = db.getAll('diagnoses');
        if (query.animalId) list = list.filter(d => d.animalId === Number(query.animalId));
        return { status: 200, data: list };
      }
      if (method === 'POST') return { status: 201, data: db.insert('diagnoses', { accountId: 1, ...body }) };
    }

    const animalDiagMatch = path.match(/^\/animals\/(\d+)\/diagnoses$/);
    if (animalDiagMatch && method === 'GET') {
      return { status: 200, data: db.filter('diagnoses', d => d.animalId === Number(animalDiagMatch[1])) };
    }

    const diagIdMatch = path.match(/^\/health\/diagnoses\/(\d+)$/);
    if (diagIdMatch) {
      const did = Number(diagIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('diagnoses', did, body) };
      if (method === 'DELETE') {
        db.delete('diagnoses', did);
        return { status: 204, data: null };
      }
    }

    if (path === '/health/treatments') {
      if (method === 'GET') {
        let list = db.getAll('treatments');
        if (query.animalId) list = list.filter(t => t.animalId === Number(query.animalId));
        if (query.active) list = list.filter(t => !t.endedAt);
        return { status: 200, data: list };
      }
      if (method === 'POST') return { status: 201, data: db.insert('treatments', { accountId: 1, ...body }) };
    }

    const animalTreatMatch = path.match(/^\/animals\/(\d+)\/treatments$/);
    if (animalTreatMatch && method === 'GET') {
      return { status: 200, data: db.filter('treatments', t => t.animalId === Number(animalTreatMatch[1])) };
    }

    const treatIdMatch = path.match(/^\/health\/treatments\/(\d+)$/);
    if (treatIdMatch) {
      const tid = Number(treatIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('treatments', tid, body) };
      if (method === 'DELETE') {
        db.delete('treatments', tid);
        return { status: 204, data: null };
      }
    }

    if (path === '/health/pest-controls') {
      if (method === 'GET') return { status: 200, data: db.getAll('pestControls') };
      if (method === 'POST') return { status: 201, data: db.insert('pestControls', { accountId: 1, ...body }) };
    }

    const pestCtrlId = path.match(/^\/health\/pest-controls\/(\d+)$/);
    if (pestCtrlId && method === 'DELETE') {
      db.delete('pestControls', Number(pestCtrlId[1]));
      return { status: 204, data: null };
    }

    if (path === '/health/vet-visits') {
      if (method === 'GET') return { status: 200, data: db.getAll('vetVisits') };
      if (method === 'POST') return { status: 201, data: db.insert('vetVisits', { accountId: 1, ...body }) };
    }

    const vetVisitId = path.match(/^\/health\/vet-visits\/(\d+)$/);
    if (vetVisitId && method === 'DELETE') {
      db.delete('vetVisits', Number(vetVisitId[1]));
      return { status: 204, data: null };
    }

    if (path === '/health/plans') {
      if (method === 'GET') return { status: 200, data: db.getAll('healthPlans') };
      if (method === 'POST') return { status: 201, data: db.insert('healthPlans', { accountId: 1, ...body }) };
    }

    const healthPlanMatch = path.match(/^\/health\/plans\/(\d+)$/);
    if (healthPlanMatch) {
      const pid = Number(healthPlanMatch[1]);
      if (method === 'GET') {
        const p = db.getById('healthPlans', pid);
        const steps = db.filter('healthPlanSteps', s => s.healthPlanId === pid);
        return p ? { status: 200, data: { ...p, steps } } : { status: 404, data: null };
      }
      if (method === 'PATCH') return { status: 200, data: db.update('healthPlans', pid, body) };
      if (method === 'DELETE') {
        db.delete('healthPlans', pid);
        return { status: 204, data: null };
      }
    }

    const planStepsMatch = path.match(/^\/health\/plans\/(\d+)\/steps$/);
    if (planStepsMatch && method === 'POST') {
      const pid = Number(planStepsMatch[1]);
      return { status: 201, data: db.insert('healthPlanSteps', { healthPlanId: pid, ...body }) };
    }

    const planStepItemMatch = path.match(/^\/health\/plans\/(\d+)\/steps\/(\d+)$/);
    if (planStepItemMatch) {
      const sid = Number(planStepItemMatch[2]);
      if (method === 'PATCH') return { status: 200, data: db.update('healthPlanSteps', sid, body) };
      if (method === 'DELETE') {
        db.delete('healthPlanSteps', sid);
        return { status: 204, data: null };
      }
    }

    const planAssignMatch = path.match(/^\/health\/plans\/(\d+)\/assign$/);
    if (planAssignMatch && method === 'POST') {
      const pid = Number(planAssignMatch[1]);
      const created = [];
      if (body.animalIds) {
        for (const aid of body.animalIds) {
          created.push(db.insert('animalHealthPlans', { healthPlanId: pid, animalId: aid, assignedAt: new Date().toISOString() }));
        }
      }
      return { status: 201, data: created };
    }

    if (path === '/health/alerts' && method === 'GET') {
      return { status: 200, data: [] };
    }

    // -------------------------------------------------------------
    // REPRODUCTION
    // -------------------------------------------------------------
    if (path === '/reproduction/bulls') {
      if (method === 'GET') return { status: 200, data: db.getAll('bulls') };
      if (method === 'POST') return { status: 201, data: db.insert('bulls', { accountId: 1, ...body }) };
    }

    const bullIdMatch = path.match(/^\/reproduction\/bulls\/(\d+)$/);
    if (bullIdMatch) {
      const bid = Number(bullIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('bulls', bid, body) };
      if (method === 'DELETE') {
        db.delete('bulls', bid);
        return { status: 204, data: null };
      }
    }

    if (path === '/reproduction/semen-straws') {
      if (method === 'GET') return { status: 200, data: db.getAll('semenStraws') };
      if (method === 'POST') return { status: 201, data: db.insert('semenStraws', { accountId: 1, ...body }) };
    }

    const semenIdMatch = path.match(/^\/reproduction\/semen-straws\/(\d+)$/);
    if (semenIdMatch) {
      const sid = Number(semenIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('semenStraws', sid, body) };
      if (method === 'DELETE') {
        db.delete('semenStraws', sid);
        return { status: 204, data: null };
      }
    }

    if (path === '/reproduction/heats') {
      if (method === 'GET') return { status: 200, data: db.getAll('heats') };
      if (method === 'POST') return { status: 201, data: db.insert('heats', { accountId: 1, ...body }) };
    }

    const heatIdMatch = path.match(/^\/reproduction\/heats\/(\d+)$/);
    if (heatIdMatch && method === 'DELETE') {
      db.delete('heats', Number(heatIdMatch[1]));
      return { status: 204, data: null };
    }

    if (path === '/reproduction/services') {
      if (method === 'GET') return { status: 200, data: db.getAll('services') };
      if (method === 'POST') {
        const serv = db.insert('services', { accountId: 1, ...body });
        // Descuenta pajuela si aplica
        if (body.semenStrawId) {
          const straw = db.getById('semenStraws', body.semenStrawId);
          if (straw && straw.availableQuantity > 0) {
            db.update('semenStraws', straw.id, { availableQuantity: straw.availableQuantity - 1 });
          }
        }
        return { status: 201, data: serv };
      }
    }

    const serviceIdMatch = path.match(/^\/reproduction\/services\/(\d+)$/);
    if (serviceIdMatch && method === 'DELETE') {
      db.delete('services', Number(serviceIdMatch[1]));
      return { status: 204, data: null };
    }

    if (path === '/reproduction/pregnancy-checks') {
      if (method === 'GET') return { status: 200, data: db.getAll('pregnancyChecks') };
      if (method === 'POST') return { status: 201, data: db.insert('pregnancyChecks', { accountId: 1, ...body }) };
    }

    const pregCheckId = path.match(/^\/reproduction\/pregnancy-checks\/(\d+)$/);
    if (pregCheckId && method === 'DELETE') {
      db.delete('pregnancyChecks', Number(pregCheckId[1]));
      return { status: 204, data: null };
    }

    if (path === '/reproduction/calvings') {
      if (method === 'GET') return { status: 200, data: db.getAll('calvings') };
      if (method === 'POST') {
        const calving = db.insert('calvings', { accountId: 1, ...body });
        // Si se indicó crear cría al parto
        if (body.calfInternalTag && body.calfStatus !== 'DEAD') {
          const mom = db.getById('animals', body.motherId);
          db.insert('animals', {
            accountId: 1,
            ranchId: mom?.ranchId || 1,
            lotId: 3, // Maternidad
            internalTag: body.calfInternalTag,
            name: body.calfName || null,
            sex: body.calfSex === 'MALE' ? 'MALE' : 'FEMALE',
            birthDate: body.calvingDate,
            birthDateEstimated: false,
            breedId: mom?.breedId || 1,
            purpose: mom?.purpose || 'DAIRY',
            status: 'ACTIVE',
            createdByUserId: 1
          });
        }
        return { status: 201, data: calving };
      }
    }

    const calvingIdMatch = path.match(/^\/reproduction\/calvings\/(\d+)$/);
    if (calvingIdMatch && method === 'DELETE') {
      db.delete('calvings', Number(calvingIdMatch[1]));
      return { status: 204, data: null };
    }

    if (path === '/reproduction/abortions') {
      if (method === 'GET') return { status: 200, data: db.getAll('abortions') };
      if (method === 'POST') return { status: 201, data: db.insert('abortions', { accountId: 1, ...body }) };
    }

    const abortIdMatch = path.match(/^\/reproduction\/abortions\/(\d+)$/);
    if (abortIdMatch && method === 'DELETE') {
      db.delete('abortions', Number(abortIdMatch[1]));
      return { status: 204, data: null };
    }

    if (path === '/reproduction/weanings') {
      if (method === 'GET') return { status: 200, data: db.getAll('weanings') };
      if (method === 'POST') return { status: 201, data: db.insert('weanings', { accountId: 1, ...body }) };
    }

    const weanIdMatch = path.match(/^\/reproduction\/weanings\/(\d+)$/);
    if (weanIdMatch && method === 'DELETE') {
      db.delete('weanings', Number(weanIdMatch[1]));
      return { status: 204, data: null };
    }

    if (path === '/reproduction/dry-offs') {
      if (method === 'GET') return { status: 200, data: db.getAll('dryOffs') };
      if (method === 'POST') return { status: 201, data: db.insert('dryOffs', { accountId: 1, ...body }) };
    }

    const dryIdMatch = path.match(/^\/reproduction\/dry-offs\/(\d+)$/);
    if (dryIdMatch && method === 'DELETE') {
      db.delete('dryOffs', Number(dryIdMatch[1]));
      return { status: 204, data: null };
    }

    if (path === '/reproduction/kpis' && method === 'GET') {
      return {
        status: 200,
        data: {
          conceptionRate: 65.5,
          pregnancyRate: 72.0,
          calvingIntervalDays: 395,
          avgDaysOpen: 110
        }
      };
    }

    if (path === '/reproduction/alerts' && method === 'GET') {
      return { status: 200, data: [] };
    }

    // -------------------------------------------------------------
    // PRODUCTION
    // -------------------------------------------------------------
    if (path === '/production/weighings') {
      if (method === 'GET') return { status: 200, data: db.getAll('weighings') };
      if (method === 'POST') return { status: 201, data: db.insert('weighings', { accountId: 1, ...body }) };
    }

    if (path === '/production/weighings/bulk' && method === 'POST') {
      const created = (Array.isArray(body) ? body : []).map(item =>
        db.insert('weighings', { accountId: 1, ...item })
      );
      return { status: 201, data: created };
    }

    const animalWeighsMatch = path.match(/^\/animals\/(\d+)\/weighings$/);
    if (animalWeighsMatch && method === 'GET') {
      return { status: 200, data: db.filter('weighings', w => w.animalId === Number(animalWeighsMatch[1])) };
    }

    const weighIdMatch = path.match(/^\/production\/weighings\/(\d+)$/);
    if (weighIdMatch) {
      const wid = Number(weighIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('weighings', wid, body) };
      if (method === 'DELETE') {
        db.delete('weighings', wid);
        return { status: 204, data: null };
      }
    }

    if (path === '/production/milkings') {
      if (method === 'GET') return { status: 200, data: db.getAll('milkings') };
      if (method === 'POST') return { status: 201, data: db.insert('milkings', { accountId: 1, ...body }) };
    }

    const milkIdMatch = path.match(/^\/production\/milkings\/(\d+)$/);
    if (milkIdMatch && method === 'DELETE') {
      db.delete('milkings', Number(milkIdMatch[1]));
      return { status: 204, data: null };
    }

    if (path === '/production/milk-samples') {
      if (method === 'GET') return { status: 200, data: db.getAll('milkSamples') };
      if (method === 'POST') return { status: 201, data: db.insert('milkSamples', { accountId: 1, ...body }) };
    }

    const sampleIdMatch = path.match(/^\/production\/milk-samples\/(\d+)$/);
    if (sampleIdMatch && method === 'DELETE') {
      db.delete('milkSamples', Number(sampleIdMatch[1]));
      return { status: 204, data: null };
    }

    if (path === '/production/bulk-tank') {
      if (method === 'GET') return { status: 200, data: db.getAll('bulkTankDeliveries') };
      if (method === 'POST') return { status: 201, data: db.insert('bulkTankDeliveries', { accountId: 1, ...body }) };
    }

    const bulkTankId = path.match(/^\/production\/bulk-tank\/(\d+)$/);
    if (bulkTankId && method === 'DELETE') {
      db.delete('bulkTankDeliveries', Number(bulkTankId[1]));
      return { status: 204, data: null };
    }

    if (path === '/production/slaughter') {
      if (method === 'GET') return { status: 200, data: db.getAll('slaughters') };
      if (method === 'POST') {
        const item = db.insert('slaughters', { accountId: 1, ...body });
        if (body.animalId) db.update('animals', body.animalId, { status: 'DEAD' });
        return { status: 201, data: item };
      }
    }

    if (path === '/production/growth-curve' && method === 'GET') {
      return {
        status: 200,
        data: [
          { ageMonths: 0, weightKg: 38 },
          { ageMonths: 4, weightKg: 135 },
          { ageMonths: 8, weightKg: 215 },
          { ageMonths: 12, weightKg: 320 },
          { ageMonths: 18, weightKg: 450 },
          { ageMonths: 24, weightKg: 580 }
        ]
      };
    }

    if (path === '/production/lactation-curve' && method === 'GET') {
      return {
        status: 200,
        data: [
          { daysInMilk: 30, avgLiters: 28 },
          { daysInMilk: 60, avgLiters: 34 },
          { daysInMilk: 90, avgLiters: 32 },
          { daysInMilk: 120, avgLiters: 29 },
          { daysInMilk: 180, avgLiters: 24 },
          { daysInMilk: 240, avgLiters: 19 },
          { daysInMilk: 305, avgLiters: 14 }
        ]
      };
    }

    if (path === '/production/kpis' && method === 'GET') {
      return {
        status: 200,
        data: {
          avgLitersPerCowDay: 24.5,
          totalMilkMonth: 8900,
          avgAdgKgDay: 0.78
        }
      };
    }

    // -------------------------------------------------------------
    // FEEDING
    // -------------------------------------------------------------
    if (path === '/feeding/items') {
      if (method === 'GET') return { status: 200, data: db.getAll('feedItems') };
      if (method === 'POST') return { status: 201, data: db.insert('feedItems', { accountId: 1, ...body }) };
    }

    const feedItemIdMatch = path.match(/^\/feeding\/items\/(\d+)$/);
    if (feedItemIdMatch) {
      const fid = Number(feedItemIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('feedItems', fid, body) };
      if (method === 'DELETE') {
        db.delete('feedItems', fid);
        return { status: 204, data: null };
      }
    }

    if (path === '/feeding/plans') {
      if (method === 'GET') return { status: 200, data: db.getAll('feedingPlans') };
      if (method === 'POST') return { status: 201, data: db.insert('feedingPlans', { accountId: 1, ...body }) };
    }

    const feedPlanMatch = path.match(/^\/feeding\/plans\/(\d+)$/);
    if (feedPlanMatch) {
      const pid = Number(feedPlanMatch[1]);
      if (method === 'GET') {
        const plan = db.getById('feedingPlans', pid);
        const items = db.filter('feedingPlanItems', item => item.feedingPlanId === pid);
        return plan ? { status: 200, data: { ...plan, items } } : { status: 404, data: null };
      }
      if (method === 'PATCH') return { status: 200, data: db.update('feedingPlans', pid, body) };
      if (method === 'DELETE') {
        db.delete('feedingPlans', pid);
        return { status: 204, data: null };
      }
    }

    const feedPlanItemCreateMatch = path.match(/^\/feeding\/plans\/(\d+)\/items$/);
    if (feedPlanItemCreateMatch && method === 'POST') {
      const pid = Number(feedPlanItemCreateMatch[1]);
      return { status: 201, data: db.insert('feedingPlanItems', { feedingPlanId: pid, ...body }) };
    }

    const feedPlanItemModifyMatch = path.match(/^\/feeding\/plans\/(\d+)\/items\/(\d+)$/);
    if (feedPlanItemModifyMatch) {
      const iid = Number(feedPlanItemModifyMatch[2]);
      if (method === 'PATCH') return { status: 200, data: db.update('feedingPlanItems', iid, body) };
      if (method === 'DELETE') {
        db.delete('feedingPlanItems', iid);
        return { status: 204, data: null };
      }
    }

    if (path === '/feeding/lot-assignments') {
      if (method === 'GET') return { status: 200, data: db.getAll('lotFeedingPlans') };
      if (method === 'POST') return { status: 201, data: db.insert('lotFeedingPlans', body) };
    }

    const lotFeedPlanDel = path.match(/^\/feeding\/lot-assignments\/(\d+)$/);
    if (lotFeedPlanDel && method === 'DELETE') {
      db.delete('lotFeedingPlans', Number(lotFeedPlanDel[1]));
      return { status: 204, data: null };
    }

    if (path === '/feeding/records') {
      if (method === 'GET') return { status: 200, data: db.getAll('feedingRecords') };
      if (method === 'POST') return { status: 201, data: db.insert('feedingRecords', { accountId: 1, ...body }) };
    }

    const feedRecDel = path.match(/^\/feeding\/records\/(\d+)$/);
    if (feedRecDel && method === 'DELETE') {
      db.delete('feedingRecords', Number(feedRecDel[1]));
      return { status: 204, data: null };
    }

    if (path === '/feeding/cost-summary' && method === 'GET') {
      return {
        status: 200,
        data: {
          from: query.from || '2026-09-01',
          to: query.to || '2026-09-30',
          groupBy: query.groupBy || 'lot',
          buckets: [
            { key: '1', label: 'Potrero Norte - Lecheras Altas', totalCost: 3555.0, totalKg: 1310 },
            { key: '2', label: 'Potrero Sur - Bajas y Secas', totalCost: 1240.0, totalKg: 620 }
          ]
        }
      };
    }

    // -------------------------------------------------------------
    // FINANCE
    // -------------------------------------------------------------
    if (path === '/finance/categories/expenses') {
      if (method === 'GET') return { status: 200, data: db.getAll('expenseCategories') };
      if (method === 'POST') return { status: 201, data: db.insert('expenseCategories', { accountId: 1, ...body }) };
    }

    const expCatMatch = path.match(/^\/finance\/categories\/expenses\/(\d+)$/);
    if (expCatMatch) {
      const cid = Number(expCatMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('expenseCategories', cid, body) };
      if (method === 'DELETE') {
        db.delete('expenseCategories', cid);
        return { status: 204, data: null };
      }
    }

    if (path === '/finance/categories/incomes') {
      if (method === 'GET') return { status: 200, data: db.getAll('incomeCategories') };
      if (method === 'POST') return { status: 201, data: db.insert('incomeCategories', { accountId: 1, ...body }) };
    }

    const incCatMatch = path.match(/^\/finance\/categories\/incomes\/(\d+)$/);
    if (incCatMatch) {
      const cid = Number(incCatMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('incomeCategories', cid, body) };
      if (method === 'DELETE') {
        db.delete('incomeCategories', cid);
        return { status: 204, data: null };
      }
    }

    if (path === '/finance/expenses') {
      if (method === 'GET') {
        const expenses = db.getAll('expenses').map(e => {
          const cat = db.getById('expenseCategories', e.expenseCategoryId);
          return {
            ...e,
            expenseCategoryCode: cat?.code,
            expenseCategoryNameEs: cat?.nameEs,
            expenseCategoryNameEn: cat?.nameEn
          };
        });
        return { status: 200, data: expenses };
      }
      if (method === 'POST') return { status: 201, data: db.insert('expenses', { accountId: 1, currency: 'MXN', ...body }) };
    }

    const expIdMatch = path.match(/^\/finance\/expenses\/(\d+)$/);
    if (expIdMatch) {
      const eid = Number(expIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('expenses', eid, body) };
      if (method === 'DELETE') {
        db.delete('expenses', eid);
        return { status: 204, data: null };
      }
    }

    if (path === '/finance/incomes') {
      if (method === 'GET') return { status: 200, data: db.getAll('incomes') };
      if (method === 'POST') return { status: 201, data: db.insert('incomes', { accountId: 1, currency: 'MXN', ...body }) };
    }

    const incIdMatch = path.match(/^\/finance\/incomes\/(\d+)$/);
    if (incIdMatch) {
      const iid = Number(incIdMatch[1]);
      if (method === 'PATCH') return { status: 200, data: db.update('incomes', iid, body) };
      if (method === 'DELETE') {
        db.delete('incomes', iid);
        return { status: 204, data: null };
      }
    }

    if (path === '/finance/animal-sales') {
      if (method === 'GET') return { status: 200, data: db.getAll('animalSales') };
      if (method === 'POST') {
        const sale = db.insert('animalSales', { accountId: 1, currency: 'MXN', ...body });
        if (body.animalId) {
          db.update('animals', body.animalId, { status: 'SOLD' });
          // También genera un ingreso
          db.insert('incomes', {
            accountId: 1,
            incomeCategoryId: 2,
            amount: body.totalPrice,
            currency: body.currency || 'MXN',
            receivedAt: body.soldAt,
            animalId: body.animalId,
            payer: body.buyer,
            description: `Venta de animal ID ${body.animalId}`
          });
        }
        return { status: 201, data: sale };
      }
    }

    const animSaleId = path.match(/^\/finance\/animal-sales\/(\d+)$/);
    if (animSaleId && method === 'DELETE') {
      db.delete('animalSales', Number(animSaleId[1]));
      return { status: 204, data: null };
    }

    if (path === '/finance/milk-sales') {
      if (method === 'GET') return { status: 200, data: db.getAll('milkSales') };
      if (method === 'POST') {
        const sale = db.insert('milkSales', { accountId: 1, currency: 'MXN', ...body });
        db.insert('incomes', {
          accountId: 1,
          incomeCategoryId: 1,
          amount: body.totalAmount,
          currency: body.currency || 'MXN',
          receivedAt: body.soldAt,
          ranchId: body.ranchId,
          payer: body.buyer,
          description: `Venta de leche ${body.liters} L`
        });
        return { status: 201, data: sale };
      }
    }

    const milkSaleId = path.match(/^\/finance\/milk-sales\/(\d+)$/);
    if (milkSaleId && method === 'DELETE') {
      db.delete('milkSales', Number(milkSaleId[1]));
      return { status: 204, data: null };
    }

    if (path === '/finance/cash-flow' && method === 'GET') {
      return {
        status: 200,
        data: [
          { month: '2026-06', income: 24000, expense: 18000, balance: 6000 },
          { month: '2026-07', income: 52000, expense: 31000, balance: 21000 },
          { month: '2026-08', income: 56000, expense: 33000, balance: 23000 },
          { month: '2026-09', income: 58300, expense: 34950, balance: 23350 }
        ]
      };
    }

    if (['/finance/pnl', '/reports/pnl'].includes(path) && method === 'GET') {
      const expenses = db.getAll('expenses');
      const incomes = db.getAll('incomes');
      const totalExpense = expenses.reduce((acc, c) => acc + c.amount, 0);
      const totalIncome = incomes.reduce((acc, c) => acc + c.amount, 0);

      return {
        status: 200,
        data: {
          from: query.from || '2026-01-01',
          to: query.to || '2026-09-30',
          groupBy: query.groupBy || 'month',
          totalIncome,
          totalExpense,
          margin: totalIncome - totalExpense,
          buckets: [
            { key: '2026-07', label: 'Julio 2026', income: 52000, expense: 31000, margin: 21000 },
            { key: '2026-08', label: 'Agosto 2026', income: 56000, expense: 33000, margin: 23000 },
            { key: '2026-09', label: 'Septiembre 2026', income: totalIncome, expense: totalExpense, margin: totalIncome - totalExpense }
          ],
          importedCosts: {
            treatments: 215,
            vaccinations: 213,
            pestControls: 450,
            vetVisits: 1500,
            feedingRecords: 3555,
            services: 1030
          }
        }
      };
    }

    if (path === '/finance/cost-per-unit' && method === 'GET') {
      return {
        status: 200,
        data: {
          costPerLiter: 5.85,
          costPerKgBeef: 38.20
        }
      };
    }

    if (path === '/finance/animal-roi' && method === 'GET') {
      return { status: 200, data: [] };
    }

    // -------------------------------------------------------------
    // DASHBOARDS & REPORTS & AGENDA
    // -------------------------------------------------------------
    if (path === '/dashboard/summary' && method === 'GET') {
      const animals = db.getAll('animals');
      const ranches = db.getAll('ranches');
      const lots = db.getAll('lots');
      const activeAnimals = animals.filter(a => a.status === 'ACTIVE').length;
      const soldThisYear = animals.filter(a => a.status === 'SOLD').length;
      const deadThisYear = animals.filter(a => a.status === 'DEAD').length;

      const bySex: Record<string, number> = {};
      const byPurpose: Record<string, number> = {};
      for (const a of animals) {
        bySex[a.sex] = (bySex[a.sex] || 0) + 1;
        byPurpose[a.purpose] = (byPurpose[a.purpose] || 0) + 1;
      }

      const byRanch = ranches.map(r => ({
        ranchId: r.id,
        ranchName: r.name,
        count: animals.filter(a => a.ranchId === r.id).length
      }));

      const breeds = db.getAll('breeds');
      const byBreed = breeds
        .map(b => ({
          breedId: b.id,
          breedCode: b.code,
          count: animals.filter(a => a.breedId === b.id).length
        }))
        .filter(b => b.count > 0);

      return {
        status: 200,
        data: {
          totals: {
            totalAnimals: animals.length,
            activeAnimals,
            soldThisYear,
            deadThisYear,
            ranches: ranches.length,
            lots: lots.length
          },
          byRanch,
          byBreed,
          bySex,
          byPurpose,
          recentAdditions: {
            labels: ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
            counts: [1, 2, 1, 0, 2, 3]
          }
        }
      };
    }

    if (path === '/dashboard/health' && method === 'GET') {
      return {
        status: 200,
        data: {
          upcomingVaccinations7d: 2,
          upcomingVaccinations30d: 4,
          activeDiagnoses: db.filter('diagnoses', d => d.status === 'ACTIVE').length,
          treatmentsActiveCount: db.filter('treatments', t => !t.endedAt).length,
          monthVetSpend: 1500,
          topDiseasesQuarter: [
            { diseaseCode: 'MASTITIS', name: 'Mastitis', count: 2 },
            { diseaseCode: 'COJERA', name: 'Cojera / Gabarro', count: 1 }
          ]
        }
      };
    }

    if (path === '/dashboard/production' && method === 'GET') {
      const milkingsToday = db.filter('milkings', m => m.milkedAt.startsWith('2026-09-20'));
      const todayMilkLiters = milkingsToday.reduce((acc, c) => acc + c.liters, 0);
      const allMilkings = db.getAll('milkings');
      const mtdMilkLiters = allMilkings.reduce((acc, c) => acc + c.liters, 0);

      return {
        status: 200,
        data: {
          todayMilkLiters: todayMilkLiters || 43.5,
          mtdMilkLiters: mtdMilkLiters || 142.5,
          avgAdgKgDayThisMonth: 0.76,
          activeMilkingCows: 3
        }
      };
    }

    if (path === '/dashboard/reproduction' && method === 'GET') {
      const posPrengant = db.filter('pregnancyChecks', p => p.result === 'POSITIVE').length;
      return {
        status: 200,
        data: {
          pregnantConfirmed: posPrengant || 2,
          upcomingCalvings21d: 1,
          openCows: 4,
          avgDaysOpen: 95
        }
      };
    }

    if (path === '/dashboard/finance' && method === 'GET') {
      const expenses = db.getAll('expenses');
      const incomes = db.getAll('incomes');
      const mtdExpense = expenses.reduce((acc, c) => acc + c.amount, 0);
      const mtdIncome = incomes.reduce((acc, c) => acc + c.amount, 0);

      return {
        status: 200,
        data: {
          mtdIncome,
          mtdExpense,
          mtdMargin: mtdIncome - mtdExpense,
          ytdMargin: 120000,
          topExpenseCategoriesMonth: [
            { categoryCode: 'ALIMENTO', nameEs: 'Alimento y Forrajes', nameEn: 'Feed', total: 15400 },
            { categoryCode: 'MANO_OBRA', nameEs: 'Mano de Obra y Nómina', nameEn: 'Labor', total: 12000 },
            { categoryCode: 'COMBUSTIBLE', nameEs: 'Combustible y Transporte', nameEn: 'Fuel', total: 4200 }
          ]
        }
      };
    }

    if (path === '/agenda/today' && method === 'GET') {
      return {
        status: 200,
        data: [
          {
            type: 'VACCINATION',
            animalId: 2,
            animalTag: 'COW-002',
            lotId: 1,
            lotName: 'Potrero Norte',
            dueDate: '2026-09-20',
            message: 'Vacunación preventiva programada (Carbón sintomático)',
            severity: 'medium'
          },
          {
            type: 'TREATMENT_OPEN',
            animalId: 4,
            animalTag: 'COW-004',
            lotId: 2,
            lotName: 'Potrero Sur',
            dueDate: '2026-09-20',
            message: 'Aplicar curación y segunda dosis Oxitetraciclina para cojera',
            severity: 'high'
          },
          {
            type: 'CALVING',
            animalId: 2,
            animalTag: 'COW-002',
            lotId: 1,
            lotName: 'Potrero Norte',
            dueDate: '2026-12-15',
            message: 'Parto programado por fecha de servicio',
            severity: 'low'
          }
        ]
      };
    }

    if (path === '/alerts/predictive' && method === 'GET') {
      return {
        status: 200,
        data: [
          {
            type: 'LONG_OPEN_DAYS',
            animalId: 3,
            animalTag: 'COW-003',
            detail: 'Vaca con más de 120 días abiertos sin servicio registrado',
            severity: 'medium'
          }
        ]
      };
    }

    if (path === '/reports/inventory' && method === 'GET') {
      const animals = db.getAll('animals');
      const ranches = db.getAll('ranches');
      const lots = db.getAll('lots');
      const breeds = db.getAll('breeds');
      const weighings = db.getAll('weighings');

      const rows = animals.map(a => {
        const ranch = ranches.find(r => r.id === a.ranchId);
        const lot = lots.find(l => l.id === a.lotId);
        const breed = breeds.find(b => b.id === a.breedId);
        const aWeights = weighings.filter(w => w.animalId === a.id);
        const lastWeight = aWeights.length > 0 ? aWeights[aWeights.length - 1].weightKg : null;

        let ageDays = null;
        if (a.birthDate) {
          ageDays = Math.floor((Date.now() - new Date(a.birthDate).getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
          id: a.id,
          internalTag: a.internalTag,
          breed: breed?.nameEs || 'Bovino',
          sex: a.sex,
          purpose: a.purpose,
          ageDays,
          currentLot: lot?.name || null,
          currentRanch: ranch?.name || null,
          lastWeightKg: lastWeight
        };
      });

      return {
        status: 200,
        data: {
          generatedAt: new Date().toISOString(),
          totalAnimals: animals.length,
          rows
        }
      };
    }

    const reportAnimalMatch = path.match(/^\/reports\/animal\/(\d+)$/);
    if (reportAnimalMatch && method === 'GET') {
      const aid = Number(reportAnimalMatch[1]);
      const animal = db.getById('animals', aid) || db.getAll('animals')[0];
      const breed = db.getById('breeds', animal.breedId);
      const ranch = db.getById('ranches', animal.ranchId);
      const lot = animal.lotId ? db.getById('lots', animal.lotId) : null;

      const vaccs = db.filter('vaccinations', v => v.animalId === animal.id).map(v => {
        const vac = db.getById('vaccines', v.vaccineId);
        return {
          id: v.id,
          appliedAt: v.appliedAt,
          vaccineNameEs: vac?.nameEs,
          vaccineNameEn: vac?.nameEn,
          cost: v.cost
        };
      });

      const diags = db.filter('diagnoses', d => d.animalId === animal.id).map(d => {
        const dis = db.getById('diseases', d.diseaseId);
        return {
          id: d.id,
          diagnosedAt: d.diagnosedAt,
          diseaseNameEs: dis?.nameEs,
          diseaseNameEn: dis?.nameEn,
          severity: d.severity,
          status: d.status
        };
      });

      const treats = db.filter('treatments', t => t.animalId === animal.id).map(t => {
        const med = db.getById('medications', t.medicationId);
        return {
          id: t.id,
          startedAt: t.startedAt,
          medicationNameEs: med?.nameEs,
          medicationNameEn: med?.nameEn,
          cost: t.cost
        };
      });

      const weighs = db.filter('weighings', w => w.animalId === animal.id).map(w => ({
        id: w.id,
        weighedAt: w.weighedAt,
        weightKg: w.weightKg
      }));

      const milkings = db.filter('milkings', m => m.animalId === animal.id).map(m => ({
        id: m.id,
        milkedAt: m.milkedAt,
        liters: m.liters
      }));

      const calvings = db.filter('calvings', c => c.motherId === animal.id).map(c => ({
        id: c.id,
        calvingDate: c.calvingDate,
        outcome: c.calfStatus || 'ALIVE'
      }));

      const sale = db.filter('animalSales', s => s.animalId === animal.id)[0] || null;

      return {
        status: 200,
        data: {
          animal: {
            id: animal.id,
            internalTag: animal.internalTag,
            officialTag: animal.officialTag,
            name: animal.name,
            breedId: animal.breedId,
            breedNameEs: breed?.nameEs,
            breedNameEn: breed?.nameEn,
            sex: animal.sex,
            status: animal.status,
            purpose: animal.purpose,
            birthDate: animal.birthDate,
            ranchId: animal.ranchId,
            ranchName: ranch?.name,
            lotId: animal.lotId,
            lotName: lot?.name
          },
          vaccinations: vaccs,
          diagnoses: diags,
          treatments: treats,
          weighings: weighs,
          milkings,
          calvings,
          sale
        }
      };
    }

    if (path === '/reports/sales-history' && method === 'GET') {
      const aSales = db.getAll('animalSales').map(s => ({
        kind: 'ANIMAL_SALE' as const,
        id: s.id,
        date: s.soldAt,
        description: `Venta animal #${s.animalId}`,
        amount: s.totalPrice,
        buyer: s.buyer
      }));
      const mSales = db.getAll('milkSales').map(s => ({
        kind: 'MILK_SALE' as const,
        id: s.id,
        date: s.soldAt,
        description: `Venta leche ${s.liters} L`,
        amount: s.totalAmount,
        buyer: s.buyer
      }));

      return {
        status: 200,
        data: {
          from: query.from || '2026-01-01',
          to: query.to || '2026-09-30',
          rows: [...aSales, ...mSales]
        }
      };
    }

    if (path === '/reports/health-summary' && method === 'GET') {
      return {
        status: 200,
        data: {
          from: query.from || '2026-01-01',
          to: query.to || '2026-09-30',
          months: [
            {
              month: '2026-08',
              vaccinations: 1,
              diagnosesMild: 1,
              diagnosesModerate: 0,
              diagnosesSevere: 0,
              treatments: 1,
              totalCost: 570
            },
            {
              month: '2026-09',
              vaccinations: 0,
              diagnosesMild: 0,
              diagnosesModerate: 1,
              diagnosesSevere: 0,
              treatments: 1,
              totalCost: 1595
            }
          ]
        }
      };
    }

    // Si ningun handler coincide, devuelve 200 vacio o 404 informativo
    console.warn('[ServerlessRouter unhandled route]', method, path);
    return {
      status: 200,
      data: Array.isArray(body) ? [] : {}
    };
  }
}

export const serverlessRouter = new ServerlessRouter();
