import styles from "./error-list.module.css";

type ErrorListProps = { id?: string; errors?: string[] };
export function ErrorList(props: ErrorListProps) {
	if (!props.errors) return null;

	return (
		<ul id={props.id} className={styles.errorList}>
			{props.errors.map((error) => (
				<li key={error}>{error}</li>
			))}
		</ul>
	);
}
