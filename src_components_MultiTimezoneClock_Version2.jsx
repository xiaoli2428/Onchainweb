// React component: src/components/MultiTimezoneClock.jsx
import React, { useEffect, useMemo, useState, useRef } from 'react';
import '../styles/multi-tz.css';

const STORAGE_KEY = 'multi-tz-react-v1';
const DEFAULT_ZONES = ['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo'];

// small curated fallback list if Intl.supportedValuesOf('timeZone') unavailable
const FALLBACK_ZONES = [
  'UTC','Europe/London','Europe/Paris','Europe/Berlin','America/New_York',
  'America/Chicago','America/Denver','America/Los_Angeles','Asia/Tokyo',
  'Asia/Shanghai','Asia/Hong_Kong','Australia/Sydney'
];

function getAllTimeZones() {
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch (e) {
    // ignore
  }
  return FALLBACK_ZONES;
}

function isValidTimeZone(tz) {
  try {
    // will throw on invalid tz in many engines
    Intl.DateTimeFormat(undefined, { timeZone: tz }).format();
    return true;
  } catch {
    return false;
  }
}

function computeOffsetString(date, tz) {
  // Compute offset from UTC as ±HH:MM by comparing UTC time and tz time
  try {
    // Using en-CA ensures parseable "YYYY-MM-DD, HH:MM:SS" or similar
    const tzStr = date.toLocaleString('en-CA', { timeZone: tz });
    const tzDate = new Date(tzStr);
    if (isNaN(tzDate)) {
      // fallback: formatToParts reconstruction
      const parts = new Intl.DateTimeFormat('en-CA', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        timeZone: tz
      }).formatToParts(date).reduce((acc, p) => { acc[p.type] = p.value; return acc; }, {});
      if (!parts.year) return '';
      const s = `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
      const pdate = new Date(s);
      if (isNaN(pdate)) return '';
      return offsetFromDates(date, pdate);
    }
    return offsetFromDates(date, tzDate);
  } catch {
    return '';
  }
}

function offsetFromDates(utcDate, tzDate) {
  const utcMs = Date.UTC(utcDate.getUTCFullYear(), utcDate.getUTCMonth(), utcDate.getUTCDate(),
                        utcDate.getUTCHours(), utcDate.getUTCMinutes(), utcDate.getUTCSeconds());
  const diffMin = Math.round((tzDate.getTime() - utcMs) / 60000);
  const sign = diffMin >= 0 ? '+' : '-';
  const abs = Math.abs(diffMin);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `UTC${sign}${hh}:${mm}`;
}

export default function MultiTimezoneClock({ initialZones }) {
  const zonesAll = useMemo(() => getAllTimeZones(), []);
  const [zones, setZones] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.zones)) {
          // filter invalid
          return parsed.zones.filter(tz => typeof tz === 'string' && isValidTimeZone(tz));
        }
      }
    } catch {}
    return initialZones && Array.isArray(initialZones) ? initialZones.slice() : DEFAULT_ZONES.slice();
  });
  const [is24Hour, setIs24Hour] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return !!parsed.is24Hour;
      }
    } catch {}
    return false;
  });
  const [query, setQuery] = useState('');
  const [tick, setTick] = useState(Date.now());
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ zones, is24Hour }));
    } catch {}
  }, [zones, is24Hour]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return zonesAll.slice(0, 200); // don't overwhelm
    return zonesAll.filter(z => z.toLowerCase().includes(q)).slice(0, 200);
  }, [query, zonesAll]);

  function addZone(tz) {
    if (!tz) return;
    if (zones.includes(tz)) return;
    if (!isValidTimeZone(tz)) return;
    setZones(prev => [...prev, tz]);
    setQuery('');
    setSuggestionsOpen(false);
    setHighlight(-1);
    if (inputRef.current) inputRef.current.focus();
  }

  function removeZone(tz) {
    setZones(prev => prev.filter(z => z !== tz));
  }

  function handleKeyDown(e) {
    if (!suggestionsOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(h => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const chosen = highlight >= 0 ? filtered[highlight] : query.trim();
      if (chosen) addZone(chosen);
    } else if (e.key === 'Escape') {
      setSuggestionsOpen(false);
      setHighlight(-1);
    }
  }

  useEffect(() => {
    // Close suggestions on outside click
    function onDoc(e) {
      if (!suggestionsRef.current) return;
      if (suggestionsRef.current.contains(e.target) || (inputRef.current && inputRef.current.contains(e.target))) {
        return;
      }
      setSuggestionsOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="mtz-root">
      <div className="mtz-header">
        <div className="mtz-title">Multi Timezone Clock</div>
        <div className="mtz-controls">
          <label className="mtz-toggle">
            <input
              type="checkbox"
              checked={is24Hour}
              onChange={e => setIs24Hour(e.target.checked)}
            /> 24-hour
          </label>
        </div>
      </div>

      <div className="mtz-form">
        <div className="mtz-search" role="combobox" aria-haspopup="listbox" aria-expanded={suggestionsOpen}>
          <input
            ref={inputRef}
            className="mtz-input"
            value={query}
            placeholder="Search or type an IANA timezone (e.g. America/Chicago)"
            onChange={e => { setQuery(e.target.value); setSuggestionsOpen(true); setHighlight(-1); }}
            onKeyDown={handleKeyDown}
            aria-autocomplete="list"
            aria-controls="mtz-suggestions"
            aria-activedescendant={highlight >= 0 ? `sug-${highlight}` : undefined}
          />
          <button
            className="mtz-add-btn"
            onClick={() => addZone(query.trim())}
            aria-label="Add timezone"
          >
            Add
          </button>

          {suggestionsOpen && (
            <ul id="mtz-suggestions" className="mtz-suggestions" role="listbox" ref={suggestionsRef}>
              {filtered.length === 0 && <li className="mtz-sug-empty">No matches</li>}
              {filtered.slice(0, 30).map((z, i) => (
                <li
                  key={z}
                  id={`sug-${i}`}
                  role="option"
                  aria-selected={highlight === i}
                  className={`mtz-sug ${highlight === i ? 'highlight' : ''}`}
                  onMouseDown={(ev) => { ev.preventDefault(); addZone(z); }}
                  onMouseEnter={() => setHighlight(i)}
                >
                  {z}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mtz-clocks" aria-live="polite">
        {zones.length === 0 && <div className="mtz-empty">No timezones added. Add one above.</div>}
        {zones.map((tz) => {
          const now = new Date(tick);
          const timeFmt = new Intl.DateTimeFormat(undefined, {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: !is24Hour,
            timeZone: tz
          }).format(now);
          const dateFmt = new Intl.DateTimeFormat(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            timeZone: tz
          }).format(now);
          const offset = computeOffsetString(now, tz);
          return (
            <article key={tz} className="mtz-card" data-timezone={tz}>
              <div className="mtz-zone">
                <div className="mtz-zone-name">{tz}</div>
                <div className="mtz-offset">{offset}</div>
              </div>
              <div className="mtz-time" aria-hidden="false">{timeFmt} — {dateFmt}</div>
              <div className="mtz-card-controls">
                <button className="mtz-remove" onClick={() => removeZone(tz)} aria-label={`Remove ${tz}`}>Remove</button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}