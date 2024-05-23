import * as React from "react";
import { useParams } from "react-router-dom";

export default function ProjectEditRoute() {
	const params = useParams();

	return <div>{params.id}</div>;
}
