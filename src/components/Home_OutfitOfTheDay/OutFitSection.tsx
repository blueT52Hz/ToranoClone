import { ArrowRight } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

interface OutfitItem {
  name: string;
  slug: string;
  img_url: string;
}

const outfitItems: OutfitItem[] = [
  {
    name: "OUTFIT TRẺ TRUNG",
    slug: "",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_set_combo_1_img.jpg?v=666",
  },
  {
    name: "OUTFIT TRƯỞNG THÀNH",
    slug: "",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_set_combo_2_img.jpg?v=666",
  },
  {
    name: "OUTFIT ĐI CHƠI",
    slug: "",
    img_url:
      "https://theme.hstatic.net/200000690725/1001078549/14/home_set_combo_3_img.jpg?v=666",
  },
];

const OutFitSection = () => {
  return (
    <section className="outfit-of-the-day">
      <div className="container px-12 py-8 min-w-full flex flex-col bg-red-50 gap-8">
        <div className="header-outfit">
          <Link
            to={`/collections/`}
            className="hover:text-shop-color-hover text-xl sm:text-4xl font-bold"
            style={{ transition: "all .3s easeInOut" }}
          >
            <h2>OUTFIT OF THE DAY</h2>
          </Link>
        </div>
        <div className="outfit-content flex flex-col justify-center items-center gap-8">
          <div className="grid grid-cols-3 gap-8">
            {outfitItems.map((item, _i) => {
              return (
                <div className="flex flex-col gap-4">
                  <img src={item.img_url}></img>
                  <div className="text-lg">{item.name}</div>
                  <div className="flex justify-start items-center">
                    <div className="text-sm px-7 py-3 border-2 rounded-md bg-white cursor-pointer border-slate-400 hover:bg-shop-color-hover hover:text-[#fff] transition-all duration-500">
                      MUA FULLSET
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xl min-w-[400px] group px-7 py-3 border-2 rounded-md flex justify-center items-center gap-4 bg-white cursor-pointer border-slate-400 hover:bg-shop-color-hover hover:text-[#fff] transition-all duration-500">
            <span>XEM THÊM</span>
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutFitSection;
