import { FormInstance } from "antd";

export type AppType = {
  id: number;
  name: string;
  description: string;
};

export type GroupType = {
  id: number;
  name: string;
  description: string;
};

export type RecipientType = {
  id: number;
  name: string;
  phoneNumber: string;
  groups: GroupType[];
};

export type UserType = {
  id: number;
  name: string;
  email: string;
};

export type TemplateType = {
  id: number;
  name: string;
  body: string;
  components: object;
  appId: number;
};

export type StatusType = "success" | "error" | "warning" | "info" | "failed";

export type LogType = {
  id: number;
  createdAt: Date;
  AppId: number;
  RecipientId: number;
  MessageTemplateId: number;
  response: object;
  status: StatusType;
  messageTemplate: { name: string };
  app: { name: string };
  recipient: { name: string; phoneNumber: string };
};

export type AxiosResponseType<T> = {
  data: T;
};

export type AxiosErrorResponseType = {
  message: string;
  errors?: Record<string, string[]>;
};

export type RecursivePartial<T> = NonNullable<T> extends object
  ? {
      [P in keyof T]?: NonNullable<T[P]> extends (infer U)[]
        ? RecursivePartial<U>[]
        : NonNullable<T[P]> extends object
        ? RecursivePartial<T[P]>
        : T[P];
    }
  : T;

export type CustomFormProps<T> = {
  visible: boolean;
  isEditing: boolean;
  onCancel: () => void;
  onOk: (values: T) => void;
  errors: { [key: string]: string[] };
  form: FormInstance<T>;
};
