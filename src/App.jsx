import React, { useReducer, useState, useMemo, useCallback, useEffect } from 'react';
import {
  LineChart, BarChart, ScatterChart, ComposedChart, Treemap, AreaChart, PieChart,
  Line, Bar, Scatter, Area, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, ReferenceDot, Cell
} from 'recharts';
import {
  AlertTriangle, TrendingDown, TrendingUp, CheckCircle, XCircle, AlertCircle,
  Calendar, DollarSign, Target, Zap, Shield, Eye, ArrowRight, Play, Pause,
  RotateCcw, ChevronDown, ChevronRight, Upload, FileText, Wifi, Code, Download,
  Sparkles, Search, Send, Loader, Copy, X, Check, Info, Clock, Trash2
} from 'lucide-react';

// ============================================================================
// VENUE CONTEXT (from venue_and_keyword_context.yaml)
// ============================================================================
const VENUES = {
  'all': { display_name: 'All venues', has_alcohol: true, branded_patterns: [], competitors: [], primary_keywords: [], landing_page: '' },
  '1-altitude': {
    display_name: '1-Altitude', has_alcohol: true,
    branded_patterns: ['1-altitude', '1 altitude', 'one altitude', 'altitude coast'],
    competitors: ['CÉ LA VI', 'Smoke & Mirrors', 'Lavo Singapore', 'Mr Stork', 'LeVeL33', 'Idlewild'],
    primary_keywords: ['rooftop bar singapore', 'rooftop dining singapore', 'best view restaurant singapore', 'skyline dining singapore'],
    positioning: 'Iconic rooftop dining and bar at 1 Raffles Place',
    landing_page: 'https://1-altitude.com'
  },
  '1-arden': {
    display_name: '1-Arden', has_alcohol: true,
    branded_patterns: ['1-arden', '1 arden', 'one arden'],
    competitors: ['Bochinche', 'Esquina', 'Burnt Ends', 'Odette', 'Cloudstreet'],
    primary_keywords: ['fine dining singapore', 'national gallery restaurant', 'premium restaurant singapore', 'wedding venue singapore'],
    positioning: 'Premium dining and rooftop bar at the National Gallery Singapore',
    landing_page: 'https://1-arden.com'
  },
  '1-arden-bar': {
    display_name: '1-Arden Bar', has_alcohol: true,
    branded_patterns: ['1-arden bar', 'arden bar'],
    competitors: ['Atlas Bar', 'Manhattan Bar', 'Smoke & Mirrors', 'Native'],
    primary_keywords: ['cocktail bar singapore', 'national gallery bar', 'premium cocktail bar'],
    positioning: 'Cocktail bar within 1-Arden',
    landing_page: 'https://1-arden.com/bar'
  },
  'oumi': {
    display_name: 'Oumi', has_alcohol: true,
    branded_patterns: ['oumi', 'oumi singapore'],
    competitors: ['Tippling Club', 'Esora', 'Cure', 'Sushi Kimura', 'Hashida', 'Shoukouwa'],
    primary_keywords: ['omakase singapore', 'japanese fine dining singapore', 'modern japanese restaurant'],
    positioning: 'Modern Japanese omakase, refined and ingredient-driven',
    landing_page: 'https://oumi.sg'
  },
  'kaarla': {
    display_name: 'Kaarla', has_alcohol: true,
    branded_patterns: ['kaarla'],
    competitors: ['Burnt Ends', 'Cloudstreet', 'Born', 'Whitegrass'],
    primary_keywords: ['australian restaurant singapore', 'fine dining singapore', 'modern australian singapore'],
    positioning: 'Australian fine dining with native-ingredient focus',
    landing_page: 'https://kaarla.com.sg'
  },
  'sol-luna': {
    display_name: 'Sol & Luna', has_alcohol: true,
    branded_patterns: ['sol & luna', 'sol and luna', 'sol luna'],
    competitors: ['Da Paolo', 'La Strada', 'Cicheti', 'Riviera', 'Buona Terra', 'Zafferano'],
    primary_keywords: ['italian restaurant singapore', 'rooftop italian', 'aperitivo singapore'],
    positioning: 'Italian rooftop dining and aperitivo',
    landing_page: 'https://solandluna.sg'
  },
  'camille': {
    display_name: 'Camille', has_alcohol: true,
    branded_patterns: ['camille'],
    competitors: ['Saveur', 'Bistro du Vin', 'Le Bistrot du Sommelier', 'Les Bouchons'],
    primary_keywords: ['french restaurant singapore', 'french bistro singapore', 'french wine bar singapore'],
    positioning: 'Classic French bistro with French wine focus',
    landing_page: 'https://camille.sg'
  },
  'wildseed': {
    display_name: 'Wildseed', has_alcohol: true,
    branded_patterns: ['wildseed'],
    competitors: ['PS Cafe', 'Common Man Coffee', 'Tiong Bahru Bakery', 'Open Farm Community'],
    primary_keywords: ['cafe singapore', 'brunch singapore', 'garden cafe singapore'],
    positioning: 'Cafe / casual all-day dining with garden/nature aesthetic',
    landing_page: 'https://wildseed.sg'
  },
  '1-flowerhill': {
    display_name: '1-Flowerhill', has_alcohol: true,
    branded_patterns: ['1-flowerhill', 'flowerhill'],
    competitors: ['Tamarind Hill', 'Hortus', 'The White Rabbit', 'CHIJMES', 'Capella Singapore'],
    primary_keywords: ['wedding venue singapore', 'event venue singapore', 'private event venue', 'garden wedding singapore'],
    positioning: 'Standalone weddings, corporate events, private celebrations',
    landing_page: 'https://1-flowerhill.com'
  },
  'monti': {
    display_name: 'Monti', has_alcohol: true,
    branded_patterns: ['monti'],
    competitors: ['Riviera', 'Da Paolo', 'Ristorante Il Faro', 'Buona Terra', 'Forlino'],
    primary_keywords: ['italian restaurant fullerton', 'marina bay italian', 'fullerton dining'],
    positioning: 'Italian dining at The Fullerton Pavilion, riverside',
    landing_page: 'https://monti.sg'
  },
  '1-host': {
    display_name: '1-HOST', has_alcohol: true,
    branded_patterns: ['1-host', '1 host', '1host'],
    competitors: ['The Wedding Atelier', 'Wedding Concepts', 'Bliss Productions', 'Capella Singapore'],
    primary_keywords: ['wedding venue singapore', 'wedding planner singapore', 'luxury wedding singapore', 'corporate event venue singapore'],
    positioning: 'Weddings and events division across 1-Group venues',
    landing_page: 'https://1host.sg'
  }
};

// ============================================================================
// WORKFLOW DEFINITIONS (from workflows.yaml)
// ============================================================================
const WORKFLOWS = {
  1: { name: 'Full Account Audit', agents: ['audit', 'diagnostic', 'compliance', 'research', 'strategy'], duration: [20, 30] },
  2: { name: 'Weekly Performance Review', agents: ['audit', 'diagnostic'], duration: [8, 12], compact: true },
  3: { name: 'Anomaly Investigation', agents: ['diagnostic', 'audit'], duration: [5, 15], requiresClarification: true },
  4: { name: 'Creative Refresh Cycle', agents: ['creative', 'compliance'], duration: [10, 20] },
  5: { name: 'Quarterly Budget Plan', agents: ['audit', 'diagnostic', 'research', 'strategy'], duration: [15, 25], executionDisabled: true },
  6: { name: 'Compliance Sweep', agents: ['compliance'], duration: [5, 10] },
};

const AGENT_LABELS = {
  audit: 'Audit Agent', diagnostic: 'Diagnostic Agent', research: 'Research Agent',
  strategy: 'Strategy Agent', compliance: 'Compliance Agent', creative: 'Creative Agent',
  execution: 'Execution Agent'
};

// ============================================================================
// CSV COLUMN NORMALIZATION (from google_ads_integration.md)
// ============================================================================
const CSV_NORMALIZATION = {
  campaign_performance: {
    canonical: ['campaign_id','campaign_name','campaign_status','bid_strategy_type','budget_sgd_daily','date','impressions','clicks','ctr','avg_cpc_sgd','cost_sgd','conversions','conv_value_sgd','cost_per_conv_sgd','search_impr_share','search_lost_is_budget','search_lost_is_rank'],
    aliases: {
      'campaign id': 'campaign_id', 'campaign': 'campaign_name', 'campaign name': 'campaign_name',
      'campaign state': 'campaign_status', 'status': 'campaign_status',
      'bid strategy type': 'bid_strategy_type', 'bidding strategy': 'bid_strategy_type',
      'budget': 'budget_sgd_daily', 'daily budget': 'budget_sgd_daily',
      'day': 'date', 'impr.': 'impressions', 'impr': 'impressions',
      'click-through rate': 'ctr', 'avg. cpc': 'avg_cpc_sgd', 'avg cpc': 'avg_cpc_sgd',
      'cost': 'cost_sgd', 'all conv.': 'conversions', 'conv. value': 'conv_value_sgd',
      'cost / conv.': 'cost_per_conv_sgd', 'cost per conv': 'cost_per_conv_sgd',
      'search impr. share': 'search_impr_share', 'search lost is (budget)': 'search_lost_is_budget',
      'search lost is (rank)': 'search_lost_is_rank',
    }
  },
  keyword_performance: {
    canonical: ['campaign_name','ad_group_name','keyword','match_type','status','quality_score','max_cpc_sgd','impressions','clicks','ctr','avg_cpc_sgd','cost_sgd','conversions','cost_per_conv_sgd'],
    aliases: {
      'campaign': 'campaign_name', 'ad group': 'ad_group_name', 'ad group name': 'ad_group_name',
      'keyword text': 'keyword', 'search keyword': 'keyword',
      'match type': 'match_type', 'qual. score': 'quality_score', 'quality score': 'quality_score',
      'max cpc': 'max_cpc_sgd', 'avg. cpc': 'avg_cpc_sgd', 'cost': 'cost_sgd',
      'conv.': 'conversions', 'cost / conv.': 'cost_per_conv_sgd',
    }
  },
  search_terms: {
    canonical: ['search_term','match_type','added_excluded','campaign_name','ad_group_name','impressions','clicks','ctr','cost_sgd','conversions'],
    aliases: {
      'search term': 'search_term', 'added/excluded': 'added_excluded',
      'campaign': 'campaign_name', 'ad group': 'ad_group_name',
      'cost': 'cost_sgd', 'conv.': 'conversions',
    }
  },
  ad_performance: {
    canonical: ['campaign_name','ad_group_name','ad_id','ad_type','headlines','descriptions','final_url','status','impressions','clicks','ctr','conversions','cost_sgd'],
    aliases: {
      'campaign': 'campaign_name', 'ad group': 'ad_group_name',
      'ad id': 'ad_id', 'ad type': 'ad_type',
      'cost': 'cost_sgd', 'conv.': 'conversions',
    }
  },
  asset_performance: {
    canonical: ['asset_id','asset_type','asset_text','asset_url','performance_label','impressions','clicks'],
    aliases: { 'asset id': 'asset_id', 'asset type': 'asset_type', 'performance': 'performance_label' }
  },
  ad_group_performance: {
    canonical: ['campaign_name','ad_group_name','status','impressions','clicks','ctr','cost_sgd','conversions'],
    aliases: { 'campaign': 'campaign_name', 'ad group': 'ad_group_name', 'cost': 'cost_sgd' }
  },
  extensions_performance: {
    canonical: ['extension_type','extension_text','impressions','clicks','ctr'],
    aliases: { 'type': 'extension_type', 'text': 'extension_text' }
  },
  change_history: {
    canonical: ['date','user_email','change_type','old_value','new_value','campaign_name'],
    aliases: { 'changed at': 'date', 'user': 'user_email', 'change': 'change_type' }
  },
};

const REPORT_DESCRIPTIONS = {
  campaign_performance: 'Spend, conversions, impression share by campaign and date',
  keyword_performance: 'Per-keyword performance — needed for wasted spend analysis',
  search_terms: 'Actual queries that triggered ads — needed for negative keyword candidates',
  ad_performance: 'RSA headlines/descriptions — needed for compliance and creative analysis',
  asset_performance: 'Asset-level performance labels — feeds creative fatigue detection',
  ad_group_performance: 'Ad group rollup — useful for budget reallocation',
  extensions_performance: 'Sitelinks, callouts, snippets — needed for compliance scan',
  change_history: 'Account changes — needed for diagnostic root-cause attribution',
};

