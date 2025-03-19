import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Client } from "../.././app/admin/clients/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function useClient() {
  const [client, setClient] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchClient = async (isRefreshing = false) => {
    try {
      setLoading(!isRefreshing);
      if (isRefreshing) setRefreshing(true);

      let url = `${API_URL}/client?page=${page}&limit=10`;
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await axios.get(url);
      if (response.data && response.data.items) {
        setClient(response.data.items);
        setTotalPages(response.data.total_pages || 1);
      } else {
        setClient([]);
        setTotalPages(1);
        console.warn("Formato de resposta inesperado:", response.data);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Erro ao carregar clientes. Tente novamente.");
      setClient([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(
    () => {
      fetchClient();
    },
    [page]
  );

  useEffect(
    () => {
      const timer = setTimeout(() => {
        if (searchQuery) {
          if (page === 1) {
            fetchClient();
          } else {
            setPage(1);
          }
        }
      }, 500);
      return () => clearTimeout(timer);
    },
    [searchQuery]
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return {
    client,
    loading,
    refreshing,
    searchQuery,
    page,
    totalPages,
    fetchClient,
    setSearchQuery,
    setPage,
    handlePageChange
  };
}
