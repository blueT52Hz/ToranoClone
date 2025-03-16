import { Button, Flex, Form, Input, notification } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { LucideMail } from "lucide-react";
import React, { useState } from "react";

const Subcribe = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [registeredEmails, setRegisteredEmails] = useState<Set<string>>(
    new Set()
  );

  const onFinish = (values: { email: string }) => {
    const { email } = values;

    // Kiểm tra email đã đăng ký trước đó
    if (registeredEmails.has(email)) {
      notification.error({
        message: "Đăng ký thất bại",
        description: "Email này đã được đăng ký trước đó!",
        placement: "bottomRight",
        showProgress: true,
      });
      return;
    }

    setLoading(true);

    // Giả lập API call (2s)
    setTimeout(() => {
      setRegisteredEmails(new Set(registeredEmails).add(email));

      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn đã đăng ký nhận tin thành công!",
        placement: "bottomRight",
        showProgress: true,
      });

      setLoading(false);
    }, 2000);
  };

  return (
    <Flex
      vertical
      align="center"
      className="px-3 pt-3 pb-5 w-full min1200:pt-[75px] min1200:pr-[15px] min1200:pb-[52px] min1200:pl-[35px] min1200:border-b min1200:border-[#dedede]"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-base text-[#d60000] py-4 font-bold">
            Đăng ký nhận tin
          </h2>
          <div className="mt-3 w-full">
            <p className="mb-4 text-sm text-center min850:text-left">
              Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và
              thông tin giảm giá khác.
            </p>

            <Form
              form={form}
              onFinish={onFinish}
              className="bg-white rounded-md"
            >
              <Form.Item
                name="email"
                validateTrigger={["onSubmit", "onBlur"]}
                rules={[
                  {
                    required: true,
                    message: (
                      <div className="pl-10 text-xs min850:pl-14">
                        Vui lòng nhập email
                      </div>
                    ),
                  },
                  {
                    type: "email",
                    message: (
                      <div className="pl-10 text-xs min850:pl-14">
                        Email không hợp lệ!
                      </div>
                    ),
                  },
                ]}
              >
                <Flex align="center" gap={"0.5rem"}>
                  <LucideMail size={"1.5rem"} className="ml-4" />
                  <div className="flex-1">
                    <Input
                      size="small"
                      variant="borderless"
                      placeholder="Nhập email của bạn"
                      className="bg-white"
                    />
                  </div>
                  <Button
                    type="primary"
                    color="danger"
                    variant="link"
                    htmlType="submit"
                    loading={loading}
                  >
                    <div className="text-[#ca0000] font-bold">ĐĂNG KÝ</div>
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
            <div className="pt-3">
              <a
                href="http://online.gov.vn/Home/WebDetails/47936"
                target="_blank"
              >
                <img
                  src="https://theme.hstatic.net/200000690725/1001078549/14/footer_logobct_img.png?v=647"
                  alt=""
                  className="mx-auto max-w-[150px]"
                />
              </a>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </Flex>
  );
};

export default Subcribe;
