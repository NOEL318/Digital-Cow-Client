/**
 * Página de Comercio Agropecuario: Compras, Ventas e Inventario de Insumos.
 * Manejo integral de ventas de ganado en pie/canal con pesaje y merma,
 * ventas de cosechas por tonelada, compras de fertilizantes/semillas y stock de bodega.
 */
import { useState } from 'react';
import {
  Handshake, TrendingUp, Plus,
  Package, AlertTriangle, ArrowDownRight, ArrowUpRight, BarChart3
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  useTrades, useSupplies, tradeApi,
  type CreateTradePayload, type CreateSupplyMovementPayload
} from '@/features/trade/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmptyState } from '@/components/ui/empty-state';
import { useQueryClient } from '@tanstack/react-query';

export default function TradePage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'purchases' | 'supplies'>('sales');
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [tradeModalDefaultType, setTradeModalDefaultType] = useState<CreateTradePayload['type']>('SALE_LIVESTOCK');
  const [movementModalOpen, setMovementModalOpen] = useState(false);
  const [selectedSupplyId, setSelectedSupplyId] = useState<number | undefined>();

  const queryClient = useQueryClient();
  const { data: trades = [] } = useTrades();
  const { data: supplies = [] } = useSupplies();

  const sales = trades.filter(t => t.type.startsWith('SALE_'));
  const purchases = trades.filter(t => t.type.startsWith('PURCHASE_'));

  const totalSalesAmount = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
  const totalPurchasesAmount = purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const netTradeBalance = totalSalesAmount - totalPurchasesAmount;

  const lowStockSuppliesCount = supplies.filter(s => s.currentStock <= s.minStockAlert).length;

  const openNewTrade = (type: CreateTradePayload['type']) => {
    setTradeModalDefaultType(type);
    setTradeModalOpen(true);
  };

  const openMovement = (supplyId: number) => {
    setSelectedSupplyId(supplyId);
    setMovementModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header con colores de sección (Oro / Esmeralda Financiero) y Glassmorphism */}
      <div className="glass-panel p-6 border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-amber-500/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-700 text-white rounded-2xl shadow-lg shadow-emerald-700/30">
            <Handshake className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Comercio Agropecuario</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300/40">
                Ventas, Compras & Insumos
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">Ventas de ganado por kg en báscula, ventas de cosechas por tonelada e inventario de bodega.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={() => openNewTrade('SALE_LIVESTOCK')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md shadow-emerald-600/20 gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            Nueva Venta
          </Button>
          <Button
            onClick={() => openNewTrade('PURCHASE_INPUTS')}
            variant="outline"
            className="border-amber-600/40 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 gap-2"
          >
            <ArrowDownRight className="h-4 w-4" />
            Registrar Compra
          </Button>
        </div>
      </div>

      {/* KPI Stats Rápidos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="glass-gradient-emerald p-4 border-l-4 border-l-emerald-600 flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 rounded-xl">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">${totalSalesAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Ventas Totales</div>
          </div>
        </div>

        <div className="glass-gradient-amber p-4 border-l-4 border-l-amber-600 flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/15 text-amber-700 dark:text-amber-300 rounded-xl">
            <ArrowDownRight className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700 dark:text-amber-400">${totalPurchasesAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Compras Insumos</div>
          </div>
        </div>

        <div className="glass-gradient-teal p-4 border-l-4 border-l-teal-600 flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/15 text-teal-700 dark:text-teal-300 rounded-xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">${netTradeBalance.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Margen Neto Comercial</div>
          </div>
        </div>

        <div className="glass-gradient-blue p-4 border-l-4 border-l-sky-600 flex items-center gap-3">
          <div className="p-2.5 bg-sky-500/15 text-sky-700 dark:text-sky-300 rounded-xl">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-foreground">{supplies.length} <span className="text-xs font-normal text-muted-foreground">artículos</span></div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              {lowStockSuppliesCount > 0 ? (
                <span className="text-red-500 font-bold flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> {lowStockSuppliesCount} con stock bajo
                </span>
              ) : 'Stock en regla'}
            </div>
          </div>
        </div>
      </div>

      {/* Gráfica de Balance Comercial */}
      {(sales.length > 0 || purchases.length > 0) && (
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-600" />
              <h3 className="font-bold text-base text-foreground">Flujo Comercial y Balance Operativo</h3>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{trades.length} operaciones registradas</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Ventas Totales', monto: totalSalesAmount, fill: '#059669' },
                  { name: 'Compras Insumos', monto: totalPurchasesAmount, fill: '#d97706' },
                  { name: 'Margen Neto', monto: Math.max(0, netTradeBalance), fill: '#0d9488' }
                ]}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Monto']}
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="monto" name="Monto ($)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl glass-card border border-white/60 dark:border-white/10 backdrop-blur-xl shadow-sm">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 ${
            activeTab === 'sales'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 border border-white/20 font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <ArrowUpRight className="h-4 w-4" />
          <span>Ventas de Ganado & Cosechas</span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'sales' ? 'bg-white/25 text-white' : 'bg-muted text-muted-foreground'}`}>
            {sales.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 ${
            activeTab === 'purchases'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 border border-white/20 font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <ArrowDownRight className="h-4 w-4" />
          <span>Compras</span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'purchases' ? 'bg-white/25 text-white' : 'bg-muted text-muted-foreground'}`}>
            {purchases.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('supplies')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all duration-150 ${
            activeTab === 'supplies'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 border border-white/20 font-bold'
              : 'text-muted-foreground hover:text-foreground hover:bg-white/40 dark:hover:bg-slate-800/40'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Inventario en Bodega</span>
          <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'supplies' ? 'bg-white/25 text-white' : 'bg-muted text-muted-foreground'}`}>
            {supplies.length}
          </span>
        </button>
      </div>

      {/* Tab: Ventas */}
      {activeTab === 'sales' && (
        sales.length === 0 ? (
          <EmptyState
            icon={ArrowUpRight}
            title="No hay ventas comerciales registradas"
            description="Registra ventas de ganado por kg en báscula con merma de transporte, contratos de leche o cosechas por tonelada."
            ctaLabel="Nueva Venta"
            onCta={() => openNewTrade('SALE_LIVESTOCK')}
          />
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Tipo Venta</th>
                    <th className="px-4 py-3">Comprador / Cliente</th>
                    <th className="px-4 py-3">Detalle / Pesaje</th>
                    <th className="px-4 py-3">Cantidad</th>
                    <th className="px-4 py-3">Precio Unitario</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sales.map(s => (
                    <tr key={s.id} className="hover:bg-accent/40 transition-colors">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{s.tradeDate}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-800 dark:text-emerald-300">
                        {s.type === 'SALE_LIVESTOCK' ? 'Ganado en Pie' :
                         s.type === 'SALE_CROP' ? 'Cosecha de Grano' : 'Venta de Leche'}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{s.entityName}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">
                        {s.description}
                        {s.shrinkagePercentage && <span className="block text-[11px] text-amber-600 font-semibold">Merma flete: {s.shrinkagePercentage}%</span>}
                      </td>
                      <td className="px-4 py-3 font-bold">{s.quantity.toLocaleString()} {s.unit}</td>
                      <td className="px-4 py-3 text-muted-foreground">${s.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {s.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-black text-emerald-700 dark:text-emerald-400">
                        ${s.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Tab: Compras */}
      {activeTab === 'purchases' && (
        purchases.length === 0 ? (
          <EmptyState
            icon={ArrowDownRight}
            title="No hay compras registradas"
            description="Registra compras de fertilizantes, semillas, agroquímicos, ganado de engorda o refacciones de maquinaria."
            ctaLabel="Registrar Compra"
            onCta={() => openNewTrade('PURCHASE_INPUTS')}
          />
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-muted/50 border-b border-border text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Tipo Compra</th>
                    <th className="px-4 py-3">Proveedor</th>
                    <th className="px-4 py-3">Concepto</th>
                    <th className="px-4 py-3">Cantidad</th>
                    <th className="px-4 py-3">Precio Unitario</th>
                    <th className="px-4 py-3">Factura</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {purchases.map(p => (
                    <tr key={p.id} className="hover:bg-accent/40 transition-colors">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">{p.tradeDate}</td>
                      <td className="px-4 py-3 font-semibold text-amber-800 dark:text-amber-300">
                        {p.type === 'PURCHASE_INPUTS' ? 'Insumos Agrícolas' :
                         p.type === 'PURCHASE_LIVESTOCK' ? 'Ganado / Pie de Cría' : 'Maquinaria / Refacciones'}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">{p.entityName}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{p.description}</td>
                      <td className="px-4 py-3 font-bold">{p.quantity.toLocaleString()} {p.unit}</td>
                      <td className="px-4 py-3 text-muted-foreground">${p.unitPrice.toFixed(2)}</td>
                      <td className="px-4 py-3 text-xs font-mono">{p.invoiceNumber ?? '-'}</td>
                      <td className="px-4 py-3 text-right font-black text-amber-700 dark:text-amber-400">
                        ${p.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Tab: Inventario de Bodega */}
      {activeTab === 'supplies' && (
        supplies.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No hay insumos registrados en bodega"
            description="Lleva el inventario de bodega de alimentos, fertilizantes, semillas y agroquímicos con alertas de stock mínimo."
            ctaLabel="Registrar Insumo"
            onCta={() => openNewTrade('PURCHASE_INPUTS')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplies.map(sup => {
              const isLowStock = sup.currentStock <= sup.minStockAlert;
              return (
                <div
                  key={sup.id}
                  className={`glass-card p-5 relative overflow-hidden flex flex-col justify-between border-t-4 ${
                    isLowStock ? 'border-t-red-500' : 'border-t-emerald-500'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground border border-border">
                          {sup.category}
                        </span>
                        <h4 className="font-bold text-base mt-1 text-foreground leading-snug">{sup.name}</h4>
                      </div>
                      {isLowStock && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" /> Bajo Stock
                        </span>
                      )}
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-border/50 space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-xs text-muted-foreground">Existencia actual:</span>
                        <span className="text-2xl font-black text-foreground">
                          {sup.currentStock.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">{sup.unit}</span>
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                        <span>Costo unitario: <strong>${sup.costPerUnit}</strong></span>
                        <span>Alerta si &lt; <strong>{sup.minStockAlert} {sup.unit}</strong></span>
                      </div>
                    </div>

                    {sup.warehouseLocation && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Package className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="truncate">{sup.warehouseLocation}</span>
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-border/60">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openMovement(sup.id)}
                      className="w-full text-xs font-medium gap-1.5 hover:border-emerald-500 hover:text-emerald-700"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Registrar Entrada / Salida
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* MODAL: Nueva Venta / Compra */}
      <NewTradeModal
        open={tradeModalOpen}
        defaultType={tradeModalDefaultType}
        onClose={() => setTradeModalOpen(false)}
        onSaved={() => queryClient.invalidateQueries({ queryKey: ['trades'] })}
      />

      {/* MODAL: Movimiento de Insumo */}
      <NewSupplyMovementModal
        open={movementModalOpen}
        supplyId={selectedSupplyId}
        onClose={() => setMovementModalOpen(false)}
        onSaved={() => {
          queryClient.invalidateQueries({ queryKey: ['supplies'] });
          queryClient.invalidateQueries({ queryKey: ['supplyMovements'] });
        }}
      />
    </div>
  );
}

