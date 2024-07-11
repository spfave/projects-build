declare const brand: unique symbol;
export type Brand<T, TBrand> = T & { [brand]: TBrand };

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
