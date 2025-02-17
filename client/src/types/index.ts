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

export type ContactType = {
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
  status: "draft" | "submitted" | "approved";
};

export type MessageType = {
  MessageTemplateId: number;
  groups: number[];
  contacts: number[];
};

export type Message = {
  id?: number;
  from?: string;
  to: string;
  message: string;
  type: string;
  status?: string;
  createdAt?: string;
};

export type FileType = {
  filename: string;
  mimetype: string;
  originalname: string;
  path: string;
  url: string;
  size: number;
};

export type FileTypes =
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "txt"
  | "zip"
  | "rar"
  | "csv"
  | "mp3"
  | "mp4"
  | "jpg"
  | "jpeg"
  | "png"
  | "gif";

export type StatusType =
  | "success"
  | "error"
  | "warning"
  | "info"
  | "failed"
  | "draft"
  | "submitted"
  | "in-review"
  | "rejected"
  | "approved";

export type LogType = {
  id: number;
  createdAt: Date;
  AppId: number;
  ContactId: number;
  MessageTemplateId: number;
  response: object;
  status: StatusType;
  messageTemplate: { name: string };
  app: { name: string };
  contact: { name: string; phoneNumber: string };
};

export type ScheduledMessageType = {
  id: number;
  name: string;
  UserId: number;
  user?: UserType;
  time: string;
  message: string;
  file: FileType;
  contacts: number[];
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
