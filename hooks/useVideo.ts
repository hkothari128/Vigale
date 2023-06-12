import useSwr from "swr";
import fetcher from "@/utils/fetcher";

const useVideo = (id?: string) => {
	const { data, error, isLoading } = useSwr(
		id ? `/api/videos/${id}` : null,
		fetcher,
		{
			revalidateIfStale: false,
			revalidateOnFocus: false,
			revalidateOnReconnect: false,
		}
	);
	return {
		data,
		error,
		isLoading,
	};
};

export default useVideo;
