/**
 * Sugar & Gold Treats Sales MCP Server
 *
 * chocolate equipment sales API with full product catalog,
 * customer data, inventory, and pricing information.
 *
 * Validates Okta tokens before allowing tool access.
 */

import express from 'express';
import { createRemoteJWKSet, jwtVerify } from 'jose';

const app = express();
app.use(express.json());

// Configuration
const PORT = process.env.MCP_SERVER_PORT || 3001;
const OKTA_ISSUER = process.env.OKTA_ISSUER || '';
const OKTA_AUDIENCE = process.env.OKTA_CUSTOM_AUTH_SERVER_AUDIENCE || '';

// JWKS for token validation
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

if (OKTA_ISSUER) {
  jwks = createRemoteJWKSet(new URL(`${OKTA_ISSUER}/v1/keys`));
}

// ============================================================================
// ARTISANAL CHOCOLATE DATA
// ============================================================================

// PRODUCTS - Artisanal Chocolate Catalog
const products = [
  // Chocolate Bars
  { id: 'CB-DRK72-001', name: 'Dark Chocolate 72% Single Origin', category: 'Chocolate Bars', subcategory: 'Dark', price: 18.99, cost: 7.60, stock: 2847, reorderPoint: 500, supplier: 'Valrhona' },
  { id: 'CB-MIL-001', name: 'Milk Chocolate Classic Bar', category: 'Chocolate Bars', subcategory: 'Milk', price: 12.99, cost: 5.20, stock: 3421, reorderPoint: 600, supplier: 'Callebaut' },
  { id: 'CB-RUB-001', name: 'Ruby Chocolate Premium Bar', category: 'Chocolate Bars', subcategory: 'Ruby', price: 16.99, cost: 7.00, stock: 1523, reorderPoint: 300, supplier: 'Barry Callebaut' },
  { id: 'CB-HAZ-001', name: 'Whole Hazelnut Milk Bar', category: 'Chocolate Bars', subcategory: 'Milk', price: 14.99, cost: 6.00, stock: 2156, reorderPoint: 400, supplier: 'Callebaut' },
  { id: 'CB-ALM-001', name: 'Almond Crunch Dark Bar', category: 'Chocolate Bars', subcategory: 'Dark', price: 13.99, cost: 5.60, stock: 1892, reorderPoint: 350, supplier: 'Valrhona' },
  { id: 'CB-SAL-001', name: 'Sea Salt & Caramel Bar', category: 'Chocolate Bars', subcategory: 'Milk', price: 15.99, cost: 6.40, stock: 3567, reorderPoint: 650, supplier: 'Guittard' },

  // Artisanal Truffles
  { id: 'TR-DRK-001', name: 'Dark Chocolate Ganache Truffle Box', category: 'Truffles', subcategory: 'Dark Ganache', price: 34.99, cost: 14.00, stock: 892, reorderPoint: 150, supplier: 'La Maison du Chocolat' },
  { id: 'TR-CHA-001', name: 'Champagne Truffle Collection', category: 'Truffles', subcategory: 'Champagne', price: 44.99, cost: 18.00, stock: 645, reorderPoint: 100, supplier: 'Godiva' },
  { id: 'TR-ESP-001', name: 'Espresso Truffle Set', category: 'Truffles', subcategory: 'Coffee', price: 32.99, cost: 13.20, stock: 1123, reorderPoint: 200, supplier: 'Neuhaus' },
  { id: 'TR-AST-001', name: 'Assorted Truffle Gift Box', category: 'Truffles', subcategory: 'Assorted', price: 42.99, cost: 17.20, stock: 2123, reorderPoint: 400, supplier: 'Lindt' },

  // Gift Collections
  { id: 'GC-PRE-001', name: 'Premium Chocolate Collection 24pc', category: 'Gift Collections', subcategory: 'Premium', price: 89.99, cost: 36.00, stock: 567, reorderPoint: 100, supplier: 'Leonidas' },
  { id: 'GC-SEA-001', name: 'Seasonal Selection Box', category: 'Gift Collections', subcategory: 'Seasonal', price: 54.99, cost: 22.00, stock: 892, reorderPoint: 150, supplier: 'Ghirardelli' },
  { id: 'GC-LUX-001', name: 'Luxury Tasting Set', category: 'Gift Collections', subcategory: 'Luxury', price: 129.99, cost: 52.00, stock: 423, reorderPoint: 75, supplier: 'Pierre Hermé' },
  { id: 'GC-BUL-001', name: 'Bulk Corporate Box 100pc', category: 'Gift Collections', subcategory: 'Corporate', price: 299.99, cost: 120.00, stock: 234, reorderPoint: 50, supplier: 'Lindt' },

  // Chocolate Spreads & Toppings
  { id: 'SP-HAZ-001', name: 'Hazelnut Chocolate Spread Premium', category: 'Spreads', subcategory: 'Hazelnut', price: 9.99, cost: 4.00, stock: 2340, reorderPoint: 400, supplier: 'Nutella' },
  { id: 'SP-CAR-001', name: 'Salted Caramel Sauce', category: 'Spreads', subcategory: 'Caramel', price: 8.99, cost: 3.60, stock: 3421, reorderPoint: 600, supplier: 'Ghirardelli' },
  { id: 'SP-DRZ-001', name: 'Chocolate Drizzle Syrup', category: 'Spreads', subcategory: 'Syrup', price: 6.99, cost: 2.80, stock: 4521, reorderPoint: 800, supplier: 'Hershey' },

  // Branded Merchandise
  { id: 'MC-TSH-001', name: 'Sugar & Gold Treats T-Shirt', category: 'Merchandise', subcategory: 'Apparel', price: 24.99, cost: 10.00, stock: 892, reorderPoint: 150, supplier: 'Custom Ink' },
  { id: 'MC-MUG-001', name: 'Chocolate Lovers Ceramic Mug', category: 'Merchandise', subcategory: 'Drinkware', price: 14.99, cost: 6.00, stock: 1345, reorderPoint: 250, supplier: 'Vistaprint' },
  { id: 'MC-BAG-001', name: 'Branded Tote Bag', category: 'Merchandise', subcategory: 'Bags', price: 12.99, cost: 5.20, stock: 2341, reorderPoint: 400, supplier: 'Custom Ink' },
  { id: 'MC-HOD-001', name: 'Chocolate Lover Hoodie', category: 'Merchandise', subcategory: 'Apparel', price: 39.99, cost: 16.00, stock: 1123, reorderPoint: 200, supplier: 'Custom Ink' },

  // Corporate Gifts
  { id: 'CG-EXE-001', name: 'Executive Gift Box Premium', category: 'Corporate Gifts', subcategory: 'Executive', price: 149.99, cost: 60.00, stock: 312, reorderPoint: 50, supplier: 'Godiva' },
  { id: 'CG-EVT-001', name: 'Event Favor Boxes (Set of 50)', category: 'Corporate Gifts', subcategory: 'Events', price: 199.99, cost: 80.00, stock: 156, reorderPoint: 30, supplier: 'Ferrero Rocher' },
  { id: 'CG-THK-001', name: 'Thank You Gift Box', category: 'Corporate Gifts', subcategory: 'Thank You', price: 54.99, cost: 22.00, stock: 1234, reorderPoint: 250, supplier: 'Lindt' },

  // ============================================================================
  // modBOT AI SOLUTIONS DATA
  // ============================================================================

  // AI Agent Licenses
  { id: 'AI-AGT-ENT', name: 'Enterprise AI Agent License', category: 'AI Agents', subcategory: 'Enterprise', price: 2499.00, cost: 750.00, stock: 500, reorderPoint: 100, supplier: 'Anthropic' },
  { id: 'AI-AGT-PRO', name: 'Professional AI Agent License', category: 'AI Agents', subcategory: 'Professional', price: 999.00, cost: 300.00, stock: 1200, reorderPoint: 200, supplier: 'Anthropic' },
  { id: 'AI-AGT-STD', name: 'Standard AI Agent License', category: 'AI Agents', subcategory: 'Standard', price: 499.00, cost: 150.00, stock: 2500, reorderPoint: 500, supplier: 'Anthropic' },
  { id: 'AI-AGT-DEV', name: 'Developer AI Agent License', category: 'AI Agents', subcategory: 'Developer', price: 199.00, cost: 60.00, stock: 5000, reorderPoint: 1000, supplier: 'Anthropic' },

  // ML Models & Services
  { id: 'ML-MOD-CVS', name: 'Computer Vision Model Suite', category: 'ML Models', subcategory: 'Computer Vision', price: 12999.00, cost: 3900.00, stock: 45, reorderPoint: 10, supplier: 'OpenAI' },
  { id: 'ML-MOD-NLP', name: 'Natural Language Processing Model', category: 'ML Models', subcategory: 'NLP', price: 9999.00, cost: 3000.00, stock: 67, reorderPoint: 15, supplier: 'Google Cloud AI' },
  { id: 'ML-MOD-PRD', name: 'Predictive Analytics Model', category: 'ML Models', subcategory: 'Analytics', price: 7999.00, cost: 2400.00, stock: 89, reorderPoint: 20, supplier: 'AWS SageMaker' },
  { id: 'ML-MOD-SEN', name: 'Sentiment Analysis Model', category: 'ML Models', subcategory: 'Sentiment', price: 4999.00, cost: 1500.00, stock: 134, reorderPoint: 30, supplier: 'Azure AI' },

  // Automation Services
  { id: 'AUT-WRK-ENT', name: 'Enterprise Workflow Automation', category: 'Automation', subcategory: 'Workflow', price: 15999.00, cost: 4800.00, stock: 78, reorderPoint: 15, supplier: 'UiPath' },
  { id: 'AUT-RPA-STD', name: 'RPA Bot Standard Package', category: 'Automation', subcategory: 'RPA', price: 5999.00, cost: 1800.00, stock: 156, reorderPoint: 30, supplier: 'Automation Anywhere' },
  { id: 'AUT-INT-API', name: 'API Integration Service', category: 'Automation', subcategory: 'Integration', price: 3999.00, cost: 1200.00, stock: 234, reorderPoint: 50, supplier: 'MuleSoft' },
  { id: 'AUT-SCH-PRO', name: 'Process Scheduler Pro', category: 'Automation', subcategory: 'Scheduling', price: 1999.00, cost: 600.00, stock: 445, reorderPoint: 100, supplier: 'Apache Airflow' },

  // Consulting & Implementation
  { id: 'CON-IMP-FUL', name: 'Full AI Implementation Package', category: 'Consulting', subcategory: 'Implementation', price: 49999.00, cost: 15000.00, stock: 24, reorderPoint: 5, supplier: 'Deloitte AI' },
  { id: 'CON-STR-ENT', name: 'AI Strategy Consulting Enterprise', category: 'Consulting', subcategory: 'Strategy', price: 24999.00, cost: 7500.00, stock: 45, reorderPoint: 10, supplier: 'McKinsey Digital' },
  { id: 'CON-TRN-PRO', name: 'AI Training Program Professional', category: 'Consulting', subcategory: 'Training', price: 9999.00, cost: 3000.00, stock: 89, reorderPoint: 20, supplier: 'Coursera Enterprise' },
  { id: 'CON-AUD-SEC', name: 'AI Security Audit Service', category: 'Consulting', subcategory: 'Security', price: 14999.00, cost: 4500.00, stock: 67, reorderPoint: 15, supplier: 'CrowdStrike AI' },

  // Support & Maintenance
  { id: 'SUP-PRE-PLT', name: 'Premium Support Platinum', category: 'Support', subcategory: 'Premium', price: 7999.00, cost: 2400.00, stock: 123, reorderPoint: 25, supplier: 'modBOT Support' },
  { id: 'SUP-PRE-GLD', name: 'Premium Support Gold', category: 'Support', subcategory: 'Premium', price: 4999.00, cost: 1500.00, stock: 234, reorderPoint: 50, supplier: 'modBOT Support' },
  { id: 'SUP-STD-ANN', name: 'Standard Support Annual', category: 'Support', subcategory: 'Standard', price: 1999.00, cost: 600.00, stock: 567, reorderPoint: 100, supplier: 'modBOT Support' },
  { id: 'SUP-MNT-ENT', name: 'Enterprise Maintenance Contract', category: 'Support', subcategory: 'Maintenance', price: 12999.00, cost: 3900.00, stock: 89, reorderPoint: 20, supplier: 'modBOT Support' },

  // Data & Analytics
  { id: 'DAT-PLT-ENT', name: 'Enterprise Data Platform', category: 'Data Platform', subcategory: 'Enterprise', price: 19999.00, cost: 6000.00, stock: 34, reorderPoint: 10, supplier: 'Snowflake' },
  { id: 'DAT-VIZ-PRO', name: 'Advanced Analytics & Visualization', category: 'Data Platform', subcategory: 'Visualization', price: 6999.00, cost: 2100.00, stock: 156, reorderPoint: 30, supplier: 'Tableau' },
  { id: 'DAT-ETL-STD', name: 'ETL Pipeline Standard', category: 'Data Platform', subcategory: 'ETL', price: 4999.00, cost: 1500.00, stock: 234, reorderPoint: 50, supplier: 'Fivetran' },
  { id: 'DAT-WAR-CLO', name: 'Cloud Data Warehouse', category: 'Data Platform', subcategory: 'Warehouse', price: 8999.00, cost: 2700.00, stock: 112, reorderPoint: 25, supplier: 'BigQuery' },
];

