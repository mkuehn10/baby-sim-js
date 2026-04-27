/**
 * Parameter labels, tooltips (R `with_tt` / `helpText`), and headings — mirrors `ui.R` + `QUEUE_KPI_TIPS` in `R/queue_system.R`.
 * Display strings are verbatim from the R Shiny app where possible.
 */

export const McPi = {
  n: {
    label: "n (darts / MC sample size):",
    title: "Sample size inside the unit square; more points usually tighten the π estimate.",
  },
  seed: {
    label: "RNG seed:",
    title: "Fixes the uniform dart positions before you click Go; same seed reproduces the same cloud.",
  },
  go: "Throw all darts once, count inside the inscribed circle, and refresh the plot and numbers.",
  metricIn: "Count of points inside the circle centered at (0.5, 0.5) with radius 0.5 (inscribed in the unit square).",
  metricOut: "Count of points in the square but not inside that inscribed circle.",
  metricEst: "Monte Carlo estimate 4 × (inside count) / n as an approximation of π.",
  metricRel: "Percent absolute error of the estimate versus true π.",
  plotWrap: "Scatter in the unit square: inscribed circle (same hit rule as the formulas above).",
} as const;

export const Gen3d = {
  n: {
    label: "n (3D points):",
    title: "How many triples (x,y,z) to plot in 3D.",
  },
  seed: {
    label: "x_0 (LCG seed / state):",
    title: "Starting seed / state for the chosen linear congruential generator.",
  },
  /** `radioButtons(..., "LCG choice (a, m):", ...)` */
  radio: { legend: "LCG choice (a, m):", title: "Compare a well-chosen LCG triple against the classic RANDU lattice." },
  go: "Regenerate 3D points and refresh the interactive plot.",
  /** `plotlyOutput` */
  plotPlotly: "Rotate and zoom: point cloud in unit cube colored by z.",
} as const;

/** Per-plot / table `with_tt` in `ui.R` Queue tab */
export const QueueUi = {
  interarrivalPlot: "Histogram or bar view of times between successive arrivals.",
  clientsPlot: "Queue length seen by each arriving customer.",
  ganttPlot: "Timeline of service intervals with arrival markers.",
  waitStackPlot: "Stacked waiting vs service time per customer.",
  customerTableWrap: "Full customer-level table for the last simulated iteration.",
  eventsTableWrap: "Event list driving the Gantt and wait breakdown.",
  currentVerbatim: "One-line numeric summary for the current iteration.",
  worstVerbatim: "One-line numeric summary for the worst case so far.",
} as const;

export const Queue = {
  arrival: {
    label: "Arrival law (generates I_i):",
    title: "How inter-arrival gaps are generated (exponential, fixed gap, discrete uniform, etc.).",
  },
  service: {
    label: "Service law (generates S_i):",
    title: "How service times are generated for each customer.",
  },
  b5: { label: "Arrival parameter (minutes):", title: "Scales or sets mean inter-arrival time depending on the arrival law." },
  b11: { label: "Service parameter (minutes):", title: "Scales or sets mean service time depending on the service law." },
  nIter: { label: "N (outer iterations):", title: "How many independent queue runs to simulate; KPIs can summarize across iterations." },
  indicator: {
    label: "Indicator (current / worst):",
    title: "Which scalar to show for current vs worst-of-so-far across iterations.",
  },
  seed: { label: "RNG seed:", title: "Seeds arrival and service randomness; same seed reproduces the same run." },
  go: "Run the queue simulation with the chosen laws and parameters.",
  help:
    "Single-server FIFO: draw arrivals and services, build customer and event tables, then KPIs. Open the Description sub-tab for A_i, T_i, D_i, … definitions.",
  h4Current: { text: "Current result", title: "Snapshot for the latest iteration using the chosen indicator." },
  h4Worst: { text: "Worst result", title: "Worst value seen so far of the chosen indicator across iterations." },
  h4Summary: { text: "Summary", title: "Clickable KPI table with definitions on hover (dotted labels)." },
  kpiRowHint: "Hover any summary label or value (dotted underline) for a short definition.",
  h4Charts: { text: "Charts (last iteration)", title: "Diagnostic plots built from the customer table of the last iteration." },
  chartsP:
    "Inter-arrivals and queue length at each arrival; Gantt shows each service interval with arrival markers; stacked bars split waiting time and service time per customer.",
  h4Customer: { text: "Customer table (last iteration)", title: "One row per customer with times and queue stats." },
  idleP:
    "idle Time is the nonnegative gap from the previous service completion to this arrival; it is 0 when the next customer arrives before the prior service ends (no idle gap).",
  h4Events: { text: "Events (last iteration)", title: "Arrival, start-service, and end-service events." },
} as const;

