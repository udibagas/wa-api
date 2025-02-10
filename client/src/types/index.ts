import { FormInstance } from "antd";

export type AppType = {
  id: number;
  name: string;
  description: string;
  token?: string;
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
  dateOfBirth: string | null;
  age: number | null;
};

export type UserType = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
};

export type TemplateType = {
  id: number;
  name: string;
  body: string;
  components: object;
  appId: number;
  App: AppType;
};

export type MessageType = {
  MessageTemplateId: number;
  groups: number[];
  recipients: number[];
};

export type FileType = {
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  url: string;
  size: number;
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

export type ScheduledMessageType = {
  id: number;
  name: string;
  UserId: number;
  user?: UserType;
  time: string;
  message: string;
  file: FileType;
  recipients: number[];
  recurring: boolean;
  createdAt: string;
  updatedAt: string;
};

export type MasterData = {
  templates: TemplateType[];
  groups: GroupType[];
};

export type PaginatedData<T> = {
  from: number;
  to: number;
  page: number;
  rows: T[];
  total: number;
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
