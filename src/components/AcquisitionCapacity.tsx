import { useState, useMemo, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import CommandButton from './CommandButton';

type Mode = 'affordability' | 'mortgage' | 'seller';

interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

const MODE_CONFIG: Record<Mode, { title: string; sub: string; resultLabel: string; cta: string }> = {
  affordability: {
    title: 'How much house can I afford?',
    sub: 'Our affordability calculator estimates how much you can pay on a new home, your down payment, and your closing costs.',
    resultLabel: 'You can afford',
    cta: 'Get Started',
  },
  mortgage: {
    title: 'Mortgage Calculator',
    sub: 'Enter your details below to estimate your monthly mortgage payment with taxes, fees and insurance.',
    resultLabel: 'Monthly payment',
    cta: 'Get Started',
  },
  seller: {
    title: 'Seller Net Proceeds',
    sub: 'Estimate your take-home profit after commissions, closing costs, and outstanding mortgage balance.',
    resultLabel: 'Estimated proceeds',
    cta: 'Get Started',
  },
};

const TERMS = [
  { label: '30 years', value: 30 },
  { label: '20 years', value: 20 },
  { label: '15 years', value: 15 },
];

const PMI_ANNUAL_RATE = 0.005;

function formatCurrency(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function InputGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="acq-input-group">
      <label className="acq-label">{label}</label>
      {children}
    </div>
  );
}

function DollarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="acq-input-symbol">
      <span className="acq-symbol-prefix">$</span>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </div>
  );
}

function PercentInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="acq-input-pct">
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
      <span className="acq-symbol-suffix">%</span>
    </div>
  );
}

function DualInput({
  dollarValue,
  percentValue,
  onDollarChange,
  onPercentChange,
}: {
  dollarValue: number;
  percentValue: number;
  onDollarChange: (v: number) => void;
  onPercentChange: (v: number) => void;
}) {
  return (
    <div className="acq-dual-row">
      <DollarInput value={dollarValue} onChange={onDollarChange} />
      <PercentInput value={percentValue} onChange={onPercentChange} />
    </div>
  );
}

function TermSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <select className="acq-select" value={value} onChange={(e) => onChange(Number(e.target.value))}>
      {TERMS.map((t) => (
        <option key={t.value} value={t.value}>{t.label}</option>
      ))}
    </select>
  );
}

function BreakdownBar({ items }: { items: BreakdownItem[] }) {
  const total = items.reduce((s, i) => s + Math.max(0, i.value), 0);
  if (total <= 0) return null;

  return (
    <div className="acq-bar">
      {items.map((item) => (
        <div
          key={item.label}
          className="acq-bar-seg"
          style={{ width: `${(Math.max(0, item.value) / total) * 100}%`, background: item.color }}
        />
      ))}
    </div>
  );
}

function LegendList({ items }: { items: BreakdownItem[] }) {
  return (
    <div className="acq-legend">
      {items.map((item) => (
        <div key={item.label} className="acq-legend-item">
          <span className="acq-legend-left">
            <span className="acq-dot" style={{ background: item.color }} />
            {item.label}
          </span>
          <span className="acq-legend-val">{formatCurrency(item.value)}</span>
        </div>
      ))}
    </div>
  );
}

function AdvancedFields({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="acq-advanced">
      <button type="button" className="acq-advanced-toggle" onClick={() => setOpen(!open)}>
        <span>Advanced</span>
        <ChevronDown size={16} className={`acq-advanced-icon${open ? ' acq-advanced-icon-open' : ''}`} />
      </button>
      {open && <div className="acq-advanced-fields">{children}</div>}
    </div>
  );
}