/** R `QUEUE_KPI_TIPS` (queue_system.R) — for hover `title` on JS KPI cells */
export const QueueKpiTip: Record<string, string> = {
  "Waiting time / Client": "Average minutes customers wait in the queue before service begins.",
  "Average time in": "Average total time in the system per customer (waiting plus service), minutes.",
  "Time of work": "Total minutes the server spends actively serving (busy time).",
  "Average Nb of clients": "Time-weighted average number of customers in the system (from the event step function).",
  "% Busy": "Busy time divided by the span from first arrival to last completion (server utilization over the horizon).",
  "Maximum waiting Time": "Largest queue wait experienced by any single customer, minutes.",
  "Max time in": "Largest time in system (wait plus service) for any customer, minutes.",
  "Exceeding Time":
    "Sum over customers of minutes completed after the 180-minute horizon (each contributes completion time minus 180).",
  "Max of clients": "Maximum count of customers in the system at an arrival instant.",
  "Non satisfied clients": "Number of customers who waited more than 10 minutes before service started.",
  "Adverage service Time": "Average drawn service duration per customer, minutes.",
  "Out of time clients": "Number of customers whose service completion occurs after time 180.",
} as const;

export const Stock = {
  helpDesc:
    "Choose how daily demand and supplier lead are generated. 'X each day' and 'Each X days' use the numeric levels as fixed values; other laws draw random series.",
  nDays: { label: "Horizon n (days):", title: "Number of simulated days for the (s, S) inventory walk." },
  demandLaw: { label: "Demand law (generates D_i):", title: "How daily demand is generated (fixed, Poisson, uniform integer, etc.)." },
  supLaw: { label: "Lead-time law:", title: "How supplier lead time in days is generated between orders." },
  b11: { label: "Demand level / rate:", title: "Demand parameter (meaning depends on selected demand law)." },
  b17: { label: "Lead level / rate:", title: "Supplier lead parameter (meaning depends on selected supplier law)." },
  seed: { label: "RNG seed:", title: "Seeds random demand and lead series when those laws draw randomness." },
  s: { label: "s (reorder threshold):", title: "End-of-day stock must fall strictly below s before you place an order." },
  S: { label: "S (order-up-to level):", title: "When you reorder, you order Z = S minus end-of-day stock (integer-rounded)." },
  start: { label: "Opening stock (E₁):", title: "On-hand inventory at the start of day 1 before any delivery." },
  go: "Simulate all days and refresh KPIs and the day table.",
  d: { label: "d ($/unit sold):", title: "Revenue per unit actually sold to customers." },
  k: { label: "K (fixed cost per order):", title: "Flat fee added each time an order is triggered." },
  c: { label: "c ($/unit ordered):", title: "Variable purchase/handling cost applied to each unit ordered." },
  p: { label: "p ($/lost-sale unit):", title: "Cost per unit of demand not met from stock." },
  h: { label: "h ($/unit EOD inventory):", title: "Charge per unit left in stock at end of each day." },
  helpSim:
    "Demand and supplier laws drive the walk; same seed reproduces after Go. Open the Description sub-tab for formulas and scenario detail.",
  h4Sum: { text: "Summary", title: "Cost and service KPIs with hover definitions." },
  sumP: "Hover labels or values (dotted underline) for definitions.",
  h4Day: { text: "Day table", title: "Day-by-day inventory, orders, sales, costs, and stockouts." },
} as const;

