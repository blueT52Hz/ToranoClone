import { getAllOutfits } from "@/services/admin/outfit";
import { Outfit } from "@/types/product.type";
import { useEffect, useState } from "react";

const OutFit = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  useEffect(() => {
    const get = async () => {
      const result = await getAllOutfits();
      setOutfits(result);
    };
    get();
  }, []);
  return (
    <section className="outfit-page">
      <div className="container my-4 min-w-full px-12">
        <div className="flex w-full flex-col">
          <div className="my-4 text-2xl font-bold uppercase">
            Bộ sưu tập outfit
          </div>
          <div className="grid grid-cols-3 gap-8 rounded-md bg-red-50 p-8">
            {outfits.map((item, index) => {
              return (
                <div className="flex flex-col gap-4" key={index}>
                  <img
                    src={item.image.image_url}
                    alt={item.image.image_name}
                  ></img>
                  <div className="text-lg">{item.outfit_name}</div>
                  <div className="flex items-center justify-start">
                    <div className="cursor-pointer rounded-md border-2 border-slate-400 bg-white px-7 py-3 text-sm transition-all duration-500 hover:bg-shop-color-hover hover:text-[#fff]">
                      MUA FULLSET
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutFit;
