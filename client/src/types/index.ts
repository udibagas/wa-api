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