export const StockKpiTip: Record<string, string> = {
  "Mean end-of-day stock": "Average closing inventory after each day’s demand.",
  "SD of end-of-day stock": "Sample standard deviation of closing inventory across days.",
  "Total demand": "Sum of daily demand over the run.",
  "Orders placed": "Number of days where a reorder was triggered.",
  "Total lost sales": "Units of demand not filled when stock ran out.",
  "Profit vs demand-margin %":
    "Not a probability. Total profit ÷ (total demand × (selling price − widget cost)) × 100. Compares realized profit to a simple benchmark: if every demanded unit earned the per-unit margin (price minus widget cost), ignoring other costs already inside profit.",
  "Total sales": "Sum of units sold over the run.",
  "Total revenue": "Sum of daily revenue.",
  "Total reorder cost": "Sum of fixed-plus-variable order costs on order days.",
  "Total penalty": "Sum of shortage penalties on lost sales.",
  "Total holding": "Sum of carrying cost on end-of-day inventory.",
  "Total profit": "Sum of daily profit (revenue minus reorder, penalty, and holding).",
} as const;

export const Portfolio = {
  helpDesc:
    "Each year: one shared market draw G_t for all sectors; each sector multiplies prior wealth by max(0, X_{i,t} G_t) with raw normals from that row’s mean/SD and the economy-wide mean/SD (see Description).",
  T: { label: "T (years after year 0):", title: "How many future years to simulate after the initial balance column." },
  seed: { label: "RNG seed:", title: "Seeds economy-wide and sector-specific random factors; same seed reproduces the run." },
  mu: { label: "μ_gen (mean of G_t):", title: "Mean of the shared normal factor G_t applied to every sector in year t (course default 1)." },
  sd: { label: "σ_gen (SD of G_t):", title: "Standard deviation of G_t (course default 0.2)." },
  go: "Simulate sectors and refresh the table and total-wealth chart.",
  h4Bal: { text: "Balances by sector and year", title: "Economy row, sector parameters (μ_i, σ_i), balances by year, and totals row." },
  h4Chart: { text: "Total wealth by year", title: "Sum of sector balances at each year index." },
} as const;

export const BoxMuller = {
  helpRandu: "For the RANDU option, try seeds like 512 or 2048 if the cloud looks too uniform.",
  n: { label: "n (normal pairs):", title: "How many independent standard normal pairs to generate and plot." },
  seed: { label: "RNG seed:", title: "Seeds uniforms feeding Box–Muller for the selected generator." },
  radio: { legend: "U_i source (uniform generator):", title: "Uniform source: good LCG, classic RANDU triple, or Fibonacci-style recursion." },
  go: "Regenerate normal pairs and redraw the scatter.",
  plotWrap: "Scatter of Box–Muller normal pairs from the chosen uniform generator (square panel; scales down on narrow screens).",
} as const;

export const McInt = {
  f: { label: "f(u) — integrand:", title: "Choose f(u): sin(πu) or ln(u)ln(1−u), both integrated on [0, 1] with uniform Monte Carlo samples." },
  n: { label: "n (MC sample size):", title: "Number of uniform(0,1) draws u; Monte Carlo estimate is the mean of f(u)." },
  seed: { label: "RNG seed:", title: "Seeds the u locations; same seed and integrand reproduce the estimate and plot." },
  hint: "Estimate = mean of f(u); exact value in the summary below.",
  go: "Draw samples, plot f(u) vs u, and show MC mean vs exact integral.",
  summary: "Integrand, domain, Monte Carlo rule, estimate, and exact integral (MathJax).",
  plot: "Sample points and true f(u) curve; mean vertical height approximates the integral.",
} as const;

/** R `MC_INT_INTEGRAND_CHOICES` display names (values stay internal ids) */
export const McIntIntegrandChoiceLabel: Record<"sin_pi_u" | "log_prod", string> = {
  sin_pi_u: "sin(π u) on [0, 1]",
  log_prod: "ln(u) ln(1 − u) on [0, 1]",
};

export const Birthday = {
  helpDesc:
    "Each student gets one random birthday (365 equally likely days; no Feb 29). Each calendar square shows a student number in arrival order. Auto-run adds students quickly until two share a birthday or the max is reached.",
  seed: { label: "RNG seed:", title: "Seeds birthdays when you add students or reset the class." },
  nmax: { label: "n_max (class size cap for auto-run):", title: "Auto-run stops after this many students if no duplicate birthday yet." },
  reset: "Clear the class and RNG state for a fresh run.",
  auto: "Rapidly add students until a match or the max class size.",
  add1: "Add a single student and check for a birthday collision.",
  status1: "Primary status line (class size, match/no match).",
  status2: "Secondary status detail when useful.",
  grid: "Calendar grid of assigned birthdays with student IDs in arrival order.",
} as const;
