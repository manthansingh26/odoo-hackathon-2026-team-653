// Seed script — fills the database with a realistic, internally consistent 500-record demo dataset.
// Run with: npm run seed  (wired as "seed": "node prisma/seed.js" in package.json)
// Safe to re-run: clears the demo tables first in FK-safe order (idempotent), then
// inserts a fresh, consistent dataset. Users table is untouched.

import { PrismaClient, ContactType, TransactionType, TransactionStatus } from '@prisma/client'
import { postJournalEntry } from '../src/services/journal.service.js'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding realistic demo dataset for Urban Furniture Accounting System...')

  // --- Step 1: Clear in FK-safe order (users table untouched) ---
  await prisma.journalItem.deleteMany()
  await prisma.journalEntry.deleteMany()
  await prisma.transaction.deleteMany()
  await prisma.product.deleteMany()
  await prisma.contact.deleteMany()
  console.log('  Cleaned existing demo tables (users preserved).')

  // --- Step 2: Create 60 Contacts (35 Customers, 25 Vendors) ---
  const customerDefs = [
    { name: 'Nimesh Pathak (TechCraft Solutions)', email: 'nimesh.pathak@techcraft.io', phone: '+91 98765 43210' },
    { name: 'Aster Living Studio', email: 'contact@asterliving.in', phone: '+91 98201 11001' },
    { name: 'MapleNest Interiors', email: 'design@maplenest.in', phone: '+91 98202 22002' },
    { name: 'UrbanCraft Homes', email: 'hello@urbancrafthomes.in', phone: '+91 98203 33003' },
    { name: 'Ivory Space Furnishings', email: 'projects@ivoryspace.in', phone: '+91 98204 44004' },
    { name: 'Oakline Residences', email: 'sales@oaklineresidences.in', phone: '+91 98205 55005' },
    { name: 'Cedar & Co. Interiors', email: 'info@cedarcointeriors.in', phone: '+91 98206 66006' },
    { name: 'The Modern Room', email: 'studio@themodernroom.in', phone: '+91 98207 77007' },
    { name: 'Heritage Home Gallery', email: 'curator@heritagehomegallery.in', phone: '+91 98208 88008' },
    { name: 'BlueGrid Workspace', email: 'facilities@bluegridworkspace.in', phone: '+91 98209 99009' },
    { name: 'ComfortArc Living', email: 'care@comfortarcliving.in', phone: '+91 98210 10010' },
    { name: 'TimberTrail Homes', email: 'b2b@timbertrailhomes.in', phone: '+91 98211 11011' },
    { name: 'CasaForm Studio', email: 'arch@casaformstudio.in', phone: '+91 98212 12012' },
    { name: 'LuxeWood Residence', email: 'procure@luxewoodresidence.in', phone: '+91 98213 13013' },
    { name: 'NorthStar Office Solutions', email: 'procurement@northstaroffice.in', phone: '+91 98214 14014' },
    { name: 'GreenLeaf Hospitality', email: 'hospitality@greenleafresorts.in', phone: '+91 98215 15015' },
    { name: 'Kaveri Co-Working Hubs', email: 'ops@kavericoworking.in', phone: '+91 98216 16016' },
    { name: 'Skyline Hospitality Suites', email: 'purchase@skylinehotels.in', phone: '+91 98217 17017' },
    { name: 'Greenfield Learning Academy', email: 'admin@greenfieldacademy.edu.in', phone: '+91 98218 18018' },
    { name: 'Summit Healthcare Clinics', email: 'admin@summitclinics.in', phone: '+91 98219 19019' },
    { name: 'Amber Living Spaces', email: 'sales@amberlivingspaces.in', phone: '+91 98220 20020' },
    { name: 'Zenith Corporate Towers', email: 'facility@zenithtowers.in', phone: '+91 98221 21021' },
    { name: 'Opus Architecture & Interiors', email: 'info@opusarch.in', phone: '+91 98222 22022' },
    { name: 'Solitaire Design Studio', email: 'creative@solitairedesign.in', phone: '+91 98223 23023' },
    { name: 'Vivanta Luxury Suites', email: 'vendor.desk@vivantasuites.in', phone: '+91 98224 24024' },
    { name: 'MetroEdge Commercial Hubs', email: 'admin@metroedgehubs.in', phone: '+91 98225 25025' },
    { name: 'Apex Workspace Solutions', email: 'ops@apexworkspace.com', phone: '+91 98112 33445' },
    { name: 'Radhika Sharma Design Studio', email: 'radhika.s@designstudio.co', phone: '+91 99201 88321' },
    { name: 'Royal Furniture Store', email: 'contact@royalfurniture.in', phone: '+91 98226 26026' },
    { name: 'Urban Living Interiors', email: 'info@urbanlivinginteriors.in', phone: '+91 98227 27027' },
    { name: 'Karan Johar Enterprises', email: 'accounts@kje.in', phone: '+91 97170 55443' },
    { name: 'Sterling Financial Center', email: 'corporate@sterlingfin.in', phone: '+91 98228 28028' },
    { name: 'Horizon Tech Park', email: 'management@horizontechpark.in', phone: '+91 98229 29029' },
    { name: 'Velvet Touch Boutiques', email: 'retail@velvettouchboutique.in', phone: '+91 98230 30030' },
    { name: 'Harmony Dental & Wellness', email: 'info@harmonydental.in', phone: '+91 98231 31031' }
  ]

  const vendorDefs = [
    { name: 'Precision CNC Woodcrafts', email: 'factory@precisioncncwood.in', phone: '+91 98401 20015' },
    { name: 'AcousticFoam India Pvt Ltd', email: 'orders@acousticfoam.in', phone: '+91 98401 20014' },
    { name: 'Himalayan Pine Imports', email: 'trade@himalayanpine.in', phone: '+91 98401 20013' },
    { name: 'Coromandel Packaging Solutions', email: 'sales@coromandelpack.in', phone: '+91 98401 20012' },
    { name: 'Western Timber Traders', email: 'contact@westerntimber.in', phone: '+91 98401 20011' },
    { name: 'Gujarat Hardware Supply', email: 'supply@gujarathardware.in', phone: '+91 98401 20010' },
    { name: 'Metro Laminate Distributors', email: 'sales@metrolaminates.in', phone: '+91 98401 20009' },
    { name: 'Prime Foam Industries', email: 'billing@primefoam.in', phone: '+91 98401 20008' },
    { name: 'Elegant Fittings India', email: 'info@elegantfittings.in', phone: '+91 98401 20007' },
    { name: 'Reliable Logistics & Packaging', email: 'ops@reliablelogistics.in', phone: '+91 98401 20006' },
    { name: 'Narmada Steel & Pipe Fabricators', email: 'orders@narmadasteel.in', phone: '+91 98401 20005' },
    { name: 'Pinnacle Powder Coating Works', email: 'ops@pinnaclecoating.in', phone: '+91 98401 20004' },
    { name: 'AeroGlide Casters & Mechanisms', email: 'info@aeroglidecasters.in', phone: '+91 98401 20003' },
    { name: 'Classic Wood Suppliers', email: 'classic@woodsuppliers.in', phone: '+91 98401 20002' },
    { name: 'Modern Home Decor Supply', email: 'modern@homedecorsupply.in', phone: '+91 98401 20001' },
    { name: 'Greenply Timber Industries', email: 'sales@greenplytimber.in', phone: '+91 94330 11223' },
    { name: 'Azure Furniture Works', email: 'procurements@azuretimber.com', phone: '+91 87654 32109' },
    { name: 'Teakwood Heritage Imports', email: 'sales@teakheritage.in', phone: '+91 98402 21018' },
    { name: 'DuraFab Commercial Textiles', email: 'orders@durafabtextiles.in', phone: '+91 98402 21019' },
    { name: 'Bharat Fasteners & Screws', email: 'supply@bharatfasteners.in', phone: '+91 98402 21020' },
    { name: 'SunLite Glass & Acrylics', email: 'sales@sunliteglass.in', phone: '+91 98402 21021' },
    { name: 'Matrix Edge Banding Solutions', email: 'contact@matrixedgebanding.in', phone: '+91 98402 21022' },
    { name: 'Pioneer Veneers & Plywood', email: 'sales@pioneerveneers.in', phone: '+91 98402 21023' },
    { name: 'Royal Foam & Upholstery Supplies', email: 'orders@royalfoam.in', phone: '+91 98402 21024' },
    { name: 'Delta Precision Springs & Recliners', email: 'info@deltasprings.in', phone: '+91 98402 21025' }
  ]

  const customers = []
  for (const c of customerDefs) {
    const record = await prisma.contact.create({
      data: {
        name: c.name,
        type: ContactType.CUSTOMER,
        email: c.email,
        phone: c.phone
      }
    })
    customers.push(record)
  }

  const vendors = []
  for (const v of vendorDefs) {
    const record = await prisma.contact.create({
      data: {
        name: v.name,
        type: ContactType.VENDOR,
        email: v.email,
        phone: v.phone
      }
    })
    vendors.push(record)
  }
  console.log(`  Contacts created: ${customers.length} customers + ${vendors.length} vendors = ${customers.length + vendors.length}`)

  // --- Step 3: Create 40 Furniture Products ---
  const productDefs = [
    { name: 'Ergonomic Mesh Chair V2', sku: 'FUR-CHR-001', price: 14500, stock: 38 },
    { name: 'High-Back Executive Leather Chair', sku: 'FUR-CHR-002', price: 24000, stock: 22 },
    { name: 'Modern Cantilever Visitor Chair', sku: 'FUR-CHR-003', price: 5800, stock: 45 },
    { name: 'Heavy-Duty Drafting Stool', sku: 'FUR-CHR-004', price: 7200, stock: 18 },
    { name: 'Conference Room Swivel Chair', sku: 'FUR-CHR-005', price: 11500, stock: 30 },
    { name: 'Solid Sheesham Dining Chair (Set of 2)', sku: 'FUR-CHR-006', price: 12000, stock: 24 },
    { name: 'Velvet Accent Lounge Chair', sku: 'FUR-CHR-007', price: 18500, stock: 12 },
    { name: 'Executive Workstation Desk 6ft', sku: 'FUR-DSK-001', price: 38000, stock: 15 },
    { name: 'Dual-Motor Electric Standing Desk', sku: 'FUR-DSK-002', price: 44500, stock: 11 },
    { name: 'Compact Home Study Desk', sku: 'FUR-DSK-003', price: 14800, stock: 25 },
    { name: 'L-Shaped Executive Corner Desk', sku: 'FUR-DSK-004', price: 56000, stock: 8 },
    { name: '4-Person Modular Office Bench Desk', sku: 'FUR-DSK-005', price: 78000, stock: 6 },
    { name: 'Solid Oak 10-Seater Boardroom Table', sku: 'FUR-TBL-001', price: 88000, stock: 4 },
    { name: '6-Seater Sheesham Dining Table', sku: 'FUR-TBL-002', price: 34500, stock: 14 },
    { name: '4-Seater Glass Top Dining Table', sku: 'FUR-TBL-003', price: 22000, stock: 16 },
    { name: 'Solid Sheesham Coffee Table', sku: 'FUR-TBL-004', price: 11200, stock: 28 },
    { name: 'Marble Top Nesting Tables (Set of 3)', sku: 'FUR-TBL-005', price: 15400, stock: 19 },
    { name: 'Round Outdoor Café Table', sku: 'FUR-TBL-006', price: 8500, stock: 32 },
    { name: 'Premium 3-Seater Fabric Sofa', sku: 'FUR-SOF-001', price: 48000, stock: 9 },
    { name: 'L-Shaped Sectional Reversible Sofa', sku: 'FUR-SOF-002', price: 76500, stock: 5 },
    { name: 'Chesterfield Tufted Leather 3-Seater', sku: 'FUR-SOF-003', price: 95000, stock: 4 },
    { name: 'Single Seater Minimalist Armchair', sku: 'FUR-SOF-004', price: 21000, stock: 16 },
    { name: '2-Seater Reception Waiting Sofa', sku: 'FUR-SOF-005', price: 32000, stock: 14 },
    { name: 'King Size Solid Teak Bed', sku: 'FUR-BED-001', price: 48000, stock: 8 },
    { name: 'Queen Size Upholstered Platform Bed', sku: 'FUR-BED-002', price: 36500, stock: 14 },
    { name: 'King Size Storage Hydraulic Bed', sku: 'FUR-BED-003', price: 54000, stock: 7 },
    { name: 'Solid Wood Bedside Table with Drawer', sku: 'FUR-BED-004', price: 6500, stock: 36 },
    { name: 'Sliding 3-Door Engineered Wardrobe', sku: 'FUR-WRD-001', price: 58000, stock: 6 },
    { name: '4-Door Mirror Wardrobe with Drawers', sku: 'FUR-WRD-002', price: 72000, stock: 4 },
    { name: '2-Door Compact Bedroom Wardrobe', sku: 'FUR-WRD-003', price: 29500, stock: 12 },
    { name: 'Solid Teak 4-Door Credenza', sku: 'FUR-STR-001', price: 42000, stock: 9 },
    { name: '5-Tier Industrial Metal & Wood Bookshelf', sku: 'FUR-STR-002', price: 16500, stock: 20 },
    { name: '3-Drawer Lockable Mobile Pedestal', sku: 'FUR-STR-003', price: 7400, stock: 42 },
    { name: '2-Door Heavy Duty Metal Filing Cabinet', sku: 'FUR-STR-004', price: 14200, stock: 18 },
    { name: 'Floating TV Entertainment Wall Unit', sku: 'FUR-STR-005', price: 26000, stock: 10 },
    { name: 'Commercial Reception Welcome Counter', sku: 'FUR-REC-001', price: 64000, stock: 3 },
    { name: 'Acoustic Sound-Dampening Fabric Screen', sku: 'FUR-ACC-001', price: 4500, stock: 50 },
    { name: 'Solid Sheesham Dining Bench', sku: 'FUR-ACC-002', price: 8500, stock: 22 },
    { name: '3-Panel Carved Wooden Room Divider', sku: 'FUR-ACC-003', price: 12500, stock: 15 },
    { name: 'Ergonomic Aluminum Dual Monitor Arm', sku: 'FUR-ACC-004', price: 5400, stock: 35 }
  ]

  await prisma.product.createMany({ data: productDefs })
  console.log(`  Products created: ${productDefs.length}`)

  // --- Step 4: Create 100 Transactions (55 Sales, 45 Purchases) ---
  // Realistic multi-month dates from October 2025 to August 2026
  const dateList = [
    '2025-10-12', '2025-10-19', '2025-10-27', '2025-11-04', '2025-11-14',
    '2025-11-23', '2025-12-02', '2025-12-11', '2025-12-19', '2025-12-28',
    '2026-01-05', '2026-01-14', '2026-01-22', '2026-01-30', '2026-02-06',
    '2026-02-15', '2026-02-23', '2026-03-03', '2026-03-12', '2026-03-20',
    '2026-03-29', '2026-04-05', '2026-04-14', '2026-04-22', '2026-04-30',
    '2026-05-08', '2026-05-17', '2026-05-25', '2026-06-03', '2026-06-11',
    '2026-06-19', '2026-06-27', '2026-07-04', '2026-07-12', '2026-07-20',
    '2026-07-28', '2026-08-04', '2026-08-11', '2026-08-18', '2026-08-25'
  ]

  // 55 Sales specifications (38 PAID, 17 PENDING)
  const salesSpecs = [
    { custIdx: 0, amount: 42500, status: 'PAID', desc: 'Ergonomic mesh chairs for TechCraft team' },
    { custIdx: 1, amount: 58000, status: 'PAID', desc: 'Sliding 3-door wardrobe units — Aster Living' },
    { custIdx: 2, amount: 96000, status: 'PAID', desc: 'L-shaped executive desk setup — MapleNest' },
    { custIdx: 3, amount: 34500, status: 'PENDING', desc: 'Sheesham 6-seater dining set — UrbanCraft' },
    { custIdx: 4, amount: 76500, status: 'PAID', desc: 'Sectional reversible sofa — Ivory Space' },
    { custIdx: 5, amount: 48000, status: 'PAID', desc: 'Solid teak king bed — Oakline Residences' },
    { custIdx: 6, amount: 115000, status: 'PENDING', desc: 'Executive workstations fitout — Cedar & Co' },
    { custIdx: 7, amount: 24000, status: 'PAID', desc: 'Modern cantilever visitor chairs — The Modern Room' },
    { custIdx: 8, amount: 88000, status: 'PAID', desc: 'Boardroom table & credenza — Heritage Gallery' },
    { custIdx: 9, amount: 145000, status: 'PENDING', desc: 'Modular 4-person bench pods — BlueGrid Workspace' },
    { custIdx: 10, amount: 32000, status: 'PAID', desc: 'Reception waiting sofa — ComfortArc Living' },
    { custIdx: 11, amount: 64000, status: 'PAID', desc: 'Commercial reception counter — TimberTrail' },
    { custIdx: 12, amount: 44500, status: 'PENDING', desc: 'Electric standing desks — CasaForm Studio' },
    { custIdx: 13, amount: 95000, status: 'PAID', desc: 'Chesterfield tufted leather sofa — LuxeWood' },
    { custIdx: 14, amount: 128000, status: 'PAID', desc: 'Corporate training chairs — NorthStar Office' },
    { custIdx: 15, amount: 172000, status: 'PENDING', desc: 'Resort guestroom platform beds — GreenLeaf' },
    { custIdx: 16, amount: 82000, status: 'PAID', desc: 'Collaborative desk pods — Kaveri Co-Working' },
    { custIdx: 17, amount: 144000, status: 'PAID', desc: 'Hospitality king beds — Skyline Suites' },
    { custIdx: 18, amount: 64500, status: 'PENDING', desc: 'Classroom study desks — Greenfield Academy' },
    { custIdx: 19, amount: 43500, status: 'PAID', desc: 'Clinic reception seating — Summit Healthcare' },
    { custIdx: 20, amount: 54000, status: 'PAID', desc: 'Hydraulic storage beds — Amber Living' },
    { custIdx: 21, amount: 185000, status: 'PENDING', desc: 'Commercial tower workstation pods — Zenith Towers' },
    { custIdx: 22, amount: 38000, status: 'PAID', desc: 'Solid wood desks — Opus Architecture' },
    { custIdx: 23, amount: 26000, status: 'PAID', desc: 'Floating TV wall consoles — Solitaire Design' },
    { custIdx: 24, amount: 135000, status: 'PENDING', desc: 'Luxury suite wardrobes — Vivanta Suites' },
    { custIdx: 25, amount: 92000, status: 'PAID', desc: 'Commercial hub desks — MetroEdge Hubs' },
    { custIdx: 26, amount: 121900, status: 'PENDING', desc: 'Executive workstations — Apex Workspace' },
    { custIdx: 27, amount: 26550, status: 'PAID', desc: 'Velvet lounge armchairs — Radhika Sharma' },
    { custIdx: 28, amount: 74997, status: 'PAID', desc: 'Modular furniture batch — Royal Furniture' },
    { custIdx: 29, amount: 45999, status: 'PENDING', desc: 'Living room interior order — Urban Living' },
    { custIdx: 30, amount: 68000, status: 'PAID', desc: 'Studio furniture delivery — Karan Johar Ent' },
    { custIdx: 31, amount: 112000, status: 'PAID', desc: 'Executive office fitout — Sterling Financial' },
    { custIdx: 32, amount: 156000, status: 'PENDING', desc: 'Tech park conference chairs — Horizon Tech' },
    { custIdx: 33, amount: 37500, status: 'PAID', desc: 'Boutique display shelving — Velvet Touch' },
    { custIdx: 34, amount: 29500, status: 'PAID', desc: 'Clinic consultation desks — Harmony Dental' },
    // Repeat sales for active commercial clients
    { custIdx: 0, amount: 29000, status: 'PAID', desc: 'Additional ergonomic chairs — TechCraft' },
    { custIdx: 0, amount: 18500, status: 'PENDING', desc: 'Dual monitor arm mounts — TechCraft' },
    { custIdx: 1, amount: 42000, status: 'PAID', desc: 'Solid teak credenzas — Aster Living' },
    { custIdx: 2, amount: 54000, status: 'PENDING', desc: 'Dining chairs and table sets — MapleNest' },
    { custIdx: 3, amount: 62000, status: 'PAID', desc: 'Modular bedroom wardrobe batch — UrbanCraft' },
    { custIdx: 4, amount: 48000, status: 'PAID', desc: 'Accent lounge chairs — Ivory Space' },
    { custIdx: 5, amount: 36500, status: 'PENDING', desc: 'Platform beds — Oakline Residences' },
    { custIdx: 6, amount: 78000, status: 'PAID', desc: 'Meeting room furniture — Cedar & Co' },
    { custIdx: 7, amount: 22000, status: 'PAID', desc: 'Dining glass tables — The Modern Room' },
    { custIdx: 8, amount: 42500, status: 'PENDING', desc: 'Artisanal coffee tables — Heritage Gallery' },
    { custIdx: 9, amount: 84000, status: 'PAID', desc: 'Standing desks expansion — BlueGrid Workspace' },
    { custIdx: 10, amount: 28500, status: 'PAID', desc: 'Living room side tables — ComfortArc' },
    { custIdx: 11, amount: 56000, status: 'PENDING', desc: 'Corner desks — TimberTrail' },
    { custIdx: 12, amount: 72000, status: 'PAID', desc: 'Mirror wardrobes — CasaForm' },
    { custIdx: 14, amount: 98000, status: 'PAID', desc: 'Office pedestals & filing units — NorthStar' },
    { custIdx: 16, amount: 64000, status: 'PAID', desc: 'Acoustic privacy booths — Kaveri Co-Working' },
    { custIdx: 17, amount: 110000, status: 'PENDING', desc: 'Penthouse sofa sets — Skyline Suites' },
    { custIdx: 26, amount: 89000, status: 'PAID', desc: 'Corporate boardroom set — Apex Workspace' },
    { custIdx: 27, amount: 34500, status: 'PAID', desc: 'Dining tables — Radhika Sharma' },
    { custIdx: 28, amount: 52000, status: 'PENDING', desc: 'Showroom stock replenishment — Royal Furniture' }
  ]

  // 45 Purchase specifications (30 PAID, 15 PENDING)
  const purchaseSpecs = [
    { venIdx: 0, amount: 68000, status: 'PAID', desc: 'CNC cut engineered panels & jigs — Precision CNC' },
    { venIdx: 1, amount: 34000, status: 'PAID', desc: 'High-density polyurethane seat foam — AcousticFoam' },
    { venIdx: 2, amount: 95000, status: 'PENDING', desc: 'Kiln-dried pine & cedar lumbers — Himalayan Pine' },
    { venIdx: 3, amount: 28000, status: 'PAID', desc: 'Corrugated cartons & bubble wraps — Coromandel' },
    { venIdx: 4, amount: 112000, status: 'PAID', desc: 'First-grade seasoned teak logs — Western Timber' },
    { venIdx: 5, amount: 42000, status: 'PENDING', desc: 'Concealed hinges & soft-close runners — Gujarat Hardware' },
    { venIdx: 6, amount: 58000, status: 'PAID', desc: 'Matte & textured 1mm laminates — Metro Laminates' },
    { venIdx: 7, amount: 48000, status: 'PAID', desc: 'Cushion padding & memory foam — Prime Foam' },
    { venIdx: 8, amount: 31000, status: 'PENDING', desc: 'Brushed brass handles & knobs — Elegant Fittings' },
    { venIdx: 9, amount: 24000, status: 'PAID', desc: 'Inter-state freight logistics — Reliable Logistics' },
    { venIdx: 10, amount: 76000, status: 'PAID', desc: 'MS square tubes & desk frame legs — Narmada Steel' },
    { venIdx: 11, amount: 39000, status: 'PENDING', desc: 'Black satin electrostatic coating — Pinnacle Coating' },
    { venIdx: 12, amount: 45000, status: 'PAID', desc: 'Class-4 hydraulic gas lifts & casters — AeroGlide' },
    { venIdx: 13, amount: 82000, status: 'PAID', desc: 'Solid Sheesham hardwood planks — Classic Wood' },
    { venIdx: 14, amount: 29000, status: 'PENDING', desc: 'Decorative edge strips & trims — Modern Home Decor' },
    { venIdx: 15, amount: 115000, status: 'PAID', desc: 'Marine grade 18mm birch plywood — Greenply Timber' },
    { venIdx: 16, amount: 75000, status: 'PENDING', desc: 'Seasoned walnut lumber consignment — Azure Furniture' },
    { venIdx: 17, amount: 105000, status: 'PAID', desc: 'Burma teakwood premium timber — Teakwood Heritage' },
    { venIdx: 18, amount: 48000, status: 'PAID', desc: 'Commercial velvet & linen upholstery — DuraFab' },
    { venIdx: 19, amount: 21000, status: 'PENDING', desc: 'Zinc-plated joinery screws & dowels — Bharat Fasteners' },
    { venIdx: 20, amount: 36000, status: 'PAID', desc: '10mm toughened glass table tops — SunLite Glass' },
    { venIdx: 21, amount: 18000, status: 'PAID', desc: '2mm PVC edge banding rolls — Matrix Edge Banding' },
    { venIdx: 22, amount: 88000, status: 'PENDING', desc: 'Smoked oak decorative veneers — Pioneer Veneers' },
    { venIdx: 23, amount: 52000, status: 'PAID', desc: 'Rebonded foam blocks for sofas — Royal Foam' },
    { venIdx: 24, amount: 37000, status: 'PAID', desc: 'Recliner springs & tilt mechanisms — Delta Precision' },
    // Repeat purchases for steady manufacturing operations
    { venIdx: 0, amount: 54000, status: 'PENDING', desc: 'CNC desk routing batch — Precision CNC' },
    { venIdx: 1, amount: 26000, status: 'PAID', desc: 'Acoustic panel felt & batting — AcousticFoam' },
    { venIdx: 2, amount: 78000, status: 'PAID', desc: 'Pine structural framing battens — Himalayan Pine' },
    { venIdx: 3, amount: 19500, status: 'PENDING', desc: 'Export pallet wrapping films — Coromandel' },
    { venIdx: 4, amount: 89000, status: 'PAID', desc: 'Seasoned teak planks — Western Timber' },
    { venIdx: 5, amount: 33000, status: 'PAID', desc: 'Drawer slider runners — Gujarat Hardware' },
    { venIdx: 6, amount: 46000, status: 'PENDING', desc: 'Suede finish laminate sheets — Metro Laminates' },
    { venIdx: 7, amount: 38000, status: 'PAID', desc: 'High resilience foam slabs — Prime Foam' },
    { venIdx: 8, amount: 27500, status: 'PAID', desc: 'Metal hardware accessories — Elegant Fittings' },
    { venIdx: 10, amount: 62000, status: 'PENDING', desc: 'Heavy gauge steel base frames — Narmada Steel' },
    { venIdx: 11, amount: 28000, status: 'PAID', desc: 'Industrial powder coating — Pinnacle Coating' },
    { venIdx: 12, amount: 36000, status: 'PAID', desc: 'Castors and swivel bases — AeroGlide' },
    { venIdx: 13, amount: 68000, status: 'PENDING', desc: 'Hardwood lumber consignment — Classic Wood' },
    { venIdx: 15, amount: 92000, status: 'PAID', desc: 'Commercial plywood boards — Greenply' },
    { venIdx: 16, amount: 64000, status: 'PAID', desc: 'Walnut planks for desks — Azure Furniture' },
    { venIdx: 17, amount: 85000, status: 'PENDING', desc: 'Imported teak logs — Teakwood Heritage' },
    { venIdx: 18, amount: 41000, status: 'PAID', desc: 'Flame-retardant commercial fabric — DuraFab' },
    { venIdx: 19, amount: 16500, status: 'PAID', desc: 'Hardware fastener kits — Bharat Fasteners' },
    { venIdx: 20, amount: 29000, status: 'PENDING', desc: 'Custom cut beveled glass — SunLite Glass' },
    { venIdx: 22, amount: 67000, status: 'PAID', desc: 'Natural teak veneers — Pioneer Veneers' }
  ]

  let txCount = 0
  let totalSalesAmount = 0
  let totalPurchasesAmount = 0

  // Insert 55 Sales
  for (let i = 0; i < salesSpecs.length; i++) {
    const s = salesSpecs[i]
    const ref = `INV-2026-${String(i + 1).padStart(3, '0')}`
    const contact = customers[s.custIdx]
    const dateStr = dateList[i % dateList.length]
    const txDate = new Date(dateStr)
    const status = s.status === 'PAID' ? TransactionStatus.PAID : TransactionStatus.PENDING

    await prisma.$transaction(async (tx) => {
      const record = await tx.transaction.create({
        data: {
          type: TransactionType.SALE,
          reference: ref,
          contactId: contact.id,
          amount: s.amount,
          status,
          transactionDate: txDate
        }
      })

      const debitAccount = status === TransactionStatus.PAID ? 'Cash' : 'Accounts Receivable'
      const lines = [
        { accountName: debitAccount, debit: s.amount, credit: 0 },
        { accountName: 'Sales Revenue', debit: 0, credit: s.amount }
      ]

      await postJournalEntry(
        {
          reference: `JE-${ref}`,
          description: s.desc,
          transactionDate: txDate,
          transactionId: record.id,
          lines
        },
        tx
      )
    })

    totalSalesAmount += s.amount
    txCount++
  }

  // Insert 45 Purchases
  for (let i = 0; i < purchaseSpecs.length; i++) {
    const p = purchaseSpecs[i]
    const ref = `BILL-2026-${String(i + 1).padStart(3, '0')}`
    const contact = vendors[p.venIdx]
    const dateStr = dateList[(i + 5) % dateList.length]
    const txDate = new Date(dateStr)
    const status = p.status === 'PAID' ? TransactionStatus.PAID : TransactionStatus.PENDING

    await prisma.$transaction(async (tx) => {
      const record = await tx.transaction.create({
        data: {
          type: TransactionType.PURCHASE,
          reference: ref,
          contactId: contact.id,
          amount: p.amount,
          status,
          transactionDate: txDate
        }
      })

      const creditAccount = status === TransactionStatus.PAID ? 'Cash' : 'Accounts Payable'
      const lines = [
        { accountName: 'Inventory', debit: p.amount, credit: 0 },
        { accountName: creditAccount, debit: 0, credit: p.amount }
      ]

      await postJournalEntry(
        {
          reference: `JE-${ref}`,
          description: p.desc,
          transactionDate: txDate,
          transactionId: record.id,
          lines
        },
        tx
      )
    })

    totalPurchasesAmount += p.amount
    txCount++
  }

  console.log(`  Transactions created: ${txCount} (55 sales + 45 purchases)`)
  console.log(`    Total Sales Volume: ₹${totalSalesAmount.toLocaleString('en-IN')}`)
  console.log(`    Total Purchases Volume: ₹${totalPurchasesAmount.toLocaleString('en-IN')}`)
  console.log(`    Calculated Net Profit: ₹${(totalSalesAmount - totalPurchasesAmount).toLocaleString('en-IN')}`)

  // --- Step 5: Double-Entry Balancing Verification ---
  const debAggregate = await prisma.journalItem.aggregate({ _sum: { debit: true } })
  const credAggregate = await prisma.journalItem.aggregate({ _sum: { credit: true } })
  const totalDeb = Number(debAggregate._sum.debit || 0)
  const totalCred = Number(credAggregate._sum.credit || 0)
  const difference = totalDeb - totalCred

  console.log(`\nDouble-Entry Integrity Audit:`)
  console.log(`  Total Debits:  ₹${totalDeb.toLocaleString('en-IN')}`)
  console.log(`  Total Credits: ₹${totalCred.toLocaleString('en-IN')}`)
  console.log(`  Difference:    ₹${difference.toFixed(2)} (Strictly 0 expected)`)

  if (difference !== 0) {
    throw new Error(`Double entry imbalance detected: debit ${totalDeb} != credit ${totalCred}`)
  }

  console.log('\nSeed execution complete: 500 records inserted and verified.')
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
