import type { NextApiRequest, NextApiResponse } from "next";
import z, { ZodError } from "zod";

import type { ResponseData } from "./type";

// import you schema
export const contactFormSchema = z.object({
  name: z.string().min(1),
});

import { sendEmail } from "./utils/sendEmail";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
): Promise<void> {
  if (req.method !== "POST") {
    res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
    return;
  }

  try {
    const validatedData = contactFormSchema.parse(req.body);

    await sendEmail(validatedData);

    res.status(200).json({
      success: true,
      message: "Заявка успешно отправлена",
    });
  } catch (error) {
    console.error("Ошибка отправки формы:", error);

    // Если это ошибка валидации Zod
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: "Неверные данные формы",
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: "Ошибка при отправке заявки. Попробуйте позже.",
    });
  }
}
