import { useQuery } from "@tanstack/react-query";

function useFetch<T>(url: string) {
  return useQuery<T, Error>({
    queryKey: [url],
    queryFn: async () => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
  });
}

export default useFetch;