function AffordabilityInputs({
  values,
  onChange,
}: {
  values: { income: number; debts: number; downDollar: number; downPercent: number; term: number; rate: number; taxRate: number; insRate: number; hoa: number };
  onChange: (key: string, val: number) => void;
}) {
  return (
    <>
      <InputGroup label="Annual income">
        <DollarInput value={values.income} onChange={(v) => onChange('income', v)} />
      </InputGroup>
      <InputGroup label="Monthly debts">
        <DollarInput value={values.debts} onChange={(v) => onChange('debts', v)} />
      </InputGroup>
      <InputGroup label="Down payment">
        <DualInput
          dollarValue={values.downDollar}
          percentValue={values.downPercent}
          onDollarChange={(v) => onChange('downDollar', v)}
          onPercentChange={(v) => onChange('downPercent', v)}
        />
      </InputGroup>
      <InputGroup label="Loan term">
        <TermSelect value={values.term} onChange={(v) => onChange('term', v)} />
      </InputGroup>
      <InputGroup label="Interest rate">
        <PercentInput value={values.rate} onChange={(v) => onChange('rate', v)} />
      </InputGroup>
      <AdvancedFields>
        <InputGroup label="Property tax rate">
          <PercentInput value={values.taxRate} onChange={(v) => onChange('taxRate', v)} />
        </InputGroup>
        <InputGroup label="Insurance rate">
          <PercentInput value={values.insRate} onChange={(v) => onChange('insRate', v)} />
        </InputGroup>
        <InputGroup label="Monthly HOA">
          <DollarInput value={values.hoa} onChange={(v) => onChange('hoa', v)} />
        </InputGroup>
      </AdvancedFields>
    </>
  );
}

function MortgageInputs({
  values,
  onChange,
}: {
  values: { price: number; downDollar: number; downPercent: number; term: number; rate: number; taxRate: number; insRate: number; hoa: number };
  onChange: (key: string, val: number) => void;
}) {
  return (
    <>
      <InputGroup label="Home price">
        <DollarInput value={values.price} onChange={(v) => onChange('price', v)} />
      </InputGroup>
      <InputGroup label="Down payment">
        <DualInput
          dollarValue={values.downDollar}
          percentValue={values.downPercent}
          onDollarChange={(v) => onChange('downDollar', v)}
          onPercentChange={(v) => onChange('downPercent', v)}
        />
      </InputGroup>
      <InputGroup label="Loan term">
        <TermSelect value={values.term} onChange={(v) => onChange('term', v)} />
      </InputGroup>
      <InputGroup label="Interest rate">
        <PercentInput value={values.rate} onChange={(v) => onChange('rate', v)} />
      </InputGroup>
      <AdvancedFields>
        <InputGroup label="Property tax rate">
          <PercentInput value={values.taxRate} onChange={(v) => onChange('taxRate', v)} />
        </InputGroup>
        <InputGroup label="Insurance rate">
          <PercentInput value={values.insRate} onChange={(v) => onChange('insRate', v)} />
        </InputGroup>
        <InputGroup label="Monthly HOA">
          <DollarInput value={values.hoa} onChange={(v) => onChange('hoa', v)} />
        </InputGroup>
      </AdvancedFields>
    </>
  );
}

function SellerInputs({
  values,
  onChange,
}: {
  values: { salePrice: number; mortgage: number; commission: number; closingCosts: number };
  onChange: (key: string, val: number) => void;
}) {
  return (
    <>
      <InputGroup label="Home sale price">
        <DollarInput value={values.salePrice} onChange={(v) => onChange('salePrice', v)} />
      </InputGroup>
      <InputGroup label="Outstanding mortgage">
        <DollarInput value={values.mortgage} onChange={(v) => onChange('mortgage', v)} />
      </InputGroup>
      <InputGroup label="Agent commission">
        <PercentInput value={values.commission} onChange={(v) => onChange('commission', v)} />
      </InputGroup>
      <InputGroup label="Other closing costs">
        <DollarInput value={values.closingCosts} onChange={(v) => onChange('closingCosts', v)} />
      </InputGroup>
    </>
  );
}