function NewTradeModal({ open, defaultType, onClose, onSaved }: { open: boolean; defaultType: CreateTradePayload['type']; onClose: () => void; onSaved: () => void }) {
  const [formData, setFormData] = useState<CreateTradePayload>({
    ranchId: 1,
    type: defaultType,
    tradeDate: new Date().toISOString().split('T')[0],
    entityName: '',
    description: '',
    quantity: 1,
    unit: 'KG_LIVE',
    unitPrice: 50,
    paymentStatus: 'PAID',
    invoiceNumber: '',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tradeApi.createTrade(formData);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const isSale = formData.type.startsWith('SALE_');

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-lg glass-card border border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Handshake className="h-5 w-5" /> {isSale ? 'Registrar Venta' : 'Registrar Compra'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tipo de Operación</Label>
              <select
                className="glass-input mt-1"
                value={formData.type}
                onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
              >
                <optgroup label="Ventas">
                  <option value="SALE_LIVESTOCK">Venta Ganado en Pie</option>
                  <option value="SALE_CROP">Venta de Cosecha / Grano</option>
                  <option value="SALE_MILK">Venta de Leche</option>
                </optgroup>
                <optgroup label="Compras">
                  <option value="PURCHASE_INPUTS">Compra de Insumos (Semilla, Abono)</option>
                  <option value="PURCHASE_LIVESTOCK">Compra de Ganado</option>
                  <option value="PURCHASE_EQUIPMENT">Compra de Maquinaria / Refacciones</option>
                </optgroup>
              </select>
            </div>
            <div>
              <Label className="text-xs">Fecha</Label>
              <Input
                type="date"
                required
                value={formData.tradeDate}
                onChange={e => setFormData(p => ({ ...p, tradeDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">{isSale ? 'Comprador / Cliente' : 'Proveedor'}</Label>
              <Input
                placeholder="Nombre o razón social"
                required
                value={formData.entityName}
                onChange={e => setFormData(p => ({ ...p, entityName: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Folio Factura / Nota</Label>
              <Input
                placeholder="FAC-00123"
                value={formData.invoiceNumber}
                onChange={e => setFormData(p => ({ ...p, invoiceNumber: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Concepto / Detalle de la Transacción</Label>
            <Input
              placeholder="Ej. Venta de 10 novillos engordados en corral"
              required
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Cantidad</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.quantity}
                onChange={e => setFormData(p => ({ ...p, quantity: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label className="text-xs">Unidad</Label>
              <Input
                placeholder="KG, TON, BULTOS..."
                value={formData.unit}
                onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))}
              />
            </div>
            <div>
              <Label className="text-xs">Precio Unitario ($)</Label>
              <Input
                type="number"
                step="0.01"
                required
                value={formData.unitPrice}
                onChange={e => setFormData(p => ({ ...p, unitPrice: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl flex justify-between items-center text-sm font-bold border border-border/50">
            <span>Importe Total:</span>
            <span className="text-emerald-700 dark:text-emerald-400 text-lg">
              ${(formData.quantity * formData.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Guardar Transacción</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewSupplyMovementModal({ open, supplyId, onClose, onSaved }: { open: boolean; supplyId?: number; onClose: () => void; onSaved: () => void }) {
  const { data: supplies = [] } = useSupplies();
  const selectedSup = supplies.find(s => s.id === supplyId) || supplies[0];

  const [formData, setFormData] = useState<CreateSupplyMovementPayload>({
    supplyItemId: selectedSup ? selectedSup.id : 1,
    movementDate: new Date().toISOString().split('T')[0],
    type: 'USAGE_CROP',
    quantity: 1,
    unitCost: selectedSup ? selectedSup.costPerUnit : 100,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tradeApi.createSupplyMovement(formData.supplyItemId, formData);
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="max-w-md glass-card border border-emerald-500/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
            <Package className="h-5 w-5" /> Salida / Consumo de Insumo
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className="text-xs">Insumo</Label>
            <select
              className="glass-input mt-1"
              value={formData.supplyItemId}
              onChange={e => {
                const sid = Number(e.target.value);
                const s = supplies.find(x => x.id === sid);
                setFormData(p => ({
                  ...p,
                  supplyItemId: sid,
                  unitCost: s ? s.costPerUnit : p.unitCost
                }));
              }}
            >
              {supplies.map(s => (
                <option key={s.id} value={s.id}>{s.name} (Stock: {s.currentStock} {s.unit})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Destino / Uso</Label>
              <select
                className="glass-input mt-1"
                value={formData.type}
                onChange={e => setFormData(p => ({ ...p, type: e.target.value as any }))}
              >
                <option value="USAGE_CROP">Aplicación en Cultivo / Siembra</option>
                <option value="USAGE_LIVESTOCK">Alimentación / Manejo Ganado</option>
                <option value="USAGE_MACHINERY">Consumo en Maquinaria (Diesel)</option>
                <option value="ADJUSTMENT">Ajuste de Inventario</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Fecha</Label>
              <Input
                type="date"
                required
                value={formData.movementDate}
                onChange={e => setFormData(p => ({ ...p, movementDate: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label className="text-xs">Cantidad a Retirar ({selectedSup?.unit ?? 'Unidades'})</Label>
            <Input
              type="number"
              step="0.01"
              required
              value={formData.quantity}
              onChange={e => setFormData(p => ({ ...p, quantity: Number(e.target.value) }))}
            />
          </div>

          <div>
            <Label className="text-xs">Observaciones</Label>
            <Input
              placeholder="Parcela, lote o máquina destino..."
              value={formData.notes}
              onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">Registrar Salida</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
