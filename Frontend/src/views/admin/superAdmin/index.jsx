import React, { useState, useEffect } from 'react';
import Card from "components/card";

function SuperAdmin() {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage, setClientsPerPage] = useState(10);
  const [containerHeight, setContainerHeight] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  useEffect(() => {
    // Calculate clients per page based on container height
    const calculateClientsPerPage = () => {
      const tableHeaderHeight = 60; // Height of table header
      const tableRowHeight = 53; // Height of each row
      const paginationHeight = 48; // Height of pagination
      const padding = 32; // Top/bottom padding
      const extraPadding = 100; // Additional padding to prevent scroll
      
      // Get viewport height
      const viewportHeight = window.innerHeight;
      
      // Calculate container height as 80vh minus padding
      const containerHeight = (viewportHeight * 0.8) - padding - extraPadding;
      setContainerHeight(containerHeight);

      // Calculate available height for rows
      const availableHeight = containerHeight - (tableHeaderHeight + paginationHeight);
      const calculatedClientsPerPage = Math.floor(availableHeight / tableRowHeight);
      
      return Math.max(5, calculatedClientsPerPage); // Minimum 5 clients
    };

    const handleResize = () => {
      setClientsPerPage(calculateClientsPerPage());
    };

    // Initial calculation
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/clients`, {
          credentials: 'include'
        });
        const data = await response.json();
        setClients(data.clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    fetchClients();
  }, []);

  const handleDeleteClick = (client) => {
    setClientToDelete(client);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/delete/${clientToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        setClients(clients.filter(client => client._id !== clientToDelete._id));
      }
    } catch (error) {
      console.error('Error deleting client:', error);
    }
    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  // Get current clients
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-3 grid h-[80vh]">
      <div className="w-full px-[26px] pb-[26px] pt-[18px] md:px-[42px] max-h-[80vh]">
        <Card extra={"w-full h-full sm:overflow-hidden px-6"}>
          <header className="relative flex items-center justify-between pt-4">
            <div className="text-xl font-bold text-navy-700 dark:text-white">
              Clients List
            </div>
          </header>

          <div className="mt-8 overflow-hidden relative h-full table-container flex flex-col justify-between">
            <table className="w-full">
              <thead>
                <tr className="!border-px !border-gray-400">
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                    <p className="text-sm font-bold text-gray-600">NAME</p>
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                    <p className="text-sm font-bold text-gray-600">EMAIL</p>
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                    <p className="text-sm font-bold text-gray-600">ROLE</p>
                  </th>
                  <th className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start">
                    <p className="text-sm font-bold text-gray-600">ACTIONS</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentClients.map((client) => (
                  <tr key={client._id}>
                    <td className="min-w-[150px] border-b-[1px] border-gray-200 py-4 text-sm text-navy-700 dark:text-white">
                      {client.name}
                    </td>
                    <td className="min-w-[150px] border-b-[1px] border-gray-200 py-4 text-sm text-navy-700 dark:text-white">
                      {client.email}
                    </td>
                    <td className="min-w-[150px] border-b-[1px] border-gray-200 py-4 text-sm text-navy-700 dark:text-white">
                      {client.role}
                    </td>
                    <td className="min-w-[150px] border-b-[1px] border-gray-200 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteClick(client)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className=" my-1 flex justify-center">
              {clients.length > clientsPerPage && (
                <div className="flex space-x-2 pb-4">
                  {Array.from({ length: Math.ceil(clients.length / clientsPerPage) }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => paginate(index + 1)}
                      className={`px-3 py-1 rounded ${
                        currentPage === index + 1
                          ? 'bg-navy-700 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete {clientToDelete?.name}?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuperAdmin;