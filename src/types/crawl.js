// Hàm chuyển đổi JSON sang đối tượng Product
function parseProduct(json) {
  const product = {
    product_id: json.id.toString(),
    product_code: json.handle,
    brand_name: json.vendor,
    name: json.title,
    slug: json.handle,
    description: json.body_html,
    base_price: parseFloat(json.variants[0].price),
    sale_price: null, // Giả sử không có giá sale
    discount: 0, // Giả sử không có discount
    created_at: new Date(json.created_at),
    published_at: json.published_at ? new Date(json.published_at) : null,
    updated_at: new Date(json.updated_at),
    collections: [], // Giả sử không có collections
    outfit: [], // Giả sử không có outfit
    variants: json.variants.map((variant) => parseProductVariant(variant)),
    variant_images: json.images.map((image) => parseImage(image)),
  };

  return product;
}

// Hàm chuyển đổi JSON sang đối tượng ProductVariant
function parseProductVariant(json) {
  const variant = {
    variant_id: json.id.toString(),
    variant_code: json.sku,
    product_id: json.product_id.toString(),
    image: parseImage(json.image),
    created_at: new Date(json.created_at),
    published_at: json.published_at ? new Date(json.published_at) : null,
    updated_at: new Date(json.updated_at),
    quantity: json.inventory_quantity,
    color: {
      color_id: json.option1,
      color_name: json.option1,
      color_code: json.option1,
    },
    size: {
      size_id: json.option2,
      size_code: json.option2,
    },
  };

  return variant;
}

// Hàm chuyển đổi JSON sang đối tượng Image
function parseImage(json) {  
  const image = {
    image_id: json.id,
    image_url: json?.src,
    image_name: json?.alt || "",
    created_at: new Date(json?.created_at),
    published_at: json.published_at ? new Date(json.published_at) : null,
    updated_at: new Date(json.updated_at),
  };

  return image;
}

// Hàm chuyển đổi JSON sang đối tượng Outfit
function parseOutfit(json) {
  const outfit = {
    outfit_id: json.id.toString(),
    outfit_name: json.title,
    image: parseImage(json.image),
    created_at: new Date(json.created_at),
    published_at: json.published_at ? new Date(json.published_at) : null,
    updated_at: new Date(json.updated_at),
    variants: [], // Giả sử không có variants
  };

  return outfit;
}

// Hàm chuyển đổi JSON sang đối tượng Collection
function parseCollection(json) {
  const collection = {
    collection_id: json.id.toString(),
    name: json.title,
    slug: json.handle,
    created_at: new Date(json.created_at),
    published_at: json.published_at ? new Date(json.published_at) : null,
    updated_at: new Date(json.updated_at),
    image: parseImage(json.image),
  };

  return collection;
}

// Hàm xử lý mảng JSON và gộp thành các mảng theo interface
function processJsonArray(jsonArray) {
  const products = [];
  const variants = [];
  const images = [];
  const outfits = [];
  const collections = [];

  jsonArray.forEach((json, index) => {    
    console.log(json.images);
    
    // Parse và thêm vào mảng products
    const product = parseProduct(json);
    products.push(product);

    // Parse và thêm vào mảng variants
    json.variants.forEach((variantJson) => {
      const variant = parseProductVariant(variantJson);
      variants.push(variant);
    });

    // Parse và thêm vào mảng images
    json.images.forEach((imageJson) => {          
        
      const image = parseImage(imageJson);
      images.push(image);
    });

    // Parse và thêm vào mảng outfits (nếu có)
    if (json.outfits) {
      json.outfits.forEach((outfitJson) => {
        const outfit = parseOutfit(outfitJson);
        outfits.push(outfit);
      });
    }

    // Parse và thêm vào mảng collections (nếu có)
    if (json.collections) {
      json.collections.forEach((collectionJson) => {
        const collection = parseCollection(collectionJson);
        collections.push(collection);
      });
    }
  });

  return {
    products,
    variants,
    images,
    outfits,
    collections,
  };
}