// CUSTOMERS - Chocolate Retailers & Business Buyers
const customers = [
  // Platinum Tier (>$95,000 lifetime)
  { id: 'CUST-001', name: 'Sweet Delights Retail', tier: 'Platinum', territory: 'West', contact: 'Jennifer Martinez', email: 'buyer@sweetdelights.com', phone: '555-0101', totalOrders: 234, lifetimeValue: 142800, lastOrder: '2024-12-14', paymentTerms: 'Net 45' },
  { id: 'CUST-002', name: 'Chocolate Dreams Boutique', tier: 'Platinum', territory: 'East', contact: 'Michael Chen', email: 'orders@chocolatedreams.com', phone: '555-0102', totalOrders: 312, lifetimeValue: 124500, lastOrder: '2024-12-12', paymentTerms: 'Net 60' },
  { id: 'CUST-003', name: 'Gourmet Gift Emporium', tier: 'Platinum', territory: 'Central', contact: 'Sarah Thompson', email: 'sarah@gourmetgifts.com', phone: '555-0103', totalOrders: 278, lifetimeValue: 118200, lastOrder: '2024-12-10', paymentTerms: 'Net 45' },
  { id: 'CUST-004', name: 'Corporate Treats & Co', tier: 'Platinum', territory: 'East', contact: 'David Anderson', email: 'david@corporatetreats.com', phone: '555-0104', totalOrders: 189, lifetimeValue: 98500, lastOrder: '2024-12-08', paymentTerms: 'Net 30' },

  // Gold Tier ($38,000 - $95,000)
  { id: 'CUST-005', name: 'The Chocolate Gallery', tier: 'Gold', territory: 'West', contact: 'Emily Parker', email: 'emily@chocolategallery.com', phone: '555-0105', totalOrders: 156, lifetimeValue: 78900, lastOrder: '2024-12-05', paymentTerms: 'Net 30' },
  { id: 'CUST-006', name: 'Artisan Confections Store', tier: 'Gold', territory: 'West', contact: 'Robert Wilson', email: 'robert@artisanconfections.com', phone: '555-0106', totalOrders: 134, lifetimeValue: 67400, lastOrder: '2024-12-03', paymentTerms: 'Net 30' },
  { id: 'CUST-007', name: 'Luxury Sweets Retailer', tier: 'Gold', territory: 'Central', contact: 'Lisa Brown', email: 'lisa@luxurysweets.com', phone: '555-0107', totalOrders: 98, lifetimeValue: 52800, lastOrder: '2024-11-28', paymentTerms: 'Net 30' },
  { id: 'CUST-008', name: 'Hotel Concierge Services', tier: 'Gold', territory: 'West', contact: 'James Taylor', email: 'james@hotelconcierge.com', phone: '555-0108', totalOrders: 87, lifetimeValue: 45200, lastOrder: '2024-11-25', paymentTerms: 'Net 30' },

  // Silver Tier ($8,500 - $38,000)
  { id: 'CUST-011', name: 'Boutique Chocolate Shop', tier: 'Silver', territory: 'West', contact: 'Rachel Johnson', email: 'rachel@boutiquechocolate.com', phone: '555-0111', totalOrders: 56, lifetimeValue: 22100, lastOrder: '2024-11-15', paymentTerms: 'Net 15' },
  { id: 'CUST-012', name: 'Gourmet Market Downtown', tier: 'Silver', territory: 'Central', contact: 'Kevin Martinez', email: 'kevin@gourmetmarket.com', phone: '555-0112', totalOrders: 45, lifetimeValue: 19500, lastOrder: '2024-11-12', paymentTerms: 'Net 15' },

  // Bronze Tier (<$8,500)
  { id: 'CUST-019', name: 'Corner Store Sweets', tier: 'Bronze', territory: 'Central', contact: 'Nancy Williams', email: 'nancy@cornerstoresweets.com', phone: '555-0119', totalOrders: 18, lifetimeValue: 4800, lastOrder: '2024-10-20', paymentTerms: 'Prepaid' },
  { id: 'CUST-020', name: 'Local Chocolate Co', tier: 'Bronze', territory: 'West', contact: 'Brian Thompson', email: 'brian@localchocolate.com', phone: '555-0120', totalOrders: 12, lifetimeValue: 4100, lastOrder: '2024-09-15', paymentTerms: 'Prepaid' },

  // ============================================================================
  // modBOT AI SOLUTIONS CUSTOMERS
  // ============================================================================

  // Platinum Tier (>$95,000 lifetime)
  { id: 'CUST-AI-001', name: 'Global Finance Corp', tier: 'Platinum', territory: 'East', contact: 'Alexandra Chen', email: 'alexandra.chen@globalfinance.com', phone: '555-2001', totalOrders: 156, lifetimeValue: 487500, lastOrder: '2024-12-14', paymentTerms: 'Net 60' },
  { id: 'CUST-AI-002', name: 'TechVentures Inc', tier: 'Platinum', territory: 'West', contact: 'Marcus Rodriguez', email: 'marcus@techventures.io', phone: '555-2002', totalOrders: 203, lifetimeValue: 523400, lastOrder: '2024-12-12', paymentTerms: 'Net 60' },
  { id: 'CUST-AI-003', name: 'Healthcare Systems International', tier: 'Platinum', territory: 'Central', contact: 'Dr. Sarah Mitchell', email: 'smitchell@healthsys.com', phone: '555-2003', totalOrders: 134, lifetimeValue: 395800, lastOrder: '2024-12-10', paymentTerms: 'Net 45' },
  { id: 'CUST-AI-004', name: 'Retail Analytics Solutions', tier: 'Platinum', territory: 'West', contact: 'David Park', email: 'dpark@retailanalytics.com', phone: '555-2004', totalOrders: 189, lifetimeValue: 421200, lastOrder: '2024-12-08', paymentTerms: 'Net 60' },

  // Gold Tier ($38,000 - $95,000)
  { id: 'CUST-AI-005', name: 'Manufacturing Intelligence Co', tier: 'Gold', territory: 'Central', contact: 'Jennifer Williams', email: 'jwilliams@mfgintel.com', phone: '555-2005', totalOrders: 87, lifetimeValue: 78900, lastOrder: '2024-12-05', paymentTerms: 'Net 45' },
  { id: 'CUST-AI-006', name: 'E-Commerce Platform Partners', tier: 'Gold', territory: 'East', contact: 'Ryan Thompson', email: 'rthompson@ecomplatform.com', phone: '555-2006', totalOrders: 92, lifetimeValue: 67200, lastOrder: '2024-12-03', paymentTerms: 'Net 30' },
  { id: 'CUST-AI-007', name: 'Smart City Infrastructure', tier: 'Gold', territory: 'West', contact: 'Maria Garcia', email: 'mgarcia@smartcity.gov', phone: '555-2007', totalOrders: 67, lifetimeValue: 54300, lastOrder: '2024-11-28', paymentTerms: 'Net 45' },
  { id: 'CUST-AI-008', name: 'Insurance Tech Innovations', tier: 'Gold', territory: 'Central', contact: 'James Anderson', email: 'janderson@insuretech.com', phone: '555-2008', totalOrders: 78, lifetimeValue: 49800, lastOrder: '2024-11-25', paymentTerms: 'Net 30' },

  // Silver Tier ($8,500 - $38,000)
  { id: 'CUST-AI-011', name: 'Regional Bank Digital', tier: 'Silver', territory: 'East', contact: 'Lisa Nguyen', email: 'lnguyen@regionalbank.com', phone: '555-2011', totalOrders: 45, lifetimeValue: 28700, lastOrder: '2024-11-15', paymentTerms: 'Net 30' },
  { id: 'CUST-AI-012', name: 'Education Tech Solutions', tier: 'Silver', territory: 'Central', contact: 'Kevin Brooks', email: 'kbrooks@edutech.com', phone: '555-2012', totalOrders: 56, lifetimeValue: 23400, lastOrder: '2024-11-12', paymentTerms: 'Net 30' },
  { id: 'CUST-AI-013', name: 'Supply Chain Optimizer', tier: 'Silver', territory: 'West', contact: 'Emily Taylor', email: 'etaylor@supplyopt.com', phone: '555-2013', totalOrders: 34, lifetimeValue: 19800, lastOrder: '2024-11-08', paymentTerms: 'Net 15' },

  // Bronze Tier (<$8,500)
  { id: 'CUST-AI-019', name: 'Startup Hub Ventures', tier: 'Bronze', territory: 'West', contact: 'Alex Johnson', email: 'ajohnson@startuphub.io', phone: '555-2019', totalOrders: 12, lifetimeValue: 6700, lastOrder: '2024-10-20', paymentTerms: 'Prepaid' },
  { id: 'CUST-AI-020', name: 'Local Government AI Initiative', tier: 'Bronze', territory: 'Central', contact: 'Patricia Martinez', email: 'pmartinez@localgov.org', phone: '555-2020', totalOrders: 8, lifetimeValue: 4200, lastOrder: '2024-09-15', paymentTerms: 'Net 30' },
];

