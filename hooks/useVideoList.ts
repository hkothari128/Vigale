import useSwr from "swr";
import fetcher from "@/utils/fetcher";

const useVideos = () => {
	const { data, error, isLoading, mutate } = useSwr("/api/videos", fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
	});
	return {
		data,
		error,
		isLoading,
		mutate,
	};
};

export default useVideos;
