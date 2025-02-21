import { Modal, ModalOverlay, ModalContent, ModalBody } from "@chakra-ui/modal";
import { useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import axiosWithHeaders from "../../../../axios";

const ModalExample = ({ isOpen, onClose }) => {
  console.log("backend", process.env.REACT_APP_API_URL);

  const [companyName, setCompanyName] = useState("");
  const handleCompanyNameSubmit = async () => {
    try {
      onClose();
      console.log(12);
      const response = await axiosWithHeaders().post("/api/teams/add-team", {
        team_name: companyName,
      });
      console.log("Team added successfully:", response.data);
    } catch (error) {
      console.error("There was an error adding the team:", error);
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} className="!z-[1010]">
        <ModalOverlay className="bg-[#000] !opacity-30" />
        <ModalContent className="!z-[1002] !m-auto !w-max min-w-[350px] !max-w-[85%] md:top-[30vh]">
          <ModalBody>
            <div className="!z-[1004] flex max-w-[450px] flex-col bg-white px-[30px] pb-[40px] pt-[35px] ">
              <div className="flex justify-between">
                <h1 className="mb-[20px] text-2xl font-bold">Company Title</h1>
                <IoCloseCircleSharp
                  onClick={onClose}
                  className="mr-[-10px] mt-[-20px] cursor-pointer "
                />
              </div>
              <input
                className="mb-[20px] border-2 border-brand-400 px-2 py-1"
                type="text"
                value={companyName}
                placeholder=" xyz"
                onChange={(e) => setCompanyName(e.target.value)}
              ></input>
              <div className="flex gap-2">
                <button
                  onClick={handleCompanyNameSubmit}
                  className="linear rounded-xl bg-brand-500 px-5 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
                >
                  Submit
                </button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ModalExample;