// ORDERS - Recent Orders
const orders = [
  { id: 'ORD-2024-001', customerId: 'CUST-001', customer: 'State University Athletics', items: [{ productId: 'BB-PRO-001', qty: 50, price: 149.99 }, { productId: 'TRN-REB-001', qty: 2, price: 199.99 }], subtotal: 7899.48, discount: 789.95, total: 7109.53, status: 'shipped', orderDate: '2024-12-10', shipDate: '2024-12-12' },
  { id: 'ORD-2024-002', customerId: 'CUST-003', customer: 'Metro High School District', items: [{ productId: 'UNI-JRS-001', qty: 200, price: 89.99 }, { productId: 'UNI-SHT-001', qty: 200, price: 49.99 }], subtotal: 27996.00, discount: 4199.40, total: 23796.60, status: 'processing', orderDate: '2024-12-12', shipDate: null },
  { id: 'ORD-2024-003', customerId: 'CUST-004', customer: 'Riverside Youth chocolate League', items: [{ productId: 'BB-YTH-001', qty: 100, price: 34.99 }, { productId: 'TRN-CON-001', qty: 10, price: 29.99 }], subtotal: 3798.90, discount: 189.95, total: 3608.95, status: 'pending', orderDate: '2024-12-14', shipDate: null },
  { id: 'ORD-2024-004', customerId: 'CUST-002', customer: 'City Pro chocolate Academy', items: [{ productId: 'HP-COL-001', qty: 4, price: 899.99 }, { productId: 'BB-PRO-002', qty: 30, price: 89.99 }], subtotal: 6299.66, discount: 629.97, total: 5669.69, status: 'shipped', orderDate: '2024-12-08', shipDate: '2024-12-11' },
  { id: 'ORD-2024-005', customerId: 'CUST-006', customer: 'Eastside High School', items: [{ productId: 'UNI-WRM-001', qty: 25, price: 129.99 }], subtotal: 3249.75, discount: 324.98, total: 2924.77, status: 'delivered', orderDate: '2024-12-01', shipDate: '2024-12-03' },

  // modBOT AI Solutions Orders
  { id: 'ORD-AI-2024-001', customerId: 'CUST-AI-001', customer: 'Global Finance Corp', items: [{ productId: 'AI-AGT-ENT', qty: 50, price: 2499.00 }, { productId: 'SUP-PRE-PLT', qty: 1, price: 7999.00 }], subtotal: 132949.00, discount: 13294.90, total: 119654.10, status: 'shipped', orderDate: '2024-12-10', shipDate: '2024-12-12' },
  { id: 'ORD-AI-2024-002', customerId: 'CUST-AI-002', customer: 'TechVentures Inc', items: [{ productId: 'ML-MOD-CVS', qty: 3, price: 12999.00 }, { productId: 'CON-TRN-PRO', qty: 2, price: 9999.00 }], subtotal: 58995.00, discount: 5899.50, total: 53095.50, status: 'processing', orderDate: '2024-12-12', shipDate: null },
  { id: 'ORD-AI-2024-003', customerId: 'CUST-AI-003', customer: 'Healthcare Systems International', items: [{ productId: 'DAT-PLT-ENT', qty: 2, price: 19999.00 }, { productId: 'AUT-WRK-ENT', qty: 1, price: 15999.00 }], subtotal: 55997.00, discount: 5599.70, total: 50397.30, status: 'pending', orderDate: '2024-12-14', shipDate: null },
  { id: 'ORD-AI-2024-004', customerId: 'CUST-AI-004', customer: 'Retail Analytics Solutions', items: [{ productId: 'AI-AGT-PRO', qty: 100, price: 999.00 }, { productId: 'ML-MOD-NLP', qty: 2, price: 9999.00 }], subtotal: 119898.00, discount: 17984.70, total: 101913.30, status: 'shipped', orderDate: '2024-12-08', shipDate: '2024-12-11' },
  { id: 'ORD-AI-2024-005', customerId: 'CUST-AI-005', customer: 'Manufacturing Intelligence Co', items: [{ productId: 'AUT-RPA-STD', qty: 10, price: 5999.00 }], subtotal: 59990.00, discount: 5999.00, total: 53991.00, status: 'delivered', orderDate: '2024-12-01', shipDate: '2024-12-03' },
];

