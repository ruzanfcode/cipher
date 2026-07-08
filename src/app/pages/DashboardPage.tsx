import React, { useState } from "react";
import { Calendar, ChevronDown, Plus, Search, Shield, User } from "lucide-react";
import { Area, AreaChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PRODUCTS, SBUS, USERS, USER_PROFILES } from "@/data/mockData";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { showToast } from "@/app/store/actions/uiActions";
import { activateUser, addUser, disableUser, rejectInvitation } from "@/app/store/actions/userActions";
import { cx } from "@/app/lib/utils";
import type { Role, SBUUser } from "@/app/types";

type DashboardView = "access" | "analytics";
type AnalysisType = "single" | "comparison" | "aggregate";
type TimeRange = "week" | "month" | "year" | "custom";

interface AnalysisRecord {
  id: number;
  user: string;
  sbu: string;
  product: string;
  type: AnalysisType;
  brand: string;
  reviews: number;
  date: Date;
}

const ANALYSIS_TYPES: { value: AnalysisType; label: string }[] = [
  { value: "single", label: "Single Page" },
  { value: "comparison", label: "Comparison" },
  { value: "aggregate", label: "Aggregate" },
];

const ANCHOR_DATE = new Date("2026-07-02T12:00:00");
const BRAND_LINE_COLORS = ["#56c7e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#14b8a6", "#f97316", "#64748b", "#ec4899", "#84cc16"];

function buildAnalysisRecords(): AnalysisRecord[] {
  return PRODUCTS.slice(0, 48).map((product, index) => {
    const user = USERS[index % USERS.length];
    const type = ANALYSIS_TYPES[index % ANALYSIS_TYPES.length].value;
    const daysAgo = index < 12 ? index % 7 : index < 28 ? index + 2 : index * 7;
    const date = new Date(ANCHOR_DATE);
    date.setDate(ANCHOR_DATE.getDate() - daysAgo);

    return {
      id: index + 1,
      user: user.email,
      sbu: user.sbu,
      product: type === "aggregate" ? `Aggregate: ${product.brand} Collection` : type === "comparison" ? `Comparison: ${product.brand} Set` : product.name,
      type,
      brand: product.brand,
      reviews: product.reviews,
      date,
    };
  });
}

const ANALYSIS_RECORDS = buildAnalysisRecords();

function withinRange(date: Date, range: TimeRange) {
  const diffDays = Math.floor((ANCHOR_DATE.getTime() - date.getTime()) / 86_400_000);
  if (range === "week") return diffDays <= 6;
  if (range === "month") return diffDays <= 30;
  if (range === "custom") return diffDays <= 30;
  return diffDays <= 365;
}

