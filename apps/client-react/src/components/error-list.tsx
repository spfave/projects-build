import For from "./for";

import styles from "./error-list.module.css";

type ErrorListProps = { id?: string; errors?: string[] };
export default function ErrorList(props: ErrorListProps) {
	if (!props.errors || props.errors.length === 0) return null;

	return (
		<ul id={props.id} className={styles.errorList}>
			<For array={props.errors} getKey={(error) => error}>
				{(error) => <li>{error}</li>}
			</For>
		</ul>
	);
}