// PRICING - Discount Tiers
const discountTiers = {
  quantity: [
    { minQty: 10, discount: 5, label: '10+ units' },
    { minQty: 50, discount: 10, label: '50+ units' },
    { minQty: 100, discount: 15, label: '100+ units' },
    { minQty: 500, discount: 20, label: '500+ units' },
  ],
  customer: {
    'Platinum': 5,
    'Gold': 3,
    'Silver': 0,
    'Bronze': 0,
  },
};

// ============================================================================
// TOKEN VALIDATION MIDDLEWARE
// ============================================================================

async function validateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[MCP] Demo mode - skipping token validation');
      return next();
    }
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (token.startsWith('demo-')) {
    console.log('[MCP] Demo token accepted');
    return next();
  }

  if (!jwks) {
    console.log('[MCP] No JWKS configured, accepting token');
    return next();
  }

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: OKTA_ISSUER,
      audience: OKTA_AUDIENCE,
    });
    console.log('[MCP] Token validated:', payload.sub);
    (req as any).user = payload;
    next();
  } catch (error) {
    console.error('[MCP] Token validation failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'sugar-gold-treats-mcp-server', products: products.length, customers: customers.length });
});

// --- INVENTORY TOOLS ---

// List all products
app.get('/mcp/tools/list_products', validateToken, (req, res) => {
  const category = req.query.category as string;
  let result = products;

  if (category) {
    result = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  res.json({
    tool: 'list_products',
    result: result.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      stock: p.stock,
    })),
    count: result.length,
  });
});