function parseDateInput(value: string, endOfDay = false) {
  if (!value) return null;
  const date = new Date(`${value}T${endOfDay ? "23:59:59" : "00:00:00"}`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

type SearchableOption = { value: string; label: string };

function SearchableDropdown({ value, options, searchPlaceholder, disabled, onChange }: {
  value: string;
  options: SearchableOption[];
  searchPlaceholder: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = options.find(option => option.value === value) ?? options[0];
  const filteredOptions = options.filter(option => option.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(current => !current)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2 text-left text-xs text-foreground outline-none transition-colors hover:border-primary/40 focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown size={13} className={cx("shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && !disabled && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-xl shadow-slate-900/10">
          <div className="relative border-b border-border">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={event => setQuery(event.target.value)}
              className="w-full bg-background py-2.5 pl-8 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground"
              placeholder={searchPlaceholder}
            />
          </div>
          <div className="max-h-52 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-xs text-muted-foreground">No options found</div>
            ) : filteredOptions.map(option => (
              <button
                key={option.value}
                type="button"
                onMouseDown={event => event.preventDefault()}
                onClick={() => { onChange(option.value); setOpen(false); setQuery(""); }}
                className={cx("w-full rounded-lg px-3 py-2 text-left text-xs font-semibold transition-colors", value === option.value ? "bg-primary/10 text-primary" : "text-foreground hover:bg-accent")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function getTimelineData(records: AnalysisRecord[], range: TimeRange) {
  if (range === "year") {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return monthNames.map((label, month) => ({
      label,
      analyses: records.filter(record => record.date.getMonth() === month).length,
    })).filter(row => row.analyses > 0 || [4, 5, 6].includes(monthNames.indexOf(row.label)));
  }

  const days = range === "week" ? 7 : 30;
  const bucketSize = range === "week" ? 1 : 5;
  const buckets = Math.ceil(days / bucketSize);

  return Array.from({ length: buckets }, (_, bucket) => {
    const start = new Date(ANCHOR_DATE);
    start.setDate(ANCHOR_DATE.getDate() - (days - 1) + bucket * bucketSize);
    const end = new Date(start);
    end.setDate(start.getDate() + bucketSize - 1);
    const analyses = records.filter(record => record.date >= start && record.date <= end).length;
    const formatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit" });
    const label = range === "week" ? formatter.format(start) : `${formatter.format(start)}-${formatter.format(end)}`;
    return { label, analyses };
  });
}

function getBrandTimelineData(records: AnalysisRecord[], range: TimeRange) {
  const brandNames = Array.from(new Set(records.map(record => record.brand))).sort();
  const brandSeries = brandNames.map((brand, index) => ({
    brand,
    dataKey: `brand_${index}`,
    color: BRAND_LINE_COLORS[index % BRAND_LINE_COLORS.length],
  }));

  const countRecords = (start: Date, end: Date, brand: string) => records.filter(record => record.brand === brand && record.date >= start && record.date <= end).length;

  if (range === "year") {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = monthNames.map((label, month) => {
      const start = new Date(ANCHOR_DATE.getFullYear(), month, 1, 0, 0, 0, 0);
      const end = new Date(ANCHOR_DATE.getFullYear(), month + 1, 0, 23, 59, 59, 999);
      return brandSeries.reduce<Record<string, string | number>>((row, series) => {
        row[series.dataKey] = countRecords(start, end, series.brand);
        return row;
      }, { label });
    });

    return { data, brandSeries };
  }

  const days = range === "week" ? 7 : 30;
  const bucketSize = range === "week" ? 1 : 5;
  const buckets = Math.ceil(days / bucketSize);
  const formatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit" });

  const data = Array.from({ length: buckets }, (_, bucket) => {
    const start = new Date(ANCHOR_DATE);
    start.setDate(ANCHOR_DATE.getDate() - (days - 1) + bucket * bucketSize);
    const end = new Date(start);
    end.setDate(start.getDate() + bucketSize - 1);
    const label = range === "week" ? formatter.format(start) : `${formatter.format(start)}-${formatter.format(end)}`;

    return brandSeries.reduce<Record<string, string | number>>((row, series) => {
      row[series.dataKey] = countRecords(start, end, series.brand);
      return row;
    }, { label });
  });

  return { data, brandSeries };
}

function AdminToggle({ view, onChange }: { view: DashboardView; onChange: (view: DashboardView) => void }) {
  return (
    <div className="inline-flex items-center rounded-xl bg-card p-1 shadow-sm border border-white/70 dark:border-border gap-1">
      {[
        { id: "access" as DashboardView, label: "User Access" },
        { id: "analytics" as DashboardView, label: "Analysis Analytics" },
      ].map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cx(
            "min-w-[132px] px-5 py-2 rounded-lg text-[11px] font-black uppercase tracking-[0.12em] transition-all whitespace-nowrap",
            view === tab.id ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function UserAccessView({ role }: { role: Role }) {
  const dispatch = useAppDispatch();
  const profile = USER_PROFILES[role];
  const users = useAppSelector(state => state.users.users);
  const scopedSbus = role === "system_admin" ? SBUS : SBUS.filter(sbu => sbu.name === profile.sbu);
  const [email, setEmail] = useState("");
  const [assignedSBU, setAssignedSBU] = useState(scopedSbus[0]?.name ?? profile.sbu);
  const [assignedRole, setAssignedRole] = useState<SBUUser["role"]>("SBU User");
  const [userPage, setUserPage] = useState(1);
  const scopedUsers = role === "system_admin" ? users : users.filter(user => user.sbu === profile.sbu);
  const activeAccounts = scopedUsers.filter(user => user.status === "Active").length;
  const allowedUsers = role === "system_admin"
    ? SBUS.reduce((total, sbu) => total + sbu.allowedUsers, 0)
    : SBUS.find(sbu => sbu.name === profile.sbu)?.allowedUsers ?? 0;
  const canAssignAccess = role === "system_admin";
  const usersPerPage = 6;
  const totalUserPages = Math.max(1, Math.ceil(scopedUsers.length / usersPerPage));
  const currentUserPage = Math.min(userPage, totalUserPages);
  const pagedUsers = scopedUsers.slice((currentUserPage - 1) * usersPerPage, currentUserPage * usersPerPage);

  const getInviteName = (value: string) => {
    const [localPart] = value.split("@");
    return localPart.split(/[._-]+/).filter(Boolean).map(part => part[0]?.toUpperCase() + part.slice(1)).join(" ") || value;
  };

  const handleProvisionUser = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      dispatch(showToast({ message: "Email address is required", variant: "warning" }));
      return;
    }

    dispatch(addUser({
      name: getInviteName(trimmedEmail),
      email: trimmedEmail,
      role: canAssignAccess ? assignedRole : "SBU User",
      sbu: canAssignAccess ? assignedSBU : profile.sbu,
    }));
    setEmail("");
    setUserPage(1);
    dispatch(showToast({ message: "User invitation sent", variant: "success" }));
  };

  const handleUserAction = (user: SBUUser) => {
    if (user.status === "Pending") {
      dispatch(rejectInvitation(user.id));
      setUserPage(currentUserPage);
      dispatch(showToast({ message: `Invitation for ${user.email} rejected`, variant: "warning" }));
      return;
    }
    if (user.status === "Active") {
      dispatch(disableUser(user.id));
      dispatch(showToast({ message: `${user.name} marked inactive`, variant: "warning" }));
      return;
    }
    dispatch(activateUser(user.id));
    dispatch(showToast({ message: `${user.name} activated`, variant: "success" }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
      <div className="bg-card rounded-2xl border border-border p-7 shadow-xl shadow-slate-900/8">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-0.5 h-4 rounded-full bg-primary" />
          <h2 className="text-xs font-black uppercase tracking-[0.28em] text-foreground">Add User</h2>
        </div>
        <div className="space-y-4">
          <label className="block">
            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Email Address</span>
            <input value={email} onChange={event => setEmail(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary" placeholder="User Email Address" />
          </label>
          {canAssignAccess && (
            <>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Assigned SBU (Division)</span>
                <select value={assignedSBU} onChange={event => setAssignedSBU(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary">
                  {scopedSbus.map(sbu => <option key={sbu.id} value={sbu.name}>{sbu.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">Assigned Role</span>
                <select value={assignedRole} onChange={event => setAssignedRole(event.target.value as SBUUser["role"])} className="mt-1.5 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary">
                  <option value="SBU User">Standard User</option>
                  <option value="SBU Admin">SBU Admin</option>
                </select>
              </label>
            </>
          )}
          <button onClick={handleProvisionUser} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary text-[11px] font-black uppercase tracking-[0.14em] text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-colors">
            <Plus size={14} /> Invite 
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-8 shadow-xl shadow-slate-900/8">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-4 rounded-full bg-primary" />
            <h2 className="text-xs font-black uppercase tracking-[0.28em] text-foreground">Users</h2>
          </div>
          {role !== "system_admin" && (
            <span className="rounded-full border border-border px-3 py-1 text-[10px] font-black text-primary">{activeAccounts} out of {allowedUsers}</span>
          )}
        </div>
        <div className="space-y-4">
          {pagedUsers.map(user => (
            <div key={user.id} className="flex items-center gap-4 rounded-2xl bg-background border border-border p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
                {user.role.includes("Admin") ? <Shield size={17} className="text-primary" /> : <User size={17} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-foreground">{user.email}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.12em] text-primary">{user.role.replace("SBU ", "")}</span>
                  <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-foreground">{user.sbu}</span>
                  <span className={cx("rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.1em]", user.status === "Active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : user.status === "Pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300")}>{user.status}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">{user.lastActive}</span>
                </div>
              </div>
              <button onClick={() => handleUserAction(user)} className={cx("inline-flex h-9 items-center justify-center rounded-lg border px-3 text-[10px] font-black uppercase tracking-[0.1em] transition-all",
                user.status === "Pending"
                  ? "border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/15 dark:text-amber-300"
                  : user.status === "Active"
                    ? "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300"
              )}>
                {user.status === "Pending" ? "Reject" : user.status === "Active" ? "Inactive" : "Active"}
              </button>
            </div>
          ))}
        </div>
        {scopedUsers.length > usersPerPage && (
          <div className="mt-6 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
              Showing {(currentUserPage - 1) * usersPerPage + 1}-{Math.min(currentUserPage * usersPerPage, scopedUsers.length)} of {scopedUsers.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setUserPage(page => Math.max(1, page - 1))}
                disabled={currentUserPage === 1}
                className="rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
              >
                Previous
              </button>
              <span className="rounded-lg bg-muted px-3 py-2 text-[10px] font-black text-foreground">
                {currentUserPage} / {totalUserPages}
              </span>
              <button
                onClick={() => setUserPage(page => Math.min(totalUserPages, page + 1))}
                disabled={currentUserPage === totalUserPages}
                className="rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AnalyticsView({ role }: { role: Role }) {
  const profile = USER_PROFILES[role];
  const [brandFilter, setBrandFilter] = useState("all");
  const [sbuFilter, setSbuFilter] = useState(role === "system_admin" ? "all" : profile.sbu);
  const [userFilter, setUserFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState<"all" | AnalysisType>("all");
  const [timeRange, setTimeRange] = useState<TimeRange>("month");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [activityPage, setActivityPage] = useState(1);
  const [activityPerPage, setActivityPerPage] = useState(10);

  const scopedSbus = role === "system_admin" ? SBUS : SBUS.filter(sbu => sbu.name === profile.sbu);
  const scopedUsers = role === "system_admin"
    ? USERS.filter(user => sbuFilter === "all" || user.sbu === sbuFilter)
    : USERS.filter(user => user.sbu === profile.sbu);
  const scopedRecords = ANALYSIS_RECORDS.filter(record => role === "system_admin" || record.sbu === profile.sbu);
  const brands = Array.from(new Set(scopedRecords.map(record => record.brand))).sort();
  const brandOptions = [{ value: "all", label: "All Brands" }, ...brands.map(brand => ({ value: brand, label: brand }))];
  const sbuOptions = [...(role === "system_admin" ? [{ value: "all", label: "All SBUs" }] : []), ...scopedSbus.map(sbu => ({ value: sbu.name, label: sbu.name }))];
  const userOptions = [{ value: "all", label: "All Users" }, ...scopedUsers.map(user => ({ value: user.email, label: user.email }))];
  const customStart = parseDateInput(customStartDate);
  const customEnd = parseDateInput(customEndDate, true);
  const visibleRecords = scopedRecords.filter(record => {
    const matchBrand = brandFilter === "all" || record.brand === brandFilter;
    const matchSbu = sbuFilter === "all" || record.sbu === sbuFilter;
    const matchUser = userFilter === "all" || record.user === userFilter;
    const matchType = typeFilter === "all" || record.type === typeFilter;
    const matchTime = customStart && customEnd ? record.date >= customStart && record.date <= customEnd : withinRange(record.date, timeRange);
    return matchBrand && matchSbu && matchUser && matchType && matchTime;
  });
  const timelineData = getTimelineData(visibleRecords, timeRange);
  const brandTimeline = getBrandTimelineData(visibleRecords, timeRange);
  const reviewsProcessed = visibleRecords.reduce((sum, record) => sum + record.reviews, 0);
  const totalActivityPages = Math.max(1, Math.ceil(visibleRecords.length / activityPerPage));
  const currentActivityPage = Math.min(activityPage, totalActivityPages);
  const pagedActivityRecords = visibleRecords.slice((currentActivityPage - 1) * activityPerPage, currentActivityPage * activityPerPage);
  const selectCls = "w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground outline-none focus:border-primary";
  const resetActivityPage = () => setActivityPage(1);
  const handleTimeRangeChange = (value: TimeRange) => {
    setTimeRange(value);
    resetActivityPage();
    if (value === "custom") setShowCustomDateModal(true);
    else {
      setCustomStartDate("");
      setCustomEndDate("");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-0.5 h-4 rounded-full bg-primary" />
          <h2 className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">Analytics Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <SearchableDropdown value={brandFilter} options={brandOptions} searchPlaceholder="Search brands..." onChange={value => { setBrandFilter(value); resetActivityPage(); }} />
          <SearchableDropdown value={sbuFilter} options={sbuOptions} searchPlaceholder="Search SBUs..." disabled={role !== "system_admin"} onChange={value => { setSbuFilter(value); setUserFilter("all"); resetActivityPage(); }} />
          <SearchableDropdown value={userFilter} options={userOptions} searchPlaceholder="Search users..." onChange={value => { setUserFilter(value); resetActivityPage(); }} />
          <select value={typeFilter} onChange={event => { setTypeFilter(event.target.value as "all" | AnalysisType); resetActivityPage(); }} className={selectCls}>
            <option value="all">All Analysis Types</option>
            {ANALYSIS_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
          </select>
          <select value={timeRange} onChange={event => handleTimeRangeChange(event.target.value as TimeRange)} className={selectCls}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Date</option>
          </select>
        </div>
      </div>

      {showCustomDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-primary/20 bg-card p-6 shadow-2xl shadow-primary/10">
            <div className="mb-5 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Calendar size={17} />
              </div>
              <div>
              <h3 className="text-sm font-black uppercase tracking-[0.18em] text-foreground">Custom Date Range</h3>
              <p className="mt-1 text-xs text-muted-foreground">Select a start and end date for analytics.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">From</span>
                <input type="date" value={customStartDate} onChange={event => setCustomStartDate(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-primary/25 bg-background px-3 text-sm font-semibold text-foreground outline-none transition-all [color-scheme:light] focus:border-primary focus:ring-2 focus:ring-primary/15 dark:[color-scheme:dark]" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-primary">To</span>
                <input type="date" value={customEndDate} onChange={event => setCustomEndDate(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-primary/25 bg-background px-3 text-sm font-semibold text-foreground outline-none transition-all [color-scheme:light] focus:border-primary focus:ring-2 focus:ring-primary/15 dark:[color-scheme:dark]" />
              </label>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setShowCustomDateModal(false); if (!customStartDate || !customEndDate) handleTimeRangeChange("month"); }} className="flex-1 rounded-lg border border-border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary/40 hover:text-primary">Cancel</button>
              <button onClick={() => { setShowCustomDateModal(false); resetActivityPage(); }} disabled={!customStartDate || !customEndDate} className="flex-1 rounded-lg bg-primary px-4 py-2 text-xs font-black uppercase tracking-[0.12em] text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-45">Apply</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Analyses", value: visibleRecords.length },
          { label: "Active Brands", value: new Set(visibleRecords.map(record => record.brand)).size },
          { label: "Reviews Processed", value: reviewsProcessed },
        ].map(stat => (
          <div key={stat.label}>
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-muted-foreground">{stat.label}</p>
            <p className="mt-2 font-mono text-3xl font-black text-foreground">{stat.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card rounded-2xl border border-border p-7 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-foreground">Analysis Timeline</h3>
            <span className="rounded-md bg-primary px-3 py-1 text-[10px] font-black uppercase text-white">{customStart && customEnd ? "Custom" : timeRange}</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="analysisFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#67d2f3" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#67d2f3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="analyses" stroke="#67d2f3" strokeWidth={3} fill="url(#analysisFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-7 shadow-sm">
          <h3 className="text-sm font-black text-foreground mb-6">Analyses by Brand</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={brandTimeline.data} margin={{ top: 5, right: 12, left: -25, bottom: 5 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Legend verticalAlign="bottom" iconType="plainline" wrapperStyle={{ fontSize: 10, fontWeight: 800, paddingTop: 12 }} />
                {brandTimeline.brandSeries.map(series => (
                  <Line key={series.dataKey} type="monotone" dataKey={series.dataKey} name={series.brand} stroke={series.color} strokeWidth={2.5} dot={{ r: 2 }} activeDot={{ r: 4 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-7 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.22em] text-muted-foreground">Recent Activity</h3>
          <span className="text-[10px] font-black text-primary">{visibleRecords.length} Entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-xs">
            <thead>
              <tr className="border-b border-border">
                {["User", "Products / Analysis Type", "Type", "Brand", "Reviews", "Time"].map(header => (
                  <th key={header} className="px-3 py-3 text-left text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedActivityRecords.map(record => (
                <tr key={record.id} className="border-b border-border last:border-b-0 hover:bg-accent/30 transition-colors">
                  <td className="px-3 py-3 text-muted-foreground">{record.user}</td>
                  <td className="px-3 py-3 font-bold text-foreground">{record.product}</td>
                  <td className="px-3 py-3"><span className={cx("rounded px-2 py-1 text-[9px] font-black uppercase", record.type === "single" ? "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300" : record.type === "comparison" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300")}>{ANALYSIS_TYPES.find(type => type.value === record.type)?.label}</span></td>
                  <td className="px-3 py-3 font-black text-primary">{record.brand.toUpperCase()}</td>
                  <td className="px-3 py-3 text-foreground">{record.reviews.toLocaleString()}</td>
                  <td className="px-3 py-3 text-muted-foreground">{formatDateTime(record.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {visibleRecords.length > 0 && (
          <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                Showing {(currentActivityPage - 1) * activityPerPage + 1}-{Math.min(currentActivityPage * activityPerPage, visibleRecords.length)} of {visibleRecords.length}
              </span>
              <select
                value={activityPerPage}
                onChange={event => { setActivityPerPage(Number(event.target.value)); setActivityPage(1); }}
                className="rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-foreground outline-none focus:border-primary"
              >
                {[5, 10, 15, 20].map(size => <option key={size} value={size}>{size} per page</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivityPage(page => Math.max(1, page - 1))}
                disabled={currentActivityPage === 1}
                className="rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
              >
                Previous
              </button>
              <span className="rounded-lg bg-muted px-3 py-2 text-[10px] font-black text-foreground">
                {currentActivityPage} / {totalActivityPages}
              </span>
              <button
                onClick={() => setActivityPage(page => Math.min(totalActivityPages, page + 1))}
                disabled={currentActivityPage === totalActivityPages}
                className="rounded-lg border border-border bg-background px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-foreground"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const [view, setView] = useState<DashboardView>("access");
  const role = useAppSelector(state => state.auth.role) ?? "system_admin";

  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-5 sm:pb-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="font-black text-foreground uppercase tracking-tight text-[28px] sm:text-[36px] lg:text-[44px]">Usage Analytics</h1>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <AnalyticsView role={role} />
      </div>
    </div>
  );
}
