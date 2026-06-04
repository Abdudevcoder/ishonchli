import { PrismaClient, Role, ReportCategory, ReportStatus, ReportType, RiskLevel } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin
  const adminHash = await bcrypt.hash("Password123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@ishonchli.uz" },
    update: {},
    create: {
      name: "Administrator",
      email: "admin@ishonchli.uz",
      passwordHash: adminHash,
      role: Role.ADMIN,
    },
  });

  // Create 5 users
  const users = [];
  const userNames = ["Alisher Toshmatov", "Nilufar Karimova", "Bobur Yusupov", "Zulfiya Nazarova", "Jasur Mirzaev"];
  for (let i = 0; i < 5; i++) {
    const hash = await bcrypt.hash("Password123!", 10);
    const user = await prisma.user.upsert({
      where: { email: `user${i + 1}@ishonchli.uz` },
      update: {},
      create: {
        name: userNames[i],
        email: `user${i + 1}@ishonchli.uz`,
        passwordHash: hash,
        role: Role.USER,
      },
    });
    users.push(user);
  }

  // Create 10 sellers
  const sellersData = [
    { phone: "+998901234567", telegramUsername: "seller_amir", marketplaceUsername: "amir_shop", trustScore: 85, riskLevel: RiskLevel.SAFE },
    { phone: "+998907654321", telegramUsername: "gadget_pro", marketplaceUsername: "gadget_pro_uz", trustScore: 72, riskLevel: RiskLevel.MODERATE },
    { phone: "+998991112233", telegramUsername: "fashion_uz", marketplaceUsername: "fashion_world", trustScore: 35, riskLevel: RiskLevel.HIGH, suspiciousFlag: true },
    { phone: "+998994445566", telegramUsername: "cheap_goods", marketplaceUsername: "cheap_goods_uz", trustScore: 10, riskLevel: RiskLevel.DANGEROUS, suspiciousFlag: true, potentialFraudster: true },
    { phone: "+998997778899", telegramUsername: "electronics_uz", marketplaceUsername: "electronics_store", trustScore: 91, riskLevel: RiskLevel.SAFE },
    { phone: "+998901010101", telegramUsername: "bookstore_uz", marketplaceUsername: "uzbek_books", trustScore: 78, riskLevel: RiskLevel.MODERATE },
    { phone: "+998902020202", telegramUsername: "toys_uz", marketplaceUsername: "kids_toys_uz", trustScore: 45, riskLevel: RiskLevel.HIGH, suspiciousFlag: true },
    { phone: "+998903030303", telegramUsername: "sport_uz", marketplaceUsername: "sport_goods_uz", trustScore: 88, riskLevel: RiskLevel.SAFE },
    { phone: "+998904040404", telegramUsername: "home_decor_uz", marketplaceUsername: "home_decor", trustScore: 60, riskLevel: RiskLevel.MODERATE },
    { phone: "+998905050505", telegramUsername: "fake_brand_uz", marketplaceUsername: "brand_goods_uz", trustScore: 5, riskLevel: RiskLevel.DANGEROUS, suspiciousFlag: true, potentialFraudster: true },
  ];

  const sellers = [];
  for (const data of sellersData) {
    const seller = await prisma.seller.upsert({
      where: { id: data.telegramUsername },
      update: {},
      create: {
        id: data.telegramUsername,
        ...data,
      },
    });
    sellers.push(seller);
  }

  // Create 20 reports
  const reportsData = [
    { sellerId: sellers[2].id, userId: users[0].id, category: ReportCategory.SCAM, description: "Seller took money but never delivered the item. No response after payment.", status: ReportStatus.APPROVED, type: ReportType.FRAUD },
    { sellerId: sellers[3].id, userId: users[1].id, category: ReportCategory.FAKE_PRODUCT, description: "Received a fake Nike shoes, original box but fake product inside.", status: ReportStatus.APPROVED, type: ReportType.FRAUD },
    { sellerId: sellers[3].id, userId: users[2].id, category: ReportCategory.NON_DELIVERY, description: "Paid 500,000 sum but package never arrived. Seller blocked me.", status: ReportStatus.APPROVED, type: ReportType.FRAUD },
    { sellerId: sellers[6].id, userId: users[0].id, category: ReportCategory.PAYMENT_FRAUD, description: "Seller sent fake payment confirmation. Item was never real.", status: ReportStatus.PENDING, type: ReportType.FRAUD },
    { sellerId: sellers[9].id, userId: users[3].id, category: ReportCategory.SCAM, description: "Completely fake brand items sold as genuine. All logos are copied.", status: ReportStatus.APPROVED, type: ReportType.FRAUD },
    { sellerId: sellers[9].id, userId: users[4].id, category: ReportCategory.FAKE_PRODUCT, description: "iPhone box contained Android phone. Classic bait and switch.", status: ReportStatus.APPROVED, type: ReportType.FRAUD },
    { sellerId: sellers[2].id, userId: users[2].id, category: ReportCategory.ACCOUNT_THEFT, description: "Seller requested my card details for refund. Suspicious activity.", status: ReportStatus.APPROVED, type: ReportType.FRAUD },
    { sellerId: sellers[6].id, userId: users[1].id, category: ReportCategory.NON_DELIVERY, description: "Toy ordered for child never arrived. No tracking provided.", status: ReportStatus.REJECTED, type: ReportType.FRAUD },
    { sellerId: sellers[3].id, userId: users[3].id, category: ReportCategory.SCAM, description: "Third time this seller scammed people in our group. Please ban.", status: ReportStatus.APPROVED, type: ReportType.FRAUD },
    { sellerId: sellers[9].id, userId: users[0].id, category: ReportCategory.PAYMENT_FRAUD, description: "Double charged my card. Seller refuses to refund.", status: ReportStatus.PENDING, type: ReportType.FRAUD },
    // Positive reviews
    { sellerId: sellers[0].id, userId: users[0].id, category: ReportCategory.OTHER, description: "Excellent seller! Fast delivery, genuine product. Highly recommend.", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 5 },
    { sellerId: sellers[0].id, userId: users[1].id, category: ReportCategory.OTHER, description: "Very honest seller, packed items carefully. Will buy again.", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 5 },
    { sellerId: sellers[4].id, userId: users[2].id, category: ReportCategory.OTHER, description: "Great electronics store, all items have warranty. Professional.", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 5 },
    { sellerId: sellers[7].id, userId: users[3].id, category: ReportCategory.OTHER, description: "Best sport goods shop in Tashkent online. Quality products.", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 4 },
    { sellerId: sellers[1].id, userId: users[4].id, category: ReportCategory.OTHER, description: "Good prices, fast response. Minor delay in delivery but item arrived.", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 4 },
    { sellerId: sellers[5].id, userId: users[0].id, category: ReportCategory.OTHER, description: "Large collection of books. Prices are fair. Recommended!", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 5 },
    { sellerId: sellers[8].id, userId: users[1].id, category: ReportCategory.OTHER, description: "Beautiful home decor items. Exactly as shown in photos.", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 4 },
    { sellerId: sellers[4].id, userId: users[3].id, category: ReportCategory.OTHER, description: "Ordered laptop, arrived next day. Works perfectly. Thank you!", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 5 },
    { sellerId: sellers[2].id, userId: users[4].id, category: ReportCategory.SCAM, description: "Listed item at low price but when I paid the price doubled. Scam.", status: ReportStatus.PENDING, type: ReportType.FRAUD },
    { sellerId: sellers[1].id, userId: users[2].id, category: ReportCategory.OTHER, description: "Responded quickly, product was as described. No issues.", status: ReportStatus.APPROVED, type: ReportType.POSITIVE, rating: 4 },
  ];

  for (const data of reportsData) {
    await prisma.report.create({ data });
  }

  console.log("Seed complete!");
  console.log(`Admin: admin@ishonchli.uz / Password123!`);
  console.log(`Users: user1@ishonchli.uz through user5@ishonchli.uz / Password123!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
