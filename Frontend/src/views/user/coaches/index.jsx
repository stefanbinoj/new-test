import React, { useState, useEffect } from "react";
import Card from "components/card";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CoachManagement = () => {
  const [coaches, setCoaches] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState(null);
  const [editCoach, setEditCoach] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "", 
    prompt: "",
    profileImage: "",
  });

  const fetchCoaches = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/coach`);
      setCoaches(response.data);
    } catch (error) {
      console.error("Error fetching coaches:", error);
      toast.error("Error fetching coaches");
    }
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleOpen = (coach = null) => {
    if (coach) {
      setEditCoach(coach);
      setFormData(coach);
      setImagePreview(coach.profileImage);
    } else {
      setEditCoach(null);
      setFormData({
        title: "",
        description: "",
        prompt: "",
        profileImage: "",
      });
      setImagePreview(null);
    }
    setSelectedFile(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditCoach(null);
    setImagePreview(null);
    setSelectedFile(null);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload image');
    }
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'profileImage') {
      const file = e.target.files[0];
      if (file) {
        setSelectedFile(file);
        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    if (!formData.prompt.trim()) {
      toast.error("Prompt is required");
      return;
    }

    try {
      let updatedFormData = { ...formData };

      // Upload image if a new file was selected
      if (selectedFile) {
        try {
          const url = await uploadToCloudinary(selectedFile);
          updatedFormData.profileImage = url;
        } catch (error) {
          toast.error("Failed to upload image");
          return;
        }
      }

      if (editCoach) {
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/coach/${editCoach._id}`,
          updatedFormData,
          { withCredentials: true }
        );
        toast.success("Coach updated successfully");
      } else {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/coach`, 
          updatedFormData,
          { withCredentials: true }
        );
        toast.success("Coach created successfully");
      }
      fetchCoaches();
      handleClose();
    } catch (error) {
      console.error("Error saving coach:", error);
      toast.error(error.response?.data?.message || "Error saving coach");
    }
  };

  const handleDeleteClick = (coach) => {
    setCoachToDelete(coach);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/coach/${coachToDelete._id}`,
        { withCredentials: true }
      );
      toast.success("Coach deleted successfully");
      setShowDeleteModal(false);
      setCoachToDelete(null);
      fetchCoaches();
    } catch (error) {
      console.error("Error deleting coach:", error);
      toast.error("Error deleting coach");
    }
  };

  return (
    <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="col-span-1 h-fit w-full xl:col-span-3">
        <Card extra={"w-full h-full p-4"}>
          <div className="mb-8 w-full">
            <h4 className="text-xl font-bold text-navy-700 dark:text-white">
              Coach Management
            </h4>
            <button
              onClick={() => handleOpen()}
              className="mt-4 linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
            >
              Add New Coach
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
              <div key={coach._id} className="rounded-xl bg-white p-4 shadow-md dark:bg-navy-700">
                {coach.profileImage && (
                  <div className="mb-4 h-48 w-full">
                    <img
                      src={coach.profileImage}
                      alt={coach.title}
                      className="h-full w-full rounded-xl object-contain"
                    />
                  </div>
                )}
                <h5 className="mb-2 text-lg font-bold text-navy-700 dark:text-white">
                  {coach.title}
                </h5>
                <p className="mb-4 text-base text-gray-600 dark:text-white">
                  {coach.description}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpen(coach)}
                    className="linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(coach)}
                    className="linear rounded-xl bg-red-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative mx-auto my-6 w-auto max-w-3xl">
            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none dark:bg-navy-700">
              <div className="border-b border-solid border-slate-200 p-6">
                <h3 className="text-xl font-semibold text-navy-700 dark:text-white">
                  {editCoach ? "Edit Coach" : "Add New Coach"}
                </h3>
              </div>
              <div className="relative flex-auto p-6">
                <form className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-white">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-white">
                      Description
                    </label>
                    <textarea
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-white">
                      Prompt
                    </label>
                    <textarea
                      name="prompt"
                      rows="4"
                      value={formData.prompt}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-navy-700 dark:text-white">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-navy-700 dark:text-white dark:placeholder-gray-400"
                    />
                    {imagePreview && (
                      <div className="mt-4 h-48 w-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full rounded-xl object-contain"
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="flex items-center justify-end border-t border-solid border-slate-200 p-6">
                <button
                  className="mr-3 rounded-xl bg-gray-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="linear rounded-xl bg-brand-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                  onClick={handleSubmit}
                >
                  {editCoach ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <div className="relative mx-auto my-6 w-auto max-w-sm">
            <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none dark:bg-navy-700">
              <div className="p-6">
                <h3 className="mb-4 text-xl font-semibold text-navy-700 dark:text-white">
                  Confirm Delete
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Are you sure you want to delete {coachToDelete?.title}? This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-end border-t border-solid border-slate-200 p-6">
                <button
                  className="mr-3 rounded-xl bg-gray-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-gray-600 active:bg-gray-700"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCoachToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="linear rounded-xl bg-red-500 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700"
                  onClick={handleDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachManagement;