export default function AcquisitionCapacity() {
  const [mode, setMode] = useState<Mode>('affordability');

  const [affValues, setAffValues] = useState({ income: 100000, debts: 500, downDollar: 60000, downPercent: 20, term: 30, rate: 6.5, taxRate: 1.2, insRate: 0.4, hoa: 0 });
  const [mtgValues, setMtgValues] = useState({ price: 300000, downDollar: 60000, downPercent: 20, term: 30, rate: 6.5, taxRate: 1.2, insRate: 0.4, hoa: 0 });
  const [selValues, setSelValues] = useState({ salePrice: 500000, mortgage: 200000, commission: 5, closingCosts: 8000 });

  const handleAffChange = useCallback((key: string, val: number) => {
    setAffValues((p) => {
      const next = { ...p, [key]: val };
      if ((key === 'downDollar' || key === 'downPercent') && p.downPercent > 0 && p.downDollar > 0) {
        const impliedPrice = p.downDollar / (p.downPercent / 100);
        if (key === 'downDollar') {
          next.downPercent = Math.round((val / impliedPrice) * 10000) / 100;
        } else {
          next.downDollar = Math.round(impliedPrice * (val / 100));
        }
      }
      return next;
    });
  }, []);

  const handleMtgChange = useCallback((key: string, val: number) => {
    setMtgValues((p) => {
      const next = { ...p, [key]: val };
      if (key === 'downDollar' && p.price > 0) {
        next.downPercent = Math.round((val / p.price) * 10000) / 100;
      } else if (key === 'downPercent') {
        next.downDollar = Math.round(p.price * (val / 100));
      } else if (key === 'price' && val > 0) {
        next.downDollar = Math.round(val * (p.downPercent / 100));
      }
      return next;
    });
  }, []);

  const handleSelChange = useCallback((key: string, val: number) => setSelValues((p) => ({ ...p, [key]: val })), []);

  const result = useMemo(() => {
    if (mode === 'affordability') {
      const monthlyIncome = affValues.income / 12;
      const budget = monthlyIncome * 0.28 - affValues.debts - affValues.hoa;
      if (budget <= 0) return { main: 0, secondary: 0, secondaryLabel: 'Down payment', breakdown: [] };

      const mr = affValues.rate / 100 / 12;
      const n = affValues.term * 12;
      const pf = mr > 0 ? (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : 1 / n;
      const mtr = affValues.taxRate / 100 / 12;
      const mir = affValues.insRate / 100 / 12;
      const mpmr = PMI_ANNUAL_RATE / 12;
      const D = affValues.downDollar;

      const priceNoPmi = (budget + D * pf) / (pf + mtr + mir);
      let homePrice: number;
      let hasPmi = false;

      if (priceNoPmi > 0 && D / priceNoPmi >= 0.20) {
        homePrice = priceNoPmi;
      } else {
        homePrice = Math.max(0, (budget + D * (pf + mpmr)) / (pf + mpmr + mtr + mir));
        hasPmi = homePrice > 0 && D / homePrice < 0.20;
      }

      homePrice = Math.round(homePrice);
      const loan = Math.max(0, homePrice - D);
      const monthlyPI = Math.round(loan * pf);
      const monthlyTax = Math.round(homePrice * mtr);
      const monthlyIns = Math.round(homePrice * mir);
      const monthlyPmi = hasPmi ? Math.round(loan * mpmr) : 0;

      const breakdown: BreakdownItem[] = [
        { label: 'Principal & Interest', value: monthlyPI, color: '#5cb85c' },
        { label: 'Property Taxes', value: monthlyTax, color: '#428bca' },
        { label: 'Insurance', value: monthlyIns, color: '#f0ad4e' },
      ];
      if (monthlyPmi > 0) breakdown.push({ label: 'PMI', value: monthlyPmi, color: '#d9534f' });
      if (affValues.hoa > 0) breakdown.push({ label: 'HOA', value: affValues.hoa, color: '#777' });

      return {
        main: homePrice,
        secondary: D,
        secondaryLabel: 'Down payment',
        breakdown,
      };
    }

    if (mode === 'mortgage') {
      const loan = Math.max(0, mtgValues.price - mtgValues.downDollar);
      const mr = mtgValues.rate / 100 / 12;
      const n = mtgValues.term * 12;
      const pi = mr > 0 ? loan * (mr * Math.pow(1 + mr, n)) / (Math.pow(1 + mr, n) - 1) : loan / n;
      const monthlyTax = Math.round(mtgValues.price * mtgValues.taxRate / 100 / 12);
      const monthlyIns = Math.round(mtgValues.price * mtgValues.insRate / 100 / 12);
      const hasPmi = mtgValues.price > 0 && mtgValues.downDollar / mtgValues.price < 0.20;
      const monthlyPmi = hasPmi ? Math.round(loan * PMI_ANNUAL_RATE / 12) : 0;
      const total = Math.round(pi + monthlyTax + monthlyIns + monthlyPmi + mtgValues.hoa);

      const breakdown: BreakdownItem[] = [
        { label: 'Principal & Interest', value: Math.round(pi), color: '#5cb85c' },
        { label: 'Property Taxes', value: monthlyTax, color: '#428bca' },
        { label: 'Insurance', value: monthlyIns, color: '#f0ad4e' },
      ];
      if (monthlyPmi > 0) breakdown.push({ label: 'PMI', value: monthlyPmi, color: '#d9534f' });
      if (mtgValues.hoa > 0) breakdown.push({ label: 'HOA', value: mtgValues.hoa, color: '#777' });

      return {
        main: total,
        secondary: null,
        secondaryLabel: '',
        breakdown,
      };
    }

    const commissionDollar = Math.round(selValues.salePrice * selValues.commission / 100);
    const net = selValues.salePrice - selValues.mortgage - commissionDollar - selValues.closingCosts;
    return {
      main: Math.round(net),
      secondary: null,
      secondaryLabel: '',
      breakdown: [
        { label: 'Net Proceeds', value: Math.max(0, Math.round(net)), color: '#5cb85c' },
        { label: 'Agent Commission', value: commissionDollar, color: '#d21920' },
        { label: 'Closing Costs', value: selValues.closingCosts, color: '#f0ad4e' },
        { label: 'Mortgage Payoff', value: selValues.mortgage, color: '#428bca' },
      ],
    };
  }, [mode, affValues, mtgValues, selValues]);

  const config = MODE_CONFIG[mode];
  const tabs: { key: Mode; label: string }[] = [
    { key: 'affordability', label: 'Affordability' },
    { key: 'mortgage', label: 'Mortgage' },
    { key: 'seller', label: 'Seller Proceeds' },
  ];

  return (
    <section id="calculator" className="acq-section">
      <div className="acq-inner">
        <div className="section-header-row">
          <div className="acq-brand-header">
            <span className="acq-tag">ACQUISITION_PROTOCOL // FINANCIAL_INTEL</span>
            <h2 className="acq-title">BUYING <span className="acq-title-accent">POWER</span></h2>
            <p className="acq-sub">Harnessing real-time market data to calculate your strategic move.</p>
          </div>
          <CommandButton leadSource="acquisition-capacity" />
        </div>

        <div className="acq-container">
          <div className="acq-switcher">
            {tabs.map((t) => (
              <button
                key={t.key}
                className={`acq-tab${mode === t.key ? ' acq-tab-active' : ''}`}
                onClick={() => setMode(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="acq-body">
            <div className="acq-inputs-col">
              <h3 className="acq-calc-title">{config.title}</h3>
              <p className="acq-calc-sub">{config.sub}</p>

              <div className="acq-form">
                {mode === 'affordability' && <AffordabilityInputs values={affValues} onChange={handleAffChange} />}
                {mode === 'mortgage' && <MortgageInputs values={mtgValues} onChange={handleMtgChange} />}
                {mode === 'seller' && <SellerInputs values={selValues} onChange={handleSelChange} />}
              </div>
            </div>

            <div className="acq-results-col">
              <div className="acq-result-card">
                <span className="acq-res-label">{config.resultLabel}</span>
                <h2 className="acq-total">{formatCurrency(result.main)}</h2>

                {result.secondary !== null && (
                  <div className="acq-down-box">
                    <span className="acq-res-label">{result.secondaryLabel}</span>
                    <h4 className="acq-down-val">{formatCurrency(result.secondary)}</h4>
                  </div>
                )}

                <BreakdownBar items={result.breakdown} />
                <LegendList items={result.breakdown} />

                {result.breakdown.some((b) => b.label === 'PMI') && (
                  <p className="acq-pmi-note">
                    PMI is required when down payment is less than 20% and is removed once you reach 20% equity.
                  </p>
                )}

                {mode === 'mortgage' && (
                  <div className="acq-monthly-note">
                    <span className="acq-res-label">per month</span>
                  </div>
                )}

                <p className="acq-disclaimer">
                  This mortgage calculator is for educational purposes only. Real-world interest rates and payments can differ due to factors like market trends, location, and loan specifics. Calculations are based on your inputs and might not consider extra costs a lender may add, such as insurance, taxes, and fees; thus, actual repayments could surpass estimates. Please note, we don't provide loans, and this tool doesn't promise lending.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
