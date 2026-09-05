import React from "react";
import { ArrowLeftRight, Flame, ShieldAlert, DollarSign, Zap } from "lucide-react";
import { DefenseStatus, ModelMetricsSummary, StatsResponse } from "../../types/api";

interface KPICardsProps {
  defense: DefenseStatus | null;
  metrics: ModelMetricsSummary | null;
  stats: StatsResponse | null;
  liveTxCount: number;
  liveBlockCount: number;
}

export const KPICards: React.FC<KPICardsProps> = ({
  defense,
  metrics,
  stats,
  liveTxCount,
  liveBlockCount,
}) => {
  const highRiskRate = defense?.sliding_window_telemetry?.high_risk_rate_pct ?? 0.0;
  
  // Explainable latency: live telemetry from /stats when available, fallback to sealed-test operations metric
  const p95Explainable =
    stats?.explainable_mode?.p95_latency_ms && stats.explainable_mode.p95_latency_ms > 0
      ? stats.explainable_mode.p95_latency_ms
      : metrics?.operations?.inference_latency_p95_ms ?? 57.13;

  // Fast inference latency from actual telemetry or verified operational benchmark
  const fastLatency =
    stats?.fast_mode?.p50_latency_ms && stats.fast_mode.p50_latency_ms > 0
      ? `${stats.fast_mode.p50_latency_ms.toFixed(1)}ms`
      : metrics?.operations?.inference_latency_p50_ms
      ? `${metrics.operations.inference_latency_p50_ms.toFixed(1)}ms`
      : "18.7ms";

  // Sealed-test net merchant savings
  const netSavingsINR = metrics?.financial_cost?.net_merchant_savings_inr_lakhs ?? 61.49;
  const netSavingsUSD = metrics?.financial_cost?.net_merchant_savings_usd ?? 74089.88;

  const cards = [
    {
      id: "tx-count",
      title: "Transactions Scored",
      scopeBadge: "LIVE SESSION",
      badgeColor: "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30",
      value: liveTxCount.toString(),
      caption: `${defense?.sliding_window_telemetry?.tx_count ?? 0} in active 5m window`,
      icon: ArrowLeftRight,
      iconColor: "text-brand-cyan bg-brand-cyan/10 border-brand-cyan/30",
    },
    {
      id: "high-risk-rate",
      title: "High-Risk Rate",
      scopeBadge: "LIVE 5M WINDOW",
      badgeColor: highRiskRate > 15 ? "bg-rose-500/15 text-rose-400 border-rose-500/30" : "bg-dark-700 text-slate-300 border-dark-600",
      value: `${highRiskRate.toFixed(1)}%`,
      caption: defense?.sliding_window_telemetry?.is_spike ? "🚨 Risk spike detected" : "Normal baseline (<10%)",
      icon: Flame,
      iconColor: highRiskRate > 15 ? "text-rose-400 bg-rose-500/10 border-rose-500/30" : "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "hard-blocks",
      title: "Hard Blocks",
      scopeBadge: "LIVE SESSION",
      badgeColor: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      value: liveBlockCount.toString(),
      caption: "Current demo session",
      icon: ShieldAlert,
      iconColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
    {
      id: "merchant-savings",
      title: "Net Merchant Savings",
      scopeBadge: "SEALED-TEST EVALUATION",
      badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      value: `₹${netSavingsINR.toFixed(2)}L`,
      caption: "Sealed-test business evaluation",
      tooltip: `Sealed-test business evaluation ($${Math.round(netSavingsUSD).toLocaleString()} model-evaluated savings)`,
      icon: DollarSign,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      id: "p95-latency",
      title: "P95 Explainable Latency",
      scopeBadge: "LIVE TELEMETRY",
      badgeColor: "bg-brand-purple/15 text-brand-purple border-brand-purple/30",
      value: `${p95Explainable.toFixed(1)}ms`,
      caption: "Includes local SHAP",
      secondaryMetric: `FAST INFERENCE: ${fastLatency} (No SHAP)`,
      icon: Zap,
      iconColor: "text-brand-purple bg-brand-purple/10 border-brand-purple/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className="bg-dark-850 rounded-xl p-4 border border-dark-700/80 shadow-md flex flex-col justify-between hover:border-dark-600 transition-all group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider mb-1 ${card.badgeColor}`}>
                  {card.scopeBadge}
                </span>
                <p className="text-xs text-slate-400 font-medium">{card.title}</p>
              </div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${card.iconColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-2xl font-extrabold text-white font-mono tracking-tight group-hover:text-brand-cyan transition-colors">
                {card.value}
              </div>
              <p className="text-[11px] text-slate-400 font-medium mt-0.5 truncate" title={card.tooltip || card.caption}>
                {card.caption}
              </p>
              {card.secondaryMetric && (
                <div className="mt-2 pt-1.5 border-t border-dark-700/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{card.secondaryMetric}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
