import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

// Global in-memory storage persisted on globalThis across Next.js re-renders
interface MemoryStore {
  global_settings: any[];
  hero_settings: any[];
  category_settings: any[];
  product_settings: any[];
  automation_settings: any[];
  about_settings: any[];
  categories: any[];
  products: any[];
  admins: any[];
  users: any[];
  orders: any[];
  order_items: any[];
  nextCategoryId: number;
  nextProductId: number;
}

const g = globalThis as unknown as { __store_mono_db?: MemoryStore };

if (!g.__store_mono_db) {
  const adminHash = bcrypt.hashSync("admin123", 10);
  const demoHash = bcrypt.hashSync("demo123", 10);

  g.__store_mono_db = {
    global_settings: [
      {
        id: 1,
        company_name: "STORE.",
        theme_key: "light",
        font_key: "display",
        logo_url: "",
      },
    ],
    hero_settings: [
      {
        id: 1,
        title: "Elevate Your Lifestyle",
        subtitle: "Discover premium products curated for the modern world.",
        layout_style: "background",
        image_url:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
        btn_primary_text: "Shop Now",
        btn_primary_theme: "solid-blue",
        btn_secondary_text: "Learn More",
        btn_secondary_theme: "outline-light",
      },
    ],
    category_settings: [
      {
        id: 1,
        title: "Shop by Category",
        subtitle: "Curated collections crafted for every aspect of your life",
        bg_value: "#f8fafc",
        text_color: "#0f172a",
        card_bg_color: "#ffffff",
        card_text_color: "#0f172a",
        font_key: "sans",
      },
    ],
    product_settings: [
      {
        id: 1,
        title: "Featured Products",
        subtitle: "Explore our most popular best-sellers and new arrivals",
        currency: "USD",
        bg_color: "#ffffff",
        text_color: "#0f172a",
      },
    ],
    automation_settings: [
      {
        id: 1,
        webhook_url: "",
        webhook_secret: "",
        is_active: false,
        paymongo_secret_key: "",
        updated_at: new Date().toISOString(),
      },
    ],
    about_settings: [
      {
        id: 1,
        title: "About Our Store",
        subtitle: "Crafting exceptional experiences and curated essentials for the modern lifestyle.",
        about_content: "Founded with a dedication to simplicity, reliability, and modern aesthetics, our store curates high-performing products designed to elevate everyday life. Every piece in our collection is carefully evaluated for durability, utility, and refined craftsmanship.",
        vision_title: "Our Vision",
        vision_statement: "To be the trusted destination for individuals who value quality craftsmanship, minimalist aesthetics, and timeless design in everyday products.",
        mission_title: "Our Mission",
        mission_statement: "Empowering our customers through meticulously designed, sustainably sourced, and enduring goods while delivering transparent, first-class service.",
        bg_type: "solid",
        bg_color: "#f1f5f9",
        bg_gradient_end: "#e2e8f0",
        bg_gradient_direction: "to-br",
        text_color: "#000000",
        font_key: "sans",
        updated_at: new Date().toISOString(),
      },
    ],
    categories: [
      {
        id: 1,
        name: "Apparel & Fashion",
        slug: "apparel-fashion",
        media_url:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
        image_url:
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80",
        icon_name: "Shirt",
        attribute_template: "Size, Color, Material",
        created_at: new Date("2026-01-01").toISOString(),
      },
      {
        id: 2,
        name: "Tech & Audio",
        slug: "tech-audio",
        media_url:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        image_url:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        icon_name: "Laptop",
        attribute_template: "Brand, Connectivity, Warranty",
        created_at: new Date("2026-01-02").toISOString(),
      },
      {
        id: 3,
        name: "Home & Living",
        slug: "home-living",
        media_url:
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        image_url:
          "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
        icon_name: "Armchair",
        attribute_template: "Dimensions, Material, Room",
        created_at: new Date("2026-01-03").toISOString(),
      },
      {
        id: 4,
        name: "Accessories",
        slug: "accessories",
        media_url:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        image_url:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        icon_name: "ShoppingBag",
        attribute_template: "Material, Color, Gender",
        created_at: new Date("2026-01-04").toISOString(),
      },
    ],
    products: [
      {
        id: 1,
        title: "Minimalist Leather Backpack",
        slug: "minimalist-leather-backpack",
        subtitle: "Full-grain Italian calfskin leather",
        description:
          "Engineered for daily commutes and weekend escapes. Features a water-resistant lining and padded 16-inch laptop compartment.",
        unit_cost: 45,
        price: 129,
        srp: 159,
        discount_percentage: 19,
        stock: 35,
        category_id: 4,
        image_1:
          "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80",
        image_2: "",
        image_3: "",
        attributes: { Material: "Full-grain Leather", Color: "Cognac Brown" },
        created_at: new Date("2026-01-10").toISOString(),
        updated_at: new Date("2026-01-10").toISOString(),
      },
      {
        id: 2,
        title: "Studio Pro Wireless Headphones",
        slug: "studio-pro-wireless-headphones",
        subtitle: "Active Noise Cancellation & 40H Playtime",
        description:
          "Audiophile-grade 40mm beryllium drivers delivering pure acoustic precision with ultra-low latency wireless streaming.",
        unit_cost: 75,
        price: 249,
        srp: 299,
        discount_percentage: 16,
        stock: 22,
        category_id: 2,
        image_1:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
        image_2: "",
        image_3: "",
        attributes: { Connectivity: "Bluetooth 5.3", Battery: "40 Hours" },
        created_at: new Date("2026-01-11").toISOString(),
        updated_at: new Date("2026-01-11").toISOString(),
      },
      {
        id: 3,
        title: "Mechanical Chronograph Watch",
        slug: "mechanical-chronograph-watch",
        subtitle: "Automatic movement with sapphire crystal",
        description:
          "Swiss-inspired automatic chronograph housed in 316L surgical-grade stainless steel with 50m water resistance.",
        unit_cost: 110,
        price: 320,
        srp: 390,
        discount_percentage: 18,
        stock: 14,
        category_id: 4,
        image_1:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        image_2: "",
        image_3: "",
        attributes: { Case: "316L Stainless Steel", Movement: "Automatic" },
        created_at: new Date("2026-01-12").toISOString(),
        updated_at: new Date("2026-01-12").toISOString(),
      },
      {
        id: 4,
        title: "French Linen Tailored Shirt",
        slug: "french-linen-tailored-shirt",
        subtitle: "100% Normandy organic linen",
        description:
          "Naturally breathable, pre-washed for effortless softness. A timeless wardrobe staple for smart-casual wear.",
        unit_cost: 20,
        price: 79,
        srp: 95,
        discount_percentage: 17,
        stock: 50,
        category_id: 1,
        image_1:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80",
        image_2: "",
        image_3: "",
        attributes: { Material: "100% Linen", Fit: "Relaxed Slim" },
        created_at: new Date("2026-01-13").toISOString(),
        updated_at: new Date("2026-01-13").toISOString(),
      },
    ],
    admins: [
      {
        id: "1",
        email: "admin@macrotek.com",
        password_hash: adminHash,
      },
    ],
    users: [
      {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        email: "demo@example.com",
        password_hash: demoHash,
        first_name: "Demo",
        last_name: "Customer",
        phone: "+639123456789",
        birthdate: "1995-05-15",
        address_province: "Metro Manila",
        address_province_code: "133900000",
        address_city: "City of Manila",
        address_city_code: "133901000",
        address_barangay: "Barangay 1",
        address_barangay_code: "133901001",
        address_zip: "1000",
        address_street: "123 Demo St.",
        is_verified: true,
        verification_token: null,
        token_expires_at: null,
      },
    ],
    orders: [
      {
        id: "b1111111-2222-3333-4444-555555555555",
        customer_name: "Demo Customer",
        customer_email: "demo@example.com",
        customer_phone: "+639123456789",
        shipping_address: "123 Demo St., Brgy. Barangay 1, City of Manila, Metro Manila, 1000",
        payment_method: "COD",
        payment_status: "paid",
        paymongo_link_id: null,
        total_amount: 129,
        created_at: new Date("2026-02-01").toISOString(),
        tracking_number: "TRK-DEMO8888",
        fulfillment_status: "delivered",
      },
    ],
    order_items: [
      {
        id: 1,
        order_id: "b1111111-2222-3333-4444-555555555555",
        product_id: 1,
        quantity: 1,
        price_at_purchase: 129,
      },
    ],
    nextCategoryId: 5,
    nextProductId: 5,
  };
}

