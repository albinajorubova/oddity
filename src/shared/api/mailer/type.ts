export type ResponseData =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
    };
