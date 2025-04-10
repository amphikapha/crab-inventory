"use server";
import { Product } from "@/types/product";
import { config } from "@/app/config";

export async function getProducts(): Promise<Product[]> {
  try {
    // ใช้ URL ที่ได้จากการเผยแพร่ CSV
    // ตัวอย่าง URL: https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv
    const res = await fetch(`${config.ggSheetURL}`, {
      method: "GET",
      cache: "no-store", // ป้องกันการเก็บ cache
    });

    if (!res.ok) {
      const errorData = await res.text();
      console.error("Server Error:", errorData);
      throw new Error(`Failed to fetch product data: ${errorData}`);
    }

    const csvData = await res.text();
    const products = parseCsvToProducts(csvData);

    return products;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw new Error(`Failed to fetch product data: ${error}`);
  }
}

// ฟังก์ชันแปลง CSV เป็น Array ของ Product
function parseCsvToProducts(csvData: string): Product[] {
  const lines = csvData.split("\n");

  // หา header (บรรทัดแรก)
  const headers = lines[0].split(",").map((h) => h.trim());

  // แปลงแต่ละบรรทัดเป็น Product
  return lines
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => {
      const values = line.split(",");

      // สร้าง object จาก header และ values
      const product: any = {};
      headers.forEach((header, index) => {
        product[header] = values[index]?.trim();
      });

      // แปลงค่า number ให้ถูกต้อง
      return {
        id: product.id,
        name: product.name,
        price: Number(product.price) || 0,
        quantity: Number(product.quantity) || 0,
        description: product.description,
        category: product.category,
      } as Product;
    });
}

// ตัวอย่าง config ที่ควรมี
// config.ggSheetURL = "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv"
