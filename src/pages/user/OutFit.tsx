import { mockOutfits } from "@/types/product";

const OutFit = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <section className="outfit-page">
      <div className="container min-w-full px-12 my-4">
        <div className="flex flex-col w-full">
          <div className="uppercase text-2xl font-bold my-4">
            Bộ sưu tập outfit
          </div>
          <div className="grid grid-cols-3 gap-8 bg-red-50 p-8 rounded-md">
            {mockOutfits.map((item, index) => {
              return (
                <div className="flex flex-col gap-4" key={index}>
                  <img src={item.image_url}></img>
                  <div className="text-lg">{item.outfit_name}</div>
                  <div className="flex justify-start items-center">
                    <div className="text-sm px-7 py-3 border-2 rounded-md bg-white cursor-pointer border-slate-400 hover:bg-shop-color-hover hover:text-[#fff] transition-all duration-500">
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
