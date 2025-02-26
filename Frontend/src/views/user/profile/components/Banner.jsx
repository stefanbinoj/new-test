import React, { useEffect, useState } from "react";
import avatar from "assets/img/avatars/avatar11.png";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import InitialFocus from "../../default/components/CompanyModal";
import axiosWithCookie from "../../../../axios";
import { CiEdit } from "react-icons/ci";

const Banner = () => {
  const [companyName, setCompanyName] = useState("");
  const [showCompanyModal, setCompanyModal] = useState(false);

  const hanleModalClose = () => {
    setCompanyModal(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosWithCookie().get("/api/teams/company");
        if (response.data.status === "success")
          setCompanyName(response.data.companyName);
        else if (response.data.status === "error")
          setCompanyName("No Company Registered");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [showCompanyModal]);
  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img className="h-full w-full rounded-full" src={avatar} alt="" />
        </div>
      </div>
      {showCompanyModal && (
        <InitialFocus isOpen={showCompanyModal} onClose={hanleModalClose} />
      )}

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Adela Parkson
        </h4>
        <p className="text-base font-normal text-gray-600">Product Manager</p>
        <div className="flex gap-2">
          <p className="text-base font-normal text-gray-600">{companyName}</p>
          <CiEdit
            className="mt-1 cursor-pointer"
            onClick={() => {
              setCompanyModal(true);
            }}
          />
        </div>
      </div>

      {/* Post followers */}
      <div className="mb-3 mt-6 flex gap-4 md:!gap-14">
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
          <p className="text-sm font-normal text-gray-600">Posts</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            9.7K
          </p>
          <p className="text-sm font-normal text-gray-600">Followers</p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-navy-700 dark:text-white">
            434
          </p>
          <p className="text-sm font-normal text-gray-600">Following</p>
        </div>
      </div>
    </Card>
  );
};

export default Banner;