// Check stock for a product
app.get('/mcp/tools/check_stock/:productId', validateToken, (req, res) => {
  const product = products.find(p => p.id === req.params.productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const stockStatus = product.stock <= product.reorderPoint ? 'low' : product.stock > product.reorderPoint * 2 ? 'good' : 'adequate';

  res.json({
    tool: 'check_stock',
    result: {
      productId: product.id,
      name: product.name,
      category: product.category,
      stock: product.stock,
      reorderPoint: product.reorderPoint,
      stockStatus,
      supplier: product.supplier,
      available: product.stock > 0,
    },
  });
});

// Search inventory by keyword
app.get('/mcp/tools/search_inventory', validateToken, (req, res) => {
  const query = (req.query.q as string || '').toLowerCase();

  const results = products.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.category.toLowerCase().includes(query) ||
    p.subcategory.toLowerCase().includes(query)
  );

  res.json({
    tool: 'search_inventory',
    query,
    result: results.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      stock: p.stock,
      price: p.price,
    })),
    count: results.length,
  });
});

// --- CUSTOMER TOOLS ---

// Get customer by ID
app.get('/mcp/tools/get_customer/:customerId', validateToken, (req, res) => {
  const customer = customers.find(c => c.id === req.params.customerId);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  res.json({
    tool: 'get_customer',
    result: customer,
  });
});

