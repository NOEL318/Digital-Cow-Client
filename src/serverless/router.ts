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

    if ((path === '/auth/me' || path === '/me') && method === 'GET') {
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
      return {
        status: 200,
        data: {
          upcomingVaccinations7d: [],
          upcomingVaccinations30d: [],
          withdrawalActiveMilk: [],
          withdrawalActiveMeat: [],
          activeDiagnosesWithoutTreatment: []
        }
      };
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
          from: query.from || '2026-01-01',
          to: query.to || '2026-12-31',
          daysOpenMedian: null,
          daysOpenP75: null,
          daysOpenMax: null,
          iepDays: null,
          firstCalvingAgeDays: null,
          firstServiceConceptionRate: null,
          servicesPerConception: null,
          pregnancyRate: null
        }
      };
    }

    if (path === '/reproduction/alerts' && method === 'GET') {
      return {
        status: 200,
        data: {
          upcomingCalvings21d: [],
          dryOffDue: [],
          servedWithoutCheck: [],
          openTooLong: []
        }
      };
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

    const growthMatch = path.match(/^\/production\/growth-curve(?:\/(\d+))?$/);
    if ((path === '/production/growth-curve' || growthMatch) && method === 'GET') {
      const animalId = growthMatch?.[1] ? Number(growthMatch[1]) : (query.animalId ? Number(query.animalId) : null);
      const weights = animalId
        ? db.filter('weighings', w => w.animalId === animalId).sort((a, b) => (a.weighedAt < b.weighedAt ? -1 : 1))
        : [];
      let prevWeight: number | null = null;
      let prevDate: Date | null = null;
      const points = weights.map(w => {
        const currentDate = new Date(w.weighedAt);
        let adg: number | null = null;
        if (prevWeight != null && prevDate != null) {
          const days = Math.max(1, Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)));
          adg = Number(((w.weightKg - prevWeight) / days).toFixed(3));
        }
        prevWeight = w.weightKg;
        prevDate = currentDate;
        return {
          date: w.weighedAt,
          weightKg: w.weightKg,
          adgSincePrevious: adg
        };
      });
      return {
        status: 200,
        data: {
          animalId: animalId || 0,
          points
        }
      };
    }

    const lactMatch = path.match(/^\/production\/lactation-curve(?:\/(\d+))?$/);
    if ((path === '/production/lactation-curve' || lactMatch) && method === 'GET') {
      const animalId = lactMatch?.[1] ? Number(lactMatch[1]) : (query.animalId ? Number(query.animalId) : null);
      const milkings = animalId
        ? db.filter('milkings', m => m.animalId === animalId).sort((a, b) => (a.milkedAt < b.milkedAt ? -1 : 1))
        : [];
      const startDate = query.lactationStartDate || (milkings[0]?.milkedAt ? milkings[0].milkedAt.slice(0, 10) : '2026-01-01');
      const startMs = new Date(startDate).getTime();
      const points = milkings.map(m => {
        const dayOfLactation = Math.max(1, Math.round((new Date(m.milkedAt).getTime() - startMs) / (1000 * 60 * 60 * 24)));
        return {
          dayOfLactation,
          date: m.milkedAt,
          totalLiters: m.liters || 0
        };
      });
      return {
        status: 200,
        data: {
          animalId: animalId || 0,
          lactationStart: startDate,
          points
        }
      };
    }

    if (path === '/production/kpis' && method === 'GET') {
      const milkings = db.getAll('milkings');
      const totalMilkLiters = milkings.reduce((sum, m) => sum + (m.liters || 0), 0);
      return {
        status: 200,
        data: {
          from: query.from || '2026-01-01',
          to: query.to || '2026-12-31',
          totalMilkLiters,
          avgDailyMilkLiters: 0,
          avgAdgKgDay: null,
          topProducers: []
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
          from: query.from || '2026-01-01',
          to: query.to || '2026-12-31',
          groupBy: query.groupBy || 'lot',
          buckets: []
        }
      };
    }

    // -------------------------------------------------------------
    // FINANCE
    // -------------------------------------------------------------
    if (path === '/finance/categories/expenses' || path === '/finance/expense-categories') {
      if (method === 'GET') return { status: 200, data: db.getAll('expenseCategories') };
      if (method === 'POST') return { status: 201, data: db.insert('expenseCategories', { accountId: 1, ...body }) };
    }

    const expCatMatch = path.match(/^\/finance\/(?:categories\/expenses|expense-categories)\/(\d+)$/);
    if (expCatMatch) {
      const cid = Number(expCatMatch[1]);
      if (method === 'PATCH' || method === 'PUT') return { status: 200, data: db.update('expenseCategories', cid, body) };
      if (method === 'DELETE') {
        db.delete('expenseCategories', cid);
        return { status: 204, data: null };
      }
    }

    if (path === '/finance/categories/incomes' || path === '/finance/income-categories') {
      if (method === 'GET') return { status: 200, data: db.getAll('incomeCategories') };
      if (method === 'POST') return { status: 201, data: db.insert('incomeCategories', { accountId: 1, ...body }) };
    }

    const incCatMatch = path.match(/^\/finance\/(?:categories\/incomes|income-categories)\/(\d+)$/);
    if (incCatMatch) {
      const cid = Number(incCatMatch[1]);
      if (method === 'PATCH' || method === 'PUT') return { status: 200, data: db.update('incomeCategories', cid, body) };
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
      const year = Number(query.year) || new Date().getFullYear();
      const expenses = db.getAll('expenses');
      const incomes = db.getAll('incomes');

      const months = Array.from({ length: 12 }, (_, i) => {
        const monthNum = i + 1;
        const prefix = `${year}-${String(monthNum).padStart(2, '0')}`;
        const monthInc = incomes
          .filter(inc => (inc.receivedAt || '').startsWith(prefix))
          .reduce((sum, inc) => sum + (Number(inc.amount) || 0), 0);
        const monthExp = expenses
          .filter(exp => (exp.incurredAt || '').startsWith(prefix))
          .reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
        return {
          month: monthNum,
          income: monthInc,
          expense: monthExp,
          net: monthInc - monthExp
        };
      });

      return {
        status: 200,
        data: {
          year,
          months
        }
      };
    }

    if (['/finance/pnl', '/reports/pnl'].includes(path) && method === 'GET') {
      const expenses = db.getAll('expenses');
      const incomes = db.getAll('incomes');
      const totalExpense = expenses.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
      const totalIncome = incomes.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);

      const groupBy = (query.groupBy as 'month' | 'category') || 'month';
      let buckets: Array<{ key: string; label: string; income: number; expense: number; margin: number }> = [];

      if (groupBy === 'category') {
        const categories = db.getAll('expenseCategories');
        buckets = categories.map(cat => {
          const catExpenses = expenses.filter(e => e.expenseCategoryId === cat.id);
          const exp = catExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
          return {
            key: String(cat.id),
            label: cat.nameEs || cat.code,
            income: 0,
            expense: exp,
            margin: -exp
          };
        }).filter(b => b.expense > 0);
      } else {
        const monthMap = new Map<string, { income: number; expense: number }>();
        for (const inc of incomes) {
          const m = (inc.receivedAt || '').slice(0, 7);
          if (m) {
            const cur = monthMap.get(m) || { income: 0, expense: 0 };
            cur.income += Number(inc.amount) || 0;
            monthMap.set(m, cur);
          }
        }
        for (const exp of expenses) {
          const m = (exp.incurredAt || '').slice(0, 7);
          if (m) {
            const cur = monthMap.get(m) || { income: 0, expense: 0 };
            cur.expense += Number(exp.amount) || 0;
            monthMap.set(m, cur);
          }
        }
        buckets = Array.from(monthMap.entries()).sort((a, b) => a[0].localeCompare(b[0])).map(([key, val]) => ({
          key,
          label: key,
          income: val.income,
          expense: val.expense,
          margin: val.income - val.expense
        }));
      }

      const vetVisits = db.getAll('vetVisits');
      const treatments = db.getAll('treatments');
      const vaccinations = db.getAll('vaccinations');
      const pestControls = db.getAll('pestControls');
      const feedingRecords = db.getAll('feedingRecords');
      const reproductionServices = db.getAll('services');

      return {
        status: 200,
        data: {
          from: query.from || '2026-01-01',
          to: query.to || '2026-12-31',
          groupBy,
          totalIncome,
          totalExpense,
          margin: totalIncome - totalExpense,
          buckets,
          importedCosts: {
            treatments: treatments.reduce((sum, t) => sum + (Number(t.cost) || 0), 0),
            vaccinations: vaccinations.reduce((sum, v) => sum + (Number(v.cost) || 0), 0),
            pestControls: pestControls.reduce((sum, p) => sum + (Number(p.cost) || 0), 0),
            vetVisits: vetVisits.reduce((sum, v) => sum + (Number(v.cost) || 0), 0),
            feedingRecords: feedingRecords.reduce((sum, f) => sum + (Number(f.totalCost) || 0), 0),
            services: reproductionServices.reduce((sum, s) => sum + (Number(s.cost) || 0), 0)
          }
        }
      };
    }

    if (path === '/finance/cost-per-unit' && method === 'GET') {
      const expenses = db.getAll('expenses');
      const milkings = db.getAll('milkings');
      const totalExpense = expenses.reduce((acc, c) => acc + (Number(c.amount) || 0), 0);
      const totalLiters = milkings.reduce((acc, c) => acc + (Number(c.liters) || 0), 0);
      return {
        status: 200,
        data: {
          costPerLiter: totalLiters > 0 ? Number((totalExpense / totalLiters).toFixed(2)) : 0,
          costPerKgBeef: 0
        }
      };
    }

    const roiMatch = path.match(/^\/finance\/animal-roi(?:\/(\d+))?$/);
    if ((path === '/finance/animal-roi' || roiMatch) && method === 'GET') {
      const animalId = roiMatch?.[1] ? Number(roiMatch[1]) : (query.animalId ? Number(query.animalId) : 0);
      const animalTreatments = db.filter('treatments', t => t.animalId === animalId);
      const animalVaccinations = db.filter('vaccinations', v => v.animalId === animalId);
      const animalServices = db.filter('services', s => s.cowId === animalId);
      const animalExpenses = db.filter('expenses', e => e.animalId === animalId);
      const animalIncomes = db.filter('incomes', i => i.animalId === animalId);

      const treatmentsCost = animalTreatments.reduce((sum, t) => sum + (Number(t.cost) || 0), 0);
      const vaccinationsCost = animalVaccinations.reduce((sum, v) => sum + (Number(v.cost) || 0), 0);
      const servicesCost = animalServices.reduce((sum, s) => sum + (Number(s.cost) || 0), 0);
      const manualExpensesCost = animalExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

      const totalCost = treatmentsCost + vaccinationsCost + servicesCost + manualExpensesCost;
      const totalIncome = animalIncomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
      const roi = totalCost > 0 ? Number((((totalIncome - totalCost) / totalCost) * 100).toFixed(2)) : 0;

      return {
        status: 200,
        data: {
          animalId,
          totalIncome,
          totalCost,
          roi,
          costs: {
            treatments: treatmentsCost,
            vaccinationsIndividual: vaccinationsCost,
            vaccinationsProportionalLot: 0,
            services: servicesCost,
            manualExpenses: manualExpensesCost,
            feedingProportional: 0
          }
        }
      };
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
            counts: animals.length === 0 ? [0, 0, 0, 0, 0, 0] : [1, 2, 1, 0, 2, animals.length]
          }
        }
      };
    }

    if (path === '/dashboard/health' && method === 'GET') {
      const activeTreatments = db.filter('treatments', t => !t.endedAt);
      const vetVisits = db.getAll('vetVisits');
      return {
        status: 200,
        data: {
          upcomingVaccinations7d: 0,
          upcomingVaccinations30d: 0,
          activeDiagnoses: db.filter('diagnoses', d => d.status === 'ACTIVE').length,
          treatmentsActiveCount: activeTreatments.length,
          monthVetSpend: vetVisits.reduce((acc, v) => acc + (v.cost || 0), 0),
          topDiseasesQuarter: []
        }
      };
    }

    if (path === '/dashboard/production' && method === 'GET') {
      const allMilkings = db.getAll('milkings');
      const mtdMilkLiters = allMilkings.reduce((acc, c) => acc + c.liters, 0);
      const milkingFemales = db.filter('animals', a => a.status === 'ACTIVE' && a.sex === 'FEMALE');

      return {
        status: 200,
        data: {
          todayMilkLiters: 0,
          mtdMilkLiters,
          avgAdgKgDayThisMonth: 0,
          activeMilkingCows: milkingFemales.length
        }
      };
    }

    if (path === '/dashboard/reproduction' && method === 'GET') {
      const posPregnant = db.filter('pregnancyChecks', p => p.result === 'POSITIVE').length;
      return {
        status: 200,
        data: {
          pregnantConfirmed: posPregnant,
          upcomingCalvings21d: 0,
          openCows: 0,
          avgDaysOpen: 0
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
          ytdMargin: mtdIncome - mtdExpense,
          topExpenseCategoriesMonth: []
        }
      };
    }

    if (path === '/agenda/today' && method === 'GET') {
      // Retorna tareas únicamente si hay animales o tratamientos reales en la base de datos
      const activeTreatments = db.filter('treatments', t => !t.endedAt);
      const tasks = activeTreatments.map(t => {
        const animal = db.getById('animals', t.animalId);
        return {
          type: 'TREATMENT_OPEN',
          animalId: t.animalId,
          animalTag: animal?.internalTag ?? `Vaca #${t.animalId}`,
          lotId: animal?.lotId ?? 1,
          lotName: animal?.lotId ? (db.getById('lots', animal.lotId)?.name ?? 'Sin lote') : 'Sin lote',
          dueDate: t.startedAt,
          message: `Tratamiento en curso: ${t.notes || 'Aplicación veterinaria'}`,
          severity: 'high'
        };
      });

      return {
        status: 200,
        data: tasks
      };
    }

    if (path === '/alerts/predictive' && method === 'GET') {
      // Retorna alertas únicamente si hay animales reales en el sistema
      return {
        status: 200,
        data: []
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
          ageDays = Math.floor((new Date().getTime() - new Date(a.birthDate).getTime()) / (1000 * 60 * 60 * 24));
        }

        return {
          id: a.id,
          internalTag: a.internalTag,
          rfid: a.rfid,
          name: a.name,
          sex: a.sex,
          status: a.status,
          purpose: a.purpose,
          ranchName: ranch?.name ?? null,
          lotName: lot?.name ?? null,
          breedName: breed?.nameEs ?? null,
          birthDate: a.birthDate,
          ageDays,
          lastWeightKg: lastWeight
        };
      });

      return {
        status: 200,
        data: {
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
      const vaccinations = db.getAll('vaccinations');
      const diagnoses = db.getAll('diagnoses');
      const treatments = db.getAll('treatments');

      const monthMap = new Map<string, {
        month: string;
        vaccinations: number;
        diagnosesMild: number;
        diagnosesModerate: number;
        diagnosesSevere: number;
        treatments: number;
        totalCost: number;
      }>();

      for (const v of vaccinations) {
        const m = (v.appliedAt || '').slice(0, 7);
        if (m) {
          const cur = monthMap.get(m) || { month: m, vaccinations: 0, diagnosesMild: 0, diagnosesModerate: 0, diagnosesSevere: 0, treatments: 0, totalCost: 0 };
          cur.vaccinations += 1;
          cur.totalCost += Number(v.cost) || 0;
          monthMap.set(m, cur);
        }
      }
      for (const d of diagnoses) {
        const m = (d.diagnosedAt || '').slice(0, 7);
        if (m) {
          const cur = monthMap.get(m) || { month: m, vaccinations: 0, diagnosesMild: 0, diagnosesModerate: 0, diagnosesSevere: 0, treatments: 0, totalCost: 0 };
          const sev = (d.severity || '').toUpperCase();
          if (sev === 'LOW' || sev === 'MILD') cur.diagnosesMild += 1;
          else if (sev === 'MEDIUM' || sev === 'MODERATE') cur.diagnosesModerate += 1;
          else if (sev === 'HIGH' || sev === 'SEVERE') cur.diagnosesSevere += 1;
          monthMap.set(m, cur);
        }
      }
      for (const t of treatments) {
        const m = (t.startedAt || '').slice(0, 7);
        if (m) {
          const cur = monthMap.get(m) || { month: m, vaccinations: 0, diagnosesMild: 0, diagnosesModerate: 0, diagnosesSevere: 0, treatments: 0, totalCost: 0 };
          cur.treatments += 1;
          cur.totalCost += Number(t.cost) || 0;
          monthMap.set(m, cur);
        }
      }

      const months = Array.from(monthMap.values()).sort((a, b) => a.month.localeCompare(b.month));

      return {
        status: 200,
        data: {
          from: query.from || '2026-01-01',
          to: query.to || '2026-12-31',
          months
        }
      };
    }

    // -------------------------------------------------------------
    // TERRENOS, POTREROS Y CORRALES (LANDS)
    // -------------------------------------------------------------
    if (path === '/lands') {
      if (method === 'GET') {
        let lands = db.getAll('lands');
        if (query.ranchId) lands = lands.filter(l => l.ranchId === Number(query.ranchId));
        if (query.type) lands = lands.filter(l => l.type === query.type);
        return { status: 200, data: lands };
      }
      if (method === 'POST') {
        const item = db.insert('lands', {
          accountId: 1,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...body
        });
        return { status: 201, data: item };
      }
    }

    const landIdMatch = path.match(/^\/lands\/(\d+)$/);
    if (landIdMatch) {
      const lid = Number(landIdMatch[1]);
      if (method === 'GET') {
        const item = db.getById('lands', lid);
        return item ? { status: 200, data: item } : { status: 404, data: { message: 'Land not found' } };
      }
      if (method === 'PUT') {
        const updated = db.update('lands', lid, { ...body, updatedAt: new Date().toISOString() });
        return { status: 200, data: updated };
      }
      if (method === 'DELETE') {
        db.delete('lands', lid);
        return { status: 204, data: null };
      }
    }

    const landRotateMatch = path.match(/^\/lands\/(\d+)\/rotate$/);
    if (landRotateMatch && method === 'POST') {
      const lid = Number(landRotateMatch[1]);
      const current = db.getById('lands', lid);
      if (!current) return { status: 404, data: { message: 'Land not found' } };
      const newStatus = current.status === 'ACTIVE' ? 'RESTING' : 'ACTIVE';
      const updated = db.update('lands', lid, {
        status: newStatus,
        daysInRest: newStatus === 'RESTING' ? 1 : 0,
        daysInUse: newStatus === 'ACTIVE' ? 1 : 0,
        currentAnimalCount: newStatus === 'RESTING' ? 0 : (body.animalCount ?? 15),
        updatedAt: new Date().toISOString()
      });
      return { status: 200, data: updated };
    }

    // -------------------------------------------------------------
    // CULTIVOS, SIEMBRAS Y COSECHAS (CROPS, PLANTINGS, HARVESTS)
    // -------------------------------------------------------------
    if (path === '/crops') {
      if (method === 'GET') {
        return { status: 200, data: db.getAll('crops') };
      }
      if (method === 'POST') {
        const c = db.insert('crops', body);
        return { status: 201, data: c };
      }
    }

    if (path === '/plantings') {
      if (method === 'GET') {
        let list = db.getAll('plantings');
        if (query.ranchId) list = list.filter(p => p.ranchId === Number(query.ranchId));
        if (query.status) list = list.filter(p => p.status === query.status);
        return { status: 200, data: list };
      }
      if (method === 'POST') {
        const inv = (Number(body.seedCost) || 0) + (Number(body.fertilizerCost) || 0) + (Number(body.agrochemicalCost) || 0) + (Number(body.laborCost) || 0) + (Number(body.machineryCost) || 0);
        const item = db.insert('plantings', {
          accountId: 1,
          status: 'PLANNED',
          progressPercentage: 10,
          totalInvestment: inv,
          createdAt: new Date().toISOString(),
          ...body
        });
        return { status: 201, data: item };
      }
    }

    const plantingIdMatch = path.match(/^\/plantings\/(\d+)$/);
    if (plantingIdMatch) {
      const pid = Number(plantingIdMatch[1]);
      if (method === 'GET') {
        const item = db.getById('plantings', pid);
        return item ? { status: 200, data: item } : { status: 404, data: { message: 'Planting not found' } };
      }
      if (method === 'PUT') {
        const inv = (Number(body.seedCost) || 0) + (Number(body.fertilizerCost) || 0) + (Number(body.agrochemicalCost) || 0) + (Number(body.laborCost) || 0) + (Number(body.machineryCost) || 0);
        const updated = db.update('plantings', pid, { ...body, totalInvestment: inv > 0 ? inv : body.totalInvestment });
        return { status: 200, data: updated };
      }
      if (method === 'DELETE') {
        db.delete('plantings', pid);
        return { status: 204, data: null };
      }
    }

    if (path === '/harvests') {
      if (method === 'GET') {
        let list = db.getAll('harvests');
        if (query.ranchId) list = list.filter(h => h.ranchId === Number(query.ranchId));
        return { status: 200, data: list };
      }
      if (method === 'POST') {
        const yieldPerHa = body.areaHectares > 0 ? Number((body.totalYieldTons / body.areaHectares).toFixed(2)) : 0;
        const rev = (body.salePricePerTon || 0) * (body.totalYieldTons || 0);
        const item = db.insert('harvests', {
          accountId: 1,
          yieldPerHa,
          totalRevenue: rev,
          createdAt: new Date().toISOString(),
          ...body
        });
        // Si viene con plantingId, marcar planting como cosechada
        if (body.plantingId) {
          db.update('plantings', body.plantingId, {
            status: 'HARVESTED',
            actualHarvestDate: body.harvestDate || new Date().toISOString().split('T')[0],
            progressPercentage: 100
          });
        }
        return { status: 201, data: item };
      }
    }

    const harvestIdMatch = path.match(/^\/harvests\/(\d+)$/);
    if (harvestIdMatch && method === 'DELETE') {
      db.delete('harvests', Number(harvestIdMatch[1]));
      return { status: 204, data: null };
    }

    // -------------------------------------------------------------
    // MAQUINARIA Y EQUIPOS (MACHINERY, MAINTENANCES, FUEL)
    // -------------------------------------------------------------
    if (path === '/machinery') {
      if (method === 'GET') {
        let list = db.getAll('machinery');
        if (query.ranchId) list = list.filter(m => m.ranchId === Number(query.ranchId));
        return { status: 200, data: list };
      }
      if (method === 'POST') {
        const m = db.insert('machinery', {
          accountId: 1,
          status: 'OPERATIONAL',
          currentHoursMeter: 0,
          nextServiceHours: 250,
          createdAt: new Date().toISOString(),
          ...body
        });
        return { status: 201, data: m };
      }
    }

    const machineryIdMatch = path.match(/^\/machinery\/(\d+)$/);
    if (machineryIdMatch) {
      const mid = Number(machineryIdMatch[1]);
      if (method === 'GET') {
        const m = db.getById('machinery', mid);
        return m ? { status: 200, data: m } : { status: 404, data: { message: 'Machinery not found' } };
      }
      if (method === 'PUT') {
        const updated = db.update('machinery', mid, body);
        return { status: 200, data: updated };
      }
      if (method === 'DELETE') {
        db.delete('machinery', mid);
        return { status: 204, data: null };
      }
    }

    const machineryMaintMatch = path.match(/^\/machinery\/(\d+)\/maintenances$/);
    if (machineryMaintMatch) {
      const mid = Number(machineryMaintMatch[1]);
      if (method === 'GET') {
        const list = db.filter('machineryMaintenances', m => m.machineryId === mid);
        return { status: 200, data: list };
      }
      if (method === 'POST') {
        const item = db.insert('machineryMaintenances', {
          accountId: 1,
          machineryId: mid,
          createdAt: new Date().toISOString(),
          ...body
        });
        // Actualizar horas del próximo servicio en maquinaria
        const mach = db.getById('machinery', mid);
        if (mach && body.hoursMeter) {
          db.update('machinery', mid, {
            currentHoursMeter: Math.max(mach.currentHoursMeter, body.hoursMeter),
            nextServiceHours: body.hoursMeter + 250,
            status: 'OPERATIONAL'
          });
        }
        return { status: 201, data: item };
      }
    }

    if (path === '/machinery/maintenances' && method === 'GET') {
      return { status: 200, data: db.getAll('machineryMaintenances') };
    }

    const machineryFuelMatch = path.match(/^\/machinery\/(\d+)\/fuel$/);
    if (machineryFuelMatch) {
      const mid = Number(machineryFuelMatch[1]);
      if (method === 'GET') {
        const list = db.filter('fuelLogs', f => f.machineryId === mid);
        return { status: 200, data: list };
      }
      if (method === 'POST') {
        const total = (body.liters || 0) * (body.costPerLiter || 0);
        const item = db.insert('fuelLogs', {
          accountId: 1,
          machineryId: mid,
          totalCost: total,
          createdAt: new Date().toISOString(),
          ...body
        });
        // Actualizar horómetro si es mayor
        const mach = db.getById('machinery', mid);
        if (mach && body.hoursMeter && body.hoursMeter > mach.currentHoursMeter) {
          db.update('machinery', mid, { currentHoursMeter: body.hoursMeter });
        }
        return { status: 201, data: item };
      }
    }

    if (path === '/machinery/fuel' && method === 'GET') {
      return { status: 200, data: db.getAll('fuelLogs') };
    }

    // -------------------------------------------------------------
    // INSUMOS Y ALMACÉN (SUPPLIES)
    // -------------------------------------------------------------
    if (path === '/supplies') {
      if (method === 'GET') {
        return { status: 200, data: db.getAll('supplies') };
      }
      if (method === 'POST') {
        const item = db.insert('supplies', {
          accountId: 1,
          createdAt: new Date().toISOString(),
          ...body
        });
        return { status: 201, data: item };
      }
    }

    const supplyMovementMatch = path.match(/^\/supplies\/(\d+)\/movements$/);
    if (supplyMovementMatch && method === 'POST') {
      const sid = Number(supplyMovementMatch[1]);
      const sup = db.getById('supplies', sid);
      if (!sup) return { status: 404, data: { message: 'Supply item not found' } };
      const qty = Number(body.quantity) || 0;
      const total = qty * (Number(body.unitCost) || sup.costPerUnit);
      const isExit = body.type.startsWith('USAGE_');
      const newStock = isExit ? sup.currentStock - qty : sup.currentStock + qty;
      db.update('supplies', sid, { currentStock: Math.max(0, newStock) });

      const movement = db.insert('supplyMovements', {
        accountId: 1,
        supplyItemId: sid,
        totalCost: total,
        createdAt: new Date().toISOString(),
        ...body
      });
      return { status: 201, data: movement };
    }

    if (path === '/supplies/movements' && method === 'GET') {
      return { status: 200, data: db.getAll('supplyMovements') };
    }

    // -------------------------------------------------------------
    // COMERCIO AGROPECUARIO (TRADES: COMPRAS Y VENTAS)
    // -------------------------------------------------------------
    if (path === '/trades') {
      if (method === 'GET') {
        let list = db.getAll('trades');
        if (query.ranchId) list = list.filter(t => t.ranchId === Number(query.ranchId));
        if (query.type) list = list.filter(t => t.type === query.type);
        return { status: 200, data: list };
      }
      if (method === 'POST') {
        const tot = Number(body.totalAmount) || (Number(body.quantity || 0) * Number(body.unitPrice || 0));
        const item = db.insert('trades', {
          accountId: 1,
          totalAmount: tot,
          paymentStatus: body.paymentStatus || 'PAID',
          createdAt: new Date().toISOString(),
          ...body
        });
        return { status: 201, data: item };
      }
    }

    const tradeIdMatch = path.match(/^\/trades\/(\d+)$/);
    if (tradeIdMatch && method === 'DELETE') {
      db.delete('trades', Number(tradeIdMatch[1]));
      return { status: 204, data: null };
    }

    // -------------------------------------------------------------
    // AGRONOMY & FARM KPIS CONSOLIDATED
    // -------------------------------------------------------------
    if (path === '/agronomy/kpis' && method === 'GET') {
      const lands = db.getAll('lands');
      const plantings = db.getAll('plantings');
      const harvests = db.getAll('harvests');
      const machinery = db.getAll('machinery');
      const trades = db.getAll('trades');

      const totalHectaresPlantings = plantings
        .filter(p => p.status !== 'HARVESTED' && p.status !== 'LOST')
        .reduce((sum, p) => sum + (p.areaHectares || 0), 0);

      const totalTonsHarvested = harvests.reduce((sum, h) => sum + (h.totalYieldTons || 0), 0);
      const totalCropRevenue = harvests.reduce((sum, h) => sum + (h.totalRevenue || 0), 0);
      const totalMachineryCount = machinery.length;
      const operationalMachinery = machinery.filter(m => m.status === 'OPERATIONAL').length;

      const totalLivestockSales = trades
        .filter(t => t.type === 'SALE_LIVESTOCK')
        .reduce((sum, t) => sum + (t.totalAmount || 0), 0);

      const totalPastureHectares = lands
        .filter(l => l.type === 'PASTURE')
        .reduce((sum, l) => sum + (l.areaHectares || 0), 0);

      return {
        status: 200,
        data: {
          activeCropsHectares: Number(totalHectaresPlantings.toFixed(1)),
          totalTonsHarvested: Number(totalTonsHarvested.toFixed(1)),
          totalCropRevenue,
          totalLivestockSales,
          totalPastureHectares: Number(totalPastureHectares.toFixed(1)),
          machineryCount: totalMachineryCount,
          operationalMachinery,
          maintenancePendingCount: machinery.filter(m => m.currentHoursMeter >= m.nextServiceHours - 50).length
        }
      };
    }

    // Si ningun handler coincide, devuelve 200 vacio o 404 informativo
    console.warn('[ServerlessRouter unhandled route]', method, path);
    const isCollection = method === 'GET' && !path.match(/\/\d+$/);
    return {
      status: 200,
      data: isCollection || Array.isArray(body) ? [] : {}
    };
  }
}

export const serverlessRouter = new ServerlessRouter();
