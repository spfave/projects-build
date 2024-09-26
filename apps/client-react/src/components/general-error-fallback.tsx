import { getErrorMessage } from "@projectsbuild/library/utils";

import styles from "./general-error-fallback.module.css";

type GeneralErrorFallbackProps = { error: unknown };
export default function GeneralErrorFallback(props: GeneralErrorFallbackProps) {
	const { error } = props;

	const message =
		error instanceof Error ? `${error.name}: ${error.message}` : getErrorMessage(error);

	return (
		<div className={styles.generalErrorFallback}>
			<p>An Error Occurred</p>
			<p>
				<samp>{message}</samp>
			</p>
		</div>
	);
}