// Ví dụ sử dụng
const jsonArray = [{
  "body_html": "<p>Miền Bắc chuyển rét, anh em đã tự tin đón gió Đông với phao béo vừa ấm áp, vừa trẻ trung và nổi bật từ TORANO chưa? Thiết kế phóng khoáng với bề mặt chống nước cải tiến gấp 2 lần và chần bông 3 lớp giữ nhiệt sẽ khiến anh em không thể bỏ lỡ.</p><p style=\"text-align: center\"><img src=\"//file.hstatic.net/200000690725/file/470237452_993294479510800_2018067950392880246_n_grande.jpg\"></p><strong>Áo khoác Puffer cổ cao FWCF005</strong><br>▪️ Được thiết kế theo đúng form chuẩn của nam giới Việt Nam<p>▪️ Sản phẩm thuộc dòng Áo khoác 3 lớp&nbsp;chần&nbsp;bông cao cấp do TORANO sản xuất</p><p style=\"text-align: center\"><img src=\"//file.hstatic.net/200000690725/file/470213051_993289769511271_9196994905276710635_n_grande.jpg\"></p><p style=\"text-align: center\"><img src=\"//file.hstatic.net/200000690725/file/470235274_993289792844602_2217258900085943542_n_grande.jpg\"></p><p><strong>Đặc tính:</strong></p><p>▪️ Thiết kế chần bông 3 lớp nhẹ hơn, ấm hơn</p><p>▪️ Kiểu dáng phao béo phóng khoáng, trẻ trung</p><p>▪️&nbsp;Chống nước bền bỉ x2 nhờ công nghệ Hyper-tex cải tiến</p><p style=\"text-align: center\"><img src=\"//file.hstatic.net/200000690725/file/470210540_993289772844604_2698055481786318647_n_grande.jpg\"></p><p style=\"text-align: center;\"><img src=\"//file.hstatic.net/200000690725/file/92657dfd1f6e44b29d4a84fdc5bdc2bd_tplv-o3syd03w52-resize-jpeg_800_800_943239088c9942f2963651549ff02ff6_grande.jpeg\"></p><p>📌 HƯỚNG DẪN SỬ DỤNG<br>▪️ Giặt máy chế độ nhẹ ở điều kiện thường<br>▪️ Là ủi không quá 110 độ C<br>▪️ Không ngâm lâu với bột giặt các sản phẩm có tính tẩy rửa<br>▪️ Khi giặt nên lộn mặt trái ra để đảm bảo độ bền của lớp kháng nước Hyper Tex<br>▪️ Không giặt chung với vật sắc nhọn<br><br>📌 CHÍNH SÁCH ĐỔI:<br>▪️ Torano hỗ trợ đổi hàng trong trường hợp: sản phẩm nhầm size, nhầm màu; sản phẩm có lỗi của nhà sản xuất.<br>▪️ Sản phẩm đổi phải đạt điều kiện:<br>- Còn nguyên tem mác<br>- Chưa qua sử dụng, giặt tẩy<br>- Không có vết bẩn, rách<br>▪️ Thời gian đổi trả: trong vòng 30 NGÀY kể từ ngày khách nhận hàng</p>",
  "created_at": "2024-11-12T02:39:19+00:00",
  "handle": "ao-khoac-phao-3-lop-lot-bong-co-cao-4-fwcf005",
  "id": 1058146826,
  "product_type": "Áo phao lót bông",
  "published_at": "2024-12-17T08:09:25+00:00",
  "published_scope": "global",
  "template_suffix": null,
  "title": "Áo khoác phao 3 lớp lót bông cổ cao FWCF005",
  "updated_at": "2025-03-12T14:06:44+00:00",
  "vendor": "TORANO",
  "not_allow_promotion": false,
  "available": true,
  "tags": "Áo phao lót bông,size_aokhoac",
  "sole_quantity": 27,
  "images": [
      {
          "created_at": null,
          "id": 1437107742,
          "position": 1,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__4__10510425b8b24d01bbde2597d2916edd.png",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437689538,
          "position": 2,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/54208112070_5aa914a201_k_255307f926ee4861be30ad78ac418eb8.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437108091,
          "position": 3,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/fwcf005-9_54199591699_o_683b35167070469eb204aed2f7915b9f.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437108085,
          "position": 4,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/fwcf005-2_54199339076_o_83e63d49ada147be956293569e0b2004.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437108086,
          "position": 5,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/fwcf005-3_54199339071_o_61098a318dfe4e77b835d66f985b670f.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437108084,
          "position": 6,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/fwcf005-1_54199767585_o_aed97086d87643df9eb072397f80bd05.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437108088,
          "position": 7,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/fwcf005-4_54199591754_o_0c508bf279d74df596c71bf93a6731ac.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437108092,
          "position": 8,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/fwcf005-5_54199591769_o_78a90ab1e4ae42a2bcb716db7bbb5e2c.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437108089,
          "position": 9,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/fwcf005-6_54199339081_o_c2fc5f1f68b64d0e8db406c409393fef.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1437108094,
          "position": 10,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/fwcf005-7_54199577738_o_563055a1c351458cbe8f99988d5307e6.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1443323754,
          "position": 11,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/54253775350_11d3f14223_c_45d6f1bf2cd04b6bb9dac45c4d7f9d08.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1443323752,
          "position": 12,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/54252454497_be0b5e8ddc_c_7adef18e8463448db7cc83cc6dd2b66d.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1443323753,
          "position": 13,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/54253774465_ac4906c204_c_0db28bdab8e44de9aae8b5fe13474b4c.jpg",
          "alt": null,
          "variant_ids": []
      },
      {
          "created_at": null,
          "id": 1443323755,
          "position": 14,
          "product_id": 1058146826,
          "updated_at": null,
          "src": "https://product.hstatic.net/200000690725/product/54253352056_e83b2b5540_c_ea94ab74e92d44f0bd08c07af8ee964d.jpg",
          "alt": null,
          "variant_ids": []
      }
  ],
  "image": {
      "created_at": null,
      "id": 1437107742,
      "position": 1,
      "product_id": 1058146826,
      "updated_at": null,
      "src": "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__4__10510425b8b24d01bbde2597d2916edd.png",
      "alt": null,
      "variant_ids": []
  },
  "options": [
      {
          "name": "Màu sắc",
          "position": 1,
          "product_id": 1058146826,
          "values": [
              "Dark  Navy",
              "Xanh rêu",
              "Đen",
              "Be"
          ]
      },
      {
          "name": "Kích thước",
          "position": 2,
          "product_id": 1058146826,
          "values": [
              "S",
              "M",
              "L",
              "XL"
          ]
      }
  ],
  "variants": [
      {
          "barcode": "2000214311198",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788647,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Dark  Navy",
          "option2": "S",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_DNV-S",
          "taxable": false,
          "title": "Dark  Navy / S",
          "updated_at": null,
          "inventory_quantity": 3,
          "old_inventory_quantity": 3,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311181",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788648,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Dark  Navy",
          "option2": "M",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_DNV-M",
          "taxable": false,
          "title": "Dark  Navy / M",
          "updated_at": null,
          "inventory_quantity": 2,
          "old_inventory_quantity": 2,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311174",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788649,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Dark  Navy",
          "option2": "L",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_DNV-L",
          "taxable": false,
          "title": "Dark  Navy / L",
          "updated_at": null,
          "inventory_quantity": 5,
          "old_inventory_quantity": 5,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311167",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788650,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Dark  Navy",
          "option2": "XL",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_DNV-XL",
          "taxable": false,
          "title": "Dark  Navy / XL",
          "updated_at": null,
          "inventory_quantity": 3,
          "old_inventory_quantity": 3,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311150",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788651,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Xanh rêu",
          "option2": "S",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_MS-S",
          "taxable": false,
          "title": "Xanh rêu / S",
          "updated_at": null,
          "inventory_quantity": 3,
          "old_inventory_quantity": 3,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311143",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788652,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Xanh rêu",
          "option2": "M",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_MS-M",
          "taxable": false,
          "title": "Xanh rêu / M",
          "updated_at": null,
          "inventory_quantity": 4,
          "old_inventory_quantity": 4,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311136",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788653,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Xanh rêu",
          "option2": "L",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_MS-L",
          "taxable": false,
          "title": "Xanh rêu / L",
          "updated_at": null,
          "inventory_quantity": 5,
          "old_inventory_quantity": 5,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311129",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788654,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Xanh rêu",
          "option2": "XL",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_MS-XL",
          "taxable": false,
          "title": "Xanh rêu / XL",
          "updated_at": null,
          "inventory_quantity": 4,
          "old_inventory_quantity": 4,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311112",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788655,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Đen",
          "option2": "S",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_BL-S",
          "taxable": false,
          "title": "Đen / S",
          "updated_at": null,
          "inventory_quantity": 1,
          "old_inventory_quantity": 1,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311105",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788656,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Đen",
          "option2": "M",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_BL-M",
          "taxable": false,
          "title": "Đen / M",
          "updated_at": null,
          "inventory_quantity": -1,
          "old_inventory_quantity": -1,
          "image_id": null,
          "weight": 100,
          "available": false,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311099",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788657,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Đen",
          "option2": "L",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_BL-L",
          "taxable": false,
          "title": "Đen / L",
          "updated_at": null,
          "inventory_quantity": -1,
          "old_inventory_quantity": -1,
          "image_id": null,
          "weight": 100,
          "available": false,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311082",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788658,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Đen",
          "option2": "XL",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_BL-XL",
          "taxable": false,
          "title": "Đen / XL",
          "updated_at": null,
          "inventory_quantity": 0,
          "old_inventory_quantity": 0,
          "image_id": null,
          "weight": 100,
          "available": false,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311075",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788659,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Be",
          "option2": "S",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_BE-S",
          "taxable": false,
          "title": "Be / S",
          "updated_at": null,
          "inventory_quantity": 1,
          "old_inventory_quantity": 1,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311068",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788660,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Be",
          "option2": "M",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_BE-M",
          "taxable": false,
          "title": "Be / M",
          "updated_at": null,
          "inventory_quantity": 1,
          "old_inventory_quantity": 1,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311051",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788661,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Be",
          "option2": "L",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_BE-L",
          "taxable": false,
          "title": "Be / L",
          "updated_at": null,
          "inventory_quantity": 7,
          "old_inventory_quantity": 7,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      },
      {
          "barcode": "2000214311044",
          "compare_at_price": "0",
          "fulfillment_service": "manual",
          "grams": 100,
          "id": 1133788662,
          "inventory_management": "haravan",
          "inventory_policy": "deny",
          "option1": "Be",
          "option2": "XL",
          "option3": "",
          "position": 0,
          "price": "990000",
          "product_id": 0,
          "requires_shipping": true,
          "sku": "FWCF00531PE00MB_BE-XL",
          "taxable": false,
          "title": "Be / XL",
          "updated_at": null,
          "inventory_quantity": 5,
          "old_inventory_quantity": 5,
          "image_id": null,
          "weight": 100,
          "available": true,
          "weight_unit": "gram"
      }
  ]
}]; // Thêm dữ liệu JSON của bạn vào đây

const result = processJsonArray(jsonArray);
console.log(result.products); // Mảng các sản phẩm
console.log(result.variants); // Mảng các biến thể
console.log(result.images); // Mảng các hình ảnh
console.log(result.outfits); // Mảng các outfit
console.log(result.collections); // Mảng các bộ sưu tập