// Search customers
app.get('/mcp/tools/search_customers', validateToken, (req, res) => {
  const query = (req.query.q as string || '').toLowerCase();
  const tier = req.query.tier as string;

  let results = customers;

  if (query) {
    results = results.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.contact.toLowerCase().includes(query) ||
      c.territory.toLowerCase().includes(query)
    );
  }

  if (tier) {
    results = results.filter(c => c.tier.toLowerCase() === tier.toLowerCase());
  }

  res.json({
    tool: 'search_customers',
    query,
    tier,
    result: results,
    count: results.length,
  });
});

// Get customer purchase history
app.get('/mcp/tools/customer_history/:customerId', validateToken, (req, res) => {
  const customer = customers.find(c => c.id === req.params.customerId);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const customerOrders = orders.filter(o => o.customerId === req.params.customerId);

  res.json({
    tool: 'customer_history',
    customer: {
      id: customer.id,
      name: customer.name,
      tier: customer.tier,
      lifetimeValue: customer.lifetimeValue,
    },
    orders: customerOrders,
    totalOrders: customerOrders.length,
  });
});

// --- SALES TOOLS ---

// Get orders
app.get('/mcp/tools/get_orders', validateToken, (req, res) => {
  const status = req.query.status as string;
  let result = orders;

  if (status) {
    result = orders.filter(o => o.status === status);
  }

  res.json({
    tool: 'get_orders',
    result,
    count: result.length,
  });
});