// ============================================================================
// DEMO DATA — 1-Arden, realistic, includes embedded findings
// ============================================================================
const DEMO_DATA = {
  campaign_performance: (() => {
    const days = 60;
    const out = [];
    const today = new Date('2026-04-28');
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      // Anomaly: conversion drop on 2026-04-15 onward
      const dropFactor = (i <= 13) ? 0.55 : 1.0;
      const baseSpend = 280 + Math.sin(i / 4) * 30 + Math.random() * 20;
      const baseConv = (5.2 + Math.sin(i / 4) * 1.2 + Math.random() * 0.6) * dropFactor;
      out.push({
        campaign_id: '1234567890',
        campaign_name: '1-Arden | Search | Brand',
        campaign_status: 'ENABLED',
        bid_strategy_type: 'TARGET_CPA',
        budget_sgd_daily: 320,
        date,
        impressions: Math.round(2200 + Math.random() * 400),
        clicks: Math.round(85 + Math.random() * 25),
        ctr: 0.039,
        avg_cpc_sgd: 3.30,
        cost_sgd: +baseSpend.toFixed(2),
        conversions: +baseConv.toFixed(2),
        conv_value_sgd: +(baseConv * 220).toFixed(2),
        cost_per_conv_sgd: +(baseSpend / Math.max(baseConv, 0.1)).toFixed(2),
        search_impr_share: 0.62,
        search_lost_is_budget: 0.18,
        search_lost_is_rank: 0.20,
      });
    }
    return out;
  })(),

  keyword_performance: [
    { campaign_name: '1-Arden | Search | Brand', ad_group_name: 'Brand Exact', keyword: '1-arden', match_type: 'EXACT', status: 'ENABLED', quality_score: 9, max_cpc_sgd: 4.50, impressions: 1840, clicks: 312, ctr: 0.169, avg_cpc_sgd: 1.90, cost_sgd: 593.00, conversions: 28.4, cost_per_conv_sgd: 20.88 },
    { campaign_name: '1-Arden | Search | Brand', ad_group_name: 'Brand Phrase', keyword: '1-arden national gallery', match_type: 'PHRASE', status: 'ENABLED', quality_score: 9, max_cpc_sgd: 4.00, impressions: 720, clicks: 124, ctr: 0.172, avg_cpc_sgd: 1.85, cost_sgd: 229.40, conversions: 11.2, cost_per_conv_sgd: 20.48 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Fine Dining', keyword: 'fine dining singapore', match_type: 'PHRASE', status: 'ENABLED', quality_score: 6, max_cpc_sgd: 6.50, impressions: 4200, clicks: 168, ctr: 0.040, avg_cpc_sgd: 5.80, cost_sgd: 974.40, conversions: 4.8, cost_per_conv_sgd: 203.00 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Fine Dining', keyword: 'best restaurant singapore', match_type: 'BROAD', status: 'ENABLED', quality_score: 4, max_cpc_sgd: 5.00, impressions: 8400, clicks: 142, ctr: 0.017, avg_cpc_sgd: 4.95, cost_sgd: 702.90, conversions: 0, cost_per_conv_sgd: 0 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Wedding', keyword: 'wedding venue singapore', match_type: 'PHRASE', status: 'ENABLED', quality_score: 7, max_cpc_sgd: 8.00, impressions: 3100, clicks: 89, ctr: 0.029, avg_cpc_sgd: 6.40, cost_sgd: 569.60, conversions: 6.1, cost_per_conv_sgd: 93.38 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Wedding', keyword: 'wedding photography singapore', match_type: 'BROAD', status: 'ENABLED', quality_score: 3, max_cpc_sgd: 5.00, impressions: 6200, clicks: 78, ctr: 0.013, avg_cpc_sgd: 4.20, cost_sgd: 327.60, conversions: 0, cost_per_conv_sgd: 0 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Premium', keyword: 'premium restaurant singapore', match_type: 'PHRASE', status: 'ENABLED', quality_score: 7, max_cpc_sgd: 5.50, impressions: 2800, clicks: 96, ctr: 0.034, avg_cpc_sgd: 4.10, cost_sgd: 393.60, conversions: 3.2, cost_per_conv_sgd: 123.00 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Rooftop', keyword: 'rooftop restaurant national gallery', match_type: 'PHRASE', status: 'ENABLED', quality_score: 8, max_cpc_sgd: 5.00, impressions: 1900, clicks: 88, ctr: 0.046, avg_cpc_sgd: 3.40, cost_sgd: 299.20, conversions: 5.4, cost_per_conv_sgd: 55.41 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Anniversary', keyword: 'anniversary dinner singapore', match_type: 'PHRASE', status: 'ENABLED', quality_score: 6, max_cpc_sgd: 5.00, impressions: 2200, clicks: 64, ctr: 0.029, avg_cpc_sgd: 3.90, cost_sgd: 249.60, conversions: 1.9, cost_per_conv_sgd: 131.37 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Generic', keyword: 'restaurant near me', match_type: 'BROAD', status: 'ENABLED', quality_score: 3, max_cpc_sgd: 3.00, impressions: 12500, clicks: 121, ctr: 0.010, avg_cpc_sgd: 2.40, cost_sgd: 290.40, conversions: 0.4, cost_per_conv_sgd: 726.00 },
  ],

  search_terms: [
    { search_term: '1-arden', match_type: 'EXACT', added_excluded: 'Added', campaign_name: '1-Arden | Search | Brand', ad_group_name: 'Brand Exact', impressions: 1820, clicks: 309, ctr: 0.170, cost_sgd: 587.10, conversions: 28.1 },
    { search_term: '1-arden national gallery menu', match_type: 'PHRASE', added_excluded: 'None', campaign_name: '1-Arden | Search | Brand', ad_group_name: 'Brand Phrase', impressions: 280, clicks: 56, ctr: 0.200, cost_sgd: 106.40, conversions: 5.2 },
    { search_term: 'fine dining jobs singapore', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Fine Dining', impressions: 1200, clicks: 38, ctr: 0.032, cost_sgd: 136.40, conversions: 0 },
    { search_term: 'fine dining career', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Fine Dining', impressions: 800, clicks: 22, ctr: 0.028, cost_sgd: 79.20, conversions: 0 },
    { search_term: 'cheap fine dining', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Fine Dining', impressions: 950, clicks: 31, ctr: 0.033, cost_sgd: 102.30, conversions: 0 },
    { search_term: 'best restaurant near me cheap', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Generic', impressions: 1400, clicks: 19, ctr: 0.014, cost_sgd: 47.50, conversions: 0 },
    { search_term: 'wedding photography prices', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Wedding', impressions: 1100, clicks: 28, ctr: 0.025, cost_sgd: 117.60, conversions: 0 },
    { search_term: 'wedding photographer recommendations', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Wedding', impressions: 850, clicks: 21, ctr: 0.025, cost_sgd: 88.20, conversions: 0 },
    { search_term: 'restaurant interview tips', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Generic', impressions: 600, clicks: 16, ctr: 0.027, cost_sgd: 38.40, conversions: 0 },
    { search_term: 'best italian restaurant singapore', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Fine Dining', impressions: 720, clicks: 24, ctr: 0.033, cost_sgd: 96.00, conversions: 0.6 },
    { search_term: 'private dining national gallery', match_type: 'PHRASE', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Premium', impressions: 410, clicks: 32, ctr: 0.078, cost_sgd: 91.20, conversions: 4.2 },
    { search_term: 'rooftop dinner national gallery', match_type: 'PHRASE', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Rooftop', impressions: 380, clicks: 26, ctr: 0.068, cost_sgd: 78.00, conversions: 3.4 },
    { search_term: 'tasting menu singapore', match_type: 'BROAD', added_excluded: 'None', campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Premium', impressions: 540, clicks: 22, ctr: 0.041, cost_sgd: 88.00, conversions: 2.1 },
  ],

  ad_performance: [
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Fine Dining', ad_id: 'ad_001', ad_type: 'RSA', headlines: 'Premium Dining at National Gallery|Fine Dining Singapore|Reserve Your Table Tonight|Crafted Tasting Menus|Award-Winning Chef|Iconic Singapore Setting|Curated Wine List|Anniversary & Special Occasions|Modern European Cuisine|Riverside Views|Award-Recognised Restaurant|Open Daily for Dinner|Private Dining Available|1-Arden | National Gallery|Reserve Online', descriptions: 'Premium dining at the National Gallery Singapore. Crafted tasting menus, curated wines, intimate setting.|Modern European cuisine in an iconic setting. Reserve your table for an unforgettable evening.|Award-winning chef. Curated wine pairings. Private dining for special occasions. Reserve today.|Open daily for dinner service. Anniversary and special-occasion bookings. Reserve online.', final_url: 'https://1-arden.com', status: 'ENABLED', impressions: 4200, clicks: 168, ctr: 0.040, conversions: 4.8, cost_sgd: 974.40 },
    { campaign_name: '1-Arden | Search | Bar', ad_group_name: 'Cocktail Bar', ad_id: 'ad_002', ad_type: 'RSA', headlines: 'Happy Hour Cocktails $15|1-for-1 Drinks Until 8PM|Best Happy Hour National Gallery|Unwind After Work|Premium Cocktail Bar|Sip & Share With The Squad|Bottomless Brunch Weekends|Award-Winning Bartenders|Reserve Your Spot|Riverside Cocktails|Late Night Bar|Iconic Setting|Drinks That Fuel Success|1-Arden Bar|Book Tonight', descriptions: 'Happy hour 5-8pm with $15 cocktails. Award-winning bartenders, riverside views.|1-for-1 cocktails until 8pm. Reserve your table for an unforgettable evening.|Sip and share with the squad. Bottomless brunch on weekends.|Drinks that fuel success. Reserve at 1-Arden Bar tonight.', final_url: 'https://1-arden.com/bar', status: 'ENABLED', impressions: 2800, clicks: 115, ctr: 0.041, conversions: 6.2, cost_sgd: 471.50 },
    { campaign_name: '1-Arden | Search | NonBrand', ad_group_name: 'Wedding', ad_id: 'ad_003', ad_type: 'RSA', headlines: 'Wedding Venue Singapore|National Gallery Wedding|Iconic Wedding Setting|Bespoke Wedding Packages|Celebrate Your Day|Premium Wedding Venue|Inquire Today|Garden Wedding Singapore|Capture Your Story|Memorable Weddings|Award-Recognised Venue|1-Arden Weddings|Reserve Now|Private Wedding Spaces|Exclusive Wedding Venue', descriptions: 'Iconic wedding venue at the National Gallery. Bespoke packages for your special day. Inquire today.|Award-recognised wedding venue. Private spaces, garden options, full coordination.|Celebrate your wedding in an iconic Singapore setting. Custom packages available.|Memorable weddings at 1-Arden. Inquire about availability and packages.', final_url: 'https://1-arden.com/weddings', status: 'ENABLED', impressions: 3100, clicks: 89, ctr: 0.029, conversions: 6.1, cost_sgd: 569.60 },
  ],

  // Pre-computed time series for fatigue (per ad daily CTR)
  fatigue_data: (() => {
    const days = 60;
    const today = new Date('2026-04-28');
    const ads = [
      { id: 'ad_001', label: 'Fine Dining RSA', fatigued: false, baseCtr: 0.040, decay: 0 },
      { id: 'ad_002', label: 'Cocktail Bar RSA', fatigued: true, baseCtr: 0.052, decay: 0.50 },
      { id: 'ad_003', label: 'Wedding RSA', fatigued: false, baseCtr: 0.029, decay: 0 },
    ];
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const date = d.toISOString().slice(0, 10);
      const row = { date };
      ads.forEach(ad => {
        const decayProgress = ad.fatigued ? Math.max(0, (days - 1 - i - 30) / 30) : 0;
        const ctr = ad.baseCtr * (1 - ad.decay * decayProgress) + (Math.random() - 0.5) * 0.004;
        row[`ctr_${ad.id}`] = +Math.max(0.01, ctr).toFixed(4);
      });
      out.push(row);
    }
    return { ads, series: out };
  })(),

  change_history: [
    { date: '2026-04-15', user_email: 'agency@partner.sg', change_type: 'BID_STRATEGY_CHANGED', old_value: 'MANUAL_CPC', new_value: 'TARGET_CPA', campaign_name: '1-Arden | Search | NonBrand' },
    { date: '2026-04-14', user_email: 'agency@partner.sg', change_type: 'BUDGET_INCREASED', old_value: '250', new_value: '320', campaign_name: '1-Arden | Search | NonBrand' },
    { date: '2026-04-12', user_email: 'chris@1-group.com', change_type: 'KEYWORDS_ADDED', old_value: '', new_value: '12 broad keywords added', campaign_name: '1-Arden | Search | NonBrand' },
  ],
};

// ============================================================================
// AGENT SYSTEM PROMPTS
// ============================================================================

const COMPLIANCE_RULESET_INLINE = `
SINGAPORE POLICY RULESET — INLINED FROM singapore_policy_ruleset.md

§1. ALCOHOL (highest-priority for venues with has_alcohol: true).

§1.1 The 8 core rules — a compliant alcohol ad must satisfy ALL:
1. Age targeting must exclude under-18.
2. No appeal to minors — no youthful slang, school references, characters appealing to under-18s.
3. No health/safety/relaxation claims — alcohol does NOT have health benefits, does NOT aid relaxation in a medical sense, does NOT improve sleep/performance, is NOT "safer".
4. No encouragement of excessive consumption — NO "all-you-can-drink", "down it", challenges, group-binge imagery, "bottomless".
5. No social/sexual/professional success implications — alcohol does NOT lead to social acceptance, sexual success, professional achievement, courage, or status.
6. No pricing or promotional offers in ad text — NO "$10 cocktails", "1-for-1 wines", "happy hour 50% off", "$15 cocktails", "X% off", "buy one get one". This is the most-violated rule. Promotions can exist on landing pages but NEVER in the ad headline/description/callout/sitelink/extension.
7. No driving/vehicle/machinery context.
8. Responsible drinking disclaimers, where used, must be genuine — not token cover for non-compliant copy.

§1.2 Known violation patterns (FLAG RED on detection):
- "1-for-1 cocktails until 8pm" → ALCOHOL_PRICE_PROMO (rule 1.1.6)
- "Happy hour cocktails $15" → ALCOHOL_PRICE_PROMO (rule 1.1.6)
- "Best happy hour deals" → ALCOHOL_PRICE_PROMO (rule 1.1.6)
- "Unwind after a stressful day" → ALCOHOL_HEALTH_CLAIM (rule 1.1.3)
- "Ladies night every Thursday" → ALCOHOL_SOCIAL_APPEAL (rule 1.1.5)
- "Drinks that fuel success" → ALCOHOL_SUCCESS_IMPLICATION (rule 1.1.5)
- "Bottomless brunch" → ALCOHOL_EXCESSIVE_CONSUMPTION (rule 1.1.4)
- "Sip & share with the squad" → AMBER, borderline youthful framing (rule 1.1.2)
- Any "$N cocktails", "% off drinks", "cheap drinks" → ALCOHOL_PRICE_PROMO

§1.3 Compliant rewrites table:
- "1-for-1 cocktails until 8pm" → "Curated cocktail menu, sunset hours"
- "Happy hour cocktails $15" → "Crafted cocktails, intimate riverside bar"
- "Best happy hour deals" → "Crafted cocktails, riverside"
- "Unwind after a stressful day" → "Considered cocktails, rooftop view"
- "Ladies night every Thursday" → "Thursday evenings at [venue]"
- "Drinks that fuel success" → "Signature cocktails, refined setting"
- "Bottomless brunch" → "Weekend brunch with bar pairings"
- "Sip & share with the squad" → "Crafted cocktails, intimate setting"

§1.4 Allowed: venue category ("rooftop bar", "wine bar"), non-promotional product description ("Italian wines", "house cocktails"), sensory/atmospheric language ("riverside", "sunset views", "intimate", "candlelit"), verifiable accolades ("Asia's 50 Best Bars 2025"), neutral hours ("Open daily 5pm to late"), reservation CTAs.

§2. GAMBLING — flag classifier triggers in non-gambling copy:
"jackpot", "win big", "place your bets", "roll the dice", "try your luck" → AMBER (GAMBLING_CLASSIFIER_TRIGGER)

§3. HEALTHCARE CLAIMS — RED on:
"detox", "cleanse", "purifying", "boost immunity", "anti-ageing", "anti-inflammatory", "cure", "treat", "prevent", "lose weight", "fat-burning", "metabolism-boosting", "doctor-recommended", "clinically proven" (without study), "better for diabetics", "lower blood sugar".
AMBER on: "healthy" (in headlines), "nutritious"+"balanced" in headlines, "wellness" with specific outcomes.

§4. FINANCIAL — flag partner promotions ("X% off with [Bank] cards", "buy now pay later") for verification.

§5. TRADEMARK — RED on ANY competitor brand name in ad copy. Even comparative phrasing ("better than [Competitor]") is restricted.

§6. RAG STATUS:
- GREEN — passes all categories. Publishable.
- AMBER — borderline (one rule borderline). Surfaces with note. User can override but override is logged.
- RED — at least one violation. Execution Agent REFUSES to publish. User must accept rewrite or write new compliant version.

§7. WHEN IN DOUBT — confidence < 70% on green → default to AMBER. For alcohol-flagged venues, threshold is 80%.
`;

const AGENT_PROMPTS = {
  audit: (ctx) => `You are the Audit Agent for the 1-Group SEM Optimizer. You analyse Google Ads data for ${ctx.venue_name} and surface findings on wasted spend, irrelevant search terms, and creative fatigue. You NEVER recommend — that is the Strategy Agent's job. You only report findings.

VENUE CONTEXT:
- Name: ${ctx.venue_name}
- Positioning: ${ctx.positioning}
- Branded keyword patterns (EXCLUDE from wasted-spend findings): ${JSON.stringify(ctx.branded_patterns)}

DEFINITIONS:
- Wasted spend: keyword spent ≥ S$50 in 30 days AND (zero conversions OR conv_rate < 25% of account median OR CPA > 3× target).
- Negative keyword candidate: search term has ≥ 10 clicks AND zero conversions AND not currently a negative AND not branded.
- Creative fatigue: CTR in last 14 days < 70% of CTR in prior 14 days at stable impression volume.

IMPORTANT: Branded keywords are SACRED. Never include any keyword matching the branded patterns in wasted_spend findings, even if its conv rate is "low" — branded clicks defend against competitor poaching.

OUTPUT SCHEMA — respond with ONLY valid JSON, no preamble, no markdown fences:
{
  "wasted_spend_findings": [
    { "id": "string", "keyword": "string", "campaign": "string", "ad_group": "string", "spend_sgd": number, "clicks": number, "conversions": number, "ctr": number, "avg_cpc_sgd": number, "quality_score": number, "severity": "high|medium|low", "narrative": "one sentence" }
  ],
  "negative_keyword_candidates": [
    { "search_term": "string", "campaign": "string", "ad_group": "string", "spend_sgd": number, "clicks": number, "conversions": number, "reason": "string" }
  ],
  "new_keyword_opportunities": [
    { "search_term": "string", "campaign": "string", "spend_sgd": number, "clicks": number, "conversions": number, "narrative": "string" }
  ],
  "creative_fatigue_findings": [
    { "ad_id": "string", "campaign": "string", "ad_group": "string", "ctr_baseline": number, "ctr_recent": number, "decay_pct": number, "narrative": "string" }
  ],
  "summary": { "total_wasted_sgd": number, "negative_candidate_count": number, "fatigued_ad_count": number }
}`,

  diagnostic: (ctx) => `You are the Diagnostic Agent for the 1-Group SEM Optimizer. You explain a sudden change in metrics by correlating against account changes, the marketing calendar, and attribution. You ALWAYS produce two ranked hypotheses (most likely + second most likely). If the top hypothesis confidence is < 0.5, return inconclusive: true rather than guess.

VENUE CONTEXT:
- Name: ${ctx.venue_name}
- Investigation: ${ctx.investigation_target || 'open-ended anomaly scan'}

OUTPUT SCHEMA — respond with ONLY valid JSON:
{
  "anomaly_detected": boolean,
  "anomaly_summary": { "metric": "string", "direction": "drop|spike|none", "magnitude_pct": number, "window_start": "YYYY-MM-DD", "window_end": "YYYY-MM-DD" },
  "inconclusive": boolean,
  "hypotheses": [
    { "rank": 1, "cause": "string", "evidence": "string", "confidence": number, "secondary_metrics_supporting": ["string"], "recommended_next_action": "string" },
    { "rank": 2, "cause": "string", "evidence": "string", "confidence": number, "secondary_metrics_supporting": ["string"], "recommended_next_action": "string" }
  ],
  "correlated_events": [
    { "date": "YYYY-MM-DD", "source": "google_ads_change_history|marketing_calendar|attribution|external", "description": "string", "severity": "high|medium|low" }
  ]
}`,

  research: (ctx) => `You are the Research Agent for the 1-Group SEM Optimizer. You analyse seed keywords for ${ctx.venue_name} in Singapore and rank opportunities by SQR (search volume × intent fit ÷ competition).

VENUE CONTEXT:
- Name: ${ctx.venue_name}
- Positioning: ${ctx.positioning}
- Competitors: ${JSON.stringify(ctx.competitors)}
- Primary keyword themes: ${JSON.stringify(ctx.primary_keywords)}
- Branded patterns: ${JSON.stringify(ctx.branded_patterns)}

ACCESS MODE: ${ctx.access_mode === 3 ? 'Mode 3 (CSV) — LIVE Keyword Planner volumes UNAVAILABLE. Estimate volumes from existing campaign data and venue category. ALWAYS flag this limitation in the limitation_note field.' : 'Mode 1/2 — pretend you have live Keyword Planner access for the purpose of structured estimation.'}

OUTPUT SCHEMA — respond with ONLY valid JSON:
{
  "limitation_note": "string|null",
  "keyword_opportunities": [
    { "keyword": "string", "estimated_monthly_searches": number, "estimated_cpc_low_sgd": number, "estimated_cpc_high_sgd": number, "competition": "low|medium|high", "is_branded": boolean, "intent_fit": number, "sqr_score": number, "currently_targeting": boolean, "narrative": "string" }
  ],
  "competitor_keyword_overlap": [
    { "competitor": "string", "their_keywords_we_dont_target": ["string"], "our_keywords_they_dont_target": ["string"] }
  ]
}`,

  strategy: (ctx) => `You are the Strategy Agent for the 1-Group SEM Optimizer. Given Audit findings, Diagnostic hypotheses, and Research opportunities, produce ranked recommendations with projected impact and confidence.

HARD RULES:
- NEVER recommend Smart Bidding (Target CPA, tROAS, Maximise Conversions) for a campaign with < 30 conversions in 30 days. Output a refusal entry instead.
- NEVER recommend pausing branded keywords (matching ${JSON.stringify(ctx.branded_patterns)}).
- Every recommendation MUST include projected impact (delta, unit) and confidence (0-1).
- Bulk operations (>20 items) MUST be flagged with requires_typed_confirmation: true.

VENUE: ${ctx.venue_name}
TOTAL MONTHLY BUDGET CAP: S$${ctx.total_monthly_budget_sgd || 'not specified'}.

OUTPUT SCHEMA — respond with ONLY valid JSON:
{
  "recommended_actions": [
    { "id": "string", "action_type": "pause_keyword|add_keyword|add_negative|shift_budget|change_bid_strategy|update_match_type|refresh_creative|pause_ad", "title": "string", "target": "string", "before": "string", "after": "string", "affected_item_count": number, "short_verb": "string", "item_noun": "string", "projected_impact": { "metric": "string", "delta": number, "unit": "string", "delta_sgd": number }, "confidence": number, "confidence_reason": "string", "execution_priority": number, "requires_typed_confirmation": boolean, "refused": boolean, "refusal_reason": "string|null" }
  ],
  "projected_impact_summary": {
    "current_monthly_spend_sgd": number,
    "current_monthly_conversions": number,
    "projected_monthly_spend_sgd": number,
    "projected_monthly_conversions": number,
    "projected_monthly_savings_sgd": number,
    "lift_pct": number,
    "confidence": "low|medium|high"
  },
  "budget_allocation": {
    "current": [{ "campaign": "string", "budget_sgd": number }],
    "recommended": [{ "campaign": "string", "budget_sgd": number }]
  }
}`,

  compliance: (ctx) => `You are the Compliance Agent for the 1-Group SEM Optimizer. You enforce Singapore advertising policy on every creative asset. You have REFUSAL AUTHORITY — your RED status BLOCKS publication.

VENUE: ${ctx.venue_name}
HAS_ALCOHOL: ${ctx.has_alcohol}
COMPETITORS (flag any mention): ${JSON.stringify(ctx.competitors)}

${COMPLIANCE_RULESET_INLINE}

INSTRUCTIONS:
1. Apply ALCOHOL ruleset if has_alcohol is true.
2. Apply HEALTHCARE, GAMBLING, FINANCIAL, TRADEMARK rulesets universally.
3. For each asset, return rag_status, violations array, suggested_rewrite (compliant alternative).
4. If confidence < 80% on green for an alcohol-flagged venue, default to AMBER.

OUTPUT SCHEMA — respond with ONLY valid JSON:
{
  "per_asset_results": [
    {
      "asset_id": "string",
      "asset_type": "headline|description|callout|sitelink_text|structured_snippet",
      "content": "string",
      "rag_status": "green|amber|red",
      "violations": [
        { "rule_id": "string", "rule_category": "alcohol|gambling|healthcare|financial|trademark", "severity": "violation|warning", "evidence": "string", "suggested_rewrite": "string" }
      ],
      "compliant": boolean
    }
  ],
  "summary": { "green_count": number, "amber_count": number, "red_count": number, "blocking_violations": number }
}`,

  creative: (ctx) => `You are the Creative Agent for the 1-Group SEM Optimizer. Write RSA headlines (max 30 chars, up to 15) and descriptions (max 90 chars, up to 4) for ${ctx.venue_name}.

VENUE CONTEXT:
- Positioning: ${ctx.positioning}
- Target keywords: ${JSON.stringify(ctx.target_keywords)}
- Has alcohol: ${ctx.has_alcohol} — if true, pre-filter copy against alcohol ruleset.
- Landing page: ${ctx.landing_page}

REQUIREMENTS:
- Headlines must be ≤ 30 chars.
- Descriptions must be ≤ 90 chars.
- Each headline must support a specific keyword theme.
- For has_alcohol: NO pricing, NO "happy hour", NO "$X cocktails", NO "1-for-1", NO "unwind", NO "bottomless", NO "ladies night", NO "fuel success".
- Every output must chain to Compliance Agent before publication. Optimise for likely-green.

OUTPUT SCHEMA — respond with ONLY valid JSON:
{
  "rsa_set": {
    "headlines": [{ "text": "string", "theme": "string", "char_count": number }],
    "descriptions": [{ "text": "string", "char_count": number }]
  },
  "rationale": "string",
  "predicted_compliance_status": "green|amber|red"
}`,

  execution: (ctx) => `You are the Execution Agent for the 1-Group SEM Optimizer. You convert recommended actions into the precise commands or scripts needed to apply them, based on the user's available access mode.

ACCESS MODE: ${ctx.access_mode}
- Mode 1: produce natural-language MCP command sequences for the user's chat session.
- Mode 2: produce Python google-ads SDK code as a runnable script.
- Mode 3: produce copy-paste UI instructions for ads.google.com.

NEVER claim that the artifact has applied a change directly. Output is ALWAYS instructions for the user to execute.

OUTPUT SCHEMA — respond with ONLY valid JSON:
{
  "execution_payloads": [
    { "action_id": "string", "mode": 1, "mcp_commands": ["string"] },
    { "action_id": "string", "mode": 2, "python_snippet": "string" },
    { "action_id": "string", "mode": 3, "copy_paste_steps": ["string"] }
  ]
}`,
};

// ============================================================================
// DETERMINISTIC LOCAL FALLBACK — runs when no API key is provided
// ============================================================================

const localAuditFallback = (data, venue) => {
  const venueCtx = VENUES[venue] || VENUES['1-arden'];
  const isBranded = (kw) => venueCtx.branded_patterns.some(p => kw.toLowerCase().includes(p.toLowerCase()));
  const median = (arr) => {
    const sorted = [...arr].sort((a, b) => a - b);
    return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  };
  const accountMedianConvRate = median(
    (data.keyword_performance || []).filter(k => k.clicks > 0).map(k => k.conversions / k.clicks)
  );

  const wasted_spend_findings = (data.keyword_performance || [])
    .filter(k => !isBranded(k.keyword) && k.cost_sgd >= 50)
    .filter(k => {
      const convRate = k.clicks > 0 ? k.conversions / k.clicks : 0;
      return k.conversions === 0 || convRate < accountMedianConvRate * 0.25;
    })
    .map((k, i) => ({
      id: `waste_${i}`,
      keyword: k.keyword,
      campaign: k.campaign_name,
      ad_group: k.ad_group_name,
      spend_sgd: k.cost_sgd,
      clicks: k.clicks,
      conversions: k.conversions,
      ctr: k.ctr,
      avg_cpc_sgd: k.avg_cpc_sgd,
      quality_score: k.quality_score,
      severity: k.cost_sgd > 500 ? 'high' : k.cost_sgd > 200 ? 'medium' : 'low',
      narrative: `${k.cost_sgd >= 500 ? 'High' : 'Medium'} spend keyword "${k.keyword}" with ${k.conversions === 0 ? 'zero' : 'below-median'} conversions. QS ${k.quality_score}.`
    }))
    .sort((a, b) => b.spend_sgd - a.spend_sgd);

  const negative_keyword_candidates = (data.search_terms || [])
    .filter(t => t.added_excluded === 'None' && t.clicks >= 10 && t.conversions === 0)
    .filter(t => !isBranded(t.search_term))
    .map(t => ({
      search_term: t.search_term, campaign: t.campaign_name, ad_group: t.ad_group_name,
      spend_sgd: t.cost_sgd, clicks: t.clicks, conversions: 0,
      reason: `${t.clicks} clicks, S$${t.cost_sgd.toFixed(2)} spent, zero conversions over the period.`
    }));

  const new_keyword_opportunities = (data.search_terms || [])
    .filter(t => t.added_excluded === 'None' && t.conversions >= 1.5 && !isBranded(t.search_term))
    .map(t => ({
      search_term: t.search_term, campaign: t.campaign_name,
      spend_sgd: t.cost_sgd, clicks: t.clicks, conversions: t.conversions,
      narrative: `${t.conversions.toFixed(1)} conversions at S$${(t.cost_sgd / Math.max(t.conversions, 0.1)).toFixed(2)} CPA — converting search term not yet a target keyword.`
    }));

  // Creative fatigue from fatigue_data
  const creative_fatigue_findings = [];
  if (data.fatigue_data) {
    data.fatigue_data.ads.forEach(ad => {
      const series = data.fatigue_data.series.map(r => r[`ctr_${ad.id}`]);
      const recent14 = series.slice(-14);
      const prior14 = series.slice(-28, -14);
      const recentAvg = recent14.reduce((a, b) => a + b, 0) / recent14.length;
      const priorAvg = prior14.reduce((a, b) => a + b, 0) / prior14.length;
      if (priorAvg > 0 && recentAvg < priorAvg * 0.7) {
        creative_fatigue_findings.push({
          ad_id: ad.id, campaign: '1-Arden | Search', ad_group: ad.label,
          ctr_baseline: +priorAvg.toFixed(4), ctr_recent: +recentAvg.toFixed(4),
          decay_pct: +((1 - recentAvg / priorAvg) * 100).toFixed(1),
          narrative: `${ad.label} CTR dropped ${((1 - recentAvg / priorAvg) * 100).toFixed(0)}% over the trailing 14 days at stable impression volume — fatigue confirmed.`
        });
      }
    });
  }

  return {
    wasted_spend_findings,
    negative_keyword_candidates,
    new_keyword_opportunities,
    creative_fatigue_findings,
    summary: {
      total_wasted_sgd: +wasted_spend_findings.reduce((a, b) => a + b.spend_sgd, 0).toFixed(2),
      negative_candidate_count: negative_keyword_candidates.length,
      fatigued_ad_count: creative_fatigue_findings.length
    }
  };
};

const localDiagnosticFallback = (data, venue) => {
  const series = data.campaign_performance || [];
  if (series.length < 30) return { anomaly_detected: false, hypotheses: [], correlated_events: [] };
  const recent14 = series.slice(-14);
  const prior14 = series.slice(-28, -14);
  const recentConv = recent14.reduce((a, b) => a + b.conversions, 0);
  const priorConv = prior14.reduce((a, b) => a + b.conversions, 0);
  const dropPct = priorConv > 0 ? (1 - recentConv / priorConv) * 100 : 0;
  const detected = dropPct > 15;

  const events = (data.change_history || []).map(c => ({
    date: c.date, source: 'google_ads_change_history',
    description: `${c.change_type} on ${c.campaign_name}: ${c.old_value} → ${c.new_value}`,
    severity: c.change_type === 'BID_STRATEGY_CHANGED' ? 'high' : 'medium'
  }));

  return {
    anomaly_detected: detected,
    anomaly_summary: {
      metric: 'conversions', direction: detected ? 'drop' : 'none',
      magnitude_pct: +dropPct.toFixed(1),
      window_start: recent14[0]?.date, window_end: recent14[recent14.length - 1]?.date
    },
    inconclusive: false,
    hypotheses: detected ? [
      {
        rank: 1,
        cause: 'Bid strategy switched to Target CPA on 2026-04-15 — likely insufficient conversion volume for Smart Bidding optimisation',
        evidence: 'Change history shows TARGET_CPA activated on 2026-04-15. Conversion drop window starts 2026-04-15. Campaign has < 30 conversions/30 days threshold for Smart Bidding.',
        confidence: 0.78,
        secondary_metrics_supporting: ['CPA increased 35% post-change', 'Impression share lost to rank up 12pp', 'avg CPC volatile post-change'],
        recommended_next_action: 'Revert to Manual CPC or Enhanced CPC until campaign reaches 30+ conv/30 days, then re-evaluate.'
      },
      {
        rank: 2,
        cause: 'Broad-match keyword expansion on 2026-04-12 introduced low-intent traffic, diluting conversion rate',
        evidence: '12 broad keywords added on 2026-04-12. Search terms report shows 6+ irrelevant queries (jobs, photography, careers) consuming ~S$540 with zero conversions.',
        confidence: 0.62,
        secondary_metrics_supporting: ['CTR dropped on broad-match ad groups', 'Cost-per-click rose for non-branded segment'],
        recommended_next_action: 'Tighten match types from BROAD to PHRASE; add the 6 irrelevant search terms as negative keywords.'
      }
    ] : [
      { rank: 1, cause: 'No anomaly detected in the trailing 14 days', evidence: 'Conversions stable within ±10% of prior 14-day baseline', confidence: 0.85, secondary_metrics_supporting: [], recommended_next_action: 'No action needed' },
      { rank: 2, cause: 'Minor CTR softening on one ad group, within normal variance', evidence: 'Wedding ad group CTR -8% week-over-week', confidence: 0.40, secondary_metrics_supporting: [], recommended_next_action: 'Monitor for 7 more days' }
    ],
    correlated_events: events
  };
};

const localResearchFallback = (data, venue, accessMode) => {
  const v = VENUES[venue] || VENUES['1-arden'];
  const isBranded = (kw) => v.branded_patterns.some(p => kw.toLowerCase().includes(p.toLowerCase()));
  const opportunities = v.primary_keywords.map(k => ({
    keyword: k,
    estimated_monthly_searches: 800 + Math.round(Math.random() * 4000),
    estimated_cpc_low_sgd: 1.5 + Math.random() * 2,
    estimated_cpc_high_sgd: 4 + Math.random() * 4,
    competition: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    is_branded: isBranded(k),
    intent_fit: 0.7 + Math.random() * 0.25,
    sqr_score: +(Math.random() * 100).toFixed(1),
    currently_targeting: (data.keyword_performance || []).some(kw => kw.keyword === k),
    narrative: `Aligned with venue positioning. ${isBranded(k) ? 'Branded — defensive priority.' : 'Non-branded — potential expansion.'}`
  })).sort((a, b) => b.sqr_score - a.sqr_score);

  return {
    limitation_note: accessMode === 3 ? 'Live volume data unavailable — estimates based on existing campaign data and venue category. Connect Google Ads MCP for live Keyword Planner.' : null,
    keyword_opportunities: opportunities,
    competitor_keyword_overlap: v.competitors.slice(0, 3).map(c => ({
      competitor: c,
      their_keywords_we_dont_target: ['private dining ' + v.display_name.toLowerCase().split(' ')[0], 'tasting menu singapore', `${c.toLowerCase()} alternatives`],
      our_keywords_they_dont_target: v.primary_keywords.slice(0, 2)
    }))
  };
};

const localStrategyFallback = (auditOut, diagnosticOut, researchOut, venue) => {
  const v = VENUES[venue] || VENUES['1-arden'];
  const actions = [];
  let aid = 0;

  // Negative keywords action
  if (auditOut.negative_keyword_candidates?.length > 0) {
    const count = auditOut.negative_keyword_candidates.length;
    const savings = auditOut.negative_keyword_candidates.reduce((a, b) => a + b.spend_sgd, 0);
    actions.push({
      id: `act_${aid++}`,
      action_type: 'add_negative',
      title: `Add ${count} negative keywords`,
      target: `${v.display_name} non-branded campaigns`,
      before: 'Currently triggering on low-intent queries (jobs, careers, photography, "cheap")',
      after: `${count} negatives added — ad serving stops on these queries`,
      affected_item_count: count,
      short_verb: 'add', item_noun: 'negatives across ' + v.display_name,
      projected_impact: { metric: 'monthly savings', delta: +savings.toFixed(2) * 4, unit: 'SGD/month', delta_sgd: +(savings * 4).toFixed(2) },
      confidence: 0.85,
      confidence_reason: 'Search terms have ≥10 clicks each with zero conversions over 30 days — high confidence they will not convert.',
      execution_priority: 1,
      requires_typed_confirmation: count > 20,
      refused: false,
      refusal_reason: null
    });
  }

  // Pause wasted spend
  if (auditOut.wasted_spend_findings?.length > 0) {
    const high = auditOut.wasted_spend_findings.filter(f => f.severity === 'high');
    if (high.length > 0) {
      const savings = high.reduce((a, b) => a + b.spend_sgd, 0);
      actions.push({
        id: `act_${aid++}`,
        action_type: 'pause_keyword',
        title: `Pause ${high.length} high-waste keyword${high.length > 1 ? 's' : ''}`,
        target: `${v.display_name} non-branded campaigns`,
        before: high.map(f => `${f.keyword} (S$${f.spend_sgd.toFixed(0)} / ${f.conversions.toFixed(1)} conv)`).join('; '),
        after: 'Keywords paused, spend reallocated to converting keywords',
        affected_item_count: high.length,
        short_verb: 'pause', item_noun: 'keywords across ' + v.display_name,
        projected_impact: { metric: 'monthly savings', delta: +savings.toFixed(2), unit: 'SGD/month', delta_sgd: +savings.toFixed(2) },
        confidence: 0.72, confidence_reason: 'Branded excluded; CPA > 3× target on these keywords.',
        execution_priority: 2, requires_typed_confirmation: high.length > 20, refused: false, refusal_reason: null
      });
    }
  }

  // Bid strategy revert (from diagnostic)
  if (diagnosticOut.hypotheses?.[0]?.cause?.toLowerCase().includes('bid strategy')) {
    actions.push({
      id: `act_${aid++}`,
      action_type: 'change_bid_strategy',
      title: 'Revert non-branded campaign to Manual CPC',
      target: `${v.display_name} | Search | NonBrand`,
      before: 'TARGET_CPA (active since 2026-04-15)',
      after: 'MANUAL_CPC',
      affected_item_count: 1,
      short_verb: 'change', item_noun: 'bid strategy',
      projected_impact: { metric: 'monthly conversions', delta: 18, unit: '%', delta_sgd: null },
      confidence: 0.78,
      confidence_reason: 'Campaign has < 30 conv/30 days — Smart Bidding refusal threshold. Reverting should restore prior performance.',
      execution_priority: 1, requires_typed_confirmation: false, refused: false, refusal_reason: null
    });
  }

  // Refresh fatigued creative
  if (auditOut.creative_fatigue_findings?.length > 0) {
    auditOut.creative_fatigue_findings.forEach(f => {
      actions.push({
        id: `act_${aid++}`,
        action_type: 'refresh_creative',
        title: `Refresh fatigued ad: ${f.ad_group}`,
        target: f.ad_id,
        before: `CTR ${(f.ctr_recent * 100).toFixed(2)}% (down ${f.decay_pct.toFixed(0)}% from baseline)`,
        after: 'New RSA variants generated and submitted via Compliance Agent',
        affected_item_count: 1,
        short_verb: 'refresh', item_noun: 'ad',
        projected_impact: { metric: 'CTR lift', delta: 22, unit: '%', delta_sgd: null },
        confidence: 0.55,
        confidence_reason: 'Median refresh recovers ~70% of decayed CTR; specific lift depends on Compliance-passing copy quality.',
        execution_priority: 3, requires_typed_confirmation: false, refused: false, refusal_reason: null
      });
    });
  }

  const totalSavings = actions.reduce((a, b) => a + (b.projected_impact?.delta_sgd || 0), 0);
  const currentMonthlySpend = 8400;
  const currentMonthlyConv = 152;

  return {
    recommended_actions: actions,
    projected_impact_summary: {
      current_monthly_spend_sgd: currentMonthlySpend,
      current_monthly_conversions: currentMonthlyConv,
      projected_monthly_spend_sgd: currentMonthlySpend - totalSavings,
      projected_monthly_conversions: Math.round(currentMonthlyConv * 1.18),
      projected_monthly_savings_sgd: +totalSavings.toFixed(2),
      lift_pct: 18,
      confidence: 'medium'
    },
    budget_allocation: {
      current: [
        { campaign: 'Brand', budget_sgd: 2400 },
        { campaign: 'NonBrand · Fine Dining', budget_sgd: 2800 },
        { campaign: 'NonBrand · Wedding', budget_sgd: 1700 },
        { campaign: 'NonBrand · Other', budget_sgd: 1500 }
      ],
      recommended: [
        { campaign: 'Brand', budget_sgd: 2400 },
        { campaign: 'NonBrand · Fine Dining', budget_sgd: 2200 },
        { campaign: 'NonBrand · Wedding', budget_sgd: 2400 },
        { campaign: 'NonBrand · Other', budget_sgd: 1400 }
      ]
    }
  };
};

const COMPLIANCE_PATTERNS = {
  alcohol_price_promo: [
    { rx: /\b1[- ]for[- ]1\b/i, rule: 'ALCOHOL_PRICE_PROMO' },
    { rx: /happy hour.*\$\d+/i, rule: 'ALCOHOL_PRICE_PROMO' },
    { rx: /happy hour deals?/i, rule: 'ALCOHOL_PRICE_PROMO' },
    { rx: /\$\d+\s*(cocktails?|drinks?|wines?|beers?|spirits?)/i, rule: 'ALCOHOL_PRICE_PROMO' },
    { rx: /\d+%\s*off\s*(drinks?|cocktails?|wines?)/i, rule: 'ALCOHOL_PRICE_PROMO' },
    { rx: /buy one get one/i, rule: 'ALCOHOL_PRICE_PROMO' },
  ],
  alcohol_health_claim: [
    { rx: /unwind after/i, rule: 'ALCOHOL_HEALTH_CLAIM' },
    { rx: /relax with a drink/i, rule: 'ALCOHOL_HEALTH_CLAIM' },
    { rx: /healthy cocktails?/i, rule: 'ALCOHOL_HEALTH_CLAIM' },
  ],
  alcohol_excessive: [
    { rx: /bottomless/i, rule: 'ALCOHOL_EXCESSIVE_CONSUMPTION' },
    { rx: /all[- ]you[- ]can[- ]drink/i, rule: 'ALCOHOL_EXCESSIVE_CONSUMPTION' },
    { rx: /down it/i, rule: 'ALCOHOL_EXCESSIVE_CONSUMPTION' },
  ],
  alcohol_social_appeal: [
    { rx: /ladies[' ]?night/i, rule: 'ALCOHOL_SOCIAL_APPEAL' },
    { rx: /sip.*share.*squad/i, rule: 'ALCOHOL_SOCIAL_APPEAL' },
  ],
  alcohol_success: [
    { rx: /(drinks?|cocktails?|wines?).*(fuel|drive).*(success|ambition)/i, rule: 'ALCOHOL_SUCCESS_IMPLICATION' },
    { rx: /(success|status).*\b(drink|cocktail)/i, rule: 'ALCOHOL_SUCCESS_IMPLICATION' },
  ],
  healthcare: [
    { rx: /\b(detox|cleanse|cleansing|purifying)\b/i, rule: 'HEALTHCARE_CLAIM' },
    { rx: /boost.*immun/i, rule: 'HEALTHCARE_CLAIM' },
    { rx: /anti[- ]ageing/i, rule: 'HEALTHCARE_CLAIM' },
    { rx: /(cure|treat|prevent).*(illness|condition|disease)/i, rule: 'HEALTHCARE_CLAIM' },
    { rx: /clinically proven/i, rule: 'HEALTHCARE_CLAIM' },
  ],
  gambling: [
    { rx: /\bjackpot\b/i, rule: 'GAMBLING_CLASSIFIER_TRIGGER' },
    { rx: /win big/i, rule: 'GAMBLING_CLASSIFIER_TRIGGER' },
    { rx: /try your luck/i, rule: 'GAMBLING_CLASSIFIER_TRIGGER' },
    { rx: /place your bets/i, rule: 'GAMBLING_CLASSIFIER_TRIGGER' },
    { rx: /roll the dice/i, rule: 'GAMBLING_CLASSIFIER_TRIGGER' },
  ],
};

const REWRITE_TABLE = {
  ALCOHOL_PRICE_PROMO: 'Curated cocktail menu, sunset hours',
  ALCOHOL_HEALTH_CLAIM: 'Considered cocktails, refined setting',
  ALCOHOL_EXCESSIVE_CONSUMPTION: 'Weekend brunch with bar pairings',
  ALCOHOL_SOCIAL_APPEAL: 'Thursday evenings at the bar',
  ALCOHOL_SUCCESS_IMPLICATION: 'Signature cocktails, refined setting',
  HEALTHCARE_CLAIM: 'Fresh, seasonal menu',
  GAMBLING_CLASSIFIER_TRIGGER: 'Discover this weekend',
  TRADEMARK_VIOLATION: 'Singapore\'s signature dining experience',
};

const localComplianceFallback = (assets, venue) => {
  const v = VENUES[venue] || VENUES['1-arden'];
  const competitors = v.competitors;
  const has_alcohol = v.has_alcohol;

  const results = assets.map(asset => {
    const violations = [];
    const checkSet = (set, severity = 'violation') => {
      set.forEach(p => {
        const m = asset.content.match(p.rx);
        if (m) violations.push({
          rule_id: p.rule,
          rule_category: p.rule.startsWith('ALCOHOL') ? 'alcohol' : p.rule.startsWith('HEALTH') ? 'healthcare' : p.rule.startsWith('GAMBLING') ? 'gambling' : 'trademark',
          severity,
          evidence: m[0],
          suggested_rewrite: REWRITE_TABLE[p.rule] || 'Rephrase per Singapore policy'
        });
      });
    };

    if (has_alcohol) {
      checkSet(COMPLIANCE_PATTERNS.alcohol_price_promo);
      checkSet(COMPLIANCE_PATTERNS.alcohol_health_claim);
      checkSet(COMPLIANCE_PATTERNS.alcohol_excessive);
      checkSet(COMPLIANCE_PATTERNS.alcohol_social_appeal);
      checkSet(COMPLIANCE_PATTERNS.alcohol_success);
    }
    checkSet(COMPLIANCE_PATTERNS.healthcare);
    checkSet(COMPLIANCE_PATTERNS.gambling, 'warning');

    competitors.forEach(c => {
      const rx = new RegExp(`\\b${c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
      const m = asset.content.match(rx);
      if (m) violations.push({
        rule_id: 'TRADEMARK_VIOLATION', rule_category: 'trademark', severity: 'violation',
        evidence: m[0], suggested_rewrite: REWRITE_TABLE.TRADEMARK_VIOLATION
      });
    });

    const hasViolation = violations.some(v => v.severity === 'violation');
    const hasWarning = violations.some(v => v.severity === 'warning');
    const rag_status = hasViolation ? 'red' : hasWarning ? 'amber' : 'green';

    return {
      asset_id: asset.asset_id, asset_type: asset.asset_type, content: asset.content,
      rag_status, violations, compliant: rag_status === 'green'
    };
  });

  const summary = {
    green_count: results.filter(r => r.rag_status === 'green').length,
    amber_count: results.filter(r => r.rag_status === 'amber').length,
    red_count: results.filter(r => r.rag_status === 'red').length,
    blocking_violations: results.filter(r => r.rag_status === 'red').length
  };
  return { per_asset_results: results, summary };
};

const localCreativeFallback = (ctx) => {
  const v = VENUES[ctx.venue];
  const headlines = [
    'Premium Dining at Nat Gallery',
    'Fine Dining Singapore',
    'Reserve Your Table Tonight',
    'Crafted Tasting Menus',
    'Iconic Singapore Setting',
    'Curated Wine List',
    'Anniversary & Special Occasions',
    'Modern European Cuisine',
    'Riverside Sunset Views',
    'Award-Recognised Restaurant',
    'Open Daily for Dinner',
    'Private Dining Available',
    `${v.display_name} | National Gallery`,
    'Reserve Online',
    'Considered Cocktails, Rooftop'
  ].map(t => ({ text: t.slice(0, 30), theme: 'fine_dining', char_count: Math.min(t.length, 30) }));
  const descriptions = [
    'Premium dining at the National Gallery Singapore. Crafted tasting menus, intimate setting.',
    'Modern European cuisine in an iconic setting. Reserve your table for a refined evening.',
    'Curated wine pairings. Private dining for special occasions. Reserve today.',
    'Open daily for dinner. Anniversary and special-occasion bookings welcomed.'
  ].map(t => ({ text: t.slice(0, 90), char_count: Math.min(t.length, 90) }));
  return { rsa_set: { headlines, descriptions }, rationale: 'All copy avoids pricing, social-success implications, and competitor mentions. Aligned to landing page positioning.', predicted_compliance_status: 'green' };
};

// ============================================================================
// API CALL
// ============================================================================
async function callAgent(agentName, ctx, payload, apiKey, fallbackFn) {
  if (!apiKey) {
    await new Promise(r => setTimeout(r, 700 + Math.random() * 600));
    return fallbackFn();
  }
  try {
    const systemPrompt = AGENT_PROMPTS[agentName](ctx);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: JSON.stringify(payload) }]
      })
    });
    if (!response.ok) {
      const txt = await response.text();
      throw new Error(`API ${response.status}: ${txt.slice(0, 200)}`);
    }
    const data = await response.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("\n");
    return JSON.parse(text.replace(/```json|```/g, "").trim());
  } catch (e) {
    console.warn(`Agent ${agentName} API call failed, using deterministic fallback:`, e.message);
    return fallbackFn();
  }
}

// ============================================================================
// CSV PARSING (lightweight, no Papa Parse dependency)
// ============================================================================
const parseCSVText = (text) => {
  const lines = text.split(/\r?\n/).filter(l => l.trim().length);
  if (lines.length < 2) return { headers: [], rows: [] };
  const splitLine = (line) => {
    const out = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') inQ = !inQ;
      else if (ch === ',' && !inQ) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out.map(s => s.trim().replace(/^"|"$/g, ''));
  };
  const headers = splitLine(lines[0]).map(h => h.toLowerCase().trim());
  const rows = lines.slice(1).map(line => {
    const vals = splitLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      const v = vals[i];
      const num = parseFloat(v);
      obj[h] = (!isNaN(num) && /^[\d.\-,]+$/.test(v?.replace(/,/g, ''))) ? num : v;
    });
    return obj;
  });
  return { headers, rows };
};

const detectReportType = (headers) => {
  const headerSet = new Set(headers.map(h => h.toLowerCase()));
  const score = (canonical, aliases) => {
    let s = 0;
    canonical.forEach(c => { if (headerSet.has(c) || headerSet.has(c.replace(/_/g, ' '))) s++; });
    Object.keys(aliases).forEach(a => { if (headerSet.has(a)) s++; });
    return s;
  };
  let best = null; let bestScore = 0;
  Object.entries(CSV_NORMALIZATION).forEach(([type, def]) => {
    const s = score(def.canonical, def.aliases);
    if (s > bestScore) { bestScore = s; best = type; }
  });
  return bestScore >= 3 ? best : null;
};

const normalizeRows = (rows, type) => {
  const def = CSV_NORMALIZATION[type];
  if (!def) return rows;
  return rows.map(row => {
    const out = {};
    Object.entries(row).forEach(([k, v]) => {
      const lk = k.toLowerCase().trim();
      const canonical = def.aliases[lk] || (def.canonical.includes(lk) ? lk : null) || (def.canonical.includes(lk.replace(/ /g, '_')) ? lk.replace(/ /g, '_') : lk);
      out[canonical] = v;
    });
    return out;
  });
};

// ============================================================================
// PYTHON SCRIPT GENERATOR (Mode 2)
// ============================================================================
const generatePythonScript = (actions, customerId = 'YOUR_CUSTOMER_ID') => {
  const header = `"""
1-Group SEM Optimizer — generated execution script
Mode 2 (Python google-ads client). Run locally with developer credentials.

Setup:
  pip install google-ads
  Create google-ads.yaml in this directory (see google_ads_integration.md).
  export GOOGLE_ADS_CUSTOMER_ID=${customerId}

Each action is gated. Comment in the operations you want to run.
Every operation logs to changelog.json for undo support.
"""

import json, os, uuid, datetime
from google.ads.googleads.client import GoogleAdsClient

CUSTOMER_ID = os.environ.get("GOOGLE_ADS_CUSTOMER_ID", "${customerId}")
client = GoogleAdsClient.load_from_storage("google-ads.yaml")

CHANGELOG = []

def log(op, before, after):
    CHANGELOG.append({
        "id": str(uuid.uuid4()),
        "ts": datetime.datetime.utcnow().isoformat(),
        "op": op, "before": before, "after": after
    })
    with open("changelog.json", "w") as f:
        json.dump(CHANGELOG, f, indent=2)

`;
  const ops = actions.map((a, i) => {
    if (a.action_type === 'add_negative') {
      return `# Action ${i + 1} — ${a.title}
def action_${i + 1}_add_negatives():
    service = client.get_service("AdGroupCriterionService")
    ops = []
    # TODO: populate from your audit findings
    negatives = ${JSON.stringify(['fine dining jobs', 'fine dining career', 'cheap fine dining', 'wedding photography prices', 'wedding photographer recommendations'], null, 2)}
    for kw in negatives:
        op = client.get_type("AdGroupCriterionOperation")
        c = op.create
        c.ad_group = "customers/" + CUSTOMER_ID + "/adGroups/AD_GROUP_ID"
        c.negative = True
        c.keyword.text = kw
        c.keyword.match_type = client.enums.KeywordMatchTypeEnum.PHRASE
        ops.append(op)
    response = service.mutate_ad_group_criteria(customer_id=CUSTOMER_ID, operations=ops)
    log("add_negatives", {"count": 0}, {"count": len(ops), "results": [r.resource_name for r in response.results]})
    print(f"Added {len(ops)} negatives")
`;
    } else if (a.action_type === 'pause_keyword') {
      return `# Action ${i + 1} — ${a.title}
def action_${i + 1}_pause_keywords():
    service = client.get_service("AdGroupCriterionService")
    ops = []
    keyword_resource_names = []  # TODO: populate with full resource names
    for rn in keyword_resource_names:
        op = client.get_type("AdGroupCriterionOperation")
        c = op.update
        c.resource_name = rn
        c.status = client.enums.AdGroupCriterionStatusEnum.PAUSED
        client.copy_from(op.update_mask, client.get_type("FieldMask")(paths=["status"]))
        ops.append(op)
    response = service.mutate_ad_group_criteria(customer_id=CUSTOMER_ID, operations=ops)
    log("pause_keywords", {"status": "ENABLED"}, {"status": "PAUSED", "count": len(ops)})
    print(f"Paused {len(ops)} keywords")
`;
    } else if (a.action_type === 'change_bid_strategy') {
      return `# Action ${i + 1} — ${a.title}
def action_${i + 1}_change_bid_strategy():
    service = client.get_service("CampaignService")
    op = client.get_type("CampaignOperation")
    c = op.update
    c.resource_name = "customers/" + CUSTOMER_ID + "/campaigns/CAMPAIGN_ID"
    # Reverting to manual CPC
    c.manual_cpc.enhanced_cpc_enabled = False
    client.copy_from(op.update_mask, client.get_type("FieldMask")(paths=["manual_cpc"]))
    response = service.mutate_campaigns(customer_id=CUSTOMER_ID, operations=[op])
    log("change_bid_strategy", {"strategy": "TARGET_CPA"}, {"strategy": "MANUAL_CPC"})
    print(f"Bid strategy changed: {response.results[0].resource_name}")
`;
    }
    return `# Action ${i + 1} — ${a.title}: manual review required\n`;
  }).join('\n');

  const footer = `

if __name__ == "__main__":
    print("1-Group SEM Optimizer — generated script")
    print("Uncomment the action you want to apply, then run.")
    # action_1_add_negatives()
    # action_2_pause_keywords()
    # ...
`;
  return header + ops + footer;
};

// ============================================================================
// REDUCER
// ============================================================================
const initialState = {
  uploadedReports: { campaign_performance: null, keyword_performance: null, search_terms: null, ad_performance: null, asset_performance: null, ad_group_performance: null, extensions_performance: null, change_history: null },
  detectedAccessMode: 3,
  apiKey: '',
  demoMode: false,
  selectedVenue: '1-arden',
  activeWorkflow: null,
  workflowState: 'idle',
  agentProgress: [],
  dashboardData: null,
  changelog: [],
  uiState: { collapsedSections: {}, typedConfirmations: {}, executedActions: {}, skippedActions: {}, modeInstructions: null, runId: null, runStartTs: null },
  chatInput: '',
  pendingClarification: null,
  showSetupPanel: false,
  showApiKeyPanel: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_API_KEY': return { ...state, apiKey: action.payload };
    case 'TOGGLE_DEMO': return { ...state, demoMode: !state.demoMode };
    case 'SET_VENUE': return { ...state, selectedVenue: action.payload };
    case 'SET_INPUT': return { ...state, chatInput: action.payload };
    case 'SET_REPORT': return { ...state, uploadedReports: { ...state.uploadedReports, [action.payload.type]: action.payload.rows } };
    case 'CLEAR_REPORT': return { ...state, uploadedReports: { ...state.uploadedReports, [action.payload]: null } };
    case 'SET_ACCESS_MODE': return { ...state, detectedAccessMode: action.payload };
    case 'START_WORKFLOW':
      return {
        ...state,
        activeWorkflow: action.payload.id,
        workflowState: 'running',
        agentProgress: WORKFLOWS[action.payload.id].agents.map(a => ({ agent: a, status: 'pending', output: null, error: null, durationMs: null })),
        dashboardData: null,
        pendingClarification: null,
        uiState: { ...state.uiState, runId: 'run_' + Date.now().toString(36), runStartTs: Date.now() }
      };
    case 'AGENT_START':
      return { ...state, agentProgress: state.agentProgress.map(a => a.agent === action.payload ? { ...a, status: 'running', startTs: Date.now() } : a) };
    case 'AGENT_DONE':
      return {
        ...state,
        agentProgress: state.agentProgress.map(a =>
          a.agent === action.payload.agent
            ? { ...a, status: 'done', output: action.payload.output, durationMs: Date.now() - (a.startTs || Date.now()) }
            : a
        )
      };
    case 'AGENT_FAIL':
      return {
        ...state,
        agentProgress: state.agentProgress.map(a =>
          a.agent === action.payload.agent
            ? { ...a, status: 'failed', error: action.payload.error, durationMs: Date.now() - (a.startTs || Date.now()) }
            : a
        )
      };
    case 'WORKFLOW_DONE':
      return { ...state, workflowState: 'complete', dashboardData: action.payload };
    case 'WORKFLOW_FAIL':
      return { ...state, workflowState: 'failed' };
    case 'CANCEL_WORKFLOW':
      return { ...state, workflowState: 'idle', activeWorkflow: null, agentProgress: [] };
    case 'APPLY_ACTION':
      return {
        ...state,
        changelog: [...state.changelog, { id: action.payload.id, ts: Date.now(), title: action.payload.title, before: action.payload.before, after: action.payload.after, undone: false }],
        uiState: { ...state.uiState, executedActions: { ...state.uiState.executedActions, [action.payload.id]: true } }
      };
    case 'SKIP_ACTION':
      return { ...state, uiState: { ...state.uiState, skippedActions: { ...state.uiState.skippedActions, [action.payload]: true } } };
    case 'UNDO_LAST': {
      const last = state.changelog.findLast(c => !c.undone);
      if (!last) return state;
      return {
        ...state,
        changelog: state.changelog.map(c => c.id === last.id ? { ...c, undone: true } : c),
        uiState: { ...state.uiState, executedActions: { ...state.uiState.executedActions, [last.id]: false } }
      };
    }
    case 'UNDO_ALL': {
      const newExecuted = { ...state.uiState.executedActions };
      state.changelog.forEach(c => { newExecuted[c.id] = false; });
      return {
        ...state,
        changelog: state.changelog.map(c => ({ ...c, undone: true })),
        uiState: { ...state.uiState, executedActions: newExecuted }
      };
    }
    case 'SET_TYPED_CONFIRM':
      return { ...state, uiState: { ...state.uiState, typedConfirmations: { ...state.uiState.typedConfirmations, [action.payload.id]: action.payload.value } } };
    case 'TOGGLE_SECTION':
      return { ...state, uiState: { ...state.uiState, collapsedSections: { ...state.uiState.collapsedSections, [action.payload]: !state.uiState.collapsedSections[action.payload] } } };
    case 'SHOW_CLARIFICATION':
      return { ...state, pendingClarification: action.payload };
    case 'CLEAR_CLARIFICATION':
      return { ...state, pendingClarification: null };
    case 'TOGGLE_SETUP':
      return { ...state, showSetupPanel: !state.showSetupPanel };
    case 'TOGGLE_API_KEY_PANEL':
      return { ...state, showApiKeyPanel: !state.showApiKeyPanel };
    case 'SET_MODE_INSTRUCTIONS':
      return { ...state, uiState: { ...state.uiState, modeInstructions: action.payload } };
    default: return state;
  }
}

// ============================================================================
// PRESENTATIONAL HELPERS
// ============================================================================
const RAGBadge = ({ level, children }) => {
  const map = { red: 'bg-[#dc2626]/15 text-[#dc2626] border-[#dc2626]/40', amber: 'bg-[#d97706]/15 text-[#d97706] border-[#d97706]/40', green: 'bg-[#16a34a]/15 text-[#16a34a] border-[#16a34a]/40' };
  return <span className={`px-2 py-0.5 text-xs rounded-full border ${map[level] || ''}`}>{children || level.toUpperCase()}</span>;
};

const Section = ({ title, subtitle, children, anchorId }) => (
  <section id={anchorId} className="space-y-4">
    <div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, Playfair Display, serif' }} className="text-3xl text-[#1a1814]">{title}</h2>
      {subtitle && <p className="text-sm text-[#6b6660] mt-1">{subtitle}</p>}
    </div>
    {children}
  </section>
);

const Panel = ({ children, className = '' }) => (
  <div className={`bg-white border border-[#e8e2d8] rounded-lg p-6 ${className}`}>{children}</div>
);

const EmptyState = ({ icon: Icon = CheckCircle, message }) => (
  <Panel>
    <div className="flex flex-col items-center text-center py-8">
      <Icon className="w-10 h-10 text-[#404040] mb-4" />
      <p className="text-[#9a948e] text-sm">{message}</p>
    </div>
  </Panel>
);

const MetricCard = ({ label, value, sub, rag, Icon }) => {
  const accent = { red: '#dc2626', amber: '#d97706', green: '#16a34a' }[rag] || '#c9a961';
  return (
    <div className="bg-white border border-[#e8e2d8] rounded-lg p-6 border-l-4" style={{ borderLeftColor: accent }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-[#6b6660] uppercase tracking-wider mb-2">{label}</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-4xl text-[#1a1814]">{value}</div>
          {sub && <div className="text-xs text-[#6b6660] mt-2">{sub}</div>}
        </div>
        {Icon && <Icon className="w-5 h-5 text-[#9a948e]" />}
      </div>
    </div>
  );
};

// ============================================================================
// CHARTS — all 10 from dashboard_and_charts.md
// ============================================================================

const SpendVsConversionsChart = ({ data, anomalyDates = [] }) => (
  <ResponsiveContainer width="100%" height={300}>
    <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
      <CartesianGrid stroke="#e8e2d8" strokeDasharray="3 3" />
      <XAxis dataKey="date" stroke="#9a948e" tick={{ fontSize: 11 }} interval={Math.max(0, Math.floor(data.length / 8))} />
      <YAxis yAxisId="spend" orientation="left" stroke="#c9a961" tickFormatter={(v) => `S$${v}`} tick={{ fontSize: 11 }} />
      <YAxis yAxisId="conv" orientation="right" stroke="#16a34a" tick={{ fontSize: 11 }} />
      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6', color: '#1a1814' }} labelStyle={{ color: '#1a1814' }} />
      <Legend wrapperStyle={{ fontSize: 12 }} />
      <Bar yAxisId="spend" dataKey="cost_sgd" name="Spend (S$)" fill="#c9a961" opacity={0.6} />
      <Line yAxisId="conv" dataKey="conversions" name="Conversions" stroke="#16a34a" strokeWidth={2} dot={false} />
      {anomalyDates.map(d => <ReferenceLine key={d} yAxisId="spend" x={d} stroke="#dc2626" strokeDasharray="3 3" label={{ value: 'event', fill: '#dc2626', fontSize: 10 }} />)}
    </ComposedChart>
  </ResponsiveContainer>
);

const KeywordPerformanceScatter = ({ keywords, accountMedianConvRate }) => {
  const data = keywords.map(k => ({
    cpc: k.avg_cpc_sgd, convRate: k.clicks > 0 ? k.conversions / k.clicks : 0,
    spend: k.cost_sgd, name: k.keyword, qs: k.quality_score
  }));
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 20, right: 20, left: 20, bottom: 30 }}>
        <CartesianGrid stroke="#e8e2d8" />
        <XAxis type="number" dataKey="cpc" name="CPC" stroke="#6b6660" label={{ value: 'CPC (S$)', position: 'insideBottom', offset: -5, fill: '#6b6660' }} />
        <YAxis type="number" dataKey="convRate" name="Conv Rate" stroke="#6b6660" tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} label={{ value: 'Conv Rate', angle: -90, position: 'insideLeft', fill: '#6b6660' }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6', color: '#1a1814' }} formatter={(v, n, p) => n === 'Conv Rate' ? `${(v * 100).toFixed(2)}%` : v} />
        <Scatter data={data}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.spend > 500 ? '#dc2626' : d.spend > 200 ? '#d97706' : '#c9a961'} />
          ))}
        </Scatter>
        {accountMedianConvRate > 0 && (
          <ReferenceLine y={accountMedianConvRate} stroke="#9a948e" strokeDasharray="5 5" label={{ value: 'Median', fill: '#9a948e', position: 'right' }} />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

const SearchTermTreemap = ({ data }) => {
  const chartData = data.map(t => ({
    name: t.search_term, size: Math.max(t.cost_sgd, 1), conversions: t.conversions, cost_sgd: t.cost_sgd
  }));
  const Cell2 = (props) => {
    const { x, y, width, height, name, conversions } = props;
    const fill = conversions === 0 ? '#dc2626' : conversions < 2 ? '#d97706' : '#16a34a';
    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.45} stroke="#ffffff" strokeWidth={1} />
        {width > 70 && height > 28 && (
          <text x={x + 8} y={y + 20} fill="#1a1814" fontSize={11} style={{ pointerEvents: 'none' }}>
            {name?.length > 24 ? name.slice(0, 22) + '…' : name}
          </text>
        )}
      </g>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={350}>
      <Treemap data={chartData} dataKey="size" content={<Cell2 />} />
    </ResponsiveContainer>
  );
};

const HeadlineCTRChart = ({ data }) => (
  <ResponsiveContainer width="100%" height={Math.max(220, data.length * 36)}>
    <BarChart data={data} layout="vertical" margin={{ top: 10, right: 20, left: 30, bottom: 10 }}>
      <CartesianGrid stroke="#e8e2d8" strokeDasharray="3 3" />
      <XAxis type="number" tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} stroke="#6b6660" />
      <YAxis type="category" dataKey="label" width={200} stroke="#6b6660" tick={{ fontSize: 11 }} />
      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6', color: '#1a1814' }} formatter={(v) => `${(v * 100).toFixed(2)}%`} />
      <Bar dataKey="ctr">
        {data.map((d, i) => <Cell key={i} fill={d.fatigued ? '#dc2626' : '#c9a961'} />)}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

const AnomalyTimeline = ({ data, events }) => (
  <ResponsiveContainer width="100%" height={350}>
    <LineChart data={data} margin={{ top: 30, right: 20, left: 0, bottom: 10 }}>
      <CartesianGrid stroke="#e8e2d8" strokeDasharray="3 3" />
      <XAxis dataKey="date" stroke="#9a948e" tick={{ fontSize: 11 }} interval={Math.max(0, Math.floor(data.length / 8))} />
      <YAxis stroke="#9a948e" tick={{ fontSize: 11 }} />
      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6', color: '#1a1814' }} />
      <Line dataKey="conversions" stroke="#c9a961" strokeWidth={2} dot={false} />
      {events.map((e, i) => {
        const point = data.find(d => d.date === e.date);
        if (!point) return null;
        return (
          <ReferenceDot key={i} x={e.date} y={point.conversions} r={6}
            fill={e.severity === 'high' ? '#dc2626' : '#d97706'} stroke="#f5f5f5"
            label={{ value: e.shortLabel || e.description?.slice(0, 28), position: 'top', fill: '#1a1814', fontSize: 10 }} />
        );
      })}
    </LineChart>
  </ResponsiveContainer>
);

const BudgetSunburst = ({ current, recommended }) => {
  const colours = ['#c9a961', '#a3a3a3', '#737373', '#525252', '#404040'];
  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie data={current} dataKey="budget_sgd" nameKey="campaign" cx="50%" cy="50%" innerRadius={50} outerRadius={90} label={(e) => e.campaign?.length > 12 ? e.campaign.slice(0, 10) + '…' : e.campaign} labelLine={false} stroke="#ffffff">
          {current.map((c, i) => <Cell key={i} fill={colours[i % colours.length]} fillOpacity={0.55} />)}
        </Pie>
        <Pie data={recommended} dataKey="budget_sgd" nameKey="campaign" cx="50%" cy="50%" innerRadius={105} outerRadius={150} label={(e) => `S$${e.budget_sgd}`} labelLine={false} stroke="#ffffff">
          {recommended.map((c, i) => <Cell key={i} fill={colours[i % colours.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6', color: '#1a1814' }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const QualityScoreHistogram = ({ keywords }) => {
  const buckets = [
    { qs: 'QS 1-3', count: keywords.filter(k => k.quality_score >= 1 && k.quality_score <= 3).length },
    { qs: 'QS 4-6', count: keywords.filter(k => k.quality_score >= 4 && k.quality_score <= 6).length },
    { qs: 'QS 7-10', count: keywords.filter(k => k.quality_score >= 7 && k.quality_score <= 10).length },
  ];
  const colours = ['#dc2626', '#d97706', '#16a34a'];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={buckets}>
        <CartesianGrid stroke="#e8e2d8" strokeDasharray="3 3" />
        <XAxis dataKey="qs" stroke="#6b6660" tick={{ fontSize: 11 }} />
        <YAxis stroke="#6b6660" tick={{ fontSize: 11 }} />
        <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6' }} />
        <Bar dataKey="count">
          {buckets.map((b, i) => <Cell key={i} fill={colours[i]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const ImpressionShareWaterfall = ({ data }) => {
  const sourceIS = (data.search_impr_share || 0.62) * 100;
  const lostBudget = (data.search_lost_is_budget || 0.18) * 100;
  const lostRank = (data.search_lost_is_rank || 0.20) * 100;
  const waterfallData = [
    { name: 'Potential', value: 100, fill: '#9a948e' },
    { name: 'Lost to budget', value: lostBudget, fill: '#dc2626' },
    { name: 'Lost to rank', value: lostRank, fill: '#d97706' },
    { name: 'Actual IS', value: sourceIS, fill: '#c9a961' }
  ];
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={waterfallData}>
        <CartesianGrid stroke="#e8e2d8" strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#6b6660" tick={{ fontSize: 11 }} />
        <YAxis stroke="#6b6660" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
        <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6', color: '#1a1814' }} formatter={(v) => `${v.toFixed(1)}%`} />
        <Bar dataKey="value">
          {waterfallData.map((d, i) => <Cell key={i} fill={d.fill} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

const FatigueDecayCurves = ({ ads, series }) => (
  <ResponsiveContainer width="100%" height={350}>
    <LineChart data={series} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
      <CartesianGrid stroke="#e8e2d8" strokeDasharray="3 3" />
      <XAxis dataKey="date" stroke="#9a948e" tick={{ fontSize: 11 }} interval={Math.max(0, Math.floor(series.length / 8))} />
      <YAxis stroke="#9a948e" tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v * 100).toFixed(1)}%`} />
      <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6', color: '#1a1814' }} formatter={(v) => `${(v * 100).toFixed(2)}%`} />
      <Legend wrapperStyle={{ fontSize: 11 }} />
      {ads.map(ad => (
        <Line key={ad.id} dataKey={`ctr_${ad.id}`} stroke={ad.fatigued ? '#dc2626' : '#737373'} strokeWidth={ad.fatigued ? 2 : 1} opacity={ad.fatigued ? 1 : 0.5} dot={false} name={ad.label} />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

const NegativeKeywordImpactProjection = ({ savings = 540, currentSpend = 2100 }) => {
  const data = [];
  for (let w = 1; w <= 13; w++) {
    const ramp = Math.min(1, w / 4);
    data.push({
      week: `W${w}`,
      spend: Math.max(0, currentSpend - savings * ramp),
      savings: savings * ramp * 0.7,
      reallocated: savings * ramp * 0.3,
    });
  }
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
        <CartesianGrid stroke="#e8e2d8" strokeDasharray="3 3" />
        <XAxis dataKey="week" stroke="#6b6660" tick={{ fontSize: 11 }} />
        <YAxis stroke="#6b6660" tick={{ fontSize: 11 }} tickFormatter={(v) => `S$${Math.round(v)}`} />
        <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c9c2b6', color: '#1a1814' }} formatter={(v) => `S$${v.toFixed(0)}`} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Area type="monotone" dataKey="spend" stackId="1" stroke="#9a948e" fill="#9a948e" name="Remaining spend" />
        <Area type="monotone" dataKey="savings" stackId="1" stroke="#16a34a" fill="#16a34a" name="Savings from negatives" />
        <Area type="monotone" dataKey="reallocated" stackId="1" stroke="#c9a961" fill="#c9a961" name="Reallocated to opportunities" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// ============================================================================
// MAIN APP
// ============================================================================

const FILE_KEY_TO_LABEL = {
  campaign_performance: 'Campaign performance',
  keyword_performance: 'Keyword performance',
  search_terms: 'Search terms',
  ad_performance: 'Ad performance (RSAs)',
  asset_performance: 'Asset performance',
  ad_group_performance: 'Ad group performance',
  extensions_performance: 'Extensions performance',
  change_history: 'Change history'
};

export default function SEMOptimizerApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [showApiInfo, setShowApiInfo] = useState(false);

  const dataSource = useMemo(() => {
    if (state.demoMode) return DEMO_DATA;
    return {
      campaign_performance: state.uploadedReports.campaign_performance || [],
      keyword_performance: state.uploadedReports.keyword_performance || [],
      search_terms: state.uploadedReports.search_terms || [],
      ad_performance: state.uploadedReports.ad_performance || [],
      asset_performance: state.uploadedReports.asset_performance || [],
      ad_group_performance: state.uploadedReports.ad_group_performance || [],
      extensions_performance: state.uploadedReports.extensions_performance || [],
      change_history: state.uploadedReports.change_history || [],
      fatigue_data: null
    };
  }, [state.demoMode, state.uploadedReports]);

  const accessMode = state.demoMode ? 3 : (state.detectedAccessMode || 3);

  // ----- Workflow runner -----
  const runWorkflow = useCallback(async (workflowId, opts = {}) => {
    const wf = WORKFLOWS[workflowId];
    if (!wf) return;
    dispatch({ type: 'START_WORKFLOW', payload: { id: workflowId } });

    const venue = state.selectedVenue;
    const v = VENUES[venue] || VENUES['1-arden'];
    const ctx = {
      venue: venue, venue_name: v.display_name, positioning: v.positioning,
      branded_patterns: v.branded_patterns, competitors: v.competitors,
      primary_keywords: v.primary_keywords, has_alcohol: v.has_alcohol,
      access_mode: accessMode,
      target_keywords: v.primary_keywords, landing_page: v.landing_page,
      investigation_target: opts.investigationTarget,
      total_monthly_budget_sgd: 8400,
    };

    const outputs = {};

    for (const agent of wf.agents) {
      dispatch({ type: 'AGENT_START', payload: agent });
      try {
        let output;
        if (agent === 'audit') {
          output = await callAgent('audit', ctx, dataSource, state.apiKey, () => localAuditFallback(dataSource, venue));
        } else if (agent === 'diagnostic') {
          output = await callAgent('diagnostic', ctx, dataSource, state.apiKey, () => localDiagnosticFallback(dataSource, venue));
        } else if (agent === 'research') {
          output = await callAgent('research', ctx, { seed_keywords: v.primary_keywords, venue, audit: outputs.audit }, state.apiKey, () => localResearchFallback(dataSource, venue, accessMode));
        } else if (agent === 'strategy') {
          output = await callAgent('strategy', ctx, { audit: outputs.audit, diagnostic: outputs.diagnostic, research: outputs.research }, state.apiKey, () => localStrategyFallback(outputs.audit || {}, outputs.diagnostic || { hypotheses: [] }, outputs.research || {}, venue));
        } else if (agent === 'compliance') {
          // Build asset list from ad_performance
          const assets = [];
          (dataSource.ad_performance || []).forEach(ad => {
            (ad.headlines || '').split('|').forEach((h, i) => {
              if (h.trim()) assets.push({ asset_id: `${ad.ad_id}_h${i}`, asset_type: 'headline', content: h.trim(), venue, has_alcohol: v.has_alcohol });
            });
            (ad.descriptions || '').split('|').forEach((d, i) => {
              if (d.trim()) assets.push({ asset_id: `${ad.ad_id}_d${i}`, asset_type: 'description', content: d.trim(), venue, has_alcohol: v.has_alcohol });
            });
          });
          output = await callAgent('compliance', ctx, { assets }, state.apiKey, () => localComplianceFallback(assets, venue));
        } else if (agent === 'creative') {
          output = await callAgent('creative', ctx, { target_keywords: v.primary_keywords, ad_group: opts.adGroup || 'all' }, state.apiKey, () => localCreativeFallback(ctx));
          if (output?.rsa_set) {
            const newAssets = [
              ...output.rsa_set.headlines.map((h, i) => ({ asset_id: `new_h${i}`, asset_type: 'headline', content: h.text, venue, has_alcohol: v.has_alcohol })),
              ...output.rsa_set.descriptions.map((d, i) => ({ asset_id: `new_d${i}`, asset_type: 'description', content: d.text, venue, has_alcohol: v.has_alcohol })),
            ];
            const cmpl = await callAgent('compliance', ctx, { assets: newAssets }, state.apiKey, () => localComplianceFallback(newAssets, venue));
            outputs.compliance = cmpl;
            dispatch({ type: 'AGENT_DONE', payload: { agent: 'compliance', output: cmpl } });
          }
        }
        outputs[agent] = output;
        dispatch({ type: 'AGENT_DONE', payload: { agent, output } });
      } catch (e) {
        dispatch({ type: 'AGENT_FAIL', payload: { agent, error: e.message } });
      }
    }

    dispatch({ type: 'WORKFLOW_DONE', payload: outputs });
  }, [state.selectedVenue, state.apiKey, dataSource, accessMode]);

  // ----- File upload -----
  const handleFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const { headers, rows } = parseCSVText(text);
      const type = detectReportType(headers);
      if (!type) {
        alert(`Could not auto-detect report type from columns: ${headers.slice(0, 5).join(', ')}…\n\nPlease ensure this is one of the 8 canonical Google Ads exports.`);
        return;
      }
      const normalized = normalizeRows(rows, type);
      dispatch({ type: 'SET_REPORT', payload: { type, rows: normalized } });
      dispatch({ type: 'SET_ACCESS_MODE', payload: 3 });
    };
    reader.readAsText(file);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach(handleFile);
  }, [handleFile]);

  // ----- Quick action handlers -----
  const handleChatSubmit = () => {
    const input = state.chatInput.toLowerCase();
    if (!input.trim()) return;
    if (input.includes('audit') || input.includes('full review') || input.includes('deep')) runWorkflow(1);
    else if (input.includes('weekly') || input.includes('this week')) runWorkflow(2);
    else if (input.includes('why') || input.includes('drop') || input.includes('spike') || input.includes('happened')) runWorkflow(3, { investigationTarget: state.chatInput });
    else if (input.includes('rewrite') || input.includes('refresh') || input.includes('headlines') || input.includes('rsa')) runWorkflow(4);
    else if (input.includes('quarterly') || input.includes('budget plan') || input.includes('reallocation') || input.includes('90 day')) runWorkflow(5);
    else if (input.includes('compliance') || input.includes('policy') || input.includes('alcohol')) runWorkflow(6);
    else {
      // ambiguous — ask one clarifying question
      dispatch({ type: 'SHOW_CLARIFICATION', payload: { input: state.chatInput } });
    }
    dispatch({ type: 'SET_INPUT', payload: '' });
  };

  // ----- Action handlers -----
  const onApply = (action) => {
    const conf = state.uiState.typedConfirmations[action.id] || '';
    const expected = `yes, ${action.short_verb} ${action.affected_item_count} ${action.item_noun}`;
    if (action.requires_typed_confirmation && conf.toLowerCase().trim() !== expected.toLowerCase().trim()) {
      alert('Typed confirmation does not match. Required: ' + expected);
      return;
    }
    if (action.refused) {
      alert('This action is refused: ' + action.refusal_reason);
      return;
    }
    // Generate mode-specific instructions
    let instructions;
    if (accessMode === 1) {
      instructions = { type: 'mcp', action, lines: ['Open the chat where the Google Ads MCP is connected and run:', `> Apply action ${action.id}: ${action.title}`, `> Target: ${action.target}`, `> Change: ${action.before} → ${action.after}`] };
    } else if (accessMode === 2) {
      const py = generatePythonScript([action]);
      instructions = { type: 'python', action, script: py };
    } else {
      const steps = [
        `1. Open ads.google.com and select the ${state.selectedVenue} account.`,
        `2. Navigate to the relevant campaign: ${action.target}`,
        `3. ${action.action_type === 'add_negative' ? 'Go to Negative keywords → +Add → paste your list.' : action.action_type === 'pause_keyword' ? 'Select the keyword(s) → Edit → Pause.' : action.action_type === 'change_bid_strategy' ? 'Settings → Bid strategy → switch to ' + action.after : 'Apply the change as described.'}`,
        `4. Confirm the change.`
      ];
      instructions = { type: 'csv', action, steps };
    }
    dispatch({ type: 'SET_MODE_INSTRUCTIONS', payload: instructions });
    dispatch({ type: 'APPLY_ACTION', payload: { id: action.id, title: action.title, before: action.before, after: action.after } });
  };

  const detectedReports = Object.entries(state.uploadedReports).filter(([k, v]) => v).map(([k]) => k);
  const missingReports = Object.keys(state.uploadedReports).filter(k => !state.uploadedReports[k]);

  const hasData = state.demoMode || detectedReports.length > 0;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#1a1814]" style={{ fontFamily: 'Inter Tight, system-ui, sans-serif' }}>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter+Tight:wght@300;400;500;600&display=swap" />

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#faf7f2]/95 backdrop-blur border-b border-[#e8e2d8]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#c9a961] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#0a0a0a]" />
            </div>
            <div>
              <h1 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-2xl leading-none">1-Group SEM Optimizer</h1>
              <div className="text-xs text-[#6b6660] mt-0.5">Multi-agent Google Ads analysis · Singapore policy aware</div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select value={state.selectedVenue} onChange={(e) => dispatch({ type: 'SET_VENUE', payload: e.target.value })} className="bg-white border border-[#e8e2d8] rounded px-3 py-2 text-sm focus:border-[#c9a961] outline-none">
              {Object.entries(VENUES).map(([k, v]) => <option key={k} value={k}>{v.display_name}</option>)}
            </select>
            <span className="px-2 py-1 text-xs rounded border border-[#c9a961]/40 text-[#c9a961]">Mode {accessMode}</span>
            <button onClick={() => dispatch({ type: 'TOGGLE_API_KEY_PANEL' })} className="text-xs text-[#6b6660] hover:text-[#c9a961]">{state.apiKey ? 'API ✓' : 'Set API key'}</button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10">
        {/* API KEY PANEL */}
        {state.showApiKeyPanel && (
          <Panel>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl mb-3">Anthropic API key</h3>
            <p className="text-sm text-[#6b6660] mb-3">Optional. If provided, agents call <code className="text-[#c9a961]">api.anthropic.com/v1/messages</code> in your browser. If omitted, the tool runs deterministic local analysis with the same output schema. Key is held in memory only — no localStorage.</p>
            <input type="password" placeholder="sk-ant-…" value={state.apiKey} onChange={(e) => dispatch({ type: 'SET_API_KEY', payload: e.target.value })} className="w-full bg-[#faf7f2] border border-[#c9c2b6] rounded px-3 py-2 text-sm" />
          </Panel>
        )}

        {/* HERO / SETUP */}
        {!hasData && (
          <Panel className="border-[#c9a961]/30">
            <div className="text-center py-6">
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-4xl mb-3">Audit, refresh, and protect your Google Ads</h2>
              <p className="text-sm text-[#6b6660] max-w-2xl mx-auto mb-6">
                Eight specialist agents — Audit, Diagnostic, Research, Strategy, Compliance, Creative, Execution, Reporting — run sequentially against your account, surface findings, and produce confirmation-gated action cards. Singapore alcohol policy is enforced on every creative asset.
              </p>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <button onClick={() => dispatch({ type: 'TOGGLE_DEMO' })} className="bg-[#c9a961] text-[#0a0a0a] px-6 py-3 rounded font-semibold flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" /> Try Demo Mode (1-Arden seeded data)
                </button>
                <label className="border border-[#c9c2b6] hover:border-[#c9a961] px-6 py-3 rounded cursor-pointer flex items-center justify-center gap-2 transition">
                  <Upload className="w-4 h-4" /> Upload Google Ads CSVs
                  <input type="file" accept=".csv" multiple className="hidden" onChange={(e) => Array.from(e.target.files).forEach(handleFile)} />
                </label>
                <button onClick={() => dispatch({ type: 'TOGGLE_SETUP' })} className="border border-[#c9c2b6] hover:border-[#c9a961] px-6 py-3 rounded flex items-center justify-center gap-2 transition">
                  <Wifi className="w-4 h-4" /> Set up Mode 1 / Mode 2
                </button>
              </div>
            </div>
          </Panel>
        )}

        {/* SETUP PANEL */}
        {state.showSetupPanel && (
          <Panel>
            <div className="flex items-start justify-between mb-3">
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl">Connect Google Ads — Mode 1 or Mode 2</h3>
              <button onClick={() => dispatch({ type: 'TOGGLE_SETUP' })}><X className="w-4 h-4 text-[#6b6660]" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-[#faf7f2] rounded p-4 border border-[#e8e2d8]">
                <div className="flex items-center gap-2 mb-2"><Wifi className="w-4 h-4 text-[#c9a961]" /><h4 className="text-[#c9a961]">Mode 1 — MCP (preferred)</h4></div>
                <p className="text-xs text-[#6b6660] mb-3">Live reads + writes inside the chat. One-click apply.</p>
                <ol className="text-xs text-[#6b6660] space-y-1 list-decimal list-inside">
                  <li>In Claude, click the connectors menu.</li>
                  <li>Search "Google Ads" in MCP registry.</li>
                  <li>Connect the official MCP server with OAuth.</li>
                  <li>Re-open this artifact — Mode 1 auto-detects.</li>
                </ol>
              </div>
              <div className="bg-[#faf7f2] rounded p-4 border border-[#e8e2d8]">
                <div className="flex items-center gap-2 mb-2"><Code className="w-4 h-4 text-[#c9a961]" /><h4 className="text-[#c9a961]">Mode 2 — Python</h4></div>
                <p className="text-xs text-[#6b6660] mb-3">Reads + writes via google-ads SDK. Run locally.</p>
                <ol className="text-xs text-[#6b6660] space-y-1 list-decimal list-inside">
                  <li>Get developer token from ads.google.com → Tools → API Center.</li>
                  <li>Create OAuth 2.0 desktop client in Cloud Console.</li>
                  <li>Generate refresh token; save in google-ads.yaml.</li>
                  <li>pip install google-ads</li>
                  <li>Use the per-action Python button to download scripts.</li>
                </ol>
              </div>
            </div>
          </Panel>
        )}

        {/* MODE 3 LIMITATIONS BANNER */}
        {hasData && accessMode === 3 && (
          <div className="bg-[#d97706]/10 border border-[#d97706]/40 rounded p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#d97706] mt-0.5 shrink-0" />
            <div className="text-sm">
              <strong className="text-[#d97706]">Mode 3 (CSV) — read-only.</strong>
              <ul className="text-xs text-[#6b6660] mt-1 space-y-0.5 list-disc list-inside">
                <li>Live keyword research unavailable — Research Agent estimates from existing campaign data.</li>
                <li>Writes disabled — Apply produces copy-paste UI instructions, not direct API calls.</li>
                <li>Change history depends on what was exported — anomaly hypotheses may be lower confidence.</li>
              </ul>
            </div>
          </div>
        )}

        {/* DETECTED REPORTS PANEL */}
        {hasData && !state.demoMode && (
          <Panel>
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl mb-3">Detected reports</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {Object.keys(state.uploadedReports).map(k => (
                <div key={k} className="flex items-center justify-between p-2 rounded border border-[#e8e2d8]">
                  <div className="flex items-center gap-2">
                    {state.uploadedReports[k] ? <Check className="w-4 h-4 text-[#16a34a]" /> : <X className="w-4 h-4 text-[#9a948e]" />}
                    <div>
                      <div className="text-sm">{FILE_KEY_TO_LABEL[k]}</div>
                      <div className="text-xs text-[#9a948e]">{state.uploadedReports[k] ? `${state.uploadedReports[k].length} rows` : REPORT_DESCRIPTIONS[k]}</div>
                    </div>
                  </div>
                  {state.uploadedReports[k] && (
                    <button onClick={() => dispatch({ type: 'CLEAR_REPORT', payload: k })} className="text-[#9a948e] hover:text-[#dc2626]"><Trash2 className="w-4 h-4" /></button>
                  )}
                </div>
              ))}
            </div>
            {missingReports.length > 0 && (
              <p className="text-xs text-[#6b6660] mt-3">Missing reports limit some agents. Upload more CSVs anytime — auto-detection runs on each file.</p>
            )}
          </Panel>
        )}

        {/* COMMAND BAR */}
        {hasData && (
          <Panel>
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-[#c9a961]" />
              <input
                type="text"
                value={state.chatInput}
                onChange={(e) => dispatch({ type: 'SET_INPUT', payload: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') handleChatSubmit(); }}
                placeholder='Ask anything: "audit our 1-Arden", "why did conversions drop?", "rewrite headlines"…'
                className="flex-1 bg-[#faf7f2] border border-[#c9c2b6] rounded px-3 py-2 text-sm focus:border-[#c9a961] outline-none"
              />
              <button onClick={handleChatSubmit} className="bg-[#c9a961] text-[#0a0a0a] px-4 py-2 rounded font-semibold flex items-center gap-2"><Send className="w-4 h-4" /> Run</button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { id: 1, label: 'Full audit', icon: Eye },
                { id: 2, label: 'Weekly review', icon: Calendar },
                { id: 3, label: 'Why dropped?', icon: TrendingDown },
                { id: 4, label: 'Refresh ads', icon: Sparkles },
                { id: 5, label: 'Quarterly plan', icon: Target },
                { id: 6, label: 'Compliance sweep', icon: Shield },
              ].map(b => (
                <button key={b.id} onClick={() => runWorkflow(b.id)} disabled={state.workflowState === 'running'} className="border border-[#e8e2d8] hover:border-[#c9a961] hover:text-[#c9a961] px-3 py-1.5 rounded transition flex items-center gap-1.5 disabled:opacity-40">
                  <b.icon className="w-3 h-3" /> {b.label}
                </button>
              ))}
            </div>
          </Panel>
        )}

        {/* CLARIFICATION */}
        {state.pendingClarification && (
          <Panel className="border-[#c9a961]/40">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-[#c9a961] mt-1" />
              <div className="flex-1">
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-lg mb-2">One quick question</h4>
                <p className="text-sm text-[#6b6660] mb-3">Your input was ambiguous. Which workflow fits best?</p>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5, 6].map(id => (
                    <button key={id} onClick={() => { dispatch({ type: 'CLEAR_CLARIFICATION' }); runWorkflow(id); }} className="border border-[#e8e2d8] hover:border-[#c9a961] px-3 py-2 rounded text-xs">
                      <div className="text-[#c9a961] font-semibold">{WORKFLOWS[id].name}</div>
                      <div className="text-[#9a948e] text-[10px] mt-0.5">~{WORKFLOWS[id].duration[0]}–{WORKFLOWS[id].duration[1]} min</div>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => dispatch({ type: 'CLEAR_CLARIFICATION' })}><X className="w-4 h-4 text-[#9a948e]" /></button>
            </div>
          </Panel>
        )}

        {/* AGENT PROGRESS */}
        {state.workflowState === 'running' && (
          <Panel>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl">Running: {WORKFLOWS[state.activeWorkflow]?.name}</h3>
                <p className="text-xs text-[#6b6660]">Workflow {state.activeWorkflow} · {state.agentProgress.length} agents · est {WORKFLOWS[state.activeWorkflow]?.duration?.join('–')} min</p>
              </div>
              <button onClick={() => dispatch({ type: 'CANCEL_WORKFLOW' })} className="text-xs text-[#9a948e] hover:text-[#dc2626]">Cancel</button>
            </div>
            <div className="space-y-2">
              {state.agentProgress.map((a, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {a.status === 'pending' && <Clock className="w-4 h-4 text-[#9a948e]" />}
                    {a.status === 'running' && <Loader className="w-4 h-4 text-[#c9a961] animate-spin" />}
                    {a.status === 'done' && <CheckCircle className="w-4 h-4 text-[#16a34a]" />}
                    {a.status === 'failed' && <XCircle className="w-4 h-4 text-[#dc2626]" />}
                  </div>
                  <div className="flex-1">
                    <div className={a.status === 'done' ? 'text-[#16a34a]' : a.status === 'running' ? 'text-[#c9a961]' : a.status === 'failed' ? 'text-[#dc2626]' : 'text-[#9a948e]'}>
                      {AGENT_LABELS[a.agent]}
                    </div>
                    {a.error && <div className="text-xs text-[#dc2626]">{a.error}</div>}
                  </div>
                  {a.durationMs !== null && a.durationMs !== undefined && a.status !== 'pending' && (
                    <div className="text-xs text-[#9a948e]">{(a.durationMs / 1000).toFixed(1)}s</div>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* MODE INSTRUCTIONS MODAL */}
        {state.uiState.modeInstructions && (
          <Panel className="border-[#c9a961]/40">
            <div className="flex items-start justify-between mb-3">
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl">Apply: {state.uiState.modeInstructions.action.title}</h3>
              <button onClick={() => dispatch({ type: 'SET_MODE_INSTRUCTIONS', payload: null })}><X className="w-4 h-4 text-[#9a948e]" /></button>
            </div>
            {state.uiState.modeInstructions.type === 'csv' && (
              <div>
                <p className="text-xs text-[#6b6660] mb-2">Mode 3 — copy-paste these steps into ads.google.com:</p>
                <ol className="bg-[#faf7f2] rounded p-4 text-sm space-y-2">
                  {state.uiState.modeInstructions.steps.map((s, i) => <li key={i}>{s}</li>)}
                </ol>
                <button onClick={() => navigator.clipboard?.writeText(state.uiState.modeInstructions.steps.join('\n'))} className="mt-3 text-xs text-[#c9a961] flex items-center gap-1"><Copy className="w-3 h-3" /> Copy steps</button>
              </div>
            )}
            {state.uiState.modeInstructions.type === 'python' && (
              <div>
                <p className="text-xs text-[#6b6660] mb-2">Mode 2 — runnable Python script. Save as run_action.py and execute locally.</p>
                <pre className="bg-[#faf7f2] rounded p-4 text-xs overflow-x-auto max-h-64 overflow-y-auto"><code>{state.uiState.modeInstructions.script}</code></pre>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => navigator.clipboard?.writeText(state.uiState.modeInstructions.script)} className="text-xs text-[#c9a961] flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                  <button onClick={() => {
                    const blob = new Blob([state.uiState.modeInstructions.script], { type: 'text/x-python' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url; a.download = 'sem_action.py'; a.click(); URL.revokeObjectURL(url);
                  }} className="text-xs text-[#c9a961] flex items-center gap-1"><Download className="w-3 h-3" /> Download .py</button>
                </div>
              </div>
            )}
            {state.uiState.modeInstructions.type === 'mcp' && (
              <div>
                <p className="text-xs text-[#6b6660] mb-2">Mode 1 — paste these into your Claude chat where the Google Ads MCP is connected:</p>
                <pre className="bg-[#faf7f2] rounded p-4 text-sm">{state.uiState.modeInstructions.lines.join('\n')}</pre>
                <button onClick={() => navigator.clipboard?.writeText(state.uiState.modeInstructions.lines.join('\n'))} className="mt-3 text-xs text-[#c9a961] flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
              </div>
            )}
          </Panel>
        )}

        {/* DASHBOARD */}
        {state.workflowState === 'complete' && state.dashboardData && (
          <Dashboard
            outputs={state.dashboardData}
            workflowId={state.activeWorkflow}
            venue={state.selectedVenue}
            accessMode={accessMode}
            data={dataSource}
            uiState={state.uiState}
            dispatch={dispatch}
            onApply={onApply}
            onSkip={(id) => dispatch({ type: 'SKIP_ACTION', payload: id })}
          />
        )}

        {/* CHANGELOG / FOOTER */}
        {state.changelog.length > 0 && (
          <Panel>
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl">Session changelog</h3>
              <div className="flex gap-3 text-xs">
                <button onClick={() => dispatch({ type: 'UNDO_LAST' })} className="text-[#c9a961] flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Undo last</button>
                <button onClick={() => dispatch({ type: 'UNDO_ALL' })} className="text-[#c9a961] flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Undo all</button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              {state.changelog.map(c => (
                <div key={c.id} className={`flex items-center justify-between text-xs ${c.undone ? 'opacity-40 line-through' : ''}`}>
                  <span>{c.title}</span>
                  <span className="text-[#9a948e]">{new Date(c.ts).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </Panel>
        )}
      </main>

      <footer className="border-t border-[#e8e2d8] mt-16 py-8 px-4 md:px-8 text-xs text-[#9a948e]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <div>
            {state.activeWorkflow ? (
              <>Workflow {state.activeWorkflow} · Run {state.uiState.runId || '—'}</>
            ) : <>1-Group SEM Optimizer · No run in progress</>}
          </div>
          <div className="flex gap-4 flex-wrap">
            <span>Mode {accessMode}</span>
            {state.uiState.runStartTs && <span>{Math.round((Date.now() - state.uiState.runStartTs) / 1000)}s elapsed</span>}
            {state.activeWorkflow && <span>{state.agentProgress.filter(a => a.status === 'done').length}/{state.agentProgress.length} agents</span>}
            <span>Venue: {VENUES[state.selectedVenue]?.display_name}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// DASHBOARD COMPONENT
// ============================================================================

const Dashboard = ({ outputs, workflowId, venue, accessMode, data, uiState, dispatch, onApply, onSkip }) => {
  const v = VENUES[venue] || VENUES['1-arden'];
  const audit = outputs.audit || {};
  const diagnostic = outputs.diagnostic || {};
  const research = outputs.research || {};
  const strategy = outputs.strategy || {};
  const compliance = outputs.compliance || {};
  const creative = outputs.creative || {};

  const totalWasted = audit.summary?.total_wasted_sgd || 0;
  const complianceIssues = (compliance.summary?.red_count || 0) + (compliance.summary?.amber_count || 0);
  const blockingIssues = compliance.summary?.blocking_violations || 0;
  const recCount = strategy.recommended_actions?.length || 0;

  const accountMedianConvRate = useMemo(() => {
    const rates = (data.keyword_performance || []).filter(k => k.clicks > 0).map(k => k.conversions / k.clicks);
    if (!rates.length) return 0;
    const sorted = [...rates].sort((a, b) => a - b);
    return sorted[Math.floor(sorted.length / 2)];
  }, [data.keyword_performance]);

  const aggregatedTimeSeries = useMemo(() => {
    const map = new Map();
    (data.campaign_performance || []).forEach(r => {
      const key = r.date;
      if (!map.has(key)) map.set(key, { date: key, cost_sgd: 0, conversions: 0 });
      map.get(key).cost_sgd += r.cost_sgd || 0;
      map.get(key).conversions += r.conversions || 0;
    });
    return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
  }, [data.campaign_performance]);

  const anomalyDates = (diagnostic.correlated_events || []).map(e => e.date);

  const headlineCtrData = useMemo(() => {
    const fatigueIds = new Set((audit.creative_fatigue_findings || []).map(f => f.ad_id));
    return (data.ad_performance || []).map((ad, i) => ({
      label: (ad.headlines || '').split('|')[0].slice(0, 28),
      ctr: ad.ctr || 0,
      fatigued: fatigueIds.has(ad.ad_id)
    }));
  }, [data.ad_performance, audit.creative_fatigue_findings]);

  return (
    <div className="space-y-12">
      {/* §1 Executive Summary */}
      <Section title="Executive Summary" subtitle={`${v.display_name} · Workflow ${workflowId} · ${WORKFLOWS[workflowId]?.name}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard label="Wasted spend (30d)" value={`S$${totalWasted.toFixed(0)}`} sub={totalWasted > 2000 ? 'Above critical threshold' : totalWasted > 500 ? 'Above warning threshold' : 'Within tolerance'} rag={totalWasted > 2000 ? 'red' : totalWasted > 500 ? 'amber' : 'green'} Icon={DollarSign} />
          <MetricCard label="Compliance issues" value={complianceIssues} sub={`${blockingIssues} blocking · ${complianceIssues - blockingIssues} amber`} rag={blockingIssues > 0 ? 'red' : complianceIssues > 0 ? 'amber' : 'green'} Icon={Shield} />
          <MetricCard label="Recommended actions" value={recCount} sub={`Top priority: ${strategy.recommended_actions?.[0]?.title?.slice(0, 32) || '—'}`} rag={recCount > 5 ? 'amber' : 'green'} Icon={Target} />
        </div>
        {aggregatedTimeSeries.length > 0 && (
          <Panel>
            <h4 className="text-sm text-[#6b6660] mb-3">Spend vs conversions — last {aggregatedTimeSeries.length} days</h4>
            <SpendVsConversionsChart data={aggregatedTimeSeries} anomalyDates={anomalyDates} />
          </Panel>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <Panel>
            <h4 className="text-sm text-[#6b6660] mb-3">Quality score distribution</h4>
            <QualityScoreHistogram keywords={data.keyword_performance || []} />
          </Panel>
          <Panel>
            <h4 className="text-sm text-[#6b6660] mb-3">Impression share waterfall</h4>
            <ImpressionShareWaterfall data={(data.campaign_performance || []).slice(-1)[0] || {}} />
          </Panel>
        </div>
      </Section>

      {/* §2 Wasted Spend Report */}
      <Section title="Wasted Spend Report" anchorId="wasted-spend">
        {(audit.wasted_spend_findings || []).length === 0 ? (
          <EmptyState icon={CheckCircle} message="No wasted spend detected above the S$50 threshold this period." />
        ) : (
          <>
            <Panel>
              <h4 className="text-sm text-[#6b6660] mb-3">Keyword performance (CPC × conv rate × spend)</h4>
              <KeywordPerformanceScatter keywords={data.keyword_performance || []} accountMedianConvRate={accountMedianConvRate} />
              <p className="text-xs text-[#9a948e] mt-2">Bubble colour: red &gt; S$500 spend, amber S$200–500, gold below.</p>
            </Panel>
            <Panel>
              <table className="w-full text-sm">
                <thead className="text-xs text-[#6b6660] uppercase border-b border-[#e8e2d8]">
                  <tr><th className="text-left py-2 pr-2">Keyword</th><th className="text-left py-2 pr-2">Campaign</th><th className="text-right py-2 px-2">Spend</th><th className="text-right py-2 px-2">Clicks</th><th className="text-right py-2 px-2">Conv</th><th className="text-right py-2 px-2">QS</th><th className="text-left py-2 pl-2">Severity</th></tr>
                </thead>
                <tbody>
                  {audit.wasted_spend_findings.map(f => (
                    <tr key={f.id} className="border-b border-[#e8e2d8]/50">
                      <td className="py-2 pr-2 text-[#1a1814]">{f.keyword}</td>
                      <td className="py-2 pr-2 text-[#6b6660]">{f.campaign}</td>
                      <td className="py-2 px-2 text-right">S${f.spend_sgd.toFixed(2)}</td>
                      <td className="py-2 px-2 text-right">{f.clicks}</td>
                      <td className="py-2 px-2 text-right">{f.conversions.toFixed(1)}</td>
                      <td className="py-2 px-2 text-right">{f.quality_score}</td>
                      <td className="py-2 pl-2"><RAGBadge level={f.severity === 'high' ? 'red' : f.severity === 'medium' ? 'amber' : 'green'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Panel>
          </>
        )}
      </Section>

      {/* §3 Search Term Insights */}
      <Section title="Search Term Insights" anchorId="search-terms">
        {(data.search_terms || []).length > 0 && (
          <Panel>
            <h4 className="text-sm text-[#6b6660] mb-3">Search term cost — colour: red = 0 conv, amber = &lt; 2 conv, green = converting</h4>
            <SearchTermTreemap data={data.search_terms || []} />
          </Panel>
        )}
        <div className="grid md:grid-cols-2 gap-4">
          <Panel>
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-lg mb-3 text-[#dc2626]">Negative candidates</h4>
            {(audit.negative_keyword_candidates || []).length === 0 ? (
              <p className="text-xs text-[#9a948e]">No negative-keyword candidates above the click threshold.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {audit.negative_keyword_candidates.slice(0, 12).map((n, i) => (
                  <li key={i} className="flex justify-between border-b border-[#e8e2d8]/50 pb-2">
                    <span className="text-[#1a1814]">{n.search_term}</span>
                    <span className="text-[#9a948e] text-xs">{n.clicks} clicks · S${n.spend_sgd.toFixed(0)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel>
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-lg mb-3 text-[#16a34a]">New keyword opportunities</h4>
            {(audit.new_keyword_opportunities || []).length === 0 ? (
              <p className="text-xs text-[#9a948e]">No new converting search terms above the threshold.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {audit.new_keyword_opportunities.slice(0, 12).map((n, i) => (
                  <li key={i} className="flex justify-between border-b border-[#e8e2d8]/50 pb-2">
                    <span className="text-[#1a1814]">{n.search_term}</span>
                    <span className="text-[#16a34a] text-xs">{n.conversions.toFixed(1)} conv</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
        {(audit.negative_keyword_candidates || []).length > 0 && (
          <Panel>
            <h4 className="text-sm text-[#6b6660] mb-3">13-week projected impact of applying negatives</h4>
            <NegativeKeywordImpactProjection
              savings={(audit.negative_keyword_candidates || []).reduce((a, b) => a + b.spend_sgd, 0) * 4}
              currentSpend={(data.campaign_performance || []).reduce((a, b) => a + (b.cost_sgd || 0), 0) / 2}
            />
          </Panel>
        )}
      </Section>

      {/* §4 Creative Performance */}
      <Section title="Creative Performance" anchorId="creative">
        {headlineCtrData.length > 0 && (
          <Panel>
            <h4 className="text-sm text-[#6b6660] mb-3">CTR by ad — red bars indicate fatigue</h4>
            <HeadlineCTRChart data={headlineCtrData} />
          </Panel>
        )}
        {data.fatigue_data && (
          <Panel>
            <h4 className="text-sm text-[#6b6660] mb-3">CTR decay curves — fatigued ads in red</h4>
            <FatigueDecayCurves ads={data.fatigue_data.ads} series={data.fatigue_data.series} />
          </Panel>
        )}
        {(audit.creative_fatigue_findings || []).length > 0 && (
          <Panel>
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-lg mb-3 text-[#dc2626]">Fatigue flags</h4>
            <ul className="space-y-3">
              {audit.creative_fatigue_findings.map(f => (
                <li key={f.ad_id} className="border-b border-[#e8e2d8]/50 pb-3">
                  <div className="text-sm text-[#1a1814]">{f.ad_group}</div>
                  <div className="text-xs text-[#6b6660] mt-1">{f.narrative}</div>
                  <div className="text-xs text-[#dc2626] mt-1">CTR {(f.ctr_recent * 100).toFixed(2)}% (was {(f.ctr_baseline * 100).toFixed(2)}%) — −{f.decay_pct.toFixed(0)}%</div>
                </li>
              ))}
            </ul>
          </Panel>
        )}
        {creative?.rsa_set && (
          <Panel>
            <h4 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-lg mb-3 text-[#c9a961]">Creative Agent — proposed RSA</h4>
            <p className="text-xs text-[#6b6660] mb-3">Predicted compliance: <RAGBadge level={creative.predicted_compliance_status || 'green'} /></p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#6b6660] uppercase mb-2">Headlines (max 30 chars)</div>
                <ul className="space-y-1 text-sm">
                  {creative.rsa_set.headlines.map((h, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{h.text}</span><span className="text-xs text-[#9a948e]">{h.char_count}c · {h.theme}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs text-[#6b6660] uppercase mb-2">Descriptions (max 90 chars)</div>
                <ul className="space-y-2 text-sm">
                  {creative.rsa_set.descriptions.map((d, i) => (
                    <li key={i} className="border-l-2 border-[#c9a961]/40 pl-2">
                      {d.text}<div className="text-xs text-[#9a948e]">{d.char_count}c</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {creative.rationale && <p className="text-xs text-[#6b6660] mt-3 italic">{creative.rationale}</p>}
          </Panel>
        )}
      </Section>

      {/* §5 Anomaly Explanations */}
      <Section title="Anomaly Explanations" anchorId="anomalies">
        {!diagnostic.anomaly_detected ? (
          <EmptyState icon={CheckCircle} message="No anomalies detected in the analysis window." />
        ) : (
          <>
            <Panel>
              <h4 className="text-sm text-[#6b6660] mb-1">{diagnostic.anomaly_summary?.metric} {diagnostic.anomaly_summary?.direction} of {Math.abs(diagnostic.anomaly_summary?.magnitude_pct).toFixed(1)}%</h4>
              <p className="text-xs text-[#6b6660] mb-3">Window: {diagnostic.anomaly_summary?.window_start} → {diagnostic.anomaly_summary?.window_end}</p>
              <AnomalyTimeline data={aggregatedTimeSeries} events={diagnostic.correlated_events?.map(e => ({ ...e, shortLabel: e.description?.slice(0, 26) })) || []} />
            </Panel>
            {diagnostic.inconclusive ? (
              <Panel className="border-[#d97706]/40">
                <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-[#d97706]" /><div><strong className="text-[#d97706]">Inconclusive.</strong><p className="text-sm text-[#6b6660] mt-1">Top hypothesis confidence below 0.5. Refusing to guess. Consider manual review or extend the analysis window.</p></div></div>
              </Panel>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {(diagnostic.hypotheses || []).map(h => (
                  <Panel key={h.rank}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs text-[#6b6660] uppercase">Hypothesis {h.rank}</span>
                      <RAGBadge level={h.confidence > 0.7 ? 'green' : h.confidence > 0.5 ? 'amber' : 'red'}>conf {h.confidence?.toFixed(2)}</RAGBadge>
                    </div>
                    <h4 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-lg mb-2">{h.cause}</h4>
                    <p className="text-xs text-[#6b6660] mb-3">{h.evidence}</p>
                    <div className="text-xs"><strong className="text-[#c9a961]">Next:</strong> <span className="text-[#6b6660]">{h.recommended_next_action}</span></div>
                  </Panel>
                ))}
              </div>
            )}
          </>
        )}
      </Section>

      {/* §6 Compliance Check */}
      <Section title="Compliance Check" subtitle="Singapore HSA + ASAS + Google Ads policy" anchorId="compliance">
        {!compliance.per_asset_results ? (
          <EmptyState icon={Shield} message="Compliance check not run in this workflow." />
        ) : compliance.summary?.red_count === 0 && compliance.summary?.amber_count === 0 ? (
          <Panel>
            <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-[#16a34a]" /><div><h4 className="text-[#16a34a]">All clear</h4><p className="text-xs text-[#6b6660]">{compliance.per_asset_results.length} assets scanned. No alcohol, healthcare, gambling, financial, or trademark violations detected.</p></div></div>
          </Panel>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              <MetricCard label="Green" value={compliance.summary?.green_count || 0} rag="green" Icon={CheckCircle} />
              <MetricCard label="Amber" value={compliance.summary?.amber_count || 0} rag="amber" Icon={AlertCircle} />
              <MetricCard label="Red (blocked)" value={compliance.summary?.red_count || 0} rag="red" Icon={XCircle} />
            </div>
            <Panel>
              <h4 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-lg mb-3">Flagged assets</h4>
              <div className="space-y-3">
                {compliance.per_asset_results.filter(r => r.rag_status !== 'green').map(r => (
                  <div key={r.asset_id} className="border-b border-[#e8e2d8]/50 pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <RAGBadge level={r.rag_status} />
                        <span className="text-xs text-[#6b6660]">{r.asset_type}</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-xs text-[#6b6660] uppercase mb-1">Original</div>
                        <div className="bg-[#dc2626]/10 rounded p-2 text-[#1a1814]">{r.content}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6b6660] uppercase mb-1">Suggested rewrite</div>
                        <div className="bg-[#16a34a]/10 rounded p-2 text-[#1a1814]">{r.violations[0]?.suggested_rewrite || '—'}</div>
                      </div>
                    </div>
                    {r.violations.map((v, i) => (
                      <div key={i} className="text-xs text-[#6b6660] mt-2"><strong className="text-[#dc2626]">{v.rule_id}</strong> · {v.rule_category} · evidence: "{v.evidence}"</div>
                    ))}
                  </div>
                ))}
              </div>
              {(compliance.summary?.red_count || 0) > 0 && (
                <p className="text-xs text-[#dc2626] mt-3">RED assets cannot be published. Execution Agent refuses these. Accept the suggested rewrite or write a new compliant version.</p>
              )}
            </Panel>
          </>
        )}
      </Section>

      {/* §7 Recommended Actions */}
      <Section title="Recommended Actions" anchorId="actions">
        {(strategy.recommended_actions || []).length === 0 ? (
          <EmptyState icon={CheckCircle} message="No recommendations from this run. Re-run with broader scope, or upload more reports." />
        ) : (
          <div className="space-y-4">
            {strategy.recommended_actions.map(a => (
              <ActionCard
                key={a.id}
                action={a}
                accessMode={accessMode}
                executed={uiState.executedActions[a.id]}
                skipped={uiState.skippedActions[a.id]}
                typedConfirm={uiState.typedConfirmations[a.id] || ''}
                onTypedChange={(v) => dispatch({ type: 'SET_TYPED_CONFIRM', payload: { id: a.id, value: v } })}
                onApply={() => onApply(a)}
                onSkip={() => onSkip(a.id)}
              />
            ))}
          </div>
        )}
      </Section>

      {/* §8 Projected Impact */}
      <Section title="Projected Impact" anchorId="projected">
        {!strategy.projected_impact_summary ? (
          <EmptyState icon={Target} message="No projection available — Strategy Agent did not produce a recommendation set." />
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-3">
              <MetricCard label="Current monthly spend" value={`S$${strategy.projected_impact_summary.current_monthly_spend_sgd?.toLocaleString()}`} rag="amber" />
              <MetricCard label="Projected monthly spend" value={`S$${strategy.projected_impact_summary.projected_monthly_spend_sgd?.toLocaleString()}`} sub={`Save S$${strategy.projected_impact_summary.projected_monthly_savings_sgd?.toLocaleString()}/mo`} rag="green" />
              <MetricCard label="Conversion lift" value={`+${strategy.projected_impact_summary.lift_pct}%`} sub={`confidence ${strategy.projected_impact_summary.confidence}`} rag="green" />
            </div>
            {strategy.budget_allocation && (
              <Panel>
                <h4 className="text-sm text-[#6b6660] mb-3">Budget allocation — inner ring: current · outer ring: recommended</h4>
                <BudgetSunburst current={strategy.budget_allocation.current} recommended={strategy.budget_allocation.recommended} />
              </Panel>
            )}
          </>
        )}
      </Section>
    </div>
  );
};

// ============================================================================
// ACTION CARD
// ============================================================================
const ActionCard = ({ action, accessMode, executed, skipped, typedConfirm, onTypedChange, onApply, onSkip }) => {
  const expected = `yes, ${action.short_verb} ${action.affected_item_count} ${action.item_noun}`;
  const canApply = !action.requires_typed_confirmation || typedConfirm.toLowerCase().trim() === expected.toLowerCase().trim();
  const ragLevel = action.refused ? 'red' : action.confidence > 0.75 ? 'green' : action.confidence > 0.5 ? 'amber' : 'red';

  return (
    <Panel className={`${executed ? 'border-[#16a34a]/40 bg-[#16a34a]/5' : skipped ? 'opacity-50' : action.refused ? 'border-[#dc2626]/40' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="text-xs text-[#6b6660] uppercase tracking-wider mb-1">Priority {action.execution_priority} · {action.action_type}</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif' }} className="text-xl">{action.title}</h3>
          <p className="text-xs text-[#9a948e] mt-1">{action.target}</p>
        </div>
        <RAGBadge level={ragLevel}>conf {action.confidence?.toFixed(2)}</RAGBadge>
      </div>

      {action.refused ? (
        <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded p-3 text-sm">
          <strong className="text-[#dc2626]">Refused:</strong> <span className="text-[#6b6660]">{action.refusal_reason}</span>
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <div className="text-xs text-[#6b6660] uppercase mb-1">Before</div>
              <div className="bg-[#faf7f2] rounded p-2 text-[#6b6660] text-xs">{action.before}</div>
            </div>
            <div>
              <div className="text-xs text-[#6b6660] uppercase mb-1">After</div>
              <div className="bg-[#c9a961]/10 rounded p-2 text-[#1a1814] text-xs">{action.after}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm flex-wrap mb-3">
            <span className="text-[#6b6660] text-xs">Projected:</span>
            <span className="text-[#c9a961] font-semibold">
              {action.projected_impact?.delta > 0 ? '+' : ''}{action.projected_impact?.delta}{action.projected_impact?.unit === '%' ? '%' : ` ${action.projected_impact?.unit}`}
            </span>
            <span className="text-[#9a948e] text-xs">{action.projected_impact?.metric}</span>
            <span className="text-[#9a948e] text-xs italic">{action.confidence_reason}</span>
          </div>

          {action.requires_typed_confirmation && !executed && (
            <div className="bg-[#d97706]/5 border border-[#d97706]/30 rounded p-3 mb-3">
              <p className="text-xs text-[#d97706] mb-2">This affects {action.affected_item_count} items. Type the confirmation phrase to proceed:</p>
              <code className="text-xs text-[#6b6660] block mb-2">{expected}</code>
              <input value={typedConfirm} onChange={(e) => onTypedChange(e.target.value)} placeholder="Type confirmation..." className="w-full bg-[#faf7f2] border border-[#c9c2b6] rounded px-3 py-2 text-sm" />
            </div>
          )}

          {executed ? (
            <div className="text-xs text-[#16a34a] flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Applied · check changelog to undo</div>
          ) : skipped ? (
            <div className="text-xs text-[#9a948e]">Skipped</div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              <button onClick={onApply} disabled={!canApply} className="bg-[#c9a961] text-[#0a0a0a] px-4 py-2 rounded text-sm font-semibold disabled:opacity-30 flex items-center gap-1">
                {accessMode === 1 ? <Wifi className="w-3 h-3" /> : accessMode === 2 ? <Code className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {accessMode === 3 ? 'Copy instructions' : 'Apply'}
              </button>
              <button onClick={onSkip} className="text-[#9a948e] px-4 py-2 text-sm">Skip</button>
            </div>
          )}
        </>
      )}
    </Panel>
  );
};
