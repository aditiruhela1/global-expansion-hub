import { useEffect, useMemo, useState } from "react";
import { Truck, Calculator, Receipt } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { COUNTRIES } from "@/utils/countries";

export default function Fulfillment() {
  const [country, setCountry] = useState(COUNTRIES[0].name);
  const [unitCost, setUnitCost] = useState(10);
  const [shipping, setShipping] = useState(5);
  const [duties, setDuties] = useState(2);
  const [sellPrice, setSellPrice] = useState(35);

  useEffect(() => { document.title = "Fulfillment & Tax — GlobeNest"; }, []);

  const selected = COUNTRIES.find((c) => c.name === country)!;

  const calc = useMemo(() => {
    const totalCost = Number(unitCost) + Number(shipping) + Number(duties);
    const profit = Number(sellPrice) - totalCost;
    const margin = sellPrice > 0 ? (profit / Number(sellPrice)) * 100 : 0;
    return { totalCost, profit, margin };
  }, [unitCost, shipping, duties, sellPrice]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Fulfillment & tax</h1>
        <p className="mt-1 text-muted-foreground">Recommended carriers, local tax basics, and a quick profit calculator.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">Country</Label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 text-sm"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Truck className="h-4 w-4" />
            </div>
            <h3 className="font-display text-lg font-semibold">Recommended carriers</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {selected.carriers.map((c) => (
              <Badge key={c} variant="outline" className="text-sm">{c}</Badge>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            These are the most common shipping partners for {selected.name}. Compare rates before committing.
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="mb-4 flex items-center gap-2">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
              <Receipt className="h-4 w-4" />
            </div>
            <h3 className="font-display text-lg font-semibold">Tax basics</h3>
          </div>
          <p className="text-sm">
            <span className="font-medium">Local rate:</span> {selected.vat}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Always verify thresholds for non-resident sellers. Consider registering once you cross local
            distance-selling limits.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-card/50 p-6 shadow-card">
        <div className="mb-6 flex items-center gap-2">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground">
            <Calculator className="h-4 w-4" />
          </div>
          <h3 className="font-display text-lg font-semibold">Profit calculator</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <CalcInput label="Unit cost" value={unitCost} onChange={setUnitCost} />
          <CalcInput label="Shipping" value={shipping} onChange={setShipping} />
          <CalcInput label="Duties / tax" value={duties} onChange={setDuties} />
          <CalcInput label="Selling price" value={sellPrice} onChange={setSellPrice} />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <ResultCard label="Total cost" value={`$${calc.totalCost.toFixed(2)}`} />
          <ResultCard label="Profit per unit" value={`$${calc.profit.toFixed(2)}`} positive={calc.profit >= 0} />
          <ResultCard label="Margin" value={`${calc.margin.toFixed(1)}%`} positive={calc.margin >= 0} />
        </div>
      </div>
    </div>
  );
}

function CalcInput({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label} ($)</Label>
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ResultCard({ label, value, positive = true }: { label: string; value: string; positive?: boolean }) {
  return (
    <div className="rounded-xl border border-border/60 bg-background/50 p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl font-bold ${positive ? "" : "text-destructive"}`}>{value}</div>
    </div>
  );
}