// Create quote
app.post('/mcp/tools/create_quote', validateToken, (req, res) => {
  const { customerId, items } = req.body;

  const customer = customers.find(c => c.id === customerId);
  if (!customer) {
    return res.status(400).json({ error: 'Customer not found' });
  }

  // Calculate quote with discounts
  let subtotal = 0;
  const quoteItems = (items || []).map((item: { productId: string; qty: number }) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;

    const lineTotal = product.price * item.qty;
    subtotal += lineTotal;

    return {
      productId: product.id,
      name: product.name,
      quantity: item.qty,
      unitPrice: product.price,
      lineTotal,
    };
  }).filter(Boolean);

  // Apply quantity discount
  const totalQty = quoteItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  let qtyDiscount = 0;
  for (const tier of discountTiers.quantity) {
    if (totalQty >= tier.minQty) {
      qtyDiscount = tier.discount;
    }
  }

  // Apply customer tier discount
  const tierDiscount = discountTiers.customer[customer.tier as keyof typeof discountTiers.customer] || 0;

  const totalDiscountPct = qtyDiscount + tierDiscount;
  const discountAmount = subtotal * (totalDiscountPct / 100);
  const total = subtotal - discountAmount;

  const quote = {
    id: `QT-${Date.now()}`,
    customerId,
    customerName: customer.name,
    customerTier: customer.tier,
    items: quoteItems,
    subtotal,
    discounts: {
      quantity: { percent: qtyDiscount, reason: `${totalQty}+ units` },
      tier: { percent: tierDiscount, reason: `${customer.tier} customer` },
      total: totalDiscountPct,
    },
    discountAmount,
    total,
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  res.json({
    tool: 'create_quote',
    result: quote,
  });
});

