import { cn } from "@/utils/cn";
import { Divider, Flex } from "antd";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";

const Fashion = () => {
  const [mobileWidth, setMobileWidth] = useState(window.innerWidth < 850);
  useEffect(() => {
    setMobileWidth(window.innerWidth < 850);
    setOpen(!mobileWidth);
  }, [window.innerWidth]);
  const [open, setOpen] = useState(!mobileWidth);
  const imgageUrls = [
    "https://theme.hstatic.net/200000690725/1001078549/14/payment_1_img.png?v=647",
    "https://theme.hstatic.net/200000690725/1001078549/14/payment_2_img.png?v=647",
    "https://theme.hstatic.net/200000690725/1001078549/14/payment_3_img.png?v=647",
    "https://theme.hstatic.net/200000690725/1001078549/14/payment_4_img.png?v=647",
    "https://theme.hstatic.net/200000690725/1001078549/14/payment_5_img.png?v=647",
    "https://theme.hstatic.net/200000690725/1001078549/14/payment_6_img.png?v=647",
  ];
  return (
    <Flex
      className="w-full px-3 min850:w-1/4 min-[850px]:pt-[75px] min-[850px]:pr-[15px] min-[850px]:pb-[52px] min-[850px]:pl-[35px] min850:border-r min850:border-b min850:border-[#dedede]"
      vertical
    >
      {mobileWidth && <Divider className="m-0"></Divider>}
      <Flex
        justify="space-between"
        className="w-full py-3 cursor-pointer"
        onClick={() => {
          if (mobileWidth) setOpen(!open);
        }}
      >
        <h2
          className={cn(
            "text-base text-[#d60000]",
            (open || !mobileWidth) && "font-bold"
          )}
        >
          Thời trang nam TORANO
        </h2>
        <ChevronDown
          size={"1.2rem"}
          className={cn(
            "text-[#d60000] transition-transform duration-1000 block min850:hidden",
            open && "-rotate-180"
          )}
        ></ChevronDown>
      </Flex>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <Flex vertical className="pt-3 pb-5">
              <p className="mb-4 text-sm">
                Hệ thống thời trang cho phái mạnh hàng đầu Việt Nam, hướng tới
                phong cách nam tính, lịch lãm và trẻ trung.
              </p>
              <Flex className="mt-3" gap={"0.5rem"}>
                <div className="border border-black p-1 rounded-md">
                  <a
                    href="https://www.facebook.com/Torano.vn"
                    target="_blank"
                    rel="noopener"
                    title="Facebook"
                    aria-label="Facebook"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 155.139 155.139"
                    >
                      <g>
                        <g>
                          <path d="M89.584,155.139V84.378h23.742l3.562-27.585H89.584V39.184 c0-7.984,2.208-13.425,13.67-13.425l14.595-0.006V1.08C115.325,0.752,106.661,0,96.577,0C75.52,0,61.104,12.853,61.104,36.452 v20.341H37.29v27.585h23.814v70.761H89.584z"></path>
                        </g>
                      </g>
                    </svg>
                  </a>
                </div>
                <div className="border border-black p-1 rounded-md">
                  <a
                    href="/"
                    target="_blank"
                    rel="noopener"
                    title="Twitter"
                    aria-label="Twitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 512 512"
                    >
                      <g>
                        <g>
                          <g>
                            <path d="M512,97.248c-19.04,8.352-39.328,13.888-60.48,16.576c21.76-12.992,38.368-33.408,46.176-58.016 c-20.288,12.096-42.688,20.64-66.56,25.408C411.872,60.704,384.416,48,354.464,48c-58.112,0-104.896,47.168-104.896,104.992	c0,8.32,0.704,16.32,2.432,23.936c-87.264-4.256-164.48-46.08-216.352-109.792c-9.056,15.712-14.368,33.696-14.368,53.056 c0,36.352,18.72,68.576,46.624,87.232c-16.864-0.32-33.408-5.216-47.424-12.928c0,0.32,0,0.736,0,1.152	c0,51.008,36.384,93.376,84.096,103.136c-8.544,2.336-17.856,3.456-27.52,3.456c-6.72,0-13.504-0.384-19.872-1.792 c13.6,41.568,52.192,72.128,98.08,73.12c-35.712,27.936-81.056,44.768-130.144,44.768c-8.608,0-16.864-0.384-25.12-1.44 C46.496,446.88,101.6,464,161.024,464c193.152,0,298.752-160,298.752-298.688c0-4.64-0.16-9.12-0.384-13.568	C480.224,136.96,497.728,118.496,512,97.248z"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </a>
                </div>
                <div className="border border-black p-1 rounded-md">
                  <a
                    href="https://www.instagram.com/torano.vn/"
                    target="_blank"
                    rel="noopener"
                    title="Instagram"
                    aria-label="Instagram"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 512.00096 512.00096"
                    >
                      <g>
                        <path d="m373.40625 0h-234.8125c-76.421875 0-138.59375 62.171875-138.59375 138.59375v234.816406c0 76.417969 62.171875 138.589844 138.59375 138.589844h234.816406c76.417969 0 138.589844-62.171875 138.589844-138.589844v-234.816406c0-76.421875-62.171875-138.59375-138.59375-138.59375zm108.578125 373.410156c0 59.867188-48.707031 108.574219-108.578125 108.574219h-234.8125c-59.871094 0-108.578125-48.707031-108.578125-108.574219v-234.816406c0-59.871094 48.707031-108.578125 108.578125-108.578125h234.816406c59.867188 0 108.574219 48.707031 108.574219 108.578125zm0 0"></path>
                        <path d="m256 116.003906c-77.195312 0-139.996094 62.800782-139.996094 139.996094s62.800782 139.996094 139.996094 139.996094 139.996094-62.800782 139.996094-139.996094-62.800782-139.996094-139.996094-139.996094zm0 249.976563c-60.640625 0-109.980469-49.335938-109.980469-109.980469 0-60.640625 49.339844-109.980469 109.980469-109.980469 60.644531 0 109.980469 49.339844 109.980469 109.980469 0 60.644531-49.335938 109.980469-109.980469 109.980469zm0 0"></path>
                        <path d="m399.34375 66.285156c-22.8125 0-41.367188 18.558594-41.367188 41.367188 0 22.8125 18.554688 41.371094 41.367188 41.371094s41.371094-18.558594 41.371094-41.371094-18.558594-41.367188-41.371094-41.367188zm0 52.71875c-6.257812 0-11.351562-5.09375-11.351562-11.351562 0-6.261719 5.09375-11.351563 11.351562-11.351563 6.261719 0 11.355469 5.089844 11.355469 11.351563 0 6.257812-5.09375 11.351562-11.355469 11.351562zm0 0"></path>
                      </g>
                    </svg>
                  </a>
                </div>
                <div className="border border-black p-1 rounded-md">
                  <a
                    href="https://www.tiktok.com/@torano.vn"
                    target="_blank"
                    rel="noopener"
                    title="TikTok"
                    aria-label="TikTok"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 512 512"
                    >
                      <g>
                        <g>
                          <path d="m480.32 128.39c-29.22 0-56.18-9.68-77.83-26.01-24.83-18.72-42.67-46.18-48.97-77.83-1.56-7.82-2.4-15.89-2.48-24.16h-83.47v228.08l-.1 124.93c0 33.4-21.75 61.72-51.9 71.68-8.75 2.89-18.2 4.26-28.04 3.72-12.56-.69-24.33-4.48-34.56-10.6-21.77-13.02-36.53-36.64-36.93-63.66-.63-42.23 33.51-76.66 75.71-76.66 8.33 0 16.33 1.36 23.82 3.83v-62.34-22.41c-7.9-1.17-15.94-1.78-24.07-1.78-46.19 0-89.39 19.2-120.27 53.79-23.34 26.14-37.34 59.49-39.5 94.46-2.83 45.94 13.98 89.61 46.58 121.83 4.79 4.73 9.82 9.12 15.08 13.17 27.95 21.51 62.12 33.17 98.11 33.17 8.13 0 16.17-.6 24.07-1.77 33.62-4.98 64.64-20.37 89.12-44.57 30.08-29.73 46.7-69.2 46.88-111.21l-.43-186.56c14.35 11.07 30.04 20.23 46.88 27.34 26.19 11.05 53.96 16.65 82.54 16.64v-60.61-22.49c.02.02-.22.02-.24.02z"></path>
                        </g>
                      </g>
                    </svg>
                  </a>
                </div>
                <div className="border border-black p-1 rounded-md">
                  <a
                    href="https://www.youtube.com/@torano1287"
                    target="_blank"
                    rel="noopener"
                    title="Youtube"
                    aria-label="Youtube"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 409.592 409.592"
                    >
                      <g>
                        <g>
                          <g>
                            <path d="M403.882,107.206c-2.15-17.935-19.052-35.133-36.736-37.437c-107.837-13.399-216.883-13.399-324.685,0 C24.762,72.068,7.86,89.271,5.71,107.206c-7.613,65.731-7.613,129.464,0,195.18c2.15,17.935,19.052,35.149,36.751,37.437 c107.802,13.399,216.852,13.399,324.685,0c17.684-2.284,34.586-19.502,36.736-37.437 C411.496,236.676,411.496,172.937,403.882,107.206z M170.661,273.074V136.539l102.4,68.27L170.661,273.074z"></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </a>
                </div>
              </Flex>
              <div className="mt-3 font-bold text-base">
                Phương thức thanh toán
              </div>
              <Flex wrap className="mt-3" gap={"0.5rem"}>
                {imgageUrls.map((item) => {
                  return (
                    <div className="border border-slate-300 overflow-hidden rounded-md w-14 h-12">
                      <img src={item} alt="" className="w-auto h-auto" />
                    </div>
                  );
                })}
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </Flex>
  );
};

export default Fashion;
