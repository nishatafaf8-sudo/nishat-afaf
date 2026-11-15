import { FaithMode, WaqtKey } from '../types';

export interface DistrictInfo {
  name: string;
  offsetMinutes: number;
  region: string;
}

export const BANGLADESH_DISTRICTS: DistrictInfo[] = [
  { name: 'Dhaka', offsetMinutes: 0, region: 'Central' },
  { name: 'Gazipur', offsetMinutes: 0, region: 'Central' },
  { name: 'Narayanganj', offsetMinutes: -1, region: 'Central' },
  { name: 'Chattogram', offsetMinutes: -5, region: 'Southeast' },
  { name: 'Cox’s Bazar', offsetMinutes: -6, region: 'Southeast' },
  { name: 'Cumilla', offsetMinutes: -3, region: 'East-Central' },
  { name: 'Sylhet', offsetMinutes: -7, region: 'Northeast' },
  { name: 'Mymensingh', offsetMinutes: 0, region: 'North-Central' },
  { name: 'Rajshahi', offsetMinutes: 7, region: 'Northwest' },
  { name: 'Bogura', offsetMinutes: 4, region: 'North' },
  { name: 'Rangpur', offsetMinutes: 5, region: 'Far North' },
  { name: 'Khulna', offsetMinutes: 4, region: 'Southwest' },
  { name: 'Barishal', offsetMinutes: 1, region: 'South' },
];

export interface WaqtScheduleItem {
  key: WaqtKey;
  label: string;
  altLabel: string;
  time24: string;
  displayTime: string;
  minutesFromMidnight: number;
}

const BASE_SCHEDULE: Array<{ key: WaqtKey; label: string; altLabel: string; baseMinutes: number }> = [
  { key: 'fajr', label: 'Fajr', altLabel: 'Dawn Breath & Intention', baseMinutes: 4 * 60 + 56 },
  { key: 'dhuhr', label: 'Dhuhr', altLabel: 'Midday Screen Break', baseMinutes: 11 * 60 + 52 },
  { key: 'asr', label: 'Asr', altLabel: 'Afternoon Walk & Hydrate', baseMinutes: 15 * 60 + 38 },
  { key: 'maghrib', label: 'Maghrib', altLabel: 'Sunset Reset & Gratitude', baseMinutes: 17 * 60 + 18 },
  { key: 'isha', label: 'Isha', altLabel: 'Night Digital Detox', baseMinutes: 18 * 60 + 36 },
];

function formatMinutes(totalMin: number): { time24: string; displayTime: string } {
  const wrapped = ((totalMin % 1440) + 1440) % 1440;
  const h24 = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    time24: `${pad(h24)}:${pad(m)}`,
    displayTime: `${pad(h12)}:${pad(m)} ${period}`,
  };
}

export function getDistrictPrayerSchedule(districtName: string): WaqtScheduleItem[] {
  const found = BANGLADESH_DISTRICTS.find((d) => d.name === districtName);
  const offset = found ? found.offsetMinutes : 0;

  return BASE_SCHEDULE.map((item) => {
    const adjusted = item.baseMinutes + offset;
    const { time24, displayTime } = formatMinutes(adjusted);
    return {
      key: item.key,
      label: item.label,
      altLabel: item.altLabel,
      time24,
      displayTime,
      minutesFromMidnight: adjusted,
    };
  });
}

export function getNextWaqtCountdown(districtName: string, nowDate: Date, faithMode: FaithMode) {
  const schedule = getDistrictPrayerSchedule(districtName);
  const currentSec = nowDate.getHours() * 3600 + nowDate.getMinutes() * 60 + nowDate.getSeconds();

  let next = schedule.find((s) => s.minutesFromMidnight * 60 > currentSec);
  let diffSec = 0;

  if (next) {
    diffSec = next.minutesFromMidnight * 60 - currentSec;
  } else {
    next = schedule[0];
    diffSec = 24 * 3600 - currentSec + next.minutesFromMidnight * 60;
  }

  const hrs = Math.floor(diffSec / 3600);
  const mins = Math.floor((diffSec % 3600) / 60);
  const secs = diffSec % 60;
  const pad = (n: number) => String(n).padStart(2, '0');

  return {
    nextKey: next.key,
    nextName: faithMode === 'Muslim' ? next.label : next.altLabel,
    nextDisplayTime: next.displayTime,
    countdownFormatted: `${pad(hrs)}:${pad(mins)}:${pad(secs)}`,
    schedule,
  };
}

export function getTodayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