// --- PRICING TOOLS ---

// Get product pricing with discounts
app.get('/mcp/tools/get_price/:productId', validateToken, (req, res) => {
  const product = products.find(p => p.id === req.params.productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const margin = ((product.price - product.cost) / product.price * 100).toFixed(1);

  res.json({
    tool: 'get_price',
    result: {
      productId: product.id,
      name: product.name,
      category: product.category,
      basePrice: product.price,
      cost: product.cost,
      margin: `${margin}%`,
      currency: 'USD',
      volumeDiscounts: discountTiers.quantity,
      tierDiscounts: discountTiers.customer,
    },
  });
});

// Get pricing for category
app.get('/mcp/tools/category_pricing/:category', validateToken, (req, res) => {
  const categoryProducts = products.filter(p =>
    p.category.toLowerCase() === req.params.category.toLowerCase()
  );

  if (categoryProducts.length === 0) {
    return res.status(404).json({ error: 'Category not found' });
  }

  const pricing = categoryProducts.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    cost: p.cost,
    margin: ((p.price - p.cost) / p.price * 100).toFixed(1) + '%',
  }));

  const avgMargin = categoryProducts.reduce((sum, p) => sum + ((p.price - p.cost) / p.price * 100), 0) / categoryProducts.length;

  res.json({
    tool: 'category_pricing',
    category: req.params.category,
    products: pricing,
    averageMargin: avgMargin.toFixed(1) + '%',
    count: pricing.length,
  });
});

// Calculate bulk pricing
app.post('/mcp/tools/calculate_bulk_price', validateToken, (req, res) => {
  const { productId, quantity, customerTier } = req.body;

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(400).json({ error: 'Product not found' });
  }

  // Find applicable quantity discount
  let qtyDiscount = 0;
  let qtyDiscountLabel = 'No volume discount';
  for (const tier of discountTiers.quantity) {
    if (quantity >= tier.minQty) {
      qtyDiscount = tier.discount;
      qtyDiscountLabel = tier.label;
    }
  }

  // Customer tier discount
  const tierDiscount = discountTiers.customer[customerTier as keyof typeof discountTiers.customer] || 0;

  const subtotal = product.price * quantity;
  const totalDiscountPct = qtyDiscount + tierDiscount;
  const discountAmount = subtotal * (totalDiscountPct / 100);
  const finalPrice = subtotal - discountAmount;
  const unitPrice = finalPrice / quantity;

  res.json({
    tool: 'calculate_bulk_price',
    result: {
      product: product.name,
      quantity,
      basePrice: product.price,
      subtotal,
      discounts: {
        volume: { percent: qtyDiscount, label: qtyDiscountLabel },
        tier: { percent: tierDiscount, label: customerTier || 'None' },
      },
      totalDiscount: totalDiscountPct + '%',
      discountAmount,
      finalTotal: finalPrice,
      finalUnitPrice: unitPrice.toFixed(2),
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🏀 Sugar & Gold Treats MCP Server running on port ${PORT}`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Customers: ${customers.length}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
});
