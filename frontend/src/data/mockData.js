export const initialMockData = {
  company: {
    name: "Urban Furniture Pvt. Ltd.",
    brandName: "URBAN",
    brandSubtitle: "ACCOUNTING SYSTEM",
    tagline: "Modern Accounting & Enterprise ERP",
    email: "accounts@urbanfurniture.in",
    phone: "+91 98200 12345",
    address: "Unit 402, Signature Tower, Link Road, Andheri West, Mumbai, MH - 400053",
    gstin: "27AAACU1234F1Z5",
    pan: "AAACU1234F",
    bank: "HDFC Bank Ltd, Andheri West Branch",
    accountNo: "50200049281726",
    ifsc: "HDFC0000123"
  },

  contacts: [
    {
      id: "C-101",
      name: "Nimesh Pathak",
      type: "Customer",
      email: "nimesh.pathak@techcraft.io",
      mobile: "+91 98765 43210",
      address: "Flat 801, Sea View Towers, Worli",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400018",
      outstanding: 42500,
      status: "Active",
      favorite: true,
      createdAt: "2026-08-10"
    },
    {
      id: "C-102",
      name: "Azure Furniture Works",
      type: "Vendor",
      email: "procurements@azuretimber.com",
      mobile: "+91 87654 32109",
      address: "Plot 42, Mayapuri Industrial Area Phase 2",
      city: "New Delhi",
      state: "Delhi",
      pincode: "110064",
      outstanding: 75000,
      status: "Active",
      favorite: true,
      createdAt: "2026-07-15"
    },
    {
      id: "C-103",
      name: "Radhika Sharma",
      type: "Customer",
      email: "radhika.s@designstudio.co",
      mobile: "+91 99201 88321",
      address: "14th Cross, Indiranagar",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      outstanding: 18500,
      status: "Active",
      favorite: false,
      createdAt: "2026-08-20"
    },
    {
      id: "C-104",
      name: "Greenply Timber Industries",
      type: "Vendor",
      email: "sales@greenplytimber.in",
      mobile: "+91 94330 11223",
      address: "NH 8, Behror Industrial Estate",
      city: "Alwar",
      state: "Rajasthan",
      pincode: "301701",
      outstanding: 120000,
      status: "Active",
      favorite: false,
      createdAt: "2026-06-05"
    },
    {
      id: "C-105",
      name: "Apex Workspace Solutions",
      type: "Both",
      email: "ops@apexworkspace.com",
      mobile: "+91 98112 33445",
      address: "Cyber City DLF Phase 3",
      city: "Gurugram",
      state: "Haryana",
      pincode: "122002",
      outstanding: 95000,
      status: "Active",
      favorite: true,
      createdAt: "2026-07-28"
    },
    {
      id: "C-106",
      name: "Karan Johar Enterprises",
      type: "Customer",
      email: "accounts@kje.in",
      mobile: "+91 97170 55443",
      address: "Bandra Kurla Complex",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400051",
      outstanding: 0,
      status: "Archived",
      favorite: false,
      createdAt: "2026-05-12"
    }
  ],

  products: [
    {
      id: "P-001",
      name: "Ergonomic Mesh Chair V2",
      code: "FURN-CHR-001",
      type: "Goods",
      category: "Seating",
      salesPrice: 14500,
      purchasePrice: 9200,
      stock: 42,
      minStock: 15,
      openingStock: 50,
      purchasedQty: 30,
      soldQty: 38,
      status: "Active",
      favorite: true,
      description: "High-back breathable mesh chair with lumbar support and 3D armrests."
    },
    {
      id: "P-002",
      name: "Executive Walnut Desk 6ft",
      code: "FURN-DSK-002",
      type: "Goods",
      category: "Desks",
      salesPrice: 38000,
      purchasePrice: 24500,
      stock: 14,
      minStock: 5,
      openingStock: 18,
      purchasedQty: 10,
      soldQty: 14,
      status: "Active",
      favorite: true,
      description: "Solid engineered walnut wood executive desk with wire management."
    },
    {
      id: "P-003",
      name: "Modular Acoustic Meeting Pod",
      code: "FURN-POD-003",
      type: "Goods",
      category: "Acoustics",
      salesPrice: 185000,
      purchasePrice: 120000,
      stock: 3,
      minStock: 2,
      openingStock: 4,
      purchasedQty: 3,
      soldQty: 4,
      status: "Active",
      favorite: false,
      description: "Soundproof private 2-person work pod with ventilation and power hub."
    },
    {
      id: "P-004",
      name: "Velvet Lounge Armchair (Forest Green)",
      code: "FURN-LNG-004",
      type: "Goods",
      category: "Lounge",
      salesPrice: 22500,
      purchasePrice: 14000,
      stock: 8,
      minStock: 10,
      openingStock: 15,
      purchasedQty: 5,
      soldQty: 12,
      status: "Low Stock",
      favorite: false,
      description: "Architectural accent chair upholstered in stain-resistant velvet."
    },
    {
      id: "P-005",
      name: "Solid Oak 10-Seater Boardroom Table",
      code: "FURN-TBL-005",
      type: "Goods",
      category: "Tables",
      salesPrice: 88000,
      purchasePrice: 56000,
      stock: 0,
      minStock: 2,
      openingStock: 2,
      purchasedQty: 2,
      soldQty: 4,
      status: "Out of Stock",
      favorite: false,
      description: "Natural finish oak boardroom table with integrated pop-up data boxes."
    },
    {
      id: "P-006",
      name: "On-Site Installation & Assembly Service",
      code: "SRV-INST-001",
      type: "Service",
      category: "Service",
      salesPrice: 2500,
      purchasePrice: 1200,
      stock: null,
      minStock: null,
      openingStock: 0,
      purchasedQty: 0,
      soldQty: 25,
      status: "Active",
      favorite: false,
      description: "Professional multi-technician delivery, unpack, level, and assembly."
    },
    {
      id: "P-007",
      name: "Complete Workstation Set (Desk + Chair + Pedestal)",
      code: "CMB-WS-001",
      type: "Combo",
      category: "Workstations",
      salesPrice: 48000,
      purchasePrice: 31000,
      stock: 12,
      minStock: 4,
      openingStock: 15,
      purchasedQty: 10,
      soldQty: 13,
      status: "Active",
      favorite: true,
      description: "Value workstation bundle including ergonomic chair, desk and 3-drawer lockable pedestal."
    }
  ],

  accounts: [
    // ASSETS
    { id: "ACC-1010", code: "1010", name: "Cash in Hand", category: "Assets", type: "Asset", balance: 65400, status: "Active" },
    { id: "ACC-1020", code: "1020", name: "HDFC Current Bank Account", category: "Assets", type: "Asset", balance: 684200, status: "Active" },
    { id: "ACC-1030", code: "1030", name: "ICICI Operational Account", category: "Assets", type: "Asset", balance: 245000, status: "Active" },
    { id: "ACC-1100", code: "1100", name: "Accounts Receivable (Debtors)", category: "Assets", type: "Asset", balance: 246500, status: "Active" },
    { id: "ACC-1200", code: "1200", name: "Furniture Finished Goods Inventory", category: "Assets", type: "Asset", balance: 485000, status: "Active" },
    { id: "ACC-1500", code: "1500", name: "Showroom Plant & Equipment", category: "Assets", type: "Asset", balance: 750000, status: "Active" },

    // LIABILITIES
    { id: "ACC-2010", code: "2010", name: "Accounts Payable (Creditors)", category: "Liabilities", type: "Liability", balance: 195000, status: "Active" },
    { id: "ACC-2050", code: "2050", name: "Output GST Payable (18%)", category: "Liabilities", type: "Liability", balance: 68400, status: "Active" },
    { id: "ACC-2080", code: "2080", name: "Bank Term Loan (HDFC)", category: "Liabilities", type: "Liability", balance: 350000, status: "Active" },

    // CAPITAL / EQUITY
    { id: "ACC-3010", code: "3010", name: "Owner Capital / Equity", category: "Capital", type: "Capital", balance: 1200000, status: "Active" },
    { id: "ACC-3020", code: "3020", name: "Retained Earnings", category: "Capital", type: "Capital", balance: 344300, status: "Active" },

    // INCOME
    { id: "ACC-4010", code: "4010", name: "Sales Revenue - Commercial Furniture", category: "Income", type: "Income", balance: 1142500, status: "Active" },
    { id: "ACC-4020", code: "4020", name: "Service & Assembly Revenue", category: "Income", type: "Income", balance: 142000, status: "Active" },
    { id: "ACC-4090", code: "4090", name: "Other Indirect Income / Discounts Received", category: "Income", type: "Income", balance: 21800, status: "Active" },

    // EXPENSES
    { id: "ACC-5010", code: "5010", name: "Cost of Goods Sold (Purchases)", category: "Expenses", type: "Expense", balance: 592800, status: "Active" },
    { id: "ACC-5020", code: "5020", name: "Showroom Rent & Maintenance", category: "Expenses", type: "Expense", balance: 150000, status: "Active" },
    { id: "ACC-5030", code: "5030", name: "Staff Payroll & Professional Fees", category: "Expenses", type: "Expense", balance: 185000, status: "Active" },
    { id: "ACC-5040", code: "5040", name: "Freight, Shipping & Logistics", category: "Expenses", type: "Expense", balance: 42500, status: "Active" },
    { id: "ACC-5050", code: "5050", name: "Utilities, Internet & Software SaaS", category: "Expenses", type: "Expense", balance: 17600, status: "Active" }
  ],

  journals: [
    { id: "JRN-01", name: "Sales Journal", code: "SJ", type: "Sales", defaultAccount: "ACC-4010", entriesCount: 142, status: "Active" },
    { id: "JRN-02", name: "Purchase Journal", code: "PJ", type: "Purchase", defaultAccount: "ACC-5010", entriesCount: 98, status: "Active" },
    { id: "JRN-03", name: "Bank Journal (HDFC)", code: "BNK", type: "Bank", defaultAccount: "ACC-1020", entriesCount: 210, status: "Active" },
    { id: "JRN-04", name: "Cash Journal", code: "CSH", type: "Cash", defaultAccount: "ACC-1010", entriesCount: 64, status: "Active" },
    { id: "JRN-05", name: "General Miscellaneous Journal", code: "MISC", type: "General", defaultAccount: "ACC-3020", entriesCount: 35, status: "Active" }
  ],

  journalEntries: [
    {
      id: "JE-2026-001",
      journal: "Sales Journal",
      date: "2026-09-01",
      reference: "INV-1024",
      description: "Recognition of revenue for ergonomic mesh chairs",
      lines: [
        { accountId: "ACC-1100", accountName: "Accounts Receivable", description: "Debit Nimesh Pathak", debit: 42500, credit: 0 },
        { accountId: "ACC-4010", accountName: "Sales Revenue", description: "Credit Sales Account", debit: 0, credit: 36017 },
        { accountId: "ACC-2050", accountName: "Output GST Payable (18%)", description: "Credit GST Liability", debit: 0, credit: 6483 }
      ],
      totalDebit: 42500,
      totalCredit: 42500,
      status: "Posted"
    },
    {
      id: "JE-2026-002",
      journal: "Bank Journal (HDFC)",
      date: "2026-09-02",
      reference: "PAY-1042",
      description: "Payment received from Nimesh Pathak via NEFT",
      lines: [
        { accountId: "ACC-1020", accountName: "HDFC Current Bank Account", description: "Bank balance increase", debit: 42500, credit: 0 },
        { accountId: "ACC-1100", accountName: "Accounts Receivable", description: "Clear receivable", debit: 0, credit: 42500 }
      ],
      totalDebit: 42500,
      totalCredit: 42500,
      status: "Posted"
    },
    {
      id: "JE-2026-003",
      journal: "Purchase Journal",
      date: "2026-08-28",
      reference: "BILL-2041",
      description: "Wood and metal supplies procurement from Azure Furniture",
      lines: [
        { accountId: "ACC-5010", accountName: "Cost of Goods Sold (Purchases)", description: "Stock purchase", debit: 63559, credit: 0 },
        { accountId: "ACC-1030", accountName: "Input GST Credit", description: "Tax credit", debit: 11441, credit: 0 },
        { accountId: "ACC-2010", accountName: "Accounts Payable (Creditors)", description: "Payable to Azure", debit: 0, credit: 75000 }
      ],
      totalDebit: 75000,
      totalCredit: 75000,
      status: "Posted"
    }
  ],

  salesOrders: [
    {
      id: "SO-2026-041",
      date: "2026-09-03",
      contactId: "C-101",
      customerName: "Nimesh Pathak",
      expectedDelivery: "2026-09-12",
      items: [
        { productId: "P-001", productName: "Ergonomic Mesh Chair V2", quantity: 3, unitPrice: 14500, taxRate: 18, total: 51330 },
        { productId: "P-006", productName: "On-Site Installation & Assembly", quantity: 1, unitPrice: 2500, taxRate: 18, total: 2950 }
      ],
      subtotal: 46000,
      tax: 8280,
      discount: 0,
      grandTotal: 54280,
      status: "Confirmed"
    },
    {
      id: "SO-2026-042",
      date: "2026-09-04",
      contactId: "C-105",
      customerName: "Apex Workspace Solutions",
      expectedDelivery: "2026-09-18",
      items: [
        { productId: "P-007", productName: "Complete Workstation Set", quantity: 4, unitPrice: 48000, taxRate: 18, total: 226560 }
      ],
      subtotal: 192000,
      tax: 34560,
      discount: 5000,
      grandTotal: 221560,
      status: "Draft"
    }
  ],

  invoices: [
    {
      id: "INV-1024",
      orderId: "SO-2026-039",
      contactId: "C-101",
      customerName: "Nimesh Pathak",
      customerEmail: "nimesh.pathak@techcraft.io",
      customerAddress: "Flat 801, Sea View Towers, Worli, Mumbai",
      date: "2026-09-01",
      dueDate: "2026-09-15",
      items: [
        { productId: "P-001", productName: "Ergonomic Mesh Chair V2", quantity: 2, unitPrice: 14500, taxRate: 18, total: 34220 },
        { productId: "P-006", productName: "On-Site Installation & Assembly", quantity: 1, unitPrice: 2500, taxRate: 18, total: 2950 },
        { productId: "P-002", productName: "Desk Organizer Wooden Kit", quantity: 1, unitPrice: 5330, taxRate: 0, total: 5330 }
      ],
      subtotal: 36830,
      tax: 6670,
      discount: 1000,
      grandTotal: 42500,
      amountPaid: 42500,
      status: "Paid",
      paymentMethod: "Bank NEFT",
      notes: "Goods delivered in prime condition. 1-year on-site warranty included."
    },
    {
      id: "INV-1025",
      orderId: "SO-2026-040",
      contactId: "C-103",
      customerName: "Radhika Sharma",
      customerEmail: "radhika.s@designstudio.co",
      customerAddress: "14th Cross, Indiranagar, Bengaluru",
      date: "2026-09-03",
      dueDate: "2026-09-17",
      items: [
        { productId: "P-004", productName: "Velvet Lounge Armchair (Forest Green)", quantity: 1, unitPrice: 22500, taxRate: 18, total: 26550 }
      ],
      subtotal: 22500,
      tax: 4050,
      discount: 0,
      grandTotal: 26550,
      amountPaid: 8050,
      status: "Pending",
      paymentMethod: "Pending",
      notes: "Advance of ₹8,050 received. Balance ₹18,500 due on delivery."
    },
    {
      id: "INV-1026",
      orderId: "SO-2026-035",
      contactId: "C-105",
      customerName: "Apex Workspace Solutions",
      customerEmail: "ops@apexworkspace.com",
      customerAddress: "Cyber City DLF Phase 3, Gurugram",
      date: "2026-08-15",
      dueDate: "2026-08-30",
      items: [
        { productId: "P-002", productName: "Executive Walnut Desk 6ft", quantity: 2, unitPrice: 38000, taxRate: 18, total: 89680 },
        { productId: "P-001", productName: "Ergonomic Mesh Chair V2", quantity: 2, unitPrice: 14500, taxRate: 18, total: 34220 }
      ],
      subtotal: 105000,
      tax: 18900,
      discount: 2000,
      grandTotal: 121900,
      amountPaid: 26900,
      status: "Overdue",
      paymentMethod: "Pending",
      notes: "Net 15 terms. First reminder dispatched on Sept 1."
    }
  ],

  purchaseOrders: [
    {
      id: "PO-2026-001",
      date: "2026-08-25",
      vendorId: "C-102",
      vendorName: "Azure Furniture Works",
      expectedDate: "2026-09-05",
      items: [
        { productId: "P-001", productName: "Ergonomic Mesh Chair V2 Components", quantity: 20, unitPrice: 9200, total: 184000 }
      ],
      totalAmount: 184000,
      status: "Confirmed"
    },
    {
      id: "PO-2026-002",
      date: "2026-09-02",
      vendorId: "C-104",
      vendorName: "Greenply Timber Industries",
      expectedDate: "2026-09-15",
      items: [
        { productId: "P-002", productName: "Raw Seasoned Walnut Planks", quantity: 50, unitPrice: 2400, total: 120000 }
      ],
      totalAmount: 120000,
      status: "Draft"
    }
  ],

  bills: [
    {
      id: "BILL-2041",
      poReference: "PO-2026-001",
      vendorId: "C-102",
      vendorName: "Azure Furniture Works",
      vendorInvoiceNumber: "AZ-9812",
      date: "2026-08-28",
      dueDate: "2026-09-20",
      items: [
        { description: "Pre-assembled hydraulic gas lifts and castors", quantity: 25, unitPrice: 3000, total: 75000 }
      ],
      subtotal: 75000,
      tax: 0,
      total: 75000,
      amountPaid: 0,
      status: "Pending"
    },
    {
      id: "BILL-2042",
      poReference: "PO-2026-002",
      vendorId: "C-104",
      vendorName: "Greenply Timber Industries",
      vendorInvoiceNumber: "GP-4412",
      date: "2026-09-01",
      dueDate: "2026-09-25",
      items: [
        { description: "FSC certified birch plywood boards 18mm", quantity: 40, unitPrice: 3000, total: 120000 }
      ],
      subtotal: 120000,
      tax: 0,
      total: 120000,
      amountPaid: 0,
      status: "Pending"
    }
  ],

  payments: [
    {
      id: "PAY-1042",
      date: "2026-09-02",
      reference: "NEFT-HDFC-9938",
      type: "Customer Payment",
      contactId: "C-101",
      contactName: "Nimesh Pathak",
      invoiceBillId: "INV-1024",
      method: "Bank",
      amount: 42500,
      status: "Completed",
      notes: "Full settlement for invoice INV-1024"
    },
    {
      id: "PAY-1043",
      date: "2026-09-03",
      reference: "UPI-481902",
      type: "Customer Payment",
      contactId: "C-103",
      contactName: "Radhika Sharma",
      invoiceBillId: "INV-1025",
      method: "Bank",
      amount: 8050,
      status: "Completed",
      notes: "Booking advance via UPI"
    },
    {
      id: "PAY-1044",
      date: "2026-08-30",
      reference: "RTGS-92817",
      type: "Vendor Payment",
      contactId: "C-102",
      contactName: "Azure Furniture Works",
      invoiceBillId: "BILL-2040",
      method: "Bank",
      amount: 65000,
      status: "Completed",
      notes: "Payment for timber consignment"
    }
  ],

  budgets: [
    {
      id: "BGT-01",
      name: "Flagship Showroom Interior & Display",
      period: "FY 2026-27 Q2",
      responsiblePerson: "Aarav Mehra (Ops Lead)",
      analyticAccount: "Showroom Ops",
      plannedAmount: 500000,
      usedAmount: 340000,
      status: "Active"
    },
    {
      id: "BGT-02",
      name: "Commercial Woodworking Machinery CapEx",
      period: "FY 2026-27 Q2",
      responsiblePerson: "Suresh Pillai (Production)",
      analyticAccount: "Manufacturing Plant",
      plannedAmount: 850000,
      usedAmount: 795000,
      status: "Active"
    },
    {
      id: "BGT-03",
      name: "Architect & Corporate B2B Marketing",
      period: "FY 2026-27 Q2",
      responsiblePerson: "Priya Nair (Marketing)",
      analyticAccount: "B2B Projects",
      plannedAmount: 250000,
      usedAmount: 285000,
      status: "Active"
    },
    {
      id: "BGT-04",
      name: "Cloud ERP & Design Software Licenses",
      period: "FY 2026-27 Annual",
      responsiblePerson: "IT Department",
      analyticAccount: "IT Infrastructure",
      plannedAmount: 120000,
      usedAmount: 48000,
      status: "Active"
    }
  ],

  analyticAccounts: [
    { id: "ANA-01", name: "Flagship Showroom Ops", type: "Expense", responsiblePerson: "Aarav Mehra", totalIncome: 0, totalExpense: 340000, status: "Active" },
    { id: "ANA-02", name: "B2B Corporate Fitouts", type: "Income", responsiblePerson: "Priya Nair", totalIncome: 890000, totalExpense: 540000, status: "Active" },
    { id: "ANA-03", name: "Direct Consumer Online Orders", type: "Income", responsiblePerson: "Rohan Varma", totalIncome: 394500, totalExpense: 112000, status: "Active" },
    { id: "ANA-04", name: "Manufacturing & R&D Plant", type: "Expense", responsiblePerson: "Suresh Pillai", totalIncome: 0, totalExpense: 795000, status: "Active" }
  ],

  recentTransactions: [
    { id: "TX-1", date: "2026-09-02", reference: "INV-1024", contact: "Nimesh Pathak", type: "Sales", amount: 42500, status: "Paid", paymentMethod: "Bank" },
    { id: "TX-2", date: "2026-08-28", reference: "BILL-2041", contact: "Azure Furniture", type: "Purchase", amount: 75000, status: "Pending", paymentMethod: "Credit" },
    { id: "TX-3", date: "2026-09-02", reference: "PAY-1042", contact: "Nimesh Pathak", type: "Payment", amount: 42500, status: "Completed", paymentMethod: "Bank" },
    { id: "TX-4", date: "2026-09-03", reference: "INV-1025", contact: "Radhika Sharma", type: "Sales", amount: 26550, status: "Pending", paymentMethod: "Partial" },
    { id: "TX-5", date: "2026-08-15", reference: "INV-1026", contact: "Apex Workspace", type: "Sales", amount: 121900, status: "Overdue", paymentMethod: "Credit" }
  ],

  notifications: [
    { id: "NOTIF-1", title: "Customer Invoice Paid", description: "INV-1024 (₹42,500) received from Nimesh Pathak via NEFT", time: "2 hours ago", type: "success", read: false },
    { id: "NOTIF-2", title: "Vendor Bill Due Soon", description: "BILL-2041 (₹75,000) for Azure Furniture is due in 15 days", time: "5 hours ago", type: "warning", read: false },
    { id: "NOTIF-3", title: "Budget Limit Exceeded", description: "B2B Corporate Marketing has exceeded planned threshold (114%)", time: "1 day ago", type: "danger", read: true },
    { id: "NOTIF-4", title: "Low Stock Alert", description: "Velvet Lounge Armchair (Forest Green) has dropped to 8 units", time: "2 days ago", type: "warning", read: true },
    { id: "NOTIF-5", title: "New Payment Registered", description: "Booking advance of ₹8,050 logged for INV-1025", time: "2 days ago", type: "info", read: true }
  ],

  feedbackMessages: [
    {
      id: "FB-101",
      date: "2026-09-04",
      senderName: "Nimesh Pathak",
      senderRole: "Contact User",
      email: "nimesh.pathak@techcraft.io",
      category: "Customer Invoices",
      referenceId: "INV-1024",
      priority: "Normal",
      message: "Requested updated GST tax breakup line items on invoice statement.",
      status: "New"
    },
    {
      id: "FB-102",
      date: "2026-09-05",
      senderName: "Priya Sharma",
      senderRole: "Accountant",
      email: "accounts@urbanfurniture.in",
      category: "Vendor Bills",
      referenceId: "BILL-2041",
      priority: "Urgent",
      message: "Vendor Azure Furniture sent updated banking UTR clearance advice for bill BILL-2041.",
      status: "In Progress"
    },
    {
      id: "FB-103",
      date: "2026-09-06",
      senderName: "Azure Furniture Works",
      senderRole: "Vendor",
      email: "procurements@azuretimber.com",
      category: "Purchase Orders",
      referenceId: "PO-2026-001",
      priority: "High",
      message: "Dispatched hydraulic gas lifts consignment. Kindly confirm delivery inspection report.",
      status: "New"
    }
  ],

  kpi: {
    totalSales: 1284500,
    salesChange: "+12.5%",
    totalPurchases: 742800,
    purchasesChange: "+8.2%",
    netProfit: 318400,
    profitChange: "+15.8%",
    outstandingReceivables: 246500,
    receivablesAlert: "Needs attention"
  },

  chartData: {
    salesOverview: [
      { month: "Apr", sales: 820000, purchases: 520000, profit: 300000 },
      { month: "May", sales: 940000, purchases: 610000, profit: 330000 },
      { month: "Jun", sales: 1100000, purchases: 720000, profit: 380000 },
      { month: "Jul", sales: 980000, purchases: 640000, profit: 340000 },
      { month: "Aug", sales: 1150000, purchases: 690000, profit: 460000 },
      { month: "Sep", sales: 1284500, purchases: 742800, profit: 318400 }
    ],
    revenueVsExpenses: [
      { category: "Commercial Chairs", revenue: 480000, expense: 280000 },
      { category: "Executive Desks", revenue: 390000, expense: 220000 },
      { category: "Meeting Pods", revenue: 250000, expense: 150000 },
      { category: "Lounge Seating", revenue: 164500, expense: 92800 }
    ],
    cashFlow: [
      { week: "Week 1", cashIn: 320000, cashOut: 210000 },
      { week: "Week 2", cashIn: 280000, cashOut: 190000 },
      { week: "Week 3", cashIn: 390000, cashOut: 240000 },
      { week: "Week 4", cashIn: 294500, cashOut: 102800 }
    ]
  }
};
