import { Button, Flex, Form, Input, notification } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import { LucideMail } from "lucide-react";
import React, { useState } from "react";

const Subcribe = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [registeredEmails, setRegisteredEmails] = useState<Set<string>>(
    new Set(),
  );

  const sendWebhookNotification = async (email: string) => {
    try {
      const response = await fetch(
        "https://workflow.proptit.com/webhook/new-subscriber",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to send webhook notification");
      }
    } catch (error) {
      console.error("Error sending webhook notification:", error);
    }
  };

  const onFinish = async (values: { email: string }) => {
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

    try {
      // Giả lập API call (2s)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setRegisteredEmails(new Set(registeredEmails).add(email));

      // Gửi webhook notification
      await sendWebhookNotification(email);

      notification.success({
        message: "Đăng ký thành công",
        description: "Bạn đã đăng ký nhận tin thành công!",
        placement: "bottomRight",
        showProgress: true,
      });
    } catch (error) {
      notification.error({
        message: "Đăng ký thất bại",
        description: "Có lỗi xảy ra, vui lòng thử lại sau!",
        placement: "bottomRight",
        showProgress: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      vertical
      align="center"
      className="w-full px-3 pb-5 pt-3 min1200:border-b min1200:border-[#dedede] min1200:pb-[52px] min1200:pl-[35px] min1200:pr-[15px] min1200:pt-[75px]"
    >
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="py-4 text-base font-bold text-[#d60000]">
            Đăng ký nhận tin
          </h2>
          <div className="mt-3 w-full">
            <p className="mb-4 text-center text-sm min850:text-left">
              Để cập nhật những sản phẩm mới, nhận thông tin ưu đãi đặc biệt và
              thông tin giảm giá khác.
            </p>

            <Form
              form={form}
              onFinish={onFinish}
              className="rounded-md bg-white"
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
                    <div className="font-bold text-[#ca0000]">ĐĂNG KÝ</div>
                  </Button>
                </Flex>
              </Form.Item>
            </Form>
            <div className="pt-3">
              <a
                href="http://online.gov.vn/Home/WebDetails/47936"
                target="_blank"
                rel="noopener"
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
