import { Collection, Product, Image } from "@/types/product";
import { v4 as uuidv4 } from "uuid";

// Tạo các đối tượng Image
const image1: Image = {
  image_id: uuidv4(),
  image_url:
    "https://theme.hstatic.net/200000690725/1001078549/14/home_category_1_img.jpg?v=666",
  image_name: "home_category_1_img.jpg",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
};

const image2: Image = {
  image_id: uuidv4(),
  image_url:
    "https://theme.hstatic.net/200000690725/1001078549/14/home_category_2_img.jpg?v=666",
  image_name: "home_category_2_img.jpg",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
};

const image3: Image = {
  image_id: uuidv4(),
  image_url:
    "https://theme.hstatic.net/200000690725/1001078549/14/home_category_3_img.jpg?v=666",
  image_name: "home_category_3_img.jpg",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
};

const image4: Image = {
  image_id: uuidv4(),
  image_url:
    "https://theme.hstatic.net/200000690725/1001078549/14/home_category_4_img.jpg?v=666",
  image_name: "home_category_4_img.jpg",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
};

const image5: Image = {
  image_id: uuidv4(),
  image_url:
    "https://theme.hstatic.net/200000690725/1001078549/14/home_category_5_img.jpg?v=666",
  image_name: "home_category_5_img.jpg",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
};

const image6: Image = {
  image_id: uuidv4(),
  image_url:
    "https://theme.hstatic.net/200000690725/1001078549/14/home_category_6_img.jpg?v=666",
  image_name: "home_category_6_img.jpg",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
};

const image7: Image = {
  image_id: uuidv4(),
  image_url:
    "https://theme.hstatic.net/200000690725/1001078549/14/home_category_7_img.jpg?v=666",
  image_name: "home_category_7_img.jpg",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
};

// Tạo các đối tượng Collection và tham chiếu đến các Image
const collection1: Collection = {
  collection_id: uuidv4(),
  name: "Áo Khoác",
  slug: "ao-khoac",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
  image: image1,
};

const collection2: Collection = {
  collection_id: uuidv4(),
  name: "Bộ Nỉ",
  slug: "bo-ni",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
  image: image2,
};

const collection3: Collection = {
  collection_id: uuidv4(),
  name: "Quần Jeans",
  slug: "quan-jeans",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
  image: image3,
};

const collection4: Collection = {
  collection_id: uuidv4(),
  name: "Quần Âu",
  slug: "quan-au",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
  image: image4,
};

const collection5: Collection = {
  collection_id: uuidv4(),
  name: "Quần Kaki",
  slug: "quan-dai-kaki",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
  image: image5,
};

const collection6: Collection = {
  collection_id: uuidv4(),
  name: "Sơ Mi",
  slug: "ao-so-mi",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
  image: image6,
};

const collection7: Collection = {
  collection_id: uuidv4(),
  name: "Áo Polo",
  slug: "ao-polo",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
  image: image7,
};

const collection8: Collection = {
  collection_id: uuidv4(),
  name: "Áo Polo",
  slug: "ao-polo",
  created_at: new Date(),
  published_at: null,
  updated_at: new Date(),
  image: image7,
};

// Xuất các collection để sử dụng ở nơi khác
export const mockCollections: Collection[] = [
  collection1,
  collection2,
  collection3,
  collection4,
  collection5,
  collection6,
  collection7,
];

