import type * as React from "react";

import styles from "./layout.module.css";

export function LayoutHeader(props: React.PropsWithChildren) {
	return <header className={styles.header}>{props.children}</header>;
}
export function LayoutContent(props: React.PropsWithChildren) {
	return <main className={styles.main}>{props.children}</main>;
}