const store = g.__store_mono_db!;

/**
 * Execute in-memory query mimicking Neon SQL driver
 */
async function executeMockQuery(rawText: string, values: any[]): Promise<any[]> {
  const norm = rawText.replace(/\s+/g, " ").trim();
  const lower = norm.toLowerCase();

  // 1. GLOBAL SETTINGS
  if (lower.startsWith("select * from global_settings")) {
    return [...store.global_settings];
  }
  if (lower.startsWith("insert into global_settings")) {
    const [companyName, themeKey, fontKey, logoUrl] = values;
    store.global_settings[0] = {
      id: 1,
      company_name: companyName,
      theme_key: themeKey,
      font_key: fontKey,
      logo_url: logoUrl,
    };
    return store.global_settings;
  }

  // 2. HERO SETTINGS
  if (lower.startsWith("select * from hero_settings")) {
    return [...store.hero_settings];
  }
  if (lower.startsWith("insert into hero_settings")) {
    const [title, subtitle, layoutStyle, imageUrl, btnPText, btnPTheme, btnSText, btnSTheme] = values;
    store.hero_settings[0] = {
      id: 1,
      title,
      subtitle,
      layout_style: layoutStyle,
      image_url: imageUrl,
      btn_primary_text: btnPText,
      btn_primary_theme: btnPTheme,
      btn_secondary_text: btnSText,
      btn_secondary_theme: btnSTheme,
    };
    return store.hero_settings;
  }

  // 3. CATEGORY SETTINGS
  if (lower.startsWith("select * from category_settings")) {
    return [...store.category_settings];
  }
  if (lower.startsWith("insert into category_settings")) {
    const [title, subtitle, bgValue, textColor, fontKey] = values;
    store.category_settings[0] = {
      ...store.category_settings[0],
      id: 1,
      title,
      subtitle,
      bg_value: bgValue,
      text_color: textColor,
      font_key: fontKey,
    };
    return store.category_settings;
  }

  // 3b. ABOUT SETTINGS
  if (lower.startsWith("select * from about_settings")) {
    return [...store.about_settings];
  }
  if (lower.startsWith("insert into about_settings")) {
    const [
      title, subtitle, aboutContent,
      visionTitle, visionStatement,
      missionTitle, missionStatement,
      bgType, bgColor, bgGradientEnd, bgGradientDirection,
      textColor, fontKey
    ] = values;
    store.about_settings[0] = {
      ...store.about_settings[0],
      id: 1,
      title: title ?? store.about_settings[0]?.title,
      subtitle: subtitle ?? store.about_settings[0]?.subtitle,
      about_content: aboutContent ?? store.about_settings[0]?.about_content,
      vision_title: visionTitle ?? store.about_settings[0]?.vision_title,
      vision_statement: visionStatement ?? store.about_settings[0]?.vision_statement,
      mission_title: missionTitle ?? store.about_settings[0]?.mission_title,
      mission_statement: missionStatement ?? store.about_settings[0]?.mission_statement,
      bg_type: bgType ?? store.about_settings[0]?.bg_type,
      bg_color: bgColor ?? store.about_settings[0]?.bg_color,
      bg_gradient_end: bgGradientEnd ?? store.about_settings[0]?.bg_gradient_end,
      bg_gradient_direction: bgGradientDirection ?? store.about_settings[0]?.bg_gradient_direction,
      text_color: textColor ?? store.about_settings[0]?.text_color,
      font_key: fontKey ?? store.about_settings[0]?.font_key,
      updated_at: new Date().toISOString(),
    };
    return store.about_settings;
  }

  // 4. CATEGORIES
  if (lower.startsWith("select * from categories") || lower.startsWith("select id, name, attribute_template from categories")) {
    let list = [...store.categories];
    if (lower.includes("order by name asc")) {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (lower.includes("order by created_at desc")) {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
    return list;
  }
  if (lower.startsWith("insert into categories")) {
    const [name, slug, mediaUrl] = values;
    const existing = store.categories.find(c => c.slug === slug || c.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      throw new Error("unique constraint: category already exists");
    }
    const newCat = {
      id: store.nextCategoryId++,
      name,
      slug,
      media_url: mediaUrl,
      image_url: mediaUrl,
      attribute_template: "",
      created_at: new Date().toISOString(),
    };
    store.categories.push(newCat);
    return [newCat];
  }
  if (lower.startsWith("delete from categories")) {
    const catId = values[0];
    store.categories = store.categories.filter(c => String(c.id) !== String(catId));
    return [];
  }

  // 5. PRODUCT SETTINGS
  if (lower.startsWith("select * from product_settings") || lower.startsWith("select currency from product_settings")) {
    return [...store.product_settings];
  }
  if (lower.startsWith("insert into product_settings")) {
    const [title, subtitle, currency, bgColor, textColor] = values;
    store.product_settings[0] = {
      id: 1,
      title,
      subtitle,
      currency,
      bg_color: bgColor,
      text_color: textColor,
    };
    return store.product_settings;
  }

  // 6. PRODUCTS
  if (lower.startsWith("select id, price, discount_percentage, stock from products where id =") ||
      lower.startsWith("select * from products where id =")) {
    const prodId = Number(values[0]);
    const found = store.products.find(p => Number(p.id) === prodId);
    return found ? [found] : [];
  }
  if (lower.startsWith("select * from products")) {
    let list = [...store.products].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    if (lower.includes("limit 8")) {
      list = list.slice(0, 8);
    }
    return list;
  }
  if (lower.startsWith("insert into products")) {
    const [title, slug, subtitle, description, unitCost, price, srp, discount, stock, categoryId, img1, img2, img3, attributes] = values;
    const existing = store.products.find(p => p.slug === slug);
    if (existing) {
      throw new Error("products_slug_key: That slug is already in use.");
    }
    let parsedAttrs = attributes;
    if (typeof attributes === "string") {
      try { parsedAttrs = JSON.parse(attributes); } catch {}
    }
    const newProd = {
      id: store.nextProductId++,
      title,
      slug,
      subtitle: subtitle || "",
      description: description || "",
      unit_cost: Number(unitCost || 0),
      price: Number(price || 0),
      srp: Number(srp || 0),
      discount_percentage: Number(discount || 0),
      stock: Number(stock || 0),
      category_id: categoryId ? Number(categoryId) : null,
      image_1: img1 || "",
      image_2: img2 || "",
      image_3: img3 || "",
      attributes: parsedAttrs || {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    store.products.push(newProd);
    return [newProd];
  }
  if (lower.startsWith("update products set")) {
    if (lower.includes("stock = coalesce(stock, 0) -")) {
      const [qty, prodId] = values;
      const prod = store.products.find(p => Number(p.id) === Number(prodId));
      if (prod) prod.stock = Math.max(0, (prod.stock || 0) - Number(qty));
      return [];
    }
    if (lower.includes("stock = stock +")) {
      const [qty, prodId] = values;
      const prod = store.products.find(p => Number(p.id) === Number(prodId));
      if (prod) prod.stock = (prod.stock || 0) + Number(qty);
      return [];
    }
    // Full product update
    const [title, slug, subtitle, description, unitCost, price, srp, discount, stock, categoryId, img1, img2, img3, attributes, prodId] = values;
    const prod = store.products.find(p => Number(p.id) === Number(prodId));
    if (prod) {
      prod.title = title;
      prod.slug = slug;
      prod.subtitle = subtitle || "";
      prod.description = description || "";
      prod.unit_cost = Number(unitCost || 0);
      prod.price = Number(price || 0);
      prod.srp = Number(srp || 0);
      prod.discount_percentage = Number(discount || 0);
      prod.stock = Number(stock || 0);
      prod.category_id = categoryId ? Number(categoryId) : null;
      prod.image_1 = img1 || "";
      prod.image_2 = img2 || "";
      prod.image_3 = img3 || "";
      try { prod.attributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes; } catch {}
      prod.updated_at = new Date().toISOString();
    }
    return [];
  }
  if (lower.startsWith("delete from products")) {
    const prodId = Number(values[0]);
    store.products = store.products.filter(p => Number(p.id) !== prodId);
    return [];
  }

  // 7. AUTOMATION SETTINGS
  if (lower.includes("from automation_settings")) {
    return [...store.automation_settings];
  }
  if (lower.startsWith("insert into automation_settings")) {
    const [webhookUrl, webhookSecret, isActive, paymongoSecret] = values;
    store.automation_settings[0] = {
      id: 1,
      webhook_url: webhookUrl,
      webhook_secret: webhookSecret,
      is_active: Boolean(isActive),
      paymongo_secret_key: paymongoSecret,
      updated_at: new Date().toISOString(),
    };
    return store.automation_settings;
  }

  // 8. ADMINS
  if (lower.startsWith("select id, email, password_hash from admins where email =")) {
    const email = String(values[0]).toLowerCase();
    const admin = store.admins.find(a => a.email.toLowerCase() === email);
    return admin ? [admin] : [];
  }

  // 9. USERS
  if (lower.startsWith("select") && lower.includes("from users where email =")) {
    const email = String(values[0]).toLowerCase();
    const found = store.users.find(u => u.email.toLowerCase() === email);
    return found ? [found] : [];
  }
  if (lower.startsWith("select first_name from users where id =")) {
    const userId = String(values[0]);
    const found = store.users.find(u => String(u.id) === userId);
    return found ? [{ first_name: found.first_name }] : [];
  }
  if (lower.startsWith("select email from users where id =")) {
    const userId = String(values[0]);
    const found = store.users.find(u => String(u.id) === userId);
    return found ? [{ email: found.email }] : [];
  }
  if (lower.startsWith("select id, token_expires_at from users where verification_token =")) {
    const token = String(values[0]);
    const found = store.users.find(u => u.verification_token === token);
    return found ? [found] : [];
  }
  if (lower.startsWith("select") && lower.includes("from users where id =")) {
    const userId = String(values[0]);
    const found = store.users.find(u => String(u.id) === userId);
    return found ? [found] : [];
  }
  if (lower.startsWith("insert into users")) {
    const [
      email, passwordHash, firstName, lastName, birthdate, phone,
      provName, provCode, cityName, cityCode, brgyName, brgyCode,
      zipCode, streetAddress, isVerified, verifyToken, expiresAt
    ] = values;
    const newId = randomUUID();
    const newUser = {
      id: newId,
      email,
      password_hash: passwordHash,
      first_name: firstName,
      last_name: lastName,
      birthdate,
      phone,
      address_province: provName,
      address_province_code: provCode,
      address_city: cityName,
      address_city_code: cityCode,
      address_barangay: brgyName,
      address_barangay_code: brgyCode,
      address_zip: zipCode,
      address_street: streetAddress,
      is_verified: Boolean(isVerified),
      verification_token: verifyToken,
      token_expires_at: expiresAt,
    };
    store.users.push(newUser);
    return [{ id: newId }];
  }
  if (lower.startsWith("update users set is_verified = true")) {
    const userId = String(values[0]);
    const user = store.users.find(u => String(u.id) === userId);
    if (user) {
      user.is_verified = true;
      user.verification_token = null;
      user.token_expires_at = null;
    }
    return [];
  }
  if (lower.startsWith("update users set") && lower.includes("first_name =")) {
    if (values.length >= 12) {
      // Form update
      const [
        firstName, lastName, phone, birthdate,
        provName, provCode, cityName, cityCode, brgyName, brgyCode,
        zipCode, streetAddress, userId
      ] = values;
      const user = store.users.find(u => String(u.id) === String(userId));
      if (user) {
        user.first_name = firstName;
        user.last_name = lastName;
        user.phone = phone;
        user.birthdate = birthdate;
        user.address_province = provName;
        user.address_province_code = provCode;
        user.address_city = cityName;
        user.address_city_code = cityCode;
        user.address_barangay = brgyName;
        user.address_barangay_code = brgyCode;
        user.address_zip = zipCode;
        user.address_street = streetAddress;
      }
    }
    return [];
  }

  // 10. ORDERS
  if (lower.startsWith("insert into orders")) {
    const [name, email, phone, address, method, total, tracking, status] = values;
    const orderId = randomUUID();
    const newOrder = {
      id: orderId,
      customer_name: name,
      customer_email: email,
      customer_phone: phone,
      shipping_address: address,
      payment_method: method,
      payment_status: method === "COD" ? "pending" : "pending",
      paymongo_link_id: null,
      total_amount: Number(total),
      tracking_number: tracking,
      fulfillment_status: status || "processing",
      created_at: new Date().toISOString(),
    };
    store.orders.unshift(newOrder);
    return [{ id: orderId }];
  }
  if (lower.startsWith("insert into order_items")) {
    const [orderId, prodId, quantity, price] = values;
    const newItem = {
      id: store.order_items.length + 1,
      order_id: String(orderId),
      product_id: Number(prodId),
      quantity: Number(quantity),
      price_at_purchase: Number(price),
    };
    store.order_items.push(newItem);
    return [newItem];
  }
  if (lower.startsWith("select") && lower.includes("from orders where customer_email =")) {
    const email = String(values[0]).toLowerCase();
    return store.orders.filter(o => o.customer_email.toLowerCase() === email);
  }
  if (lower.startsWith("select") && lower.includes("from orders o where o.customer_email =")) {
    const email = String(values[0]).toLowerCase();
    return store.orders.filter(o => o.customer_email.toLowerCase() === email);
  }
  if (lower.startsWith("select") && lower.includes("from orders where id =")) {
    const orderId = String(values[0]);
    const found = store.orders.find(o => String(o.id) === orderId);
    return found ? [found] : [];
  }
  if (lower.startsWith("select") && lower.includes("from orders") && lower.includes("order by created_at desc")) {
    return [...store.orders].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
  if (lower.startsWith("update orders set payment_status = 'paid'")) {
    const orderId = String(values[0]);
    const o = store.orders.find(order => String(order.id) === orderId);
    if (o) o.payment_status = "paid";
    return [];
  }
  if (lower.startsWith("update orders set paymongo_link_id =")) {
    const [linkId, orderId] = values;
    const o = store.orders.find(order => String(order.id) === String(orderId));
    if (o) o.paymongo_link_id = linkId;
    return [];
  }
  if (lower.startsWith("update orders set fulfillment_status =")) {
    const [status, orderId] = values;
    const o = store.orders.find(order => String(order.id) === String(orderId));
    if (o) o.fulfillment_status = status;
    return [];
  }
  if (lower.startsWith("select fulfillment_status from orders where id =")) {
    const orderId = String(values[0]);
    const found = store.orders.find(o => String(o.id) === orderId);
    return found ? [{ fulfillment_status: found.fulfillment_status }] : [];
  }

  // 11. ORDER ITEMS
  if (lower.includes("from order_items")) {
    if (lower.includes("where oi.order_id = any(")) {
      const orderIds: string[] = Array.isArray(values[0]) ? values[0] : [String(values[0])];
      const items = store.order_items.filter(it => orderIds.includes(String(it.order_id)));
      return items.map(it => {
        const prod = store.products.find(p => Number(p.id) === Number(it.product_id));
        return {
          id: it.id,
          order_id: it.order_id,
          product_id: it.product_id,
          quantity: it.quantity,
          price_at_purchase: it.price_at_purchase,
          product_title: prod?.title || `Product #${it.product_id}`,
          product_image: prod?.image_1 || null,
        };
      });
    }
    if (lower.includes("where oi.order_id =")) {
      const orderId = String(values[0]);
      const items = store.order_items.filter(it => String(it.order_id) === orderId);
      return items.map(it => {
        const prod = store.products.find(p => Number(p.id) === Number(it.product_id));
        return {
          id: it.id,
          order_id: it.order_id,
          product_id: it.product_id,
          quantity: it.quantity,
          price_at_purchase: it.price_at_purchase,
          title: prod?.title || `Product #${it.product_id}`,
        };
      });
    }
  }

  // Default empty fallback
  return [];
}

/**
 * Drop-in replacement for neon()
 */
export function neon(connectionString?: string, options?: any) {
  return async function sql(strings: TemplateStringsArray, ...values: any[]): Promise<any> {
    // If a valid remote Neon connection string is provided, try connecting
    if (connectionString && connectionString.startsWith("postgres") && !connectionString.includes("mock")) {
      try {
        const { neon: realNeon } = await import("@neondatabase/serverless");
        const realSql = realNeon(connectionString, options);
        return await realSql(strings, ...values);
      } catch (err) {
        console.warn("[Database] Remote Neon query failed, using in-memory mock fallback:", err);
      }
    }

    // Combine template strings to analyze query
    let fullQuery = "";
    for (let i = 0; i < strings.length; i++) {
      fullQuery += strings[i];
      if (i < values.length) {
        fullQuery += `$${i + 1}`;
      }
    }

    return executeMockQuery(fullQuery, values);
  };
}

export default neon;