const product1: Product = {
  product_id: "1046896330",
  product_code: "ESTP068",
  brand_name: "TORANO",
  name: "Áo polo bộ kẻ ESTP068",
  slug: "ao-polo-bo-ke-3-estp068",
  description:
    "<strong>Áo polo bộ kẻ ESTP068 chính hãng Torano</strong> với chất vải cho độ dày dặn, co giãn tốt và quan trọng độ bền màu cao. Giặt ko đổ lông hay bay màu, thấm hút mồ hôi và thoải mái không gò bó khi vận động. Đây là mẫu áo polo nam chất lượng chính hãng mà giá tốt nhất tại Torano.",
  base_price: 420000,
  sale_price: null,
  discount: 0,
  created_at: new Date("2023-05-16T02:04:35+00:00"),
  published_at: new Date("2024-06-11T04:32:29+00:00"),
  updated_at: new Date("2025-03-12T05:01:01+00:00"),
  variants: [
    {
      variant_id: "1105875551",
      variant_code: "ESTP06872CT07SB_BL-S",
      product_id: "1046896330",
      image: {
        image_id: "1392412723",
        image_url:
          "https://product.hstatic.net/200000690725/product/avt_web_1150_x_1475_px__c6c9c7b15bc04effbd7c1b2362a1df1c.png",
        image_name:
          "avt_web_1150_x_1475_px__c6c9c7b15bc04effbd7c1b2362a1df1c.png",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 13,
      color: {
        color_id: "1",
        color_name: "Đen",
        color_code: "#000000",
      },
      size: {
        size_id: "1",
        size_code: "S",
      },
    },
    {
      variant_id: "1105875552",
      variant_code: "ESTP06872CT07SB_BL-M",
      product_id: "1046896330",
      image: {
        image_id: "1413387237",
        image_url:
          "https://product.hstatic.net/200000690725/product/2fd75bd0-45c4-4d47-936d-007cacfb305a_237abf7de76844f9823157366522b37a.jpg",
        image_name:
          "2fd75bd0-45c4-4d47-936d-007cacfb305a_237abf7de76844f9823157366522b37a.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 0,
      color: {
        color_id: "1",
        color_name: "Đen",
        color_code: "#000000",
      },
      size: {
        size_id: "2",
        size_code: "M",
      },
    },
    {
      variant_id: "1105875553",
      variant_code: "ESTP06872CT07SB_BL-L",
      product_id: "1046896330",
      image: {
        image_id: "1331150204",
        image_url:
          "https://product.hstatic.net/200000690725/product/estp068-3_87d15a0742b24ec3a2657294bdbed0a3.jpg",
        image_name: "estp068-3_87d15a0742b24ec3a2657294bdbed0a3.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 1,
      color: {
        color_id: "1",
        color_name: "Đen",
        color_code: "#000000",
      },
      size: {
        size_id: "3",
        size_code: "L",
      },
    },
    {
      variant_id: "1105875554",
      variant_code: "ESTP06872CT07SB_BL-XL",
      product_id: "1046896330",
      image: {
        image_id: "1331150197",
        image_url:
          "https://product.hstatic.net/200000690725/product/53035589513_85d84256f7_k_d36c2d8ceea5498d844aa05ebb555562.jpg",
        image_name:
          "53035589513_85d84256f7_k_d36c2d8ceea5498d844aa05ebb555562.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 0,
      color: {
        color_id: "1",
        color_name: "Đen",
        color_code: "#000000",
      },
      size: {
        size_id: "4",
        size_code: "XL",
      },
    },
    {
      variant_id: "1105875555",
      variant_code: "ESTP06872CT07SB_WH-S",
      product_id: "1046896330",
      image: {
        image_id: "1331150199",
        image_url:
          "https://product.hstatic.net/200000690725/product/53035287324_9a4b8b8146_k_5009ca22fbac40ee9a4459a8c12bbb1a.jpg",
        image_name:
          "53035287324_9a4b8b8146_k_5009ca22fbac40ee9a4459a8c12bbb1a.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 0,
      color: {
        color_id: "2",
        color_name: "Trắng",
        color_code: "#FFFFFF",
      },
      size: {
        size_id: "1",
        size_code: "S",
      },
    },
    {
      variant_id: "1105875556",
      variant_code: "ESTP06872CT07SB_WH-M",
      product_id: "1046896330",
      image: {
        image_id: "1331150200",
        image_url:
          "https://product.hstatic.net/200000690725/product/53034525882_3c354c7ad6_k_53581a47a7ee4701b2f3daafb851145b.jpg",
        image_name:
          "53034525882_3c354c7ad6_k_53581a47a7ee4701b2f3daafb851145b.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: -2,
      color: {
        color_id: "2",
        color_name: "Trắng",
        color_code: "#FFFFFF",
      },
      size: {
        size_id: "2",
        size_code: "M",
      },
    },
    {
      variant_id: "1105875557",
      variant_code: "ESTP06872CT07SB_WH-L",
      product_id: "1046896330",
      image: {
        image_id: "1331150198",
        image_url:
          "https://product.hstatic.net/200000690725/product/53035589163_e590167e90_k_16d3f4c55dfe49cbbd9534b0304e549c.jpg",
        image_name:
          "53035589163_e590167e90_k_16d3f4c55dfe49cbbd9534b0304e549c.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 11,
      color: {
        color_id: "2",
        color_name: "Trắng",
        color_code: "#FFFFFF",
      },
      size: {
        size_id: "3",
        size_code: "L",
      },
    },
    {
      variant_id: "1105875558",
      variant_code: "ESTP06872CT07SB_WH-XL",
      product_id: "1046896330",
      image: {
        image_id: "1331150202",
        image_url:
          "https://product.hstatic.net/200000690725/product/estp068-1_b83a31c159c04b3c8de87880f7b8115e.jpg",
        image_name: "estp068-1_b83a31c159c04b3c8de87880f7b8115e.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: -4,
      color: {
        color_id: "2",
        color_name: "Trắng",
        color_code: "#FFFFFF",
      },
      size: {
        size_id: "4",
        size_code: "XL",
      },
    },
    {
      variant_id: "1105875559",
      variant_code: "ESTP06872CT07SB_NV-S",
      product_id: "1046896330",
      image: {
        image_id: "1331150203",
        image_url:
          "https://product.hstatic.net/200000690725/product/estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
        image_name: "estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 0,
      color: {
        color_id: "3",
        color_name: "Xanh navy",
        color_code: "#003366",
      },
      size: {
        size_id: "1",
        size_code: "S",
      },
    },
    {
      variant_id: "1105875560",
      variant_code: "ESTP06872CT07SB_NV-M",
      product_id: "1046896330",
      image: {
        image_id: "1331150203",
        image_url:
          "https://product.hstatic.net/200000690725/product/estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
        image_name: "estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 0,
      color: {
        color_id: "3",
        color_name: "Xanh navy",
        color_code: "#003366",
      },
      size: {
        size_id: "2",
        size_code: "M",
      },
    },
    {
      variant_id: "1105875561",
      variant_code: "ESTP06872CT07SB_NV-L",
      product_id: "1046896330",
      image: {
        image_id: "1331150203",
        image_url:
          "https://product.hstatic.net/200000690725/product/estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
        image_name: "estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 0,
      color: {
        color_id: "3",
        color_name: "Xanh navy",
        color_code: "#003366",
      },
      size: {
        size_id: "3",
        size_code: "L",
      },
    },
    {
      variant_id: "1105875562",
      variant_code: "ESTP06872CT07SB_NV-XL",
      product_id: "1046896330",
      image: {
        image_id: "1331150203",
        image_url:
          "https://product.hstatic.net/200000690725/product/estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
        image_name: "estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 0,
      color: {
        color_id: "3",
        color_name: "Xanh navy",
        color_code: "#003366",
      },
      size: {
        size_id: "4",
        size_code: "XL",
      },
    },
  ],
  variant_images: [
    {
      image_id: "1392412723",
      image_url:
        "https://product.hstatic.net/200000690725/product/avt_web_1150_x_1475_px__c6c9c7b15bc04effbd7c1b2362a1df1c.png",
      image_name:
        "avt_web_1150_x_1475_px__c6c9c7b15bc04effbd7c1b2362a1df1c.png",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1413387237",
      image_url:
        "https://product.hstatic.net/200000690725/product/2fd75bd0-45c4-4d47-936d-007cacfb305a_237abf7de76844f9823157366522b37a.jpg",
      image_name:
        "2fd75bd0-45c4-4d47-936d-007cacfb305a_237abf7de76844f9823157366522b37a.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1331150204",
      image_url:
        "https://product.hstatic.net/200000690725/product/estp068-3_87d15a0742b24ec3a2657294bdbed0a3.jpg",
      image_name: "estp068-3_87d15a0742b24ec3a2657294bdbed0a3.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1331150197",
      image_url:
        "https://product.hstatic.net/200000690725/product/53035589513_85d84256f7_k_d36c2d8ceea5498d844aa05ebb555562.jpg",
      image_name:
        "53035589513_85d84256f7_k_d36c2d8ceea5498d844aa05ebb555562.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1331150199",
      image_url:
        "https://product.hstatic.net/200000690725/product/53035287324_9a4b8b8146_k_5009ca22fbac40ee9a4459a8c12bbb1a.jpg",
      image_name:
        "53035287324_9a4b8b8146_k_5009ca22fbac40ee9a4459a8c12bbb1a.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1331150200",
      image_url:
        "https://product.hstatic.net/200000690725/product/53034525882_3c354c7ad6_k_53581a47a7ee4701b2f3daafb851145b.jpg",
      image_name:
        "53034525882_3c354c7ad6_k_53581a47a7ee4701b2f3daafb851145b.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1331150198",
      image_url:
        "https://product.hstatic.net/200000690725/product/53035589163_e590167e90_k_16d3f4c55dfe49cbbd9534b0304e549c.jpg",
      image_name:
        "53035589163_e590167e90_k_16d3f4c55dfe49cbbd9534b0304e549c.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1331150202",
      image_url:
        "https://product.hstatic.net/200000690725/product/estp068-1_b83a31c159c04b3c8de87880f7b8115e.jpg",
      image_name: "estp068-1_b83a31c159c04b3c8de87880f7b8115e.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1331150203",
      image_url:
        "https://product.hstatic.net/200000690725/product/estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
      image_name: "estp068-2_113f3c5c45f94140ae718ab0cc4de385.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
  ],
};
const product2: Product = {
  product_id: "1058146827",
  product_code: "FWCP002",
  brand_name: "TORANO",
  name: "Áo khoác 3 lớp lót bông mũ liền FWCP002",
  slug: "ao-khoac-3-lop-lot-bong-mu-lien-1-fwcp002",
  description:
    "<p>Miền Bắc chuyển rét, anh em đã tự tin đón gió Đông với phao 3 lớp vừa ấm áp, vừa trẻ trung và nổi bật từ TORANO chưa? Thiết kế phóng khoáng với bề mặt chống nước cải tiến gấp 2 lần và chần bông 3 lớp giữ nhiệt sẽ khiến anh em không thể bỏ lỡ.</p>",
  base_price: 890000,
  sale_price: null,
  discount: 0,
  created_at: new Date("2024-11-12T02:39:19+00:00"),
  published_at: new Date("2024-12-12T07:41:07+00:00"),
  updated_at: new Date("2025-03-10T02:06:27+00:00"),
  variants: [
    {
      variant_id: "1133788663",
      variant_code: "FWCP00251PE00SB_BL-S",
      product_id: "1058146827",
      image: {
        image_id: "1435806630",
        image_url:
          "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__4__e49471684820460aa3d394f3ec746620.png",
        image_name:
          "thiet_ke_chua_co_ten__4__e49471684820460aa3d394f3ec746620.png",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 1,
      color: {
        color_id: "1",
        color_name: "Đen",
        color_code: "#000000",
      },
      size: {
        size_id: "1",
        size_code: "S",
      },
    },
    {
      variant_id: "1133788664",
      variant_code: "FWCP00251PE00SB_BL-M",
      product_id: "1058146827",
      image: {
        image_id: "1443354958",
        image_url:
          "https://product.hstatic.net/200000690725/product/54162259557_8f61bc9dd6_k_48168584609049d7a2fd6f5471373893.jpg",
        image_name:
          "54162259557_8f61bc9dd6_k_48168584609049d7a2fd6f5471373893.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 0,
      color: {
        color_id: "1",
        color_name: "Đen",
        color_code: "#000000",
      },
      size: {
        size_id: "2",
        size_code: "M",
      },
    },
    {
      variant_id: "1133788665",
      variant_code: "FWCP00251PE00SB_BL-L",
      product_id: "1058146827",
      image: {
        image_id: "1435806594",
        image_url:
          "https://product.hstatic.net/200000690725/product/fwcp002-10_54158422421_o_3276aedf897047bab15c1f9f8c6ea412.jpg",
        image_name:
          "fwcp002-10_54158422421_o_3276aedf897047bab15c1f9f8c6ea412.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 5,
      color: {
        color_id: "1",
        color_name: "Đen",
        color_code: "#000000",
      },
      size: {
        size_id: "3",
        size_code: "L",
      },
    },
    {
      variant_id: "1133788666",
      variant_code: "FWCP00251PE00SB_BL-XL",
      product_id: "1058146827",
      image: {
        image_id: "1435806591",
        image_url:
          "https://product.hstatic.net/200000690725/product/fwcp002-2_54158877000_o_b8d80302846b4412b598338eed65131e.jpg",
        image_name:
          "fwcp002-2_54158877000_o_b8d80302846b4412b598338eed65131e.jpg",
        created_at: new Date(),
        published_at: null,
        updated_at: new Date(),
      },
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
      quantity: 5,
      color: {
        color_id: "1",
        color_name: "Đen",
        color_code: "#000000",
      },
      size: {
        size_id: "4",
        size_code: "XL",
      },
    },
  ],
  variant_images: [
    {
      image_id: "1435806630",
      image_url:
        "https://product.hstatic.net/200000690725/product/thiet_ke_chua_co_ten__4__e49471684820460aa3d394f3ec746620.png",
      image_name:
        "thiet_ke_chua_co_ten__4__e49471684820460aa3d394f3ec746620.png",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1443354958",
      image_url:
        "https://product.hstatic.net/200000690725/product/54162259557_8f61bc9dd6_k_48168584609049d7a2fd6f5471373893.jpg",
      image_name:
        "54162259557_8f61bc9dd6_k_48168584609049d7a2fd6f5471373893.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1435806594",
      image_url:
        "https://product.hstatic.net/200000690725/product/fwcp002-10_54158422421_o_3276aedf897047bab15c1f9f8c6ea412.jpg",
      image_name:
        "fwcp002-10_54158422421_o_3276aedf897047bab15c1f9f8c6ea412.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1435806595",
      image_url:
        "https://product.hstatic.net/200000690725/product/fwcp002-1_54158422491_o_0d9e5a01508a4068888914eea56a8e63.jpg",
      image_name:
        "fwcp002-1_54158422491_o_0d9e5a01508a4068888914eea56a8e63.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1435806591",
      image_url:
        "https://product.hstatic.net/200000690725/product/fwcp002-2_54158877000_o_b8d80302846b4412b598338eed65131e.jpg",
      image_name:
        "fwcp002-2_54158877000_o_b8d80302846b4412b598338eed65131e.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1435806588",
      image_url:
        "https://product.hstatic.net/200000690725/product/fwcp002-4_54158876980_o_7304fb2ff4a6473b953cd9c51ee13b13.jpg",
      image_name:
        "fwcp002-4_54158876980_o_7304fb2ff4a6473b953cd9c51ee13b13.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1435806601",
      image_url:
        "https://product.hstatic.net/200000690725/product/fwcp002-6_54158876965_o_df9660341c25435abfb98d7a1a378e5a.jpg",
      image_name:
        "fwcp002-6_54158876965_o_df9660341c25435abfb98d7a1a378e5a.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1435806592",
      image_url:
        "https://product.hstatic.net/200000690725/product/fwcp002-7_54158736554_o_9289169bd12a442e84c564d993c71cf7.jpg",
      image_name:
        "fwcp002-7_54158736554_o_9289169bd12a442e84c564d993c71cf7.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1435806597",
      image_url:
        "https://product.hstatic.net/200000690725/product/fwcp002-9_54158422441_o_5a8847953dc24a29b83187cee5e78ed6.jpg",
      image_name:
        "fwcp002-9_54158422441_o_5a8847953dc24a29b83187cee5e78ed6.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
    {
      image_id: "1435806593",
      image_url:
        "https://product.hstatic.net/200000690725/product/fwcp002-11_54158701578_o_4714ed96db704e659c74fdd1d2568e6d.jpg",
      image_name:
        "fwcp002-11_54158701578_o_4714ed96db704e659c74fdd1d2568e6d.jpg",
      created_at: new Date(),
      published_at: null,
      updated_at: new Date(),
    },
  ],
};

export const mockProducts = [product1, product2];
