import useSwr from "swr";

import fetcher from "@/utils/fetcher";

const useCurrentUser = () => {
	const { data, error, isLoading, mutate } = useSwr("/api/currUser", fetcher);
	return {
		data,
		error,
		isLoading,
		mutate,
	};
};

export default useCurrentUser;
