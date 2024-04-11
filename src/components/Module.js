import React, { useEffect, useState } from 'react';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase'; // Adjust this path based on your actual configuration
import { useAuth } from './contexts/AuthProvider'; // Adjust this path if necessary

const Module = () => {
  const { currentUser,triggerFetch } = useAuth();

  const [files, setFiles] = useState([]);
  console.log('Current User UID:', currentUser?.uid);

  useEffect(() => {
    const fetchFiles = async () => {
      const filesRef = ref(storage, `files/${currentUser.uid}/`);
      console.log(`Fetching files from: files/${currentUser.uid}/`); // Debugging path
      try {
        const response = await listAll(filesRef);
        console.log('Response:', response); // Check the response
        const fileUrls = await Promise.all(
          response.items.map((item) =>
            getDownloadURL(item).then((url) => ({
              name: item.name,
              url: url,
            }))
          )
        );
        console.log('File URLs:', fileUrls); // Check the URLs
        setFiles(fileUrls);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
  
    fetchFiles();
  }, [currentUser.uid,triggerFetch]);
  
  return (
    <div className='w-full md:w-10/12'>
      <div className="suggested m-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-semibold">Files</h3>
          <div className="button bg-blue-500 text-white py-1 px-3 rounded cursor-pointer">Create Files</div>
        </div>
        <hr className="mb-2" />
        <div className="flex flex-wrap">
          {files.map((file, index) => (
            <div key={index} className="w-full max-w-56 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2">
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="block">
                <img src={file.url} alt={file.name} className="w-full h-48 object-cover rounded-t-lg" />
              </a>
              <div className="px-4 py-2">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="block">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white hover:text-blue-600">{file.name}</h5>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr className="my-4 border-t-2 border-gray-300"/>
      {/* Folder section if needed */}
    </div>
  );
};

export default Module;
