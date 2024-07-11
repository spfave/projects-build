declare const brand: unique symbol;
export type Brand<T, TBrand> = T & { [brand]: TBrand };

export type Maybe<T> = T | undefined | null;

export type Prettify<T> = { [K in keyof T]: T[K] } & {};
