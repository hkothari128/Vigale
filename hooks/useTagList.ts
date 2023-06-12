import useSwr from "swr";
import fetcher from "@/utils/fetcher";

const useTags = () => {
	const { data, error, isLoading } = useSwr("/api/tags", fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});
	return {
		data,
		error,
		isLoading,
	};
};

export default useTags;
