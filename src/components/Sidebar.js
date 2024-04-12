import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase";
import { useAuth } from "./contexts/AuthProvider";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = () => {
  const { currentUser } = useAuth();
  const {setTriggerFetch } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSecondaryPopupOpen, setIsSecondaryPopupOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sidebarRef = useRef(null);
  const popupRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const openFileUpload = () => {
    setSelectedOption("file");
    setIsMenuOpen(false);
    setIsSecondaryPopupOpen(true);
  };

  const openFolderUpload = () => {
    setSelectedOption("folder");
    setIsMenuOpen(false);
    setIsSecondaryPopupOpen(true);
  };

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsSecondaryPopupOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleChange(e) {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }


  function handleClick() {
    if (!file) return;
    console.log(file.type)
    const fileRef = ref(storage, `/files/${currentUser.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        setLoading(true);
      },
      (error) => {
        // console.error("Error uploading file:", error);
        setLoading(false);
        setError(error.message);
      },
      () => {
        // console.log("File successfully uploaded!");
        setLoading(false);
        setFile(null);
        setIsSecondaryPopupOpen(false)
        setTriggerFetch(prev => !prev);
        toast.success('🦄 Uploaded!', {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    );
  }

  return (
    <div
      ref={sidebarRef}
      className="w-1/6 flex-grow border-r border-gray-300 relative"
    >
      <ToastContainer/>
      <button
        onClick={toggleMenu}
        className="bg-blue-500 text-white px-4 py-2 rounded-full p-1 m-3 relative z-20"
      >
        {isMenuOpen ? "Click to Close" : "Click to Uplaod"}
      </button>
      <hr className="my-4 border-t-2 border-gray-300"></hr>
      <Link to="">
        <button className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-200 w-full text-left border-gray-300">
          File
        </button>
      </Link>
      <hr className="my-4 border-t-2 border-gray-300"></hr>
      {/* <Link to="">
        <button className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-200 w-full text-left border-gray-300">
          Folder
        </button>
      </Link>
      <hr className="my-4 border-t-2 border-gray-300"></hr> */}
      {isMenuOpen && (
        <div className="m-2 absolute left-0 top-16 mt-2 w-48 bg-white rounded-lg shadow-md z-10">
          <button
            onClick={openFileUpload}
            className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-200 w-full text-left border-r border-gray-300"
          >
            Upload File
          </button>
          <button
            onClick={openFolderUpload}
            className="block px-4 py-2 text-gray-800 rounded-lg hover:bg-gray-200 w-full text-left border-r border-gray-300"
          >
            Upload Folder
          </button>
        </div>
      )}

      {/* Secondary Popup */}
      {isSecondaryPopupOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-10">
          <div ref={popupRef} className="bg-white p-8 rounded-lg shadow-lg">
            {selectedOption === "file" && (
              <div>
                <input
                  type="file"
                  onChange={handleChange}
                  accept=".pdf,.doc,.docx,.txt"
                  className="border p-2 rounded mb-4"
                />
                <div className="flex">
                  <button
                    disabled={loading || !file}
                    onClick={handleClick}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                  >
                    {loading ? "Uploading" : "Submit"}
                  </button>
                  <button
                    onClick={closeMenus}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-500"
                  >
                    X
                  </button>
                </div>
              </div>
            )}
            {selectedOption === "folder" && (
              <div>
                <input
                  type="text"
                  placeholder="Folder name"
                  className="border p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex">
                  <button
                    onClick={closeMenus}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                  >
                    Submit
                  </button>
                  <button
                    onClick={closeMenus}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-500"
                  >
                    X
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
