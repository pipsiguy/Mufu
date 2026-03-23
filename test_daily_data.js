/**
 * DAILY SALES STRESS-TEST DATA INJECTOR
 *
 * Usage:
 * 1) Open index.html (daily sales page)
 * 2) Paste this script into browser console
 * 3) It injects a dense week with 10 employees + 10 vendors and switches to that week
 */

(function injectDailyStressData() {
  const WEEK = '2026-03-16'; // Monday

  const EMPLOYEES = [
    'Avery Chen',
    'Noah Patel',
    'Mia Garcia',
    'Liam Nguyen',
    'Emma Kim',
    'Lucas Brown',
    'Sophia Lee',
    'Ethan Wilson',
    'Olivia Davis',
    'Mason Clark'
  ];

  const VENDORS = [
    'Pacific Produce Co',
    'North Shore Seafood',
    'Metro Paper Supply',
    'Urban Beverage Depot',
    'Prime Protein Wholesale',
    'City Packaging Group',
    'Fresh Valley Farms',
    'Downtown Cleaning Supply',
    'Summit Noodle Import',
    'Evergreen Sauce Traders'
  ];

  const SALES_SOURCES = [
    'Cash',
    'Credit Card',
    'Online',
    'Uber Eats',
    'DoorDash',
    'SkipTheDishes',
    'Catering',
    'Corporate Orders'
  ];

  const CASH_EXPENSES = [
    'Tips Cashout',
    'Staff Meal',
    'Taxi',
    'Repair',
    'Petty Cash',
    'Office Supply',
    'Emergency Purchase',
    'Fuel'
  ];

  function seeded(seed) {
    let x = seed >>> 0;
    return function next() {
      x = (x * 1664525 + 1013904223) >>> 0;
      return x / 4294967296;
    };
  }

  function f2(n) {
    return (Math.round(n * 100) / 100).toFixed(2);
  }

  const rand = seeded(20260316);
  const s = {
    __weekStart: WEEK,
    __employees: EMPLOYEES.slice(),
    __vendors: VENDORS.slice(),
    __cashExpenses: CASH_EXPENSES.slice(),
    __salesSources: SALES_SOURCES.slice(),
    notes: [
      'Stress test week with heavy transaction volume.',
      '10 employees and 10 vendors populated.',
      'Includes mixed paid/unpaid invoices and decimal values.',
      'Use this week to validate totals, snapshots, and restore flow.'
    ].join('\n'),
    coh: '1500.00'
  };

  // Sales by source/day
  for (let day = 0; day < 7; day++) {
    SALES_SOURCES.forEach((src, si) => {
      const base = 220 + day * 35 + si * 45;
      const swing = rand() * 380;
      s[`s_${day}_${src}`] = f2(base + swing);
    });
  }

  // Hours by employee/day
  EMPLOYEES.forEach((emp, ei) => {
    let weeklyHours = 0;
    for (let day = 0; day < 7; day++) {
      const isWeekend = day >= 5;
      const base = isWeekend ? 7.5 : 6.5;
      const hrs = Math.max(0, Math.min(12, base + (rand() * 4.5) + ((ei % 3) * 0.35)));
      const rounded = Math.round(hrs * 2) / 2; // 0.5 hour steps
      weeklyHours += rounded;
      s[`h_${emp}_${day}`] = String(rounded);
    }
    // Optional salary field support (if present in UI/runtime)
    s[`sal_${emp}`] = f2(weeklyHours * (16 + (ei % 5) * 1.25));
  });

  // Invoices by vendor/day + paid toggle
  VENDORS.forEach((vendor, vi) => {
    for (let day = 0; day < 7; day++) {
      const hasInvoice = rand() > 0.3; // around 70% cells populated
      if (!hasInvoice) continue;
      const amount = 35 + (vi * 18) + (day * 22) + rand() * 320;
      s[`inv_${vendor}_${day}`] = f2(amount);
      const paid = rand() > 0.45; // mixed paid/unpaid
      s[`invpaid_${vendor}_${day}`] = paid ? '1' : '';
    }
  });

  // Cash expenses by type/day
  CASH_EXPENSES.forEach((ex, xi) => {
    for (let day = 0; day < 7; day++) {
      const hasExp = rand() > 0.25;
      if (!hasExp) continue;
      const amount = 8 + xi * 6 + day * 4 + rand() * 95;
      s[`exp_${ex}_${day}`] = f2(amount);
    }
  });

  // Persist week data
  const key = (typeof weekKey === 'function') ? weekKey(WEEK) : ('edr_week_' + WEEK);
  localStorage.setItem(key, JSON.stringify(s));

  // Update meta for easy loading on refresh
  if (typeof getMeta === 'function' && typeof saveMeta === 'function') {
    const meta = getMeta() || {};
    saveMeta({
      lang: meta.lang || 'en',
      lastWeek: WEEK,
      employees: EMPLOYEES.slice(),
      vendors: VENDORS.slice(),
      salesSources: SALES_SOURCES.slice()
    });
  }

  // Switch to injected week without clobbering it
  const weekInput = document.getElementById('week-start');
  const currentWeek = weekInput ? weekInput.value : '';

  if (typeof switchToWeek === 'function') {
    if (currentWeek === WEEK) {
      if (typeof applyState === 'function') {
        applyState(s);
        if (typeof saveCurrentWeek === 'function') saveCurrentWeek(WEEK);
        console.log('Applied stress data directly to current week.');
      } else {
        location.reload();
      }
    } else {
      switchToWeek(WEEK);
      console.log('Switched to stress-test week without overwrite.');
    }
  } else {
    location.reload();
  }

  console.log('Daily stress test data injected.');
  console.log('Week:', WEEK);
  console.log('Employees:', EMPLOYEES.length);
  console.log('Vendors:', VENDORS.length);
  console.log('Sales sources:', SALES_SOURCES.length);
  console.log('Cash expense types:', CASH_EXPENSES.length);
  console.log('Storage key:', key);
})();
